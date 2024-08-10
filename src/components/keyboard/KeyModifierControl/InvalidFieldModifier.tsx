import IconButton from '@src/components/shared/IconButton';

type InvalidFieldModifierProps = {
  field: string;
  onClick?: () => void;
  onRemove: () => void;
  showFixButton: boolean;
  highlighted: boolean;
};

export default function InvalidFieldModifier({
  field,
  onClick,
  showFixButton,
  highlighted,
  onRemove,
}: InvalidFieldModifierProps) {
  return (
    <div className='mb-2 flex size-full items-center justify-between'>
      <div className={`flex h-8 items-center line-through ${highlighted ? 'bg-white px-2 invert' : ''}`}>
        {field}
      </div>
      <div className='flex'>
        {showFixButton && (
          <IconButton className='ml-4' icon='bug_report' onClick={onClick} />
        )}
        <IconButton className='ml-2' icon='remove' onClick={onRemove} />
      </div>
    </div>
  );
}
