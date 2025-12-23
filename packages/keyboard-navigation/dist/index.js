// index.ts
import { useCallback, useSyncExternalStore } from "react";
var SUPPORTED_KEYS = {
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End"
};

class KeyboardNav {
  orientation;
  observers;
  listeners;
  constructor(orientation = "vertical") {
    this.orientation = orientation;
    this.observers = {};
    this.listeners = new Set;
  }
  subscribeToStore = (callback) => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };
  getSnapshot = () => this.observers;
  notify() {
    this.listeners.forEach((cb) => cb());
  }
  subscribe(label, element) {
    this.observers = { ...this.observers, [label]: element };
    this.notify();
  }
  unsubscribe(label) {
    const { [label]: _, ...rest } = this.observers;
    this.observers = rest;
    this.notify();
  }
  update(event, current) {
    const keys = Object.values(SUPPORTED_KEYS);
    if (!keys.includes(event.key))
      return;
    event.preventDefault();
    const labelList = Object.keys(this.observers);
    const currentIndex = labelList.findIndex((item) => item === current);
    const firstItem = 0;
    const lastItem = labelList.length - 1;
    const moveUp = currentIndex > firstItem ? currentIndex - 1 : lastItem;
    const moveDown = currentIndex < lastItem ? currentIndex + 1 : firstItem;
    switch (event.key) {
      case SUPPORTED_KEYS.HOME:
        this.observers[labelList[firstItem]]?.focus();
        break;
      case SUPPORTED_KEYS.END:
        this.observers[labelList[lastItem]]?.focus();
        break;
    }
    if (this.orientation === "vertical") {
      switch (event.key) {
        case SUPPORTED_KEYS.ARROW_UP:
          this.observers[labelList[moveUp]]?.focus();
          break;
        case SUPPORTED_KEYS.ARROW_DOWN:
          this.observers[labelList[moveDown]]?.focus();
          break;
      }
    }
    if (this.orientation === "horizontal") {
      switch (event.key) {
        case SUPPORTED_KEYS.ARROW_LEFT:
          this.observers[labelList[moveUp]]?.focus();
          break;
        case SUPPORTED_KEYS.ARROW_RIGHT:
          this.observers[labelList[moveDown]]?.focus();
          break;
      }
    }
  }
}
var mergeRefs = (...refs) => {
  return (node) => {
    for (const ref of refs) {
      ref.current = node;
    }
  };
};
function createKeyboardNavHook(instance) {
  return function useKeyboardNav(label, parentRef) {
    useSyncExternalStore(instance.subscribeToStore, instance.getSnapshot, instance.getSnapshot);
    const refs = useCallback((node) => {
      if (parentRef) {
        mergeRefs(parentRef)(node);
      }
      if (node === null) {
        instance.unsubscribe(label);
      } else {
        instance.subscribe(label, node);
      }
    }, [label, parentRef]);
    return refs;
  };
}
export {
  createKeyboardNavHook,
  KeyboardNav
};
