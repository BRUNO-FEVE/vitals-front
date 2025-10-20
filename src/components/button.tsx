import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
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
  /** animate label changes */
  animate?: boolean;
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
  animate = false,
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
  const disabledStyle = "disabled:cursor-not-allowed";

  const classes = cn(
    baseStyle,
    disabledStyle,
    !disabledPadding && cn("cursor-pointer", hoverStyle, paddingHover),
    props.className
  );

  // Create a unique key for the icon based on its type
  const getIconKey = (iconElement: JSX.Element) => {
    return iconElement?.type?.name || String(iconElement);
  };

  return (
    <button {...props} disabled={disabled} className={classes}>
      <div className={cn("h-full w-full ", contentBgColor)} />
      <div className="absolute inset-0 flex items-center justify-center">
        {icon ? (
          animate ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={getIconKey(icon)}
                initial={{ opacity: 0, y: 20, scale: 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 1 }}
                transition={{ duration: 0.3, ease: "backInOut" }}
              >
                {icon}
              </motion.div>
            </AnimatePresence>
          ) : (
            icon
          )
        ) : animate && label ? (
          <AnimatePresence mode="wait">
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 20, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1 }}
              transition={{ duration: 0.3, ease: "backInOut" }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        ) : (
          label
        )}
      </div>
    </button>
  );
}
