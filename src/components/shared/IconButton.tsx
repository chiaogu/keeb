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
      className={`flex ${className} size-8 items-center justify-center hover:bg-white active:invert`}
      onClick={onClick}
    >
      <span className='material-symbols-outlined'>{icon}</span>
    </button>
  );
}
