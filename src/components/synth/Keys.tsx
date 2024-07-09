import { useKeyEvents } from '@src/hooks/useKeyEvents';
import { useCallback, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

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
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollLeft = elementRef.current.scrollWidth;
    }
  });
  
  return (
    <div ref={elementRef} className='min-h-32 max-w-[500px] overflow-hidden text-end'>
      <pre>
        <h1 className='text-[72px] font-bold'>
          {logs}
        </h1>
      </pre>
    </div>
  );
}
