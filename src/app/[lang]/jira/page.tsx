'use client'

import {FormEvent, useEffect, useState} from 'react'

type JiraIssue = {
  id: string
  key: string
  fields: {
    summary: string
    description?: string | any
    status?: {name: string}
  }
}

export default function JiraIssuesPage() {
  const [issues, setIssues] = useState<JiraIssue[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')

  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editSummary, setEditSummary] = useState('')
  const [editDescription, setEditDescription] = useState('')

  async function fetchIssues() {
    setLoading(true)
    try {
      const res = await fetch('/api/jira/issues')
      const data = await res.json()
      setIssues(data.issues ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchIssues()
  }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!summary.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/jira/issues', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({summary, description}),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(`Create failed: ${data.error ?? res.statusText}`)
        return
      }

      setSummary('')
      setDescription('')
      await fetchIssues()
    } finally {
      setCreating(false)
    }
  }

  function startEdit(issue: JiraIssue) {
    setEditingKey(issue.key)
    setEditSummary(issue.fields.summary)
    setEditDescription(
      typeof issue.fields.description === 'string'
        ? issue.fields.description
        : issue.fields.description
        ? JSON.stringify(issue.fields.description, null, 2)
        : '',
    )
  }

  async function saveEdit(issueKey: string) {
    try {
      const res = await fetch(`/api/jira/issues/${issueKey}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          summary: editSummary,
          description: editDescription,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(`Update failed: ${data.error ?? res.statusText}`)
        return
      }

      setEditingKey(null)
      await fetchIssues()
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(issueKey: string) {
    if (!confirm(`Delete issue ${issueKey}?`)) return

    try {
      const res = await fetch(`/api/jira/issues/${issueKey}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        alert(`Delete failed: ${data.error ?? res.statusText}`)
        return
      }

      await fetchIssues()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Jira Tasks (Issues)</h1>

      <form onSubmit={handleCreate} className="space-y-3 rounded-lg border p-4">
        <h2 className="font-semibold">Create new task</h2>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Summary</label>
          <input
            className="w-full rounded border px-2 py-1 text-sm"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full rounded border px-2 py-1 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {creating ? 'Creating...' : 'Create task'}
        </button>
      </form>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Issues list</h2>
          <button onClick={() => void fetchIssues()} className="rounded border px-3 py-1 text-xs">
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : issues.length === 0 ? (
          <p className="text-sm text-gray-500">No issues found.</p>
        ) : (
          <ul className="space-y-2">
            {issues.map((issue) => (
              <li key={issue.id} className="flex flex-col gap-2 rounded border px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-gray-500">{issue.key}</span>
                    <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs">
                      {issue.fields.status?.name ?? '—'}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => startEdit(issue)} className="rounded border px-2 py-1 text-xs">
                      Edit
                    </button>
                    <button
                      onClick={() => void handleDelete(issue.key)}
                      className="rounded bg-red-500 px-2 py-1 text-xs text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {editingKey === issue.key ? (
                  <div className="space-y-2">
                    <input
                      className="w-full rounded border px-2 py-1 text-sm"
                      value={editSummary}
                      onChange={(e) => setEditSummary(e.target.value)}
                    />
                    <textarea
                      className="w-full rounded border px-2 py-1 text-sm"
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <div className="space-x-2">
                      <button
                        onClick={() => void saveEdit(issue.key)}
                        className="rounded bg-green-600 px-3 py-1 text-xs text-white"
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingKey(null)} className="rounded border px-3 py-1 text-xs">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">{issue.fields.summary}</p>
                    {issue.fields.description && (
                      <p className="mt-1 whitespace-pre-wrap text-xs text-gray-600">
                        {typeof issue.fields.description === 'string'
                          ? issue.fields.description
                          : JSON.stringify(issue.fields.description, null, 2)}
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
