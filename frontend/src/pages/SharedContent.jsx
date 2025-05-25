import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const SharedContent = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/shared/${contentId}`);
        if (response.data.success) {
          setContent(response.data.content);
          setError(null);
        } else {
          setError('Content not found');
          toast.error('Content not found');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to load shared content';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error fetching shared content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchSharedContent();
    }
  }, [contentId]);

  const renderContent = () => {
    if (!content) return null;

    switch (content.type) {
      case 'product':
        return (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        );
      case 'collection':
        return (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Collection Details</h2>
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        );
      case 'order':
        return (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        );
      default:
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-gray-600">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-16">
        <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Error</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
        >
          <FaArrowLeft className="mr-2" />
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{content?.title}</h1>
        {renderContent()}
        <div className="mt-6 text-sm text-gray-500">
          Shared on {new Date(content?.createdAt).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};

export default SharedContent; 