import { useKeyEvents } from '@src/hooks/useKeyEvents';
import { useEffect, useMemo, useRef } from 'react';
import { useImmer } from 'use-immer';

function useKeyEventLog() {
  const [logs, setLogs] = useImmer<string[]>([]);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  const onKeydown = useMemo(() => {
    return (e: KeyboardEvent) => {
      setLogs((logs) => {
        if (e.key === 'Enter') {
          logs.splice(0, logs.length);
          timeouts.current
            .splice(0, timeouts.current.length)
            .forEach(clearTimeout);
        }
        if (e.key === 'Backspace') {
          logs.pop();
          clearTimeout(timeouts.current.pop());
        }
        if (e.key.length === 1) {
          logs.push(e.key);
          timeouts.current.push(
            setTimeout(() => {
              setLogs((logs) => {
                logs.shift();
              });
            }, 4000),
          );
        }
      });
    };
  }, [setLogs]);

  useEffect(() => {
    if (logs.length === 0) {
      timeouts.current.splice(0, timeouts.current.length).forEach(clearTimeout);
    }
  }, [logs]);

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
    <div ref={elementRef} className='h-20 max-w-full overflow-hidden text-end'>
      <pre>
        <h1 className='text-[48px]'>{logs}</h1>
      </pre>
    </div>
  );
}
