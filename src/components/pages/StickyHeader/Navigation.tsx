import { useMainContext } from '@src/components/shared/MainContext';
import SliderSelect from '@src/components/shared/SliderSelect';
import { useCallback, useMemo, useState } from 'react';

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
  const { tab, setTab } = useMainContext();
  const [localTab, setLocalTab] = useState(tab);
  const value = useMemo(
    () => TABS.find(({ value }) => value === localTab)?.value ?? '',
    [localTab],
  );

  const handleRelease = useCallback(() => {
    setTab(localTab);
  }, [localTab, setTab]);

  return (
    <div className='h-14 w-full px-4'>
      <SliderSelect
        label={value}
        options={TABS}
        value={localTab}
        onChange={setLocalTab}
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
