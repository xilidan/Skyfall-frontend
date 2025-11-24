'use client'
import {openOmnibar} from '@/commands/omnibar/Omnibar'
import {Button} from '@/components/shared/Button'
import {tfetch} from '@/lib/tfetch'
import {cn} from '@/lib/utils'
import {useApiQuery} from '@/server/api'
import {GearIcon, PlusIcon} from '@phosphor-icons/react'
import {useMutation} from '@tanstack/react-query'
import {LogOutIcon, UserCircleIcon} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {FetchError} from 'ofetch'
import {useState} from 'react'
import {toast} from 'sonner'
import {z} from 'zod'
import {Chat} from '../chat/Chat'

export function HomePage() {
  const router = useRouter()
  const logout = useMutation({
    mutationFn: () => {
      return tfetch('/api/logout', {
        method: 'POST',
        responseBodySchema: z.unknown(),
      })
    },
    onSuccess: () => {
      router.push('/auth/login')
    },
    onError: (error: FetchError) => {
      toast.error(error?.response?._data?.message)
    },
  })
  const [activeChatId, setActiveChatId] = useState<number>(1)

  const getMe = useApiQuery(['getMe'])

  return (
    <main className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <aside className="w-80 shrink-0 border-r border-slate-800/60 bg-slate-950/50 backdrop-blur-xl hidden md:flex md:flex-col z-20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6 px-2 pt-2">
            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
              Skyfall AI
            </h1>
          </div>

          <Button
            className="w-full justify-start gap-3 bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 transition-all duration-300 rounded-xl py-6"
            onPress={() => setActiveChatId(Date.now())}
          >
            <PlusIcon weight="bold" className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 px-2">Recent Chats</h3>
            <ul className="space-y-2">
              {MOCKED_CHATS.map((chat) => (
                <li key={chat.id}>
                  <button
                    onClick={() => setActiveChatId(chat.id)}
                    className={cn(
                      `w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 flex flex-col gap-1 group border`,
                      {
                        'bg-slate-800/80 border-slate-700/50 text-slate-100 shadow-md': activeChatId === chat.id,
                        'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-slate-200':
                          activeChatId !== chat.id,
                      },
                    )}
                  >
                    <span
                      className={cn(`font-medium truncate`, {
                        'text-indigo-300': activeChatId === chat.id,
                        'text-slate-200': activeChatId !== chat.id,
                      })}
                    >
                      {chat.title}
                    </span>
                    <span className="text-xs text-slate-500 group-hover:text-slate-400">{chat.date}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="mt-auto p-4 border-t border-slate-800/60 bg-slate-950/30 flex items-center gap-3 w-full backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/20 group-hover:shadow-indigo-500/20 transition-all ring-2 ring-slate-900">
            <UserCircleIcon className="text-white" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
              {getMe.data?.user.name + ' ' + getMe.data?.user.surname}
            </p>
            <p className="text-xs text-slate-500 truncate">{getMe.data?.user.job ?? 'Unknown'}</p>
          </div>
          <button
            onClick={() =>
              openOmnibar({
                command: 'addOrganization',
              })
            }
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-indigo-400 transition-colors"
          >
            <GearIcon size={20} />
          </button>

          <button
            onClick={() => logout.mutate()}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-indigo-400 transition-colors"
          >
            <LogOutIcon size={20} />
          </button>
        </footer>
      </aside>

      <div className="flex-1 flex flex-col relative bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />

        <div className="md:hidden border-b border-slate-800 p-4 bg-slate-950/80 backdrop-blur z-30">
          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
            Skyfall AI
          </h1>
        </div>

        <Chat />
      </div>
    </main>
  )
}

const MOCKED_CHATS = [
  {id: 1, title: 'Project Skyfall Planning', date: 'Today'},
  {id: 2, title: 'Marketing Campaign Q4', date: 'Yesterday'},
  {id: 3, title: 'Bug Fixes Discussion', date: '2 days ago'},
  {id: 4, title: 'Team Retrospective', date: 'Last week'},
]
