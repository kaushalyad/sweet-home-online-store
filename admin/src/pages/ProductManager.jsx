import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaPlus, 
  FaImages, 
  FaTag, 
  FaPercent, 
  FaBoxOpen,
  FaArrowUp,
  FaArrowDown,
  FaCheck,
  FaExclamationTriangle,
  FaUpload,
  FaSpinner,
  FaInfoCircle,
  FaArrowLeft
} from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGES = 6;

const ProductManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const isAddMode = location.pathname === '/products/add';
  const isEditMode = !!id; // Convert to boolean
  const editId = id;

  console.log('ProductManager:', { 
    location: location.pathname, 
    id, 
    isEditMode, 
    isAddMode,
    fullParams: useParams(),
    pathname: window.location.pathname
  });

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
  const [images, setImages] = useState(Array(MAX_IMAGES).fill(null));
  const [existingImages, setExistingImages] = useState([]); // Store existing image URLs
  const [deletedImageIndexes, setDeletedImageIndexes] = useState([]); // Track deleted existing images
  const [imageErrors, setImageErrors] = useState(Array(MAX_IMAGES).fill(null));
  const [editMode, setEditMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  // Sweet categories with icons and descriptions
  const categories = [
    { 
      value: "traditional", 
      label: "Traditional Sweets",
      icon: "🍬",
      description: "Classic Indian sweets made with traditional recipes"
    },
    { 
      value: "milk", 
      label: "Milk-based Sweets",
      icon: "🥛",
      description: "Delicious sweets made with milk and dairy products"
    },
    { 
      value: "dryfruits", 
      label: "Dry Fruit Sweets",
      icon: "🌰",
      description: "Premium sweets enriched with dry fruits and nuts"
    },
    { 
      value: "bengali", 
      label: "Bengali Sweets",
      icon: "🍯",
      description: "Authentic Bengali sweets and delicacies"
    },
    { 
      value: "namkeen", 
      label: "Namkeens & Snacks",
      icon: "🥨",
      description: "Crispy and savory snacks and namkeens"
    },
    { 
      value: "festive", 
      label: "Festive Specials",
      icon: "🎉",
      description: "Special sweets for festivals and celebrations"
    },
    { 
      value: "giftbox", 
      label: "Gift Boxes",
      icon: "🎁",
      description: "Curated gift boxes and hampers"
    }
  ];

  // Sub-categories with descriptions
  const subCategories = {
    traditional: [
      { value: "barfi", label: "Barfi", description: "Sweet milk fudge" },
      { value: "ladoo", label: "Ladoo", description: "Round sweet balls" },
      { value: "halwa", label: "Halwa", description: "Sweet pudding" },
      { value: "peda", label: "Peda", description: "Milk-based sweet" }
    ],
    milk: [
      { value: "rasgulla", label: "Rasgulla", description: "Spongy cottage cheese balls" },
      { value: "gulab-jamun", label: "Gulab Jamun", description: "Milk-solid balls" },
      { value: "rasmalai", label: "Rasmalai", description: "Cottage cheese in milk" },
      { value: "kalakand", label: "Kalakand", description: "Milk cake" }
    ],
    // ... rest of your subcategories
  };

  // Fetch products on component mount
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  // Modify useEffect to handle edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      if (products.length > 0) {
        const product = products.find(p => p._id === editId);
        if (product) {
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
          // Store existing images from the product
          setExistingImages(product.image || []);
          setImages(Array(MAX_IMAGES).fill(null));
        } else if (token) {
          // If product not found in list, fetch it directly
          fetchProductById(editId);
        }
      } else if (token) {
        // If products not loaded yet, fetch product directly
        fetchProductById(editId);
      }
    }
  }, [isEditMode, editId, products, token]);

  // Fetch a specific product by ID
  const fetchProductById = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/single/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const product = response.data.product;
      if (product) {
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
        setExistingImages(product.image || []);
        setImages(Array(MAX_IMAGES).fill(null));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      navigate('/products');
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image validation
  const validateImage = (file) => {
    if (!file) return null;
    
    const errors = [];
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      errors.push('Only JPG, PNG and WebP images are allowed');
    }
    if (file.size > MAX_IMAGE_SIZE) {
      errors.push('Image size should be less than 5MB');
    }
    
    return errors.length > 0 ? errors.join(', ') : null;
  };

  // Handle image change
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      setImageErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = error;
        return newErrors;
      });
      return;
    }

    setImageErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = null;
      return newErrors;
    });

    setImages(prev => {
      const newImages = [...prev];
      newImages[index] = file;
      return newImages;
    });
  };

  // Handle image removal
  const handleImageRemove = (index) => {
    if (existingImages[index]) {
      // Mark existing image for deletion
      setDeletedImageIndexes(prev => [...prev, index]);
    }
    
    setImages(prev => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
    
    setExistingImages(prev => {
      const newExisting = [...prev];
      newExisting[index] = null;
      return newExisting;
    });
    
    setImageErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = null;
      return newErrors;
    });
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files).slice(0, MAX_IMAGES);
    const newImages = [...images];
    const newErrors = [...imageErrors];

    files.forEach((file, index) => {
      const error = validateImage(file);
      if (error) {
        newErrors[index] = error;
      } else {
        newImages[index] = file;
        newErrors[index] = null;
      }
    });

    setImages(newImages);
    setImageErrors(newErrors);
  };

  // Handle image reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    // Reorder images array
    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(sourceIndex, 1);
    reorderedImages.splice(destIndex, 0, movedImage);

    // Reorder existingImages array to keep them in sync
    const reorderedExistingImages = Array.from(existingImages);
    const [movedExistingImage] = reorderedExistingImages.splice(sourceIndex, 1);
    reorderedExistingImages.splice(destIndex, 0, movedExistingImage);

    // Reorder imageErrors array to keep them in sync
    const reorderedErrors = Array.from(imageErrors);
    const [movedError] = reorderedErrors.splice(sourceIndex, 1);
    reorderedErrors.splice(destIndex, 0, movedError);

    // Update all states together
    setImages(reorderedImages);
    setExistingImages(reorderedExistingImages);
    setImageErrors(reorderedErrors);
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append product data
      Object.keys(productForm).forEach(key => {
        if (key === 'tags') {
          formData.append('tags', JSON.stringify(productForm[key]));
        } else {
          formData.append(key, productForm[key]);
        }
      });

      if (isEditMode) {
        // In edit mode, build final image array:
        // 1. Keep existing images that weren't deleted
        // 2. Add new images
        const finalImages = [];
        
        // Process each slot
        for (let i = 0; i < MAX_IMAGES; i++) {
          if (images[i]) {
            // New image uploaded at this position
            formData.append('images', images[i]);
          } else if (existingImages[i] && !deletedImageIndexes.includes(i)) {
            // Existing image that should be kept
            finalImages.push(existingImages[i]);
          }
        }
        
        // If we have images to keep, send them as JSON
        if (finalImages.length > 0) {
          formData.append('existingImages', JSON.stringify(finalImages));
        }
      } else {
        // Add mode - append new images
        images.forEach((image, index) => {
          if (image) {
            if (index === 0) {
              formData.append('mainImage', image);
            } else {
              formData.append('images', image);
            }
          }
        });
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (isEditMode) {
        await axios.put(`${backendUrl}/api/product/update/${editId}`, formData, config);
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${backendUrl}/api/product/add`, formData, config);
        toast.success('Product added successfully');
      }

      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  // Edit a product
  const editProduct = (product) => {
    // Navigate to edit page
    navigate(`/products/edit/${product._id}`);
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await axios.delete(`${backendUrl}/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error(error.response?.data?.message || 'Failed to delete product');
      } finally {
        setLoading(false);
      }
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
    setImages(Array(MAX_IMAGES).fill(null));
    setExistingImages([]);
    setDeletedImageIndexes([]);
    setEditMode(false);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Modify the return statement to handle different views
  if (isAddMode || isEditMode) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Products
          </button>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <FaBoxOpen className="mr-2" /> Basic Information
                </h2>
                
                <div>
                  <label className="block mb-2 font-medium" htmlFor="name">
                    Product Name*
                    {formErrors.name && (
                      <span className="text-red-500 text-sm ml-2">{formErrors.name}</span>
                    )}
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={productForm.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.name ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-pink-400'
                    }`}
                    type="text"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium" htmlFor="price">
                      Price (₹)*
                      {formErrors.price && (
                        <span className="text-red-500 text-sm ml-2">{formErrors.price}</span>
                      )}
                    </label>
                    <input
                      id="price"
                      name="price"
                      value={productForm.price}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.price ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-pink-400'
                      }`}
                      type="number"
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium" htmlFor="discountPrice">
                      Discount Price (₹)
                      {formErrors.discountPrice && (
                        <span className="text-red-500 text-sm ml-2">{formErrors.discountPrice}</span>
                      )}
                    </label>
                    <input
                      id="discountPrice"
                      name="discountPrice"
                      value={productForm.discountPrice}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.discountPrice ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-pink-400'
                      }`}
                      type="number"
                      placeholder="Enter discount price"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium" htmlFor="description">
                    Description*
                    {formErrors.description && (
                      <span className="text-red-500 text-sm ml-2">{formErrors.description}</span>
                    )}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={productForm.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.description ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-pink-400'
                    }`}
                    rows="4"
                    placeholder="Enter product description"
                  ></textarea>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <FaTag className="mr-2" /> Categories
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium" htmlFor="category">
                      Category*
                      {formErrors.category && (
                        <span className="text-red-500 text-sm ml-2">{formErrors.category}</span>
                      )}
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={productForm.category}
                      onChange={(e) => {
                        handleChange(e);
                        setProductForm(prev => ({
                          ...prev,
                          subCategory: subCategories[e.target.value]?.[0]?.value || ""
                        }));
                      }}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.category ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-pink-400'
                      }`}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium" htmlFor="subCategory">
                      Sub-Category*
                      {formErrors.subCategory && (
                        <span className="text-red-500 text-sm ml-2">{formErrors.subCategory}</span>
                      )}
                    </label>
                    <select
                      id="subCategory"
                      name="subCategory"
                      value={productForm.subCategory}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.subCategory ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-pink-400'
                      }`}
                    >
                      {subCategories[productForm.category]?.map(subCat => (
                        <option key={subCat.value} value={subCat.value}>
                          {subCat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <FaImages className="mr-2" /> Product Images
                </h2>

                {formErrors.images && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {formErrors.images}
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Upload up to {MAX_IMAGES} images. Drag and drop supported. Max size: 5MB per image.
                    Supported formats: JPG, PNG, WebP
                  </p>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`grid grid-cols-3 gap-4 p-4 rounded-lg border-2 border-dashed ${
                          dragOver ? 'border-pink-400 bg-pink-50' : 'border-gray-300'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        {images.map((image, index) => (
                          <Draggable key={index} draggableId={`image-${index}`} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="relative group"
                              >
                                <label 
                                  htmlFor={`image${index}`}
                                  className="relative cursor-pointer border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center hover:border-pink-400 transition-colors overflow-hidden"
                                >
                                  {image ? (
                                    <>
                                      <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index + 1}`}
                                        className="h-full w-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleImageRemove(index);
                                          }}
                                          className="bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <FaTimes size={14} />
                                        </button>
                                      </div>
                                    </>
                                  ) : existingImages[index] ? (
                                    <>
                                      <img
                                        src={existingImages[index]}
                                        alt={`Existing ${index + 1}`}
                                        className="h-full w-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center gap-2">
                                        <span className="text-white text-xs bg-green-500 px-2 py-1 rounded">
                                          Current Image
                                        </span>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleImageRemove(index);
                                          }}
                                          className="bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                          title="Delete this image"
                                        >
                                          <FaTimes size={14} />
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-gray-400 flex flex-col items-center">
                                      <FaUpload size={24} />
                                      <span className="text-xs mt-2">Image {index + 1}</span>
                                    </div>
                                  )}
                                  <input
                                    type="file"
                                    id={`image${index}`}
                                    onChange={(e) => handleImageChange(e, index)}
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/webp"
                                  />
                                </label>
                                {imageErrors[index] && (
                                  <div className="absolute -bottom-6 left-0 right-0 text-xs text-red-500">
                                    {imageErrors[index]}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <FaInfoCircle className="mr-2" /> Additional Details
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium" htmlFor="stock">
                      Stock Quantity
                      {formErrors.stock && (
                        <span className="text-red-500 text-sm ml-2">{formErrors.stock}</span>
                      )}
                    </label>
                    <input
                      id="stock"
                      name="stock"
                      value={productForm.stock}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.stock ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-pink-400'
                      }`}
                      type="number"
                      placeholder="Enter stock quantity"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium" htmlFor="weight">
                      Weight
                      {formErrors.weight && (
                        <span className="text-red-500 text-sm ml-2">{formErrors.weight}</span>
                      )}
                    </label>
                    <input
                      id="weight"
                      name="weight"
                      value={productForm.weight}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.weight ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-pink-400'
                      }`}
                      type="text"
                      placeholder="e.g., 250g, 1kg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium" htmlFor="ingredients">
                    Ingredients
                  </label>
                  <textarea
                    id="ingredients"
                    name="ingredients"
                    value={productForm.ingredients}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    rows="2"
                    placeholder="List of ingredients"
                  ></textarea>
                </div>

                <div>
                  <label className="block mb-2 font-medium" htmlFor="nutrition">
                    Nutritional Information
                  </label>
                  <textarea
                    id="nutrition"
                    name="nutrition"
                    value={productForm.nutrition}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    rows="2"
                    placeholder="Nutritional value details"
                  ></textarea>
                </div>

                <div>
                  <label className="block mb-2 font-medium" htmlFor="storage">
                    Storage Instructions
                  </label>
                  <textarea
                    id="storage"
                    name="storage"
                    value={productForm.storage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    rows="2"
                    placeholder="How to store the product"
                  ></textarea>
                </div>

                <div>
                  <label className="block mb-2 font-medium" htmlFor="shelfLife">
                    Shelf Life
                  </label>
                  <input
                    id="shelfLife"
                    name="shelfLife"
                    value={productForm.shelfLife}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    type="text"
                    placeholder="e.g., 7 days"
                  />
                </div>

                <div className="flex flex-wrap gap-4">
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
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <FaTag className="mr-2" /> Tags
                </h2>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {productForm.tags.map(tag => (
                    <div key={tag} className="bg-pink-100 text-pink-800 text-sm px-3 py-1.5 rounded-full flex items-center">
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-pink-800 hover:text-pink-900"
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
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-400"
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

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      {isEditMode ? "Update Product" : "Add Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Product Preview</h2>
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  image && (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                ))}
                {existingImages.map((imageUrl, index) => (
                  !images[index] && imageUrl && (
                    <div key={`existing-${index}`} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imageUrl}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                ))}
              </div>

              {/* Product Info Preview */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{productForm.name || "Product Name"}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-pink-600">
                    ₹{productForm.price || "0"}
                  </span>
                  {productForm.discountPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ₹{productForm.discountPrice}
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{productForm.description || "Product description"}</p>
                
                {/* Category Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded-full">
                    {categories.find(c => c.value === productForm.category)?.label || "Category"}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {subCategories[productForm.category]?.find(s => s.value === productForm.subCategory)?.label || "Sub-category"}
                  </span>
                </div>

                {/* Product Tags */}
                {productForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {productForm.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Product Flags */}
                <div className="flex flex-wrap gap-2">
                  {productForm.bestseller && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                      Bestseller
                    </span>
                  )}
                  {productForm.featured && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  {productForm.newArrival && (
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      New Arrival
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product List View
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => navigate('/products/add')}
          className="flex items-center bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
        >
          <FaPlus className="mr-2" />
          Add New Product
        </button>
      </div>

      {/* Product List Section */}
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