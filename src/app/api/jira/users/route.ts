import {searchUsers} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const {searchParams} = new URL(req.url)
    const query = searchParams.get('query')

    const users = await searchUsers(query ?? '')
    return NextResponse.json({users})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to search users'}, {status: 500})
  }
}
