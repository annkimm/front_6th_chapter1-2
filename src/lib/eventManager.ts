const eventMap = new WeakMap();
const eventTypes = new Set<string>();
const listenerMap = new Map();
let rootContainer: null | HTMLElement = null;

const newListener = (e: Event) => {
  let target = e.target; // 클릭된 요소

  while (target && target !== rootContainer) {
    const handlers = eventMap.get(target)?.[e.type]; // 그 요소의 click 핸들러들

    if (handlers) {
      handlers?.forEach((h: Function) => h && h(e)); // 실행!
      return;
    }

    target = (target as HTMLElement)?.parentNode;
  }
};

export function setupEventListeners(root: HTMLElement) {
  rootContainer = root;

  for (const eventType of eventTypes) {
    const existingListener = listenerMap.get(eventType);

    rootContainer.removeEventListener(eventType, existingListener); // 같은 함수!
    listenerMap.set(eventType, newListener);
    rootContainer.addEventListener(eventType, newListener);
  }
}

export function addEvent(element: HTMLElement, eventType: string, handler: Function) {
  const events = eventMap.get(element);
  if (events?.[eventType]) {
    eventMap.set(element, { ...events, [eventType]: [...events?.[eventType], handler] });
  } else {
    eventMap.set(element, { ...events, [eventType]: [handler] });
  }

  eventTypes.add(eventType);
}

export function removeEvent(element: HTMLElement, eventType: string, handler: Function) {
  const eventElement = eventMap.get(element);
  const handlers = eventElement[eventType];
  if (handlers) {
    const newHanlder = handlers.filter((item: Function) => item !== handler);

    if (newHanlder.length === 0) {
      delete eventElement[eventType];
      eventMap.set(element, { ...eventElement });
    } else {
      eventMap.set(element, { ...eventElement, [eventType]: newHanlder });
    }
  }
}
