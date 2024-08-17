import getKeyWidth from '@src/keyboard/getKeyWidth';
import { keys } from '@src/keyboard/keys';
import { ModifierLayer } from '@src/types';
import {
  getValueBg,
  normalValueToBrightness,
  resizeCavas,
} from '@src/utils/utils';
import { useEffect, useState } from 'react';

export default function ModifierLayerPreview({
  modifier,
}: {
  modifier: ModifierLayer;
}) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { clientHeight: height } = ctx.canvas.parentElement ?? ctx.canvas;
    const keySize = height / keys.length;
    const width = keys[0].reduce(
      (sum, key) => sum + getKeyWidth(key) * keySize,
      0,
    );

    ctx.canvas.style.width = `${width}px`;
    resizeCavas(width, height, ctx);

    let left = 0;
    keys.forEach((row, rowIndex) => {
      left = 0;
      row.forEach((key) => {
        const keyWidth = getKeyWidth(key) * keySize;

        if (modifier.type === 'random') {
          ctx.fillStyle = modifier.keys[key]
            ? getValueBg(normalValueToBrightness(modifier.randomSeed[key]))
            : 'white';
        } else {
          ctx.fillStyle = modifier.keys[key] ? 'black' : 'white';
        }
        ctx.fillRect(left, rowIndex * keySize, keyWidth, keySize);

        left += keyWidth;
      });
    });
  }, [canvas, modifier]);

  return <canvas className='h-full' ref={setCanvas} />;
}
