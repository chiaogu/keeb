import { produce, castDraft, Immutable } from 'immer';
import * as Tone from "@src/tone";
import { FxNodeType, SrcNodeType, SynthNodeType, nodeConfig } from "./config";

type SupportedSrcToneNode = ReturnType<
  (typeof nodeConfig)[SrcNodeType]["createNode"]
>;
type SupportedFxToneNode = ReturnType<
  (typeof nodeConfig)[FxNodeType]["createNode"]
>;

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
  let state: Immutable<SynthConfig> = config;
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

  function setToneState(
    type: SynthNodeType,
    node: SupportedSrcToneNode | SupportedFxToneNode,
    state: Record<string, unknown>,
  ) {
    if (nodeConfig[type].setState) {
      nodeConfig[type].setState?.(node as never, state as never);
    } else {
      node.set(state);
    }
  }

  function setSrcState(newSrc: SynthConfig["src"]) {
    const type = newSrc.type;
    const { data, error } = nodeConfig[type].schema.safeParse(newSrc.data);

    if (error) {
      console.error(error.issues);
      throw error;
    }

    if (srcNode === null || type !== state.src.type) {
      if (srcNode) srcNode.disconnect().dispose();
      srcNode = nodeConfig[type].createNode();
      rechain();
    }

    setToneState(type, srcNode, data);

    state = produce(state, draft => {
      draft.src = { type, data };
    });
    handleChange?.();
  }

  function setFxs(fxs: Immutable<SynthConfig["fxs"]>) {
    if (!srcNode) throw new Error("synth is not initialized yet");

    fxNodes = fxs.map((fx) => nodeConfig[fx.type].createNode());
    fxs.forEach((fx, index) => setFxState(index, fx));
    rechain();

    state = produce(state, draft => {
      draft.fxs = castDraft(fxs);
    });
    handleChange?.();
  }

  function setFxState(index: number, fxState: SynthConfig["fxs"][number]) {
    const type = fxState.type;
    const data = nodeConfig[type].schema.parse(fxState.data);

    setToneState(fxState.type, fxNodes[index], data);

    state = produce(state, draft => {
      draft.fxs[index] = { type, data };
    });
    handleChange?.();
  }

  function removeFx(index: number) {
    state = produce(state, draft => {
      draft.fxs.splice(index, 1);
    });
    setFxs(state.fxs);
  }

  function addFx(index: number, type: FxNodeType) {
    state = produce(state, draft => {
      const data = nodeConfig[type].schema.parse({});
      draft.fxs.splice(index, 0, { type, data });
    });
    setFxs(state.fxs);
  }

  function trigger() {
    if (!srcNode) throw new Error("synth is not initialized yet");
    nodeConfig[state.src.type].trigger?.(
      srcNode as never,
      state.src.data as never,
      state.src.data as never,
    );
    
    state.fxs.forEach((fx, index) => {
      nodeConfig[fx.type].trigger?.(
        fxNodes[index] as never,
        fx.data as never,
        state.src.data as never,
      );
    });
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
