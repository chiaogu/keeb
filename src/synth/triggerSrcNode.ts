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
  let frequency = state.frequency;
  frequency += Math.random() * 100;
  node.triggerAttackRelease(frequency, state.duration, `+${state.delay}`);
}
