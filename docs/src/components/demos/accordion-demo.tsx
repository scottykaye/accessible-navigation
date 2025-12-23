'use client'

import { useState } from 'react'
import { KeyboardNav, createKeyboardNavHook } from 'keyboard-navigation'
import { ChevronDown } from 'lucide-react'

const accordionNav = new KeyboardNav('vertical')
const useAccordionNav = createKeyboardNavHook(accordionNav)

type AccordionItemProps = {
  label: string
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

function AccordionItem({
  label,
  title,
  children,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  const ref = useAccordionNav(label)

  function handleKeyDown(event: React.KeyboardEvent) {
    accordionNav.update(event, label)
  }

  return (
    <div className="border-b">
      <h3>
        <button
          ref={ref}
          type="button"
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls={`panel-${label}`}
          id={`header-${label}`}
          className="flex w-full items-center justify-between py-4 text-left font-medium transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {title}
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </h3>
      {isOpen && (
        <div
          id={`panel-${label}`}
          role="region"
          aria-labelledby={`header-${label}`}
          className="pb-4 text-muted-foreground"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function AccordionDemo() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['item1']))

  function toggleItem(label: string) {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  return (
    <div className="rounded-lg border">
      <AccordionItem
        label="item1"
        title="What is keyboard-navigation?"
        isOpen={openItems.has('item1')}
        onToggle={() => toggleItem('item1')}
      >
        keyboard-navigation is a lightweight React library that provides
        accessible keyboard navigation for common UI patterns like accordions,
        tabs, menus, and more.
      </AccordionItem>
      <AccordionItem
        label="item2"
        title="How does it work?"
        isOpen={openItems.has('item2')}
        onToggle={() => toggleItem('item2')}
      >
        It uses a pub/sub pattern to track focusable elements and handle
        keyboard events. When you press arrow keys, it moves focus to the
        previous or next element in the navigation group.
      </AccordionItem>
      <AccordionItem
        label="item3"
        title="Is it accessible?"
        isOpen={openItems.has('item3')}
        onToggle={() => toggleItem('item3')}
      >
        Yes! It follows WAI-ARIA best practices for keyboard navigation,
        including support for Home/End keys and proper focus management. You
        still need to add the appropriate ARIA attributes to your components.
      </AccordionItem>
      <AccordionItem
        label="item4"
        title="Does it work with React 18?"
        isOpen={openItems.has('item4')}
        onToggle={() => toggleItem('item4')}
      >
        Yes, it uses React 18&apos;s useSyncExternalStore hook internally, making it
        safe for concurrent rendering and avoiding potential tearing issues.
      </AccordionItem>
    </div>
  )
}
