import React from "react";
import { useAppStore } from "aihappey-state";
import { ProgressNotificationCard } from "./ProgressNotificationCard";

export const ProgressNotificationsActivity: React.FC = () => {
  const progress = useAppStore((s) => s.progress);

  if (!progress.length) {
    return <div className="p-3 text-muted">No progress</div>;
  }
  progress.reverse();
  return (
    <div
      className="p-3"
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      {progress.map((n, i: number) => (
        <ProgressNotificationCard key={i} notif={n} />
      ))}
    </div>
  );
};
