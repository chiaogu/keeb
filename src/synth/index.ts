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

export default function createSynth(initState: SynthConfig) {
  const state: SynthConfig = initState;
  let srcNode: SupportedSrcToneNode | null = null;
  let fxNodes: SupportedFxToneNode[] = [];

  setSrcState(state.src);
  setFxs(state.fxs);
  
  function dispose() {
    if (!srcNode) throw new Error("synth is not initialized yet");
    srcNode.dispose();
    fxNodes.forEach((fxNode) => fxNode.dispose());
  }

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

    setToneNodeState(srcNode, src.data);

    state.src = src;
  }

  function setFxs(fxs: SynthConfig["fxs"]) {
    if (!srcNode) throw new Error("synth is not initialized yet");

    fxNodes = fxs.map((fx) => createFxNode(fx.type));
    fxs.forEach((fx, index) => setFxState(index, fx));
    rechain();

    state.fxs = fxs;
  }

  function setFxState(index: number, fxState: SynthConfig["fxs"][number]) {
    setToneNodeState(fxNodes[index], fxState.data);
    state.fxs[index] = fxState;
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
    triggerToneNode(srcNode);
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
  };
}

export type Synth = ReturnType<typeof createSynth>;
