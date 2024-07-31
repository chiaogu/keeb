type ButtonProps = {
  onClick?: () => void;
  icon: string;
  className?: string;
};

export default function IconButton({ onClick, icon, className }: ButtonProps) {
  return (
    <button className={`flex ${className} size-8 items-center justify-center hover:bg-white active:invert`} onClick={onClick}>
      <span className='material-symbols-outlined'>{icon}</span>
    </button>
  );
}
