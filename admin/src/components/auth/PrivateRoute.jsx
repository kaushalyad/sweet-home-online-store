import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
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