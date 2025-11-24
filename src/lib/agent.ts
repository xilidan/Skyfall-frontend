export function buildSpecToJiraAnswer(input: string): string {
  return `
# 📌 AI Team Lead — Jira Specification Output

Below is the generated analysis for the provided input:

> **Raw Input:**  
> \`${input}\`

---

## 🧩 Task Breakdown (Example)

- **Epic:** AI Team Lead Automation System
- **Tasks:**
  - Create Jira ticket generator based on TS
  - Build meeting transcription and action extraction
  - Implement MR analyzer with inline comments
  - Add deadline reminder service

---

## 🔗 Useful Links

- Jira REST API: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
- GitLab MR API: https://docs.gitlab.com/ee/api/merge_requests.html
- Markdown Cheat Sheet: https://www.markdownguide.org/cheat-sheet/

---

## 🧪 Code Block Example

\`\`\`ts
// Jira issue payload example
const issue = {
  fields: {
    summary: "Implement authentication flow",
    project: { key: "PROJ" },
    issuetype: { name: "Task" }
  }
};
\`\`\`

---

## 📊 Table Example

| Feature               | Status | Notes                          |
|-----------------------|--------|--------------------------------|
| Jira creation         | ✅     | Working as expected            |
| Meeting transcription | ⚠️     | Needs noise filtering          |
| MR analysis           | ✅     | Stable, accurate               |
| Deadline reminders    | 🟡     | Requires timezone handling     |

---

## 🧱 Custom Components (Test)

<Alert type="success" title="Jira Synced">
  All Jira items were created successfully. 🎉
</Alert>

<Badge variant="info">ready-for-merge</Badge>
<Badge variant="warning">needs-review</Badge>

<MyChart data-id="velocity-chart" />

---

## 📦 Admonition Blocks

:::info
This system automatically updates Jira issues after each meeting.
:::

:::warning
Ensure API tokens for GitLab and Jira are correctly configured.
:::

---

## 🖼️ Image

![Example Diagram](https://raw.githubusercontent.com/github/explore/main/topics/react/react.png)

---

## 💬 Final Recommendation

\`\`\`md
### 🔍 Merge Request Summary
Status: needs fixes  
- Missing null-checks  
- Tests incomplete  
- API mismatch with TS  
\`\`\`

---

If all sections above render properly, your **<ReactMarkdown> integration is fully working**.  
  `
}
