import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowRight, Loader, Lock, Mail, Sparkles, User, UserPlus } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading } = useUserStore();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    signup({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
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
            <Sparkles className="h-4 w-4" /> Join the collective
          </span>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Curated access to modern luxury, tailored around you.
          </h1>
          <p className="max-w-lg text-sm text-gray-600">
            Create an account to unlock seamless checkout, track bespoke orders, and receive early invitations to the next
            drop.
          </p>
          <div className="flex flex-wrap gap-3 pt-4 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
            <span className="rounded-full bg-white px-4 py-2 shadow">Express checkout</span>
            <span className="rounded-full bg-white px-4 py-2 shadow">Concierge support</span>
            <span className="rounded-full bg-white px-4 py-2 shadow">Exclusive previews</span>
          </div>
        </motion.section>

        <motion.section
          className="self-center rounded-[36px] border border-black/10 bg-white/90 p-8 shadow-[0_24px_65px_rgba(15,23,42,0.08)]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <header className="flex flex-col gap-2 pb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Sign up</span>
            <h2 className="text-3xl font-semibold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-500">It takes less than a minute to become part of the Quiet Luxury insiders list.</p>
          </header>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <AuthInput
              id="name"
              label="Full name"
              placeholder="Adaora Lawson"
              icon={User}
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              autoComplete="name"
              required
            />
            <AuthInput
              id="email"
              label="Email address"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              type="email"
              autoComplete="email"
              required
            />
            <AuthInput
              id="password"
              label="Password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              type="password"
              autoComplete="new-password"
              required
            />
            <AuthInput
              id="confirmPassword"
              label="Confirm password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              type="password"
              autoComplete="new-password"
              required
            />

            <button
              type="submit"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-600"
              disabled={loading}
            >
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {loading ? "Creating" : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-gray-900 underline decoration-dotted underline-offset-4">
              Sign in <ArrowRight className="inline h-4 w-4 align-middle" />
            </Link>
          </p>
        </motion.section>
      </div>
    </div>
  );
};
export default SignUpPage;

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
