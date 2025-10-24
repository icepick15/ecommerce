import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		images: {
			type: [String],
			default: [],
		},
		category: {
			type: String,
			required: true,
			enum: ["Men", "Women", "Kids"],
		},
		subCategory: {
			type: String,
			required: true,
			enum: ["Topwear", "Bottomwear", "Winterwear", "Footwear", "Accessories"],
		},
		sizes: {
			type: [String],
			default: [],
		},
		bestseller: {
			type: Boolean,
			default: false,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
