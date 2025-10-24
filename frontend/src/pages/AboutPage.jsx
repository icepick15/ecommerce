import { motion } from "framer-motion";

const timeline = [
	{ year: "2016", title: "Brand founded", description: "Started as a bespoke atelier crafting capsule wardrobes for creatives." },
	{ year: "2019", title: "Expanded collections", description: "Introduced seasonal ready-to-wear built around modular design principles." },
	{ year: "2023", title: "Global community", description: "Serving clients in 35+ countries with a focus on thoughtful sourcing and responsible production." },
];

const values = [
	{ title: "Intentional design", description: "Each piece is pattern-cut with ease and longevity in mind, using premium natural fabrics." },
	{ title: "Responsible sourcing", description: "We partner with mills and ateliers that share our standards for fair labor and low-impact production." },
	{ title: "Client first", description: "Our stylists curate edits that adapt to your lifestyle so you invest in fewer, better pieces." },
];

const AboutPage = () => {
	return (
		<div className="min-h-screen bg-[#f9f7f4] text-gray-900">
			<section className="border-b border-black/5 bg-white">
				<div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
					<p className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-600">
						Our story
					</p>
					<h1 className="text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
						Quiet luxury crafted for everyday rhythm.
					</h1>
					<p className="mt-6 max-w-3xl text-lg text-gray-600">
						We design modular wardrobes built around elevated essentials that move with you. From our studio in Lagos, our team develops timeless silhouettes, prioritising quality fabrics and fair production partners.
					</p>
				</div>
			</section>

			<section className="py-20">
				<div className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl font-semibold uppercase tracking-[0.35em] text-gray-600">Milestones</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{timeline.map((item) => (
							<motion.div
								key={item.year}
								initial={{ opacity: 0, y: 24 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								viewport={{ once: true }}
								className="rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
							>
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">{item.year}</p>
								<h3 className="mt-3 text-lg font-semibold text-gray-900">{item.title}</h3>
								<p className="mt-2 text-sm text-gray-600">{item.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<section className="border-y border-black/5 bg-white py-20">
				<div className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl font-semibold uppercase tracking-[0.35em] text-gray-600">Values</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{values.map((value) => (
							<div key={value.title} className="rounded-[24px] border border-black/10 bg-[#fdfbf7] p-6">
								<h3 className="text-lg font-semibold text-gray-900">{value.title}</h3>
								<p className="mt-2 text-sm text-gray-600">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-20">
				<div className="mx-auto max-w-4xl rounded-[28px] border border-black/10 bg-white px-6 py-12 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:px-10">
					<h2 className="text-2xl font-semibold uppercase tracking-[0.35em] text-gray-600">Studio details</h2>
					<div className="mt-6 grid gap-6 sm:grid-cols-2">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Location</p>
							<p className="mt-3 text-sm text-gray-700">215 Victoria Island, Lagos, Nigeria</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Studio hours</p>
							<p className="mt-3 text-sm text-gray-700">Mon – Sat • 9am to 6pm WAT</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Client services</p>
							<p className="mt-3 text-sm text-gray-700">hello@shopquietluxury.com</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Phone</p>
							<p className="mt-3 text-sm text-gray-700">+234 (0)1 800 9200</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default AboutPage;
