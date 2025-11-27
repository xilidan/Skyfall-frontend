// app/api/jira/stories/route.ts
import {createStory, getIssuesByEpic} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      summary,
      description,
      storyPoints,
      epicLink,
      assigneeAccountId,
      priority,
      labels,
    } = body as {
      summary: string
      description?: string
      storyPoints?: number
      epicLink?: string
      assigneeAccountId?: string
      priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'
      labels?: string[]
    }

    if (!summary || typeof summary !== 'string') {
      return NextResponse.json({error: 'summary is required'}, {status: 400})
    }

    const story = await createStory({
      summary,
      description,
      storyPoints,
      epicLink,
      assigneeAccountId,
      priority,
      labels,
    })
    return NextResponse.json(story, {status: 201})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to create story'}, {status: 500})
  }
}

// GET stories by epic
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
    return NextResponse.json({error: error.message ?? 'Failed to get stories'}, {status: 500})
  }
}

