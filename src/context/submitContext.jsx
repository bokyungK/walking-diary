import React, { useState, useContext, createContext } from 'react';

const SubmitContext = createContext();

export function SubmitContextProvider({children}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmitTrue = () => setIsSubmitting(true);
  const handleSubmitFalse = () => setIsSubmitting(false);

  return <SubmitContext.Provider value={{isSubmitting, handleSubmitTrue, handleSubmitFalse}}>{children}</SubmitContext.Provider>
}

export function useSubmitContext() {
  return useContext(SubmitContext);
}


