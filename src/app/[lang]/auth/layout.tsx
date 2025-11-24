import {AuthAnimation} from '@/components/auth/AuthAnimation'

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen">
      {children}

      <AuthAnimation />
    </div>
  )
}
