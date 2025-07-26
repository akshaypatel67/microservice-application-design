import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <StateContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </StateContext.Provider>
  );
};
  
export const useStateContext = () => useContext(StateContext);