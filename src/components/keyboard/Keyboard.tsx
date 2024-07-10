import usePressedKeys from '@src/hooks/usePressedKeys';
import getKeyCodeLabel from '@src/keyboard/getKeyLabel';
import getKeyWidth from '@src/keyboard/getKeyWidth';
import { keys } from '@src/keyboard/keys';

const keySize = 48;

type KeyboardProps = {
  className?: string;
  onPress?: (code: string) => void;
  onRelease?: (code: string) => void;
  onClick?: (code: string) => void;
  selectedKey?: string;
};

export default function Keyboard({
  className,
  onPress,
  onRelease,
  onClick,
  selectedKey,
}: KeyboardProps) {
  const { pressedKeys, press, release } = usePressedKeys();

  return (
    <div className={`relative flex flex-col items-start ${className}`}>
      <div className='pointer-events-none absolute size-full border-2 border-black'></div>
      {keys.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className='flex'>
          {row.map((key, keyIndex) => {
            const handlePress = () => {
              press(key);
              onPress?.(key);
            };
            const handleRelease = () => {
              release(key);
              onRelease?.(key);
            };
            return (
              <div
                key={`${key}-${keyIndex}`}
                style={{
                  filter: selectedKey === key ? 'invert(1)' : undefined,
                  height: keySize,
                  width: keySize * getKeyWidth(key),
                  border: pressedKeys.includes(key)
                    ? '3px solid black'
                    : selectedKey === key
                      ? undefined
                      : '0.5px solid black',
                }}
                className='flex size-full select-none items-center justify-center bg-white'
                onMouseDown={handlePress}
                onMouseUp={handleRelease}
                onClick={() => onClick?.(key)}
              >
                <div
                  style={{
                    width: keySize * getKeyWidth(key) - 10,
                    height: keySize - 10,
                  }}
                  className='flex items-center justify-center'
                  onMouseEnter={(e) => e.buttons > 0 && handlePress()}
                  onMouseLeave={(e) => e.buttons > 0 && handleRelease()}
                >
                  {getKeyCodeLabel(key).toLowerCase()}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
