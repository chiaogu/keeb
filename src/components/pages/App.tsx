import Main from '@src/components/pages/Main';
import Title from '@src/components/pages/Title';
import * as Tone from '@src/tone';
import { useEffect, useState } from 'react';
import ErrorBoundary from '../shared/ErrorBoundary';

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
  const [message, setMessage] = useState<string | null>(null);

  useStartTone();

  return (
    <ErrorBoundary
      onError={(error) => {
        setStarted(false);
        setMessage(error.message);
      }}
    >
      {started ? (
        <Main />
      ) : (
        <Title
          onStart={() => setStarted(true)}
          message={
            message && <div className='bg-white p-4 invert'>{message}</div>
          }
        />
      )}
    </ErrorBoundary>
  );
}

export default App;
