import type { AihUiTheme } from "aihappey-types";
export { Button } from "./primitives/Button";
export { Input } from "./primitives/Input";
export { Card } from "./primitives/Card";
export { Alert } from "./primitives/Alert";
export { Spinner } from "./primitives/Spinner";
export { Modal } from "./primitives/Modal";
export { Tabs } from "./primitives/Tabs";
export { Tab } from "./primitives/Tab";
export { Badge } from "./primitives/Badge";
export { Table } from "./primitives/Table";
export { Chat } from "./primitives/Chat";
export { CloseButton } from "./primitives/CloseButton";
export { Switch } from "./primitives/Switch";
export { TextArea } from "./primitives/TextArea";

import { Button } from "./primitives/Button";
import { Input } from "./primitives/Input";
import { Card } from "./primitives/Card";
import { Alert } from "./primitives/Alert";
import { Spinner } from "./primitives/Spinner";
import { Modal } from "./primitives/Modal";
import { Tabs } from "./primitives/Tabs";
import { Tab } from "./primitives/Tab";
import { Badge } from "./primitives/Badge";
import { Table } from "./primitives/Table";
import { CloseButton } from "./primitives/CloseButton";
import { Switch } from "./primitives/Switch";
import { TextArea } from "./primitives/TextArea";
import { Chat } from "./primitives/Chat";
import { Select } from "./primitives/Select";
import { Drawer } from "./primitives/Drawer";
import { Image } from "./primitives/Image";

export const fluentTheme: AihUiTheme = {
  Button,
  Input,
  Card,
  Select,
  Alert,
  Spinner,
  Image,
  Chat,
  Modal,
  Tabs: Tabs as any,
  Tab: Tab as any,
  Badge,
  Table,
  CloseButton,
  Switch,
  TextArea,
  Drawer,
};
