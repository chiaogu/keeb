import { Sound } from '@src/hooks/useSound';
import IconButton from './shared/IconButton';
import SectionHeader from './shared/SectionHeader';
import SynthControl from './synth/SynthControl';
import { SoundConfig } from '@src/types';
import download, { downloadSound } from '@src/utils/download';

type SoundControlProps = {
  sound: SoundConfig;
  onRemoveLayer: Sound['removeLayer'];
  onAddLayer: Sound['addLayer'];
  onSrcChange: Sound['setSrcState'];
  onFxChange: Sound['setFxState'];
  onRemoveFx: Sound['removeFx'];
  onAddFx: Sound['addFx'];
};

export default function SoundControl({
  sound,
  onRemoveLayer,
  onAddLayer,
  onSrcChange,
  onFxChange,
  onRemoveFx,
  onAddFx,
}: SoundControlProps) {
  return (
    <div className='flex w-full max-w-[500px] flex-col items-center space-y-5'>
      <div className='flex w-full flex-col items-center border-2 border-black p-8'>
        <SectionHeader className='font-bold' label={sound.name}>
          <IconButton icon='upload' onClick={() => {}} />
          <IconButton icon='download' onClick={() => downloadSound(sound)} />
        </SectionHeader>
      </div>
      {sound.synths.map((synth, index) => (
        <SynthControl
          key={synth.id}
          name={`layer ${index}`}
          synth={synth}
          removable={sound.synths.length > 1}
          onRemove={() => onRemoveLayer(index)}
          onSrcChange={(src) => onSrcChange(index, src)}
          onFxChange={(fxIndex, fx) => onFxChange(index, fxIndex, fx)}
          onRemoveFx={(fxIndex) => onRemoveFx(index, fxIndex)}
          onAddFx={(fxIndex, fxType) => onAddFx(index, fxIndex, fxType)}
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
