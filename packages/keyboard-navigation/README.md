# Aria Keyboard A11y

A pub/sub observer that handles keyboard navigation for tabs, accordions and
menus.

This solution bundles the appropriate arrow navigation keys. It relies on
browser native support for keyboard Tab, Shift+Tab as well as Enter and Spacebar
behavior from HTML `<button />` elements.

### Goal

The drive behind the concept was to make the browser work smarter not harder.
Leveraging everything we get natively for free from the browser and then add
only the support that is missing. The solution abstracts away the functionality
from the component to simplify usage.

## Requirements

This solution currently recommends and supports native HTML button elements to
get full access to the appropriate supported keyboard events.a

TODO: Confirm <a/> tag support

### KeyboardNav

A pub/sub class observer that monitors the elements provided to handle the
keyboard events.

#### Methods

- `subscribe` - A method that takes a unique `label` and `element` arguments to
  construct elements that are subscribed to the navigation events.
- `unsubscribe` - A method that takes the unique `label` as an argument and
  unsubscribes from the item being observed.
- `update` - A method that takes two arguments the `event` and `label`
  arguments. These trigger the navigation event. Recommended to be used with
  `onKeyDown`.
- `view` - A method used for console logging the elements being observed.

## Use with React

```jsx
import { createKeyboardNav, KeyboardNav } from 'aria-keyboard-a11y'
const tabs = KeyboardNav('horizontal')
const useKeyboardNav = createKeyboardNav(tabs)

function Tab({ label, title, setActiveTabs, isSelected = false, index = 0 }) {
  function handleKeyDown(event) {
    tabs.update(event, label)
  }
  const refs = useKeyboardNav(label)

  return (
    <>
      <button
        ref={refs}
        className={`tab ${isSelected ? 'isSelected' : ''}`}
        type="button"
        onClick={handleClick}
        role="tab"
        aria-selected={isSelected}
        aria-controls={`tabpanel-${index}`}
        id={`tab-${index}`}
        onKeyDown={handleKeyDown}
      >
        {title}
      </button>
    </>
  )
}
```

## Usage with native html
