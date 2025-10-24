import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader, X } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["Men", "Women", "Kids"];
const subCategories = ["Topwear", "Bottomwear", "Winterwear", "Footwear", "Accessories"];
const availableSizes = ["S", "M", "L", "XL", "XXL"];

const initialProductState = {
  name: "",
  description: "",
  price: "",
  category: "",
  subCategory: "",
  sizes: [],
  bestseller: false,
  image: "",
  images: [],
};

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState(initialProductState);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...newProduct,
      price: Number(newProduct.price) || 0,
      image: newProduct.image || newProduct.images[0] || "",
    };

    const result = await createProduct(payload);
    if (result?.success) {
      setNewProduct(initialProductState);
      setImagePreviews([]);
    } else if (result?.error) {
      console.error("Error creating a product", result.error);
    }
  };

  const toggleSize = (size) => {
    setNewProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageData = reader.result;
        if (typeof imageData !== "string") return;

        setImagePreviews((prev) => [...prev, imageData]);
        setNewProduct((prev) => {
          const updatedImages = [...prev.images, imageData];
          return {
            ...prev,
            images: updatedImages,
            image: prev.image || imageData,
          };
        });
      };

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setNewProduct((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updatedImages,
        image: updatedImages[0] || "",
      };
    });
  };

  return (
    <motion.div
      className="rounded-[36px] border border-black/10 bg-white/90 p-8 shadow-[0_24px_65px_rgba(15,23,42,0.08)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex flex-col gap-2 border-b border-black/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Create product</span>
        <h2 className="text-3xl font-semibold text-gray-900">Add a new piece to the collection</h2>
        <p className="text-sm text-gray-500">
          Upload imagery, choose the right category, and highlight fit details to keep the catalog considered and
          cohesive.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <fieldset className="space-y-4">
          <legend className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Imagery</legend>
          <p className="text-sm text-gray-500">
            Upload up to four visuals. The first image becomes the primary thumbnail across the storefront.
          </p>
          <div className="flex flex-wrap gap-4">
            {imagePreviews.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative h-28 w-24 overflow-hidden rounded-[18px] border border-black/10 bg-black/5"
              >
                <img src={image} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
                    Main
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {imagePreviews.length < 4 && (
              <label className="flex h-28 w-24 cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-black/20 bg-[#f9f7f4] text-center transition hover:border-black/40">
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                <Upload className="h-5 w-5 text-gray-600" />
                <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">Upload</span>
              </label>
            )}
          </div>
        </fieldset>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Product name
            </label>
            <input
              type="text"
              id="name"
              value={newProduct.name}
              onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })}
              placeholder="Quiet luxury blazer"
              className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black/40 focus:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
              required
            />
            <label htmlFor="description" className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Description
            </label>
            <textarea
              id="description"
              value={newProduct.description}
              onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })}
              rows={6}
              placeholder="Cut from Italian wool with a relaxed drape and silky lining."
              className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black/40 focus:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
              required
            />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="category" className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Category
                </label>
                <select
                  id="category"
                  value={newProduct.category}
                  onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })}
                  className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black/40 focus:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                  required
                >
                  <option value="">Select</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="subCategory"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500"
                >
                  Sub-category
                </label>
                <select
                  id="subCategory"
                  value={newProduct.subCategory}
                  onChange={(event) => setNewProduct({ ...newProduct, subCategory: event.target.value })}
                  className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black/40 focus:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                  required
                >
                  <option value="">Select</option>
                  {subCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Price (₦)
              </label>
              <input
                type="number"
                id="price"
                value={newProduct.price}
                onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })}
                placeholder="45000"
                min="0"
                step="0.01"
                className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black/40 focus:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                required
              />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Available sizes</span>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map((size) => {
                  const isActive = newProduct.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`inline-flex min-w-[3rem] items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                        isActive
                          ? "border-black bg-black text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]"
                          : "border-black/10 bg-white text-gray-700 hover:bg-black/5"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="inline-flex items-center gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={newProduct.bestseller}
                onChange={(event) => setNewProduct({ ...newProduct, bestseller: event.target.checked })}
                className="h-4 w-4 rounded border-black/20 text-black focus:ring-black"
              />
              Highlight as bestseller
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-black/10 bg-black/5 px-5 py-4 text-sm text-gray-600">
          <p>
            Need to update later? You can edit imagery, pricing, or availability from the catalog tab without re-creating
            the product.
          </p>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-600"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              "Save product"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
