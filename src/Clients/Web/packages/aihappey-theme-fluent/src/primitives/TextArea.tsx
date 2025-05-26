import * as React from "react";
import { Textarea as FluentTextarea } from "@fluentui/react-components";

export const TextArea = ({
  rows,
  value,
  onChange,
  style,
  readOnly,
  className,
}: {
  rows?: number;
  value: string;
  onChange?: (value: string) => void; // now optional
  style?: React.CSSProperties;
  readOnly?: boolean;
  className?: string;
}): JSX.Element => (
  <FluentTextarea
    rows={rows}
    value={value}
    disabled={readOnly}
    onChange={onChange ? (_, data) => onChange(data.value) : undefined}
    style={style}
    className={className}
  />
);
