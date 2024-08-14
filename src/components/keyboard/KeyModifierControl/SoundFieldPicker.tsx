import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  RenderFieldProps,
  SoundStructureField,
  SoundStructure as SoundStructureType,
} from '@src/components/sound/SoundStructure';
import { ModifierOp } from '@src/keyboard/keySoundModifier';
import { SynthNodeState } from '@src/synth';
import { CONTROL_SHADOW } from '@src/utils/constants';
import { getSoundStructureValue } from '@src/utils/utils';
import { useMemo } from 'react';
import { useModiferContext } from './ModifierContext';
import { SoundFieldPath } from './RandomizationControl';
import { useMainContext } from '@src/components/shared/MainContext';
import KeyboardSoundStructure from '../KeyboardSoundStructure';

function shouldRenderField(
  field: SoundStructureField<unknown>,
): field is unknown {
  return typeof field !== 'object';
}

type SoundFieldPickerProps = {
  soundName: string;
  onSelect: (args: SoundFieldPath, node?: SynthNodeState) => void;
  excluded?: SoundStructureType<ModifierOp>;
};

export default function SoundFieldPicker({
  soundName,
  onSelect,
  excluded,
}: SoundFieldPickerProps) {
  const { keyboard } = useMainContext();

  const nodeMap = useMemo(() => {
    const result: Record<string, Record<string, Record<string, unknown>>> = {};
    const { down, up } = keyboard;
    return [...down.sound.synths, ...up.sound.synths].reduce(
      (acc, synth) => ({
        ...acc,
        [synth.id]: [synth.src, ...synth.fxs].reduce(
          (nodeAcc, node) => ({
            ...nodeAcc,
            [node.id]: node.data,
          }),
          {},
        ),
      }),
      result,
    );
  }, [keyboard]);

  const renderField = useMemo(() => {
    const render = (props: RenderFieldProps<unknown>) => {
      const { fieldPath, synthId, nodeId, node } = props;

      if (excluded) {
        const value = getSoundStructureValue(excluded, props);
        if (value) return null;
      }

      return (
        <button
          style={{ boxShadow: CONTROL_SHADOW }}
          className='mr-2 h-8 bg-white px-2 active:invert'
          onClick={() => onSelect({ synthId, nodeId, fieldPath }, node)}
        >
          {fieldPath[fieldPath.length - 1]}
        </button>
      );
    };
    return render;
  }, [excluded, onSelect]);

  return (
    <>
      <KeyboardSoundStructure
        structure={nodeMap}
        renderField={renderField}
        shouldRenderField={shouldRenderField}
      />
    </>
  );
}
