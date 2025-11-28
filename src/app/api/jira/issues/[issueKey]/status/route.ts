import {getIssue} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

type RouteContext = {
  params: Promise<{issueKey: string}>
}

export async function GET(_req: NextRequest, {params}: RouteContext) {
  try {
    const {issueKey} = await params
    const issue = await getIssue(issueKey)

    return NextResponse.json({
      issueKey: issue.key,
      status: issue.fields.status || null,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get issue status'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}
