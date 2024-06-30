import { z } from "zod";
import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { zBaseSynthSrc } from "./shared";
import { zEnvelope } from "./envelope";
import { zNoise } from "./noise";

const zNoiseSynth = zBaseSynthSrc.extend({
  noise: zNoise,
  envelope: zEnvelope,
});

export const noiseSynthConfig: SynthNodeConfig<
  Tone.NoiseSynth,
  typeof zNoiseSynth
> = {
  schema: zNoiseSynth,
  controls: {
    noise: { label: null },
  },
  createNode: () => new Tone.NoiseSynth(),
  setState(node, state) {
    node.set(state);
  },
  trigger(node, state) {
    node.triggerAttackRelease(
      state.duration,
      `+${state.delay}`,
    );
  },
};
