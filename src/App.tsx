import { useState } from 'react';
import * as Tone from "tone";

const synth = new Tone.Synth().toDestination();

function App() {
  return (
    <>
      <h1>Hello World</h1>
      <button onClick={() => synth.triggerAttackRelease("C4", "8n")}>Click</button>
    </>
  )
}

export default App
