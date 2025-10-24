import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import ProductCard from "../components/ProductCard";

const sortOptions = [
	{ label: "Curated", value: "featured" },
	{ label: "Price ↑", value: "price-asc" },
	{ label: "Price ↓", value: "price-desc" },
	{ label: "Newest", value: "newest" },
];

const CategoryPage = () => {
	const { fetchProductsByCategory, products, loading } = useProductStore();
	const { category } = useParams();
	const [sort, setSort] = useState(sortOptions[0].value);

	useEffect(() => {
		if (!category) return;
		fetchProductsByCategory(category);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [fetchProductsByCategory, category]);

	const formattedCategory = useMemo(() => {
		if (!category) return "Collection";
		return category
			.split("-")
			.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
			.join(" ");
	}, [category]);

	const sortedProducts = useMemo(() => {
		if (!products) return [];

		const cloned = [...products];

		switch (sort) {
			case "price-asc":
				return cloned.sort((a, b) => (a.price || 0) - (b.price || 0));
			case "price-desc":
				return cloned.sort((a, b) => (b.price || 0) - (a.price || 0));
			case "newest":
				return cloned.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
			default:
				return cloned;
		}
	}, [products, sort]);

	const hasProducts = sortedProducts.length > 0;

	return (
		<div className="min-h-screen bg-[#f9f7f4] pb-16 text-gray-900">
			<div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
				<header className="flex flex-col gap-6 border-b border-black/10 pb-10">
					<nav className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
						<Link to="/" className="transition hover:text-gray-900">
							Home
						</Link>
						<span className="text-gray-300">/</span>
						<Link to="/collection" className="transition hover:text-gray-900">
							Collection
						</Link>
						<span className="text-gray-300">/</span>
						<span className="text-gray-900">{formattedCategory}</span>
					</nav>
					<div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
						<div className="space-y-3">
							<p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
								<Sparkles className="h-3.5 w-3.5" /> Curated category
							</p>
							<h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{formattedCategory}</h1>
							<p className="max-w-xl text-sm text-gray-600">
								Discover handpicked pieces selected for this category. Filter, sort, and find your next wardrobe staple
								with ease.
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-3 shadow-sm">
							<span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Sort</span>
							<div className="flex gap-2">
								{sortOptions.map((option) => (
									<button
										key={option.value}
										type="button"
										onClick={() => setSort(option.value)}
										className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
											sort === option.value
												? "bg-black text-white shadow-[0_10px_25px_rgba(15,23,42,0.18)]"
												: "bg-black/5 text-gray-700 hover:bg-black/10"
										}`}
									>
										{option.label}
									</button>
								))}
							</div>
						</div>
					</div>
				</header>

				<section className="mt-10">
					<motion.div
						className="flex items-center justify-between gap-4 rounded-[28px] border border-black/10 bg-white px-6 py-4 text-xs text-gray-500 shadow-[0_20px_55px_rgba(15,23,42,0.08)]"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
					>
						<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
							<SlidersHorizontal className="h-3.5 w-3.5" />
							Refined selection
						</div>
						<span className="text-gray-400">{hasProducts ? `${sortedProducts.length} styles` : "Updating rack"}</span>
					</motion.div>

					<div className="mt-8">
						<AnimatePresence mode="wait">
							{loading ? (
								<motion.div
									key="skeleton"
									className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									{Array.from({ length: 8 }).map((_, index) => (
										<SkeletonCard key={index} />
									))}
								</motion.div>
							) : hasProducts ? (
								<motion.div
									key="products"
									className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{ duration: 0.4 }}
								>
									{sortedProducts.map((product) => (
										<ProductCard key={product._id} product={product} />
									))}
								</motion.div>
							) : (
								<EmptyState key="empty" category={formattedCategory} />
							)}
						</AnimatePresence>
					</div>
				</section>
			</div>
		</div>
	);
};

export default CategoryPage;

const SkeletonCard = () => (
	<div className="group relative overflow-hidden rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
		<div className="aspect-[3/4] w-full animate-pulse rounded-[22px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100" />
		<div className="mt-5 space-y-3">
			<div className="h-3 w-3/4 animate-pulse rounded-full bg-gray-200" />
			<div className="h-3 w-1/2 animate-pulse rounded-full bg-gray-200" />
			<div className="h-3 w-2/3 animate-pulse rounded-full bg-gray-200" />
		</div>
	</div>
);

const EmptyState = ({ category }) => (
	<motion.div
		className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-gray-300 bg-white/80 px-10 py-20 text-center shadow-[0_20px_55px_rgba(15,23,42,0.08)]"
		initial={{ opacity: 0, y: 24 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.45 }}
	>
		<span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
			Curated soon
		</span>
		<h3 className="mt-6 text-2xl font-semibold text-gray-900">No pieces in {category} yet</h3>
		<p className="mt-2 max-w-md text-sm text-gray-500">
			We’re sourcing the perfect additions. Explore other categories while we prepare fresh arrivals tailored to your
			style.
		</p>
		<Link
			to="/collection"
			className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-gray-900"
		>
			Back to collection
		</Link>
	</motion.div>
);
