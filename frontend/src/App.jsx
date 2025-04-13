import { useContext } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Verify from './pages/Verify'
import { ShopContext } from './context/ShopContext'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

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
  return (
    <div className='relative'>
      <ToastContainer />
      <Navbar />
      <div className='pt-16 md:pt-20'> {/* Space for the fixed navbar */}
        <SearchBar />
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-4'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/collection' element={<Collection />} />
            <Route path='/collection/:productId' element={<Product />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/login' element={<Login />} />
            <Route path='/place-order' element={<ProtectedRoute element={<PlaceOrder />} />} />
            <Route path='/orders' element={<ProtectedRoute element={<Orders />} />} />
            <Route path='/profile' element={<ProtectedRoute element={<Profile />} />} />
            <Route path='/wishlist' element={<ProtectedRoute element={<Profile />} />} />
            <Route path='/settings' element={<ProtectedRoute element={<Profile />} />} />
            <Route path='/verify' element={<Verify />} />
            
            {/* Redirect route for legacy links */}
            <Route path='/products' element={<Navigate to="/collection" replace />} />
            <Route path='/products/:productId' element={<ProductRedirect />} />
            
            {/* 404 route - must be last */}
            <Route path='*' element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App
