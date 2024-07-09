import Keyboard from './Keyboard';

export default function KeySoundModifier() {
  return (
    <div className='flex flex-col items-center space-y-5'>
      <Keyboard />
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
      </div>
    </div>
  );
}
