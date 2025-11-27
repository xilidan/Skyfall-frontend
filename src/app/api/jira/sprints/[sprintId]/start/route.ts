import {startSprint} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

type RouteContext = {
  params: Promise<{sprintId: string}>
}

export async function POST(req: NextRequest, {params}: RouteContext) {
  try {
    const {sprintId} = await params
    const body = await req.json()
    const {startDate, endDate} = body

    const sprint = await startSprint({
      sprintId: parseInt(sprintId, 10),
      startDate,
      endDate,
    })

    return NextResponse.json(sprint)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to start sprint'}, {status: 500})
  }
}
