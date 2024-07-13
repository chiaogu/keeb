import IconButton from '@src/components/shared/IconButton';
import { UpdateModifierArgs } from '@src/hooks/useKeyboardSound';
import { SoundModifier } from '@src/keyboard/keySoundModifier';
import { useModiferContext } from './ModifierContext';
import SynthModifierControl from './SynthModifier';

type ModifierControlProps = {
  modifier: SoundModifier;
  onChange: (args: Omit<UpdateModifierArgs, 'key'>) => void;
};

export default function ModifierControl({
  modifier,
  onChange,
}: ModifierControlProps) {
  const { synths, selectedLayerIndex } = useModiferContext();

  return (
    <>
      {Object.entries(modifier).map(([synthId, nodes]) => (
        <SynthModifierControl
          key={synthId}
          synthId={synthId}
          synths={synths}
          nodes={nodes}
          onChange={(args) =>
            onChange({
              ...args,
              layerIndex: selectedLayerIndex,
              synthId,
            })
          }
        />
      ))}
      <IconButton
        className='mb-4 ml-[-11px] self-start'
        icon='add'
        onClick={() =>
          onChange({
            synthId: synths[0].id,
            nodeId: synths[0].src.id,
            field: 'frequency',
            value: 0,
            layerIndex: selectedLayerIndex,
          })
        }
      />
    </>
  );
}
