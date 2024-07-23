import { Sound } from '@src/hooks/useSound';
import { SoundConfig } from '@src/types';
import { useEffect, useMemo, useState } from 'react';
import SynthControl from '../synth/SynthControl';
import { SoundLayerControl } from './SoundLayerControl';

type SoundControlProps = {
  sound: SoundConfig;
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
    <div className='flex w-full max-w-[500px] flex-col items-center space-y-5'>
      <SoundLayerControl
        sound={sound}
        selectedSynth={selectedSynth}
        onAddLayer={onAddLayer}
        onNameChange={onNameChange}
        onLoadSound={onLoadSound}
        onSelectLayer={setSelectedLayerIndex}
      />
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
