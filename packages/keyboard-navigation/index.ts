import { useCallback, useSyncExternalStore } from 'react'

const SUPPORTED_KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const

type Orientation = 'vertical' | 'horizontal'

export class KeyboardNav {
  readonly orientation: Orientation
  observers: Record<string, HTMLElement>
  private listeners: Set<() => void>

  constructor(orientation: Orientation = 'vertical') {
    this.orientation = orientation
    this.observers = {}
    this.listeners = new Set()
  }

  // For useSyncExternalStore - must be arrow function to preserve `this`
  subscribeToStore = (callback: () => void) => {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // For useSyncExternalStore - must be arrow function to preserve `this`
  getSnapshot = () => this.observers

  private notify() {
    this.listeners.forEach((cb) => cb())
  }

  subscribe(label: string, element: HTMLElement): void {
    this.observers = { ...this.observers, [label]: element }
    this.notify()
  }

  unsubscribe(label: string): void {
    const { [label]: _, ...rest } = this.observers
    this.observers = rest
    this.notify()
  }

  update(event: KeyboardEvent | React.KeyboardEvent, current: string): void {
    const keys = Object.values(SUPPORTED_KEYS)
    if (!keys.includes(event.key as (typeof keys)[number])) return

    event.preventDefault()

    const labelList = Object.keys(this.observers)
    const currentIndex = labelList.findIndex((item) => item === current)
    const firstItem = 0
    const lastItem = labelList.length - 1
    const moveUp = currentIndex > firstItem ? currentIndex - 1 : lastItem
    const moveDown = currentIndex < lastItem ? currentIndex + 1 : firstItem

    switch (event.key) {
      case SUPPORTED_KEYS.HOME:
        this.observers[labelList[firstItem]]?.focus()
        break
      case SUPPORTED_KEYS.END:
        this.observers[labelList[lastItem]]?.focus()
        break
    }

    if (this.orientation === 'vertical') {
      switch (event.key) {
        case SUPPORTED_KEYS.ARROW_UP:
          this.observers[labelList[moveUp]]?.focus()
          break
        case SUPPORTED_KEYS.ARROW_DOWN:
          this.observers[labelList[moveDown]]?.focus()
          break
      }
    }

    if (this.orientation === 'horizontal') {
      switch (event.key) {
        case SUPPORTED_KEYS.ARROW_LEFT:
          this.observers[labelList[moveUp]]?.focus()
          break
        case SUPPORTED_KEYS.ARROW_RIGHT:
          this.observers[labelList[moveDown]]?.focus()
          break
      }
    }
  }
}

interface RefObject<T> {
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
    // Subscribe to store for concurrent-safe updates in React 18+
    useSyncExternalStore(
      instance.subscribeToStore,
      instance.getSnapshot,
      instance.getSnapshot, // SSR fallback
    )

    const refs = useCallback(
      (node: HTMLElement | null) => {
        if (parentRef) {
          mergeRefs(parentRef)(node)
        }
        if (node === null) {
          instance.unsubscribe(label)
        } else {
          instance.subscribe(label, node)
        }
      },
      [label, parentRef],
    )

    return refs
  }
}
