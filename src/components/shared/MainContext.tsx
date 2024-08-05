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

  const resetAfterKeyEvents = useDebounceCallback(resetScreen, 2000);

  const handleKeyEvents = useCallback(() => {
    if (screen.type === 'nav') {
      setScreen({ type: 'meter' });
    }
    resetAfterKeyEvents();
  }, [resetAfterKeyEvents, screen.type]);

  const handlers = useMemo(
    () => ({ onKeydown: handleKeyEvents, onKeyUp: handleKeyEvents }),
    [handleKeyEvents],
  );

  useKeyEvents(handlers);

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
