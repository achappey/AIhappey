import Offcanvas from "react-bootstrap/Offcanvas";
import type { DrawerProps, DrawerSize } from "aihappey-types";

// Map DrawerSize to custom class for width control
const sizeClass: Record<DrawerSize, string> = {
  small: "aih-drawer-sm",
  medium: "aih-drawer-md",
  large: "aih-drawer-lg",
  full: "aih-drawer-full",
};

export const Drawer = ({
  open,
  onClose,
  position = "end",
  size = "small",
  title,
  backdrop = false,
  children,
}: DrawerProps) => (
  <Offcanvas
    show={open}
    onHide={onClose}
    placement={position}
    backdrop={backdrop}
    className={sizeClass[size]}
  >
    {title && (
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{title}</Offcanvas.Title>
      </Offcanvas.Header>
    )}
    <Offcanvas.Body>{children}</Offcanvas.Body>
  </Offcanvas>
);

// Minimal CSS for drawer sizes (to be imported in theme entry or global CSS)
/*
.aih-drawer-sm { --bs-offcanvas-width: 240px; }
.aih-drawer-md { --bs-offcanvas-width: 320px; }
.aih-drawer-lg { --bs-offcanvas-width: 480px; }
.aih-drawer-full { --bs-offcanvas-width: 100vw; }
*/
