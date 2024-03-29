import { useCallback } from 'react'

const SUPPORTED_KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
}

// type SupportedKeys = typeof SUPPORTED_KEYS[keyof typeof SUPPORTED_KEYS]

export class KeyboardNav {
  readonly orientation?: 'vertical' | 'horizontal'
  observers: Record<string, HTMLElement>

  constructor(orientation: 'vertical' | 'horizontal' = 'vertical') {
    this.orientation = orientation
    this.observers = {}
  }

  view() {
    console.log(this.observers)
  }

  subscribe(label: string, element: HTMLElement): void {
    this.observers = { ...this.observers, ...{ [label]: element } } as Record<
      string,
      HTMLElement
    >
  }

  unsubscribe(label: string): void {
    delete this.observers[label]
  }

  update(event: KeyboardEvent, current: string): void {
    const labelList = Object.keys(this.observers)
    const currentNumber = labelList.findIndex((item) => item === current)
    const firstItem = 0
    const lastItem = labelList.length - 1
    const moveUp = currentNumber > firstItem ? currentNumber - 1 : lastItem
    const moveDown = currentNumber < lastItem ? currentNumber + 1 : firstItem

    // Expect event.key to be only one of what we support in the list above
    if (Object.values(SUPPORTED_KEYS).includes(event.key)) {
      event.preventDefault()
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
}

interface RefObject<T> {
  // Not readonly because we manipulate it with mergeRefs
  current: T | null
}

const mergeRefs = (...refs: Array<RefObject<HTMLElement>>) => {
  return (node: HTMLElement) => {
    for (const ref of refs) {
      ref.current = node
    }
  }
}

export function createKeyboardNavHook(instance: KeyboardNav) {
  return function useKeyboardNav(
    label: string,
    parentRef?: RefObject<HTMLElement>,
  ) {
    const refs = useCallback(
      (node: HTMLElement) => {
        if (parentRef) {
          mergeRefs(parentRef)(node)
        }
        if (node === null) {
          instance.unsubscribe(label)
        } else {
          instance.subscribe(label, node)
        }
      },
      [instance.subscribe, instance.unsubscribe, parentRef, label],
    )
    return refs
  }
}
