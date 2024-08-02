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