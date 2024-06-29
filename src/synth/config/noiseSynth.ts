import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { ADSR } from "@src/types";

// TODO: validate schema

export const noiseSynthConfig: SynthNodeConfig<Tone.NoiseSynth> = {
  controls: {
    volume: {
      type: "range",
      defaultValue: -15,
      range: [-80, -15],
    },
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
  trigger(node) {
    node.triggerAttackRelease("64n");
  }
};

export const setNoiseSynthState = noiseSynthConfig.setState;
