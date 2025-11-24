import {Control, FieldValues, useFormState} from 'react-hook-form'
import {isEmpty} from 'remeda'
import {InlineAlert} from './InlineAlert'

export function FormErrors<TFieldValues extends FieldValues, TContext, TTransformedValues>({
  control,
}: {
  control: Control<TFieldValues, TContext, TTransformedValues>
}) {
  const {errors} = useFormState({control})
  if (isEmpty(errors)) {
    return null
  }

  const topLevelErrors: Record<string, {message: string}> = {}
  for (const [key, val] of Object.entries(errors)) {
    if (typeof val?.message === 'string') {
      topLevelErrors[key] = {message: val.message}
    }
  }

  if (isEmpty(topLevelErrors)) {
    return (
      <InlineAlert variant="error">
        Error submitting the form. Check your input and try again. If you need help, contact support.
      </InlineAlert>
    )
  }

  return (
    <InlineAlert variant="error">
      <ul>
        {Object.entries(topLevelErrors).map(([key, err]) => (
          <li key={key}>{err.message}</li>
        ))}
      </ul>
    </InlineAlert>
  )
}
