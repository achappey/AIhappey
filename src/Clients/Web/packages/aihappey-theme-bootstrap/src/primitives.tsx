import {
  Card as RBCard,
  Button as RBButton,
  Alert as RBAlert,
  Spinner as RBSpinner,
  Form,
  Badge,
  CloseButton,
  Modal,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import type { ComponentProps, JSX } from "react";
import type { AihUiTheme, IconToken } from "aihappey-types";
import { Chat } from "./primitives/Chat";
import { Select } from "./primitives/Select";
import { Drawer } from "./primitives/Drawer";
import { Image } from "./primitives/Image";
import {
  Plus,
  Pencil,
  Trash,
  Send,
  Gear,
  ChevronDown,
  ChevronUp,
  File,
  Plug,
  Chat as BSChatIcon,
} from "react-bootstrap-icons";
import React from "react";

const iconMap: Record<IconToken, JSX.Element> = {
  add: <Plus />,
  edit: <Pencil />,
  delete: <Trash />,
  prompts: <BSChatIcon />,
  resources: <File />,
  mcpServer: <Plug />,
  send: <Send />,
  settings: <Gear />,
  chevronDown: <ChevronDown />,
  chevronUp: <ChevronUp />,
};

export const bootstrapTheme: AihUiTheme = {
  Button: ({
    variant = "primary",
    size,
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
  }): JSX.Element => (
    <RBButton variant={variant} size={size as any} {...(rest as any)}>
      {icon && iconPosition === "left" && (
        <span className="me-2">{iconMap[icon]}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="ms-2">{iconMap[icon]}</span>
      )}
    </RBButton>
  ),
  Select,
  Image,
  Alert: ({ variant, className, children }): JSX.Element => (
    <RBAlert variant={variant as any} className={className}>
      {children}
    </RBAlert>
  ),

  Spinner: ({ size = "sm", className }): JSX.Element => (
    <RBSpinner animation="border" size={size as any} className={className} />
  ),
  Modal: (props) => {
    // Only allow "sm" | "lg" | "xl" for size
    const { size, title, children, ...rest } = props;
    const allowed =
      size === "sm" || size === "lg" || size === "xl" ? size : undefined;
    return (
      <Modal size={allowed} {...rest}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    );
  },
  Tabs: (props) => {
    // onSelect expects (k: string | null) => void
    const { onSelect, ...rest } = props;
    return (
      <Tabs
        {...rest}
        onSelect={(k) =>
          onSelect &&
          typeof onSelect === "function" &&
          k &&
          onSelect(k as string)
        }
      />
    );
  },
  Tab: (props) => <Tab {...props} />,
  Badge: (props) => <Badge {...props} />,
  Table: (props) => <Table {...props} />,
  CloseButton: (props) => <CloseButton {...props} />,

  Chat,

  // Added Switch primitive
  Switch: ({ id, label, checked, onChange, className }) => (
    <Form.Check
      type="switch"
      id={id}
      label={label}
      checked={checked}
      className={className}
      onChange={(e) => onChange(e.target.checked)}
    />
  ),

  // Added TextArea primitive
  TextArea: ({ rows, readOnly, value, onChange, style, className }) => (
    <Form.Control
      as="textarea"
      rows={rows}
      disabled={readOnly}
      value={value}
      style={style}
      className={className}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  ),

  Card: ({
    title,
    text,
    children,
    actions,
  }: {
    title: string;
    text?: string;
    children?: React.ReactNode;
    actions?: JSX.Element;
  }): JSX.Element => (
    <RBCard>
      <RBCard.Body>
        <RBCard.Title>{title}</RBCard.Title>
        <RBCard.Text>{children ?? text}</RBCard.Text>
        {actions && <div className="d-flex gap-2 mt-2">{actions}</div>}
      </RBCard.Body>
    </RBCard>
  ),

  Drawer,

  Input: (props: ComponentProps<"input">): JSX.Element => {
    // Only pass string size ("sm" | "lg") if present, not number
    const { size, value, ...rest } = props;
    const sizeProp =
      typeof size === "string" && (size === "sm" || size === "lg")
        ? size
        : undefined;
    // Convert readonly string[] to string[] if needed
    let valueProp = value;
    if (Array.isArray(value) && Object.isFrozen(value)) {
      valueProp = Array.from(value);
    }
    // Only pass value if not a readonly array, to avoid TS error
    if (Array.isArray(valueProp) && Object.isFrozen(valueProp)) {
      return <Form.Control {...(rest as any)} size={sizeProp} />;
    }
    return (
      <Form.Control
        {...(rest as any)}
        size={sizeProp}
        value={valueProp as string | number | string[] | undefined}
      />
    );
  },
};
