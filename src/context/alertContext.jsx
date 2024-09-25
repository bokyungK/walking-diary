import { useState, createContext, useContext } from 'react';

const AlertContext = createContext();

export function AlertContextProvider({children}) {
  const [alert, setAlert] = useState('');
  const handleAlert = (text) => {
    setAlert(text);
  }

  return <AlertContext.Provider value={{alert, handleAlert}}>{children}</AlertContext.Provider>
}

export function useAlertContext() {
  return useContext(AlertContext);
}