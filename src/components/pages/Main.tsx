import KeySoundModifier from '../keyboard/KeySoundModifier';
import TestButton from '../keyboard/TestButton';
import { MainContextProvider, useMainContext } from '../shared/MainContext';
import SoundControl from '../sound/SoundControl';
import Presets from './Presets';
import StickyHeader from './StickyHeader/StickyHeader';

function Main() {
  const { tab } = useMainContext();
  return (
    <div className='flex flex-col items-center pb-[70vh] pt-2'>
      <StickyHeader />
      <div className='flex w-full flex-col items-center overflow-hidden'>
      {tab === 'sound' && <SoundControl />}
      {tab === 'tweaks' && <KeySoundModifier />}
      {tab === 'presets' && <Presets />}
      </div>
      <TestButton />
    </div>
  );
}

export default function MainWithContext() {
  return (
    <MainContextProvider>
      <Main />
    </MainContextProvider>
  );
}
