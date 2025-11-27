// app/api/jira/sprints/[sprintId]/report/route.ts
import {getSprintReport} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

type RouteContext = {
  params: Promise<{sprintId: string}>
}

export async function GET(_req: NextRequest, {params}: RouteContext) {
  try {
    const {sprintId} = await params
    const report = await getSprintReport(parseInt(sprintId, 10))
    return NextResponse.json(report)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to get sprint report'}, {status: 500})
  }
}

