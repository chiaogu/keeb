import SectionHeader from '../shared/SectionHeader';

export default function KeySoundModifier() {
  return (
    <div className='flex  w-full flex-col items-center space-y-5'>
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        <SectionHeader label='modifier' />
      </div>
    </div>
  );
}
