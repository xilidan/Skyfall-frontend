'use client'

import {Button} from '@/components/shared/Button'
import {FileInput} from '@/components/shared/FileInput'
import {Select, SelectItem} from '@/components/shared/Select'
import {Tab, TabList, TabPanel, Tabs} from '@/components/shared/Tabs'
import {TextField} from '@/components/shared/TextField'
import {getApi, useApiQuery} from '@/server/api'
import {zodResolver} from '@hookform/resolvers/zod'
import {FloppyDiskIcon, PlusIcon, TrashIcon} from '@phosphor-icons/react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useEffect} from 'react'
import {Controller, useFieldArray, useForm, useWatch} from 'react-hook-form'
import {toast} from 'sonner'
import {z} from 'zod'

const positionSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  is_reviewer: z.boolean(),
})

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().optional(),
  email: z.string().email('Invalid email'),
  position_id: z.number().optional(),
  job: z.string().optional(),
})

const organizationSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  positions: z.array(positionSchema),
  users: z.array(userSchema),
  files: z.array(z.instanceof(File)).optional(),
})

type OrganizationFormValues = z.infer<typeof organizationSchema>

export function OrganizationSettings() {
  const queryClient = useQueryClient()
  const organizationQuery = useApiQuery(['getOrganization'])

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      positions: [],
      users: [],
      files: [],
    },
  })

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: {errors},
  } = form

  // Load organization data when it's fetched
  useEffect(() => {
    if (organizationQuery.data) {
      const orgData = organizationQuery.data
      reset({
        name: orgData.name || '',
        positions: orgData.positions || [],
        users: orgData.users || [],
        files: [],
      })
    }
  }, [organizationQuery.data, reset])

  const {
    fields: positionFields,
    append: appendPosition,
    remove: removePosition,
  } = useFieldArray({
    control,
    name: 'positions',
  })

  const {
    fields: userFields,
    append: appendUser,
    remove: removeUser,
  } = useFieldArray({
    control,
    name: 'users',
  })

  const positions = useWatch({control, name: 'positions'})
  const hasExistingData = !!organizationQuery.data

  const createMutation = useMutation({
    mutationFn: (data: OrganizationFormValues) =>
      getApi().createOrganization({
        name: data.name,
        positions: data.positions,
        users: data.users.map((user) => ({
          name: user.name,
          surname: user.surname,
          email: user.email,
          position_id: user.position_id,
          job: user.job,
        })),
      }),
    onSuccess: () => {
      toast.success('Organization created successfully')
      void queryClient.invalidateQueries({queryKey: ['getOrganization']})
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to create organization')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: OrganizationFormValues) =>
      getApi().updateOrganization({
        name: data.name,
        positions: data.positions,
        users: data.users.map((user) => ({
          name: user.name,
          surname: user.surname,
          email: user.email,
          position_id: user.position_id,
          job: user.job,
        })),
      }),
    onSuccess: () => {
      toast.success('Organization settings updated successfully')
      void queryClient.invalidateQueries({queryKey: ['getOrganization']})
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to update organization settings')
    },
  })

  const onSubmit = async (data: OrganizationFormValues) => {
    console.log('Form submitted with data:', data)

    // Prepare the payload - exclude files array
    const payload = {
      name: data.name,
      positions: data.positions,
      users: data.users.map((user) => ({
        name: user.name,
        surname: user.surname,
        email: user.email,
        position_id: user.position_id,
        job: user.job,
      })),
    }

    console.log('Payload to send:', payload)

    try {
      if (hasExistingData) {
        console.log('Updating organization...')
        await updateMutation.mutateAsync(data)
      } else {
        console.log('Creating organization...')
        await createMutation.mutateAsync(data)
      }
    } catch (error) {
      console.error('Submission error:', error)
      throw error
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const isLoading = organizationQuery.isLoading && !organizationQuery.isError

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading organization data...</div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log('Form validation errors:', errors)
        toast.error('Please fix form errors before submitting')
      })}
      className="flex flex-col h-full max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/60">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
            Organization Settings
          </h2>
          <p className="text-sm text-slate-400 mt-1">Manage your company profile, team structure, and personnel.</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onPress={() => {
              console.log('Form values:', form.getValues())
              console.log('Form errors:', form.formState.errors)
              console.log('Is form valid:', form.formState.isValid)
            }}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            Debug Form
          </Button>
          <Button
            type="submit"
            isDisabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20"
          >
            <FloppyDiskIcon className="mr-2 h-4 w-4" />
            {hasExistingData ? 'Update Changes' : 'Create Organization'}
          </Button>
        </div>
      </div>

      <Tabs className="flex-1 flex flex-col">
        <TabList aria-label="Settings sections" className="mb-8 border-b border-slate-800/60 w-full">
          <Tab
            id="general"
            className="px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 aria-selected:text-indigo-400 aria-selected:border-b-2 aria-selected:border-indigo-400 transition-all outline-none cursor-pointer"
          >
            General Information
          </Tab>
          <Tab
            id="team"
            className="px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 aria-selected:text-indigo-400 aria-selected:border-b-2 aria-selected:border-indigo-400 transition-all outline-none cursor-pointer"
          >
            Team & Roles
          </Tab>
        </TabList>

        <TabPanel id="general" className="space-y-8 animate-fade-in">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Company Details</h3>
                <Controller
                  control={control}
                  name="name"
                  render={({field}) => (
                    <TextField
                      {...field}
                      label="Company Name"
                      placeholder="e.g. Acme Corp"
                      errorMessage={errors.name?.message}
                      className="w-full text-white! placeholder:text-white"
                    />
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Brand Assets</h3>
                <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
                  <span className="text-sm font-medium text-slate-400 mb-2 block">Company Logo / Files</span>
                  <Controller
                    control={control}
                    name="files"
                    render={({field}) => (
                      <FileInput files={field.value || []} onSelectFiles={field.onChange} label="Upload brand assets" />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="hidden md:block p-6 rounded-2xl bg-linear-to-br from-slate-900/50 to-slate-800/20 border border-slate-800/50">
              <h4 className="text-sm font-semibold text-indigo-400 mb-2">Pro Tip</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Keeping your organization details up to date helps us personalize your experience and ensures your team
                has access to the right resources.
              </p>
            </div>
          </div>
        </TabPanel>

        <TabPanel id="team" className="space-y-10 animate-fade-in">
          {/* Positions Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-slate-200">Positions / Grades</h3>
                <p className="text-sm text-slate-500">Define the hierarchy and roles within your organization.</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onPress={() => appendPosition({id: Date.now(), name: '', is_reviewer: false})}
                className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
              >
                <PlusIcon className="mr-2 h-3 w-3" />
                Add Position
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {positionFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 transition-colors group"
                >
                  <Controller
                    control={control}
                    name={`positions.${index}.name`}
                    render={({field}) => (
                      <TextField
                        {...field}
                        placeholder="Position Name"
                        className="flex-1"
                        errorMessage={errors.positions?.[index]?.name?.message}
                      />
                    )}
                  />

                  <div className="flex items-center h-12 px-2">
                    <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
                      <input
                        type="checkbox"
                        {...register(`positions.${index}.is_reviewer`)}
                        className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/20 w-4 h-4"
                      />
                      Reviewer
                    </label>
                  </div>

                  <Button
                    variant="negative"
                    isIconOnly
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onPress={() => removePosition(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Users Section */}
          <div className="space-y-6 pt-8 border-t border-slate-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-slate-200">Team Members</h3>
                <p className="text-sm text-slate-500">Manage access and roles for your team members.</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onPress={() =>
                  appendUser({
                    name: '',
                    surname: '',
                    email: '',
                    position_id: positions[0]?.id,
                    job: '',
                  })
                }
                className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
              >
                <PlusIcon className="mr-2 h-3 w-3" />
                Add Member
              </Button>
            </div>

            <div className="space-y-4">
              {userFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 transition-colors relative group items-start"
                >
                  <div className="md:col-span-2">
                    <Controller
                      control={control}
                      name={`users.${index}.name`}
                      render={({field}) => (
                        <TextField
                          {...field}
                          placeholder="First Name"
                          label="First Name"
                          errorMessage={errors.users?.[index]?.name?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Controller
                      control={control}
                      name={`users.${index}.surname`}
                      render={({field}) => (
                        <TextField
                          {...field}
                          placeholder="Surname"
                          label="Surname"
                          errorMessage={errors.users?.[index]?.surname?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Controller
                      control={control}
                      name={`users.${index}.email`}
                      render={({field}) => (
                        <TextField
                          {...field}
                          placeholder="Email Address"
                          label="Email Address"
                          errorMessage={errors.users?.[index]?.email?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Controller
                      control={control}
                      name={`users.${index}.position_id`}
                      render={({field}) => (
                        <Select
                          items={positions.map((p) => ({id: p.id, name: p.name}))}
                          key={field.value ? String(field.value) : null}
                          onChange={(key) => {
                            const numKey = key ? Number(key) : undefined
                            field.onChange(numKey)
                          }}
                          placeholder="Select Position"
                          errorMessage={errors.users?.[index]?.position_id?.message}
                        >
                          {(item) => <SelectItem id={String(item.id)}>{item.name}</SelectItem>}
                        </Select>
                      )}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Controller
                      control={control}
                      name={`users.${index}.job`}
                      render={({field}) => (
                        <TextField
                          {...field}
                          label="Job"
                          placeholder="Job"
                          errorMessage={errors.users?.[index]?.job?.message}
                        />
                      )}
                    />
                  </div>

                  <Button
                    variant="negative"
                    isIconOnly
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-75 hover:scale-100"
                    onPress={() => removeUser(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {userFields.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-slate-800/50 rounded-xl bg-slate-900/20">
                  <p className="text-sm">No team members added yet</p>
                  <Button
                    variant="tertiary"
                    size="sm"
                    className="mt-2 text-indigo-400 hover:text-indigo-300"
                    onPress={() =>
                      appendUser({
                        name: '',
                        surname: '',
                        email: '',
                        position_id: positions[0]?.id,
                        job: '',
                      })
                    }
                  >
                    Add your first member
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </form>
  )
}
