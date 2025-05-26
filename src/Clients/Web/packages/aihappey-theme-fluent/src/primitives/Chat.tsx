import type { JSX } from "react";
import {
  Chat as FluentChat,
  ChatMessage,
  ChatMyMessage,
} from "@fluentui-contrib/react-chat";
import { Message } from "aihappey-types";
import { Markdown } from "aihappey-core";

export const Chat = ({ messages }: { messages?: Message[] }): JSX.Element => (
  <FluentChat>
    {messages?.map((a) =>
      a.role == "user" ? (
        <ChatMyMessage>
          <Markdown text={a.content} />
        </ChatMyMessage>
      ) : (
        <ChatMessage>
          <Markdown text={a.content} />
        </ChatMessage>
      )
    )}
  </FluentChat>
);
