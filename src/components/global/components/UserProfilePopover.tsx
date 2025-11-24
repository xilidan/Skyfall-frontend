import {Button} from '@/components/shadcn/button'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/shadcn/popover'
import {tfetch} from '@/lib/tfetch'
import {makeApiQueryKey} from '@/server/api'
import {UserInfo} from '@/server/auth/types'
import {Trans} from '@lingui/react/macro'
import {HeartIcon, PowerIcon, UserIcon} from '@phosphor-icons/react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {BuildingIcon, ListIcon, Loader2Icon} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {FetchError} from 'ofetch'
import {useState} from 'react'
import {toast} from 'sonner'
import {z} from 'zod'

export function UserProfilePopover({userInfo}: {userInfo: UserInfo | null}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const logout = useMutation({
    mutationFn: () => {
      return tfetch('/api/logout', {
        method: 'POST',
        responseBodySchema: z.unknown(),
      })
    },
    onSuccess: () => {
      setIsOpen(false)
      void queryClient.invalidateQueries({queryKey: makeApiQueryKey('getMe')})
      router.refresh()
    },
    onError: (error: FetchError) => {
      toast.error(error?.response?._data?.message)
    },
  })
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button>
          <UserIcon className="size-4 text-white" />
          {/* <span className="text-sm text-white">
            {userInfo?.firstName || 'John'} {userInfo?.lastName || 'Doe'}
          </span> */}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={10} className="w-56 p-0">
        <div className="p-2">
          <div className="px-4 py-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-900">
                  {userInfo?.firstName || 'John'} {userInfo?.lastName || 'Doe'}
                </span>
                <span className="text-xs text-neutral-500">{userInfo?.email || 'john@example.com'}</span>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button
              className="w-full px-4 py-2.5 text-left hover:bg-neutral-100 transition-colors flex items-center gap-3 rounded-md"
              onClick={() => {
                router.push('/seller/profile')
                setIsOpen(false)
              }}
            >
              <UserIcon className="h-4 w-4 text-neutral-600" />
              <span className="text-sm text-neutral-700">
                <Trans>My profile</Trans>
              </span>
            </button>

            <button
              className="w-full px-4 py-2.5 text-left hover:bg-neutral-100 transition-colors flex items-center gap-3 rounded-md"
              onClick={() => {
                router.push('/seller')
                setIsOpen(false)
              }}
            >
              <ListIcon className="h-4 w-4 text-neutral-600" />
              <span className="text-sm text-neutral-700">
                <Trans>My listings</Trans>
              </span>
            </button>

            <button
              className="w-full px-4 py-2.5 text-left hover:bg-neutral-100 transition-colors flex items-center gap-3 rounded-md"
              onClick={() => {
                router.push('/seller/create-property')
                setIsOpen(false)
              }}
            >
              <BuildingIcon className="h-4 w-4 text-neutral-600" />
              <span className="text-sm text-neutral-700">
                <Trans>Create property</Trans>
              </span>
            </button>

            <button
              className="w-full px-4 py-2.5 text-left hover:bg-neutral-100 transition-colors flex items-center gap-3 rounded-md"
              onClick={() => {
                router.push('/property/favourite')
                setIsOpen(false)
              }}
            >
              <HeartIcon className="h-4 w-4 text-neutral-600" />
              <span className="text-sm text-neutral-700">
                <Trans>Favourites</Trans>
              </span>
            </button>

            <div className="border-t border-neutral-100 mt-1 pt-1">
              <button
                className="w-full px-4 py-2.5 text-left hover:bg-neutral-100 transition-colors flex items-center gap-3 text-red-600 rounded-md"
                onClick={() => {
                  logout.mutate()
                }}
              >
                {logout.isPending ? (
                  <Loader2Icon className="h-4 w-4 text-neutral-600 animate-spin" />
                ) : (
                  <PowerIcon className="h-4 w-4 text-neutral-600" />
                )}
                <span className="text-sm">
                  <Trans>Log out</Trans>
                </span>
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
