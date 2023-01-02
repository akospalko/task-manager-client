import React, { useState, createContext, useContext } from 'react'

//create context
const LoaderContext = createContext();
//export usable context
export const useLoaderContext = () => {
  return useContext(LoaderContext)
}

export default function LoaderLayout({ children }) {
  const loadingStateDefault = { create: false, update: false, delete: false, getAllTasks: false };
  const [isLoading, setIsLoading] = useState(loadingStateDefault);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  )
}