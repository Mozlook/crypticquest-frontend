import type { ButtonHTMLAttributes, ReactNode } from 'react'

// SubmitButton — the primary accent action. `loading` disables it and is meant
// to pair with a changed label (e.g. "authenticating…") supplied by the caller.
interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: ReactNode
}

export default function SubmitButton({
  loading,
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  )
}
