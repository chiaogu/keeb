import { z } from "zod";
import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { zBaseSynthSrc } from "./shared";
import { zEnvelope } from "./envelope";

const zNoiseSynth = zBaseSynthSrc.extend({
  type: z.enum(["brown", "white", "pink"]).catch("white"),
  envelope: zEnvelope,
});

export const noiseSynthConfig: SynthNodeConfig<
  Tone.NoiseSynth,
  typeof zNoiseSynth
> = {
  schema: zNoiseSynth,
  createNode: () => new Tone.NoiseSynth(),
  setState(node, state) {
    node.set({
      volume: state.volume,
      envelope: state.envelope,
    });

    node.noise.set({
      type: state.type,
    });
  },
  trigger(node, state) {
    node.triggerAttackRelease(
      state.duration,
      `+${state.delay}`,
    );
  },
};
