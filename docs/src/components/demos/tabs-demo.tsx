'use client'

import { useState } from 'react'
import { KeyboardNav, createKeyboardNavHook } from 'keyboard-navigation'

const tabsNav = new KeyboardNav('horizontal')
const useTabsNav = createKeyboardNavHook(tabsNav)

type TabProps = {
  label: string
  title: string
  isSelected: boolean
  onSelect: () => void
}

function Tab({ label, title, isSelected, onSelect }: TabProps) {
  const ref = useTabsNav(label)

  function handleKeyDown(event: React.KeyboardEvent) {
    tabsNav.update(event, label)
  }

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isSelected}
      aria-controls={`tabpanel-${label}`}
      id={`tab-${label}`}
      tabIndex={isSelected ? 0 : -1}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        isSelected
          ? 'border-b-2 border-foreground text-foreground'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {title}
    </button>
  )
}

type TabPanelProps = {
  label: string
  isSelected: boolean
  children: React.ReactNode
}

function TabPanel({ label, isSelected, children }: TabPanelProps) {
  if (!isSelected) return null

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${label}`}
      aria-labelledby={`tab-${label}`}
      className="p-4"
    >
      {children}
    </div>
  )
}

export function TabsDemo() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { label: 'overview', title: 'Overview' },
    { label: 'features', title: 'Features' },
    { label: 'installation', title: 'Installation' },
  ]

  return (
    <div className="rounded-lg border">
      <div role="tablist" aria-label="Demo tabs" className="flex border-b">
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            label={tab.label}
            title={tab.title}
            isSelected={activeTab === tab.label}
            onSelect={() => setActiveTab(tab.label)}
          />
        ))}
      </div>

      <TabPanel label="overview" isSelected={activeTab === 'overview'}>
        <h3 className="mb-2 font-semibold">Overview</h3>
        <p className="text-muted-foreground">
          keyboard-navigation provides accessible keyboard navigation for React
          components. It handles arrow key navigation, Home/End keys, and
          integrates seamlessly with React 18&apos;s concurrent features.
        </p>
      </TabPanel>

      <TabPanel label="features" isSelected={activeTab === 'features'}>
        <h3 className="mb-2 font-semibold">Features</h3>
        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
          <li>Horizontal and vertical navigation modes</li>
          <li>Home/End key support</li>
          <li>Multiple independent navigation contexts</li>
          <li>React 18+ concurrent mode safe</li>
          <li>TypeScript support</li>
        </ul>
      </TabPanel>

      <TabPanel label="installation" isSelected={activeTab === 'installation'}>
        <h3 className="mb-2 font-semibold">Installation</h3>
        <pre className="rounded bg-muted p-2 text-sm">
          <code>npm install keyboard-navigation</code>
        </pre>
      </TabPanel>
    </div>
  )
}
