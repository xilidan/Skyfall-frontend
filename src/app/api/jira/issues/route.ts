import {createIssue, listIssues} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const {searchParams} = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const jql = searchParams.get('jql') || undefined

    const issues = await listIssues(limit, jql)
    return NextResponse.json({issues})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to fetch Jira issues'}, {status: 500})
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      summary,
      description,
      issueTypeName,
      storyPoints,
      assigneeAccountId,
      assigneeEmail,
      priority,
      labels,
      epicLink,
      parentKey,
    } = body as {
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
    }

    if (!summary || typeof summary !== 'string') {
      return NextResponse.json({error: 'summary is required'}, {status: 400})
    }

    const issue = await createIssue({
      summary,
      description,
      issueTypeName,
      storyPoints,
      assigneeAccountId,
      assigneeEmail,
      priority,
      labels,
      epicLink,
      parentKey,
    })
    return NextResponse.json(issue, {status: 201})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to create Jira issue'}, {status: 500})
  }
}
