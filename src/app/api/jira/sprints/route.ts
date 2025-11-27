import {createSprint, listSprints} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function GET() {
  try {
    const sprints = await listSprints()
    return NextResponse.json({sprints})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to fetch sprints'}, {status: 500})
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {name, startDate, endDate} = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json({error: 'name is required'}, {status: 400})
    }

    const sprint = await createSprint({name, startDate, endDate})
    return NextResponse.json(sprint, {status: 201})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to create sprint'}, {status: 500})
  }
}
