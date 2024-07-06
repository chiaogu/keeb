import RadioGroup from '@src/components//shared/RadioGroup';
import { Synth, SynthSrcNodeState } from '@src/synth';
import { SrcNodeType, nodeConfig, srcNodeConfig } from '@src/synth/config';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import { omit } from '@src/utils/schema';
import SectionHeader from '../shared/SectionHeader';
import Controls from './Controls';

type SrcNodeControlProps = {
  synthSrc: SynthSrcNodeState;
  setSrcState: Synth['setSrcState'];
};

const srcTypeOptions = Object.keys(srcNodeConfig) as SrcNodeType[];

export default function SrcNodeControl({
  synthSrc,
  setSrcState,
}: SrcNodeControlProps) {
  return (
    <div className='flex w-full flex-col items-center'>
      <Controls
        schema={zBaseSynthSrc}
        value={synthSrc.data}
        onChange={(data) =>
          setSrcState({
            ...synthSrc,
            data: data,
          })
        }
      />
      <RadioGroup
        label='type'
        options={srcTypeOptions}
        value={synthSrc.type}
        onChange={(type) => setSrcState({ type, data: {} })}
      />
      <SectionHeader className='mt-4 font-bold' label={synthSrc.type} />
      <Controls
        schema={omit(
          nodeConfig[synthSrc.type].schema,
          Object.keys(zBaseSynthSrc.shape),
        )}
        controls={nodeConfig[synthSrc.type].controls}
        value={synthSrc.data}
        onChange={(data) =>
          setSrcState({
            ...synthSrc,
            data: data,
          })
        }
      />
    </div>
  );
}
