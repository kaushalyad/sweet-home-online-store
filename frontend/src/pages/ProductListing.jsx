import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import Title from "../components/Title";
import Buffer from "../components/Buffer";
import { 
  FaSort, 
  FaSortAmountDown, 
  FaSortAmountUp, 
  FaChevronDown, 
  FaFilter, 
  FaCheck, 
  FaStar, 
  FaSearch,
  FaTags,
  FaRupeeSign,
  FaArrowLeft,
  FaArrowRight
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ProductListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, search, setSearch } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showBestsellers, setShowBestsellers] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [sortType, setSortType] = useState("date-desc");

  // Animation variants
  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" }
  };

  // Sort options
  const sortOptions = [
    { value: "date-desc", label: "Newest First", icon: <FaSort /> },
    { value: "price-asc", label: "Price: Low to High", icon: <FaSortAmountUp /> },
    { value: "price-desc", label: "Price: High to Low", icon: <FaSortAmountDown /> },
    { value: "name-asc", label: "Name: A-Z", icon: <FaSort /> },
    { value: "name-desc", label: "Name: Z-A", icon: <FaSort /> },
    { value: "bestselling", label: "Best Selling", icon: <FaStar /> }
  ];

  // Find the currently selected sort option
  const selectedSortOption = sortOptions.find(option => option.value === sortType) || sortOptions[0];

  // Parse URL parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // If there's a search param in the URL, update both local and global search
    if (params.has('search')) {
      const searchParam = params.get('search');
      setSearchQuery(searchParam);
      setSearch(searchParam);
    } else if (search) {
      // If there's no search in URL but global search exists, use it and update URL
      setSearchQuery(search);
      params.set('search', search);
      navigate(`/products?${params.toString()}`, { replace: true });
    }
    
    if (params.has('category')) setSelectedCategory(params.get('category'));
    if (params.has('subcategory')) setSelectedSubCategory(params.get('subcategory'));
    if (params.has('page')) setCurrentPage(parseInt(params.get('page')));
    if (params.has('sort')) setSortType(params.get('sort'));
    if (params.has('min')) setPriceRange(prev => ({ ...prev, min: params.get('min') }));
    if (params.has('max')) setPriceRange(prev => ({ ...prev, max: params.get('max') }));
    if (params.has('bestseller')) setShowBestsellers(params.get('bestseller') === 'true');
    if (params.has('featured')) setShowFeatured(params.get('featured') === 'true');
    if (params.has('new')) setShowNewArrivals(params.get('new') === 'true');
    if (params.has('tags')) setSelectedTags(params.get('tags').split(','));
    
    fetchCategories();
    fetchProducts();
  }, [location.search, search]);

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedSubCategory && selectedSubCategory !== 'all') params.append('subCategory', selectedSubCategory);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      if (showBestsellers) params.append('bestseller', 'true');
      if (showFeatured) params.append('featured', 'true');
      if (showNewArrivals) params.append('newArrival', 'true');
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      
      // Add sorting and pagination
      params.append('sort', sortType);
      params.append('page', currentPage);
      params.append('limit', 12); // Items per page
      
      const response = await axios.get(`${backendUrl}/api/product/list?${params.toString()}`);
      
      if (response.data.success) {
        setProducts(response.data.products);
        setTotalProducts(response.data.pagination.total);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        console.error("Failed to fetch products:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filters
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/categories`);
      
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        console.error("Failed to fetch categories:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Apply filters and update URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
    if (selectedSubCategory && selectedSubCategory !== 'all') params.append('subCategory', selectedSubCategory);
    if (priceRange.min) params.append('min', priceRange.min);
    if (priceRange.max) params.append('max', priceRange.max);
    if (showBestsellers) params.append('bestseller', 'true');
    if (showFeatured) params.append('featured', 'true');
    if (showNewArrivals) params.append('new', 'true');
    if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
    params.append('sort', sortType);
    params.append('page', 1); // Reset to first page when filters change
    
    navigate(`/products?${params.toString()}`);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage);
    navigate(`/products?${params.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (value) => {
    const params = new URLSearchParams(location.search);
    params.set('sort', value);
    navigate(`/products?${params.toString()}`);
    setShowSortDropdown(false);
  };

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Custom checkbox component
  const Checkbox = ({ value, checked, onChange, label }) => (
    <label className="flex items-center gap-3 cursor-pointer py-1.5 hover:text-gray-900 transition-colors duration-200 group">
      <div className={`w-5 h-5 flex items-center justify-center rounded-md border transition-all duration-200 ${checked ? 'bg-pink-500 border-pink-500' : 'border-gray-300 bg-white group-hover:border-pink-300'}`}>
        {checked && <FaCheck className="text-white text-[10px]" />}
      </div>
      <span className="text-sm font-normal text-gray-700 group-hover:text-gray-900">{label}</span>
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only" // Hidden but accessible
      />
    </label>
  );

  // Get all unique tags from products
  const allTags = Array.from(new Set(
    products.flatMap(product => product.tags || [])
  )).sort();

  // Get subcategories for the selected category
  const subcategories = selectedCategory && selectedCategory !== 'all'
    ? categories.find(cat => cat._id === selectedCategory)?.subCategories || []
    : [];

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Also update the global search state
    setSearch(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Title title="Our Sweet Collection" />
      
      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Search Box */}
        <div className="relative w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search sweets..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button 
              onClick={applyFilters}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-500 hover:text-pink-600"
            >
              Go
            </button>
          </div>
          <div className="hidden md:block absolute -top-5 left-0 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
            Filter Search
          </div>
        </div>
        
        {/* Sort Dropdown */}
        <div className="sort-dropdown relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          >
            {selectedSortOption.icon}
            <span>Sort: {selectedSortOption.label}</span>
            <FaChevronDown className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showSortDropdown && (
            <div className="absolute z-10 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-56">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                    sortType === option.value ? 'bg-pink-50 text-pink-600' : ''
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                  {sortType === option.value && <FaCheck className="ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Filter Button for Mobile */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="flex items-center gap-2 px-4 py-2 mb-5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 md:hidden w-full justify-center"
      >
        <FaFilter className="text-gray-700" />
        <span className="font-medium">FILTERS</span>
        <FaChevronDown className={`ml-1 transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`} />
      </button>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Panel */}
        <AnimatePresence>
          {(showFilter || window.innerWidth >= 768) && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={filterVariants}
              transition={{ duration: 0.3 }}
              className="w-full md:w-64"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-5 overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                  <h4 className="font-medium text-gray-800">Categories</h4>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sweet Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedSubCategory('all'); // Reset subcategory when category changes
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat._id.charAt(0).toUpperCase() + cat._id.slice(1)} ({cat.count})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {subcategories.length > 0 && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub-Category
                      </label>
                      <select
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        <option value="all">All Sub-Categories</option>
                        {subcategories.map(subCat => (
                          <option key={subCat} value={subCat}>
                            {subCat.charAt(0).toUpperCase() + subCat.slice(1).replace(/-/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-5 overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center">
                  <FaRupeeSign className="mr-2 text-gray-600" />
                  <h4 className="font-medium text-gray-800">Price Range</h4>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Product Features Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-5 overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                  <h4 className="font-medium text-gray-800">Product Features</h4>
                </div>
                <div className="p-4">
                  <Checkbox 
                    value="bestseller" 
                    checked={showBestsellers} 
                    onChange={() => setShowBestsellers(!showBestsellers)} 
                    label="Bestsellers" 
                  />
                  <Checkbox 
                    value="featured" 
                    checked={showFeatured} 
                    onChange={() => setShowFeatured(!showFeatured)} 
                    label="Featured Products" 
                  />
                  <Checkbox 
                    value="newArrival" 
                    checked={showNewArrivals} 
                    onChange={() => setShowNewArrivals(!showNewArrivals)} 
                    label="New Arrivals" 
                  />
                </div>
              </div>
              
              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-5 overflow-hidden transition-all duration-300 hover:shadow-md">
                  <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center">
                    <FaTags className="mr-2 text-gray-600" />
                    <h4 className="font-medium text-gray-800">Tags</h4>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            selectedTags.includes(tag) 
                              ? 'bg-pink-500 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Apply Filters Button */}
              <button
                onClick={applyFilters}
                className="w-full bg-pink-500 text-white py-3 rounded-md font-medium hover:bg-pink-600 transition-colors"
              >
                Apply Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <Buffer />
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-3">No products found</h3>
              <p className="text-gray-600 mb-5">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => {
                  navigate('/products');
                  window.location.reload();
                }}
                className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="mb-6 flex justify-between items-center bg-white rounded-lg shadow-sm border border-gray-200 px-5 py-3">
                <p className="text-gray-700">
                  Showing <span className="font-medium">{products.length}</span> of {totalProducts} products
                </p>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-gray-600 text-sm">Active Tags:</span>
                    {selectedTags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs">
                        {tag}
                        <button 
                          onClick={() => toggleTag(tag)}
                          className="text-pink-400 hover:text-pink-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductItem 
                    key={product._id} 
                    id={product._id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    featured={product.featured}
                    bestseller={product.bestseller}
                    index={products.indexOf(product)}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`flex items-center justify-center w-10 h-10 rounded-md border ${
                        currentPage === 1
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-pink-500 text-gray-700 hover:text-pink-500'
                      }`}
                    >
                      <FaArrowLeft size={14} />
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show a window of 5 pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          className={`flex items-center justify-center w-10 h-10 rounded-md ${
                            currentPage === pageNum
                              ? 'bg-pink-500 text-white font-medium'
                              : 'border border-gray-300 hover:border-pink-500 text-gray-700 hover:text-pink-500'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`flex items-center justify-center w-10 h-10 rounded-md border ${
                        currentPage === totalPages
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-pink-500 text-gray-700 hover:text-pink-500'
                      }`}
                    >
                      <FaArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing; 