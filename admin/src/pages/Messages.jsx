import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../config'
import { AuthContext } from '../context/AuthContext'

const Messages = () => {
  const { token } = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const resp = await axios.get(`${backendUrl}/api/messages`, { headers: { Authorization: `Bearer ${token}`, token } })
      if (resp.data && resp.data.success) setMessages(resp.data.messages)
    } catch (err) {
      console.error('Failed to fetch messages', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages() }, [])

  const handleMark = async (id) => {
    try {
      const resp = await axios.put(`${backendUrl}/api/messages/${id}/handle`, {}, { headers: { Authorization: `Bearer ${token}`, token } })
      if (resp.data && resp.data.success) {
        setMessages((m) => m.map(msg => msg._id === id ? { ...msg, status: 'handled' } : msg))
      }
    } catch (err) {
      console.error('Failed to mark message', err)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User Messages</h2>
      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Message</th>
                <th className="p-2">Product</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg._id} className="border-t">
                  <td className="p-2 align-top">{msg.name}</td>
                  <td className="p-2 align-top">{msg.email}</td>
                  <td className="p-2 align-top">{msg.message}</td>
                  <td className="p-2 align-top">{msg.productId || '-'}</td>
                  <td className="p-2 align-top">{msg.status}</td>
                  <td className="p-2 align-top">
                    {msg.status !== 'handled' && <button onClick={() => handleMark(msg._id)} className="px-3 py-1 bg-pink-500 text-white rounded">Mark handled</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Messages
