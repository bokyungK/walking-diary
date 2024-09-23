import React from 'react';
import { useUserContext } from '../context/userContext';
import { Navigate } from "react-router-dom";
import Loading from './Loading/Loading';

export default function ProtectedRoute({ children }) {
  const { user } = useUserContext();

  if (user === undefined) {
    return <Loading />
  } else if (user === null) {
    return <Navigate to='/login' replace />
  } else {
    return children;
  }
}
