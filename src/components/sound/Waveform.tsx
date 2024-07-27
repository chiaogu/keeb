import * as Tone from '@src/tone';
import Meter from './Meter';
import { COLOR, MAX_SAMPLE_SIZE } from '@src/utils/constants';
import { downSample, scale } from '@src/utils/utils';

const defaultValues = new Float32Array(Array(MAX_SAMPLE_SIZE).fill(0));

function draw(
  ctx: CanvasRenderingContext2D,
  waveform: Tone.Waveform,
  lastFrame: boolean,
) {
  const values = lastFrame ? defaultValues : waveform.getValue();
  const { clientWidth: w, clientHeight: h } = ctx.canvas;

  const { resampled, min, max } = downSample(values);

  ctx.fillStyle = COLOR.BG;
  ctx.fillRect(0, 0, w, h);
  
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < resampled.length; i++) {
    const v = resampled[i];
    const x = scale(i, 0, resampled.length, 0, w);
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

function createToneMeter() {
  return new Tone.Waveform();
}

type WaveformProps = {
  channel: Tone.ToneAudioNode;
};

export default function Waveform({ channel }: WaveformProps) {
  return (
    <Meter channel={channel} createToneMeter={createToneMeter} draw={draw} />
  );
}
