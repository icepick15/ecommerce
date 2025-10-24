import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";

const CartPage = () => {
	const { cart } = useCartStore();
	const hasItems = cart.length > 0;

	return (
		<div className="min-h-screen bg-[#f9f7f4] py-12 text-gray-900">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<header className="flex flex-col gap-6 border-b border-black/10 pb-10">
					<nav className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
						<Link to="/" className="transition hover:text-gray-900">
							Home
						</Link>
						<span className="text-gray-300">/</span>
						<span className="text-gray-900">Cart</span>
					</nav>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Your cart, curated and ready.</h1>
							<p className="mt-3 max-w-xl text-sm text-gray-600">
								Review your selected pieces, adjust quantities, and complete your order in a few elegant steps.
							</p>
						</div>
						{hasItems && (
							<div className="flex items-center gap-4 rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-gray-600 shadow-sm">
								<span>
									{cart.length} item{cart.length > 1 ? "s" : ""}
								</span>
								<span className="h-1 w-1 rounded-full bg-gray-300" />
								<span>Secured checkout</span>
							</div>
						)}
					</div>
				</header>

				{!hasItems ? (
					<EmptyCartUI />
				) : (
					<div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
						<motion.section
							className="space-y-6"
							initial={{ opacity: 0, y: 18 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}
						>
							<div className="rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
								<div className="flex items-center justify-between">
									<h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-500">Items in your bag</h2>
									<Link
										to="/collection"
										className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 transition hover:text-gray-900"
									>
										Continue shopping
									</Link>
								</div>
								<div className="mt-6 space-y-6">
									{cart.map((item) => (
										<CartItem key={item._id} item={item} />
									))}
								</div>
							</div>

							<div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
								<h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-500">Shipping & assurance</h3>
								<div className="mt-6 grid gap-5 sm:grid-cols-3">
									<InfoPill
										icon={<Truck size={18} />}
										title="Fast delivery"
										description="Nationwide delivery within 3-5 working days."
									/>
									<InfoPill
										icon={<ShieldCheck size={18} />}
										title="Secure checkout"
										description="Transactions encrypted with tier-1 payment security."
									/>
									<InfoPill
										icon={<RefreshCcw size={18} />}
										title="Easy returns"
										description="Complimentary exchanges within 7 days of delivery."
									/>
								</div>
							</div>

							<PeopleAlsoBought />
						</motion.section>

						<motion.aside
							className="lg:sticky lg:top-24"
							initial={{ opacity: 0, y: 22 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.45, delay: 0.1 }}
						>
							<div className="space-y-6">
								<OrderSummary />
								<GiftCouponCard />
								<div className="rounded-[24px] border border-black/10 bg-white p-6 text-xs text-gray-500 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
									<p className="font-semibold uppercase tracking-[0.35em] text-gray-500">Need help?</p>
									<p className="mt-3 leading-relaxed text-gray-600">
										Reach our concierge team via <a href="mailto:care@quietluxury.com" className="underline decoration-dotted underline-offset-4">care@quietluxury.com</a> for sizing advice or order updates.
									</p>
									<Link
										to="/contact"
										className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-900"
									>
										Contact us
										<ArrowRight size={14} />
									</Link>
								</div>
							</div>
						</motion.aside>
					</div>
				)}
			</div>
		</div>
	);
};

export default CartPage;

const InfoPill = ({ icon, title, description }) => (
	<div className="space-y-2">
		<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
			<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-gray-900">
				{icon}
			</span>
			{title}
		</div>
		<p className="text-sm leading-relaxed text-gray-600">{description}</p>
	</div>
);

const EmptyCartUI = () => (
	<motion.div
		className="mt-16 flex flex-col items-center justify-center rounded-[32px] border border-dashed border-gray-300 bg-white/70 px-8 py-20 text-center shadow-[0_20px_55px_rgba(15,23,42,0.08)]"
		initial={{ opacity: 0, y: 24 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.45 }}
	>
		<div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
			<ShoppingCart className="h-10 w-10 text-gray-300" />
		</div>
		<h3 className="mt-6 text-2xl font-semibold text-gray-900">Your cart is empty</h3>
		<p className="mt-2 max-w-sm text-sm text-gray-500">
			Looks like you haven’t added anything yet. Discover new arrivals and modern staples curated for you.
		</p>
		<Link
			className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-gray-900"
			to="/collection"
		>
			Browse collection
			<ArrowRight size={16} />
		</Link>
	</motion.div>
);
