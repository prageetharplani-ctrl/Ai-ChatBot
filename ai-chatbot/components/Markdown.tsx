'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-relay">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className } = props;
            const match = /language-(\w+)/.exec(className || '');
            const isBlock = Boolean(match);
            if (!isBlock) {
              return <code className={className}>{children}</code>;
            }
            return <CodeBlock code={String(children).replace(/\n$/, '')} language={match?.[1]} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
