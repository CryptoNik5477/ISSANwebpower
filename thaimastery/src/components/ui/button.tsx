import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-gold-400 to-gold-500 text-night-950 font-semibold shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 hover:brightness-105",
  secondary:
    "border border-white/15 bg-white/5 text-night-100 hover:bg-white/10 backdrop-blur",
  ghost: "text-night-200 hover:text-white hover:bg-white/5",
  danger: "bg-red-500/90 text-white hover:bg-red-500",
};

export function buttonStyles(variant: ButtonVariant = "primary", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={buttonStyles(variant, className)} {...props} />;
}
