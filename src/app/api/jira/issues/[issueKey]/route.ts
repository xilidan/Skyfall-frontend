import {deleteIssue, getIssue, getSubtasks, updateIssue} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

type RouteContext = {
  params: Promise<{issueKey: string}>
}

export async function GET(_req: NextRequest, {params}: RouteContext) {
  try {
    const {issueKey} = await params
    const issue = await getIssue(issueKey)
    const subtasks = await getSubtasks(issueKey).catch(() => [])
    return NextResponse.json({...issue, subtasks})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get Jira issue'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}

export async function PATCH(req: NextRequest, {params}: RouteContext) {
  try {
    const {issueKey} = await params
    const body = await req.json()
    const {summary, description, storyPoints, assigneeAccountId, assigneeEmail, priority, labels, epicLink} = body as {
      summary?: string
      description?: string
      storyPoints?: number
      assigneeAccountId?: string | null
      assigneeEmail?: string
      priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'
      labels?: string[]
      epicLink?: string | null
    }

    const hasUpdates =
      summary !== undefined ||
      description !== undefined ||
      storyPoints !== undefined ||
      assigneeAccountId !== undefined ||
      assigneeEmail !== undefined ||
      priority !== undefined ||
      labels !== undefined ||
      epicLink !== undefined

    if (!hasUpdates) {
      return NextResponse.json({error: 'Nothing to update'}, {status: 400})
    }

    await updateIssue(issueKey, {
      summary,
      description,
      storyPoints,
      assigneeAccountId,
      assigneeEmail,
      priority,
      labels,
      epicLink,
    })
    return NextResponse.json({ok: true})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update Jira issue'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}

export async function DELETE(_req: NextRequest, {params}: RouteContext) {
  try {
    const {issueKey} = await params
    await deleteIssue(issueKey)
    return NextResponse.json({ok: true})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete Jira issue'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}
