import * as React from "react";

export const Button = React.forwardRef(({ children, ...props }, ref) => (
  <button
    ref={ref}
    {...props}
    style={{
      padding: "8px 16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      background: props.variant === "outline" ? "#fff" : "#007bff",
      color: props.variant === "outline" ? "#007bff" : "#fff",
      fontSize: props.size === "sm" ? "12px" : "16px",
      cursor: "pointer",
      ...props.style,
    }}
  >
    {children}
  </button>
));

Button.displayName = "Button";
