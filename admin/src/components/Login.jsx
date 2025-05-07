import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({setToken}) => {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const requestData = { email, password };
            console.log('Login attempt with:', {
                email,
                password: '***',
                backendUrl,
                fullUrl: `${backendUrl}/api/user/admin/login`,
                requestData: JSON.stringify(requestData)
            });
            
            // Log the actual request data
            console.log('Request data:', {
                url: `${backendUrl}/api/user/admin/login`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: requestData
            });
            
            const response = await axios.post(backendUrl + '/api/user/admin/login', requestData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            if (response.data.success) {
                const tokenWithBearer = `Bearer ${response.data.token}`
                setToken(tokenWithBearer)
                localStorage.setItem('token', tokenWithBearer)
                toast.success('Login successful!')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error('Login error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                requestData: { email, password: '***' },
                requestHeaders: error.config?.headers,
                fullError: error.toString(),
                stack: error.stack
            });
            toast.error(error.response?.data?.message || 'Login failed')
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
        <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
            <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
            <form onSubmit={onSubmitHandler}>
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                    <input onChange={(e)=>setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@email.com' required />
                </div>
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                    <input onChange={(e)=>setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Enter your password' required />
                </div>
                <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type="submit"> Login </button>
            </form>
        </div>
    </div>
  )
}

export default Login