import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const [error, setError] = useState(null);
	const [referenceCode, setReferenceCode] = useState("");
	const [viewport, setViewport] = useState({ width: 0, height: 0 });
	const { clearCart } = useCartStore();

	useEffect(() => {
		if (typeof window === "undefined") return;

		const updateViewport = () => {
			setViewport({ width: window.innerWidth, height: window.innerHeight });
		};

		updateViewport();
		window.addEventListener("resize", updateViewport);

		return () => {
			window.removeEventListener("resize", updateViewport);
		};
	}, []);

	useEffect(() => {
		const handleCheckoutSuccess = async (reference) => {
			try {
				await axios.post("/payments/checkout-success", { reference });
				clearCart();
			} catch (error) {
				const message =
					error?.response?.data?.error || "We couldn't verify your payment. Please contact support.";
				setError(message);
			} finally {
				setIsProcessing(false);
			}
		};

		if (typeof window === "undefined") {
			setIsProcessing(false);
			setError("Unable to verify payment in this environment.");
			return;
		}

		const searchParams = new URLSearchParams(window.location.search);
		const reference = searchParams.get("reference");

		if (reference) {
			setReferenceCode(reference);
			handleCheckoutSuccess(reference);
		} else {
			setIsProcessing(false);
			setError("No payment reference found in the confirmation link.");
		}
	}, [clearCart]);

	const referenceDisplay = useMemo(() => {
		if (!referenceCode) return "Pending";
		return `#${referenceCode.slice(-10).toUpperCase()}`;
	}, [referenceCode]);

	const estimatedDelivery = useMemo(() => {
		const deliveryDate = new Date();
		deliveryDate.setDate(deliveryDate.getDate() + 5);
		return deliveryDate.toLocaleDateString("en-NG", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	}, []);

	if (isProcessing) {
		return (
			<div className="min-h-screen bg-[#f9f7f4] px-4 py-20 text-gray-900">
				<div className="mx-auto max-w-lg">
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="space-y-6 rounded-[32px] border border-black/10 bg-white/90 px-8 py-12 text-center shadow-[0_24px_65px_rgba(15,23,42,0.08)]"
					>
						<span className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Finalizing your order</span>
						<h1 className="text-3xl font-semibold">Hold tight while we confirm your payment.</h1>
						<p className="text-sm text-gray-600">
							We’re talking to our payment partner to validate your checkout. This usually takes just a few
								moments.
						</p>
						<div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-black/10 border-t-black" />
					</motion.div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-[#f9f7f4] px-4 py-20 text-gray-900">
				<div className="mx-auto max-w-lg">
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="space-y-6 rounded-[32px] border border-red-200 bg-white px-8 py-12 text-center shadow-[0_18px_48px_rgba(220,38,38,0.1)]"
					>
						<span className="text-xs font-semibold uppercase tracking-[0.35em] text-red-500">Payment issue</span>
						<h1 className="text-3xl font-semibold text-gray-900">We couldn’t verify this payment.</h1>
						<p className="text-sm text-gray-600">{error}</p>
						<Link
							to="/cart"
							className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-gray-900"
						>
							Return to checkout
							<ArrowRight size={16} />
						</Link>
					</motion.div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen bg-[#f9f7f4] px-4 py-20 text-gray-900">
			{viewport.width > 0 && (
				<Confetti
					width={viewport.width}
					height={viewport.height}
					gravity={0.1}
					style={{ zIndex: 20 }}
					numberOfPieces={600}
					recycle={false}
				/>
			)}
			<div className="relative mx-auto max-w-3xl">
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45 }}
					className="relative overflow-hidden rounded-[36px] border border-black/10 bg-white/95 p-10 shadow-[0_32px_80px_rgba(15,23,42,0.12)]"
				>
					<div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-black/5" />
					<div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/5" />
					<div className="relative space-y-10">
						<div className="flex flex-col items-center gap-4 text-center">
							<span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-lg">
								<CheckCircle className="h-8 w-8" />
							</span>
							<span className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
								Checkout complete
							</span>
							<h1 className="text-4xl font-semibold">Your order is confirmed.</h1>
							<p className="max-w-xl text-sm text-gray-600">
								We’ve emailed your receipt and will send tracking details as soon as your pieces leave our studio.
							</p>
						</div>

						<div className="grid gap-6 rounded-[28px] border border-black/10 bg-[#f9f7f4] p-6 sm:grid-cols-2">
							<div className="space-y-2">
								<p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Reference</p>
								<p className="text-lg font-semibold text-gray-900">{referenceDisplay}</p>
							</div>
							<div className="space-y-2">
								<p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Estimated delivery</p>
								<p className="text-lg font-semibold text-gray-900">{estimatedDelivery}</p>
							</div>
							<div className="sm:col-span-2 space-y-2">
								<p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Next steps</p>
								<p className="text-sm text-gray-600">
									Our concierge team is preparing your items for dispatch. You’ll receive shipping updates via email
									and SMS.
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<Link
								to="/"
								className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-gray-900"
							>
								Continue shopping
								<ArrowRight size={16} />
							</Link>
							<button
								type="button"
								className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-7 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-gray-700 transition hover:border-black/30 hover:text-gray-900"
							>
								<HandHeart size={16} />
								Thank you for supporting slow fashion
							</button>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default PurchaseSuccessPage;
