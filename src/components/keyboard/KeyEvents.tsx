import { useKeyEvents } from '@src/hooks/useKeyEvents';
import getKeyCodeLabel from '@src/keyboard/getKeyLabel';
import { resizeCavas } from '@src/utils/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

type KeyEvent = { key: string; time: number; seed: number };

const padding = 8;

function getTimeX(time: number) {
  return (Date.now() - time) / 10;
}

export default function KeyEvents() {
  const events = useRef<KeyEvent[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(true);

  const onKeydown = useCallback((e: KeyboardEvent) => {
    setEnabled(true);
    events.current.push({
      key: getKeyCodeLabel(e.key),
      time: Date.now(),
      seed: Math.random(),
    });
    // if (e.key === ' ' || e.key === 'Enter') {
    //   e.preventDefault();
    // }
  }, []);

  useKeyEvents({ onKeydown });

  useEffect(() => {
    function loop() {
      const ctx = canvas.current?.getContext('2d');
      if (!ctx) return;

      const { clientWidth: w, clientHeight: h } = ctx.canvas;
      resizeCavas(w, h, ctx);

      ctx.font = '16px Overpass Mono';
      ctx.textBaseline = 'middle';

      events.current.forEach(({ key, time, seed }) => {
        ctx.fillText(
          key,
          w - getTimeX(time),
          seed * (h - padding * 2) + padding,
        );
      });
      events.current = events.current.filter(({ time }) => getTimeX(time) <= w);

      if (events.current.length === 0) {
        setEnabled(false);
      } else {
        requestAnimationFrame(loop);
      }
    }

    loop();
  }, [enabled]);

  return <canvas className='h-8 w-full' ref={canvas} />;
}
