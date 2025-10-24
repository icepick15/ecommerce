import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		const createProductPromise = axios.post("/products", productData);
		toast.promise(createProductPromise, {
			loading: "Saving product…",
			success: "Product added to catalog",
			error: (error) => error?.response?.data?.error || "Failed to create product",
		});
		try {
			const res = await createProductPromise;
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			return { success: true, product: res.data };
		} catch (error) {
			set({ loading: false });
			return {
				success: false,
				error: error?.response?.data?.error || "Failed to create product",
			};
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error?.response?.data?.error || "Failed to fetch products");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error?.response?.data?.error || "Failed to fetch products");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success("Product removed from catalog");
		} catch (error) {
			set({ loading: false });
			toast.error(error?.response?.data?.error || "Failed to delete product");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			const { isFeatured } = response.data;
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured } : product
				),
				loading: false,
			}));
			toast.success(isFeatured ? "Product marked as featured" : "Product removed from featured");
		} catch (error) {
			set({ loading: false });
			toast.error(error?.response?.data?.error || "Failed to update product");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));
