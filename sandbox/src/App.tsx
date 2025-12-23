import React, { ReactNode } from 'react'
import { KeyboardNav, createKeyboardNavHook } from 'keyboard-navigation'
import './index.css'

const tabs = new KeyboardNav('horizontal')
const accordion = new KeyboardNav('vertical')

const useTabsNav = createKeyboardNavHook(tabs)
const useAccordionNav = createKeyboardNavHook(accordion)

function KeyboardHint({ orientation }: { orientation: 'horizontal' | 'vertical' }) {
  const keys =
    orientation === 'horizontal'
      ? ['← →', 'Home', 'End']
      : ['↑ ↓', 'Home', 'End']

  return (
    <div className="keyboard-hint">
      <span className="keyboard-hint-label">Keyboard:</span>
      {keys.map((key) => (
        <kbd key={key}>{key}</kbd>
      ))}
    </div>
  )
}

function DemoSection({
  title,
  description,
  orientation,
  children,
}: {
  title: string
  description: string
  orientation: 'horizontal' | 'vertical'
  children: ReactNode
}) {
  return (
    <section className="demo-section">
      <div className="demo-header">
        <h2>{title}</h2>
        <p className="demo-description">{description}</p>
        <KeyboardHint orientation={orientation} />
      </div>
      <div className="demo-content">{children}</div>
    </section>
  )
}

function Accordion({ children }: { children: ReactNode }) {
  return (
    <div id="accordionGroup" className="accordion">
      {children}
    </div>
  )
}

function Panel({
  children,
  title,
  label,
}: {
  children: ReactNode
  title: ReactNode
  label: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = useAccordionNav(label)

  function handleToggle() {
    setIsOpen((isOpen) => !isOpen)
  }

  function onKeyDown(event: React.KeyboardEvent) {
    accordion.update(event, label)
  }

  return (
    <div className="accordion-item">
      <h3 className="accordion-header">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={`panel-${label}`}
          id={`header-${label}`}
          onClick={handleToggle}
          className={`accordion-button ${isOpen ? 'isSelected' : ''}`}
          ref={ref}
          onKeyDown={onKeyDown}
        >
          <span>{title}</span>
          <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
        </button>
      </h3>
      {isOpen && (
        <div
          id={`panel-${label}`}
          role="region"
          aria-labelledby={`header-${label}`}
          className="accordion-panel"
        >
          {children}
        </div>
      )}
    </div>
  )
}

function Tab({
  label,
  title,
  setActiveTabs = () => {},
  isSelected = false,
  index = 0,
}: {
  label: string
  title: ReactNode
  setActiveTabs?: (label: string) => void
  isSelected?: boolean
  index?: number
  children?: React.ReactNode
}) {
  function handleClick() {
    setActiveTabs(label)
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    tabs.update(event, label)
  }

  const refs = useTabsNav(label)

  return (
    <button
      ref={refs}
      className={`tab ${isSelected ? 'isSelected' : ''}`}
      type="button"
      onClick={handleClick}
      role="tab"
      aria-selected={isSelected}
      aria-controls={`tabpanel-${index}`}
      id={`tab-${index}`}
      tabIndex={isSelected ? 0 : -1}
      onKeyDown={handleKeyDown}
    >
      {title}
    </button>
  )
}

function Tabs({
  children,
  defaultValue = '',
  label: tabsLabel,
}: {
  children: JSX.Element | Array<JSX.Element>
  defaultValue?: string
  label?: string
}) {
  const [activeTabs, setActiveTabs] = React.useState(defaultValue)

  let index = 0

  return (
    <div className="tabs">
      <div
        className="tablist"
        role="tablist"
        aria-label={tabsLabel}
      >
        {React.Children.map(children, (child) => {
          const { title, label } = child.props
          index++

          return React.isValidElement(child) ? (
            <Tab
              key={label}
              title={title}
              label={label}
              setActiveTabs={setActiveTabs}
              isSelected={activeTabs === label}
              index={index}
            />
          ) : (
            child
          )
        })}
      </div>
      {React.Children.map(children, (child) => {
        const { label, children: content } = child?.props
        index++

        return (
          activeTabs === label && (
            <div
              className="tab-content"
              role="tabpanel"
              aria-labelledby={`tab-${index}`}
              id={`tabpanel-${index}`}
            >
              {content}
            </div>
          )
        )
      })}
    </div>
  )
}

export default function App() {
  return (
    <div id="App" className="App">
      <header className="app-header">
        <h1>keyboard-navigation</h1>
        <p className="tagline">
          Accessible keyboard navigation for React components
        </p>
      </header>

      <main>
        <DemoSection
          title="Accordion"
          description="Vertical navigation for expandable content sections. Focus moves between accordion headers with arrow keys."
          orientation="vertical"
        >
          <Accordion>
            <Panel title="What is keyboard-navigation?" label="panel1">
              A lightweight React library that provides accessible keyboard
              navigation for common UI patterns like accordions, tabs, and more.
            </Panel>
            <Panel title="How does it work?" label="panel2">
              It uses a pub/sub pattern to track focusable elements and handle
              keyboard events. Arrow keys move focus between registered elements.
            </Panel>
            <Panel title="Is it accessible?" label="panel3">
              Yes! It follows WAI-ARIA best practices for keyboard navigation,
              including Home/End key support and proper focus management.
            </Panel>
            <Panel title="Does it work with React 18?" label="panel4">
              Yes, it uses React 18&apos;s useSyncExternalStore hook internally,
              making it safe for concurrent rendering.
            </Panel>
          </Accordion>
        </DemoSection>

        <DemoSection
          title="Tabs"
          description="Horizontal navigation for tabbed interfaces. Focus moves between tabs with arrow keys."
          orientation="horizontal"
        >
          <Tabs label="Demo tabs" defaultValue="tab1">
            <Tab label="tab1" title="Overview">
              keyboard-navigation provides accessible keyboard navigation for
              React components. It handles arrow key navigation, Home/End keys,
              and integrates with React 18.
            </Tab>
            <Tab label="tab2" title="Features">
              Horizontal and vertical navigation modes, Home/End key support,
              multiple navigation contexts, React 18+ concurrent mode safe.
            </Tab>
            <Tab label="tab3" title="Install">
              npm install keyboard-navigation
            </Tab>
          </Tabs>
        </DemoSection>
      </main>

      <footer className="app-footer">
        <p>
          <a
            href="https://github.com/scottykaye/accessible-navigation"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
