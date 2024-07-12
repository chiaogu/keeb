import Slider from '@src/components/shared/Slider';
import { ModifierOp } from '@src/keyboard/keySoundModifier';
import { SynthNodeState } from '@src/synth';

type FieldModifierProps = {
  field: string;
  modifier: ModifierOp;
  node?: SynthNodeState;
};

const INDENT = 3;

export default function FieldModifier({
  field,
  modifier: [operation, value],
  node,
}: FieldModifierProps) {
  const valid = node?.data?.[field] != undefined;
  const label = `${valid ? '' : '[invalid]'} ${field}`;
  return (
    <Slider
      className='border-l-2 border-dotted border-l-black'
      indent={INDENT}
      label={label}
      value={value as number}
      onChange={() => {}}
      min={0}
      max={5000}
    />

    // <ReadOnly
    //   className='border-l-2 border-dotted border-l-black'
    //   key={field}
    //   indent={INDENT}
    //   label={`${valid ? '' : '[invalid]'} ${field}`}
    //   value={`${operation} ${value}`}
    // />
  );
}
