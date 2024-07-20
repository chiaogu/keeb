import IconButton from '@src/components/shared/IconButton';
import ReadOnly from '@src/components/shared/ReadOnly';
import SectionHeader from '@src/components/shared/SectionHeader';
import { ReactNode } from 'react';
import { useModiferContext } from './ModifierContext';

type ModifierLayerInfoProps = { className?: string; children?: ReactNode };

export function ModifierLayerInfo({
  className,
  children,
}: ModifierLayerInfoProps) {
  const {
    removeModifierLayer,
    updateModiferLayer,
    selectedLayer,
    selectedLayerIndex,
  } = useModiferContext();
  return (
    <div className={`flex w-full flex-col ${className}`}>
      <SectionHeader
        className='font-bold'
        label={selectedLayer.name}
        onLabelChange={(name) =>
          updateModiferLayer(selectedLayerIndex, { name })
        }
      >
        {children}
        <IconButton
          icon='remove'
          onClick={() => removeModifierLayer(selectedLayerIndex)}
        />
      </SectionHeader>
      <ReadOnly label='type' value={selectedLayer.type} />
    </div>
  );
}
