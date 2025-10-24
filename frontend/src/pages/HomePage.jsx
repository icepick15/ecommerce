import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import toast from "react-hot-toast";

const categoryCards = [
	{
		name: "Women",
		description: "Soft tailoring, fluid dresses, and everyday essentials.",
		image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
	},
	{
		name: "Men",
		description: "Relaxed layers built for modern work and weekend moments.",
		image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800",
	},
	{
		name: "Kids",
		description: "Playful staples crafted for growing imaginations.",
		image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800",
	},
];

const formatCurrency = (value) => `₦${Number(value || 0).toLocaleString("en-NG")}`;

const HomePage = () => {
	const { products, fetchAllProducts } = useProductStore();
	const { addToCart } = useCartStore();
	const [latestProducts, setLatestProducts] = useState([]);
	const [galleryIndices, setGalleryIndices] = useState({});

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	useEffect(() => {
		if (!products.length) return;

		const newest = [...products]
			.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			.slice(0, 6);
		setLatestProducts(newest);
	}, [products]);

	const featuredProducts = useMemo(
		() => products.filter((item) => item.isFeatured).slice(0, 4),
		[products]
	);

	const handleAddToCart = (product) => {
		addToCart(product);
		toast.success("Added to cart!");
	};

	const getProductImages = useCallback((product) => {
		const extras = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
		const all = [...extras, product.image].filter(Boolean);
		return [...new Set(all)];
	}, []);

	const updateGalleryIndex = useCallback((productId, nextIndex, total) => {
		if (total <= 1) return;
		setGalleryIndices((prev) => {
			const bounded = ((nextIndex % total) + total) % total;
			return { ...prev, [productId]: bounded };
		});
	}, []);

	const handleGalleryDragEnd = useCallback((productId, offsetX, total, currentIndex) => {
		if (total <= 1) return;
		if (offsetX < -45) {
			updateGalleryIndex(productId, currentIndex + 1, total);
		} else if (offsetX > 45) {
			updateGalleryIndex(productId, currentIndex - 1, total);
		}
	}, [updateGalleryIndex]);

	useEffect(() => {
		setGalleryIndices((prev) => {
			const nextState = {};
			latestProducts.forEach((product) => {
				const images = getProductImages(product);
				const total = images.length;
				const current = prev[product._id] ?? 0;
				nextState[product._id] = total > 0 ? Math.min(current, total - 1) : 0;
			});
			return nextState;
		});
	}, [latestProducts, getProductImages]);

	useEffect(() => {
		const timers = latestProducts.map((product) => {
			const images = getProductImages(product);
			if (images.length <= 1) return null;
			return setInterval(() => {
				setGalleryIndices((prev) => {
					const current = prev[product._id] ?? 0;
					const nextIndex = (current + 1) % images.length;
					return { ...prev, [product._id]: nextIndex };
				});
			}, 3000);
		});

		return () => {
			timers.forEach((timer) => {
				if (timer) clearInterval(timer);
			});
		};
	}, [latestProducts, getProductImages]);

	return (
		<div className="min-h-screen bg-[#f9f7f4] text-gray-900">
			{/* Hero */}
			<section className="relative overflow-hidden border-b border-black/5 bg-white">
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-[#f1ece1]" />
					<div className="absolute -bottom-32 -left-10 h-64 w-64 rounded-full bg-[#efe8db]/70" />
				</div>

				<div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:gap-20 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="space-y-8 lg:flex-1"
					>
						<span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-600">
							Quiet Luxury
						</span>

						<h1 className="text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl lg:text-[56px]">
							Simple silhouettes crafted for timeless wardrobes.
						</h1>

						<p className="max-w-xl text-lg text-gray-600">
							Discover clean lines, natural fabrics, and elevated basics that move easily from desk to dinner.
						</p>

						<div className="flex flex-col gap-4 sm:flex-row">
							<Link
								to="/category/Women"
								className="inline-flex items-center justify-center gap-3 rounded-full bg-black px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-gray-900"
							>
								Shop Women’s Edit
								<ArrowRight size={18} />
							</Link>

							<a
								href="#new-arrivals"
								className="inline-flex items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-gray-900 transition hover:border-black/30"
							>
								Browse New Arrivals
							</a>

							<Link
								to="/collection"
								className="inline-flex items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-gray-900 transition hover:border-black/30"
							>
								View Full Collection
								<ArrowRight size={16} />
							</Link>
						</div>

						<div className="grid grid-cols-1 gap-6 border-t border-black/10 pt-6 sm:grid-cols-3">
							<div>
								<p className="text-xs uppercase tracking-[0.35em] text-gray-500">Since 2016</p>
								<p className="mt-2 text-xl font-semibold">Trusted Worldwide</p>
							</div>
							<div>
								<p className="text-xs uppercase tracking-[0.35em] text-gray-500">Handpicked</p>
								<p className="mt-2 text-xl font-semibold">500+ Pieces</p>
							</div>
							<div>
								<p className="text-xs uppercase tracking-[0.35em] text-gray-500">Community</p>
								<p className="mt-2 text-xl font-semibold">5k+ Clients</p>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
						className="relative overflow-hidden rounded-[36px] border border-black/10 bg-[#fdfbf7] shadow-[0_25px_60px_rgba(15,23,42,0.12)] lg:flex-1"
					>
						<img
							src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200"
							alt="Lookbook"
							className="h-full w-full object-cover"
						/>
					</motion.div>
				</div>
			</section>

			{/* Categories */}
			<section className="py-20">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
					<div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Curated Worlds</p>
							<h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
								Shop by mood and moment
							</h2>
						</div>
						<Link
							to="/category/Men"
							className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-black"
						>
							View men’s collection
							<ArrowRight size={16} />
						</Link>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						{categoryCards.map((category, index) => (
							<motion.div
								key={category.name}
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1, duration: 0.5 }}
								viewport={{ once: true }}
								className="group rounded-[30px] border border-black/10 bg-white/90 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(15,23,42,0.12)]"
							>
								<div className="relative mb-6 overflow-hidden rounded-[26px]">
									<img
										src={category.image}
										alt={category.name}
										className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
									/>
								</div>

								<div className="space-y-4">
									<h3 className="text-2xl font-semibold text-gray-900">{category.name}</h3>
									<p className="text-sm leading-relaxed text-gray-600">{category.description}</p>
									<Link
										to={`/category/${category.name}`}
										className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition hover:gap-3"
									>
										Explore collection
										<ArrowRight size={16} />
									</Link>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Latest Arrivals */}
			<section id="new-arrivals" className="border-y border-black/5 bg-white py-20">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
					<div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">
								<Sparkles size={18} />
								New In
							</div>
							<h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">New arrivals this week</h2>
						</div>

						<Link
							to="/category/Women"
							className="hidden items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-black sm:inline-flex"
						>
							Browse all launches
							<ArrowRight size={16} />
						</Link>
					</div>

					{latestProducts.length ? (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{latestProducts.map((product, index) => (
								<motion.div
									key={product._id}
									initial={{ opacity: 0, y: 16 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.05, duration: 0.4 }}
									viewport={{ once: true }}
									className="rounded-[26px] border border-black/10 bg-[#fdfbf7] p-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
								>
									<Link to={`/product/${product._id}`} className="block">
										{(() => {
											const images = getProductImages(product);
											const total = images.length || 1;
											const currentIndex = galleryIndices[product._id] ?? 0;
											const activeImage = images[currentIndex] || images[0] || product.image;

											return (
												<div className="relative overflow-hidden rounded-[22px] bg-[#f4efe8]">
													<motion.div
														key={activeImage}
														className="aspect-[4/5] w-full"
														initial={{ opacity: 0.25, scale: 1.02 }}
														animate={{ opacity: 1, scale: 1 }}
														transition={{ duration: 0.35, ease: "easeOut" }}
														drag={total > 1 ? "x" : false}
														dragConstraints={{ left: 0, right: 0 }}
														onDragEnd={(event, info) => handleGalleryDragEnd(product._id, info.offset.x, total, currentIndex)}
													>
														<img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
													</motion.div>

													{total > 1 && (
														<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
															{images.map((_, dotIndex) => (
																<button
																	key={dotIndex}
																	onClick={(event) => {
																		event.preventDefault();
																		updateGalleryIndex(product._id, dotIndex, total);
																	}}
																	className={`h-1.5 w-6 rounded-full transition ${
																		dotIndex === currentIndex ? "bg-gray-900" : "bg-white/70"
																	}`}
																	aria-label={`Show image ${dotIndex + 1}`}
																/>
															))}
														</div>
													)}

													<button
														onClick={(event) => {
														 event.preventDefault();
														 handleAddToCart(product);
													}}
													className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-5 py-2 text-xs font-semibold tracking-wide text-gray-900 shadow-md transition hover:bg-white"
												>
													Add to cart
												</button>
												</div>
											);
										})()}

										<div className="mt-5 space-y-2">
											<p className="text-xs uppercase tracking-[0.3em] text-gray-500">{product.category}</p>
											<h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{product.name}</h3>
											<p className="text-base font-semibold text-gray-900">{formatCurrency(product.price)}</p>
										</div>
									</Link>
								</motion.div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center gap-4 rounded-[26px] border border-dashed border-gray-300 bg-[#fbf8f1] p-16 text-center">
							<ShoppingBag size={48} className="text-gray-300" />
							<p className="text-sm text-gray-500">Fresh pieces are on the way. Check back soon.</p>
						</div>
					)}
				</div>
			</section>

			{/* Featured Collections */}
			{featuredProducts.length > 0 && (
				<section id="collections" className="py-20">
					<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
						<div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
									<TrendingUp size={18} />
									Most Loved
								</div>
								<h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
									Signature styles clients return for
								</h2>
							</div>

							<Link
								to="/category/Accessories"
								className="hidden items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-black sm:inline-flex"
							>
								View curated sets
								<ArrowRight size={16} />
							</Link>
						</div>

						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{featuredProducts.map((product, index) => (
								<motion.div
									key={product._id}
									initial={{ opacity: 0, y: 16 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.08, duration: 0.45 }}
									viewport={{ once: true }}
									className="flex flex-col rounded-[26px] border border-black/10 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
								>
									<Link to={`/product/${product._id}`} className="flex h-full flex-col">
										<div className="relative overflow-hidden rounded-[22px] bg-[#f4efe8]">
											<img
												src={product.images?.[0] || product.image}
												alt={product.name}
												className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
											/>
											<div className="absolute top-4 left-4 rounded-full bg-white px-4 py-1 text-xs font-semibold tracking-[0.25em] text-gray-700">
												Highlight
											</div>
										</div>

										<div className="mt-5 flex flex-1 flex-col justify-between">
											<div className="space-y-2">
												<p className="text-xs uppercase tracking-[0.3em] text-gray-500">{product.category}</p>
												<h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{product.name}</h3>
											</div>

											<div className="mt-6 flex items-center justify-between">
												<p className="text-base font-semibold text-gray-900">{formatCurrency(product.price)}</p>
												<button
													onClick={(event) => {
														event.preventDefault();
														handleAddToCart(product);
													}}
													className="rounded-full bg-black px-5 py-2 text-xs font-semibold tracking-wide text-white transition hover:bg-gray-900"
												>
													Add to cart
												</button>
											</div>
										</div>
									</Link>
								</motion.div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Newsletter */}
			<section className="bg-[#111827] py-20 text-white">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10">
						<Sparkles size={28} />
					</div>
					<h2 className="mt-6 text-3xl font-semibold sm:text-4xl">Stay in the quiet loop</h2>
					<p className="mt-3 text-base text-white/70">
						Be the first to know about limited drops, seasonal stories, and private sale previews.
					</p>

					<form className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
						<input
							type="email"
							placeholder="Enter your email"
							required
							className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-white placeholder-white/50 focus:border-white/60 focus:outline-none sm:max-w-xs"
						/>
						<button
							type="submit"
							className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
						>
							Subscribe
							<ArrowRight size={16} />
						</button>
					</form>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
