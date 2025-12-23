import Link from 'next/link'

export default function DemosPage() {
  return (
    <div className="py-8">
      <h1 className="mb-4 text-3xl font-bold">keyboard-navigation Demos</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Accessible keyboard navigation for React components. Explore interactive
        demos showing how to implement common UI patterns with full keyboard
        support.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <DemoCard
          href="/demos/accordion"
          title="Accordion"
          description="Vertical keyboard navigation for expandable content sections."
          keys="↑ ↓ Home End"
        />
        <DemoCard
          href="/demos/tabs"
          title="Tabs"
          description="Horizontal keyboard navigation for tabbed interfaces."
          keys="← → Home End"
        />
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">Features</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Arrow key navigation (Up/Down for vertical, Left/Right for horizontal)</li>
          <li>Home/End key support for jumping to first/last item</li>
          <li>Multiple independent navigation contexts</li>
          <li>React 18+ concurrent mode safe (uses useSyncExternalStore)</li>
          <li>TypeScript support</li>
          <li>Zero dependencies (except React)</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">Quick Start</h2>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code>{`import { KeyboardNav, createKeyboardNavHook } from 'keyboard-navigation'

// Create a navigation instance
const tabs = new KeyboardNav('horizontal')

// Create a hook from the instance
const useTabsNav = createKeyboardNavHook(tabs)

// Use in your component
function Tab({ label }) {
  const ref = useTabsNav(label)

  return (
    <button ref={ref} onKeyDown={(e) => tabs.update(e, label)}>
      {label}
    </button>
  )
}`}</code>
        </pre>
      </section>
    </div>
  )
}

function DemoCard({
  href,
  title,
  description,
  keys,
}: {
  href: string
  title: string
  description: string
  keys: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border p-6 transition-colors hover:border-foreground/50 hover:bg-muted/50"
    >
      <h2 className="mb-2 text-xl font-semibold group-hover:underline">
        {title}
      </h2>
      <p className="mb-4 text-muted-foreground">{description}</p>
      <div className="flex flex-wrap gap-2">
        {keys.split(' ').map((key) => (
          <kbd
            key={key}
            className="rounded border bg-background px-2 py-1 font-mono text-xs"
          >
            {key}
          </kbd>
        ))}
      </div>
    </Link>
  )
}
