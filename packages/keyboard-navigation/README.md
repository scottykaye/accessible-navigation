# keyboard-navigation

Accessible keyboard navigation for React components. Uses React 18's `useSyncExternalStore` for concurrent-safe state management.

## Features

- Arrow key navigation (Up/Down for vertical, Left/Right for horizontal)
- Home/End key support
- Multiple independent navigation contexts
- React 18+ concurrent mode safe
- TypeScript support

## Installation

```bash
npm install keyboard-navigation
```

## Quick Start

```tsx
import { KeyboardNav, createKeyboardNavHook } from 'keyboard-navigation'

// 1. Create a navigation instance
const tabs = new KeyboardNav('horizontal')

// 2. Create a hook from the instance
const useTabsNav = createKeyboardNavHook(tabs)

// 3. Use in your components
function Tab({ label, children }) {
  const ref = useTabsNav(label)

  return (
    <button
      ref={ref}
      onKeyDown={(e) => tabs.update(e, label)}
      role="tab"
    >
      {children}
    </button>
  )
}
```

## Examples

### Horizontal Navigation (Tabs)

```tsx
import { KeyboardNav, createKeyboardNavHook } from 'keyboard-navigation'

const tabsNav = new KeyboardNav('horizontal')
const useTabsNav = createKeyboardNavHook(tabsNav)

function Tab({ label, title }) {
  const ref = useTabsNav(label)

  function handleKeyDown(event) {
    tabsNav.update(event, label)
  }

  return (
    <button ref={ref} onKeyDown={handleKeyDown} role="tab">
      {title}
    </button>
  )
}

function TabList() {
  return (
    <div role="tablist">
      <Tab label="tab1" title="First" />
      <Tab label="tab2" title="Second" />
      <Tab label="tab3" title="Third" />
    </div>
  )
}
```

### Vertical Navigation (Accordion)

```tsx
import { KeyboardNav, createKeyboardNavHook } from 'keyboard-navigation'

const accordionNav = new KeyboardNav('vertical')
const useAccordionNav = createKeyboardNavHook(accordionNav)

function AccordionButton({ label, title, isOpen, onToggle }) {
  const ref = useAccordionNav(label)

  function handleKeyDown(event) {
    accordionNav.update(event, label)
  }

  return (
    <button
      ref={ref}
      onKeyDown={handleKeyDown}
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      {title}
    </button>
  )
}
```

## API

### `KeyboardNav`

Create a navigation instance for a group of focusable elements.

```tsx
const nav = new KeyboardNav(orientation?)
```

**Parameters:**
- `orientation` (optional): `'vertical'` (default) or `'horizontal'`

**Methods:**
- `.update(event, label)` - Handle keyboard navigation. Call this in your `onKeyDown` handler.
- `.subscribe(label, element)` - Manually register an element (use hook instead when possible)
- `.unsubscribe(label)` - Manually unregister an element

### `createKeyboardNavHook`

Create a React hook from a navigation instance.

```tsx
const useNav = createKeyboardNavHook(navInstance)
```

**Returns:** A hook function `useNav(label, ref?)`

### `useNav` (returned hook)

```tsx
const callbackRef = useNav(label, parentRef?)
```

**Parameters:**
- `label` - Unique identifier for this element within the navigation group
- `parentRef` (optional) - A ref to merge with the callback ref

**Returns:** A callback ref to attach to your element

## Supported Keys

| Key | Vertical | Horizontal |
|-----|----------|------------|
| Arrow Up | Previous | - |
| Arrow Down | Next | - |
| Arrow Left | - | Previous |
| Arrow Right | - | Next |
| Home | First | First |
| End | Last | Last |

## Multiple Navigation Contexts

You can create multiple independent navigation contexts:

```tsx
const menuNav = new KeyboardNav('vertical')
const toolbarNav = new KeyboardNav('horizontal')

const useMenuNav = createKeyboardNavHook(menuNav)
const useToolbarNav = createKeyboardNavHook(toolbarNav)
```

Each context manages its own set of elements independently.

## Requirements

- React 18.0.0 or higher (uses `useSyncExternalStore`)
- TypeScript 5.0.0 or higher (optional)

## License

MIT
