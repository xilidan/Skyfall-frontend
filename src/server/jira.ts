import 'server-only'

const JIRA_BASE_URL = process.env.JIRA_BASE_URL
const JIRA_EMAIL = process.env.JIRA_EMAIL
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
  throw new Error('Missing Jira env vars. Check JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY.')
}

const AUTH_HEADER = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')

async function jiraFetch<T = any>(path: string, init: RequestInit = {}, api = 'api/3'): Promise<T> {
  const res = await fetch(`${JIRA_BASE_URL}/rest/${api}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: AUTH_HEADER,
      ...(init.headers || {}),
    },
    cache: 'no-store',
  })

  const text = await res.text()
  const data = text ? (JSON.parse(text) as T) : (null as any)

  if (!res.ok) {
    console.error('Jira API error', res.status, data)
    throw new Error(`Jira API error ${res.status}: ${JSON.stringify(data)}`)
  }

  return data
}

export type JiraIssue = {
  id: string
  key: string
  fields: {
    summary: string
    description?: string | any // Can be ADF format
    status?: {name: string; id: string}
    issuetype?: {name: string; id: string}
    assignee?: {accountId: string; displayName: string; emailAddress?: string} | null
    reporter?: {accountId: string; displayName: string; emailAddress?: string}
    priority?: {name: string; id: string}
    labels?: string[]
    storyPoints?: number
    parent?: {key: string; id: string; fields: {summary: string}}
    epicLink?: string
    customfield_10016?: number // Story points field (varies by Jira instance)
    duedate?: string
    [key: string]: any // Allow additional fields
  }
}

export type JiraSearchResponse = {
  issues: JiraIssue[]
}

// Helper to convert text to ADF format
function textToADF(text: string): any {
  return {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: text,
          },
        ],
      },
    ],
  }
}

export async function createIssue(params: {
  summary: string
  description?: string
  issueTypeName?: string
  storyPoints?: number
  assigneeAccountId?: string
  assigneeEmail?: string
  priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'
  labels?: string[]
  epicLink?: string
  parentKey?: string
  dueDate?: string
}): Promise<JiraIssue> {
  const {
    summary,
    description,
    issueTypeName = 'Task',
    storyPoints,
    assigneeAccountId,
    assigneeEmail,
    priority,
    labels,
    epicLink,
    parentKey,
    dueDate,
  } = params

  let finalAccountId = assigneeAccountId
  if (assigneeEmail && !finalAccountId) {
    const users = await searchUsers(assigneeEmail)
    if (users.length > 0) {
      finalAccountId = users[0].accountId
    }
  }

  const body: any = {
    fields: {
      project: {key: JIRA_PROJECT_KEY},
      summary,
      issuetype: {name: issueTypeName},
    },
  }

  // Convert description to Atlassian Document Format (ADF)
  if (description) {
    body.fields.description = textToADF(description)
  }

  // Story points (customfield_10016 is common, but may vary)
  if (storyPoints !== undefined) {
    body.fields.customfield_10016 = storyPoints
  }

  // Assignee
  if (finalAccountId) {
    body.fields.assignee = {accountId: finalAccountId}
  }

  // Priority
  if (priority) {
    body.fields.priority = {name: priority}
  }

  // Labels
  if (labels && labels.length > 0) {
    body.fields.labels = labels
  }

  // Epic link
  if (epicLink) {
    body.fields.customfield_10014 = epicLink // Epic Link field
  }

  // Parent (for subtasks)
  if (parentKey) {
    body.fields.parent = {key: parentKey}
  }

  // Due date
  if (dueDate) {
    body.fields.duedate = dueDate
  }

  return jiraFetch<JiraIssue>('/issue', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// Batch issue creation
export type BatchIssueResult = {
  success: boolean
  issue?: JiraIssue
  error?: string
  index: number
}

export async function createIssuesBatch(
  items: Array<{
    summary: string
    description?: string
    issueTypeName?: string
    storyPoints?: number
    assigneeAccountId?: string
    assigneeEmail?: string
    priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'
    labels?: string[]
    epicLink?: string
    parentKey?: string
  }>,
): Promise<BatchIssueResult[]> {
  const results: BatchIssueResult[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    try {
      const issue = await createIssue({
        summary: item.summary,
        description: item.description,
        issueTypeName: item.issueTypeName,
        storyPoints: item.storyPoints,
        assigneeAccountId: item.assigneeAccountId,
        assigneeEmail: item.assigneeEmail,
        priority: item.priority,
        labels: item.labels,
        epicLink: item.epicLink,
        parentKey: item.parentKey,
      })
      results.push({
        success: true,
        issue,
        index: i,
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create issue'
      results.push({
        success: false,
        error: message,
        index: i,
      })
    }
  }

  return results
}

export async function listIssues(limit = 20, jql?: string): Promise<JiraIssue[]> {
  const defaultJql = `project = "${JIRA_PROJECT_KEY}" ORDER BY created DESC`
  const search = await jiraFetch<JiraSearchResponse>('/search/jql', {
    method: 'POST',
    body: JSON.stringify({
      jql: jql || defaultJql,
      maxResults: limit,
      fields: [
        'key',
        'summary',
        'description',
        'status',
        'issuetype',
        'assignee',
        'priority',
        'labels',
        'customfield_10016', // Story points
        'parent',
        'customfield_10014', // Epic Link
        'duedate',
      ],
    }),
  })
  return search.issues
}

export async function getIssue(issueKey: string): Promise<JiraIssue> {
  return jiraFetch<JiraIssue>(`/issue/${encodeURIComponent(issueKey)}`)
}

export async function updateIssue(
  issueKey: string,
  fields: {
    summary?: string
    description?: string
    storyPoints?: number
    assigneeAccountId?: string | null
    assigneeEmail?: string
    priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'
    labels?: string[]
    epicLink?: string | null
  },
): Promise<void> {
  const body: {fields: Record<string, unknown>} = {fields: {}}

  if (fields.summary !== undefined) {
    body.fields.summary = fields.summary
  }
  if (fields.description !== undefined) {
    body.fields.description = textToADF(fields.description)
  }
  if (fields.storyPoints !== undefined) {
    body.fields.customfield_10016 = fields.storyPoints
  }

  if (fields.assigneeAccountId !== undefined) {
    body.fields.assignee = fields.assigneeAccountId ? {accountId: fields.assigneeAccountId} : null
  } else if (fields.assigneeEmail) {
    const users = await searchUsers(fields.assigneeEmail)
    if (users.length > 0) {
      body.fields.assignee = {accountId: users[0].accountId}
    }
  }

  if (fields.priority !== undefined) {
    body.fields.priority = {name: fields.priority}
  }
  if (fields.labels !== undefined) {
    body.fields.labels = fields.labels
  }
  if (fields.epicLink !== undefined) {
    // Set to null to remove epic link, or to a string to set it
    body.fields.customfield_10014 = fields.epicLink === null ? null : fields.epicLink
  }

  await jiraFetch<void>(`/issue/${encodeURIComponent(issueKey)}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

// D: Delete issue
export async function deleteIssue(issueKey: string): Promise<void> {
  await jiraFetch<void>(`/issue/${encodeURIComponent(issueKey)}`, {
    method: 'DELETE',
  })
}

// Epic functionality
export async function createEpic(params: {
  summary: string
  description?: string
  labels?: string[]
}): Promise<JiraIssue> {
  const body: any = {
    fields: {
      project: {key: JIRA_PROJECT_KEY},
      summary: params.summary,
      issuetype: {name: 'Epic'},
      // Note: Epic Name field (customfield_10011) is not set here as it may not be
      // available on the create screen. Jira typically auto-populates it from summary.
    },
  }

  // Convert description to Atlassian Document Format (ADF)
  if (params.description) {
    body.fields.description = textToADF(params.description)
  }

  // Labels
  if (params.labels && params.labels.length > 0) {
    body.fields.labels = params.labels
  }

  return jiraFetch<JiraIssue>('/issue', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// Story functionality
export async function createStory(params: {
  summary: string
  description?: string
  storyPoints?: number
  epicLink?: string
  assigneeAccountId?: string
  priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'
  labels?: string[]
}): Promise<JiraIssue> {
  return createIssue({
    ...params,
    issueTypeName: 'Story',
  })
}

// Subtask functionality
export async function createSubtask(params: {
  summary: string
  description?: string
  parentKey: string
  storyPoints?: number
  assigneeAccountId?: string
  priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'
  labels?: string[]
}): Promise<JiraIssue> {
  return createIssue({
    ...params,
    issueTypeName: 'Subtask',
  })
}

// Batch subtask creation
export type BatchSubtaskResult = {
  success: boolean
  subtask?: JiraIssue
  error?: string
  index: number
}

export async function createSubtasksBatch(
  items: Array<{
    summary: string
    description?: string
    parentKey: string
    storyPoints?: number
    assigneeAccountId?: string
    priority?: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'
    labels?: string[]
  }>,
): Promise<BatchSubtaskResult[]> {
  const results: BatchSubtaskResult[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    try {
      const subtask = await createSubtask({
        summary: item.summary,
        description: item.description,
        parentKey: item.parentKey,
        storyPoints: item.storyPoints,
        assigneeAccountId: item.assigneeAccountId,
        priority: item.priority,
        labels: item.labels,
      })
      results.push({
        success: true,
        subtask,
        index: i,
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create subtask'
      results.push({
        success: false,
        error: message,
        index: i,
      })
    }
  }

  return results
}

// Get issue transitions (available status changes)
export type JiraTransition = {
  id: string
  name: string
  to: {id: string; name: string}
}

export async function getIssueTransitions(issueKey: string): Promise<JiraTransition[]> {
  const response = await jiraFetch<{transitions: JiraTransition[]}>(
    `/issue/${encodeURIComponent(issueKey)}/transitions`,
  )
  return response.transitions
}

// Transition issue (change status)
export async function transitionIssue(
  issueKey: string,
  transitionId: string,
  options?: {
    fields?: Record<string, any>
    update?: Record<string, any[]>
  },
): Promise<void> {
  const body: any = {
    transition: {id: transitionId},
  }

  if (options?.fields) {
    body.fields = options.fields
  }

  if (options?.update) {
    body.update = options.update
  }

  await jiraFetch<void>(`/issue/${encodeURIComponent(issueKey)}/transitions`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// Batch transition issues (change status of multiple issues)
export type BatchTransitionResult = {
  success: boolean
  issueKey: string
  error?: string
  index: number
}

export async function transitionIssuesBatch(
  items: Array<{
    issueKey: string
    transitionId: string
    fields?: Record<string, any>
    update?: Record<string, any[]>
  }>,
): Promise<BatchTransitionResult[]> {
  const results: BatchTransitionResult[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    try {
      await transitionIssue(item.issueKey, item.transitionId, {
        fields: item.fields,
        update: item.update,
      })
      results.push({
        success: true,
        issueKey: item.issueKey,
        index: i,
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to transition issue'
      results.push({
        success: false,
        issueKey: item.issueKey,
        error: message,
        index: i,
      })
    }
  }

  return results
}

// Add comment to issue
export type JiraComment = {
  id: string
  body: string | any
  author: {accountId: string; displayName: string}
  created: string
}

export async function addComment(issueKey: string, comment: string): Promise<JiraComment> {
  return jiraFetch<JiraComment>(`/issue/${encodeURIComponent(issueKey)}/comment`, {
    method: 'POST',
    body: JSON.stringify({
      body: textToADF(comment),
    }),
  })
}

// Get comments for an issue
export async function getComments(issueKey: string): Promise<JiraComment[]> {
  const response = await jiraFetch<{comments: JiraComment[]}>(`/issue/${encodeURIComponent(issueKey)}/comment`)
  return response.comments
}

// Get backlog issues (not in any sprint)
export async function getBacklogIssues(limit = 50): Promise<JiraIssue[]> {
  const jql = `project = "${JIRA_PROJECT_KEY}" AND sprint IS EMPTY ORDER BY priority DESC, created DESC`
  return listIssues(limit, jql)
}

// Get issues by epic
export async function getIssuesByEpic(epicKey: string): Promise<JiraIssue[]> {
  // JQL syntax: Epic Link field requires the epic key value
  const jql = `"Epic Link" = ${epicKey} ORDER BY priority DESC, created DESC`
  return listIssues(100, jql)
}

// List all epics
export async function listEpics(limit = 50): Promise<JiraIssue[]> {
  const jql = `project = "${JIRA_PROJECT_KEY}" AND issuetype = Epic ORDER BY created DESC`
  return listIssues(limit, jql)
}

// Get subtasks of an issue
export async function getSubtasks(parentKey: string): Promise<JiraIssue[]> {
  const jql = `parent = ${parentKey} ORDER BY created DESC`
  return listIssues(100, jql)
}

// Sprint types
export type JiraSprint = {
  id: number
  state: 'active' | 'closed' | 'future'
  name: string
  startDate?: string
  endDate?: string
  completeDate?: string
  originBoardId: number
}

export type JiraBoard = {
  id: number
  name: string
  type: string
}

// Get project's board (needed for sprint operations)
async function getProjectBoard(): Promise<JiraBoard> {
  const response = await jiraFetch<{values: JiraBoard[]}>(`/board?projectKeyOrId=${JIRA_PROJECT_KEY}`, {}, 'agile/1.0')
  if (!response.values || response.values.length === 0) {
    throw new Error(`No board found for project ${JIRA_PROJECT_KEY}`)
  }
  return response.values[0]
}

// List all sprints for the project
export async function listSprints(): Promise<JiraSprint[]> {
  const board = await getProjectBoard()
  const response = await jiraFetch<{values: JiraSprint[]}>(`/board/${board.id}/sprint`, {}, 'agile/1.0')
  return response.values || []
}

// Create a new sprint
export async function createSprint(params: {name: string; startDate?: string; endDate?: string}): Promise<JiraSprint> {
  const board = await getProjectBoard()

  const body: any = {
    name: params.name,
    originBoardId: board.id,
  }

  if (params.startDate) {
    body.startDate = params.startDate
  }
  if (params.endDate) {
    body.endDate = params.endDate
  }

  return jiraFetch<JiraSprint>(
    '/sprint',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    'agile/1.0',
  )
}

// Start a sprint
export async function startSprint(params: {
  sprintId: number
  startDate?: string
  endDate?: string
}): Promise<JiraSprint> {
  const body: any = {
    state: 'active',
  }

  if (params.startDate) {
    body.startDate = params.startDate
  }
  if (params.endDate) {
    body.endDate = params.endDate
  }

  return jiraFetch<JiraSprint>(
    `/sprint/${params.sprintId}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    'agile/1.0',
  )
}

// Move issues to sprint
export async function moveIssuesToSprint(params: {sprintId: number; issueKeys: string[]}): Promise<void> {
  await jiraFetch<void>(
    `/sprint/${params.sprintId}/issue`,
    {
      method: 'POST',
      body: JSON.stringify({
        issues: params.issueKeys,
      }),
    },
    'agile/1.0',
  )
}

// Move issues to backlog
export async function moveIssuesToBacklog(issueKeys: string[]): Promise<void> {
  await jiraFetch<void>(
    '/backlog/issue',
    {
      method: 'POST',
      body: JSON.stringify({
        issues: issueKeys,
      }),
    },
    'agile/1.0',
  )
}

// Get active sprint
export async function getActiveSprint(): Promise<JiraSprint | null> {
  const sprints = await listSprints()
  return sprints.find((s) => s.state === 'active') || null
}

// Close sprint
export async function closeSprint(sprintId: number): Promise<JiraSprint> {
  return jiraFetch<JiraSprint>(
    `/sprint/${sprintId}`,
    {
      method: 'POST',
      body: JSON.stringify({
        state: 'closed',
      }),
    },
    'agile/1.0',
  )
}

// Get sprint issues
export async function getSprintIssues(sprintId: number): Promise<JiraIssue[]> {
  const jql = `sprint = ${sprintId} ORDER BY priority DESC, created DESC`
  return listIssues(100, jql)
}

// Get sprint report/statistics
export type SprintReport = {
  sprint: JiraSprint
  totalIssues: number
  completedIssues: number
  totalStoryPoints: number
  completedStoryPoints: number
  issues: JiraIssue[]
}

export async function getSprintReport(sprintId: number): Promise<SprintReport> {
  const sprint = await jiraFetch<JiraSprint>(`/sprint/${sprintId}`)
  const issues = await getSprintIssues(sprintId)

  const completedStatuses = ['Done', 'Closed', 'Resolved']
  const completedIssues = issues.filter((issue) => completedStatuses.includes(issue.fields.status?.name || ''))

  const totalStoryPoints = issues.reduce(
    (sum, issue) => sum + (issue.fields.customfield_10016 || issue.fields.storyPoints || 0),
    0,
  )
  const completedStoryPoints = completedIssues.reduce(
    (sum, issue) => sum + (issue.fields.customfield_10016 || issue.fields.storyPoints || 0),
    0,
  )

  return {
    sprint,
    totalIssues: issues.length,
    completedIssues: completedIssues.length,
    totalStoryPoints,
    completedStoryPoints,
    issues,
  }
}

// Search users (for assignee)
export type JiraUser = {
  accountId: string
  displayName: string
  emailAddress?: string
}

export async function searchUsers(query: string): Promise<JiraUser[]> {
  const response = await jiraFetch<JiraUser[]>(`/user/search?query=${encodeURIComponent(query)}`)
  return response
}

// Status types
export type JiraStatus = {
  id: string
  name: string
  description?: string
  iconUrl?: string
  statusCategory?: {
    id: number
    key: string
    colorName: string
    name: string
  }
}

export type ProjectStatuses = {
  self: string
  id: string
  name: string
  subtask: boolean
  statuses: Array<{
    self: string
    description: string
    iconUrl: string
    name: string
    id: string
    statusCategory: {
      self: string
      id: number
      key: string
      colorName: string
      name: string
    }
  }>
}

// Get all statuses in the Jira instance
export async function getAllStatuses(): Promise<JiraStatus[]> {
  // Using API v2 for status endpoint as v3 doesn't have a direct all-statuses endpoint
  return jiraFetch<JiraStatus[]>('/status', {}, 'api/2')
}

// Get statuses for a specific project (grouped by issue type)
export async function getProjectStatuses(projectKey?: string): Promise<ProjectStatuses[]> {
  // JIRA_PROJECT_KEY is guaranteed to be defined due to check at top of file
  const project = projectKey ?? (JIRA_PROJECT_KEY as string)
  return jiraFetch<ProjectStatuses[]>(`/project/${encodeURIComponent(project)}/statuses`)
}
