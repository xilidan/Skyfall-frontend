// app/api/jira/sprints/[sprintId]/close/route.ts
import {closeSprint} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

type RouteContext = {
  params: Promise<{sprintId: string}>
}

export async function POST(_req: NextRequest, {params}: RouteContext) {
  try {
    const {sprintId} = await params
    await closeSprint(parseInt(sprintId, 10))
    return NextResponse.json({ok: true})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to close sprint'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}
