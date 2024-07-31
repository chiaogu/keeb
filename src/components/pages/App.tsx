import * as Tone from '@src/tone';
import Main from '@src/components/pages/Main';
import Title from '@src/components/pages/Title';
import { useEffect, useState } from 'react';

function useStartTone() {
  useEffect(() => {
    const handlePointerDown = async () => {
      await Tone.start();
    };
    addEventListener('pointerdown', handlePointerDown);
    return () => removeEventListener('pointerdown', handlePointerDown);
  }, []);
}

function App() {
  const [started, setStarted] = useState(false);

  useStartTone();
  
  return started ? <Main /> : <Title onStart={() => setStarted(true)} />;
}

export default App;
