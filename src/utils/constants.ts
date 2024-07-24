import * as Tone from 'tone';

export const MAX_SOUND_DURATION = 1;

export const channels = {
  up: new Tone.Channel().toDestination(),
  down: new Tone.Channel().toDestination(),
};
