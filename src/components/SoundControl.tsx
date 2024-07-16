import { Sound } from '@src/hooks/useSound';
import { SoundConfig } from '@src/types';
import { downloadSound } from '@src/utils/file';
import IconButton from './shared/IconButton';
import SectionHeader from './shared/SectionHeader';
import SynthControl from './synth/SynthControl';
import useUplodaFile from '@src/hooks/useUplodaFile';

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
  // TODO: Validation
  const { load } = useUplodaFile(onLoadSound);
  
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
      </div>
      {sound.synths.map((synth, index) => (
        <SynthControl
          key={synth.id}
          synth={synth}
          removable={sound.synths.length > 1}
          onRemove={() => onRemoveLayer(index)}
          onSrcChange={(src) => onSrcChange(index, src)}
          onFxChange={(fxIndex, fx) => onFxChange(index, fxIndex, fx)}
          onRemoveFx={(fxIndex) => onRemoveFx(index, fxIndex)}
          onAddFx={(fxIndex, fxType) => onAddFx(index, fxIndex, fxType)}
          onNameChange={(name) => onSynthNameChange(index, name)}
        />
      ))}
      <div className='flex w-full flex-col items-center border-2 border-black p-8'>
        <div className='flex w-full items-end justify-between'>
          <label className='font-bold'>layer</label>
          <div className='flex space-x-2'>
            <IconButton icon='add' onClick={onAddLayer} />
          </div>
        </div>
      </div>
    </div>
  );
}
