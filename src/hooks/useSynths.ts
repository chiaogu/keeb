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
  const [synths, setSynths] = useImmer<SynthState[]>(initSynthStates);

  // TODO: Separate state and synth and dispose when unmounted

  return useMemo(
    () => ({
      states: synths.map(({ state }) => state),
      synths: synths.map(({ synth }) => synth),
      removeLayer(index: number) {
        synths[index].synth.dispose();
        setSynths((states) => states.filter((_, i) => i !== index));
      },
      addLayer() {
        setSynths((states) => {
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
        synths[index].synth.setSrcState(parsed);

        setSynths((states) => {
          states[index].state.src = parsed;
        });
      },
      setFxState(synthIndex: number, fxIndex: number, fx: SynthFxNodeState) {
        const parsed = parseFxNodeState(fx);
        synths[synthIndex].synth.setFxState(fxIndex, parsed);
        setSynths((states) => {
          states[synthIndex].state.fxs[fxIndex] = parsed;
        });
      },
      removeFx(synthIndex: number, fxIndex: number) {
        synths[synthIndex].synth.removeFx(fxIndex);
        setSynths((states) => {
          states[synthIndex].state.fxs.splice(fxIndex, 1);
        });
      },
      addFx(synthIndex: number, fxIndex: number, type: FxNodeType) {
        synths[synthIndex].synth.addFx(fxIndex, type);
        setSynths((states) => {
          states[synthIndex].state.fxs.splice(fxIndex, 0, {
            type,
            data: parseNodeData(type, {}),
          });
        });
      },
      reset(newSynths: SynthConfig[]) {
        synths.forEach((s) => s.synth.dispose());
        setSynths(newSynths.map(createSynthState));
      }
    }),
    [setSynths, synths],
  );
}
