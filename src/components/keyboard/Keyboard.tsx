import usePressedKeys from '@src/hooks/usePressedKeys';
import getKeyCodeLabel from '@src/keyboard/getKeyLabel';
import getKeyWidth from '@src/keyboard/getKeyWidth';
import { keys } from '@src/keyboard/keys';
import { getValueBg, normalValueToBrightness } from '@src/utils/utils';

const keySize = 44;

export type KeyboardProps = {
  className?: string;
  onPress?: (code: string) => void;
  onRelease?: (code: string) => void;
  onClick?: (code: string) => void;
  selectedKeys?: string[];
  highlightedKeys?: { [key: string]: number };
};

export default function Keyboard({
  className,
  onPress,
  onRelease,
  onClick,
  selectedKeys = [],
  highlightedKeys = {},
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
            const pressed = pressedKeys.includes(key);
            const selected = selectedKeys.includes(key);
            const bgValue = normalValueToBrightness(highlightedKeys[key]);
            const bg = getValueBg(bgValue);
            const color = bgValue > 0.5 ? 'black' : 'white';
            return (
              <div
                key={`${key}-${keyIndex}`}
                style={{
                  height: keySize,
                  width: `${keySize * getKeyWidth(key)}px`,
                  border:
                    selectedKeys.length > 0 ? undefined : '0.5px solid black',
                }}
              >
                <div
                  style={{
                    filter: pressed ? 'invert(1)' : undefined,
                    background: bg,
                    color: color,
                  }}
                  className='flex size-full select-none items-center justify-center'
                  onMouseDown={handlePress}
                  onMouseUp={handleRelease}
                  onClick={() => onClick?.(key)}
                >
                  <div
                    style={{
                      border: selected ? `2px solid ${color}` : undefined,
                    }}
                    className='flex size-4/5 items-center justify-center'
                    onMouseEnter={(e) => e.buttons > 0 && handlePress()}
                    onMouseLeave={(e) => e.buttons > 0 && handleRelease()}
                  >
                    {getKeyCodeLabel(key).toLowerCase()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
