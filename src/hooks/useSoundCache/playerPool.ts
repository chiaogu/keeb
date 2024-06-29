import * as Tone from "@src/tone";

const POOL_SIZE = 32;
const players: Tone.Player[] = [];
let index = 0;

export function lazyInit() {
  if (players.length != POOL_SIZE) {
    players.splice(
      0,
      players.length,
      ...Array(POOL_SIZE)
        .fill(0)
        .map(() => new Tone.Player().toDestination()),
    );
  }
}

export function play(buffer: Tone.ToneAudioBuffer) {
  players[index].buffer = buffer;
  players[index].start();
  index = (index + 1) % POOL_SIZE;
}
