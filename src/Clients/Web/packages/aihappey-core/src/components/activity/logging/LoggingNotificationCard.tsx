import React from "react";
import { useTheme } from "../../../ThemeContext";

export interface LoggingNotificationCardProps {
  notif: any;
}

export const LoggingNotificationCard: React.FC<LoggingNotificationCardProps> = ({
  notif,
}) => {
  const theme = useTheme();
  const level = String(notif.level || notif.type || "Notification");
  const message = String(notif.data || "");

  return theme.Card({
    title: notif.level,
    text: message,
  });
};
