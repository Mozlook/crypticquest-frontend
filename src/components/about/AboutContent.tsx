// AboutContent is the briefing body shared by the /about page and the login
// modal: what CrypticQuest is, how progression works, and the flag rules. Pure
// presentational — the page and the modal provide their own framing.

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-accent">
      {children}
    </h2>
  )
}

export default function AboutContent() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed text-fg-muted">
      <section>
        <SectionHeading>the mission</SectionHeading>
        <p>
          CrypticQuest is a single-player puzzle campaign: 20 encrypted
          transmissions, each hiding a flag. Crack the message, submit the
          flag, move on. Difficulty ramps from pencil-and-paper ciphers to
          multi-stage chains of cryptography, file forensics, and web tricks.
        </p>
      </section>

      <section>
        <SectionHeading>how it works</SectionHeading>
        <ul className="space-y-1.5">
          <li>
            <span className="text-accent">▸</span> levels unlock in order —
            solving one reveals the next transmission
          </li>
          <li>
            <span className="text-accent">▸</span> solving also adds equipment
            to your toolkit (references, decoders, utilities) — check it after
            every solve
          </li>
          <li>
            <span className="text-accent">▸</span> every level has hints behind
            a blur; they become available over time, use them as needed
          </li>
          <li>
            <span className="text-accent">▸</span> some transmissions carry
            attached files — download and inspect them
          </li>
        </ul>
      </section>

      <section>
        <SectionHeading>flags</SectionHeading>
        <ul className="space-y-1.5">
          <li>
            <span className="text-accent">▸</span> the flag is the answer: a
            word, phrase, or flag{'{...}'} string the puzzle points to
          </li>
          <li>
            <span className="text-accent">▸</span> letter case does not matter;
            everything else does — submit exactly what you found, no extra
            spaces
          </li>
          <li>
            <span className="text-accent">▸</span> wrong answers cost nothing:
            no penalties, no attempt limits, no timer
          </li>
        </ul>
      </section>

      <section>
        <SectionHeading>rules of engagement</SectionHeading>
        <ul className="space-y-1.5">
          <li>
            <span className="text-accent">▸</span> everything you need is in
            the transmission, its files, and your toolkit
          </li>
          <li>
            <span className="text-accent">▸</span> no brute-force guessing is
            ever required — if you are hammering, step back and look again
          </li>
          <li>
            <span className="text-accent">▸</span> when a level hands you a
            target site, that site is the puzzle — this app itself is not
          </li>
        </ul>
      </section>
    </div>
  )
}
