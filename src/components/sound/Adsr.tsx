import { Envelope } from '@src/synth/config/envelope';
import { resizeCavas } from '@src/utils/utils';
import { useEffect, useState } from 'react';

type AdsrProps = {
  envelope: Envelope;
};

// TODO: Curve
export default function Adsr({ envelope }: AdsrProps) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { clientWidth: w, clientHeight: h } =
      ctx.canvas.parentElement ?? ctx.canvas;
    resizeCavas(w, h, ctx);

    const { attack, decay, sustain, release } = envelope;

    ctx.fillStyle = 'black';

    const amplitude = 1;

    const aX = attack * w;
    const aY = h * amplitude;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(aX, aY);
    ctx.lineTo(aX, h - aY);
    ctx.fill();

    const dX = decay * w;
    const dY = aY * (1 - sustain);
    ctx.beginPath();
    ctx.moveTo(aX - 0.5, aY);
    ctx.lineTo(dX, h);
    ctx.lineTo(dX, dY);
    ctx.lineTo(aX - 0.5, h - aY);
    ctx.fill();

    const rX = (1 - release) * w;
    ctx.beginPath();
    ctx.moveTo(dX - 0.5, dY);
    ctx.lineTo(rX, dY);
    ctx.lineTo(w, h);
    ctx.lineTo(dX - 0.5, h);
    ctx.fill();
  }, [envelope, canvas]);

  return <canvas className='size-full' ref={setCanvas} />;
}
