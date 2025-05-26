import * as React from "react";
import type { ComponentProps, JSX } from "react";
import { Button as FluentButton } from "@fluentui/react-components";
import type { IconToken } from "aihappey-types";
import {
  AddRegular,
  EditRegular,
  DeleteRegular,
  SendRegular,
  SettingsRegular,
  ChevronDownRegular,
  ChevronUpRegular,
  DocumentRegular,
  PromptRegular,
  PlugConnectedSettingsRegular,
} from "@fluentui/react-icons";

const iconMap: Record<IconToken, JSX.Element> = {
  add: <AddRegular />,
  edit: <EditRegular />,
  delete: <DeleteRegular />,
  prompts: <PromptRegular />,
  resources: <DocumentRegular />,
  mcpServer: <PlugConnectedSettingsRegular />,
  send: <SendRegular />,
  settings: <SettingsRegular />,
  chevronDown: <ChevronDownRegular />,
  chevronUp: <ChevronUpRegular />,
};

export const Button = ({
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  children,
  ...rest
}: ComponentProps<"button"> & {
  variant?: string;
  size?: string;
  icon?: IconToken;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
}): JSX.Element => {
  const iconElem = icon ? iconMap[icon] : undefined;
  return (
    <FluentButton
      appearance={
        variant === "primary"
          ? "primary"
          : variant === "secondary"
          ? "secondary"
          : variant === "outline"
          ? "outline"
          : "transparent"
      }
      size={
        size === "sm" || size === "small"
          ? "small"
          : size === "lg" || size === "large"
          ? "large"
          : "medium"
      }
      icon={iconElem && iconPosition === "left" ? iconElem : undefined}
      iconAfter={iconElem && iconPosition === "right" ? iconElem : undefined}
      {...(rest as any)}
    >
      {children}
    </FluentButton>
  );
};
