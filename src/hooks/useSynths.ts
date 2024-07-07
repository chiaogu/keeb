import defaultSoundLayer from '@src/presets/synth/defaultSoundLayer.json';
import createSynth, {
  Synth,
  SynthConfig,
  SynthFxNodeState,
  SynthSrcNodeState,
} from '@src/synth';
import { FxNodeType } from '@src/synth/config';
import { Immutable, castDraft } from 'immer';
import { useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { v4 as uuid } from 'uuid';

type SynthState = {
  synth: Synth;
  state: SynthConfig;
};

function createSynthState(config: SynthConfig) {
  return {
    state: config,
    synth: createSynth(config),
  };
}

export default function useSynths(synthConfigs: SynthConfig[]) {
  const initSynthStates = useMemo(
    () => synthConfigs.map(createSynthState),
    [synthConfigs],
  );
  const [synths, setSynths] = useImmer<SynthState[]>(initSynthStates);

  return useMemo(
    () => ({
      synths: synths.map(({ state }) => state),
      removeLayer(index: number) {
        synths[index].synth.dispose();
        setSynths((synths) => synths.filter((_, i) => i !== index));
      },
      addLayer() {
        setSynths((synths) =>
          synths.push(
            createSynthState({
              ...(defaultSoundLayer as SynthConfig),
              id: uuid(),
            }),
          ),
        );
      },
      setSrcState(index: number, src: SynthSrcNodeState) {
        synths[index].synth.setSrcState(src);
        setSynths((synths) => synths[index].state.src = src);
      },
      setFxState(synthIndex: number, fxIndex: number, fx: SynthFxNodeState) {
        synths[synthIndex].synth.setFxState(fxIndex, fx);
      },
      removeFx(synthIndex: number, fxIndex: number) {},
      addFx(synthIndex: number, fxIndex: number, type: FxNodeType) {},
    }),
    [setSynths, synths],
  );
}
