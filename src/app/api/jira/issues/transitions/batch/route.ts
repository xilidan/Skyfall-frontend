import {transitionIssuesBatch} from '@/server/jira'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {transitions} = body as {
      transitions: Array<{
        issueKey: string
        transitionId: string
        fields?: Record<string, any>
        update?: Record<string, any[]>
      }>
    }

    if (!transitions || !Array.isArray(transitions)) {
      return NextResponse.json({error: 'transitions array is required'}, {status: 400})
    }

    if (transitions.length === 0) {
      return NextResponse.json({error: 'transitions array cannot be empty'}, {status: 400})
    }

    // Validate each transition
    for (let i = 0; i < transitions.length; i++) {
      const transition = transitions[i]
      if (!transition.issueKey || typeof transition.issueKey !== 'string') {
        return NextResponse.json(
          {error: `Transition at index ${i} is missing required field: issueKey`},
          {status: 400},
        )
      }
      if (!transition.transitionId || typeof transition.transitionId !== 'string') {
        return NextResponse.json(
          {error: `Transition at index ${i} is missing required field: transitionId`},
          {status: 400},
        )
      }
    }

    const results = await transitionIssuesBatch(transitions)
    return NextResponse.json({results}, {status: 200})
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to transition issues batch'
    console.error(error)
    return NextResponse.json({error: message}, {status: 500})
  }
}

