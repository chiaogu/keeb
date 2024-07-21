import * as Tone from '@src/tone';
import { castDraft, Immutable, produce } from 'immer';
import { v4 as uuid } from 'uuid';
import { FxNodeType, nodeConfig, SrcNodeType, SynthNodeType } from './config';
import parseNodeData from './parseNodeData';
import { getModifiedNodeData, SoundModifier, SynthModifier } from '@src/keyboard/keySoundModifier';

type SupportedSrcToneNode = ReturnType<
  (typeof nodeConfig)[SrcNodeType]['createNode']
>;
type SupportedFxToneNode = ReturnType<
  (typeof nodeConfig)[FxNodeType]['createNode']
>;

export type SynthSrcNodeState = {
  id: string;
  type: SrcNodeType;
  data: Record<string, unknown>;
};

export type SynthFxNodeState = {
  id: string;
  type: FxNodeType;
  data: Record<string, unknown>;
};

export type SynthNodeState = SynthSrcNodeState | SynthFxNodeState;

export type SynthConfig = {
  id: string;
  name: string;
  src: SynthSrcNodeState;
  fxs: SynthFxNodeState[];
};

export default function createSynth(config: Immutable<SynthConfig>) {
  let state: Immutable<SynthConfig> = config;
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

  function setSrcState(newSrc: SynthConfig['src']) {
    const id = newSrc.id ?? uuid();
    const type = newSrc.type;
    const data = parseNodeData(type, newSrc.data);

    if (srcNode === null || type !== state.src.type) {
      if (srcNode) srcNode.disconnect().dispose();
      srcNode = nodeConfig[type].createNode();
      rechain();
    }

    setToneState(type, srcNode, data);

    state = produce(state, (draft) => {
      draft.src = { id, type, data };
    });
  }

  function setFxs(fxs: Immutable<SynthConfig['fxs']>) {
    if (!srcNode) throw new Error('synth is not initialized yet');

    fxNodes = fxs.map((fx) => nodeConfig[fx.type].createNode());
    fxs.forEach((fx, index) => setFxState(index, fx));
    rechain();

    state = produce(state, (draft) => {
      draft.fxs = castDraft(fxs);
    });
  }

  function setFxState(index: number, fxState: SynthConfig['fxs'][number]) {
    const id = fxState.id ?? uuid();
    const type = fxState.type;
    const data = parseNodeData(type, fxState.data);

    setToneState(fxState.type, fxNodes[index], data);

    state = produce(state, (draft) => {
      draft.fxs[index] = { id, type, data };
    });
  }

  function removeFx(index: number) {
    state = produce(state, (draft) => {
      draft.fxs.splice(index, 1);
    });
    setFxs(state.fxs);
  }

  function addFx(index: number, type: FxNodeType) {
    state = produce(state, (draft) => {
      const data = parseNodeData(type, {});
      draft.fxs.splice(index, 0, { id: uuid(), type, data });
    });
    setFxs(state.fxs);
  }

  function trigger(modifiers: SoundModifier[] = []) {
    if (!srcNode) throw new Error('synth is not initialized yet');
    
    const modifiedSrcData = getModifiedNodeData(state.src, modifiers);
    setToneState(state.src.type, srcNode, modifiedSrcData);
    nodeConfig[state.src.type].trigger?.(
      srcNode as never,
      modifiedSrcData as never,
    );

    state.fxs.forEach((fx, index) => {
      const modifiedFxData = getModifiedNodeData(fx, modifiers);
      setToneState(fx.type, fxNodes[index], modifiedFxData);
      nodeConfig[fx.type].trigger?.(
        fxNodes[index] as never,
        modifiedSrcData as never,
      );
    });
  }

  function dispose() {
    if (!srcNode) throw new Error('synth is not initialized yet');
    srcNode.dispose();
    fxNodes.forEach((fxNode) => fxNode.dispose());
  }

  async function ready() {
    if (!srcNode) throw new Error('synth is not initialized yet');

    await nodeConfig[state.src.type].ready?.(srcNode as never);
    await Promise.all(
      state.fxs.map((fx, index) =>
        nodeConfig[fx.type].ready?.(fxNodes[index] as never),
      ),
    );
  }

  return {
    setSrcState,
    setFxState,
    removeFx,
    addFx,
    trigger,
    dispose,
    ready,
    get state() {
      return state;
    },
  };
}

export type Synth = ReturnType<typeof createSynth>;
