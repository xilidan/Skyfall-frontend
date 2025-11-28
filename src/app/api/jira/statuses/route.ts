import {getAllStatuses, getProjectStatuses} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const {searchParams} = new URL(req.url)
    const projectKey = searchParams.get('projectKey')
    const grouped = searchParams.get('grouped') === 'true'

    if (projectKey || grouped) {
      const statuses = await getProjectStatuses(projectKey || undefined)
      return NextResponse.json({statuses, grouped: true})
    }
    const statuses = await getAllStatuses()
    return NextResponse.json({statuses, grouped: false})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get statuses'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}
