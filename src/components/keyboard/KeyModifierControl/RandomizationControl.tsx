import { SoundStructureProps } from '@src/components/SoundStructureTree/SoundStructure';
import { ModifierOp } from '@src/keyboard/keySoundModifier';
import { RandomizationConfig } from '@src/types';

type ModifierControlProps = {
  radomConfig: RandomizationConfig;
  onChange: () => void;
};

export default function RandomizationControl({
  radomConfig,
  onChange,
}: ModifierControlProps) {
  return (
    <>
      {/* <SoundStructure
        structure={modifier}
        synthHeader={SynthHeader}
        nodeHeader={NodeHeader}
        renderField={renderField}
      />
      <IconButton
        className='mb-4 ml-[-11px] self-start'
        icon='add'
        onClick={() =>
          onChange({
            synthId: synths[0].id,
            nodeId: synths[0].src.id,
            field: 'frequency',
            value: 0,
          })
        }
      /> */}
    </>
  );
}
