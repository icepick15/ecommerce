import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products
		res.json({ products });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		// Try to get from Redis cache first
		let featuredProducts = null;
		try {
			featuredProducts = await redis.get("featured_products");
			if (featuredProducts) {
				return res.json(JSON.parse(featuredProducts));
			}
		} catch (redisError) {
			console.error('Redis get error:', redisError.message);
			// Continue to fetch from MongoDB if Redis fails
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts || featuredProducts.length === 0) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// Try to store in redis for future quick access
		try {
			await redis.set("featured_products", JSON.stringify(featuredProducts));
		} catch (redisError) {
			console.error('Redis set error:', redisError.message);
			// Continue even if cache update fails
		}

		res.json(featuredProducts);
	} catch (error) {
		console.error('Get featured products error:', error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, images, category, subCategory, sizes, bestseller } = req.body;

		let cloudinaryResponse = null;
		let uploadedImages = [];

		// Upload main image
		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		// Upload additional images
		if (images && Array.isArray(images)) {
			for (const img of images) {
				const result = await cloudinary.uploader.upload(img, { folder: "products" });
				uploadedImages.push(result.secure_url);
			}
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			images: uploadedImages,
			category,
			subCategory,
			sizes: sizes || [],
			bestseller: bestseller || false,
		});

		res.status(201).json(product);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
			} catch (error) {
				// Silently handle cloudinary cleanup errors
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			
			// Update cache but don't fail if Redis is unavailable
			updateFeaturedProductsCache().catch(err => {
				console.error('Failed to update Redis cache:', err.message);
			});
			
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.error('Toggle featured error:', error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
		console.log('✅ Featured products cache updated');
	} catch (error) {
		// Log but don't throw - cache update is not critical
		console.error('Redis cache update failed:', error.message);
	}
}
