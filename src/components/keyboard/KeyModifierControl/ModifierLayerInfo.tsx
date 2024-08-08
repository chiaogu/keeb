import SectionHeader from '@src/components/shared/SectionHeader';
import { useModiferContext } from './ModifierContext';

type ModifierLayerInfoProps = { className?: string };

export function ModifierLayerInfo({ className }: ModifierLayerInfoProps) {
  const { updateModiferLayer, selectedLayer, selectedLayerIndex } =
    useModiferContext();
  return (
    <div className={`flex w-full items-center ${className}`}>
      <SectionHeader
        className='mb-2 font-bold'
        label={selectedLayer.name}
        onLabelChange={(name) =>
          updateModiferLayer(selectedLayerIndex, { name })
        }
      />
      <div>{selectedLayer.type}</div>
    </div>
  );
}
