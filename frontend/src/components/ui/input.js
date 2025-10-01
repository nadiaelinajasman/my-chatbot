import * as React from "react";

export const Input = React.forwardRef(({ ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    style={{
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "16px",
      ...props.style,
    }}
  />
));

Input.displayName = "Input";
