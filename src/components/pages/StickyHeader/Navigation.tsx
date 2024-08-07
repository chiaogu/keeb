import { useDebounceCallback } from '@react-hook/debounce';
import { useMainContext } from '@src/components/shared/MainContext';
import SliderSelect from '@src/components/shared/SliderSelect';
import { useKeyEvents } from '@src/hooks/useKeyEvents';
import { keys } from '@src/keyboard/keys';
import { dispatchKeyEvent, shouldShowKeyEventVisual } from '@src/utils/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

const TABS = [
  {
    value: 'sound',
    label: <span className='material-symbols-outlined -mx-2'>vital_signs</span>,
  },
  {
    value: 'tweaks',
    label: (
      <span className='material-symbols-outlined -mx-2'>discover_tune</span>
    ),
  },
  {
    value: 'visual',
    label: (
      <span className='material-symbols-outlined -mx-2'>deployed_code</span>
    ),
  },
  {
    value: 'presets',
    label: <span className='material-symbols-outlined -mx-2'>folder_open</span>,
  },
  {
    value: 'about',
    label: <span className='material-symbols-outlined -mx-2'>emoticon</span>,
  },
] as const;

export type Tab = (typeof TABS)[number]['value'];

export default function Navigation() {
  const [readyForMeter, setReadyForMeter] = useState(false);
  const { tab, setTab, screen, setScreen, resetScreen } = useMainContext();
  const [localTab, setLocalTab] = useState(tab);
  const value = useMemo(
    () => TABS.find(({ value }) => value === localTab)?.value ?? '',
    [localTab],
  );
  
  useEffect(() => {
    setTimeout(() => setReadyForMeter(true), 1000);
  }, []);

  const resetAfterKeyEvents = useDebounceCallback(resetScreen, 2000);

  const handleKeyEvents = useCallback(
    (e: KeyboardEvent) => {
      if (readyForMeter && screen.type === 'nav' && shouldShowKeyEventVisual(e)) {
        setScreen({ type: 'meter' });
      }
      resetAfterKeyEvents();
    },
    [readyForMeter, resetAfterKeyEvents, screen.type, setScreen],
  );

  const handlers = useMemo(
    () => ({ onKeydown: handleKeyEvents, onKeyUp: handleKeyEvents }),
    [handleKeyEvents],
  );

  useKeyEvents(handlers);

  const handleDrag = useCallback(() => {
    setScreen({ type: 'nav' });
  }, [setScreen]);

  const handleRelease = useCallback(
    (newTab: string) => {
      setTab(newTab);
      setLocalTab(newTab);
    },
    [setTab],
  );

  const handleChange = useCallback((value: string) => {
    setLocalTab(value);

    const index = TABS.findIndex((tab) => tab.value === value);
    dispatchKeyEvent({
      event: 'keydown',
      code: keys[2][index + 1],
      visual: false,
    });
  }, []);

  return (
    <div
      style={{ opacity: screen.type === 'nav' ? 1 : 0 }}
      className='h-14 w-full px-4'
    >
      <SliderSelect
        label={value}
        options={TABS}
        value={localTab}
        onChange={handleChange}
        onDrag={handleDrag}
        onRelease={handleRelease}
        sensitivity={2}
        showOptions
        bgColor='transparent'
        bgStyle={{
          color: 'white',
          textShadow: '2px 4px 2px rgba(0,0,0,0.3)',
          height: '56px',
        }}
        indicatorStyle={{
          background: 'white',
          mixBlendMode: 'difference',
          boxShadow: '2px 4px 2px rgba(0,0,0,0.3)',
          height: '32px',
          top: '12px',
        }}
      />
    </div>
  );
}
