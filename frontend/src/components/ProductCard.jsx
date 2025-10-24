import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useMemo } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

	const imageSrc = useMemo(() => {
		if (Array.isArray(product.images) && product.images.length > 0) {
			return product.images[0];
		}
		return product.image;
	}, [product]);

	const priceLabel = useMemo(() => {
		const value = Number(product?.price) || 0;
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			maximumFractionDigits: 0,
		}).format(value);
	}, [product]);

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
		addToCart(product);
		toast.success("Added to your bag", { id: `bag-${product._id}` });
	};

	return (
		<article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)]">
			<div className="relative aspect-[3/4] overflow-hidden">
				<img
					src={imageSrc}
					alt={product?.name || "Product"}
					className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
				{product?.isFeatured && (
					<span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-900">
						Featured
					</span>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product?.name}</h3>
					{product?.category && (
						<p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">{product.category}</p>
					)}
				</div>
				<div className="flex items-center justify-between">
					<span className="text-lg font-semibold text-gray-900">{priceLabel}</span>
				</div>
				<button
					type="button"
					className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-gray-900"
					onClick={handleAddToCart}
				>
					<ShoppingCart size={18} />
					Add to bag
				</button>
			</div>
		</article>
	);
};

export default ProductCard;
