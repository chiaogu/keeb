import { Envelope } from '@src/synth/config/envelope';
import { useEffect, useState } from 'react';

type AdsrProps = {
  envelope: Envelope;
  maxDuration: number;
};

export default function Adsr({ envelope, maxDuration }: AdsrProps) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { clientWidth: w, clientHeight: h } =
      ctx.canvas.parentElement ?? ctx.canvas;
    ctx.canvas.width = w * devicePixelRatio;
    ctx.canvas.height = h * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const { attack, decay, sustain, release } = envelope;

    ctx.fillStyle = 'black';

    const amplitude = 1;

    const aX = (attack / maxDuration) * w;
    const aY = h * amplitude;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(aX, aY);
    ctx.lineTo(aX, h - aY);
    ctx.fill();

    const dX = aX + (decay / maxDuration) * w;
    const dY = (aY * (1 - sustain)) / 2;
    ctx.beginPath();
    ctx.moveTo(aX - 0.5, aY);
    ctx.lineTo(dX, h - dY);
    ctx.lineTo(dX, dY);
    ctx.lineTo(aX - 0.5, h - aY);
    ctx.fill();

    const rX = dX + (release / maxDuration) * w;
    const rY = h / 2;
    ctx.beginPath();
    ctx.moveTo(dX - 1, dY);
    ctx.lineTo(rX, rY);
    ctx.lineTo(dX - 1, h - dY);
    ctx.fill();
  }, [envelope, canvas, maxDuration]);

  return <canvas className='size-full' ref={setCanvas} />;
}
