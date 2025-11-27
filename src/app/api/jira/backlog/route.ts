// app/api/jira/backlog/route.ts
import {getBacklogIssues} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const {searchParams} = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const issues = await getBacklogIssues(limit)
    return NextResponse.json({issues})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to get backlog'}, {status: 500})
  }
}

