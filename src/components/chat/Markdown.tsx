'use client'

import {Alert, AlertDescription, AlertTitle} from '@/components/shadcn/alert'
import {Badge} from '@/components/shadcn/badge'
import {cn} from '@/lib/utils'
import {CheckIcon, CopyIcon, InfoIcon, WarningIcon} from '@phosphor-icons/react'
import dynamic from 'next/dynamic'
import React, {memo, useState} from 'react'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeRaw from 'rehype-raw'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import {visit} from 'unist-util-visit'
const ReactMarkdown = dynamic(() => import('react-markdown'), {ssr: false})

function remarkAdmonitions() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type === 'containerDirective' || node.type === 'leafDirective' || node.type === 'textDirective') {
        const data = node.data || (node.data = {})
        const tagName = node.type === 'textDirective' ? 'span' : 'div'

        data.hName = tagName
        data.hProperties = {
          ...(node.attributes || {}),
          className: cn(
            'admonition',
            node.name === 'info' && 'admonition-info',
            node.name === 'warning' && 'admonition-warning',
            node.name === 'tip' && 'admonition-tip',
            node.name === 'danger' && 'admonition-danger',
            node.attributes?.class,
          ),
          'data-type': node.name,
        }
      }
    })
  }
}

const CodeBlock = ({
  inline,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'code'> & {inline?: boolean}) => {
  const [isCopied, setIsCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''

  const handleCopy = () => {
    if (!children) return
    navigator.clipboard.writeText(String(children)).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  if (!inline && match) {
    return (
      <div className="relative my-4 overflow-hidden rounded-lg border border-slate-700/50 bg-[#1e1e1e]">
        <div className="flex items-center justify-between bg-[#252526] px-4 py-2 text-xs text-slate-400">
          <span className="font-mono">{language}</span>
          <button onClick={handleCopy} className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
            {isCopied ? (
              <>
                <CheckIcon size={14} />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon size={14} />
                Copy
              </>
            )}
          </button>
        </div>
        <SyntaxHighlighter
          {...props}
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: 'transparent',
            padding: '1rem',
          }}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    )
  }

  return (
    <code
      className={cn('rounded-md bg-slate-800/50 px-1.5 py-0.5 font-mono text-sm text-indigo-300', className)}
      {...props}
    >
      {children}
    </code>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: any = {
  code: CodeBlock,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  a: ({node: _node, ...props}: any) => (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 transition-colors"
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: ({node: _node, ...props}: any) => (
    <div className="my-6 w-full overflow-y-auto rounded-lg border border-slate-700/50">
      <table className="w-full text-left text-sm" {...props} />
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thead: ({node: _node, ...props}: any) => <thead className="bg-slate-800/50 text-slate-200" {...props} />,
  tbody: ({node: _node, ...props}: any) => (
    <tbody className="divide-y divide-slate-700/50 bg-slate-900/20" {...props} />
  ),
  tr: ({node: _node, ...props}: any) => <tr className="transition-colors hover:bg-slate-800/30" {...props} />,
  th: ({node: _node, ...props}: any) => <th className="px-4 py-3 font-medium" {...props} />,
  td: ({node: _node, ...props}: any) => <td className="px-4 py-3 text-slate-300" {...props} />,
  img: ({node: _node, ...props}: any) => (
    <img
      className="my-4 max-h-[400px] w-auto rounded-lg border border-slate-700/50 shadow-md"
      alt={props.alt || 'Image'}
      {...props}
    />
  ),
  alert: ({node: _node, type: _type, ...props}: any) => {
    const variant = props.type === 'success' ? 'success' : 'default'
    return <Alert variant={variant} {...props} />
  },
  badge: ({node: _node, variant, ...props}: any) => <Badge variant={variant || 'default'} {...props} />,
  div: ({node: _node, className, ...props}: any) => {
    if (className?.includes('admonition')) {
      const type = props['data-type']
      let variant: 'default' | 'destructive' | 'warning' | 'info' | 'success' = 'default'
      let Icon = InfoIcon

      if (type === 'warning') {
        variant = 'warning'
        Icon = WarningIcon
      } else if (type === 'danger' || type === 'error') {
        variant = 'destructive'
        Icon = WarningIcon
      } else if (type === 'info') {
        variant = 'info'
        Icon = InfoIcon
      } else if (type === 'tip' || type === 'success') {
        variant = 'success'
        Icon = CheckIcon
      }

      return (
        <Alert variant={variant} className="my-4">
          <Icon className="h-4 w-4" />
          <AlertTitle className="capitalize">{type}</AlertTitle>
          <AlertDescription>{props.children}</AlertDescription>
        </Alert>
      )
    }
    return <div className={className} {...props} />
  },
}

export const Markdown = memo(({content}: {content: string}) => {
  return (
    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0">
      <ReactMarkdown
        // @ts-expect-error - remarkPlugins is a valid prop
        remarkPlugins={[remarkGfm, remarkDirective, remarkAdmonitions]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})

Markdown.displayName = 'Markdown'
