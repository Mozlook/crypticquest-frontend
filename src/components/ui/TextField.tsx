import { useState, type InputHTMLAttributes } from 'react'

// TextField — a labeled input in the terminal style: prompt-caret label and a
// mono input that glows at the accent on focus. Forwards all native input props.
//
// noAutofill suppresses the browser's saved-credential dropdown. Chromium
// (Brave/Chrome) ignores autocomplete="off" on login fields, so we render the
// input readOnly — browsers don't autofill/suggest into a readOnly field — and
// drop readOnly on first focus so the user can type normally. The data-* attrs
// silence the common password-manager extensions.
//
// hint renders a small helper line under the input, wired via aria-describedby.
interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  noAutofill?: boolean
  hint?: string
}

export default function TextField({
  label,
  id,
  noAutofill,
  hint,
  onFocus,
  ...props
}: TextFieldProps) {
  const [readOnly, setReadOnly] = useState(noAutofill ?? false)
  const hintId = hint ? `${id}-hint` : undefined

  const guardProps = noAutofill
    ? {
        readOnly,
        onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
          setReadOnly(false)
          onFocus?.(e)
        },
        'data-1p-ignore': true,
        'data-lpignore': true,
        'data-bwignore': true,
        'data-form-type': 'other',
      }
    : { onFocus }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-xs uppercase tracking-[0.15em] text-fg-muted"
      >
        <span className="text-accent">&gt;</span> {label}
      </label>
      <input
        id={id}
        aria-describedby={hintId}
        className="w-full rounded-md border border-border bg-surface-2/70 px-3.5 py-2.5 font-mono text-fg transition-[border-color,box-shadow] placeholder:text-fg-subtle focus:border-accent focus:shadow-[0_0_0_3px_rgba(52,245,160,0.12)] focus:outline-none"
        {...guardProps}
        {...props}
      />
      {hint && (
        <p id={hintId} className="mt-1.5 font-mono text-xs text-fg-subtle">
          {hint}
        </p>
      )}
    </div>
  )
}
