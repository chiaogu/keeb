import { Envelope } from '@src/synth/config/envelope';
import { createContext, useContext, useState } from 'react';

type ScreenState = { type: 'meter' } | { type: 'adsr', envelope: Envelope };

function useMainContextValue() {
  const [screen, setScreen] = useState<ScreenState>({ type: 'meter' });
  const [tab, setTab] = useState('sound');
  return {
    screen,
    setScreen,
    tab,
    setTab,
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
