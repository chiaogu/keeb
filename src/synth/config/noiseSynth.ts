import { z } from "zod";
import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import {
  baseSrcControls,
  Envelope,
  zBaseSynthSrc,
  zEnvelope,
} from "./shared";

const zNoiseSynth = zBaseSynthSrc.extend({
  type: z.enum(["brown", "white", "pink"]).catch("white"),
  envelope: zEnvelope,
});

export const noiseSynthConfig: SynthNodeConfig<
  Tone.NoiseSynth,
  typeof zNoiseSynth
> = {
  schema: zNoiseSynth,
  controls: {
    ...baseSrcControls,
    type: { type: "select" },
    envelope: { type: "envelope" },
  },
  createNode: () => new Tone.NoiseSynth(),
  setState(node, state) {
    node.set({
      volume: state.volume,
      envelope: state.envelope as Envelope,
    });

    node.noise.set({
      type: state.type,
    });
  },
  trigger(node, state) {
    node.triggerAttackRelease(state.duration, `+${state.delay}`);
  },
};

export const setNoiseSynthState = noiseSynthConfig.setState;
