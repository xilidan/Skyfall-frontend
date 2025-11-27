import {createEpic, getIssuesByEpic} from '@/server/jira'
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
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to create epic'}, {status: 500})
  }
}

// GET stories for an epic
export async function GET(req: NextRequest) {
  try {
    const {searchParams} = new URL(req.url)
    const epicKey = searchParams.get('epicKey')

    if (!epicKey) {
      return NextResponse.json({error: 'epicKey query parameter is required'}, {status: 400})
    }

    const stories = await getIssuesByEpic(epicKey)
    return NextResponse.json({stories})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to get epic stories'}, {status: 500})
  }
}
