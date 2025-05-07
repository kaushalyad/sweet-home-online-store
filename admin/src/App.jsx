import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Login from './components/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Analytics from './pages/Analytics'
import UserBehavior from './pages/UserBehavior'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

function App() {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken || '';
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout setToken={setToken} />}>
          <Route index element={<Dashboard token={token} />} />
          <Route path="products" element={<Products token={token} />} />
          <Route path="orders" element={<Orders token={token} />} />
          <Route path="users" element={<Users token={token} />} />
          <Route path="analytics" element={<Analytics token={token} />} />
          <Route path="user-behavior" element={<UserBehavior token={token} />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App