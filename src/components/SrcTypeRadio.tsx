import { SrcNodeType } from "@src/synth/config";

type SrcTypeRadioProps = {
  value: SrcNodeType;
  onChange: (value: SrcNodeType) => void;
};

const srcTypeOptions: SrcNodeType[] = ["metal", "noise"];

export default function SrcTypeRadio({ value, onChange }: SrcTypeRadioProps) {
  return (
    <div className="flex space-x-4">
      {srcTypeOptions.map((type) => (
        <div className="flex space-x-1" key={type}>
          <input
            type="radio"
            value={type}
            checked={value === type}
            onChange={() => onChange(type)}
          />
          <label onClick={() => onChange(type)}>
            {type}
          </label>
        </div>
      ))}
    </div>
  );
}
