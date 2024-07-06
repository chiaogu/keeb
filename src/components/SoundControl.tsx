import { Sound } from '@src/hooks/useSound';
import IconButton from './shared/IconButton';
import SectionHeader from './shared/SectionHeader';
import SynthControl from './synth/SynthControl';

type SoundControlProps = {
  sound: Sound;
};

export default function SoundControl({ sound }: SoundControlProps) {
  return (
    <div className='flex w-full max-w-[500px] flex-col items-center space-y-5'>
      <div className='flex w-full flex-col items-center border-2 border-black p-8'>
        <SectionHeader className='font-bold' label={sound.id}>
          <IconButton icon='upload' onClick={() => {}} />
          <IconButton icon='download' onClick={() => {}} />
          {/* <IconButton icon='favorite' onClick={() => {}} /> */}
        </SectionHeader>
      </div>
      {sound.synths.map((synth, index) => (
        <SynthControl
          key={synth.getState().id}
          name={`layer ${index}`}
          synth={synth}
          onRemove={() => sound.removeLayer(index)}
          removable={sound.synths.length > 1}
        />
      ))}
      <div className='flex w-full flex-col items-center border-2 border-black p-8'>
        <div className='flex w-full items-end justify-between'>
          <label className='font-bold'>layer</label>
          <div className='flex space-x-2'>
            <IconButton icon='add' onClick={() => sound.addLayer()} />
          </div>
        </div>
      </div>
    </div>
  );
}
