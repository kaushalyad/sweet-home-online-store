import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [focused, setFocused] = useState(false);
    const location = useLocation();

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
            setRecentSearches(JSON.parse(savedSearches));
        }
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        
        // Only add non-empty searches to recent searches when user submits
        if (e.key === 'Enter' && value.trim() !== '') {
            addToRecentSearches(value);
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

    const clearSearch = () => {
        setSearch('');
        setFocused(false);
    };

    return showSearch && visible ? (
        <div className='sticky top-0 z-40 mt-[72px] border-b border-t border-gray-200 bg-white shadow-md'>
            <div className='container mx-auto px-4 py-3 relative'>
                <div className='flex items-center justify-center'>
                    <div className='relative w-full max-w-2xl'>
                        <div className={`flex items-center border ${focused ? 'border-black ring-1 ring-black' : 'border-gray-300'} px-4 py-3 rounded-lg transition-all duration-300 bg-white`}>
                            <img className='w-5 h-5 mr-3 text-gray-500' src={assets.search_icon} alt="Search" />
                            <input 
                                value={search} 
                                onChange={handleSearch}
                                onKeyDown={handleSearch}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setTimeout(() => setFocused(false), 200)}
                                className='flex-1 outline-none bg-inherit text-base placeholder-gray-400' 
                                type="text" 
                                placeholder='Search for sweets, desserts, and treats...'
                                autoFocus
                            />
                            {search && (
                                <button 
                                    onClick={clearSearch} 
                                    className='ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
                                >
                                    <img className='w-4 h-4' src={assets.cross_icon} alt="Clear" />
                                </button>
                            )}
                        </div>
                        
                        {/* Recent searches dropdown */}
                        {focused && recentSearches.length > 0 && (
                            <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden'>
                                <div className='p-2 border-b border-gray-100 flex justify-between items-center'>
                                    <span className='text-xs font-medium text-gray-500'>Recent Searches</span>
                                    <button 
                                        onClick={() => {
                                            setRecentSearches([]);
                                            localStorage.removeItem('recentSearches');
                                        }}
                                        className='text-xs text-gray-500 hover:text-black transition-colors duration-200'
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <ul>
                                    {recentSearches.map((term, index) => (
                                        <li 
                                            key={index}
                                            onClick={() => selectRecentSearch(term)}
                                            className='px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center transition-colors duration-200'
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className='text-sm'>{term}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => setShowSearch(false)} 
                        className='ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
                    >
                        <img className='w-4 h-4' src={assets.cross_icon} alt="Close" />
                    </button>
                </div>
                
                <div className='mt-2 text-center'>
                    <span className='text-sm text-gray-500'>Popular:</span>
                    {['Chocolates', 'Cakes', 'Cupcakes', 'Cookies', 'Gifting'].map((tag, index) => (
                        <button 
                            key={index}
                            onClick={() => {
                                setSearch(tag);
                                addToRecentSearches(tag);
                            }}
                            className='ml-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200'
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    ) : null;
}

export default SearchBar
