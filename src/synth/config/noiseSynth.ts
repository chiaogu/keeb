import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { ADSR } from "@src/types";
import baseSrcControls from "./baseSrcControls";

// TODO: validate schema

export const noiseSynthConfig: SynthNodeConfig<Tone.NoiseSynth> = {
  controls: {
    ...baseSrcControls,
    type: {
      type: "select",
      defaultValue: "brown",
      options: ["brown", "white", "pink"],
    },
    envelope: {
      type: "adsr",
      defaultValue: [0, 0, 1, 0],
    },
  },
  createNode: () => new Tone.NoiseSynth(),
  setState(node, state) {
    node.set({
      volume: state.volume as number,
      envelope: {
        attack: (state.envelope as ADSR)[0],
        decay: (state.envelope as ADSR)[1],
        sustain: (state.envelope as ADSR)[2],
        release: (state.envelope as ADSR)[3],
      }
    });
  
    node.noise.set({
      type: state.type as Tone.NoiseType,
    });
  },
  trigger(node, state) {
    node.triggerAttackRelease(state.duration as number, `+${state.delay}`);
  }
};

export const setNoiseSynthState = noiseSynthConfig.setState;
