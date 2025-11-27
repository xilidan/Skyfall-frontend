import {getSprintIssues, moveIssuesToBacklog, moveIssuesToSprint} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

type RouteContext = {
  params: Promise<{sprintId: string}>
}

// GET - Get all issues in a sprint
export async function GET(_req: NextRequest, {params}: RouteContext) {
  try {
    const {sprintId} = await params
    const sprintIdNum = parseInt(sprintId, 10)

    if (isNaN(sprintIdNum)) {
      return NextResponse.json({error: 'Invalid sprintId'}, {status: 400})
    }

    const issues = await getSprintIssues(sprintIdNum)
    return NextResponse.json({issues})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get sprint issues'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}

// POST - Move issues to sprint (including epics)
export async function POST(req: NextRequest, {params}: RouteContext) {
  try {
    const {sprintId} = await params
    const body = await req.json()
    const {issueKeys} = body as {issueKeys: string[]}

    if (!Array.isArray(issueKeys) || issueKeys.length === 0) {
      return NextResponse.json({error: 'issueKeys array is required'}, {status: 400})
    }

    // Validate issue keys
    for (const issueKey of issueKeys) {
      if (!issueKey || typeof issueKey !== 'string') {
        return NextResponse.json({error: 'All issueKeys must be non-empty strings'}, {status: 400})
      }
    }

    const sprintIdNum = parseInt(sprintId, 10)
    if (isNaN(sprintIdNum)) {
      return NextResponse.json({error: 'Invalid sprintId'}, {status: 400})
    }

    await moveIssuesToSprint({
      sprintId: sprintIdNum,
      issueKeys,
    })

    return NextResponse.json({ok: true, message: `Moved ${issueKeys.length} issue(s) to sprint ${sprintId}`})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to move issues to sprint'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}

// DELETE - Remove issues from sprint (move to backlog)
export async function DELETE(req: NextRequest, {params}: RouteContext) {
  try {
    const {sprintId} = await params
    const body = await req.json()
    const {issueKeys} = body as {issueKeys: string[]}

    if (!Array.isArray(issueKeys) || issueKeys.length === 0) {
      return NextResponse.json({error: 'issueKeys array is required'}, {status: 400})
    }

    // Validate issue keys
    for (const issueKey of issueKeys) {
      if (!issueKey || typeof issueKey !== 'string') {
        return NextResponse.json({error: 'All issueKeys must be non-empty strings'}, {status: 400})
      }
    }

    // Move issues to backlog (removes them from sprint)
    await moveIssuesToBacklog(issueKeys)

    return NextResponse.json({
      ok: true,
      message: `Removed ${issueKeys.length} issue(s) from sprint ${sprintId} and moved to backlog`,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to remove issues from sprint'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}
