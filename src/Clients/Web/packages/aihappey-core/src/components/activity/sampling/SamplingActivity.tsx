import React from "react";
import { useAppStore } from "aihappey-state";
import { SamplingCard } from "./SamplingCard";

export const SamplingActivity: React.FC = () => {
  const sampling = useAppStore((s) => s.sampling);

  var items = Object.keys(sampling).map((t) => sampling[t]).reverse();
  if (!items.length) {
    return <div className="p-3 text-muted">No sampling</div>;
  }

  return (
    <div
      className="p-3"
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      {items.map((n, i: number) => (
        <SamplingCard key={i} notif={n} />
      ))}
    </div>
  );
};
