import * as Tone from "@src/tone";
import { FxNodeType, SrcNodeType } from "./config";
import {
  createSrcNode,
  SupportedSrcToneNode,
  createFxNode,
  SupportedFxToneNode,
} from "./createSynthNode";
import setToneNodeState from "./setToneNodeState";
import triggerToneNode from "./triggerToneNode";

export type SynthSrcNodeState = {
  type: SrcNodeType;
  data: Record<string, unknown>;
};

export type SynthFxNodeState = {
  type: FxNodeType;
  data: Record<string, unknown>;
};

export type SynthNodeState = SynthSrcNodeState | SynthFxNodeState;

export type SynthConfig = {
  id: string;
  src: SynthSrcNodeState;
  fxs: SynthFxNodeState[];
};

export default function createSynth(config: SynthConfig) {
  const state: SynthConfig = config;
  let srcNode: SupportedSrcToneNode | null = null;
  let fxNodes: SupportedFxToneNode[] = [];
  let handleChange: (() => void) | null = null;

  setSrcState(state.src);
  setFxs(state.fxs);
  
  function rechain() {
    if (!srcNode) throw new Error("synth is not initialized yet");

    srcNode.disconnect();
    fxNodes.forEach((fxNode) => fxNode.disconnect());
    srcNode.chain(...fxNodes, Tone.getDestination());
  }

  function setSrcState(src: SynthConfig["src"]) {
    if (srcNode === null || src.type !== state.src.type) {
      if (srcNode) srcNode.disconnect().dispose();
      srcNode = createSrcNode(src.type);
      rechain();
    }

    setToneNodeState(srcNode, src);

    state.src = src;
    handleChange?.();
  }

  function setFxs(fxs: SynthConfig["fxs"]) {
    if (!srcNode) throw new Error("synth is not initialized yet");

    fxNodes = fxs.map((fx) => createFxNode(fx.type));
    fxs.forEach((fx, index) => setFxState(index, fx));
    rechain();

    state.fxs = fxs;
    handleChange?.();
  }

  function setFxState(index: number, fxState: SynthConfig["fxs"][number]) {
    setToneNodeState(fxNodes[index], fxState);
    state.fxs[index] = fxState;
    handleChange?.();
  }

  function removeFx(index: number) {
    state.fxs.splice(index, 1);
    setFxs(state.fxs);
  }

  function addFx(index: number, node: SynthFxNodeState) {
    state.fxs.splice(index, 0, node);
    setFxs(state.fxs);
  }

  function trigger() {
    if (!srcNode) throw new Error("synth is not initialized yet");
    triggerToneNode(srcNode, state.src);
  }

  function dispose() {
    if (!srcNode) throw new Error("synth is not initialized yet");
    srcNode.dispose();
    fxNodes.forEach((fxNode) => fxNode.dispose());
    handleChange = null;
  }
  
  function setOnChangeListener(listenr: () => void) {
    handleChange = listenr;
  }

  return {
    setSrcState,
    setFxs,
    setFxState,
    removeFx,
    addFx,
    getState: () => state,
    trigger,
    dispose,
    setOnChangeListener,
  };
}

export type Synth = ReturnType<typeof createSynth>;
