import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { Envelope } from "@src/types";
import { baseSrcControls, defauleEnvelope } from "./shared";

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
      type: "envelope",
      defaultValue: defauleEnvelope,
    },
  },
  createNode: () => new Tone.NoiseSynth(),
  setState(node, state) {
    node.set({
      volume: state.volume as number,
      envelope: state.envelope as Envelope,
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
