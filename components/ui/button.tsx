"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border bg-transparent font-display font-bold italic uppercase whitespace-nowrap transition-transform outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:-translate-y-1 focus:translate-y-0",
        outline:
          "border-border text-foreground hover:-translate-y-1 focus:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground hover:-translate-y-1 focus:translate-y-0",
        ghost:
          "border-transparent hover:bg-muted hover:-translate-y-1 focus:translate-y-0",
        destructive:
          "border-brand-red text-brand-red hover:-translate-y-1 focus:translate-y-0",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
        // Brand variants
        "brand-orange":
          "border-brand-orange border-3 text-brand-orange hover:-translate-y-2 focus:translate-y-0",
        "brand-green":
          "border-brand-green border-3 text-brand-green hover:-translate-y-2 focus:translate-y-0",
        "brand-blue":
          "border-brand-blue border-3 text-brand-blue hover:-translate-y-2 focus:translate-y-0",
      },
      size: {
        default: "h-[60px] w-[220px] rounded-[200px] text-xl",
        xs: "h-[30px] w-[170px] rounded-[200px] text-sm",
        sm: "h-[44px] w-[180px] rounded-[200px] text-base",
        lg: "h-[72px] w-[320px] rounded-[200px] text-2xl",
        md: "h-[60px] w-[260px] rounded-[200px] text-xl",
        icon: "size-10 rounded-full border-0",
      },
    },
    defaultVariants: {
      variant: "brand-orange",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
