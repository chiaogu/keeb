import usePressedKeys from '@src/hooks/usePressedKeys';
import getKeyCodeLabel from '@src/keyboard/getKeyLabel';
import getKeyWidth from '@src/keyboard/getKeyWidth';
import { keys } from '@src/keyboard/keys';

const keySize = 48;

type KeyboardProps = {
  className?: string;
  onPress?: (code: string) => void;
  onRelease?: (code: string) => void;
};

export default function Keyboard({
  className,
  onPress,
  onRelease,
}: KeyboardProps) {
  const { pressedKeys, press, release } = usePressedKeys();

  return (
    <div
      className={`flex flex-col items-start border border-black ${className}`}
    >
      {keys.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className='flex border-black last:border-b'
        >
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
                  height: keySize,
                  width: `${keySize * getKeyWidth(key)}px`,
                }}
                className='border-l border-t border-black last:border-r'
              >
                <div
                  style={{
                    filter: pressedKeys.includes(key) ? 'invert(1)' : undefined,
                  }}
                  className='flex size-full select-none items-center justify-center bg-white'
                  onMouseDown={handlePress}
                  onMouseUp={handleRelease}
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
