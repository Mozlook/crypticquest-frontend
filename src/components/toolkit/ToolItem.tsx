import { fileUrl } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import type { Tool } from '../../types/tools'

// ToolItem renders one unlocked tool by type: link → external site, pdf → gated
// download, builtin → an in-app tool (none yet, shown as a non-link card). link
// and pdf are clickable cards opening in a new tab; the cookie rides along for
// the gated pdf.
export default function ToolItem({ tool }: { tool: Tool }) {
  const href =
    tool.type === 'link'
      ? tool.content
      : tool.type === 'pdf'
        ? fileUrl(endpoints.toolFile(tool.content))
        : null

  const action = tool.type === 'link' ? 'open ↗' : tool.type === 'pdf' ? 'download ↓' : null

  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-medium text-fg">{tool.title}</span>
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-fg-subtle">
          {tool.type}
        </span>
      </div>
      {tool.description && (
        <p className="mt-1.5 font-mono text-xs leading-relaxed text-fg-muted">
          {tool.description}
        </p>
      )}
      {action && (
        <span className="mt-2 inline-block font-mono text-xs text-cipher transition-colors group-hover:text-accent">
          {action}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-lg border border-border bg-surface-2/40 p-4 transition-colors hover:border-accent/60"
        >
          {body}
        </a>
      </li>
    )
  }

  return <li className="rounded-lg border border-border bg-surface-2/40 p-4">{body}</li>
}
