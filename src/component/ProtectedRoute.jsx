import React from 'react';
import { useUserContext } from '../context/userContext';
import { useNavigate } from "react-router-dom";
import Alert from './Alert/Alert';

export default function ProtectedRoute({ children }) {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const handleAlert = () => {
    navigate('/login', { replace: true });
  }

  if (user === null) {
    return <Alert message='로그인이 필요해요!' handleAlert={handleAlert} />
  } else {
    return children;
  }
}
