'use client'

import {cn} from '@/lib/utils'
import {getApi} from '@/server/api'
import {PaperPlaneRightIcon, SpinnerIcon} from '@phosphor-icons/react'
import {FormEvent, useState} from 'react'
import MessageBubble from './MessageBubble'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }

    setMessages((prev: ChatMessage[]) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const api = getApi()
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
      }
      setMessages((prev) => [...prev, assistantMessage])

      for await (const chunk of api.chatStream(trimmed)) {
        assistantMessage.content += chunk
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {...assistantMessage}
          return newMessages
        })
      }
    } catch (err) {
      console.error(err)
      const errorMessage: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Не смог получить ответ от сервера. Проверь логи /api/chat или интернет.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden relative h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
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
          <div className="h-4" />
        </div>
      </div>

      <div className="px-4 pb-6 pt-2 md:px-6 lg:px-8 bg-linear-to-t from-slate-950 via-slate-950/90 to-transparent z-10">
        <div className="mx-auto w-full max-w-5xl">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 rounded-3xl border border-slate-700/50 bg-slate-900/80 p-2 shadow-xl shadow-black/20 backdrop-blur-xl transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50"
          >
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
              disabled={isLoading || !input.trim()}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-all mb-1 mr-1',
                input.trim()
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
