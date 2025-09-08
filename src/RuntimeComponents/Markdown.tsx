import  { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'; // allow raw HTML if needed
import remarkGfm from 'remark-gfm'; // GitHub flavored markdown (tables, strikethrough)
import remarkMath from 'remark-math'; // math support if needed
import rehypeKatex from 'rehype-katex'; // math rendering


interface MarkdownProps {
  content: string;
}

const Markdown = memo<MarkdownProps>(({ content }) => {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={{
        // customize rendering if needed
        a: ({ node, ...props }) => <a className="text-indigo-600 underline" {...props} />,
        code: ({ node,  className, children, ...props }) => (
          <code className={`bg-gray-100 p-1 rounded ${className || ''}`} {...props}>
            {children}
          </code>
        ),
      }}
    />
  );
});

Markdown.displayName = 'Markdown';
export default Markdown;
