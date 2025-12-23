import { AccordionDemo } from '@/components/demos/accordion-demo'
import { KeyboardHint } from '@/components/demos/keyboard-hint'
import Link from 'next/link'

export default function AccordionDemoPage() {
  return (
    <div className="py-8">
      <Link
        href="/demos"
        className="mb-4 inline-block text-sm text-muted-foreground hover:underline"
      >
        ← Back to Demos
      </Link>

      <h1 className="mb-4 text-3xl font-bold">Accordion</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Vertical keyboard navigation for expandable content sections. Use arrow
        keys to move between accordion headers.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Demo</h2>
          <AccordionDemo />
        </div>

        <div className="space-y-6">
          <KeyboardHint orientation="vertical" />

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-3 text-sm font-medium">Accessibility</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <code className="text-xs">aria-expanded</code> indicates open state
              </li>
              <li>
                <code className="text-xs">aria-controls</code> links header to panel
              </li>
              <li>
                <code className="text-xs">aria-labelledby</code> labels the panel
              </li>
            </ul>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Code Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code>{`import { KeyboardNav, createKeyboardNavHook } from 'keyboard-navigation'

// Create vertical navigation instance
const accordionNav = new KeyboardNav('vertical')
const useAccordionNav = createKeyboardNavHook(accordionNav)

function AccordionItem({ label, title, isOpen, onToggle, children }) {
  const ref = useAccordionNav(label)

  function handleKeyDown(event) {
    accordionNav.update(event, label)
  }

  return (
    <div>
      <h3>
        <button
          ref={ref}
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls={\`panel-\${label}\`}
        >
          {title}
        </button>
      </h3>
      {isOpen && (
        <div id={\`panel-\${label}\`} role="region">
          {children}
        </div>
      )}
    </div>
  )
}`}</code>
        </pre>
      </section>
    </div>
  )
}
