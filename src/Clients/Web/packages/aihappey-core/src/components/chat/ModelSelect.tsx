import React from "react";
import { useTheme } from "../../ThemeContext";

export interface ModelOption {
  id: string;
  displayName: string;
}

interface ModelSelectProps {
  models: ModelOption[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export const ModelSelect: React.FC<ModelSelectProps> = ({
  models,
  value,
  onChange,
  disabled,
}) => {
  const { Select } = useTheme();

  // Fallback to native select if theme does not provide one
  const SelectComponent = Select || "select";

  return (
    <SelectComponent
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement> | any) => {
        // For Fluent UI Dropdown, e.target.value may not exist, so fallback to e.currentTarget.value or e (for custom)
        const selectedValue =
          e?.target?.value ?? e?.currentTarget?.value ?? e;
        onChange(selectedValue);
      }}
      disabled={disabled}
      style={{ minWidth: 160, maxWidth: 240 }}
      aria-label="Model"
    >
      {models.map((model) => (
        <option key={model.id} value={model.id}>
          {model.displayName}
        </option>
      ))}
    </SelectComponent>
  );
};
