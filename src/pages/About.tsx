import AboutContent from '../components/about/AboutContent'

// About is the in-app briefing page: what CrypticQuest is and how to play.
// Same content as the login-screen modal, framed like the other gameplay views.
export default function About() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
          briefing
        </h1>
        <p className="mt-1 font-mono text-sm text-fg-muted">
          <span className="text-fg-subtle">{'// '}</span>
          what this operation is and how to run it
        </p>
      </header>

      <AboutContent />
    </div>
  )
}
