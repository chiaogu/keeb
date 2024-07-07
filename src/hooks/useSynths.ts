import createSynth, {
  Synth,
  SynthConfig,
  SynthFxNodeState,
  SynthSrcNodeState,
} from '@src/synth';
import { FxNodeType } from '@src/synth/config';
import parseNodeData, {
  parseFxNodeState,
  parseSrcNodeState,
} from '@src/synth/parseNodeData';
import { useMemo } from 'react';
import { useImmer } from 'use-immer';
import { v4 as uuid } from 'uuid';

export type SynthState = {
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

  return useMemo(
    () => ({
      synthStates,
      removeLayer(index: number) {
        synthStates[index].synth.dispose();
        setSynthStates((states) => states.filter((_, i) => i !== index));
      },
      addLayer() {
        setSynthStates((states) => {
          states.push(
            createSynthState({
              id: uuid(),
              src: {
                type: 'noise',
                data: {},
              },
              fxs: [],
            }),
          );
        });
      },
      setSrcState(index: number, src: SynthSrcNodeState) {
        const parsed = parseSrcNodeState(src);
        synthStates[index].synth.setSrcState(parsed);

        setSynthStates((states) => {
          states[index].state.src = parsed;
        });
      },
      setFxState(synthIndex: number, fxIndex: number, fx: SynthFxNodeState) {
        const parsed = parseFxNodeState(fx);
        synthStates[synthIndex].synth.setFxState(fxIndex, parsed);
        setSynthStates((states) => {
          states[synthIndex].state.fxs[fxIndex] = parsed;
        });
      },
      removeFx(synthIndex: number, fxIndex: number) {
        synthStates[synthIndex].synth.removeFx(fxIndex);
        setSynthStates((states) => {
          states[synthIndex].state.fxs.splice(fxIndex, 1);
        });
      },
      addFx(synthIndex: number, fxIndex: number, type: FxNodeType) {
        synthStates[synthIndex].synth.addFx(fxIndex, type);
        setSynthStates((states) => {
          states[synthIndex].state.fxs.splice(fxIndex, 0, {
            type,
            data: parseNodeData(type, {}),
          });
        });
      },
      reset(newSynths: SynthConfig[]) {
        synthStates.forEach((s) => s.synth.dispose());
        setSynthStates(newSynths.map(createSynthState));
      }
    }),
    [setSynthStates, synthStates],
  );
}
