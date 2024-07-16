import IconButton from '@src/components/shared/IconButton';
import ReadOnly from '@src/components/shared/ReadOnly';

type InvalidFieldModifierProps = {
  field: string;
  onClick?: () => void;
};

export default function InvalidFieldModifier({
  field,
  onClick,
}: InvalidFieldModifierProps) {
  return (
    <ReadOnly
      key={field}
      label={`${field}`}
      className='cursor-pointer px-2 invert'
      onClick={onClick}
      value={<IconButton className="ml-4" icon='bug_report' onClick={onClick}/>}
    />
  );
}
