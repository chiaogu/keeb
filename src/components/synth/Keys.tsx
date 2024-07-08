import { useKeyEvents } from '@src/hooks/useKeyEvents';
import { useCallback, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';

const KEY_LABEL: Record<string, string> = {
  ' ': 'Space',
};

function usePressedKeys() {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  const onKeydown = useCallback((e: KeyboardEvent) => {
    const label = KEY_LABEL[e.key] ?? e.key;
    if (!e.repeat)
      setPressedKeys((keys) => Array.from(new Set([...keys, label])));
  }, []);

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    const label = KEY_LABEL[e.key] ?? e.key;
    setPressedKeys((keys) => keys.filter((key) => key !== label));
  }, []);

  useKeyEvents({ onKeydown, onKeyUp });

  return pressedKeys;
}

function useKeyEventLog() {
  const [logs, setLogs] = useImmer<string[]>([]);

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      setLogs((logs) => {
        if (e.key === 'Enter') logs.splice(0, logs.length);
        if (e.key === 'Backspace') logs.pop();
        if (e.key.length === 1) logs.push(e.key);
      });
      setTimeout(() => {
        setLogs((logs) => {
          logs.shift();
        });
      }, 2000);
    },
    [setLogs],
  );

  // Prevent scrolling when pressing space
  useEffect(() => {
    const handleSpace = (e: KeyboardEvent) => {
      if (e.key == ' ' && e.target == document.body) {
        e.preventDefault();
      }
    };
    addEventListener('keydown', handleSpace);
    return () => removeEventListener('keydown', handleSpace);
  }, []);

  useKeyEvents({ onKeydown });

  return logs;
}

export default function Keys() {
  const logs = useKeyEventLog();
  return (
    <div className='min-h-32'>
      <pre>
        <h1 className='text-[72px] font-bold'>
          {logs}
        </h1>
      </pre>
    </div>
  );
}
