import * as Tone from '@src/tone';
import Meter from './Meter';
import { COLOR, MAX_SAMPLE_SIZE } from '@src/utils/constants';
import { downSample, scale } from '@src/utils/utils';

const defaultValues = new Float32Array(Array(MAX_SAMPLE_SIZE).fill(1));

function draw(
  ctx: CanvasRenderingContext2D,
  node: Tone.FFT,
  lastFrame: boolean,
) {
  const values = lastFrame ? defaultValues : node.getValue();
  const { clientWidth: w, clientHeight: h } = ctx.canvas;

  const { resampled, min, max } = downSample(values.slice(0, 500));

  // ctx.fillStyle = COLOR.BG;
  // ctx.fillRect(0, 0, w, h);
  
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < resampled.length; i++) {
    const v = resampled[i];
    const x = scale(i, 0, resampled.length, 0, w);
    const y = scale(v, max, min, 0, h) || h - ctx.lineWidth;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

function createToneMeter() {
  return new Tone.FFT();
}

type FFTProps = {
  channel: Tone.ToneAudioNode;
};

export default function FFT({ channel }: FFTProps) {
  return (
    <Meter channel={channel} createToneMeter={createToneMeter} draw={draw} />
  );
}
