import { JSX } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: JSX.Element;
  isPrimary?: boolean;
  isIconButton?: boolean;
}

const Button = ({
  label,
  icon,
  isPrimary = false,
  isIconButton = false,
  ...props
}: ButtonProps) => {
  const baseStyle =
    "w-full bg-primary p-0.5 h-20 flex justify-center items-center transition-all duration-300";

  const hoverStyle = isPrimary
    ? "hover:bg-primary hover:text-white hover:font-black hover:opacity-90"
    : "hover:text-white";

  const paddingHover = "hover:py-10";

  return (
    <button
      {...props}
      className={`${baseStyle} ${hoverStyle} hover:font-black hover:text-2xl ${paddingHover}`}
    >
      <div className="bg-white h-full w-full flex justify-center items-center">
        {icon ?? label}
      </div>
    </button>
  );
};

export { Button };
