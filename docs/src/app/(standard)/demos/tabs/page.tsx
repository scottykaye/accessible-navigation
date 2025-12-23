import { TabsDemo } from '@/components/demos/tabs-demo'
import { KeyboardHint } from '@/components/demos/keyboard-hint'
import Link from 'next/link'

export default function TabsDemoPage() {
  return (
    <div className="py-8">
      <Link
        href="/demos"
        className="mb-4 inline-block text-sm text-muted-foreground hover:underline"
      >
        ← Back to Demos
      </Link>

      <h1 className="mb-4 text-3xl font-bold">Tabs</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Horizontal keyboard navigation for tabbed interfaces. Use arrow keys to
        move between tabs and activate them.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Demo</h2>
          <TabsDemo />
        </div>

        <div className="space-y-6">
          <KeyboardHint orientation="horizontal" />

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-3 text-sm font-medium">Accessibility</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <code className="text-xs">role=&quot;tablist&quot;</code> on container
              </li>
              <li>
                <code className="text-xs">role=&quot;tab&quot;</code> on each tab button
              </li>
              <li>
                <code className="text-xs">aria-selected</code> indicates active tab
              </li>
              <li>
                <code className="text-xs">aria-controls</code> links tab to panel
              </li>
            </ul>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Code Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code>{`import { KeyboardNav, createKeyboardNavHook } from 'keyboard-navigation'

// Create horizontal navigation instance
const tabsNav = new KeyboardNav('horizontal')
const useTabsNav = createKeyboardNavHook(tabsNav)

function Tab({ label, title, isSelected, onSelect }) {
  const ref = useTabsNav(label)

  function handleKeyDown(event) {
    tabsNav.update(event, label)
  }

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isSelected}
      aria-controls={\`tabpanel-\${label}\`}
      tabIndex={isSelected ? 0 : -1}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      {title}
    </button>
  )
}

function Tabs() {
  const [activeTab, setActiveTab] = useState('tab1')

  return (
    <div>
      <div role="tablist">
        <Tab label="tab1" title="First" isSelected={activeTab === 'tab1'} onSelect={() => setActiveTab('tab1')} />
        <Tab label="tab2" title="Second" isSelected={activeTab === 'tab2'} onSelect={() => setActiveTab('tab2')} />
      </div>
      {/* Tab panels */}
    </div>
  )
}`}</code>
        </pre>
      </section>
    </div>
  )
}
