"use client";

import { ButtonHTMLAttributes, ReactNode, useState } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string; // "r,g,b"
  variant?: "default" | "operator" | "equals" | "wide";
  children: ReactNode;
}

export function GlassButton({
  color = "0,255,240",
  variant = "default",
  className = "",
  children,
  onPointerDown,
  style,
  ...rest
}: GlassButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      {...rest}
      onPointerDown={(e) => {
        setPressed(true);
        onPointerDown?.(e);
      }}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={`glass-btn ${variant === "wide" ? "glass-btn-wide" : ""} ${
        pressed ? "glass-btn-pressed" : ""
      } ${className}`}
      style={
        {
          "--btn-color": color,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </button>
  );
}
