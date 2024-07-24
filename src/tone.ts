import { getContext } from 'tone/build/esm/core/Global';
import type { DestinationClass } from 'tone/build/esm/core/context/Destination';

export * from 'tone/build/esm/classes';
export { start } from 'tone/build/esm/core/Global';

export * from 'tone/build/esm/core/util/Interface';
export * from 'tone/build/esm/effect/Effect';

export function getDestination(): DestinationClass {
  return getContext().destination;
}
