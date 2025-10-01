import * as React from "react";

export const CopyIcon = ({ size = 16, color = "#888", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <rect x="2" y="2" width="13" height="13" rx="2" ry="2" />
  </svg>
);
