type ButtonProps = {
  onClick?: () => void;
  icon: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function IconButton({
  onClick,
  icon,
  className,
  style,
}: ButtonProps) {
  return (
    <button
      style={style}
      className={`flex ${className} size-8 flex-shrink-0 items-center justify-center focus:outline-none active:bg-white active:invert`}
      onClick={onClick}
    >
      <span className='material-symbols-outlined'>{icon}</span>
    </button>
  );
}
