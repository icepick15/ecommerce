import { Link } from "react-router-dom";
import { ShoppingCart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
	return (
		<footer className='bg-gray-900 text-gray-300'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
					{/* Company Info */}
					<div>
						<Link to='/' className='flex items-center gap-2 text-white mb-4'>
							<ShoppingCart size={24} />
							<span className='text-xl font-bold'>SHOP</span>
						</Link>
						<p className='text-sm text-gray-400 mb-4'>
							Your trusted destination for quality products at unbeatable prices. Shop the latest trends in fashion.
						</p>
						<div className='flex gap-4'>
							<a href='#' className='hover:text-white transition-colors'>
								<Instagram size={20} />
							</a>
							<a href='#' className='hover:text-white transition-colors'>
								<Facebook size={20} />
							</a>
							<a href='#' className='hover:text-white transition-colors'>
								<Twitter size={20} />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className='text-white font-semibold mb-4'>COMPANY</h3>
						<ul className='space-y-2'>
							<li>
								<Link to='/' className='text-sm hover:text-white transition-colors'>
									Home
								</Link>
							</li>
							<li>
								<Link to='/about' className='text-sm hover:text-white transition-colors'>
									About Us
								</Link>
							</li>
							<li>
								<Link to='/cart' className='text-sm hover:text-white transition-colors'>
									Delivery
								</Link>
							</li>
							<li>
								<Link to='/privacy' className='text-sm hover:text-white transition-colors'>
									Privacy Policy
								</Link>
							</li>
						</ul>
					</div>

					{/* Categories */}
					<div>
						<h3 className='text-white font-semibold mb-4'>CATEGORIES</h3>
						<ul className='space-y-2'>
							<li>
								<Link to='/jeans' className='text-sm hover:text-white transition-colors'>
									Jeans
								</Link>
							</li>
							<li>
								<Link to='/t-shirts' className='text-sm hover:text-white transition-colors'>
									T-Shirts
								</Link>
							</li>
							<li>
								<Link to='/shoes' className='text-sm hover:text-white transition-colors'>
									Shoes
								</Link>
							</li>
							<li>
								<Link to='/jackets' className='text-sm hover:text-white transition-colors'>
									Jackets
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className='text-white font-semibold mb-4'>GET IN TOUCH</h3>
						<ul className='space-y-3'>
							<li className='flex items-start gap-2 text-sm'>
								<Phone size={18} className='mt-0.5 flex-shrink-0' />
								<span>+234-800-000-0000</span>
							</li>
							<li className='flex items-start gap-2 text-sm'>
								<Mail size={18} className='mt-0.5 flex-shrink-0' />
								<span>support@shop.com</span>
							</li>
							<li className='flex items-start gap-2 text-sm'>
								<MapPin size={18} className='mt-0.5 flex-shrink-0' />
								<span>Lagos, Nigeria</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='border-t border-gray-800 pt-8'>
					<div className='flex flex-col md:flex-row justify-between items-center gap-4'>
						<p className='text-sm text-gray-400'>
							Copyright {new Date().getFullYear()} © shop.com - All Rights Reserved.
						</p>
						<div className='flex gap-6 text-sm'>
							<Link to='/terms' className='hover:text-white transition-colors'>
								Terms of Service
							</Link>
							<Link to='/privacy' className='hover:text-white transition-colors'>
								Privacy Policy
							</Link>
							<Link to='/refund' className='hover:text-white transition-colors'>
								Refund Policy
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
