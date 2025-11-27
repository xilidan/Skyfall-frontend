// app/api/jira/users/route.ts
import {searchUsers} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const {searchParams} = new URL(req.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json({error: 'query parameter is required'}, {status: 400})
    }

    const users = await searchUsers(query)
    return NextResponse.json({users})
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({error: error.message ?? 'Failed to search users'}, {status: 500})
  }
}

