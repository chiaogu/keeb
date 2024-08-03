import { Sound } from '@src/hooks/useSound';
import * as Tone from '@src/tone';
import { SoundConfig } from '@src/types';
import { useEffect, useMemo, useState } from 'react';
import SynthControl from '../synth/SynthControl';
import { SoundLayerControl } from './SoundLayerControl';
import StickyHeader from './StickyHeader';

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
      <StickyHeader
        sound={sound}
        channel={channel}
        selectedSynth={selectedSynth}
      />
      <SoundLayerControl
        sound={sound}
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
      <SynthControl
        key={selectedSynth.id}
        synth={selectedSynth}
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
