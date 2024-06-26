type ButtonProps = {
  onClick?: () => void;
  icon: string;
};

export default function Button({ onClick, icon }: ButtonProps) {
  return (
    <button className="flex" onClick={onClick}>
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}
