import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductManager from '../pages/ProductManager';
import PrivateRoute from '../components/auth/PrivateRoute';

const ProductRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <ProductManager />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/add" 
        element={
          <PrivateRoute>
            <ProductManager />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/edit/:id" 
        element={
          <PrivateRoute>
            <ProductManager />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default ProductRoutes; 