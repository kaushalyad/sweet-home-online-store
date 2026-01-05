import { useContext, useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useParams, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import CookieConsent from './components/CookieConsent'
import CookieDebug from './components/CookieDebug'
import WhatsAppButton from './components/WhatsAppButton'
import WelcomeBanner from './components/WelcomeBanner'
import Loader from './components/Loader'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ShopContext, ShopContextProvider } from './context/ShopContext'
import PropTypes from 'prop-types'
import { initGA } from "./utils/analytics"
import { Helmet, HelmetProvider } from 'react-helmet-async'

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home'))
const Collection = lazy(() => import('./pages/Collection'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Product = lazy(() => import('./pages/Product'))
const Cart = lazy(() => import('./pages/Cart'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'))
const Orders = lazy(() => import('./pages/Orders'))
const TrackOrder = lazy(() => import('./pages/TrackOrder'))
const Profile = lazy(() => import('./pages/Profile'))
const ProductListing = lazy(() => import('./pages/ProductListing'))
const Addresses = lazy(() => import('./pages/Addresses'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const SharedContent = lazy(() => import('./pages/SharedContent'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const CookieSettings = lazy(() => import('./pages/CookieSettings'))
const Verify = lazy(() => import('./pages/Verify'))

// SEO landing pages for popular sweets/namkeen
const KajuKatli = lazy(() => import('./pages/KajuKatli'));
const Rasgulla = lazy(() => import('./pages/Rasgulla'));
const NamkeenMixture = lazy(() => import('./pages/NamkeenMixture'));
const Blog = lazy(() => import('./pages/Blog'));

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
    <HelmetProvider>
      <ShopContextProvider>
        <Helmet>
          <title>Sweet Home Online Store | Buy Fresh Indian Sweets, Mithai, Namkeen & Dry Fruits</title>
          <meta name="description" content="Order authentic Indian sweets, traditional mithai, namkeen, and premium dry fruits online. Fresh homemade sweets delivered to your doorstep. Best quality sweets shop for festivals, celebrations & gifts." />
          <meta name="keywords" content="indian sweets online, buy mithai online, traditional sweets, namkeen online, dry fruits, sweets shop, homemade sweets, festival sweets, diwali sweets, wedding sweets, milk sweets, kaju katli, gulab jamun, rasgulla, ladoo, barfi, jalebi, pedha, sandesh, rasmalai, soan papdi, besan ladoo, motichoor ladoo, coconut ladoo, mysore pak, halwa, kheer, kala jamun, chamcham, pista burfi, cashew sweets, almond sweets, gift box sweets, bulk sweets order, fresh sweets delivery, same day delivery sweets, best sweet shop near me, sweet home ladania" />
          <link rel="canonical" href="https://sweethome-store.com/" />
        </Helmet>
        <div className='relative min-h-screen w-full overflow-x-hidden'>
          <ToastContainer 
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            limit={2}
            theme="light"
          />
          <CookieConsent />
          <CookieDebug />
          <WelcomeBanner />
          <Navbar />
          <div 
            className='transition-all duration-300 min-h-[calc(100vh-140px)] w-full'
            style={{ 
              paddingTop: showPromoBanner ? 'clamp(100px, 15vh, 148px)' : 'clamp(70px, 12vh, 108px)'
            }}
          > 
            <div className="flex justify-center mb-6 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <SearchBar />
            </div>
            <div className='min-h-full w-full'>
              <Suspense fallback={<Loader />}>
              <Routes>
                              <Route path='/blog' element={<Blog />} />
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
                <Route path='/shared/:contentId' element={<SharedContent />} />
                <Route path='/cookie-policy' element={<CookiePolicy />} />
                <Route path='/cookie-settings' element={<CookieSettings />} />
                <Route path='/kaju-katli' element={<KajuKatli />} />
                <Route path='/rasgulla' element={<Rasgulla />} />
                <Route path='/namkeen-mixture' element={<NamkeenMixture />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
              </Suspense>
              <FAQ />
              <Footer />
            </div>
          </div>
        </div>
        <WhatsAppButton />
      </ShopContextProvider>
    </HelmetProvider>
  )
}

export default App
