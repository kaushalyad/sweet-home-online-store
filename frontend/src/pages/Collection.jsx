import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import Buffer from "../components/Buffer";
import { FaSort, FaSortAmountDown, FaSortAmountUp, FaChevronDown, FaFilter, FaCheck, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

const Collection = () => {
  const { products, search, setSearch, showSearch, buffer } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const location = useLocation();
  
  // Handle URL search parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearch(decodeURIComponent(searchParam));
    }
  }, [location.search, setSearch]);

  // Sorting option configuration
  const sortOptions = [
    { value: "relavent", label: "Relevance", icon: <FaSort /> },
    { value: "low-high", label: "Price: Low to High", icon: <FaSortAmountUp /> },
    { value: "high-low", label: "Price: High to Low", icon: <FaSortAmountDown /> }
  ];

  // Animation variants
  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" }
  };

  // Find the currently selected sort option
  const selectedSortOption = sortOptions.find(option => option.value === sortType) || sortOptions[0];

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
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

  // Define prop types for the Checkbox component
  Checkbox.propTypes = {
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
  };

  // Custom star rating component
  const StarRating = ({ rating, setRating }) => {
    return (
      <div className="flex items-center gap-2 mb-3">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(rating === star ? 0 : star)}
              className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} 
                ${rating === star ? 'animate-pulse' : ''} hover:scale-110 transition-transform`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </button>
          ))}
        </div>
        {rating > 0 && (
          <button className="text-gray-400 hover:text-gray-600" onClick={() => setRating(0)}>
            <FaTimes size={12} />
          </button>
        )}
      </div>
    );
  };

  // Define prop types for the StarRating component
  StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    setRating: PropTypes.func.isRequired
  };

  // Price range slider component
  const PriceRangeSlider = ({ range, setRange, min, max }) => {
    const handleMinChange = (e) => {
      const newMin = Math.min(Number(e.target.value), range[1] - 50);
      setRange([newMin, range[1]]);
    };

    const handleMaxChange = (e) => {
      const newMax = Math.max(Number(e.target.value), range[0] + 50);
      setRange([range[0], newMax]);
    };

    return (
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">₹{range[0]}</span>
          <span className="text-sm text-gray-500">₹{range[1]}</span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div 
            className="absolute h-2 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full" 
            style={{ 
              left: `${((range[0] - min) / (max - min)) * 100}%`, 
              width: `${((range[1] - range[0]) / (max - min)) * 100}%` 
            }}
          ></div>
          <input
            type="range"
            min={min}
            max={max}
            value={range[0]}
            onChange={handleMinChange}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={range[1]}
            onChange={handleMaxChange}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer"
          />
        </div>
        <div className="flex justify-between mt-4 gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-sm"
              placeholder="Min"
              value={range[0]}
              onChange={handleMinChange}
              min={min}
              max={range[1] - 50}
            />
          </div>
          <div className="relative flex-1">
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-sm"
              placeholder="Max"
              value={range[1]}
              onChange={handleMaxChange}
              min={range[0] + 50}
              max={max}
            />
          </div>
        </div>
      </div>
    );
  };

  // Define prop types for the PriceRangeSlider component
  PriceRangeSlider.propTypes = {
    range: PropTypes.arrayOf(PropTypes.number).isRequired,
    setRange: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    // Filter by search
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // Filter by subCategory
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Filter by price range
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      productsCopy = productsCopy.filter(
        (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
      );
    }

    // Filter by rating
    if (ratingFilter > 0) {
      productsCopy = productsCopy.filter((item) => 
        // Assuming items have a rating property or calculate based on reviews
        (item.rating || 4) >= ratingFilter
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  // Handle sort option selection
  const handleSortChange = (value) => {
    setSortType(value);
    setShowSortDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSortDropdown && !e.target.closest('.sort-dropdown')) {
        setShowSortDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortDropdown]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, priceRange, ratingFilter]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // Total filtered count
  const filteredCount = filterProducts.length;

  return (
    <div className="bg-gray-50">
      {/* Collection Page Header */}
      <div className="bg-gradient-to-r from-pink-50 to-pink-100 py-10 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f472b6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="container mx-auto px-4">
          <div className="text-center relative z-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Sweet Collection</h1>
            <p className="text-gray-600 max-w-xl mx-auto">Discover a world of authentic Indian sweets and delicacies made with traditional recipes and finest ingredients</p>
            
            {/* Collection stats */}
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
              <span className="text-gray-600 mr-2">Showing</span>
              <span className="font-semibold text-pink-600">{filteredCount}</span>
              <span className="text-gray-600 ml-2">delicious treats</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 pt-6 border-t border-gray-200">
          {/* Sticky Quick Filter Bar - For easy access to popular filters */}
          <div className={`sticky top-24 left-0 right-0 z-20 bg-white border border-gray-200 rounded-lg shadow-sm p-2 mb-6 hidden md:block transition-all duration-300 ${
            (category.length > 0 || subCategory.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 || ratingFilter > 0) 
              ? 'w-[16%]' 
              : 'w-[18%]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
                <div className="flex flex-wrap gap-1">
                  <button 
                    onClick={() => setCategory(prev => prev.includes("Sweets") ? prev.filter(c => c !== "Sweets") : [...prev, "Sweets"])}
                    className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                      category.includes("Sweets") 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Sweets
                  </button>
                  <button 
                    onClick={() => setCategory(prev => prev.includes("Namkeens") ? prev.filter(c => c !== "Namkeens") : [...prev, "Namkeens"])}
                    className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                      category.includes("Namkeens") 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Namkeens
                  </button>
                  <button
                    onClick={() => setPriceRange([0, 200])}
                    className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                      priceRange[1] === 200
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Under ₹200
                  </button>
                  <button
                    onClick={() => setRatingFilter(prev => prev === 4 ? 0 : 4)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                      ratingFilter === 4
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    4★ & Up
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                {(category.length > 0 || subCategory.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 || ratingFilter > 0) && (
                  <button
                    onClick={() => {
                      setCategory([]);
                      setSubCategory([]);
                      setPriceRange([0, 1000]);
                      setRatingFilter(0);
                    }}
                    className="text-xs text-gray-500 hover:text-pink-600 transition-colors mr-4"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-pink-600 transition-colors"
                >
                  <FaFilter className="text-xs" />
                  <span>All Filters</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Filter Options */}
          <div className="min-w-40 sm:max-w-40">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 mb-5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 sm:hidden w-full justify-center"
            >
              <FaFilter className="text-gray-700" />
              <span className="font-medium">FILTERS</span>
              <FaChevronDown className={`ml-1 transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="hidden sm:flex items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaFilter className="text-gray-600" />
                <span>Filters</span>
              </h3>
            </div>
            
            <AnimatePresence>
              {(showFilter || window.innerWidth >= 640) && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={filterVariants}
                  transition={{ duration: 0.3 }}
                  className="sm:block"
                >
                  {/* Category Filter */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-5 overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium text-gray-800">Categories</h4>
                    </div>
                    <div className="p-3">
                      <Checkbox 
                        value="Sweets" 
                        checked={category.includes("Sweets")} 
                        onChange={toggleCategory} 
                        label="Sweets" 
                      />
                      <Checkbox 
                        value="Namkeens" 
                        checked={category.includes("Namkeens")} 
                        onChange={toggleCategory} 
                        label="Namkeens" 
                      />
                      <Checkbox 
                        value="CookiesAndBiscuits" 
                        checked={category.includes("CookiesAndBiscuits")} 
                        onChange={toggleCategory} 
                        label="Cookies and Biscuits" 
                      />
                    </div>
                  </div>
                  
                  {/* Type Filter */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-5 overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium text-gray-800">Type</h4>
                    </div>
                    <div className="p-3">
                      <Checkbox 
                        value="Sugar" 
                        checked={subCategory.includes("Sugar")} 
                        onChange={toggleSubCategory} 
                        label="Sugar" 
                      />
                      <Checkbox 
                        value="SugarFree" 
                        checked={subCategory.includes("SugarFree")} 
                        onChange={toggleSubCategory} 
                        label="Sugar Free" 
                      />
                      <Checkbox 
                        value="NoSugar" 
                        checked={subCategory.includes("NoSugar")} 
                        onChange={toggleSubCategory} 
                        label="No Sugar" 
                      />
                    </div>
                  </div>
                  
                  {/* Price Range Filter */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-5 overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium text-gray-800">Price Range</h4>
                    </div>
                    <div className="p-3">
                      <PriceRangeSlider 
                        range={priceRange} 
                        setRange={setPriceRange} 
                        min={0} 
                        max={1000} 
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-5 overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium text-gray-800">Customer Rating</h4>
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-gray-600 mb-2">Minimum rating:</p>
                      <StarRating rating={ratingFilter} setRating={setRatingFilter} />
                      
                      {[4, 3, 2, 1].map((rating) => (
                        <div 
                          key={rating}
                          onClick={() => setRatingFilter(rating === ratingFilter ? 0 : rating)}
                          className={`flex items-center justify-between p-2 my-1 rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                            ratingFilter === rating ? 'bg-pink-50 border border-pink-100' : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20" 
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-700">& Up</span>
                          </div>
                          {ratingFilter === rating && (
                            <FaCheck className="text-pink-500 text-sm" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Active Filters Summary */}
                  {(category.length > 0 || subCategory.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 || ratingFilter > 0) && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-5 overflow-hidden">
                      <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                        <h4 className="font-medium text-gray-800">Active Filters</h4>
                      </div>
                      <div className="p-3">
                        <div className="flex flex-wrap gap-2">
                          {category.map(cat => (
                            <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs">
                              {cat}
                              <button 
                                onClick={() => setCategory(prev => prev.filter(c => c !== cat))}
                                className="text-pink-400 hover:text-pink-600"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          {subCategory.map(subCat => (
                            <span key={subCat} className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs">
                              {subCat}
                              <button 
                                onClick={() => setSubCategory(prev => prev.filter(sc => sc !== subCat))}
                                className="text-pink-400 hover:text-pink-600"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs">
                              Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                              <button 
                                onClick={() => setPriceRange([0, 1000])}
                                className="text-pink-400 hover:text-pink-600"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          {ratingFilter > 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs">
                              {ratingFilter}+ Stars
                              <button 
                                onClick={() => setRatingFilter(0)}
                                className="text-pink-400 hover:text-pink-600"
                              >
                                ×
                              </button>
                            </span>
                          )}
                        </div>
                        {(category.length > 0 || subCategory.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 || ratingFilter > 0) && (
                          <button 
                            onClick={() => {
                              setCategory([]);
                              setSubCategory([]);
                              setPriceRange([0, 1000]);
                              setRatingFilter(0);
                            }}
                            className="mt-3 text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <Title text1={"All"} text2={"Collections"} />
                <p className="text-sm text-gray-500 mt-1">{filteredCount} products found</p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Grid/List View Toggle */}
                <div className="border border-gray-200 rounded-md overflow-hidden flex">
                  <button 
                    className="p-2 bg-pink-50 text-pink-600 border-r border-gray-200"
                    aria-label="Grid view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 text-gray-500 hover:bg-gray-50"
                    aria-label="List view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              
                {/* Custom Sort Dropdown */}
                <div className="relative sort-dropdown">
                  <button 
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 text-sm shadow-sm hover:shadow"
                  >
                    <span className="text-gray-600">{selectedSortOption.icon}</span>
                    <span>{selectedSortOption.label}</span>
                    <FaChevronDown className={`text-xs transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showSortDropdown && (
                    <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        {sortOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm hover:bg-gray-50 transition-colors duration-200
                              ${option.value === sortType ? 'bg-gray-50 text-pink-600 font-medium' : 'text-gray-700'}`}
                          >
                            <span className={option.value === sortType ? 'text-pink-600' : 'text-gray-500'}>
                              {option.icon}
                            </span>
                            {option.label}
                            {option.value === sortType && <FaCheck className="ml-auto text-pink-500 text-xs" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Map Products */}
            {buffer ? (
              <Buffer />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 gap-y-12 mt-3">
                {filterProducts.length > 0 ? (
                  filterProducts.map((item, index) => (
                    <ProductItem
                      key={index}
                      name={item.name}
                      id={item._id}
                      price={item.price}
                      image={item.image}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center">
                    <div className="text-5xl mb-4">😢</div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search terms</p>
                    <button 
                      onClick={() => {
                        setCategory([]);
                        setSubCategory([]);
                        setPriceRange([0, 1000]);
                        setRatingFilter(0);
                      }}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-md hover:shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recommended Products Section - Only show when there are products */}
      {filterProducts.length > 0 && (
        <div className="mt-16 py-16 bg-gradient-to-r from-pink-50 to-rose-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Recommended For You</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-pink-600 mx-auto rounded-full"></div>
              <p className="text-gray-600 max-w-2xl mx-auto mt-4">
                Based on your browsing history and preferences
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-8"
            >
              {/* Show first 4 products as recommendations - this could be enhanced with actual recommendation logic */}
              {products.slice(0, 4).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductItem
                    name={item.name}
                    id={item._id}
                    price={item.price}
                    image={item.image}
                    featured={index === 0}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            <div className="text-center mt-10">
              <Link 
                to="/collection"
                className="inline-flex items-center px-6 py-3 bg-white border border-pink-200 rounded-full text-pink-600 hover:bg-pink-50 transition-colors duration-300 shadow-sm"
              >
                <span className="font-medium">View All Recommendations</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
