import usePressedKeys from '@src/hooks/usePressedKeys';
import getKeyCodeLabel from '@src/keyboard/getKeyLabel';
import getKeyWidth from '@src/keyboard/getKeyWidth';
import { keys } from '@src/keyboard/keys';

const keySize = 48;

export default function Keyboard() {
  const { pressedKeys, press, release } = usePressedKeys();
  
  return (
    <div className='flex w-full flex-col items-start border border-black'>
      {keys.map((row) => (
        <div className='flex border-black last:border-b'>
          {row.map((key) => (
            <div
              style={{
                height: keySize,
                width: `${keySize * getKeyWidth(key)}px`,
              }}
              className='border-l border-t border-black last:border-r'
            >
              <div
                style={{
                  filter: pressedKeys.includes(key) ? 'invert(1)' : undefined,
                }}
                className='flex size-full items-center justify-center bg-white'
                onMouseDown={() => press(key)}
                onMouseUp={() => release(key)}
              >
                {getKeyCodeLabel(key).toLowerCase()}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
