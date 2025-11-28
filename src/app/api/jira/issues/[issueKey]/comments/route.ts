import {addComment, getComments} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

type RouteContext = {
  params: Promise<{issueKey: string}>
}

export async function GET(_req: NextRequest, {params}: RouteContext) {
  try {
    const {issueKey} = await params
    const comments = await getComments(issueKey)
    return NextResponse.json({comments})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      {error: error.message ?? 'Failed to get issue comments'},
      {status: 500},
    )
  }
}

export async function POST(req: NextRequest, {params}: RouteContext) {
  try {
    const {issueKey} = await params
    const body = await req.json()
    const {comment} = body as {comment: string}

    if (!comment || typeof comment !== 'string') {
      return NextResponse.json({error: 'comment is required'}, {status: 400})
    }

    const newComment = await addComment(issueKey, comment)
    return NextResponse.json(newComment, {status: 201})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      {error: error.message ?? 'Failed to add comment'},
      {status: 500},
    )
  }
}

