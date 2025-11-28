'use client'
import {Button} from '@/components/shadcn/button'
import {PasswordField} from '@/components/shared/PasswordField'
import {TextField} from '@/components/shared/TextField'
import {zodResolver} from '@/lib/form'
import {getApi, makeApiQueryKey} from '@/server/api'
import {Trans, useLingui} from '@lingui/react/macro'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {setCookie} from 'cookies-next/client'
import {motion} from 'framer-motion'
import {User2} from 'lucide-react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {FetchError} from 'ofetch'
import {useEffect, useState} from 'react'
import {Form} from 'react-aria-components'
import {Controller, useForm} from 'react-hook-form'
import {toast} from 'sonner'
import {twMerge} from 'tailwind-merge'
import {z} from 'zod'

export function LoginForm() {
  const {t} = useLingui()
  const router = useRouter()
  const api = getApi()
  const queryClient = useQueryClient()
  const [mousePosition, setMousePosition] = useState({x: 50, y: 50})

  const form = useForm({
    criteriaMode: 'all',
    resolver: zodResolver(
      z.object({
        email: z.email(t`Invalid email.`),
        password: z.string().min(1, t`Enter your password.`),
      }),
    ),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationFn: (values: {email: string; password: string}) => api.login(values),
    onError: (error: FetchError) => {
      switch (error.data?.message) {
        case 'User not found':
          toast.error(t`User not found.`, {position: 'top-center'})
          break
        case 'Invalid password':
          toast.error(t`Invalid password.`, {position: 'top-center'})
          break
        default:
          toast.error(t`An unexpected error occurred.`, {position: 'top-center'})
      }
    },
    onSuccess: (data) => {
      setCookie('accessToken', data.token, {
        maxAge: 60 * 60 * 5,
      })
      void queryClient.invalidateQueries({queryKey: makeApiQueryKey('getMe')})
      router.push(`/`)
    },
  })

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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
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

      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4}}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/60 p-8">
          <Form
            onSubmit={form.handleSubmit((values) => {
              loginMutation.mutate(values as {email: string; password: string})
            })}
            className={twMerge(
              'space-y-6',
              form.formState.isValidating && loginMutation.isPending && 'pointer-events-none opacity-50',
            )}
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-900/20">
                <User2 className="size-8 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
                <Trans>Welcome Back</Trans>
              </h1>

              <p className="text-slate-400 text-sm">
                <Trans>Enter your credentials to access your account</Trans>
              </p>
            </div>

            <div className="space-y-4">
              <Controller
                control={form.control}
                name="email"
                render={({field, fieldState}) => (
                  <TextField
                    {...field}
                    isInvalid={fieldState.invalid}
                    errorMessage={fieldState.error?.message}
                    validationBehavior="aria"
                    onChange={(v) => {
                      field.onChange(v)
                    }}
                    className="w-full"
                    label={<Trans>Email</Trans>}
                    type="email"
                    autoComplete="email"
                  />
                )}
              />

              <Controller
                control={form.control}
                name="password"
                render={({field, fieldState}) => (
                  <PasswordField
                    {...field}
                    isInvalid={fieldState.invalid}
                    className="w-full"
                    errorMessage={fieldState.error?.message}
                    validationBehavior="aria"
                    label={<Trans>Password</Trans>}
                    autoComplete="current-password"
                  />
                )}
              />

              <Button
                type="submit"
                disabled={!form.formState.isValid}
                isLoading={form.formState.isValidating || loginMutation.isPending}
                className="w-full h-12 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-900/20"
              >
                <Trans>Sign in</Trans>
              </Button>
            </div>

            <div className="text-center text-sm text-slate-400">
              <Trans>Don&apos;t have an account?</Trans>{' '}
              <Link
                href="/auth/registration"
                className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-colors"
              >
                <Trans>Sign up</Trans>
              </Link>
            </div>
          </Form>
        </div>
      </motion.div>
    </div>
  )
}
