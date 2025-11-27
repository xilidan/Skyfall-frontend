import {getIssue, getIssuesByEpic, updateIssue} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

type RouteContext = {
  params: Promise<{epicKey: string}>
}

// GET specific epic with its issues
export async function GET(_req: NextRequest, {params}: RouteContext) {
  try {
    const {epicKey} = await params
    const epic = await getIssue(epicKey)
    const issues = await getIssuesByEpic(epicKey).catch(() => [])
    return NextResponse.json({...epic, issues})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get epic'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}

// PATCH - Add issues to epic (bulk update)
export async function PATCH(req: NextRequest, {params}: RouteContext) {
  try {
    const {epicKey} = await params
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

    // Update each issue to link it to the epic with error handling
    const results = await Promise.allSettled(
      issueKeys.map((issueKey) =>
        updateIssue(issueKey, {
          epicLink: epicKey,
        }),
      ),
    )

    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    if (failed > 0) {
      const errors = results
        .map((r, i) => {
          if (r.status === 'rejected') {
            const errorMessage = r.reason instanceof Error ? r.reason.message : String(r.reason || 'Unknown error')
            return {issueKey: issueKeys[i], error: errorMessage}
          }
          return null
        })
        .filter((e): e is {issueKey: string; error: string} => e !== null)
      return NextResponse.json(
        {
          ok: true,
          message: `Added ${successful} issue(s) to epic ${epicKey}, ${failed} failed`,
          successful,
          failed,
          errors,
        },
        {status: 207}, // 207 Multi-Status for partial success
      )
    }

    return NextResponse.json({ok: true, message: `Added ${issueKeys.length} issue(s) to epic ${epicKey}`})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add issues to epic'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}

// DELETE - Remove issues from epic (bulk update)
export async function DELETE(req: NextRequest, {params}: RouteContext) {
  try {
    const {epicKey} = await params
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

    // Update each issue to remove epic link (set to null)
    const results = await Promise.allSettled(
      issueKeys.map((issueKey) =>
        updateIssue(issueKey, {
          epicLink: null,
        }),
      ),
    )

    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    if (failed > 0) {
      const errors = results
        .map((r, i) => {
          if (r.status === 'rejected') {
            const errorMessage = r.reason instanceof Error ? r.reason.message : String(r.reason || 'Unknown error')
            return {issueKey: issueKeys[i], error: errorMessage}
          }
          return null
        })
        .filter((e): e is {issueKey: string; error: string} => e !== null)
      return NextResponse.json(
        {
          ok: true,
          message: `Removed ${successful} issue(s) from epic ${epicKey}, ${failed} failed`,
          successful,
          failed,
          errors,
        },
        {status: 207}, // 207 Multi-Status for partial success
      )
    }

    return NextResponse.json({ok: true, message: `Removed ${issueKeys.length} issue(s) from epic ${epicKey}`})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to remove issues from epic'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}
