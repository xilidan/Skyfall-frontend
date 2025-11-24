'use client'

import {OrganizationSettings} from '@/components/settings/OrganizationSettings'
import {CaretLeftIcon} from '@phosphor-icons/react'
import Link from 'next/link'

export default function OrganizationPage() {
  return (
    <main className="min-h-screen w-full bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="gap-2 px-4 py-2 border border-slate-800 rounded-md flex items-center text-slate-100 hover:bg-slate-800">
              <CaretLeftIcon size={16} />
              Back to Chat
            </button>
          </Link>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
          <OrganizationSettings />
        </div>
      </div>
    </main>
  )
}
