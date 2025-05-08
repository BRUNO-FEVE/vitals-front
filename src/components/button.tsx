import { cn } from "@/lib/utils";
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
  /** outer button background */
  buttonBgColor?: string;
  /** inner content background */
  contentBgColor?: string;
}

export function Button({
  label,
  icon,
  isPrimary = false,
  disabled = false,
  disabledPadding = false,
  direction = "vertical-middle",
  buttonBgColor = "bg-brand-primary",
  contentBgColor = "bg-white",
  ...props
}: ButtonProps) {
  // base button: full size, padding, custom bg
  const baseStyle = cn(
    "w-full relative p-[0.5px] h-20 flex justify-center items-center transition-all duration-300",
    buttonBgColor,
    isPrimary && "text-white"
  );

  // hover text color
  const hoverStyle = isPrimary
    ? "hover:text-black"
    : direction === "middle"
    ? ""
    : "hover:text-white";

  // map your direction → padding
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

  const classes = cn(
    baseStyle,
    disabledStyle,
    !disabledPadding && cn("cursor-pointer", hoverStyle, paddingHover),
    props.className
  );

  return (
    <button {...props} disabled={disabled} className={classes}>
      <div className={cn("h-full w-full", contentBgColor)} />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {icon ?? label}
      </div>
    </button>
  );
}
