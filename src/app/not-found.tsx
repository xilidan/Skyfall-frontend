'use client'

import {Button} from '@/components/shadcn/button'
import {useRouter} from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 flex items-center justify-center">
      <section className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-8">
          <span className="absolute inset-0 -z-10 blur-2xl mask-[radial-gradient(closest-side,black,transparent)]">
            <span className="inline-block h-36 w-36 rounded-full bg-linear-to-tr from-blue-500/30 via-cyan-400/30 to-teal-300/30" />
          </span>
          <h1 className="text-7xl font-extrabold tracking-tight text-neutral-900 sm:text-8xl">404</h1>
        </div>

        <h2 className="mb-3 text-2xl font-semibold text-neutral-900 sm:text-3xl">Page not found</h2>
        <p className="mb-10 max-w-xl text-neutral-600">
          The page you’re looking for doesn’t exist or has been moved. Check the URL or return to the homepage.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => router.push('/')}>Go to Home</Button>

          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>

        <div className="mt-12 text-xs text-neutral-500">Error code: 404</div>
      </section>
    </main>
  )
}
