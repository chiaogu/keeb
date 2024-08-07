import {
  FxNodeType,
  SrcNodeType,
  SynthNodeType,
  fxNodeConfig,
  srcNodeConfig,
} from '@src/synth/config';
import { CONTROL_SHADOW } from '@src/utils/constants';
import { splitCamelCase } from '@src/utils/utils';
import { sortBy } from 'lodash-es';
import { useMemo } from 'react';

type NodeType = 'src' | 'fx';

type NodeTypeSelectProps = {
  type: NodeType;
  onSelect: (type: SynthNodeType) => void;
};

const options = {
  src: Object.keys(srcNodeConfig) as SrcNodeType[],
  fx: Object.keys(fxNodeConfig) as FxNodeType[],
};

export default function NodeTypeSelect({
  type,
  onSelect,
}: NodeTypeSelectProps) {
  const sortedOptions = useMemo(() => sortBy(options[type]), [type]);
  
  return (
    <div className='inline-block w-full'>
      {sortedOptions.map((option) => (
        <button
          style={{ boxShadow: CONTROL_SHADOW }}
          className='mb-2 mr-2 h-8 bg-white px-2 active:invert'
          key={option}
          onClick={() => onSelect(option)}
        >
          {splitCamelCase(option)}
        </button>
      ))}
    </div>
  );
}
