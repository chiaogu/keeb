import { useMainContext } from '@src/components/shared/MainContext';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  SoundStructureProps,
} from '@src/components/sound/SoundStructure';
import { KeyEvent } from '@src/hooks/useKeyboard';
import { pick } from 'lodash-es';

export type SoundFieldPath = {
  synthId: string;
  nodeId: string;
  fieldPath: string[];
};

type KeyboardSounStructureProps<T> = Pick<
  SoundStructureProps<T>,
  'structure' | 'renderField' | 'shouldRenderField'
>;


// TODO: foldable
// TODO: Add a new section for unknown synths
export default function KeyboardSoundStructure<T>({
  structure,
  renderField,
  shouldRenderField,
}: KeyboardSounStructureProps<T>) {
  const { keyboard } = useMainContext();

  const renderStructure = (keyEvent: KeyEvent) => {
    const filteredStructure = pick(
      structure,
      keyboard[keyEvent].sound.synths.map(({ id }) => id),
    );
    
    if (Object.keys(filteredStructure).length === 0) {
      return null;
    }
    
    return (
      <>
        <SectionHeader label={`${keyEvent}stroke`} />
        <div className='relative w-full'>
          <div
            className={
              'absolute bottom-2 top-0 border-l-2 border-dotted border-l-black'
            }
          ></div>
          <div className='pl-[10px] w-full'>
            <SoundStructure
              synths={keyboard[keyEvent].sound.synths}
              structure={filteredStructure}
              renderField={renderField}
              shouldRenderField={shouldRenderField}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className='w-full'>
      {renderStructure('down')}
      {renderStructure('up')}
    </div>
  );
}
