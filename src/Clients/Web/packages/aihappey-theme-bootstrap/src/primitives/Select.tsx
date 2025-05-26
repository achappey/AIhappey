import * as React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

export const Select: React.FC<SelectProps> = ({
  children,
  style,
  ...rest
}) => (
  <select style={{ ...style, padding: "6px 12px", borderRadius: 4, border: "1px solid #ccc" }} {...rest}>
    {children}
  </select>
);
