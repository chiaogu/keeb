import { NodeControlConfig } from '@src/synth/config';
import Slider from './Slider';

type ControlProps = {
  type: NodeControlConfig['type'],
  name: string;
  value: unknown;
  onChange: (v: number) => void;
};

export default function Control({
  type,
  name,
  value,
  onChange,
}: ControlProps) {
  switch (type) {
    case 'range':
      return (
        <Slider
          label={name}
          value={value as number}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}
