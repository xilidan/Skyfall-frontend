import {moveIssuesToSprint} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

type RouteContext = {
  params: Promise<{sprintId: string}>
}

export async function POST(req: NextRequest, {params}: RouteContext) {
  try {
    const {sprintId} = await params
    const body = await req.json()
    const {issueKeys} = body as {issueKeys: string[]}

    if (!Array.isArray(issueKeys) || issueKeys.length === 0) {
      return NextResponse.json({error: 'issueKeys array is required'}, {status: 400})
    }

    await moveIssuesToSprint({
      sprintId: parseInt(sprintId, 10),
      issueKeys,
    })

    return NextResponse.json({ok: true})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to move issues to sprint'}, {status: 500})
  }
}
