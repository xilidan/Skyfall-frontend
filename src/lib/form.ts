import {zodResolver as _zodResolver} from '@hookform/resolvers/zod'
import type {FieldValues, Resolver} from 'react-hook-form'
import type {z} from 'zod'

// Fixes https://github.com/react-hook-form/resolvers/issues/551
// TODO: Use directly once https://github.com/react-hook-form/resolvers/pull/653 is merged
export function zodResolver<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  schemaOptions?: Parameters<typeof _zodResolver>[1],
  factoryOptions?: Parameters<typeof _zodResolver>[2],
): Resolver<z.infer<TSchema> & FieldValues> {
  return _zodResolver(
    schema as unknown as Parameters<typeof _zodResolver>[0],
    schemaOptions as any,
    factoryOptions as any,
  ) as unknown as Resolver<z.infer<TSchema> & FieldValues>
}
