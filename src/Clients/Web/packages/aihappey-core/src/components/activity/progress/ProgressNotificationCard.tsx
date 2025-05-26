import React from "react";
import { useTheme } from "../../../ThemeContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export interface ProgressNotificationCardProps {
  notif: any;
}

export const ProgressNotificationCard: React.FC<
  ProgressNotificationCardProps
> = ({ notif }) => {
  const theme = useTheme();

  return theme.Card({
    title: notif.progressToken.toString(),
    children: (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      >
        {notif.message}
      </ReactMarkdown>
    ),
  });
};
