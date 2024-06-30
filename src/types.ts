import { SynthConfig } from "./synth";

export type SoundConfig = {
  id: string;
  synths: SynthConfig[];
};

export type KeyboardConfig = {
  sound: {
    up: SoundConfig,
    down: SoundConfig,
  },
};
