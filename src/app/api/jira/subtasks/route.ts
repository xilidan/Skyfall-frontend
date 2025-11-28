import {createSubtask, getSubtasks} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      summary,
      description,
      parentKey,
      storyPoints,
      assigneeAccountId,
      priority,
      labels,
    } = body as {
      summary: string
      description?: string
      parentKey: string
      storyPoints?: number
      assigneeAccountId?: string
      priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'
      labels?: string[]
    }

    if (!summary || typeof summary !== 'string') {
      return NextResponse.json({error: 'summary is required'}, {status: 400})
    }

    if (!parentKey || typeof parentKey !== 'string') {
      return NextResponse.json({error: 'parentKey is required'}, {status: 400})
    }

    const subtask = await createSubtask({
      summary,
      description,
      parentKey,
      storyPoints,
      assigneeAccountId,
      priority,
      labels,
    })
    return NextResponse.json(subtask, {status: 201})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to create subtask'}, {status: 500})
  }
}

export async function GET(req: NextRequest) {
  try {
    const {searchParams} = new URL(req.url)
    const parentKey = searchParams.get('parentKey')

    if (!parentKey) {
      return NextResponse.json({error: 'parentKey query parameter is required'}, {status: 400})
    }

    const subtasks = await getSubtasks(parentKey)
    return NextResponse.json({subtasks})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to get subtasks'}, {status: 500})
  }
}

