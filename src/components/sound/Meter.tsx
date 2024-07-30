import { useDebounceCallback } from '@react-hook/debounce';
import { useKeyEvents } from '@src/hooks/useKeyEvents';
import * as Tone from '@src/tone';
import { channels } from '@src/utils/constants';
import { resizeCavas } from '@src/utils/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

type MeterProps<T extends Tone.ToneAudioNode> = {
  channel: Tone.ToneAudioNode;
  createToneMeter: () => T;
  draw: (
    ctx: CanvasRenderingContext2D,
    toneNode: T,
    lastFrame: boolean,
  ) => void;
};

export default function Meter<T extends Tone.ToneAudioNode>({
  channel,
  createToneMeter,
  draw,
}: MeterProps<T>) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(true);

  const stop = useDebounceCallback(() => {
    setEnabled(false);
  }, 10000);

  const start = useCallback(() => {
    setEnabled(true);
    stop();
  }, [stop]);

  const down = channel === channels.down;
  useKeyEvents(down ? { onKeydown: start } : { onKeyUp: start });

  useEffect(() => {
    const toneNode = createToneMeter();

    try {
      channel.connect(toneNode);
    } catch (e) {
      console.error(e);
    }

    function loop() {
      const ctx = canvas.current?.getContext('2d');
      if (!ctx) {
        return;
      }

      const { clientWidth: w, clientHeight: h } = ctx.canvas;
      resizeCavas(w, h, ctx);
      
      draw(ctx, toneNode, false);

      if (!enabled || toneNode.disposed) {
        // draw(ctx, toneNode, true);
        return;
      }

      requestAnimationFrame(loop);
    }

    loop();

    return () => {
      toneNode.dispose();
    };
  }, [channel, createToneMeter, draw, enabled]);

  return <canvas className='h-8 w-full' ref={canvas} />;
}