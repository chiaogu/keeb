import CustomModifierControl from './KeyModifierControl/CustomModifierControl';
import {
  ModifierContextProvider,
  useModiferContext,
} from './KeyModifierControl/ModifierContext';
import RandomModifierControl from './KeyModifierControl/RandomModifierControl';
import ModifierLayerControl from './ModifierLayerControl';

function Content() {
  const { selectedLayer } = useModiferContext();

  return (
    <div className='flex w-full max-w-[500px] flex-col items-center p-8'>
      <ModifierLayerControl />
      {selectedLayer && (
        <div className='my-8 w-full border-b-2 border-dotted border-black bg-transparent'></div>
      )}
      {selectedLayer?.type === 'custom' && <CustomModifierControl />}
      {selectedLayer?.type === 'random' && <RandomModifierControl />}
    </div>
  );
}

export default function KeySoundModifier() {
  return (
    <ModifierContextProvider>
      <Content />
    </ModifierContextProvider>
  );
}
