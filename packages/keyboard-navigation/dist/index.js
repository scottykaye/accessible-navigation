// index.ts
import {useCallback} from "react";
function createKeyboardNavHook(instance) {
  return function useKeyboardNav(label, parentRef) {
    const refs = useCallback((node) => {
      if (parentRef) {
        mergeRefs(parentRef)(node);
      }
      if (node === null) {
        instance.unsubscribe(label);
      } else {
        instance.subscribe(label, node);
      }
    }, [instance.subscribe, instance.unsubscribe, parentRef, label]);
    return refs;
  };
}
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
  constructor(orientation = "vertical") {
    this.orientation = orientation;
    this.observers = {};
  }
  view() {
    console.log(this.observers);
  }
  subscribe(label, element) {
    this.observers = { ...this.observers, ...{ [label]: element } };
  }
  unsubscribe(label) {
    delete this.observers[label];
  }
  update(event, current) {
    const labelList = Object.keys(this.observers);
    const currentNumber = labelList.findIndex((item) => item === current);
    const firstItem = 0;
    const lastItem = labelList.length - 1;
    const moveUp = currentNumber > firstItem ? currentNumber - 1 : lastItem;
    const moveDown = currentNumber < lastItem ? currentNumber + 1 : firstItem;
    if (Object.values(SUPPORTED_KEYS).includes(event.key)) {
      event.preventDefault();
      switch (event.key) {
        case SUPPORTED_KEYS.HOME:
          this.observers[labelList[firstItem]].focus();
          break;
        case SUPPORTED_KEYS.END:
          this.observers[labelList[lastItem]].focus();
          break;
      }
      if (this.orientation === "vertical") {
        switch (event.key) {
          case SUPPORTED_KEYS.ARROW_UP:
            this.observers[labelList[moveUp]].focus();
            break;
          case SUPPORTED_KEYS.ARROW_DOWN:
            this.observers[labelList[moveDown]].focus();
            break;
        }
      }
      if (this.orientation === "horizontal") {
        switch (event.key) {
          case SUPPORTED_KEYS.ARROW_LEFT:
            this.observers[labelList[moveUp]].focus();
            break;
          case SUPPORTED_KEYS.ARROW_RIGHT:
            this.observers[labelList[moveDown]].focus();
            break;
        }
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
export {
  createKeyboardNavHook,
  KeyboardNav
};
