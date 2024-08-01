import { Sound } from '@src/hooks/useSound';
import * as Tone from '@src/tone';
import { SoundConfig } from '@src/types';
import { COLOR } from '@src/utils/constants';
import { useEffect, useMemo, useState } from 'react';
import SynthControl from '../synth/SynthControl';
import FFT from './FFT';
import { SoundLayerControl } from './SoundLayerControl';
import VolumeMeter from './VolumeMeter';
import Waveform from './Waveform';

type SoundControlProps = {
  sound: SoundConfig;
  channel: Tone.ToneAudioNode;
  onRemoveLayer: Sound['removeLayer'];
  onAddLayer: Sound['addLayer'];
  onSrcChange: Sound['setSrcState'];
  onFxChange: Sound['setFxState'];
  onRemoveFx: Sound['removeFx'];
  onAddFx: Sound['addFx'];
  onNameChange: Sound['setName'];
  onLoadSound: (sound: SoundConfig) => void;
  onSynthNameChange: (index: number, name: string) => void;
};

export default function SoundControl({
  sound,
  channel,
  onRemoveLayer,
  onAddLayer,
  onSrcChange,
  onFxChange,
  onRemoveFx,
  onAddFx,
  onNameChange,
  onLoadSound,
  onSynthNameChange,
}: SoundControlProps) {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const selectedSynth = useMemo(
    () => sound.synths[Math.min(selectedLayerIndex, sound.synths.length - 1)],
    [selectedLayerIndex, sound.synths],
  );

  useEffect(() => {
    setSelectedLayerIndex(0);
  }, [sound.id]);

  return (
    <div className='flex w-full max-w-[500px] flex-col items-center space-y-5 overflow-x-visible'>
      <SoundLayerControl
        sound={sound}
        channel={channel}
        selectedSynth={selectedSynth}
        onAddLayer={onAddLayer}
        onNameChange={onNameChange}
        onLoadSound={onLoadSound}
        onSelectLayer={setSelectedLayerIndex}
        onRemoveLayer={(index) => {
          onRemoveLayer(index);
          setSelectedLayerIndex(
            Math.max(Math.min(selectedLayerIndex, sound.synths.length - 2), 0),
          );
        }}
      />
      <div
        style={{ marginTop: 0, background: COLOR.BG }}
        className='sticky top-0 z-10 flex w-full items-center space-x-2 px-8 pb-6 pt-0'
      >
        <div className='h-[28px] flex-1'>
          <FFT channel={channel} />
        </div>
        <div className='mt-3 h-[14px] flex-1'>
          <Waveform channel={channel} />
        </div>
        <div className='flex-1'>
          <VolumeMeter channel={channel} />
        </div>
      </div>
      <SynthControl
        key={selectedSynth.id}
        synth={selectedSynth}
        removable={sound.synths.length > 1}
        onRemove={() => {
          onRemoveLayer(selectedLayerIndex);
          setSelectedLayerIndex(
            Math.max(Math.min(selectedLayerIndex, sound.synths.length - 2), 0),
          );
        }}
        onSrcChange={(src) => {
          onSrcChange(selectedLayerIndex, src);
        }}
        onFxChange={(fxIndex, fx) =>
          onFxChange(selectedLayerIndex, fxIndex, fx)
        }
        onRemoveFx={(fxIndex) => {
          onRemoveFx(selectedLayerIndex, fxIndex);
        }}
        onAddFx={(fxIndex, fxType) =>
          onAddFx(selectedLayerIndex, fxIndex, fxType)
        }
        onNameChange={(name) => {
          onSynthNameChange(selectedLayerIndex, name);
        }}
      />
    </div>
  );
}
