import Main from '@src/components/pages/Main';
import Title from '@src/components/pages/Title';
import * as Tone from '@src/tone';
import { useEffect, useState } from 'react';
import ErrorBoundary from '../shared/ErrorBoundary';
import IconButton from '../shared/IconButton';
import { backupAndClear } from '@src/utils/localstorage';

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
            message && (
              <div
                className='z-10 flex w-full max-w-[500px] flex-col items-start bg-white p-8 invert'
              >
                <div className='font-bold'>Something went wrong</div>
                <div>{message}</div>
                <div className='mt-4 flex w-full items-center justify-between space-x-2'>
                  <div>Backup and clear cache?</div>
                  <div className='flex space-x-2'>
                    <IconButton icon='delete' onClick={() => {
                      backupAndClear();
                      location.reload();
                    }}/>
                  </div>
                </div>
              </div>
            )
          }
        />
      )}
    </ErrorBoundary>
  );
}

export default App;
