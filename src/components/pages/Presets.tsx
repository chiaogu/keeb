import { COLOR } from '@src/utils/constants';
import IconButton from '../shared/IconButton';
import { useMainContext } from '../shared/MainContext';
import SectionHeader from '../shared/SectionHeader';

export default function Presets() {
  const { keyboard } = useMainContext();
  return (
    <div className='my-4 flex w-full max-w-[500px] flex-col items-center'>
      <div
        style={{ background: COLOR.BG }}
        className='flex w-full flex-col items-center p-8'
      >
        <SectionHeader
          label={keyboard.name}
          onLabelChange={keyboard.setName}
          className='font-bold'
        >
          <IconButton icon='scan_delete' onClick={keyboard.reset} />
          <IconButton icon='upload' onClick={keyboard.upload} />
          <IconButton icon='download' onClick={keyboard.download} />
        </SectionHeader>
      </div>
    </div>
  );
}
