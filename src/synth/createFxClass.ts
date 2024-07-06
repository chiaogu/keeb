import * as Tone from '@src/tone';
import { ToneClass } from '@src/types';

type ComponentFxClass<O> = {
  new (): Tone.Effect<O & Tone.EffectOptions> & {
    triggerAttackRelease: (
      duration: Tone.Unit.Time,
      time?: Tone.Unit.Time,
    ) => void;
  };
  getDefaults: (...args: unknown[]) => unknown;
};

export default function createFxClass<
  O extends Tone.ToneAudioNodeOptions,
  FxOptions extends O & Tone.EffectOptions,
  Node extends Tone.ToneAudioNode,
>(ToneClass: ToneClass<Node>): ComponentFxClass<O> {
  function getDefaults() {
    return Object.assign(
      Tone.Effect.getDefaults(),
      ToneClass.getDefaults(),
    ) as FxOptions;
  }

  return class extends Tone.Effect<FxOptions> {
    static className = `${ToneClass.name}Fx`;
    component: Node;

    constructor() {
      super(getDefaults());
      this.component = new ToneClass();
      this.connectEffect(this.component);
    }

    connect(
      destination: Tone.InputNode,
      outputNum?: number | undefined,
      inputNum?: number | undefined,
    ): this {
      super.connect(destination, outputNum, inputNum);
      return this;
    }

    set({ wet, ...options }: Tone.RecursivePartial<FxOptions>) {
      if (wet) this.wet.setValueAtTime(wet as number, 0);
      this.component.set(options as never);
      return this;
    }

    triggerAttackRelease(duration: Tone.Unit.Time, time?: Tone.Unit.Time) {
      this.component.triggerAttackRelease?.(duration, time);
    }

    dispose(): this {
      super.dispose();
      this.component.dispose();
      return this;
    }

    static getDefaults(): FxOptions {
      return getDefaults();
    }
  };
}
