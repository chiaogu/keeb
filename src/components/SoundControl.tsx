import { Sound } from '@src/hooks/useSound';
import useUplodaFile from '@src/hooks/useUplodaFile';
import { SoundConfig } from '@src/types';
import { downloadSound } from '@src/utils/file';
import { useEffect, useMemo, useState } from 'react';
import IconButton from './shared/IconButton';
import RadioGroup from './shared/RadioGroup';
import SectionHeader from './shared/SectionHeader';
import SynthControl from './synth/SynthControl';

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
    () => sound.synths[selectedLayerIndex],
    [selectedLayerIndex, sound.synths],
  );
  // TODO: Validation
  const { load } = useUplodaFile(onLoadSound);

  useEffect(() => {
    setSelectedLayerIndex(0);
  }, [sound.id]);

  return (
    <div className='flex w-full max-w-[500px] flex-col items-center space-y-5'>
      <div className='flex w-full flex-col items-center border-2 border-black p-8'>
        <SectionHeader
          className='font-bold'
          label={sound.name}
          onLabelChange={onNameChange}
        >
          <IconButton icon='upload' onClick={load} />
          <IconButton icon='download' onClick={() => downloadSound(sound)} />
        </SectionHeader>
        <div className='flex w-full flex-col'>
          <RadioGroup
            label='layers'
            values={[selectedSynth.id]}
            onChange={([id]) =>
              setSelectedLayerIndex(sound.synths.findIndex((s) => s.id === id))
            }
            options={sound.synths.map(({ id, name }) => ({
              key: id,
              label: name,
            }))}
          />
          <SectionHeader label='new'>
            <IconButton
              icon='add'
              onClick={() => {
                onAddLayer();
                setSelectedLayerIndex(sound.synths.length);
              }}
            />
          </SectionHeader>
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
