import keyCapImg from '@assets/keycap.png';
import pointerDownImg from '@assets/pointerDown.png';
import usePreventDefaultTouchStart from '@src/hooks/usePreventDefaultTouchStart';
import { useState } from 'react';

type TestButtonProps = {
  className?: string;
  pressed: boolean;
  onPress?: () => void;
  onRelease?: () => void;
};

export default function KeyButton({
  className,
  pressed,
  onPress,
  onRelease,
}: TestButtonProps) {
  const setElement = usePreventDefaultTouchStart();
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      ref={setElement}
      style={{
        cursor: `url(${pointerDownImg}) 10 ${pressed ? 0 : 10}, pointer`,
      }}
      className={`size-16 touch-none ${className} flex h-24 transform-gpu items-end overflow-visible bg-transparent`}
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onPointerLeave={onRelease}
    >
      <img
        style={{
          opacity: loaded ? 1 : 0,
          filter: `drop-shadow(rgba(0,0,0,${pressed ? 0.3 : 0.2}) 0 ${pressed ? 5 : 16}px ${pressed ? 2 : 6}px)`,
          transform: `translateY(-${pressed ? 5 : 20}px) translateZ(0)`,
          transition: pressed
            ? undefined
            : 'filter 0.05s ease-out, transform 0.05s ease-out',
        }}
        className='pointer-events-none'
        src={keyCapImg}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
