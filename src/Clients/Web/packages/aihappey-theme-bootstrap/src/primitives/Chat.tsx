import type { JSX } from "react";
import { Message } from "aihappey-types";
import { Markdown } from "aihappey-core";

export const Chat = ({ messages }: { messages?: Message[] }): JSX.Element => (
  <div className="d-flex flex-column gap-2">
    {messages?.map((m, i) => {
      const isUser = m.role === "user";
      return (
        <div
          key={i}
          className={"d-flex " + (isUser ? "justify-content-end" : "justify-content-start")}
        >
          <div
            className={
              "rounded px-3 py-2" +
              (isUser ? " bg-primary text-white" : " bg-light border")
            }
            style={{ maxWidth: "75%" }}
          >
            <Markdown text={m.content} />
          </div>
        </div>
      );
    })}
  </div>
);
