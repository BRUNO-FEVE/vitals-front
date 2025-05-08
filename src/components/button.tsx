import { JSX } from "react";

type Direction =
  | "vertical-middle"
  | "top"
  | "bottom"
  | "right"
  | "left"
  | "middle";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: JSX.Element;
  isPrimary?: boolean;
  disabled?: boolean;
  disabledPadding?: boolean;
  direction?: Direction;
}

export function Button({
  label,
  icon,
  isPrimary = false,
  disabled = false,
  disabledPadding = false,
  direction = "vertical-middle",
  ...props
}: ButtonProps) {
  const baseStyle = isPrimary
    ? "w-full relative bg-brand-primary text-white p-[0.5px] h-20 flex justify-center items-center transition-all duration-300"
    : "w-full relative bg-brand-primary p-[0.5px] h-20 flex justify-center items-center transition-all duration-300";

  const hoverStyle = isPrimary
    ? "hover:text-black"
    : direction === "middle"
    ? ""
    : "hover:text-white";

  const paddingHoverMap: Record<Direction, string> = {
    "vertical-middle": "hover:py-10",
    top: isPrimary ? "hover:pt-0 pt-20" : "hover:pb-20",
    bottom: "hover:pt-20",
    right: isPrimary ? "hover:pr-0 pr-[100%]" : "hover:pl-[100%]",
    left: isPrimary ? "hover:pl-0 pl-[100%]" : "hover:pr-[100%]",
    middle: "hover:p-2",
  };

  const paddingHover = disabledPadding ? "" : paddingHoverMap[direction];

  const disabledStyle = "disabled:opacity-50 disabled:cursor-not-allowed";

  const classes = [
    baseStyle,
    disabledStyle,
    disabledPadding ? "" : `${hoverStyle} cursor-pointer ${paddingHover}`,
  ].join(" ");

  return (
    <button {...props} disabled={disabled} className={classes}>
      <div className={`h-full w-full bg-white`} />
      <div className="absolute top-0 bottom-0 left-0 right-0 m-auto z-10 flex items-center justify-center">
        {icon ?? label}
      </div>
    </button>
  );
}
