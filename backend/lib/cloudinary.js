import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

// Lazy configuration - will be called on first use
const configureCloudinary = () => {
	if (!isConfigured) {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});
		isConfigured = true;
	}
};

// Proxy to ensure configuration happens before any cloudinary method is called
export default new Proxy(cloudinary, {
	get(target, prop) {
		configureCloudinary();
		return target[prop];
	}
});
