import { getDefaultSynth } from '@src/keyboard/defaults';
import createSynth, { Synth, SynthConfig } from '@src/synth';
import { parseFxNodeState, parseSrcNodeState } from '@src/synth/parseNodeData';
import { castDraft } from 'immer';
import { useCallback, useMemo } from 'react';
import { useImmer } from 'use-immer';

type SynthState = {
  synth: Synth;
  state: SynthConfig;
};

function createSynthState(config: SynthConfig) {
  const parsed = {
    ...config,
    src: parseSrcNodeState(config.src),
    fxs: config.fxs.map(parseFxNodeState),
  };
  return {
    state: parsed,
    synth: createSynth(parsed),
  };
}

export default function useSynths(synthConfigs: SynthConfig[]) {
  const initSynthStates = useMemo(
    () => synthConfigs.map(createSynthState),
    [synthConfigs],
  );
  const [synthStates, setSynthStates] = useImmer<SynthState[]>(initSynthStates);

  const wrapStateUpdater = useCallback(
    function wrapStateUpdater<
      FuncName extends 'setSrcState' | 'setFxState' | 'removeFx' | 'addFx',
      Func extends Synth[FuncName] & ((...args: unknown[]) => unknown),
    >(funcName: FuncName) {
      return (index: number, ...args: Parameters<Func>) => {
        setSynthStates((states) => {
          const func = states[index].synth[funcName] as Func;
          func(...args);

          const { src, fxs } = states[index].synth.state;
          states[index].state = {
            ...states[index].state,
            src,
            fxs,
          };
        });
      };
    },
    [setSynthStates],
  );

  const setSrcState = useMemo(
    () => wrapStateUpdater('setSrcState'),
    [wrapStateUpdater],
  );
  const setFxState = useMemo(
    () => wrapStateUpdater('setFxState'),
    [wrapStateUpdater],
  );
  const removeFx = useMemo(
    () => wrapStateUpdater('removeFx'),
    [wrapStateUpdater],
  );
  const addFx = useMemo(() => wrapStateUpdater('addFx'), [wrapStateUpdater]);

  const removeLayer = useCallback(
    (index: number) => {
      synthStates[index].synth.dispose();
      setSynthStates((states) => states.filter((_, i) => i !== index));
    },
    [setSynthStates, synthStates],
  );

  const addLayer = useCallback(() => {
    setSynthStates((states) => {
      states.push(
        castDraft(
          createSynthState({
            ...getDefaultSynth(),
            name: `layer ${states.length}`,
          }),
        ),
      );
    });
  }, [setSynthStates]);

  const updateLayer = useCallback(
    (index: number, updates: Pick<SynthConfig, 'name'>) => {
      setSynthStates((states) => {
        states[index].state = {
          ...states[index].state,
          ...updates,
        };
      });
    },
    [setSynthStates],
  );

  const reset = useCallback(
    (newSynths: SynthConfig[]) => {
      synthStates.forEach((s) => s.synth.dispose());
      setSynthStates(newSynths.map(createSynthState));
    },
    [setSynthStates, synthStates],
  );

  // TODO: Dispose when unmounted

  return useMemo(
    () => ({
      states: synthStates.map((s) => s.state),
      synths: synthStates.map((s) => s.synth),
      removeLayer,
      addLayer,
      updateLayer,
      reset,
      setSrcState,
      setFxState,
      removeFx,
      addFx,
    }),
    [
      addFx,
      addLayer,
      removeFx,
      removeLayer,
      reset,
      setFxState,
      setSrcState,
      synthStates,
      updateLayer,
    ],
  );
}
