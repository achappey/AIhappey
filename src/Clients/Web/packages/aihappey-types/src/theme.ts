import type { ComponentProps, ComponentType, JSX } from "react";
import type { Message } from "./chat";

// Semantic icon token, not tied to any icon library
export type IconToken =
  | 'add'
  | 'edit'
  | 'delete'
  | 'send'
  | 'mcpServer'
  | 'prompts'
  | 'resources'
  | 'settings'
  | 'chevronDown'
  | 'chevronUp';

// Drawer/Offcanvas cross-framework types
export type DrawerPosition = 'start' | 'end' | 'top' | 'bottom';
export type DrawerSize = 'small' | 'medium' | 'large' | 'full';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  position?: DrawerPosition; // default 'end'
  size?: DrawerSize;         // default 'small'
  backdrop?: boolean;        // default true
}

export interface AihUiTheme {
  Button: (props: ComponentProps<"button"> & {
    variant?: string;
    size?: string;
    icon?: IconToken;
    iconPosition?: 'left' | 'right';
  }) => JSX.Element;
  Input: (props: ComponentProps<"input">) => JSX.Element;
  Image: (props: {
    fit?: "none" | "center" | "contain" | "cover" | "default";
    shadow?: boolean;
    block?: boolean;
    src?: string;
    bordered?: boolean;
    shape?: 'circular' | 'rounded' | 'square';
  }) => JSX.Element;
  Card: (props: { title: string; text?: string; actions?: JSX.Element, children?: React.ReactNode }) => JSX.Element;
  Alert: (props: { variant: string; className?: string; children: React.ReactNode }) => JSX.Element;
  Spinner: (props: { size?: string; className?: string }) => JSX.Element;
  Modal: (props: { title: string, show: boolean; onHide: () => void; size?: string; centered?: boolean; children: React.ReactNode }) => JSX.Element;
  Tabs: (props: { activeKey: string; onSelect: (k: string) => void; className?: string; children: React.ReactNode }) => JSX.Element;
  Tab: (props: { eventKey: string; title: React.ReactNode; children: React.ReactNode }) => JSX.Element;
  Badge: (props: { bg?: string; text?: string; children: React.ReactNode }) => JSX.Element;
  Table: (props: { hover?: boolean, bordered?: boolean, striped?: boolean, borderless?: boolean; size?: string; children: React.ReactNode }) => JSX.Element;
  CloseButton: (props: { onClick: (e: any) => void; className?: string; style?: React.CSSProperties; "aria-label"?: string }) => JSX.Element;
  Select: ComponentType<any>;

  // Added for UI framework agnostic toggles and textareas
  Switch: (props: {
    id: string;
    label?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
  }) => JSX.Element;

  TextArea: (props: {
    rows?: number;
    value: string;
    readOnly?: boolean
    onChange?: (value: string) => void;
    style?: React.CSSProperties;
    className?: string;
  }) => JSX.Element;

  Chat: (props: { messages?: Message[] }) => JSX.Element;

  Drawer: (props: DrawerProps) => JSX.Element;
}
