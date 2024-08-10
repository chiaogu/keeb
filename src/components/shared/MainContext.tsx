import useKeyboard, { KeyEvent } from '@src/hooks/useKeyboard';
import { Envelope } from '@src/synth/config/envelope';
import { TABS } from '@src/utils/constants';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type ScreenState =
  | { type: 'nav' }
  | { type: 'meter' }
  | { type: 'adsr'; envelope: Envelope };

function useTab() {
  const [tab, setTabState] = useState('sound');

  useEffect(() => {
    const handlePopState = () => {
      const path = location.pathname.split('/')[2];
      const parsedTab = TABS.find(({ value }) => value === path)?.value;
      if (!parsedTab) {
        history.replaceState({}, '', 'sound');
      } else {
        setTabState(parsedTab);
      }
    };
    handlePopState();
    addEventListener('popstate', handlePopState);
    return () => removeEventListener('popstate', handlePopState);
  }, []);

  const setTab = useCallback((tab: string) => {
    setTabState(tab);
    history.pushState({}, '', tab);
  }, []);

  return { tab, setTab };
}

function useMainContextValue() {
  const { tab, setTab } = useTab();
  const [screen, setScreen] = useState<ScreenState>({ type: 'nav' });
  const resetScreen = useCallback(() => setScreen({ type: 'nav' }), []);
  const keyboard = useKeyboard();
  const [screenMeterChannel, setScreenMeterChannel] = useState<KeyEvent | null>(
    null,
  );

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
