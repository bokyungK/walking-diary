import { useState, createContext, useEffect, useContext } from 'react';
import { observeUser } from '../api/firebase';

const UserContext = createContext();

export function UserContextProvider({children}) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    observeUser(setUser);
  }, []);

  const handleUser = (value) => {
    setUser(value);
  }

  return <UserContext.Provider value={{user, setUser, handleUser}}>{children}</UserContext.Provider>
}

export function useUserContext() {
  return useContext(UserContext);
}