import * as Tone from '@src/tone';
import { useMainContext } from '../../shared/MainContext';
import Adsr from '../../sound/Adsr';
import FFT from '../../sound/FFT';
import VolumeMeter from '../../sound/VolumeMeter';
import Waveform from '../../sound/Waveform';
import Navigation from './Navigation';

type StickyHeaderProps = {
  channel: Tone.ToneAudioNode;
};

function Meters({ channel }: { channel: Tone.ToneAudioNode }) {
  const { screen } = useMainContext();

  if (screen.type !== 'meter') {
    return null;
  }

  return (
    <div className='flex h-14 w-full items-center space-x-2 px-5 pb-6 pt-2 invert'>
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
  );
}

function Envelope() {
  const { screen } = useMainContext();

  if (screen.type !== 'adsr') {
    return null;
  }

  return (
    <div className='h-14 w-full px-4 py-3 invert'>
      <div className='relative size-full'>
        <Adsr envelope={screen.envelope} />
      </div>
    </div>
  );
}

export default function StickyHeader({ channel }: StickyHeaderProps) {
  return (
    <div
      style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '500px',
        background: 'rgba(0,0,0,0.6)',
        boxShadow: '0 5px 10px 0px rgba(0,0,0,0.2)',
      }}
      className='sticky top-2 z-20 mx-4 mb-6 rounded-md backdrop-blur-md'
    >
      <Meters channel={channel} />
      <Envelope />
      <Navigation />
    </div>
  );
}
