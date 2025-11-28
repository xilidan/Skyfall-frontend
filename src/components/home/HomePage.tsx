'use client'

import {openOmnibar} from '@/commands/omnibar/Omnibar'
import {tfetch} from '@/lib/tfetch'
import {useApiQuery} from '@/server/api'
import {GearIcon} from '@phosphor-icons/react'
import {useMutation} from '@tanstack/react-query'
import {LogOutIcon, UserCircleIcon} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {FetchError} from 'ofetch'
import {useEffect, useState} from 'react'
import {toast} from 'sonner'
import {z} from 'zod'
import {Chat} from '../chat/Chat'

export function HomePage() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({x: 50, y: 50})

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
      toast.error(error?.response?._data?.message || 'Failed to logout')
    },
  })

  const getMe = useApiQuery(['getMe'])
  const user = getMe.data?.user

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({x, y})
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-950 text-slate-50 font-sans">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_120%,rgba(8,47,73,0.4),transparent)]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,black_70%,transparent)]" />

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div
          className="absolute inset-0 transition-opacity duration-300 ease-out"
          style={{
            background: `radial-gradient(circle 600px at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.08), transparent 70%)`,
            opacity: 1,
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            background: `radial-gradient(circle 400px at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.12), transparent 60%)`,
            opacity: 1,
          }}
        />
      </div>

      <header className="relative z-30 flex items-center justify-between border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-xl px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-indigo-600 to-cyan-500 shadow-lg shadow-indigo-900/40 ring-1 ring-indigo-500/20">
            <span className="text-xl font-bold text-white">S</span>
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-white/20 to-transparent" />
          </div>

          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-300 via-sky-300 to-cyan-300">
              Skyfall AI
            </h1>
            <p className="hidden text-xs text-slate-400 md:block font-medium">
              Team Lead Assistant: Jira, calls, task decomposition
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() =>
              openOmnibar({
                command: 'addOrganization',
              })
            }
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-xs md:text-sm font-medium text-slate-200 transition-all hover:border-indigo-500/50 hover:bg-slate-900/80 hover:text-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <GearIcon size={16} className="transition-transform group-hover:rotate-90" />
            <span className="hidden sm:inline">Organization</span>
          </button>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/50 bg-slate-900/60 px-2.5 py-2 md:px-3 backdrop-blur-sm">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 via-purple-600 to-cyan-500 text-white shadow-md shadow-indigo-900/40 ring-2 ring-slate-800/50">
              <UserCircleIcon size={20} />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-500 shadow-sm" />
            </div>

            <div className="hidden min-w-0 flex-col md:flex">
              <p className="truncate text-xs font-semibold text-slate-100">
                {user ? `${user.name} ${user.surname}` : 'Loading...'}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Online</p>
            </div>

            <button
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/60 text-slate-400 transition-all hover:text-rose-400 hover:bg-slate-800/80 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              title="Logout"
            >
              <LogOutIcon size={18} />
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-10 flex flex-1 overflow-hidden">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-800/50 bg-slate-950/40 backdrop-blur-xl p-5 md:flex">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-100 mb-1">Navigation</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Here you can add a list of chats, filters or quick actions.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-800/50 bg-linear-to-br from-slate-900/60 to-slate-900/40 p-4 backdrop-blur-sm">
              <div className="mb-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Tip</p>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Send requirements, MR link or text after a meeting — the assistant will create tasks in Jira and suggest
                decomposition.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800/30 bg-slate-900/30 p-3">
              <p className="text-[11px] text-slate-500 font-medium">Quick Actions</p>
              <p className="mt-1 text-xs text-slate-400">Quick commands will appear here soon</p>
            </div>
          </div>
        </aside>

        <div className="relative flex flex-1 flex-col overflow-hidden">
          <div className="flex h-full w-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-xl px-4 py-4 md:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-slate-100">Chat with Team Lead Assistant</h2>
                  <p className="mt-0.5 text-xs text-slate-400 md:text-sm">
                    Questions about features, Jira, meetings, sprint planning
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 md:flex">
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1.5 ring-1 ring-emerald-500/30">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-400">Online</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-1 min-h-0 overflow-hidden">
              <div className="absolute inset-0">
                <Chat />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
