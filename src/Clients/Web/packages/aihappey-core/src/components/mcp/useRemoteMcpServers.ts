import { useEffect } from "react";
import { useAppStore } from "aihappey-state";

export const useRemoteMcpServers = (configUrls: string[] = []) => {
  const addServer = useAppStore((s) => s.addServer);

  useEffect(() => {
    if (!configUrls.length) return;

    (async () => {
      // Fetch all URLs in parallel
      const results = await Promise.all(
        configUrls.map(async (url) => {
          const res = await fetch(url);
          if (!res.ok) return null;
          // Adjust the structure if needed
          return res.json();
        })
      );

      // Flatten and process the combined results
      results
        .filter(Boolean)
        .flat()
        .forEach((item: any) => {
          const record =
            item && typeof item === "object" && "servers" in item ? item.servers : item;

          Object.entries(record as Record<string, any>).forEach(([name, cfg]) =>
            addServer(name, cfg)
          );
        });
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(configUrls), addServer]);
};
