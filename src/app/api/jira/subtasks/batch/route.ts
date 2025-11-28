import {createSubtasksBatch} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {subtasks} = body as {
      subtasks: Array<{
        summary: string
        description?: string
        parentKey: string
        storyPoints?: number
        assigneeAccountId?: string
        priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'
        labels?: string[]
      }>
    }

    if (!subtasks || !Array.isArray(subtasks)) {
      return NextResponse.json({error: 'subtasks array is required'}, {status: 400})
    }

    if (subtasks.length === 0) {
      return NextResponse.json({error: 'subtasks array cannot be empty'}, {status: 400})
    }

    for (let i = 0; i < subtasks.length; i++) {
      const subtask = subtasks[i]
      if (!subtask.summary || typeof subtask.summary !== 'string') {
        return NextResponse.json({error: `Subtask at index ${i} is missing required field: summary`}, {status: 400})
      }
      if (!subtask.parentKey || typeof subtask.parentKey !== 'string') {
        return NextResponse.json({error: `Subtask at index ${i} is missing required field: parentKey`}, {status: 400})
      }
    }

    const results = await createSubtasksBatch(subtasks)
    return NextResponse.json({results}, {status: 201})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create subtasks batch'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}
