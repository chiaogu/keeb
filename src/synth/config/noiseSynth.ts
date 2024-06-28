import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";

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
  },
  createNode: () => new Tone.NoiseSynth(),
  setState(node, state) {
    node.set({
      volume: state.volume as number,
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
