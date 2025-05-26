import { useState } from "react";
import { useTheme } from "../../ThemeContext";
import { ServerSelectModal } from "./ServerSelectModal";

export const ServerSelectButton = () => {
  const { Button } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        icon="mcpServer"
        onClick={() => setOpen(true)}
        title="Select MCP Servers"
      ></Button>
      <ServerSelectModal show={open} onHide={() => setOpen(false)} />
    </>
  );
};
