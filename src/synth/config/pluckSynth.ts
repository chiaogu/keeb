import { z } from "zod";
import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { zBaseSynthSrc } from "./shared";
import { zEnvelope } from "./envelope";

const zPluckSynth = zBaseSynthSrc.extend({
  type: z.enum(["brown", "white", "pink"]).catch("white"),
  envelope: zEnvelope,
});

export const pluchSynthConfig: SynthNodeConfig<
  Tone.NoiseSynth,
  typeof zPluckSynth
> = {
  schema: zPluckSynth,
  createNode: () => new Tone.NoiseSynth(),
  setState(node, state) {
    node.set({
      volume: state.volume,
      envelope: state.envelope,
    });
  },
  trigger(node, state) {
    node.triggerAttackRelease(
      state.duration,
      `+${state.delay}`,
    );
  },
};
