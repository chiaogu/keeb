import * as Tone from "@src/tone";
import { FxNodeType, SrcNodeType, nodeConfig } from "./config";

type SupportedSrcToneNode = ReturnType<(typeof nodeConfig)[SrcNodeType]['createNode']>;
type SupportedFxToneNode = ReturnType<(typeof nodeConfig)[FxNodeType]['createNode']>;

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

  function setSrcState(newSrc: SynthConfig["src"]) {
    const type = newSrc.type;
    const data = nodeConfig[type].schema.parse(newSrc.data);

    if (srcNode === null || type !== state.src.type) {
      if (srcNode) srcNode.disconnect().dispose();
      srcNode = nodeConfig[type].createNode();
      rechain();
    }

    nodeConfig[type].setState(
      srcNode as never,
      data as never,
    );

    state.src = { type, data };
    handleChange?.();
  }

  function setFxs(fxs: SynthConfig["fxs"]) {
    if (!srcNode) throw new Error("synth is not initialized yet");

    fxNodes = fxs.map((fx) => nodeConfig[fx.type].createNode());
    fxs.forEach((fx, index) => setFxState(index, fx));
    rechain();

    state.fxs = fxs;
    handleChange?.();
  }

  function setFxState(index: number, fxState: SynthConfig["fxs"][number]) {
    const type = fxState.type;
    const data = nodeConfig[type].schema.parse(fxState.data);
    nodeConfig[fxState.type].setState(
      fxNodes[index] as never,
      data as never,
    );
    state.fxs[index] = { type, data };
    handleChange?.();
  }

  function removeFx(index: number) {
    state.fxs.splice(index, 1);
    setFxs(state.fxs);
  }

  function addFx(index: number, type: FxNodeType) {
    const data = nodeConfig[type].schema.parse({});
    state.fxs.splice(index, 0, { type, data });
    setFxs(state.fxs);
  }

  function trigger() {
    if (!srcNode) throw new Error("synth is not initialized yet");
    nodeConfig[state.src.type].trigger?.(
      srcNode as never,
      state.src.data as never,
    );
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

  async function ready() {
    if (!srcNode) throw new Error("synth is not initialized yet");

    await nodeConfig[state.src.type].ready?.(srcNode as never);
    await Promise.all(
      state.fxs.map((fx, index) =>
        nodeConfig[fx.type].ready?.(fxNodes[index] as never),
      ),
    );
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
    ready,
  };
}

export type Synth = ReturnType<typeof createSynth>;
