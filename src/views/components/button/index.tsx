import "../components.scss";

type ButtonProps = {
  text: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
};

const Button = ({
  text,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  icon = null,
}: ButtonProps) => {
  return (
    <div className="button-container">
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`button-primary ${className}`}
      >
        {icon && <span className="icon">{icon}</span>}
        <span className="text">{text}</span>
      </button>
    </div>
  );
};

export default Button;
