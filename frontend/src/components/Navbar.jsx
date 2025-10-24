import { useEffect, useState, useMemo } from "react";
import {
	ShoppingCart,
	LogIn,
	LogOut,
	Lock,
	Menu,
	X,
	Search,
	UserPlus,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();
	const navigate = useNavigate();
	const location = useLocation();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const navLinks = useMemo(
		() => [
			{ label: "Home", to: "/" },
			{ label: "Collection", to: "/collection" },
			{ label: "About", to: "/about" },
			{ label: "Contact", to: "/contact" },
		],
		[]
	);

	useEffect(() => {
		if (location.pathname === "/collection") {
			const params = new URLSearchParams(location.search);
			setSearchValue(params.get("search") || "");
		} else {
			setSearchValue("");
		}
		setMobileOpen(false);
		setSearchOpen(false);
	}, [location.pathname, location.search]);

	const handleSearchSubmit = (event) => {
		event.preventDefault();
		const query = searchValue.trim();
		if (query.length) {
			navigate(`/collection?search=${encodeURIComponent(query)}`);
		} else {
			navigate("/collection");
		}
		setMobileOpen(false);
		setSearchOpen(false);
	};

	const handleLogout = () => {
		logout();
		setMobileOpen(false);
	};

	const renderAuthLinks = (variant = "desktop") => {
		if (user) {
			return (
				<button
					onClick={handleLogout}
					className={
						variant === "desktop"
							? "inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-700 transition hover:border-black/40"
							: "flex items-center gap-3 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
					}
				>
					<LogOut size={16} />
					<span>Logout</span>
				</button>
			);
		}

		return (
			<div
				className={
					variant === "desktop"
						? "flex items-center gap-3"
						: "flex flex-col gap-4"
				}
			>
				<Link
					to="/login"
					onClick={() => setMobileOpen(false)}
					className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-700 transition hover:border-black/40"
				>
					<LogIn size={16} />
					<span>Login</span>
				</Link>
				<Link
					to="/signup"
					onClick={() => setMobileOpen(false)}
					className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-black"
				>
					<UserPlus size={16} />
					<span>Sign up</span>
				</Link>
			</div>
		);
	};

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="flex h-20 items-center justify-between gap-6">
					<div className="flex items-center gap-8">
						<Link to="/" className="flex items-center gap-2 text-xl font-semibold tracking-[0.3em] text-gray-900">
							<ShoppingCart size={26} />
							<span>SHOP</span>
						</Link>
						<nav className="hidden lg:flex items-center gap-6 text-sm font-semibold uppercase tracking-[0.3em] text-gray-600">
							{navLinks.map((link) => {
								const isActive = location.pathname === link.to;
								return (
									<Link
										key={link.to}
										to={link.to}
										className={`transition hover:text-gray-900 ${isActive ? "text-gray-900" : ""}`}
									>
											{link.label}
										</Link>
								);
							})}
						</nav>
					</div>

					<div className="flex flex-1 items-center justify-end gap-3">
						<form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm shadow-sm focus-within:border-black/40">
							<Search size={18} className="text-gray-400" />
							<input
								type="search"
								placeholder="Search pieces"
								value={searchValue}
								onChange={(event) => setSearchValue(event.target.value)}
								className="w-40 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
							/>
						</form>

						<button
							onClick={() => setSearchOpen((prev) => !prev)}
							className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-gray-600 transition hover:border-black/40 md:hidden"
							aria-label="Toggle search"
						>
							<Search size={18} />
						</button>

						<Link
							to="/cart"
							className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-gray-700 transition hover:border-black/40"
							onClick={() => setMobileOpen(false)}
							aria-label="Cart"
						>
							<ShoppingCart size={20} />
							{cart.length > 0 && (
								<span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-semibold text-white">
									{cart.length}
								</span>
							)}
						</Link>

						{isAdmin && (
							<Link
								to="/secret-dashboard"
								onClick={() => setMobileOpen(false)}
								className="hidden items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-700 transition hover:border-black/40 lg:inline-flex"
							>
								<Lock size={16} />
								<span>Admin</span>
							</Link>
						)}

						<div className="hidden md:flex items-center gap-3">
							{renderAuthLinks("desktop")}
						</div>

						<button
							onClick={() => setMobileOpen((prev) => !prev)}
							className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-gray-700 transition hover:border-black/40 lg:hidden"
							aria-label="Toggle menu"
						>
							{mobileOpen ? <X size={20} /> : <Menu size={20} />}
						</button>
					</div>
				</div>

				{searchOpen && (
					<div className="md:hidden">
						<form onSubmit={handleSearchSubmit} className="mt-3 flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm">
							<Search size={18} className="text-gray-400" />
							<input
								type="search"
								placeholder="Search pieces"
								value={searchValue}
								onChange={(event) => setSearchValue(event.target.value)}
								className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
							/>
							<button type="submit" className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
								Search
							</button>
						</form>
					</div>
				)}
			</div>

			{mobileOpen && (
				<div className="lg:hidden">
					<div className="mx-4 mt-4 space-y-4 rounded-3xl border border-black/10 bg-white px-6 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.1)]">
						<nav className="flex flex-col gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-600">
							{navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									onClick={() => setMobileOpen(false)}
									className="rounded-2xl px-4 py-3 transition hover:bg-gray-50"
								>
									{link.label}
								</Link>
							))}
							{isAdmin && (
								<Link
									to="/secret-dashboard"
									onClick={() => setMobileOpen(false)}
									className="rounded-2xl px-4 py-3 transition hover:bg-gray-50"
								>
									Admin dashboard
								</Link>
							)}
						</nav>

						<div className="border-t border-black/10 pt-4">
							{renderAuthLinks("mobile")}
						</div>
					</div>
				</div>
			)}
		</header>
	);
};
export default Navbar;
