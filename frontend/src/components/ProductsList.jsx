import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const formatPrice = (value) =>
	new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(value);

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();
	const hasProducts = (products ?? []).length > 0;
	const totalProducts = products?.length ?? 0;
	const featuredProducts = products?.filter((product) => Boolean(product.isFeatured)).length ?? 0;
	const bestsellerProducts = products?.filter((product) => Boolean(product.bestseller)).length ?? 0;

	return (
		<motion.div
			className="rounded-[36px] border border-black/10 bg-white/90 p-8 shadow-[0_24px_65px_rgba(15,23,42,0.08)]"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45 }}
		>
			<header className="flex flex-col gap-2 border-b border-black/10 pb-6">
				<span className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Catalog</span>
				<h2 className="text-3xl font-semibold text-gray-900">Manage existing products</h2>
				<p className="text-sm text-gray-500">
					Toggle featured picks, refine pricing, and remove discontinued pieces to keep the storefront tight and curated.
				</p>
			</header>

			{hasProducts ? (
				<>
					<div className="mt-8 grid gap-4 sm:grid-cols-3">
						<SummaryPill label="Total styles" value={totalProducts} />
						<SummaryPill label="Featured" value={featuredProducts} />
						<SummaryPill label="Bestsellers" value={bestsellerProducts} />
					</div>
					<div className="mt-8 overflow-hidden rounded-[28px] border border-black/5">
					<table className="min-w-full divide-y divide-black/5 text-sm">
						<thead className="bg-[#f9f7f4] text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
							<tr>
								<th scope="col" className="px-6 py-4 text-left">
									Product
								</th>
								<th scope="col" className="px-6 py-4 text-right">
									Price
								</th>
								<th scope="col" className="px-6 py-4 text-left">
									Category
								</th>
								<th scope="col" className="px-6 py-4 text-center">
									Featured
								</th>
								<th scope="col" className="px-6 py-4 text-center">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-black/5 bg-white">
							{products.map((product) => {
								const isFeatured = Boolean(product.isFeatured);
								return (
									<tr key={product._id} className="transition hover:bg-black/10">
										<td className="px-6 py-4">
											<div className="flex items-center gap-4">
												<div className="h-14 w-14 overflow-hidden rounded-[18px] border border-black/10 bg-black/5">
													<img
														src={product.image}
														alt={product.name}
														className="h-full w-full object-cover"
														loading="lazy"
													/>
												</div>
												<div className="space-y-1">
													<p className="text-base font-semibold text-gray-900">{product.name}</p>
													<p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
														{product.subCategory || "—"}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 text-right font-medium text-gray-700">{formatPrice(product.price)}</td>
										<td className="px-6 py-4 text-gray-600">{product.category}</td>
										<td className="px-6 py-4 text-center">
											<button
												type="button"
												onClick={() => toggleFeaturedProduct(product._id)}
												className={`inline-flex items-center justify-center rounded-full border px-3 py-2 transition ${
													isFeatured
														? "border-yellow-400 bg-yellow-300/80 text-gray-900 shadow-[0_10px_24px_rgba(250,204,21,0.28)]"
														: "border-black/10 bg-black/5 text-gray-600 hover:bg-black/10"
												}`}
												title={isFeatured ? "Remove from featured" : "Mark as featured"}
											>
												<Star className={`h-4 w-4 ${isFeatured ? "fill-current" : ""}`} />
											</button>
										</td>
										<td className="px-6 py-4 text-center">
											<button
												type="button"
												onClick={() => deleteProduct(product._id)}
												className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm transition hover:bg-red-100"
												title="Remove product"
											>
												<Trash className="h-4 w-4" />
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</>
			) : (
				<div className="mt-8 rounded-[28px] border border-dashed border-gray-300 bg-white/70 px-8 py-20 text-center text-sm text-gray-500 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">No products yet</p>
					<p className="mt-3 text-base text-gray-700">Create your first product to see it populate in this list.</p>
				</div>
			)}
		</motion.div>
	);
};

export default ProductsList;

const SummaryPill = ({ label, value }) => (
	<div className="rounded-[24px] border border-black/10 bg-[#f9f7f4] px-5 py-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
		<p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">{label}</p>
		<p className="mt-2 text-xl font-semibold text-gray-900">{value.toLocaleString("en-NG")}</p>
	</div>
);
