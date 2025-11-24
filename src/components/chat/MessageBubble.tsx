import {Markdown} from '@/components/chat/Markdown'
import {cn} from '@/lib/utils'
import {RobotIcon, UserIcon} from '@phosphor-icons/react'
import type {ChatMessage} from './Chat'

export default function MessageBubble({message}: {message: ChatMessage}) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex w-full gap-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/50">
          <RobotIcon size={18} weight="duotone" />
        </div>
      )}

      <div
        className={cn(
          'relative max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm',
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-slate-800/50 text-slate-200 rounded-bl-sm border border-slate-700/50',
        )}
      >
        {isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : <Markdown content={message.content} />}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400">
          <UserIcon size={18} weight="duotone" />
        </div>
      )}
    </div>
  )
}
