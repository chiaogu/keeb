import * as Tone from 'tone';
import { FxNodeType, SrcNodeType } from "./config";
import { createSrcNode, SupportedSrcToneNode, createFxNode, SupportedFxToneNode } from "./createSynthNode";
import setToneNodeState from "./setToneNodeState";
import triggerToneNode from "./triggerToneNode";

export type SynthState = {
  src: { type: SrcNodeType, data: Record<string, unknown> },
  fxs: { type: FxNodeType, data: Record<string, unknown> }[],
};

export type Synth = {
  setSrcState: (srcState: SynthState['src']) => void,
  setFxs: (fxs: SynthState['fxs']) => void,
  setFxState: (index: number, fxState: SynthState['fxs'][number]) => void,
  getState: () => SynthState,
  trigger: () => void,
};

export default function createSynth(initState: SynthState): Synth {
  const state: SynthState = initState;
  let srcNode: SupportedSrcToneNode | null = null;
  let fxNodes: SupportedFxToneNode[] = [];
  
  setSrcState(state.src);
  setFxs(state.fxs);
  
  function rechain() {
    if (!srcNode) throw new Error('synth is not initialized yet');
    
    srcNode.disconnect();
    fxNodes.forEach((fxNode) => fxNode.disconnect());
    srcNode.chain(...fxNodes, Tone.getDestination());
  }

  function setSrcState(src: SynthState['src']) {
    if (srcNode === null || src.type !== state.src.type) {
      if (srcNode) srcNode.disconnect().dispose();  
      srcNode = createSrcNode(src.type);
      rechain();
    }
    
    setToneNodeState(srcNode, src.data);
    
    state.src = src;
  }
  
  function setFxs(fxs: SynthState['fxs']) {
    if (!srcNode) throw new Error('synth is not initialized yet');
    
    fxNodes = fxs.map((fx) => createFxNode(fx.type));
    fxs.forEach((fx, index) => setFxState(index, fx));
    rechain();
    
    state.fxs = fxs;
  }
  
  function setFxState(index: number, fxState: SynthState['fxs'][number]) {
    setToneNodeState(fxNodes[index], fxState.data);
    state.fxs[index] = fxState;
  }

  function trigger() {
    if (!srcNode) throw new Error('synth is not initialized yet');
    triggerToneNode(srcNode);
  }
  
  return {
    setSrcState,
    setFxs,
    setFxState,
    getState: () => state,
    trigger,
  };
}
