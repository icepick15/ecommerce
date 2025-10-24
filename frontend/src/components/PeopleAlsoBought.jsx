import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";

const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const res = await axios.get("/products/recommendations");
				setRecommendations(res.data || []);
				setHasError(false);
			} catch (error) {
				const message = error?.response?.data?.message || "We couldn't fetch curated suggestions.";
				toast.error(message);
				setHasError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecommendations();
	}, []);

	const showEmpty = !isLoading && !hasError && recommendations.length === 0;

	return (
		<section className="rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">People also bought</p>
					<h3 className="text-2xl font-semibold text-gray-900">Curated complements</h3>
				</div>
				<span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
					{isLoading ? "Styling..." : `${recommendations.length} picks`}
				</span>
			</header>

			<div className="mt-6">
				{isLoading ? (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 3 }).map((_, index) => (
							<SkeletonRecommendation key={index} />
						))}
					</div>
				) : hasError ? (
					<ErrorState />
				) : showEmpty ? (
					<EmptyState />
				) : (
					<motion.div
						className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
					>
						{recommendations.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</motion.div>
				)}
			</div>
		</section>
	);
};

export default PeopleAlsoBought;

const SkeletonRecommendation = () => (
	<div className="overflow-hidden rounded-[24px] border border-black/5 bg-[#f9f7f4] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
		<div className="aspect-[3/4] w-full animate-pulse rounded-[18px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100" />
		<div className="mt-4 space-y-3">
			<div className="h-3 w-2/3 animate-pulse rounded-full bg-gray-200" />
			<div className="h-3 w-1/2 animate-pulse rounded-full bg-gray-200" />
			<div className="h-3 w-3/4 animate-pulse rounded-full bg-gray-200" />
		</div>
	</div>
);

const EmptyState = () => (
	<motion.div
		className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-300 bg-white/80 px-6 py-12 text-center shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.35 }}
	>
		<span className="rounded-full bg-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
			Updating soon
		</span>
		<h4 className="mt-4 text-lg font-semibold text-gray-900">Fresh pairings on the way</h4>
		<p className="mt-2 max-w-sm text-sm text-gray-500">
			We’re curating new recommendations to complement your selection. Check back shortly for polished combinations.
		</p>
	</motion.div>
);

const ErrorState = () => (
	<motion.div
		className="rounded-[24px] border border-red-200 bg-red-50/70 px-6 py-8 text-center text-sm text-red-700 shadow-[0_12px_30px_rgba(248,113,113,0.15)]"
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.35 }}
	>
		We had trouble loading curated recommendations. Please refresh the page to try again.
	</motion.div>
);
