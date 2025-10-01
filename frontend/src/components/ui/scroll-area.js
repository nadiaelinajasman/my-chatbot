import * as React from "react";

export const ScrollArea = ({ children, style, ...props }) => (
  <div
    {...props}
    style={{
      overflowY: "auto",
      ...style,
    }}
  >
    {children}
  </div>
);
