import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaClock, FaTag, FaSadTear, FaArrowRight, FaHeart } from 'react-icons/fa';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch, products } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [focused, setFocused] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false)
        }
    }, [location])
    
    useEffect(() => {
        // Load recent searches from localStorage
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
            try {
                setRecentSearches(JSON.parse(savedSearches));
            } catch (error) {
                console.error('Error parsing recent searches:', error);
                localStorage.removeItem('recentSearches');
                setRecentSearches([]);
            }
        }
    }, []);

    // Search products when search term changes
    useEffect(() => {
        if (search.trim() && products && products.length > 0) {
            setIsSearching(true);
            // Simple timeout to simulate search loading
            const timer = setTimeout(() => {
                const results = products.filter(product => 
                    product.name.toLowerCase().includes(search.toLowerCase()) ||
                    (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
                ).slice(0, 5); // Show only top 5 results
                setSearchResults(results);
                setIsSearching(false);
            }, 300);
            
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
        }
    }, [search, products]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        
        // Only add non-empty searches to recent searches when user submits
        if (e.key === 'Enter' && value.trim() !== '') {
            addToRecentSearches(value);
            submitSearch();
        }
    };

    const submitSearch = () => {
        if (search.trim() !== '') {
            addToRecentSearches(search);
            // Navigate to collection page with search query
            navigate(`/collection?search=${encodeURIComponent(search)}`);
            setShowSearch(false);
        }
    };

    const addToRecentSearches = (term) => {
        const updatedSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    const selectRecentSearch = (term) => {
        setSearch(term);
        addToRecentSearches(term);
    };

    const viewProduct = (productId) => {
        navigate(`/collection/${productId}`);
        setShowSearch(false);
    };

    const clearSearch = () => {
        setSearch('');
        setFocused(false);
    };

    const popularSearches = ['Chocolates', 'Cakes', 'Cupcakes', 'Cookies', 'Gifting', 'Ladoo', 'Barfi', 'Halwa', 'Peda', 'Mithai Box'];
    const suggestedProducts = [
        { id: 'rasgulla', name: 'Rasgulla' },
        { id: 'kaju-barfi', name: 'Kaju Barfi' },
        { id: 'gulab-jamun', name: 'Gulab Jamun' },
        { id: 'jalebi', name: 'Jalebi' },
        { id: 'soan-papdi', name: 'Soan Papdi' },
        { id: 'mysore-pak', name: 'Mysore Pak' },
        { id: 'besan-ladoo', name: 'Besan Ladoo' },
        { id: 'kalakand', name: 'Kalakand' }
    ];

    return showSearch && visible ? (
        <div className='relative mx-auto max-w-3xl mt-5 animate-fadeIn'>
            <div className='bg-white shadow-xl rounded-lg overflow-hidden'>
                {/* Search header with pink gradient */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-3 px-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <FaSearch className="text-white mr-2" />
                        <h2 className="text-white font-medium">Search Products</h2>
                    </div>
                    <button 
                        onClick={() => setShowSearch(false)} 
                        className="text-white hover:text-pink-100 transition-colors"
                        aria-label="Close search"
                    >
                        <FaTimes />
                    </button>
                </div>
                
                {/* Search input area */}
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input 
                            value={search} 
                            onChange={handleSearch}
                            onKeyDown={handleSearch}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setTimeout(() => setFocused(false), 200)}
                            className="w-full pl-10 pr-14 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200" 
                            type="text" 
                            placeholder="Search for sweets, desserts, and treats..."
                            autoFocus
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                            {search && (
                                <button 
                                    onClick={clearSearch} 
                                    className="p-1 text-gray-400 hover:text-gray-600 mr-1"
                                    aria-label="Clear search"
                                >
                                    <FaTimes />
                                </button>
                            )}
                            <button 
                                onClick={submitSearch}
                                className={`bg-pink-500 hover:bg-pink-600 text-white rounded-lg p-2 transition-colors ${!search.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!search.trim()}
                            >
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                    
                    {/* Search results or recent searches */}
                    {focused && (
                        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-slideDown max-h-[300px] overflow-y-auto">
                            {/* Loading indicator */}
                            {isSearching && (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                                </div>
                            )}
                            
                            {/* Search results */}
                            {search.trim() && searchResults.length > 0 && !isSearching && (
                                <div>
                                    <div className="bg-pink-50 px-4 py-2 border-b border-gray-200">
                                        <span className="text-sm font-medium text-gray-700">Search Results</span>
                                    </div>
                                    <ul>
                                        {searchResults.map((product) => (
                                            <li 
                                                key={product._id}
                                                onClick={() => viewProduct(product._id)}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center justify-between"
                                            >
                                                <div className="flex items-center">
                                                    {product.image && (
                                                        <img 
                                                            src={Array.isArray(product.image) ? product.image[0] : product.image} 
                                                            alt={product.name} 
                                                            className="w-10 h-10 object-cover rounded-md mr-3" 
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://via.placeholder.com/40?text=No+Image";
                                                            }}
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{product.name}</div>
                                                        <div className="text-sm text-gray-500">₹{product.price}</div>
                                                    </div>
                                                </div>
                                                <FaArrowRight className="text-gray-400" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {/* No results */}
                            {search.trim() && searchResults.length === 0 && !isSearching && (
                                <div className="py-6 px-4 text-center">
                                    <FaSadTear className="mx-auto text-gray-400 text-3xl mb-2" />
                                    <p className="text-gray-600 mb-3">No results found for &quot;{search}&quot;</p>
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Try one of these popular items:</p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {suggestedProducts.map((product, index) => (
                                                <button 
                                                    key={index}
                                                    onClick={() => viewProduct(product.id)}
                                                    className="px-3 py-1 bg-pink-50 text-pink-600 border border-pink-200 rounded-full text-sm hover:bg-pink-100 transition-colors flex items-center"
                                                >
                                                    <FaHeart className="mr-1 text-xs" /> {product.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Recent searches when not searching */}
                            {!search.trim() && recentSearches.length > 0 && (
                                <div>
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700 flex items-center">
                                            <FaClock className="mr-2 text-gray-500" /> Recent Searches
                                        </span>
                                        <button 
                                            onClick={() => {
                                                setRecentSearches([]);
                                                localStorage.removeItem('recentSearches');
                                            }}
                                            className="text-xs text-pink-600 hover:text-pink-800 font-medium"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    <ul>
                                        {recentSearches.map((term, index) => (
                                            <li 
                                                key={index}
                                                onClick={() => selectRecentSearch(term)}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center"
                                            >
                                                <FaClock className="mr-2 text-gray-400" />
                                                <span>{term}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Popular searches section */}
                <div className="p-4 bg-gray-50">
                    <div className="mb-2 flex items-center">
                        <FaTag className="text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Popular Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {popularSearches.map((tag, index) => (
                            <button 
                                key={index}
                                onClick={() => {
                                    setSearch(tag);
                                    addToRecentSearches(tag);
                                }}
                                className="px-3 py-1 bg-white text-pink-600 border border-pink-200 rounded-full text-sm hover:bg-pink-50 transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

// Add these animations to your CSS or tailwind.config.js
// animation: {
//   fadeIn: 'fadeIn 0.3s ease-in-out',
//   slideDown: 'slideDown 0.3s ease-in-out',
// },
// keyframes: {
//   fadeIn: {
//     '0%': { opacity: '0' },
//     '100%': { opacity: '1' },
//   },
//   slideDown: {
//     '0%': { transform: 'translateY(-10px)', opacity: '0' },
//     '100%': { transform: 'translateY(0)', opacity: '1' },
//   },
// },

export default SearchBar
