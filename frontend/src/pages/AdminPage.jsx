import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Create", description: "Add new inventory", icon: PlusCircle },
	{ id: "products", label: "Catalog", description: "Manage existing pieces", icon: ShoppingBasket },
	{ id: "analytics", label: "Insights", description: "Monitor performance", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	return (
		<div className="min-h-screen bg-[#f9f7f4] pb-20 text-gray-900">
			<div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
				<header className="flex flex-col items-center gap-6 border-b border-black/10 pb-10 text-center">
					<motion.h1
						className="text-4xl font-semibold uppercase tracking-[0.4em] text-gray-500"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						Admin dashboard
					</motion.h1>
					<p className="max-w-2xl text-sm text-gray-600">
						Curate your catalog, oversee performance, and keep inventory aligned with the brand. Toggle between creation,
						catalog management, and analytics without leaving this space.
					</p>
				</header>

				<motion.nav
					className="mt-10 flex flex-col gap-4 rounded-[36px] border border-black/10 bg-white/80 p-4 shadow-[0_20px_65px_rgba(15,23,42,0.08)] sm:flex-row sm:items-stretch sm:justify-between"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45 }}
				>
					{tabs.map(({ id, label, description, icon: Icon }) => {
						const isActive = activeTab === id;
						return (
							<button
								key={id}
								type="button"
								onClick={() => setActiveTab(id)}
								className={`group flex flex-1 flex-col items-start gap-3 rounded-[28px] px-6 py-5 text-left transition ${
									isActive
										? "bg-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.2)]"
										: "bg-transparent text-gray-600 hover:bg-black/5"
								}`}
							>
								<span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em]">
									<span
										className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs transition ${
											isActive ? "border-white/50 bg-white/10" : "border-black/10 bg-black/5 text-gray-900"
										}`}
									>
										<Icon className="h-3.5 w-3.5" />
									</span>
									{label}
								</span>
								<span
									className={`text-sm leading-relaxed transition ${isActive ? "text-white/80" : "text-gray-500"}`}
								>
									{description}
								</span>
							</button>
						);
					})}
				</motion.nav>

				<section className="mt-12 space-y-12">
					<AnimatePresence mode="wait">
						{activeTab === "create" && (
							<motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
								<CreateProductForm />
							</motion.div>
						)}
						{activeTab === "products" && (
							<motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
								<ProductsList />
							</motion.div>
						)}
						{activeTab === "analytics" && (
							<motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
								<AnalyticsTab />
							</motion.div>
						)}
					</AnimatePresence>
				</section>
			</div>
		</div>
	);
};

export default AdminPage;
