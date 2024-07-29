import keyCapImg from '@assets/keycap.png';

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
  return (
    <div
      style={{
        filter: `drop-shadow(rgba(0,0,0,0.25) 0 ${pressed ? 5 : 20}px ${pressed ? 2 : 8}px)`,
        transform: `translateY(-${pressed ? 5 : 20}px)`,
        transition: pressed
          ? undefined
          : 'filter 0.05s ease-out, transform 0.05s ease-out',
      }}
      className={`size-16 cursor-pointer touch-none ${className} bg-transparent`}
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onPointerLeave={onRelease}
    >
      <img className='pointer-events-none' src={keyCapImg} />
    </div>
  );
}
