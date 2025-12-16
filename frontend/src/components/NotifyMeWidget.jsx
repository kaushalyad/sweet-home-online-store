import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'

const NotifyMeWidget = ({ productId = null, productName = '', onClose }) => {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleClose = () => {
    setOpen(false)
    onClose && onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email) return
    setLoading(true)
    try {
      const resp = await axios.post(`${backendUrl}/api/messages`, {
        name,
        email,
        message: `Notify me for product: ${productName}`,
        productId
      })
      if (resp.data && resp.data.success) {
        setSuccess(true)
      }
    } catch (err) {
      console.error('Notify submit error', err)
      alert('Failed to submit. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-2">Get notified</h3>
        <p className="text-sm text-gray-600 mb-4">We will notify you when {productName || 'this product'} becomes available.</p>
        {success ? (
          <div>
            <p className="text-green-600 mb-4">Thanks — we'll notify you!</p>
            <button className="px-4 py-2 bg-pink-500 text-white rounded" onClick={handleClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input className="w-full p-2 border rounded mb-3" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="w-full p-2 border rounded mb-3" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="px-4 py-2 bg-pink-500 text-white rounded">{loading ? 'Sending...' : 'Notify me'}</button>
              <button type="button" onClick={handleClose} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default NotifyMeWidget
