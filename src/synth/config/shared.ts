import { Envelope } from "@src/types";
import { NodeControlConfig } from ".";

export const baseSrcControls: Record<string, NodeControlConfig> = {
  volume: {
    type: "range",
    defaultValue: -10,
    range: [-80, -15],
  },
  duration: {
    type: "range",
    defaultValue: 0.1,
    range: [0.001, 0.2],
  },
  delay: {
    type: "range",
    defaultValue: 0,
    range: [0, 0.2],
  },
};

export const defauleEnvelope: Envelope = {
  attack: 0,
  decay: 0,
  sustain: 1,
  release: 0,
  attackCurve: 'linear',
  decayCurve: 'linear',
  releaseCurve: 'linear'
};
