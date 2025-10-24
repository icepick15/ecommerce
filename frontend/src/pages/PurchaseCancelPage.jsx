import { XCircle, ArrowLeft, LifeBuoy } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
	return (
		<div className="min-h-screen bg-[#f9f7f4] px-4 py-20 text-gray-900">
			<div className="mx-auto max-w-2xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45 }}
					className="relative overflow-hidden rounded-[36px] border border-black/10 bg-white/95 p-10 shadow-[0_28px_70px_rgba(15,23,42,0.1)]"
				>
					<div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-100/60" />
					<div className="absolute -bottom-24 -left-14 h-56 w-56 rounded-full bg-red-100/50" />
					<div className="relative space-y-8">
						<div className="flex flex-col items-center gap-4 text-center">
							<span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
								<XCircle className="h-8 w-8" />
							</span>
							<span className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400">
								Checkout interrupted
							</span>
							<h1 className="text-4xl font-semibold text-gray-900">Your order was cancelled.</h1>
							<p className="max-w-xl text-sm text-gray-600">
								No charges were made. If you abandoned checkout by mistake, you can pick up where you left off
								from your bag.
							</p>
						</div>

						<div className="grid gap-5 rounded-[28px] border border-red-100 bg-red-50/60 p-6 sm:grid-cols-2">
							<div className="space-y-2">
								<p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Next steps</p>
								<p className="text-sm text-gray-600">
									Review your cart or continue browsing to curate the perfect looks.
								</p>
							</div>
							<div className="space-y-2">
								<p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Need assistance?</p>
								<p className="text-sm text-gray-600">
									Reach out to <a className="font-semibold text-gray-900 underline decoration-dotted underline-offset-4" href="mailto:care@quietluxury.com">care@quietluxury.com</a> and our concierge team will help you complete your purchase.
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<Link
								to="/cart"
								className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-gray-900"
							>
								Return to cart
								<ArrowLeft size={16} />
							</Link>
							<Link
								to="/collection"
								className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-7 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-gray-700 transition hover:border-black/30 hover:text-gray-900"
							>
								Explore more pieces
							</Link>
							<a
								href="mailto:care@quietluxury.com"
								className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-red-500 transition hover:text-red-600"
							>
								<LifeBuoy size={16} />
								Contact support
							</a>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default PurchaseCancelPage;
