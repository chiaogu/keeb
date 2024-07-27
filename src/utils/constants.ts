import * as Tone from 'tone';

export const MAX_SOUND_DURATION = 1;
export const MAX_SAMPLE_SIZE = 2048;

export const channels = {
  up: new Tone.Channel().toDestination(),
  down: new Tone.Channel().toDestination(),
};

export const COLOR = {
  BG: '#f3f4f6',
};