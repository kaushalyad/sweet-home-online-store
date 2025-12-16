import React from 'react'

const NotifyMe = ({ onClick }) => {
  return (
    <button onClick={onClick} className="px-3 py-2 bg-pink-500 text-white rounded">Notify</button>
  )
}

export default NotifyMe
