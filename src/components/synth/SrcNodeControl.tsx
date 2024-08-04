import { Synth, SynthSrcNodeState } from '@src/synth';
import { SrcNodeType, nodeConfig, srcNodeConfig } from '@src/synth/config';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import { omit } from '@src/utils/schema';
import SectionHeader from '../shared/SectionHeader';
import { ControlSliderSelect } from '../shared/SliderSelect';
import Controls from './Controls';

type SrcNodeControlProps = {
  src: SynthSrcNodeState;
  onChange: Synth['setSrcState'];
};

const srcTypeOptions = Object.keys(srcNodeConfig) as SrcNodeType[];

export default function SrcNodeControl({ src, onChange }: SrcNodeControlProps) {
  return (
    <div className='flex w-full flex-col items-center'>
      <ControlSliderSelect
        label='type'
        options={srcTypeOptions}
        value={src.type}
        onChange={(type) =>
          onChange({
            id: src.id,
            type: type as SrcNodeType,
            data: zBaseSynthSrc.parse(src.data),
          })
        }
      />
      <Controls
        schema={zBaseSynthSrc}
        value={src.data}
        onChange={(data) =>
          onChange({
            ...src,
            data: data,
          })
        }
      />
      <SectionHeader className='mb-2 mt-4 font-bold' label={src.type} />
      <Controls
        schema={omit(
          nodeConfig[src.type].schema,
          Object.keys(zBaseSynthSrc.shape),
        )}
        controls={nodeConfig[src.type].controls}
        value={src.data}
        onChange={(data) =>
          onChange({
            ...src,
            data: data,
          })
        }
      />
    </div>
  );
}
