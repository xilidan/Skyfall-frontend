import {moveIssuesToBacklog} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {issueKeys} = body as {issueKeys: string[]}

    if (!Array.isArray(issueKeys) || issueKeys.length === 0) {
      return NextResponse.json({error: 'issueKeys array is required'}, {status: 400})
    }

    await moveIssuesToBacklog(issueKeys)

    return NextResponse.json({ok: true})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to move issues to backlog'}, {status: 500})
  }
}
