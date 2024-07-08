type State = {
  frequency: number;
  duration: number;
  delay: number;
};

type Node = {
  triggerAttackRelease: (
    frequency: number,
    duration: number,
    delay: string,
  ) => unknown;
};

export default function triggerSrcNode(node: Node, state: State) {
  node.triggerAttackRelease(state.frequency, state.duration, `+${state.delay}`);
}
