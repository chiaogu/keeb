import { useMainContext } from '@src/components/shared/MainContext';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  SoundStructureProps,
  SoundStructure as SoundStructureType,
} from '@src/components/sound/SoundStructure';
import { KeyEvent } from '@src/hooks/useKeyboard';
import { SynthConfig } from '@src/synth';
import { omit, pick } from 'lodash-es';
import { useCallback, useMemo } from 'react';

export type SoundFieldPath = {
  synthId: string;
  nodeId: string;
  fieldPath: string[];
};

type KeyboardSounStructureProps<T> = Pick<
  SoundStructureProps<T>,
  | 'structure'
  | 'renderField'
  | 'shouldRenderField'
  | 'foldable'
  | 'renderNodeHeader'
  | 'focusedNodeId'
>;

export default function KeyboardSoundStructure<T>({
  structure,
  renderField,
  shouldRenderField,
  foldable,
  renderNodeHeader,
  focusedNodeId,
}: KeyboardSounStructureProps<T>) {
  const { keyboard } = useMainContext();

  const renderStructure = useCallback(
    ({
      label,
      synths,
      structure,
    }: {
      label: string;
      synths: SynthConfig[];
      structure: SoundStructureType<T>;
    }) => {
      if (Object.keys(structure).length === 0) {
        return null;
      }

      return (
        <>
          <SectionHeader label={label} />
          <div className='relative w-full'>
            <div
              className={
                'absolute bottom-2 top-0 border-l-2 border-dotted border-l-black'
              }
            ></div>
            <div className='w-full pl-[10px]'>
              <SoundStructure
                foldable={foldable}
                synths={synths}
                structure={structure}
                renderField={renderField}
                shouldRenderField={shouldRenderField}
                renderNodeHeader={renderNodeHeader}
                focusedNodeId={focusedNodeId}
              />
            </div>
          </div>
        </>
      );
    },
    [focusedNodeId, foldable, renderField, renderNodeHeader, shouldRenderField],
  );

  const { down, up, unknown } = useMemo(() => {
    const getKeyStructureProps = (keyEvent: KeyEvent) => ({
      label: `${keyEvent}stroke`,
      synths: keyboard[keyEvent].sound.synths,
      structure: pick(
        structure,
        keyboard[keyEvent].sound.synths.map(({ id }) => id),
      ),
    });
    return {
      down: getKeyStructureProps('down'),
      up: getKeyStructureProps('up'),
      unknown: {
        label: 'unknown',
        synths: [],
        structure: omit(structure, [
          ...keyboard.down.sound.synths.map(({ id }) => id),
          ...keyboard.up.sound.synths.map(({ id }) => id),
        ]),
      },
    };
  }, [keyboard, structure]);

  return (
    <div className='w-full'>
      {renderStructure(down)}
      {renderStructure(up)}
      {renderStructure(unknown)}
    </div>
  );
}
