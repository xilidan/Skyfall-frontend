// app/api/jira/sprints/[sprintId]/close/route.ts
import {closeSprint} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

type RouteContext = {
  params: Promise<{sprintId: string}>
}

export async function POST(_req: NextRequest, {params}: RouteContext) {
  try {
    const {sprintId} = await params
    const sprint = await closeSprint(parseInt(sprintId, 10))
    return NextResponse.json(sprint)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to close sprint'}, {status: 500})
  }
}

