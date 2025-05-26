import React from "react";
import { useTheme } from "../../../ThemeContext";
import { Message } from "../../chat";

export interface SamplingCardProps {
  notif: any;
}

export const SamplingCard: React.FC<SamplingCardProps> = ({ notif }) => {
  const { Chat, Card } = useTheme();
  console.log("dsadsa");
  console.log(notif);

  //  const flatMapped = notif[0].messages.flatMap((e) => e.content);
  const flatMapped: Message[] = notif[0].messages.flatMap((msg: any) =>
    (Array.isArray(msg.content) ? msg.content : [msg.content]).map(
      (contentItem: any) => ({
        id: msg.id, // or generate if missing
        role: msg.role,
        content:
          typeof contentItem === "string"
            ? contentItem
            : contentItem?.text ?? "",
      })
    )
  );

  if (notif[1]) {
    flatMapped.push({
      id: notif[1].id, // or generate if missing
      role: notif[1].role,
      content: notif[1].content.text,
      createdAt: "",
    });
  }

  return notif[1] ? (
    <Card
      title={notif[0].modelPreferences?.hints[0]?.name}
      text={notif[1].content.text}
    ></Card>
  ) : (
    <Card title={notif[0].modelPreferences?.hints[0]?.name}>
      <Chat messages={flatMapped} />
    </Card>
  );
};
