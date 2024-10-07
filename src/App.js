import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './component/Header/Header.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserContextProvider } from './context/userContext.jsx';
import { AlertContextProvider } from './context/alertContext';
import { SubmitContextProvider } from './context/submitContext.jsx';

const queryClient = new QueryClient()
const providers = [
  UserContextProvider,
  AlertContextProvider,
  SubmitContextProvider
]

const combineProviders = (providers) => {
  return ({ children }) => 
    providers.reduceRight((AccumulatedComponents, CurrentProvider) => {
      return (
        <CurrentProvider>
          {AccumulatedComponents}
        </CurrentProvider>
      );
    }, children);
};

export const AppContextProvider = combineProviders(providers);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Header />
        <Outlet />
      </AppContextProvider>
    </QueryClientProvider>
  )
}
