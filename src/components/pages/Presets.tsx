import { CONTROL_SHADOW } from '@src/utils/constants';
import IconButton from '../shared/IconButton';
import { useMainContext } from '../shared/MainContext';
import SectionHeader from '../shared/SectionHeader';
import dayjs from 'dayjs';

export default function Presets() {
  const { keyboard, presets, createNew, setKeyboardName } = useMainContext();
  
  return (
    <div className='flex w-full max-w-[500px] flex-col items-center p-8'>
      <SectionHeader label='current' className='mb-2 w-full font-bold'>
        <IconButton icon='upload' className='ml-2' onClick={() => {}} />
        <IconButton icon='download' className='ml-2' onClick={() => {}} />
      </SectionHeader>
      <SectionHeader
        className='mb-4'
        labelClassName='w-full'
        label={keyboard.name}
        onLabelChange={setKeyboardName}
      ></SectionHeader>

      <SectionHeader
        label={`${presets.length} keyboards`}
        className='mb-2 w-full font-bold'
      >
        <IconButton icon='add' onClick={createNew} />
      </SectionHeader>
      {presets.map((preset) => (
        <div className='mb-2 flex w-full' key={preset.id}>
          <div
            style={{ boxShadow: CONTROL_SHADOW }}
            className='relative mr-2 flex h-8 flex-1 cursor-pointer items-center justify-end overflow-hidden bg-white pr-2'
            onClick={() => keyboard.loadPreset(preset.id)}
          >
            <div className='truncate whitespace-nowrap pl-2'>{preset.name} {dayjs(preset.created).format('YYYYMMDD HHmmss')}</div>
          </div>
          <IconButton
            className={`shrink-0 ${preset.id === keyboard.id ? 'bg-white invert' : ''}`}
            icon='visibility'
            onClick={() => {}}
          />
          <IconButton icon='remove' className='ml-2' onClick={() => {}} />
        </div>
      ))}
    </div>
  );
}
