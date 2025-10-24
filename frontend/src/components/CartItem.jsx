import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<div className="rounded-[26px] border border-black/10 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-6">
			<div className="space-y-5 md:flex md:items-center md:justify-between md:gap-8 md:space-y-0">
				<div className="shrink-0 overflow-hidden rounded-2xl bg-[#f6f1e7] md:order-1">
					<img className="h-24 w-24 object-cover sm:h-28 sm:w-28" src={item.image} alt={item.name} />
				</div>

				<div className="w-full min-w-0 flex-1 space-y-3 md:order-2 md:max-w-md">
					<p className="text-lg font-semibold text-gray-900">{item.name}</p>
					<p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
					<button
						className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-gray-400 transition hover:text-gray-900"
						onClick={() => removeFromCart(item._id)}
					>
						<Trash size={16} />
						Remove
					</button>
				</div>

				<div className="flex flex-col items-end gap-4 md:order-3">
					<div className="flex items-center gap-3 rounded-full border border-black/10 bg-[#f9f7f4] px-3 py-2">
						<button
							className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:text-gray-900"
							onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
						>
							<Minus size={14} />
						</button>
						<span className="min-w-[2rem] text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
						<button
							className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:text-gray-900"
							onClick={() => updateQuantity(item._id, item.quantity + 1)}
						>
							<Plus size={14} />
						</button>
					</div>
					<p className="text-base font-semibold text-gray-900">₦{item.price.toLocaleString("en-NG")}</p>
				</div>
			</div>
		</div>
	);
};
export default CartItem;
