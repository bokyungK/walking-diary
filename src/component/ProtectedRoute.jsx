import React from 'react';
import { useUserContext } from '../context/userContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { user } = useUserContext();

  if (user === null) {
    return <Navigate to='/login' replace={true} />
  } else {
    return children;
  }
}
