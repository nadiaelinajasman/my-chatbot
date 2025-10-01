import * as React from "react";

export const Card = ({ children, style, ...props }) => (
  <div
    {...props}
    style={{
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      border: "1px solid #e5e7eb",
      padding: 24,
      ...style,
    }}
  >
    {children}
  </div>
);
