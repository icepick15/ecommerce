import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, ShieldCheck, RefreshCcw, Truck } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useProductStore } from "../stores/useProductStore";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
	const { id } = useParams();
	const { products, fetchAllProducts, loading: productsLoading } = useProductStore();
	const { addToCart } = useCartStore();
	const [product, setProduct] = useState(null);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [selectedSize, setSelectedSize] = useState("");
	const [pageLoading, setPageLoading] = useState(true);

	useEffect(() => {
		const loadProduct = async () => {
			setPageLoading(true);

			if (!products.length) {
				await fetchAllProducts();
			}

			const found = products.find((item) => item._id === id);

			if (found) {
				setProduct(found);
				setRelatedProducts(
					products
						.filter((item) => item.category === found.category && item._id !== found._id)
						.slice(0, 4)
				);
			}

			setPageLoading(false);
		};

		loadProduct();
	}, [fetchAllProducts, id, products]);

	useEffect(() => {
		if (!product) return;

		setCurrentImageIndex(0);
		setSelectedSize(product.sizes?.[0] || "");
	}, [product]);

	const allImages = useMemo(() => {
		if (!product) return [];
		const extras = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
		const unique = [...new Set([...(extras.length ? extras : []), product.image].filter(Boolean))];
		return unique;
	}, [product]);

	const mainImage = allImages[currentImageIndex] || product?.image || "";

	const handleAddToCart = () => {
		if (!product) return;
		if (product.sizes?.length && !selectedSize) {
			toast.error("Please select a size");
			return;
		}
		addToCart({ ...product, selectedSize });
		toast.success("Added to cart!");
	};

	if (pageLoading || productsLoading) {
		return (
			<div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
					<p className="mt-4 text-sm font-medium text-gray-600">Loading product details…</p>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center px-4 text-center">
				<div className="max-w-md space-y-4">
					<p className="text-lg font-semibold text-gray-900">We couldn’t find this product.</p>
					<p className="text-sm text-gray-600">It might have been moved or is no longer available.</p>
					<Link
						to="/collection"
						className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
					>
						Go to collection
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f9f7f4] text-gray-900">
			<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
				<nav className="mb-10 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
					<Link to="/" className="transition hover:text-gray-900">
						Home
					</Link>
					<span className="text-gray-300">/</span>
					<Link to={`/category/${product.category}`} className="transition hover:text-gray-900">
						{product.category}
					</Link>
					<span className="text-gray-300">/</span>
					<span className="text-gray-900">{product.name}</span>
				</nav>

				<div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
					<section className="space-y-6 lg:sticky lg:top-24">
						<Link to="/collection" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500 transition hover:text-gray-900">
							<ArrowLeft size={16} />
							Back to collection
						</Link>

						<div className="flex flex-col gap-4 lg:flex-row-reverse">
							<div className="relative w-full overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
								{mainImage ? (
									<img src={mainImage} alt={product.name} className="h-full w-full object-cover" />
								) : (
									<div className="flex aspect-[4/5] items-center justify-center bg-[#ece7dc] text-sm font-medium text-gray-500">
										No preview
									</div>
								)}
							</div>

							{allImages.length > 1 && (
								<div className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-y-auto lg:pb-0">
									{allImages.map((image, index) => (
										<button
											key={image}
											onClick={() => setCurrentImageIndex(index)}
											className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
												currentImageIndex === index
													? "border-black"
													: "border-black/10 hover:border-black/30"
											}`}
										>
											<img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
										</button>
									))}
								</div>
							)}
						</div>

						{product.description && (
							<div className="rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
								<h2 className="text-lg font-semibold uppercase tracking-[0.3em] text-gray-500">Narrative</h2>
								<p className="mt-4 text-base leading-relaxed text-gray-700 whitespace-pre-wrap">{product.description}</p>
							</div>
						)}
					</section>

					<section className="space-y-10">
						<header className="space-y-6">
							<span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-600">
								{product.category}
							</span>
							<h1 className="text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">{product.name}</h1>
							<p className="text-3xl font-semibold text-gray-900">₦{Number(product.price || 0).toLocaleString("en-NG")}</p>
						</header>

						{product.sizes?.length > 0 && (
							<div className="space-y-4">
								<div className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Select Size</div>
								<div className="flex flex-wrap gap-3">
									{product.sizes.map((size) => (
										<button
											key={size}
											onClick={() => setSelectedSize(size)}
											className={`rounded-full px-6 py-3 text-sm font-semibold tracking-[0.2em] transition ${
												selectedSize === size
													? "bg-black text-white"
													: "border border-black/10 bg-white text-gray-900 hover:border-black/40"
											}`}
										>
											{size}
										</button>
									))}
								</div>
							</div>
						)}

						<button
							onClick={handleAddToCart}
							className="w-full rounded-full bg-black px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-gray-900"
						>
							<ShoppingCart className="mr-2 inline-block h-4 w-4" />
							Add to cart
						</button>

						<div className="grid gap-4 rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
							<div className="flex items-start gap-4">
								<div className="rounded-full bg-black/5 p-3 text-black">
									<ShieldCheck size={20} />
								</div>
								<div>
									<h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">Quality</h3>
									<p className="mt-1 text-sm text-gray-600">Every piece is reviewed by our studio team before it ships.</p>
								</div>
							</div>
							<div className="flex items-start gap-4">
								<div className="rounded-full bg-black/5 p-3 text-black">
									<Truck size={20} />
								</div>
								<div>
									<h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">Delivery</h3>
									<p className="mt-1 text-sm text-gray-600">Nationwide delivery within 3-5 working days.</p>
								</div>
							</div>
							<div className="flex items-start gap-4">
								<div className="rounded-full bg-black/5 p-3 text-black">
									<RefreshCcw size={20} />
								</div>
								<div>
									<h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">Easy returns</h3>
									<p className="mt-1 text-sm text-gray-600">Complimentary exchanges within 7 days of delivery.</p>
								</div>
							</div>
						</div>

						<div className="rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
							<ul className="space-y-3 text-sm text-gray-600">
								<li>
									<span className="font-semibold text-gray-900">Sub category:</span> {product.subCategory || "—"}
								</li>
								<li>
									<span className="font-semibold text-gray-900">Available sizes:</span> {product.sizes?.length ? product.sizes.join(" • ") : "One size"}
								</li>
								<li>
									<span className="font-semibold text-gray-900">Status:</span> {product.bestseller ? "Bestseller" : "Standard"}
								</li>
							</ul>
						</div>
					</section>
				</div>

				{relatedProducts.length > 0 && (
					<section className="mt-16 space-y-8">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-semibold text-gray-900">Styled with</h2>
							<Link to="/collection" className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 transition hover:text-gray-900">
								View full edit
							</Link>
						</div>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{relatedProducts.map((item) => (
								<Link key={item._id} to={`/product/${item._id}`} className="group rounded-[24px] border border-black/10 bg-white p-4 shadow-[0_15px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(15,23,42,0.12)]">
									<div className="relative overflow-hidden rounded-3xl bg-[#f3eee4]">
										<img src={item.images?.[0] || item.image} alt={item.name} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
									</div>
									<div className="mt-5 space-y-1">
										<p className="text-xs uppercase tracking-[0.3em] text-gray-500">{item.category}</p>
										<h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
										<p className="text-base font-semibold text-gray-900">₦{Number(item.price || 0).toLocaleString("en-NG")}</p>
									</div>
								</Link>
							))}
						</div>
					</section>
				)}
			</div>
		</div>
	);
};

export default ProductDetailPage;
