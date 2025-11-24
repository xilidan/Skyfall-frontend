declare module 'react-markdown' {
  import * as React from 'react'

  export interface ReactMarkdownProps {
    children: string
    className?: string
  }

  const ReactMarkdown: React.FC<ReactMarkdownProps>
  export default ReactMarkdown
}
