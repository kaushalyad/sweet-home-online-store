import { useContext, useState, useEffect } from 'react'
import { Routes, Route, Navigate, useParams, Link } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import TrackOrder from './pages/TrackOrder'
import Profile from './pages/Profile'
import ProductListing from './pages/ProductListing'
import Addresses from './pages/Addresses'
import OrderSuccess from './pages/OrderSuccess'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Verify from './pages/Verify'
import { ShopContext, ShopContextProvider } from './context/ShopContext'
import PropTypes from 'prop-types'
import { initGA } from "./utils/analytics"
import Register from './pages/Register'

export const backendUrl = import.meta.env.VITE_BACKEND_URL

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ element }) => {
  const { token } = useContext(ShopContext);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return element;
};

// Add prop types for ProtectedRoute
ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired
};

// Dynamic redirect component for product routes
const ProductRedirect = () => {
  const { productId } = useParams();
  return <Navigate to={`/collection/${productId}`} replace />;
};

// 404 Not Found Page
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-16">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300">
        Go Back Home
      </Link>
    </div>
  );
};

const App = () => {
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  
  // Check if promo banner is visible
  useEffect(() => {
    const handleBannerVisibility = () => {
      const bannerState = localStorage.getItem('promoBannerClosed');
      if (bannerState === 'true') {
        setShowPromoBanner(false);
      }
    };
    
    handleBannerVisibility();
    
    // Listen for custom event from Navbar when banner is closed
    const handleBannerClosed = () => setShowPromoBanner(false);
    window.addEventListener('promoBannerClosed', handleBannerClosed);
    
    return () => {
      window.removeEventListener('promoBannerClosed', handleBannerClosed);
    };
  }, []);

  // Initialize GA4
  initGA();

  return (
    <ShopContextProvider>
      <div className='relative min-h-screen'>
        <ToastContainer />
        <Navbar />
        <div 
          className='transition-all duration-300 min-h-[calc(100vh-140px)]'
          style={{ 
            paddingTop: showPromoBanner ? '180px' : '140px'
          }}
        > 
          <div className="flex justify-center mb-6">
            <SearchBar />
          </div>
          <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] min-h-full'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/collection' element={<Collection />} />
              <Route path='/collection/:productId' element={<Product />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/product/:productId' element={<Product />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password' element={<ResetPassword />} />
              <Route path='/place-order' element={<ProtectedRoute element={<PlaceOrder />} />} />
              <Route path='/orders' element={<ProtectedRoute element={<Orders />} />} />
              <Route path='/track-order/:orderId' element={<ProtectedRoute element={<TrackOrder />} />} />
              <Route path='/profile' element={<ProtectedRoute element={<Profile />} />} />
              <Route path='/addresses' element={<ProtectedRoute element={<Addresses />} />} />
              <Route path='/wishlist' element={<ProtectedRoute element={<Profile />} />} />
              <Route path='/settings' element={<ProtectedRoute element={<Profile />} />} />
              <Route path='/verify' element={<Verify />} />
              <Route path='/products' element={<ProductListing />} />
              <Route path='/products/:productId' element={<ProductRedirect />} />
              <Route path='/order-success' element={<ProtectedRoute element={<OrderSuccess />} />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </div>
    </ShopContextProvider>
  )
}

export default App
