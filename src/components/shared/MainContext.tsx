import { createContext, useContext, useState } from 'react';

function useMainContextValue() {
  const [timelineVisible, setTimelineVisible] = useState(false);
  return {
    timelineVisible,
    setTimelineVisible,
  };
}

const MainContext = createContext<ReturnType<
  typeof useMainContextValue
> | null>(null);

export function useMainContext() {
  const contextValue = useContext(MainContext);
  if (!contextValue) throw new Error('No context provider found');
  return contextValue;
}

type MainContextProviderProps = {
  children: React.ReactNode;
};

export function MainContextProvider({ children }: MainContextProviderProps) {
  const contextValue = useMainContextValue();
  return (
    <MainContext.Provider value={contextValue}>{children}</MainContext.Provider>
  );
}
