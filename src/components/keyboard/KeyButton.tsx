import keyCapImg from '@assets/keycap.png';
import usePreventDefaultTouchStart from '@src/hooks/usePreventDefaultTouchStart';
import { useEffect, useState } from 'react';

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
        opacity: loaded ? 1 : 0,
        filter: `drop-shadow(rgba(0,0,0,0.2) 0 ${pressed ? 5 : 16}px ${pressed ? 2 : 6}px)`,
        transform: `translateY(-${pressed ? 5 : 20}px) translateZ(0)`,
        transition: pressed
          ? undefined
          : 'filter 0.05s ease-out, transform 0.05s ease-out, opacity 0.2s',
      }}
      className={`size-16 cursor-pointer touch-none ${className} transform-gpu overflow-visible bg-transparent`}
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onPointerLeave={onRelease}
    >
      <img className='pointer-events-none' src={keyCapImg} onLoad={() => setLoaded(true)}/>
    </div>
  );
}
