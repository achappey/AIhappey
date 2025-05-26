import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export const Markdown = ({ text }: { text: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeSanitize]}
    components={{
      p: ({ node, ...props }) => <p style={{ margin: "0.5em 0" }} {...props} />,
    }}
  >
    {text}
  </ReactMarkdown>
);
