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

export type SynthState = {
  src: SynthSrcNodeState;
  fxs: SynthFxNodeState[];
};

export type Synth = {
  setSrcState: (srcState: SynthSrcNodeState) => void;
  setFxs: (fxs: SynthFxNodeState[]) => void;
  setFxState: (index: number, fxState: SynthFxNodeState) => void;
  removeFx: (index: number) => void;
  addFx: (index: number, fx: SynthFxNodeState) => void;
  getState: () => SynthState;
  trigger: () => void;
};

export default function createSynth(initState: SynthState): Synth {
  const state: SynthState = initState;
  let srcNode: SupportedSrcToneNode | null = null;
  let fxNodes: SupportedFxToneNode[] = [];

  setSrcState(state.src);
  setFxs(state.fxs);

  function rechain() {
    if (!srcNode) throw new Error("synth is not initialized yet");

    srcNode.disconnect();
    fxNodes.forEach((fxNode) => fxNode.disconnect());
    srcNode.chain(...fxNodes, Tone.getDestination());
  }

  function setSrcState(src: SynthState["src"]) {
    if (srcNode === null || src.type !== state.src.type) {
      if (srcNode) srcNode.disconnect().dispose();
      srcNode = createSrcNode(src.type);
      rechain();
    }

    setToneNodeState(srcNode, src.data);

    state.src = src;
  }

  function setFxs(fxs: SynthState["fxs"]) {
    if (!srcNode) throw new Error("synth is not initialized yet");

    fxNodes = fxs.map((fx) => createFxNode(fx.type));
    fxs.forEach((fx, index) => setFxState(index, fx));
    rechain();

    state.fxs = fxs;
  }

  function setFxState(index: number, fxState: SynthState["fxs"][number]) {
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
  };
}
