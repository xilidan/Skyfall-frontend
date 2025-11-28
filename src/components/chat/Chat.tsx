'use client'

import {cn} from '@/lib/utils'
import {getApi} from '@/server/api'
import {PaperPlaneRightIcon, PaperclipIcon, SpinnerIcon, XIcon} from '@phosphor-icons/react'
import {FormEvent, useEffect, useRef, useState} from 'react'
import MessageBubble from './MessageBubble'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

const SESSION_ID_KEY = 'chat-session-id'

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return Date.now().toString()
  const existing = sessionStorage.getItem(SESSION_ID_KEY)
  if (existing) return existing
  const newId = Date.now().toString()
  sessionStorage.setItem(SESSION_ID_KEY, newId)
  return newId
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sys-1',
      role: 'assistant',
      content:
        'Hi! I am Team Lead Assistant. Send requirements, MR link or text after a meeting - the assistant will create tasks in Jira and suggest decomposition.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const assistantMessageRef = useRef<ChatMessage | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if ((!trimmed && files.length === 0) || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed || (files.length > 0 ? `[Attached ${files.length} file${files.length > 1 ? 's' : ''}]` : ''),
    }

    setMessages((prev: ChatMessage[]) => [...prev, userMessage])
    const filesToSend = [...files]
    setInput('')
    setFiles([])
    setIsLoading(true)

    try {
      const api = getApi()
      const sessionId = getOrCreateSessionId()
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
      }
      assistantMessageRef.current = assistantMessage
      setMessages((prev) => [...prev, assistantMessage])

      for await (const chunk of api.chatStream(
        trimmed || '',
        sessionId,
        filesToSend.length > 0 ? filesToSend : undefined,
      )) {
        if (!assistantMessageRef.current) break
        assistantMessageRef.current.content += chunk

        // Update immediately for smooth streaming - React will batch updates automatically
        if (assistantMessageRef.current) {
          const current = assistantMessageRef.current
          setMessages((prev) => {
            const newMessages = [...prev]
            const lastIndex = newMessages.length - 1
            if (
              lastIndex >= 0 &&
              newMessages[lastIndex].role === 'assistant' &&
              newMessages[lastIndex].id === current.id
            ) {
              newMessages[lastIndex] = {
                id: current.id,
                role: current.role,
                content: current.content,
              }
            }
            return newMessages
          })
        }
      }

      // Final update to ensure all content is displayed
      if (assistantMessageRef.current) {
        const current = assistantMessageRef.current
        setMessages((prev) => {
          const newMessages = [...prev]
          const lastIndex = newMessages.length - 1
          if (lastIndex >= 0 && newMessages[lastIndex].role === 'assistant') {
            newMessages[lastIndex] = {
              id: current.id,
              role: current.role,
              content: current.content,
            }
          }
          return newMessages
        })
      }
    } catch (err) {
      console.error(err)
      const errorMessage: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Could not get response from server. Please check your internet connection or try again later.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      assistantMessageRef.current = null
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...selectedFiles])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden relative h-full">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        <div className="mx-auto w-full max-w-5xl space-y-6">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-800/50 px-4 py-3 text-slate-400">
                <SpinnerIcon className="animate-spin" size={18} />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <div className="px-4 pb-6 pt-2 md:px-6 lg:px-8 bg-linear-to-t from-slate-950 via-slate-950/90 to-transparent z-10">
        <div className="mx-auto w-full max-w-5xl">
          {files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 text-xs"
                >
                  <PaperclipIcon size={14} className="text-slate-400" />
                  <span className="text-slate-300 max-w-[200px] truncate" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-slate-500">({formatFileSize(file.size)})</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-1 text-slate-400 hover:text-slate-200 transition-colors hover:bg-slate-700/50 rounded-full p-1"
                    disabled={isLoading}
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 rounded-3xl border border-slate-700/50 bg-slate-900/80 p-2 shadow-xl shadow-black/20 backdrop-blur-xl transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300 transition-all mb-1 ml-1"
              title="Attach files"
            >
              <PaperclipIcon size={18} weight="duotone" />
            </button>
            <textarea
              className="flex-1 resize-none bg-transparent px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none max-h-32 scrollbar-hide"
              placeholder="Ask anything about your project..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && files.length === 0)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-all mb-1 mr-1',
                input.trim() || files.length > 0
                  ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed',
                isLoading && 'opacity-50',
              )}
            >
              <PaperPlaneRightIcon size={18} weight="fill" />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-500">Skyfall AI can make mistakes. Check important info.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
