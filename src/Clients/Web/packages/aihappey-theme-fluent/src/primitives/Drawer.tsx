import {
  OverlayDrawer,
  DrawerHeader,
  InlineDrawer,
  DrawerHeaderTitle,
  DrawerBody,
} from "@fluentui/react-components";
import type { DrawerProps, DrawerSize } from "aihappey-types";

const sizeMap: Record<DrawerSize, any> = {
  small: "small",
  medium: "medium",
  large: "large",
  full: "full",
};

export const Drawer = ({
  open,
  onClose,
  position = "end",
  size = "small",
  title,
  backdrop = true, // OverlayDrawer always has backdrop, ignore param
  children,
}: DrawerProps) => (
  <InlineDrawer
    open={open}
   // onOpenChange={(_, data) => !data.open && onClose()}
    position={
      position === "top"
        ? "end" // fallback, as Fluent does not support "top"
        : position
    }
    size={sizeMap[size]}
  >
    {title && (
      <DrawerHeader>
        <DrawerHeaderTitle>{title}</DrawerHeaderTitle>
      </DrawerHeader>
    )}
    <DrawerBody>{children}</DrawerBody>
  </InlineDrawer>
);
