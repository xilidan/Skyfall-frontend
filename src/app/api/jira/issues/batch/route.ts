import {createIssuesBatch} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {issues} = body as {
      issues: Array<{
        summary: string
        description?: string
        issueTypeName?: string
        storyPoints?: number
        assigneeAccountId?: string
        assigneeEmail?: string
        priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'
        labels?: string[]
        epicLink?: string
        parentKey?: string
      }>
    }

    if (!issues || !Array.isArray(issues)) {
      return NextResponse.json({error: 'issues array is required'}, {status: 400})
    }

    if (issues.length === 0) {
      return NextResponse.json({error: 'issues array cannot be empty'}, {status: 400})
    }

    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i]
      if (!issue.summary || typeof issue.summary !== 'string') {
        return NextResponse.json({error: `Issue at index ${i} is missing required field: summary`}, {status: 400})
      }
    }

    const results = await createIssuesBatch(issues)
    return NextResponse.json({results}, {status: 201})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create issues batch'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}
