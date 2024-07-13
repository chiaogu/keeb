import { useModiferContext } from '@src/components/keyboard/KeyModifierControl/ModifierContext';
import { useMemo } from 'react';

export default function useModifierStructure({
  synthId,
  nodeId,
}: {
  synthId?: string;
  nodeId?: string;
}) {
  const { synths } = useModiferContext();
  const synth = useMemo(
    () => synths.find(({ id }) => id === synthId),
    [synthId, synths],
  );
  const node = useMemo(() => {
    const synthNodes = !synth ? null : [synth.src, ...synth.fxs];
    return synthNodes?.find(({ id }) => id === nodeId);
  }, [nodeId, synth]);

  return { synth, node };
}
