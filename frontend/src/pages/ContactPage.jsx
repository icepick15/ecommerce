import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const initialForm = { name: "", email: "", message: "" };

const ContactPage = () => {
	const [form, setForm] = useState(initialForm);
	const [submitting, setSubmitting] = useState(false);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
			toast.error("Please fill in all fields.");
			return;
		}
		setSubmitting(true);
		await new Promise((resolve) => setTimeout(resolve, 900));
		toast.success("Message sent. We’ll reply shortly!");
		setForm(initialForm);
		setSubmitting(false);
	};

	return (
		<div className="min-h-screen bg-[#f9f7f4] text-gray-900">
			<section className="border-b border-black/5 bg-white">
				<div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
					<p className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-600">
						Let’s talk
					</p>
					<h1 className="text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
						We’re here for fittings, consultations, and styling questions.
					</h1>
					<p className="mt-6 max-w-3xl text-lg text-gray-600">
						Send us a note and our client services team will follow up within one working day. Prefer to speak? Call the studio and we’ll schedule a styling session.
					</p>
				</div>
			</section>

			<section className="py-20">
				<div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
					<motion.form
						onSubmit={handleSubmit}
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="space-y-5 rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
					>
						<div>
							<label className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500" htmlFor="name">
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={form.name}
								onChange={handleChange}
								className="mt-2 w-full rounded-full border border-black/10 bg-[#f6f2ea] px-5 py-3 text-sm font-medium text-gray-700 focus:border-black/40 focus:outline-none"
								placeholder="Your full name"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500" htmlFor="email">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								className="mt-2 w-full rounded-full border border-black/10 bg-[#f6f2ea] px-5 py-3 text-sm font-medium text-gray-700 focus:border-black/40 focus:outline-none"
								placeholder="name@email.com"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500" htmlFor="message">
								Message
							</label>
							<textarea
								id="message"
								name="message"
								value={form.message}
								onChange={handleChange}
								className="mt-2 h-36 w-full rounded-3xl border border-black/10 bg-[#f6f2ea] px-5 py-4 text-sm font-medium text-gray-700 focus:border-black/40 focus:outline-none"
								placeholder="How can we help?"
								required
							/>
						</div>
						<button
							type="submit"
							disabled={submitting}
							className="w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-black disabled:opacity-60"
						>
							{submitting ? "Sending…" : "Send message"}
						</button>
					</motion.form>

					<div className="space-y-8 rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
						<h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-600">Studio contact</h2>
						<div className="space-y-4 text-sm text-gray-600">
							<p>
								<span className="font-semibold text-gray-900">Client services:</span> hello@shopquietluxury.com
							</p>
							<p>
								<span className="font-semibold text-gray-900">Phone:</span> +234 (0)1 800 9200
							</p>
							<p>
								<span className="font-semibold text-gray-900">Appointments:</span> weekdays 9am – 6pm
							</p>
							<p>
								<span className="font-semibold text-gray-900">Showroom:</span> 215 Victoria Island, Lagos
							</p>
						</div>
						<div className="rounded-3xl bg-[#111827] p-6 text-white">
							<h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">WhatsApp stylists</h3>
							<p className="mt-3 text-sm text-white/70">
								Chat with our stylists for quick sizing checks or capsule advice Monday to Saturday.
							</p>
							<a
								href="https://wa.me/2347000000000"
								target="_blank"
								rel="noreferrer"
								className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-900 transition hover:bg-gray-100"
							>
								Start chat
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ContactPage;
