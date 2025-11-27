import {createEpic, getIssuesByEpic, listEpics} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {summary, description, labels} = body as {
      summary: string
      description?: string
      labels?: string[]
    }

    if (!summary || typeof summary !== 'string') {
      return NextResponse.json({error: 'summary is required'}, {status: 400})
    }

    const epic = await createEpic({summary, description, labels})
    return NextResponse.json(epic, {status: 201})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create epic'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}

// GET - List all epics OR get issues for a specific epic
export async function GET(req: NextRequest) {
  try {
    const {searchParams} = new URL(req.url)
    const epicKey = searchParams.get('epicKey')

    // If epicKey is provided, return issues for that epic
    if (epicKey) {
      const issues = await getIssuesByEpic(epicKey)
      return NextResponse.json({issues})
    }

    // Otherwise, return all epics
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const epics = await listEpics(limit)
    return NextResponse.json({epics})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get epics'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}
