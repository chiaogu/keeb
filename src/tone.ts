export * from 'tone/build/esm/classes';
export { start } from "tone/build/esm/core/Global";
import { getContext } from "tone/build/esm/core/Global";
import type { DestinationClass } from "tone/build/esm/core/context/Destination";

export function getDestination(): DestinationClass {
	return getContext().destination;
}
