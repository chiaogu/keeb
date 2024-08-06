import { useDebounceCallback } from '@react-hook/debounce';
import { useKeyEvents } from '@src/hooks/useKeyEvents';
import { Envelope } from '@src/synth/config/envelope';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ScreenState =
  | { type: 'nav' }
  | { type: 'meter' }
  | { type: 'adsr'; envelope: Envelope };

function useMainContextValue() {
  const [screen, setScreen] = useState<ScreenState>({ type: 'nav' });
  const [tab, setTab] = useState('sound');
  const resetScreen = useCallback(() => setScreen({ type: 'nav' }), []);

  return useMemo(
    () => ({
      screen,
      setScreen,
      resetScreen,
      tab,
      setTab,
    }),
    [screen, setScreen, resetScreen, tab, setTab],
  );
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
