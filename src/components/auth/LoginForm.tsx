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
import {useRouter} from 'next/navigation'
import {FetchError} from 'ofetch'
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
        maxAge: 60 * 60 * 5, // 5 hours
      })
      router.push(`/`)
      void queryClient.invalidateQueries({queryKey: makeApiQueryKey('getMe')})
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
      <motion.div
        initial={{opacity: 0, scale: 0.9, y: 20}}
        animate={{opacity: 1, scale: 1, y: 0}}
        transition={{
          duration: 0.5,
          type: 'spring',
          stiffness: 100,
          damping: 15,
        }}
        className="w-full max-w-md"
      >
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
          whileHover={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          }}
          transition={{duration: 0.2}}
        >
          <Form
            onSubmit={form.handleSubmit((values) => {
              loginMutation.mutate(values as {email: string; password: string})
            })}
            className={twMerge(
              'space-y-6',
              form.formState.isValidating && loginMutation.isPending && 'pointer-events-none opacity-50',
            )}
          >
            <motion.div
              initial={{opacity: 0, y: -10}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.1, duration: 0.5}}
              className="text-center space-y-2"
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center"
                whileHover={{rotate: 360, scale: 1.1}}
                transition={{duration: 0.6}}
              >
                <User2 className="size-8 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                <Trans>Welcome Back</Trans>
              </h1>

              <p className="text-gray-500">
                <Trans>Enter your credentials to access your account</Trans>
              </p>
            </motion.div>

            <div className="space-y-4">
              <motion.div
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: 0.2, duration: 0.5}}
              >
                <Controller
                  control={form.control}
                  name="email"
                  render={({field, fieldState}) => (
                    <div className="transform transition-transform duration-200 focus-within:scale-[1.02]">
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
                    </div>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: 0.3, duration: 0.5}}
              >
                <Controller
                  control={form.control}
                  name="password"
                  render={({field, fieldState}) => (
                    <div className="transform transition-transform duration-200 focus-within:scale-[1.02]">
                      <PasswordField
                        {...field}
                        isInvalid={fieldState.invalid}
                        className="w-full"
                        errorMessage={fieldState.error?.message}
                        validationBehavior="aria"
                        label={<Trans>Password</Trans>}
                        autoComplete="current-password"
                      />
                    </div>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.4, duration: 0.5}}
              >
                <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} transition={{duration: 0.1}}>
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    isLoading={form.formState.isValidating || loginMutation.isPending}
                    className="w-full h-12"
                  >
                    <Trans>Sign in</Trans>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5, duration: 0.5}}
              className="text-center text-sm text-gray-500"
            >
              <Trans>Don&apos;t have an account?</Trans>{' '}
              <motion.a
                href="/auth/registration"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                whileHover={{scale: 1.05}}
                transition={{duration: 0.1}}
              >
                <Trans>Sign up</Trans>
              </motion.a>
            </motion.div>
          </Form>
        </motion.div>
      </motion.div>
    </div>
  )
}
