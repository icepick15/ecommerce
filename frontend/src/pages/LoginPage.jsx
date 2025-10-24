import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader, Lock, LogIn, Mail, Shield } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading } = useUserStore();

	const handleSubmit = (event) => {
		event.preventDefault();
		login(email.trim(), password);
	};

	return (
		<div className="min-h-screen bg-[#f9f7f4] py-16 text-gray-900">
			<div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
				<motion.section
					className="flex flex-col justify-center gap-6"
					initial={{ opacity: 0, x: -30 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
						<Shield className="h-4 w-4" /> Welcome back
					</span>
					<h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
						Pick up where you left off—your wardrobe is waiting.
					</h1>
					<p className="max-w-lg text-sm text-gray-600">
						Sign in to manage carts, track bespoke deliveries, and stay aligned with upcoming releases tailored to your style.
					</p>
					<div className="flex flex-wrap gap-3 pt-4 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
						<span className="rounded-full bg-white px-4 py-2 shadow">Secure access</span>
						<span className="rounded-full bg-white px-4 py-2 shadow">Real-time tracking</span>
						<span className="rounded-full bg-white px-4 py-2 shadow">Member perks</span>
					</div>
				</motion.section>

				<motion.section
					className="self-center rounded-[36px] border border-black/10 bg-white/90 p-8 shadow-[0_24px_65px_rgba(15,23,42,0.08)]"
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, delay: 0.1 }}
				>
					<header className="flex flex-col gap-2 pb-6">
						<span className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Login</span>
						<h2 className="text-3xl font-semibold text-gray-900">Access your account</h2>
						<p className="text-sm text-gray-500">Your saved carts, preferences, and exclusive offers are right where you left them.</p>
					</header>

					<form onSubmit={handleSubmit} className="mt-6 space-y-6">
						<AuthInput
							id="email"
							label="Email address"
							placeholder="you@example.com"
							icon={Mail}
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							type="email"
							autoComplete="email"
							required
						/>
						<AuthInput
							id="password"
							label="Password"
							placeholder="••••••••"
							icon={Lock}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							type="password"
							autoComplete="current-password"
							required
						/>

						<button
							type="submit"
							className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-600"
							disabled={loading}
						>
							{loading ? <Loader className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
							{loading ? "Authenticating" : "Sign in"}
						</button>
					</form>

					<p className="mt-8 text-center text-sm text-gray-500">
						New here?{" "}
						<Link to="/signup" className="font-semibold text-gray-900 underline decoration-dotted underline-offset-4">
							Create an account <ArrowRight className="inline h-4 w-4 align-middle" />
						</Link>
					</p>
				</motion.section>
			</div>
		</div>
	);
};
export default LoginPage;

const AuthInput = ({ id, label, icon: Icon, type = "text", autoComplete, placeholder, value, onChange, required }) => (
	<label htmlFor={id} className="block space-y-2 text-sm text-gray-600">
		<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
			{label}
		</span>
		<div className="relative">
			<span className="pointer-events-none absolute inset-y-0 left-4 inline-flex items-center text-gray-400">
				<Icon className="h-4 w-4" />
			</span>
			<input
				id={id}
				type={type}
				autoComplete={autoComplete}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				required={required}
				className="w-full rounded-full border border-black/10 bg-white px-12 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black/40 focus:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
			/>
		</div>
	</label>
);
