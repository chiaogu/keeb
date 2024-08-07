import { channels } from '@src/utils/constants';
import * as Tone from 'tone';
import { useMainContext } from '../../shared/MainContext';
import Adsr from '../../sound/Adsr';
import FFT from '../../sound/FFT';
import VolumeMeter from '../../sound/VolumeMeter';
import Waveform from '../../sound/Waveform';
import Navigation from './Navigation';

function Meters() {
  const { screen, screenMeterChannel } = useMainContext();

  if (screen.type !== 'meter') {
    return null;
  }

  const channel = screenMeterChannel
    ? channels[screenMeterChannel]
    : Tone.getDestination();

  return (
    <div className='pointer-events-none absolute top-0 flex size-full items-center space-x-2 px-5 py-3'>
      <div className='h-full flex-1'>
        <FFT channel={channel} />
      </div>
      <div className='h-full flex-1'>
        <Waveform channel={channel} />
      </div>
      <div className='h-full flex-1'>
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
    <div className='absolute top-0 h-14 w-full px-4 py-3'>
      <div
        style={{ filter: 'drop-shadow(2px 4px 2px rgba(0,0,0,0.3))' }}
        className='relative size-full'
      >
        <Adsr className='invert' envelope={screen.envelope} />
      </div>
    </div>
  );
}

export default function StickyHeader() {
  return (
    <div
      style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '500px',
        background: 'rgba(0,0,0,0.6)',
        boxShadow: '0 5px 10px 0px rgba(0,0,0,0.2)',
      }}
      className='sticky top-2 z-20 mx-4 rounded-md backdrop-blur-md'
    >
      <Meters />
      <Envelope />
      <Navigation />
    </div>
  );
}
