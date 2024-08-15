import IconButton from '@src/components/shared/IconButton';
import { useMainContext } from '@src/components/shared/MainContext';
import {
  RenderFieldProps,
  SoundStructureField,
  SoundStructure as SoundStructureType,
} from '@src/components/sound/SoundStructure';
import { SynthNodeState } from '@src/synth';
import { CONTROL_SHADOW } from '@src/utils/constants';
import { getSoundStructureValue } from '@src/utils/utils';
import { useCallback, useMemo, useState } from 'react';
import KeyboardSoundStructure from '../KeyboardSoundStructure';
import { SoundFieldPath } from './RandomizationControl';

function shouldRenderField(
  field: SoundStructureField<unknown>,
): field is unknown {
  return typeof field !== 'object';
}

type SoundFieldPickerProps<T> = {
  onSelect: (args: SoundFieldPath, node?: SynthNodeState) => void;
  excluded?: SoundStructureType<T>;
};

export default function SoundFieldPicker<T>({
  onSelect,
  excluded,
}: SoundFieldPickerProps<T>) {
  const { keyboard } = useMainContext();
  const [selectedNodeId, setSelectedNodeId] = useState<string>();

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

  const renderNodeHeader = useCallback(
    ({
      node,
      nodeId,
    }: {
      node?: SynthNodeState;
      nodeId: string;
    }): React.ReactNode => {
      let labelClassName = '';
      if (!node) {
        labelClassName = 'line-through';
      } else if (!selectedNodeId) {
        // labelClassName = 'bg-white px-2 cursor-pointer';
      }

      const toggleSelection = () =>
        setSelectedNodeId(selectedNodeId === nodeId ? undefined : nodeId);

      return (
        <div
          className={
            'flex h-8 w-full cursor-pointer items-center justify-between pl-[8px] active:bg-white active:invert'
          }
          onClick={toggleSelection}
        >
          <label
            className={`pointer-events-none flex h-full items-center truncate whitespace-nowrap ${labelClassName}`}
          >
            {node?.type ?? 'unknown'}
          </label>
          <IconButton className='active:invert-0'
            icon={selectedNodeId === nodeId ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
          />
        </div>
      );
    },
    [selectedNodeId],
  );

  return (
    <>
      <KeyboardSoundStructure
        structure={nodeMap}
        renderField={renderField}
        shouldRenderField={shouldRenderField}
        renderNodeHeader={renderNodeHeader}
        foldable
        focusedNodeId={selectedNodeId}
      />
    </>
  );
}
