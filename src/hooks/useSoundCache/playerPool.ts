import * as Tone from '@src/tone';

const POOL_SIZE = 16;

export function createPlayerPool(destination: Tone.ToneAudioNode) {
  let index = 0;
  const players: Tone.Player[] = Array(POOL_SIZE)
    .fill(0)
    .map(() => new Tone.Player().connect(destination));

  function play(buffer: Tone.ToneAudioBuffer) {
    players[index].buffer = buffer;
    players[index].start();
    index = (index + 1) % POOL_SIZE;
  }
  
  return { play };
}
