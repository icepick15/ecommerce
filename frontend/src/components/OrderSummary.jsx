import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const currencyOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
	const [isProcessing, setIsProcessing] = useState(false);

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toLocaleString("en-NG", currencyOptions);
	const formattedTotal = total.toLocaleString("en-NG", currencyOptions);
	const formattedSavings = savings.toLocaleString("en-NG", currencyOptions);

	const handlePayment = async () => {
		if (cart.length === 0) {
			toast.error("Your cart is empty.");
			return;
		}

		setIsProcessing(true);
		try {
			const res = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
			});

			const { authorization_url } = res.data;
			if (!authorization_url) {
				toast.error("Checkout session is unavailable right now.");
				return;
			}

			toast.success("Redirecting to secure checkout...");
			window.location.href = authorization_url;
		} catch (error) {
			console.error("Checkout error:", error);
			const message = error?.response?.data?.error || "Unable to start checkout. Please try again.";
			toast.error(message);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<motion.div
			className="space-y-5 rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)]"
			initial={{ opacity: 0, y: 18 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45 }}
		>
			<div className="flex items-center justify-between">
				<p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Order summary</p>
				<span className="text-sm font-medium text-gray-400">Inclusive of VAT</span>
			</div>

			<div className="space-y-4">
				<div className="space-y-3 text-sm text-gray-600">
					<dl className="flex items-center justify-between">
						<dt>Subtotal</dt>
						<dd className="font-semibold text-gray-900">₦{formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className="flex items-center justify-between text-emerald-600">
							<dt>Savings</dt>
							<dd>-₦{formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className="flex items-center justify-between text-emerald-600">
							<dt>Coupon ({coupon.code})</dt>
							<dd>-{coupon.discountPercentage}%</dd>
						</dl>
					)}
				</div>

				<div className="flex items-center justify-between border-t border-black/10 pt-4">
					<dt className="text-base font-semibold text-gray-900">Total due</dt>
					<dd className="text-base font-semibold text-gray-900">₦{formattedTotal}</dd>
				</div>
			</div>

			<motion.button
				className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition ${
					isProcessing ? "bg-gray-500" : "bg-black hover:bg-gray-900"
				}`}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.97 }}
				disabled={isProcessing}
				onClick={handlePayment}
			>
				{isProcessing ? "Processing..." : "Proceed to checkout"}
			</motion.button>

			<div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
				<span>Or</span>
				<Link to="/collection" className="inline-flex items-center gap-2 text-gray-900 transition hover:text-black">
					Continue shopping
					<MoveRight size={16} />
				</Link>
			</div>
		</motion.div>
	);
};
export default OrderSummary;
