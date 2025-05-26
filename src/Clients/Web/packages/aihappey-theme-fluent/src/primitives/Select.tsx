import * as React from "react";
import { Dropdown, Option, DropdownProps } from "@fluentui/react-components";

interface SelectProps extends Omit<DropdownProps, "children" | "onChange" | "value"> {
  value: string;
  onChange: (e: any) => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  disabled,
  children,
  style,
  "aria-label": ariaLabel,
  ...rest
}) => {
  // Children are <option> elements; convert to array of { value, label }
  const options = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child: any) => ({
      value: child.props.value,
      label: child.props.children,
    }));

  return (
    <Dropdown
      value={options.find((o) => o.value === value)?.label ?? ""}
      selectedOptions={[value]}
      onOptionSelect={(_, data) => {
        if (data.optionValue) onChange(data.optionValue);
      }}
      disabled={disabled}
      style={style}
      aria-label={ariaLabel}
      {...rest}
    >
      {options.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </Dropdown>
  );
};
