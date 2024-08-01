import * as Tone from '@src/tone';
import { scale } from '@src/utils/utils';
import { useCallback, useRef } from 'react';
import Meter from './Meter';
import { COLOR } from '@src/utils/constants';

const LENGTH = 100;
const defaultValues = Array(LENGTH).fill(0);

function createToneMeter() {
  return new Tone.Meter({ normalRange: true, smoothing: 0 });
}

type VolumeMeterProps = {
  channel: Tone.ToneAudioNode;
};

export default function VolumeMeter({ channel }: VolumeMeterProps) {
  const level = useRef<number[]>(defaultValues);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, node: Tone.Meter, lastFrame: boolean) => {
      level.current.unshift(Math.pow(node.getValue() as number, 0.2));

      if (level.current.length > 100) {
        level.current.pop();
      }

      const values = level.current;
      const { clientWidth: w, clientHeight: h } = ctx.canvas;

      // ctx.fillStyle = COLOR.BG;
      // ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < values.length; i++) {
        const v = values[i];
        const x = scale(i, 0, values.length, 0, w);
        const y = scale(v, 1, 0, 0, h - ctx.lineWidth);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = 'black';
      ctx.stroke();
    },
    [],
  );

  return (
    <Meter channel={channel} createToneMeter={createToneMeter} draw={draw} />
  );
}
