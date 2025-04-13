import React from 'react'
import { Routes, Route } from 'react-router-dom'
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'

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
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/login' element={<Login />} />
            <Route path='/place-order' element={<PlaceOrder />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/wishlist' element={<Profile />} /> {/* Temporarily redirects to Profile with wishlist tab */}
            <Route path='/settings' element={<Profile />} /> {/* Temporarily redirects to Profile with settings tab */}
            <Route path='/verify' element={<Verify />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App
