import useKeyboard, { KeyEvent } from '@src/hooks/useKeyboard';
import useKeyboardPresets from '@src/hooks/useKeyboardPresets';
import { getDefaultKeyboard } from '@src/keyboard/defaults';
import { Envelope } from '@src/synth/config/envelope';
import { TABS } from '@src/utils/constants';
import * as storage from '@src/utils/localstorage';
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

type Tab = (typeof TABS)[number]['value'];

function useTab() {
  const [tab, setTabState] = useState<Tab>('sound');

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

  const setTab = useCallback((tab: Tab) => {
    setTabState(tab);
    document.scrollingElement?.scrollTo(0, 0);
    history.pushState({}, '', tab);
  }, []);

  return { tab, setTab };
}

function useMainContextValue() {
  const { tab, setTab } = useTab();
  const [screen, setScreen] = useState<ScreenState>({ type: 'nav' });
  const resetScreen = useCallback(() => setScreen({ type: 'nav' }), []);
  const [screenMeterChannel, setScreenMeterChannel] = useState<KeyEvent | null>(
    null,
  );

  const initConfig = useMemo(() => {
    const currrent = storage.getCurrentKeyboard();

    if (!currrent) {
      const defaultConfig = getDefaultKeyboard();
      storage.setCurrentKeyboard(defaultConfig);
      return defaultConfig;
    }

    return currrent;
  }, []);
  const keyboard = useKeyboard(initConfig);
  const { presets, createNew, refresh, remove } = useKeyboardPresets();

  const createNewKeyboard = useCallback(() => {
    const newConfig = createNew();
    keyboard.loadPreset(newConfig.id);
  }, [createNew, keyboard]);

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
      presets,
      createNew: createNewKeyboard,
      setKeyboardName(name: string) {
        keyboard.setName(name);
        requestAnimationFrame(refresh);
      },
      loadPreset(id: string) {
        keyboard.loadPreset(id);
        requestAnimationFrame(refresh);
      },
      removePreset(id: string) {
        remove(id);
        if (id === keyboard.id) {
          if (presets.length > 1) {
            const selectedIndex = presets.findIndex(
              (preset) => preset.id === keyboard.id,
            );
            const index = presets.findIndex((preset) => preset.id === id);
            const newIndex = index === 0 ? 1 : selectedIndex - 1;
            keyboard.loadPreset(presets[newIndex].id);
          } else {
            createNewKeyboard();
          }
        }
      },
    }),
    [
      screen,
      resetScreen,
      tab,
      setTab,
      keyboard,
      screenMeterChannel,
      presets,
      createNewKeyboard,
      refresh,
      remove,
    ],
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
