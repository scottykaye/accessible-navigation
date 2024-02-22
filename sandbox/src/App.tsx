import React, { ReactNode } from 'react'
import { KeyboardNav, createKeyboardNavHook } from 'keyboard-navigation'
import './index.css'
import './App.css'

const tabs = new KeyboardNav('horizontal')
const accordion = new KeyboardNav()

const useKeyboardNav = createKeyboardNavHook(tabs)

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
  controlledElement,
}: {
  children: ReactNode
  title: ReactNode
  label: string
  controlledElement?: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef()

  function handleToggle() {
    setIsOpen((isOpen) => !isOpen)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    accordion.update(event, label)
  }

  React.useEffect(() => {
    if (ref.current) {
      accordion.subscribe(label, ref.current)
    }

    return () => {
      accordion.unsubscribe(label)
    }
  }, [])

  return (
    <div>
      <h3 className="accordion-header">
        <button
          type="button"
          // lets us know if the panel is expanded
          aria-expanded={isOpen}
          // Points to the ID of the panel which the header controls.
          aria-controls={controlledElement}
          id={label}
          onClick={handleToggle}
          className={`accordion-button ${isOpen ? 'isSelected' : ''}`}
          ref={ref as any}
          onKeyDown={onKeyDown}
        >
          {title}
        </button>
      </h3>
      {isOpen && (
        <div
          id={controlledElement}
          role="region"
          // Defines the accessible name for the region element.
          aria-labelledby={label}
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

function Tabs({
  children,
  defaultValue = '',
  title,
}: {
  // Because we do this the way we do mapping through the childs grandchildren to get the tabs api we want,  we have to expect a JSX element because it cannot be a string or some of the other options ReactNode gives us like false, undefined, null
  children: JSX.Element | Array<JSX.Element>
  defaultValue?: string
  title?: ReactNode
}) {
  const [activeTabs, setActiveTabs] = React.useState(defaultValue)

  let index = 0
  index++

  return (
    <div className="tabs">
      <h3 className="tabs-title" id={`tablist-${index}`}>
        {title}
      </h3>
      <div
        className="tablist"
        role="tablist"
        aria-labelledby={`tablist-${index}`}
      >
        {React.Children.map(children, (child) => {
          const { title, label } = child.props

          index++

          return React.isValidElement(child) ? (
            <Tab
              key={index}
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
        const childProps = { ...child?.props }
        const { label } = child?.props

        return (
          activeTabs === label && (
            <div
              className="tab-content"
              role="tabpanel"
              aria-labelledby={`tab-${index}`}
              id={`tabpanel-${index}`}
              {...childProps}
            />
          )
        )
      })}
    </div>
  )
}

// if there is a listitem we're in a submenu, we'll need a ref
// up and down open close submenu
// left and right in submenu navigates between other dropdowns or to the next top level item
// home end closes submenu navgiates start to end
// first character navigates through on top menu
// first character navigates through on dropdowns based on focus
// navigates through on dropdowns based on focus

// we don't want to remove enter and space functionality unless we know theres a submenu
const SMALL_SUPPORT = {
  ENTER: 'Enter',
  SPACE: ' ',
}

const SUPPORTED_KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  ESCAPE: 'Escape',
}

const LETTERS: Record<string, string> = {}
for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
  const letter = String.fromCharCode(i)
  LETTERS[letter.toUpperCase()] = letter.toLowerCase()
}

class Navigate {
  readonly orientation?: 'vertical' | 'horizontal'
  readonly navigation?: boolean
  observers: Record<string, HTMLElement>

  constructor(
    orientation: 'vertical' | 'horizontal' = 'vertical',
    navigation: boolean = false,
  ) {
    this.orientation = orientation
    this.observers = {}
    this.navigation = navigation
  }

  view() {
    console.log(this.observers)
  }

  subscribe(label: string, element: HTMLElement): void {
    this.observers = { ...this.observers, ...{ [label]: element } } as Record<
      string,
      HTMLElement
    >
    // console.log(this.observers)
    // console.log('test', this.observers[label]?.nextSibling?.textContent)
  }

  unsubscribe(label: string): void {
    delete this.observers[label]
  }

  update(event: KeyboardEvent, current: string): void {
    const labelList = Object.keys(this.observers)
    const currentNumber = labelList.findIndex((item) => item === current)
    const firstItem = 0
    const lastItem = labelList.length - 1
    const currentItem = this.observers[labelList[currentNumber]]
    const moveUp = currentNumber > firstItem ? currentNumber - 1 : lastItem
    const moveDown = currentNumber < lastItem ? currentNumber + 1 : firstItem

    if (navigation) {
      const sibling = currentItem.nextSibling as HTMLElement
      // if (Object.values(LETTERS).includes(event.key.toLowerCase())) {
      if (/^[a-z0-9]$/i.test(event.key.toLowerCase())) {
        const options = Object.values(this.observers).map((item) =>
          item?.textContent?.toLowerCase().slice(0, 1),
        )

        let item = options.findIndex((letter, index) => {
          if (index > currentNumber) {
            return letter === event.key.toLowerCase()
          }
        })

        if (item === -1) {
          item = options.findIndex(
            (letter) => letter === event.key.toLowerCase(),
          )
        }

        return this.observers?.[labelList[item]]?.focus()
      }

      if (event.key === SMALL_SUPPORT.SPACE && !sibling) {
        // support space bar click single item
        return currentItem.click()
      }

      // support submenu dropdowns with space and enter
      if (Object.values(SMALL_SUPPORT).includes(event.key) && sibling) {
        event.preventDefault()
        const firstLink = sibling?.firstChild?.childNodes[0] as HTMLElement
        sibling.setAttribute('style', 'visibility: visible')

        return firstLink.focus()
      }

      // Expect event.key to be only one of what we support in the list above
      if (Object.values(SUPPORTED_KEYS).includes(event.key)) {
        event.preventDefault()
        if (event.key === SUPPORTED_KEYS.ESCAPE) {
          // hasChildNodes hasParentNodes do we need to check with these
          const submenu = currentItem?.parentNode?.parentNode as HTMLElement
          if (submenu?.style?.visibility === 'visible') {
            submenu.style.visibility = ''
          }

          const prevMenu = submenu?.parentNode?.childNodes[0] as HTMLElement

          prevMenu?.focus()
        }

        if (
          // props
          this.orientation === 'horizontal' &&
          // has sibling
          currentItem.nextSibling &&
          // arrow support for props
          [SUPPORTED_KEYS.ARROW_UP, SUPPORTED_KEYS.ARROW_DOWN].includes(
            event.key,
          )
        ) {
          const submenu = currentItem.nextSibling as HTMLElement
          const firstLink = submenu?.firstChild?.childNodes[0] as HTMLElement
          const lastLink = submenu?.lastChild?.childNodes[0] as HTMLElement

          submenu.setAttribute('style', 'visibility: visible')

          if (event.key === 'Escape') {
            submenu.setAttribute('style', 'visibility: hidden')
          }
          return event.key === SUPPORTED_KEYS.ARROW_DOWN
            ? firstLink.focus()
            : lastLink.focus()
        }
      }

      // if it has a left and right sub menu
      // a check will be needed here
      // LEFT brings you back to the last level
      // or right if theres no drop down!
      if (
        // props
        this.orientation === 'vertical' &&
        // has sibling
        currentItem.nextSibling &&
        // arrow support for props
        [SUPPORTED_KEYS.ARROW_RIGHT].includes(event.key)
      ) {
        const submenu = currentItem.nextSibling as HTMLElement

        const firstLink = submenu?.firstChild?.childNodes[0] as HTMLElement

        submenu.setAttribute('style', 'visibility: visible')

        if (event.key === 'Escape') {
          submenu.setAttribute('style', 'visibility: hidden')
        }

        if (event.key === SUPPORTED_KEYS.ARROW_RIGHT) {
          return firstLink.focus()
        }
      }

      // left should go back!

      switch (event.key) {
        case SUPPORTED_KEYS.HOME:
          this.observers[labelList[firstItem]].focus()
          break
        case SUPPORTED_KEYS.END:
          this.observers[labelList[lastItem]].focus()
          break
      }
      if (this.orientation === 'vertical') {
        switch (event.key) {
          case SUPPORTED_KEYS.ARROW_UP:
            this.observers[labelList[moveUp]].focus()
            break
          case SUPPORTED_KEYS.ARROW_DOWN:
            this.observers[labelList[moveDown]].focus()
            break
        }
      }
      if (this.orientation === 'horizontal') {
        switch (event.key) {
          case SUPPORTED_KEYS.ARROW_LEFT:
            this.observers[labelList[moveUp]].focus()
            break
          case SUPPORTED_KEYS.ARROW_RIGHT:
            this.observers[labelList[moveDown]].focus()
            break
        }
      }
    }
  }

  updateBlur(current: string): void {
    const labelList = Object.keys(this.observers)
    const currentNumber = labelList.findIndex((item) => item === current)
    const currentItem = this.observers[labelList[currentNumber]]
    const parent = currentItem?.parentNode?.parentNode as HTMLElement

    document.addEventListener('click', (event) => {
      if (!parent.contains(event.target as Node)) {
        if (parent.style.visibility === 'visible') {
          parent.style.visibility = ''
        }
      }
    })
  }
}

const navigation = new Navigate('horizontal', true)
const useKeyboardNavigation = createKeyboardNavHook(navigation)
interface ListItemOptions {
  label: string
  children: React.ReactNode
  href?: string
  submenu?: React.ReactNode
}

function ListItem({ label, children, href = '#', submenu }: ListItemOptions) {
  function handleKeyDown(event: any) {
    navigation.update(event, label)
  }

  const refs = useKeyboardNavigation(label)

  return (
    <li className="Nav-item" role="none">
      <a role="menuitem" href={href} ref={refs} onKeyDown={handleKeyDown}>
        {children}
      </a>
      {submenu}
    </li>
  )
}

const subnav = new Navigate('vertical', true)
const useKeyboardSubNavigation = createKeyboardNavHook(subnav)

function SubListItem({
  label,
  children,
  href = '#',
  submenu,
}: ListItemOptions) {
  function handleKeyDown(event: any) {
    subnav.update(event, label)
  }

  function handleBlur() {
    subnav.updateBlur(label)
  }

  const refs = useKeyboardSubNavigation(label)

  return (
    <li className="Nav-item" role="none">
      <a
        href={href}
        role="menu-item"
        ref={refs}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      >
        {children}
      </a>
      {submenu}
    </li>
  )
}

const subsubnav = new Navigate('vertical', true)
const useKeyboardSubSubNavigation = createKeyboardNavHook(subsubnav)

function SubSubListItem({
  label,
  children,
  href = '#',
  submenu,
}: ListItemOptions) {
  function handleKeyDown(event: any) {
    subsubnav.update(event, label)
  }

  function handleBlur() {
    subsubnav.updateBlur(label)
  }

  const refs = useKeyboardSubSubNavigation(label)

  return (
    <li className="Nav-item" role="none">
      <a
        href={href}
        role="menu-item"
        ref={refs}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      >
        {children}
      </a>
      {submenu}
    </li>
  )
}

export default function App() {
  return (
    <div id="App" className="App">
      <h2>Panel</h2>
      <Accordion>
        <Panel title="Title of panel" label="panel1">
          One panel
        </Panel>
        <Panel title="Two Title of panel" label="panel2">
          test
        </Panel>
        <Panel title="Three Title of panel" label="panel3">
          test
        </Panel>
        <Panel title="Four Title of panel" label="panel4">
          test
        </Panel>
      </Accordion>
      <hr />
      <h2>Tabs</h2>
      <Tabs title="Tabs Title" defaultValue="tab1">
        <Tab label="tab1" title="one">
          content 1
        </Tab>
        <Tab label="tab2" title="two">
          content 2
        </Tab>
        <Tab label="tab3" title="three">
          content 3
        </Tab>
      </Tabs>
      <hr />
      <ol>
        <li>
          <h3>Support for Horizontal & Vertical</h3>
        </li>
        <li>Arrow Up</li>
        <li>Arrow Down</li>
        <li>Home</li>
        <li>End</li>
        <li>Tab</li>
        <li>Shift Tab</li>
        <li>Enter / Space</li>
      </ol>
      <hr />
      <h2>Keyboard Nav</h2>
      <nav className="Nav">
        <ul className="Navlist">
          <ListItem
            label="nav1"
            submenu={
              <ul className="Submenu">
                <SubListItem label="sub1">first</SubListItem>
                <SubListItem label="sub2">second</SubListItem>
                <SubListItem
                  label="sub3"
                  submenu={
                    <ul className="Submenu">
                      <SubSubListItem label="joe">Joe</SubSubListItem>
                      <SubSubListItem label="matt">Matt</SubSubListItem>
                      <SubSubListItem label="scott">Scott</SubSubListItem>
                      <SubSubListItem label="josh">Josh</SubSubListItem>
                    </ul>
                  }
                >
                  Third
                </SubListItem>
              </ul>
            }
          >
            test
          </ListItem>
          <ListItem label="nav2">Scott</ListItem>
          <ListItem label="nav3">test</ListItem>
          <ListItem label="nav4">Matt</ListItem>
        </ul>
      </nav>
    </div>
  )
}
