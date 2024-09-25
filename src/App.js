import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './component/Header/Header.jsx';
import { UserContextProvider } from './context/userContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertContextProvider } from './context/alertContext';
import { SubmitContextProvider } from './context/submitContext.jsx';

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <AlertContextProvider>
          <SubmitContextProvider>
            <Header />
            <Outlet />
          </SubmitContextProvider>
        </AlertContextProvider>
      </UserContextProvider>
    </QueryClientProvider>
  )
}
