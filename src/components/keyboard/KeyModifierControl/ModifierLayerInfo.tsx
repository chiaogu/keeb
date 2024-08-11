import SectionHeader from '@src/components/shared/SectionHeader';
import { ReactNode } from 'react';
import { useModiferContext } from './ModifierContext';

type ModifierLayerInfoProps = { className?: string; children?: ReactNode };

export function ModifierLayerInfo({
  className,
  children,
}: ModifierLayerInfoProps) {
  const { updateModiferLayer, selectedLayer, selectedLayerIndex } =
    useModiferContext();
  return (
    <div className={`flex w-full items-center ${className}`}>
      <SectionHeader
        className='mb-2'
        labelClassName='font-bold'
        label={selectedLayer.name}
        onLabelChange={(name) =>
          updateModiferLayer(selectedLayerIndex, { name })
        }
      >
        <div className='h-full'>{selectedLayer.type}</div>
        {children}
      </SectionHeader>
    </div>
  );
}
