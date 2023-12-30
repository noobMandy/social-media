// AuthRoute.js
import React, { useContext } from 'react';
import { Route,Routes, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';

function AuthRoute({ element: Element, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    
    <Route
      {...rest}
      element={user ? <Navigate to="/" /> : <Element />}
    />
  );
}

export default AuthRoute;
