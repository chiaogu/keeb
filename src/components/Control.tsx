import { SynthState, config } from '@src/synth/config';
import Slider from './Slider';

type ControlProps<Key extends keyof SynthState> = {
  field: Key;
  value: SynthState[Key];
  onChange: (v: number) => void;
};

export default function Control<Key extends keyof SynthState>({
  field,
  value,
  onChange,
}: ControlProps<Key>) {
  switch (config[field].type) {
    case 'range':
      return (
        <Slider
          label={field.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()}
          value={value}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}
