import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaImages, FaTag, FaPercent, FaBoxOpen } from "react-icons/fa";

const ProductManager = ({ token }) => {
  // Product form state
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "traditional",
    subCategory: "milk-based",
    stock: 100,
    bestseller: false,
    featured: false,
    newArrival: false,
    ingredients: "",
    nutrition: "",
    weight: "",
    shelfLife: "",
    storage: "",
    tags: []
  });

  // UI state
  const [images, setImages] = useState([null, null, null, null]);
  const [editMode, setEditMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sweet categories
  const categories = [
    { value: "traditional", label: "Traditional Sweets" },
    { value: "milk", label: "Milk-based Sweets" },
    { value: "dryfruits", label: "Dry Fruit Sweets" },
    { value: "bengali", label: "Bengali Sweets" },
    { value: "namkeen", label: "Namkeens & Snacks" },
    { value: "festive", label: "Festive Specials" },
    { value: "giftbox", label: "Gift Boxes" }
  ];

  // Sub-categories
  const subCategories = {
    traditional: ["barfi", "ladoo", "halwa", "peda"],
    milk: ["rasgulla", "gulab-jamun", "rasmalai", "kalakand"],
    dryfruits: ["kaju-barfi", "badam-barfi", "pista-roll"],
    bengali: ["sandesh", "cham-cham", "raj-bhog"],
    namkeen: ["mixture", "bhujia", "chakli", "mathri"],
    festive: ["diwali", "holi", "rakhi"],
    giftbox: ["small", "medium", "large", "premium"]
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image changes
  const handleImageChange = (e, index) => {
    const newImages = [...images];
    newImages[index] = e.target.files[0];
    setImages(newImages);
  };

  // Add a tag
  const addTag = () => {
    if (currentTag && !productForm.tags.includes(currentTag)) {
      setProductForm(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag]
      }));
      setCurrentTag("");
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setProductForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Submit product form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append all product data
      Object.keys(productForm).forEach(key => {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(productForm[key]));
        } else {
          formData.append(key, productForm[key]);
        }
      });

      // Append images if they exist
      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });

      let response;
      if (editMode) {
        response = await axios.post(
          `${backendUrl}/api/product/update`,
          formData,
          { headers: { token } }
        );
      } else {
        response = await axios.post(
          `${backendUrl}/api/product/add`,
          formData,
          { headers: { token } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        fetchProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  // Edit a product
  const editProduct = (product) => {
    setEditMode(true);
    
    // Set the form data
    setProductForm({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || "",
      category: product.category || "traditional",
      subCategory: product.subCategory || "milk-based",
      stock: product.stock || 100,
      bestseller: product.bestseller || false,
      featured: product.featured || false,
      newArrival: product.newArrival || false,
      ingredients: product.ingredients || "",
      nutrition: product.nutrition || "",
      weight: product.weight || "",
      shelfLife: product.shelfLife || "",
      storage: product.storage || "",
      tags: product.tags || []
    });

    // Reset images (they need to be re-uploaded when editing)
    setImages([null, null, null, null]);
    
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setProductForm({
      id: "",
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "traditional",
      subCategory: "milk-based",
      stock: 100,
      bestseller: false,
      featured: false,
      newArrival: false,
      ingredients: "",
      nutrition: "",
      weight: "",
      shelfLife: "",
      storage: "",
      tags: []
    });
    setImages([null, null, null, null]);
    setEditMode(false);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-6">{editMode ? "Edit Product" : "Add New Product"}</h1>
      
      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        {/* Image Upload Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <FaImages className="mr-2" /> Product Images
          </h2>
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => (
              <label 
                key={index} 
                htmlFor={`image${index}`}
                className="relative cursor-pointer border-2 border-dashed border-gray-300 rounded-md h-28 w-28 flex items-center justify-center hover:border-pink-400 transition-colors"
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover rounded-md"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <FaPlus size={20} />
                    <span className="text-xs mt-1">Image {index + 1}</span>
                  </div>
                )}
                <input
                  type="file"
                  id={`image${index}`}
                  onChange={(e) => handleImageChange(e, index)}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1 font-medium" htmlFor="name">Product Name*</label>
            <input
              id="name"
              name="name"
              value={productForm.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              type="text"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="price">Price (₹)*</label>
            <input
              id="price"
              name="price"
              value={productForm.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              type="number"
              placeholder="Enter price"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={productForm.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            rows="4"
            placeholder="Enter product description"
            required
          ></textarea>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1 font-medium" htmlFor="category">Category*</label>
            <select
              id="category"
              name="category"
              value={productForm.category}
              onChange={(e) => {
                handleChange(e);
                // Reset subcategory when category changes
                setProductForm(prev => ({
                  ...prev,
                  subCategory: subCategories[e.target.value]?.[0] || ""
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="subCategory">Sub-Category</label>
            <select
              id="subCategory"
              name="subCategory"
              value={productForm.subCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {subCategories[productForm.category]?.map(subCat => (
                <option key={subCat} value={subCat}>
                  {subCat.charAt(0).toUpperCase() + subCat.slice(1).replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="discountPrice">Discount Price (₹)</label>
            <input
              id="discountPrice"
              name="discountPrice"
              value={productForm.discountPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              type="number"
              placeholder="Enter discount price"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Tags</label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {productForm.tags.map(tag => (
              <div key={tag} className="bg-pink-100 text-pink-800 text-sm px-2 py-1 rounded-full flex items-center">
                <span>{tag}</span>
                <button 
                  type="button" 
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-pink-800 hover:text-pink-900"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              type="text"
              placeholder="Add a tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Toggle for advanced options */}
        <div className="mb-6">
          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-pink-600 hover:text-pink-700 font-medium flex items-center"
          >
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
            <span className="ml-2">{showAdvanced ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block mb-1 font-medium" htmlFor="stock">Stock Quantity</label>
                <input
                  id="stock"
                  name="stock"
                  value={productForm.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                  type="number"
                  placeholder="Enter stock quantity"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium" htmlFor="weight">Weight</label>
                <input
                  id="weight"
                  name="weight"
                  value={productForm.weight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                  type="text"
                  placeholder="e.g., 250g, 1kg"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium" htmlFor="shelfLife">Shelf Life</label>
                <input
                  id="shelfLife"
                  name="shelfLife"
                  value={productForm.shelfLife}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                  type="text"
                  placeholder="e.g., 7 days"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-medium" htmlFor="ingredients">Ingredients</label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={productForm.ingredients}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                rows="3"
                placeholder="List of ingredients"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-medium" htmlFor="nutrition">Nutritional Information</label>
              <textarea
                id="nutrition"
                name="nutrition"
                value={productForm.nutrition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                rows="3"
                placeholder="Nutritional value details"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-medium" htmlFor="storage">Storage Instructions</label>
              <textarea
                id="storage"
                name="storage"
                value={productForm.storage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                rows="2"
                placeholder="How to store the product"
              ></textarea>
            </div>
          </>
        )}

        {/* Product Flags */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <input
              id="bestseller"
              name="bestseller"
              type="checkbox"
              checked={productForm.bestseller}
              onChange={handleChange}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="bestseller" className="ml-2 block text-sm text-gray-700">
              Bestseller
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={productForm.featured}
              onChange={handleChange}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Featured
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="newArrival"
              name="newArrival"
              type="checkbox"
              checked={productForm.newArrival}
              onChange={handleChange}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="newArrival" className="ml-2 block text-sm text-gray-700">
              New Arrival
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors min-w-[120px]"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <FaSave className="mr-2" />
                {editMode ? "Update Product" : "Add Product"}
              </>
            )}
          </button>
          
          {editMode && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center justify-center bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-lg font-semibold mb-4 md:mb-0 flex items-center">
            <FaBoxOpen className="mr-2" /> Product Inventory
          </h2>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 w-full md:w-48"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-400 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found. {searchQuery && "Try a different search term."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={product.image[0]} 
                            alt={product.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                      <div className="text-sm text-gray-500 capitalize">{product.subCategory}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{product.price}</div>
                      {product.discountPrice && (
                        <div className="text-xs text-green-600">Sale: ₹{product.discountPrice}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {product.bestseller && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Bestseller
                          </span>
                        )}
                        {product.featured && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                        {product.newArrival && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            New
                          </span>
                        )}
                        {!(product.bestseller || product.featured || product.newArrival) && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Standard
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => editProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;