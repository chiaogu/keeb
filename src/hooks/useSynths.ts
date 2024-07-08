import createSynth, { Synth, SynthConfig } from '@src/synth';
import { parseFxNodeState, parseSrcNodeState } from '@src/synth/parseNodeData';
import { castDraft } from 'immer';
import { useMemo } from 'react';
import { useImmer } from 'use-immer';
import { v4 as uuid } from 'uuid';

type SynthState = {
  synth: Synth;
  state: SynthConfig;
};

function createSynthState(config: SynthConfig) {
  const parsed = {
    id: config.id,
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

  // TODO: Dispose when unmounted

  return useMemo(() => {
    function wrapStateUpdater<
      FuncName extends 'setSrcState' | 'setFxState' | 'removeFx' | 'addFx',
      Func extends Synth[FuncName] & ((...args: unknown[]) => unknown),
    >(funcName: FuncName) {
      return (index: number, ...args: Parameters<Func>) => {
        setSynthStates((states) => {
          (states[index].synth[funcName] as Func)(...args);
          states[index].state = states[index].synth.state;
        });
      };
    }

    return {
      states: synthStates.map((s) => s.state),
      synths: synthStates.map((s) => s.synth),
      removeLayer(index: number) {
        synthStates[index].synth.dispose();
        setSynthStates((states) => states.filter((_, i) => i !== index));
      },
      addLayer() {
        setSynthStates((states) => {
          states.push(
            castDraft(
              createSynthState({
                id: uuid(),
                src: {
                  id: uuid(),
                  type: 'noise',
                  data: {},
                },
                fxs: [],
              }),
            ),
          );
        });
      },
      reset(newSynths: SynthConfig[]) {
        synthStates.forEach((s) => s.synth.dispose());
        setSynthStates(newSynths.map(createSynthState));
      },
      setSrcState: wrapStateUpdater('setSrcState'),
      setFxState: wrapStateUpdater('setFxState'),
      removeFx: wrapStateUpdater('removeFx'),
      addFx: wrapStateUpdater('addFx'),
    };
  }, [setSynthStates, synthStates]);
}
