import { useDebounceCallback } from '@react-hook/debounce';
import { useKeyEvents } from '@src/hooks/useKeyEvents';
import * as Tone from '@src/tone';
import { resizeCavas } from '@src/utils/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

const maxValuesLength = 2048;
const defaultValues = new Float32Array(Array(maxValuesLength).fill(0));

function downSample(values: Float32Array) {
  let resampled = new Float32Array(maxValuesLength);
  if (values.length > maxValuesLength) {
    for (let i = 0; i < maxValuesLength; i++) {
      resampled[i] = values[Math.floor((i / maxValuesLength) * values.length)];
    }
  } else {
    resampled = values;
  }
  const max = Math.max(0.001, ...resampled) * 1.1;
  const min = Math.min(-0.001, ...resampled) * 1.1;

  return { resampled, min, max };
}

function scale(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  return ((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

function draw(ctx: CanvasRenderingContext2D, values: Float32Array) {
  const { clientWidth: w, clientHeight: h } = ctx.canvas;
  resizeCavas(w, h, ctx);

  const { resampled, min, max } = downSample(values);

  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < resampled.length; i++) {
    const v = values[i];
    const x = scale(i, 0, values.length, 0, w);
    const y = scale(v, max, min, 0, h);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

type WaveformProps = {
  channel: Tone.ToneAudioNode;
};

export default function Waveform({ channel }: WaveformProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(true);

  const stop = useDebounceCallback(() => {
    setEnabled(false);
  }, 2000);

  const onKeydown = useCallback(() => {
    setEnabled(true);
    stop();
  }, [stop]);

  useKeyEvents({ onKeydown });

  useEffect(() => {
    const waveform = new Tone.Waveform();
    channel.connect(waveform);

    function loop() {
      const ctx = canvas.current?.getContext('2d');
      if (!ctx) {
        return;
      }

      draw(ctx, waveform.getValue());

      if (!enabled || waveform.disposed) {
        draw(ctx, defaultValues);
        return;
      }

      requestAnimationFrame(loop);
    }

    loop();

    return () => {
      waveform.dispose();
    };
  }, [channel, enabled]);

  return <canvas className='h-[50px] w-full' ref={canvas} />;
}
