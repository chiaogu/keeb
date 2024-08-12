import * as Tone from 'tone';

export const MAX_SOUND_DURATION = 1;
export const MAX_SAMPLE_SIZE = 2048;

export const channels = {
  up: new Tone.Channel().toDestination(),
  down: new Tone.Channel().toDestination(),
};

export const COLOR = {
  BG: '#f5f5f5',
};

export const CONTROL_SHADOW = '0 5px 10px 0px rgba(0,0,0,0.05)';

export const BASE_URL = 'keeb';

export const TABS = [
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

export const MAX_BRIGHTNESS = 0.7;
