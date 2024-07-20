import IconButton from '@src/components/shared/IconButton';
import ReadOnly from '@src/components/shared/ReadOnly';

type InvalidFieldModifierProps = {
  field: string;
  onClick?: () => void;
  showFixButton: boolean;
  highlighted: boolean;
};

export default function InvalidFieldModifier({
  field,
  onClick,
  showFixButton,
  highlighted,
}: InvalidFieldModifierProps) {
  return (
    <ReadOnly
      key={field}
      label={`${field}`}
      className={`line-through ${highlighted ? 'px-2 invert' : ''}`}
      value={showFixButton ? <IconButton className="ml-4" icon='bug_report' onClick={onClick}/> : undefined}
    />
  );
}
