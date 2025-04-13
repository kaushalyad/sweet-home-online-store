import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import Buffer from "../components/Buffer";
import { FaSort, FaSortAmountDown, FaSortAmountUp, FaChevronDown, FaFilter, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Collection = () => {
  const { products, search, showSearch, buffer } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
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
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // Total filtered count
  const filteredCount = filterProducts.length;

  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60 sm:max-w-60">
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
                <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                  <h4 className="font-medium text-gray-800">Categories</h4>
                </div>
                <div className="p-4">
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
                <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                  <h4 className="font-medium text-gray-800">Type</h4>
                </div>
                <div className="p-4">
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
              
              {/* Active Filters Summary */}
              {(category.length > 0 || subCategory.length > 0) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-5 overflow-hidden">
                  <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                    <h4 className="font-medium text-gray-800">Active Filters</h4>
                  </div>
                  <div className="p-4">
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
                    </div>
                    {(category.length > 0 || subCategory.length > 0) && (
                      <button 
                        onClick={() => {
                          setCategory([]);
                          setSubCategory([]);
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
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Products */}
        {buffer ? (
          <Buffer />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 mt-3">
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
                  }}
                  className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-200"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
