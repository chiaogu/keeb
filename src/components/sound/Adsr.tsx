import { Envelope } from '@src/synth/config/envelope';

type AdsrProps = {
  envelope: Envelope;
  maxDuration: number;
};

export default function Adsr({
  envelope: { attack, decay, sustain, release },
  maxDuration,
}: AdsrProps) {
  return (
    <div
      style={{ width: `${((attack + decay + release) / maxDuration) * 100}%` }}
      className='flex h-full'
    >
      <div
        style={{ width: `${(attack / maxDuration) * 100}%` }}
        className='h-full bg-red-500'
      ></div>
      <div
        style={{ width: `${(decay / maxDuration) * 100}%` }}
        className='h-full bg-blue-500'
      ></div>
      <div
        style={{ width: `${(release / maxDuration) * 100}%` }}
        className='h-full bg-green-500'
      ></div>
    </div>
  );
}
