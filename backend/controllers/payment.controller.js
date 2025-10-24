import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { paystack } from "../lib/paystack.js";
import axios from "axios";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!paystack.secretKey) {
			return res.status(500).json({
				error: "Paystack secret key is not configured. Please set PAYSTACK_SECRET_KEY in backend/.env and restart the server.",
			});
		}

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		// Calculate total in kobo (Paystack uses kobo - smallest unit of Naira)
		products.forEach((product) => {
			const amount = Math.round(product.price * 100); // convert to kobo
			totalAmount += amount * product.quantity;
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		// Initialize Paystack transaction
		const paystackData = {
			email: req.user.email,
			amount: totalAmount, // amount in kobo
			currency: "NGN",
			callback_url: `${process.env.CLIENT_URL}/purchase-success`,
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
				cancel_action: `${process.env.CLIENT_URL}/purchase-cancel`,
			},
		};

		const response = await axios.post(
			`${paystack.baseURL}/transaction/initialize`,
			paystackData,
			{ headers: paystack.headers }
		);

		if (totalAmount >= 2000000) { // ₦20,000 in kobo
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({ 
			authorization_url: response.data.data.authorization_url,
			access_code: response.data.data.access_code,
			reference: response.data.data.reference,
			totalAmount: totalAmount / 100 
		});
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { reference } = req.body;
		
		// Verify transaction with Paystack
		const response = await axios.get(
			`${paystack.baseURL}/transaction/verify/${reference}`,
			{ headers: paystack.headers }
		);

		const transaction = response.data.data;

		if (transaction.status === "success") {
			if (transaction.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: transaction.metadata.couponCode,
						userId: transaction.metadata.userId,
					},
					{
						isActive: false,
					}
				);
			}

			// create a new Order
			const products = JSON.parse(transaction.metadata.products);
			const newOrder = new Order({
				user: transaction.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: transaction.amount / 100, // convert from kobo to naira
				stripeSessionId: reference, // keeping field name for compatibility, but storing reference
			});

			await newOrder.save();

			// Clear the user's cart after a successful checkout
			await User.findByIdAndUpdate(transaction.metadata.userId, {
				$set: { cartItems: [] },
			});

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		} else {
			res.status(400).json({ message: "Payment not successful" });
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

// Paystack doesn't need separate coupon creation - we handle discounts in calculation

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}
