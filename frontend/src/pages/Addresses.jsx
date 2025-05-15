import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaHome, FaBriefcase, FaMapMarkerAlt, FaEdit, FaTrash, FaStar } from 'react-icons/fa';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    label: 'Home',
    isDefault: false
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view your addresses');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAddresses(response.data.addresses);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to manage addresses');
        return;
      }

      if (editingAddress) {
        await axios.put(
          `http://localhost:5000/api/addresses/${editingAddress._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Address updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/addresses',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Address added successfully');
      }

      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        label: 'Home',
        isDefault: false
      });
      loadAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/addresses/${addressId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Address deleted successfully');
      loadAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/addresses/${addressId}/default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Default address updated');
      loadAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update default address');
    }
  };

  const getLabelIcon = (label) => {
    switch (label) {
      case 'Home':
        return <FaHome className="text-blue-500" />;
      case 'Work':
        return <FaBriefcase className="text-green-500" />;
      default:
        return <FaMapMarkerAlt className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Addresses</h1>

      {!showForm && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg mb-8 hover:bg-blue-600 transition-colors"
        >
          Add New Address
        </motion.button>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address Type</label>
                <select
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Set as default address</label>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                  setFormData({
                    name: '',
                    phone: '',
                    street: '',
                    city: '',
                    state: '',
                    zipcode: '',
                    country: '',
                    label: 'Home',
                    isDefault: false
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {editingAddress ? 'Update Address' : 'Add Address'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map((address) => (
          <motion.div
            key={address._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md relative"
          >
            {address.isDefault && (
              <div className="absolute top-4 right-4">
                <FaStar className="text-yellow-400 text-xl" />
              </div>
            )}
            <div className="flex items-center mb-4">
              {getLabelIcon(address.label)}
              <span className="ml-2 font-semibold">{address.label}</span>
            </div>
            <div className="space-y-2">
              <p className="font-medium">{address.name}</p>
              <p>{address.phone}</p>
              <p>{address.street}</p>
              <p>{`${address.city}, ${address.state} ${address.zipcode}`}</p>
              <p>{address.country}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(address)}
                className="p-2 text-blue-500 hover:text-blue-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(address._id)}
                className="p-2 text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address._id)}
                  className="p-2 text-yellow-500 hover:text-yellow-600"
                >
                  <FaStar />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-8">
          <p className="text-gray-500">No addresses found. Add your first address!</p>
        </div>
      )}
    </div>
  );
};

export default Addresses; 