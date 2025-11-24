import {Url} from 'next/dist/shared/lib/router/router'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

export function Redirect({url, children}: {url: Url; children: React.ReactNode}) {
  const router = useRouter()
  useEffect(() => {
    void router.replace(url)
  }, [router, url])
  return <>{children}</>
}
