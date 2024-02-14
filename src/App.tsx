import React from 'react'
import { KeyboardNav, createKeyboardNavHook } from '../index.ts'
import './styles.css'

const tabs = new KeyboardNav('horizontal')
const accordion = new KeyboardNav()

const useKeyboardNav = createKeyboardNavHook(tabs)

function Accordion({ children }) {
  return (
    <div id="accordionGroup" className="accordion">
      {children}
    </div>
  )
}

function Panel({ children, title, label, controlledElement }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef()

  function handleToggle() {
    setIsOpen((isOpen) => !isOpen)
  }

  function onKeyDown(event) {
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
          ref={ref}
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

function Tab({ label, title, setActiveTabs, isSelected = false, index = 0 }) {
  function handleClick() {
    setActiveTabs(label)
  }

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

function Tabs({ children, defaultValue = '', title }) {
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
        const childProps = { ...child.props }
        const { label } = child.props

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
      <ul>
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
      </ul>
    </div>
  )
}
