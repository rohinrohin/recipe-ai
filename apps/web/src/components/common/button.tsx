import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default:
          "bg-[#F64C20] text-white shadow-sm hover:bg-[#E03D10] focus-visible:ring-[#F64C20]",
        success:
          "bg-[#99EBA0] text-[#1A0803] shadow-sm hover:bg-[#8CDF93] focus-visible:ring-[#99EBA0]",
        destructive:
          "bg-red-500 text-white shadow-xs hover:bg-red-600",
        outline:
          "border-2 border-[#1A0803] bg-transparent text-[#1A0803] hover:bg-[#1A0803] hover:text-white",
        secondary:
          "bg-[#F1E7DD] text-[#1A0803] shadow-xs hover:bg-[#E9DBCD]",
        ghost: "hover:bg-[#F1E7DD] text-[#1A0803]",
        link: "text-[#F64C20] underline-offset-4 hover:underline hover:translate-y-0",
      },
      size: {
        default: "h-12 px-8 py-3 text-base",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-10 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
