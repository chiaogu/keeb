import { useDebounceCallback } from '@react-hook/debounce';
import usePressedKeys from '@src/hooks/usePressedKeys';
import usePreventDefaultTouchStart from '@src/hooks/usePreventDefaultTouchStart';
import getKeyCodeLabel from '@src/keyboard/getKeyLabel';
import getKeyWidth from '@src/keyboard/getKeyWidth';
import { keys } from '@src/keyboard/keys';
import { getValueBg, normalValueToBrightness } from '@src/utils/utils';

const keySize = 50;

export type KeyboardProps = {
  className?: string;
  onPress?: (code: string) => void;
  onRelease?: (code: string) => void;
  onClick?: (code: string) => void;
  selectedKeys?: string[];
  highlightedKeys?: { [key: string]: number };
};

function Key({
  keyCode,
  keyIndex,
  onPress,
  onRelease,
  onClick,
  selectedKeys = [],
  highlightedKeys = {},
}: KeyboardProps & { keyCode: string; keyIndex: number }) {
  const { pressedKeys, press, release } = usePressedKeys();

  const handlePress = useDebounceCallback(() => {
    press(keyCode);
    onPress?.(keyCode);
  }, 50);
  const handleRelease = () => {
    release(keyCode);
    onRelease?.(keyCode);
  };
  const pressed = pressedKeys.includes(keyCode);
  const selected = selectedKeys.includes(keyCode);
  const bgValue = normalValueToBrightness(highlightedKeys[keyCode]);
  const bg = getValueBg(bgValue);
  const color = bgValue > 0.5 ? 'black' : 'white';
  return (
    <div
      key={`${keyCode}-${keyIndex}`}
      className='cursor-pointer pb-1 pr-1'
      style={{
        height: keySize,
        width: `${keySize * getKeyWidth(keyCode)}px`,
      }}
    >
      <div
        style={{
          // filter: pressed ? 'invert(1)' : undefined,
          // background: pressed ? (bgValue > 0.5 ? 'white' : 'black') : bg,
          background: bg,
          color: color,
          boxShadow: `0 ${pressed ? 2 : 5}px 10px 0px rgba(0,0,0,${pressed ? 0.1 : 0.05})`,
          transform: `scale(${pressed ? 0.8 : 1})`,
          // transform: `translateY(${pressed ? 4 : 0}px)`,
        }}
        className='flex size-full select-none items-center justify-center'
        onPointerDown={handlePress}
        onPointerUp={handleRelease}
        onClick={() => {
          onClick?.(keyCode);
        }}
      >
        <div
          style={{
            border: selected ? `2px solid ${color}` : undefined,
          }}
          className='flex size-11/12 items-center justify-center'
          onPointerEnter={(e) => e.buttons > 0 && handlePress()}
          onPointerLeave={(e) => e.buttons > 0 && handleRelease()}
        >
          {getKeyCodeLabel(keyCode).toLowerCase()}
        </div>
      </div>
    </div>
  );
}

export default function Keyboard({ className, ...props }: KeyboardProps) {
  const ref = usePreventDefaultTouchStart();

  return (
    <div
      className={`relative flex flex-col items-start ${className}`}
      ref={ref}
    >
      <div className='pointer-events-none absolute size-full'></div>
      {keys.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className='flex'>
          {row.map((key, keyIndex) => (
            <Key key={key} keyCode={key} keyIndex={keyIndex} {...props} />
          ))}
        </div>
      ))}
    </div>
  );
}
