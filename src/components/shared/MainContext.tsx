import useKeyboard, { KeyEvent } from '@src/hooks/useKeyboard';
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
  const keyboard = useKeyboard();
  const [screenMeterChannel, setScreenMeterChannel] =
    useState<KeyEvent | null>(null);

  return useMemo(
    () => ({
      screen,
      setScreen,
      resetScreen,
      tab,
      setTab,
      keyboard,
      screenMeterChannel,
      setScreenMeterChannel,
    }),
    [screen, resetScreen, tab, keyboard, screenMeterChannel],
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
