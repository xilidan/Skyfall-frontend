// app/api/jira/issues/[issueKey]/transitions/route.ts
import {getIssueTransitions, transitionIssue} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

import {z} from 'zod'

type RouteContext = {
  params: Promise<{issueKey: string}>
}

export async function GET(_req: NextRequest, {params}: RouteContext) {
  try {
    const {issueKey} = await params
    const transitions = await getIssueTransitions(issueKey)
    return NextResponse.json({transitions})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to get issue transitions'}, {status: 500})
  }
}

const transitionSchema = z.object({
  transitionId: z.string(),
  fields: z.record(z.string(), z.any()).optional(),
  update: z.record(z.string(), z.array(z.any())).optional(),
})

export async function POST(req: NextRequest, {params}: RouteContext) {
  try {
    const {issueKey} = await params
    const json = await req.json()

    const result = transitionSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json({error: result.error.issues}, {status: 400})
    }

    const {transitionId, fields, update} = result.data

    await transitionIssue(issueKey, transitionId, {
      fields,
      update: update as Record<string, any[]> | undefined,
    })
    return NextResponse.json({ok: true})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to transition issue'}, {status: 500})
  }
}
