import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Filter, RotateCcw, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";

const CATEGORY_OPTIONS = ["All", "Women", "Men", "Kids"];
const SUBCATEGORY_OPTIONS = ["All", "Topwear", "Bottomwear", "Winterwear", "Footwear", "Accessories"];
const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];
const SORT_OPTIONS = [
	{ value: "newest", label: "Newest" },
	{ value: "priceLowHigh", label: "Price: Low to High" },
	{ value: "priceHighLow", label: "Price: High to Low" },
	{ value: "nameAZ", label: "Name: A-Z" },
];

const formatCurrency = (value) => `₦${Number(value || 0).toLocaleString("en-NG")}`;

const CollectionPage = () => {
	const { products, fetchAllProducts, loading } = useProductStore();
	const { addToCart } = useCartStore();
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTermRaw = searchParams.get("search")?.trim() || "";
	const searchTerm = searchTermRaw.toLowerCase();

	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedSubCategory, setSelectedSubCategory] = useState("All");
	const [selectedSizes, setSelectedSizes] = useState([]);
	const [showBestsellers, setShowBestsellers] = useState(false);
	const [sortOption, setSortOption] = useState("newest");
	const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	const priceLimits = useMemo(() => {
		if (!products.length) return { min: 0, max: 0 };
		const prices = products.map((product) => Number(product.price) || 0);
		return {
			min: Math.min(...prices),
			max: Math.max(...prices),
		};
	}, [products]);

	useEffect(() => {
		if (!products.length) return;
		setPriceRange(priceLimits);
	}, [products.length, priceLimits]);

	const filteredProducts = useMemo(() => {
		const filtered = products.filter((product) => {
			const haystack = `${product.name} ${product.category} ${product.subCategory || ""}`.toLowerCase();
			if (searchTerm && !haystack.includes(searchTerm)) return false;
			if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
			if (selectedSubCategory !== "All" && product.subCategory !== selectedSubCategory) return false;
			if (showBestsellers && !product.bestseller) return false;
			if (selectedSizes.length && !selectedSizes.some((size) => product.sizes?.includes(size))) return false;
			const price = Number(product.price) || 0;
			if (price < priceRange.min || price > priceRange.max) return false;
			return true;
		});

		return filtered.sort((a, b) => {
			switch (sortOption) {
				case "priceLowHigh":
					return (Number(a.price) || 0) - (Number(b.price) || 0);
				case "priceHighLow":
					return (Number(b.price) || 0) - (Number(a.price) || 0);
				case "nameAZ":
					return a.name.localeCompare(b.name);
				default:
					return new Date(b.createdAt) - new Date(a.createdAt);
			}
		});
	}, [products, selectedCategory, selectedSubCategory, selectedSizes, showBestsellers, priceRange, sortOption, searchTerm]);

	const toggleSize = (size) => {
		setSelectedSizes((prev) =>
			prev.includes(size) ? prev.filter((selected) => selected !== size) : [...prev, size]
		);
	};

	const resetFilters = () => {
		setSelectedCategory("All");
		setSelectedSubCategory("All");
		setSelectedSizes([]);
		setShowBestsellers(false);
		setSortOption("newest");
		setPriceRange(priceLimits);
		if (searchTermRaw) {
			const params = new URLSearchParams(searchParams);
			params.delete("search");
			setSearchParams(params, { replace: true });
		}
	};

	const clearSearch = () => {
		const params = new URLSearchParams(searchParams);
		params.delete("search");
		setSearchParams(params, { replace: true });
	};

	const handleAddToCart = (product, event) => {
		event.preventDefault();
		addToCart(product);
		toast.success("Added to cart!");
	};

	const renderProductContent = () => {
		if (loading) {
			return (
				<div className="flex justify-center py-24">
					<ShoppingBag size={42} className="animate-pulse text-gray-400" />
				</div>
			);
		}

		if (!filteredProducts.length) {
			return (
				<div className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-gray-300 bg-white/80 p-16 text-center">
					<ShoppingBag size={48} className="text-gray-300" />
					<p className="text-sm text-gray-500">No pieces match your filters yet. Try adjusting your selection.</p>
					<button
						onClick={resetFilters}
						type="button"
						className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#f6f2ea] px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-black/30"
					>
						Reset filters
						<ArrowRight size={16} />
					</button>
				</div>
			);
		}

		return (
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{filteredProducts.map((product, index) => (
					<motion.div
						key={product._id}
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.04, duration: 0.4 }}
						viewport={{ once: true }}
						className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.09)]"
					>
						<Link to={`/product/${product._id}`} className="flex h-full flex-col">
							<div className="relative overflow-hidden rounded-[22px] bg-[#f4efe8]">
								<img
									src={product.images?.[0] || product.image}
									alt={product.name}
									className="aspect-[4/5] w-full object-cover transition duration-500 hover:scale-105"
								/>
								{product.bestseller && (
									<span className="absolute top-4 left-4 rounded-full bg-white px-4 py-1 text-xs font-semibold tracking-[0.3em] text-gray-700">
										Classic
									</span>
								)}
								<button
									onClick={(event) => handleAddToCart(product, event)}
									className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-5 py-2 text-xs font-semibold tracking-wide text-gray-900 shadow transition hover:bg-white"
								>
									Add to bag
								</button>
							</div>

							<div className="mt-5 flex flex-1 flex-col justify-between">
								<div className="space-y-2">
									<p className="text-xs uppercase tracking-[0.3em] text-gray-500">
										{product.category} • {product.subCategory}
									</p>
									<h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{product.name}</h3>
								</div>
								<div className="mt-4 flex items-center justify-between text-sm">
									<span className="font-semibold text-gray-900">{formatCurrency(product.price)}</span>
									<span className="text-gray-500">
										{product.sizes?.length ? product.sizes.join(" • ") : "One size"}
									</span>
								</div>
							</div>
						</Link>
					</motion.div>
				))}
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-[#f9f7f4] text-gray-900">
			<section className="border-b border-black/5 bg-white">
				<div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 lg:px-8">
					<div className="space-y-6">
						<p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-600">
							Refined Edit
						</p>
						<h1 className="text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
							The Collection — curated classics for every silhouette.
						</h1>
						<p className="max-w-2xl text-lg text-gray-600">
							Navigate our complete wardrobe library. Filter by category, tailoring, or size to find effortless pieces that fit your day.
						</p>
						{searchTermRaw && (
							<div className="flex flex-wrap items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
								<span>Search: “{searchTermRaw}”</span>
								<button onClick={clearSearch} type="button" className="rounded-full bg-amber-100 px-3 py-1 text-[10px] text-amber-700 transition hover:bg-amber-200">
									Clear
								</button>
							</div>
						)}
						<div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
							<span>{products.length} total styles</span>
							<span className="hidden sm:inline">•</span>
							<span>{filteredProducts.length} showing with current filters</span>
						</div>
					</div>

					<div className="space-y-6 rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-gray-500">
								<Filter size={18} /> Filters
							</div>
							<button
								onClick={resetFilters}
								type="button"
								className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-700 transition hover:border-black/40"
							>
								<RotateCcw size={14} /> Reset
							</button>
						</div>

						<div className="grid gap-6 lg:grid-cols-4">
							<div className="space-y-2">
								<label className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Category</label>
								<select
									value={selectedCategory}
									onChange={(event) => setSelectedCategory(event.target.value)}
									className="w-full rounded-full border border-black/10 bg-[#f6f2ea] px-5 py-3 text-sm font-medium text-gray-700 focus:border-black/40 focus:outline-none"
								>
									{CATEGORY_OPTIONS.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							</div>

							<div className="space-y-2">
								<label className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Edit</label>
								<select
									value={selectedSubCategory}
									onChange={(event) => setSelectedSubCategory(event.target.value)}
									className="w-full rounded-full border border-black/10 bg-[#f6f2ea] px-5 py-3 text-sm font-medium text-gray-700 focus:border-black/40 focus:outline-none"
								>
									{SUBCATEGORY_OPTIONS.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							</div>

							<div className="space-y-2">
								<label className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Price (₦)</label>
								<div className="flex items-center gap-3">
									<input
										type="number"
										min={priceLimits.min}
										max={priceRange.max}
										value={priceRange.min}
										onChange={(event) =>
											setPriceRange((prev) => ({
												...prev,
												min: Math.min(Number(event.target.value) || priceLimits.min, prev.max),
											}))
										}
										className="w-full rounded-full border border-black/10 bg-[#f6f2ea] px-4 py-3 text-sm font-medium text-gray-700 focus:border-black/40 focus:outline-none"
									/>
									<span className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">—</span>
									<input
										type="number"
										min={priceRange.min}
										max={priceLimits.max}
										value={priceRange.max}
										onChange={(event) =>
											setPriceRange((prev) => ({
												...prev,
												max: Math.max(Number(event.target.value) || priceLimits.max, prev.min),
											}))
										}
										className="w-full rounded-full border border-black/10 bg-[#f6f2ea] px-4 py-3 text-sm font-medium text-gray-700 focus:border-black/40 focus:outline-none"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Sort</label>
								<select
									value={sortOption}
									onChange={(event) => setSortOption(event.target.value)}
									className="w-full rounded-full border border-black/10 bg-[#f6f2ea] px-5 py-3 text-sm font-medium text-gray-700 focus:border-black/40 focus:outline-none"
								>
									{SORT_OPTIONS.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-4 border-t border-black/10 pt-6">
							<div className="flex flex-wrap gap-2">
								{SIZE_OPTIONS.map((size) => (
									<button
										key={size}
										type="button"
										onClick={() => toggleSize(size)}
										className={`rounded-full px-4 py-2 text-xs font-semibold tracking-[0.25em] transition ${
											selectedSizes.includes(size)
												? "bg-black text-white"
												: "border border-black/10 bg-[#f6f2ea] text-gray-700 hover:border-black/30"
										}`}
									>
										{size}
									</button>
								))}
							</div>
							<label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-600">
								<input
									type="checkbox"
									checked={showBestsellers}
									onChange={(event) => setShowBestsellers(event.target.checked)}
									className="h-4 w-4 rounded border-gray-400 text-gray-900"
								/>
								Bestsellers only
							</label>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{renderProductContent()}</div>
			</section>

			<section className="bg-[#111827] py-16 text-white">
				<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 lg:flex-row lg:text-left lg:px-8">
					<div className="space-y-4">
						<h2 className="text-3xl font-semibold">Need a curated capsule?</h2>
						<p className="text-sm text-white/70">
							Book a styling session and we will assemble a capsule edit tailored to your calendar.
						</p>
					</div>
					<Link
						to="/category/Women"
						className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
					>
						Explore seasonal stories
						<ArrowRight size={16} />
					</Link>
				</div>
			</section>
		</div>
	);
};

export default CollectionPage;
