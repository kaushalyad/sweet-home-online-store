import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If children is a function, call it with the token
  if (typeof children === 'function') {
    return children({ token });
  }

  // If children is a React element, clone it with the token prop
  if (React.isValidElement(children)) {
    return React.cloneElement(children, { token });
  }

  // If children is an array or fragment, wrap it in a div with the token
  return <div>{children}</div>;
};

export default PrivateRoute; 