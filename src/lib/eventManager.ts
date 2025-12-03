const eventMap = new WeakMap();
const eventTypes = new Set<string>();
const listenerMap = new Map();

export function setupEventListeners(root: HTMLElement) {
  for (const eventType of eventTypes) {
    const existingListener = listenerMap.get(eventType);

    if (existingListener) {
      root.removeEventListener(eventType, existingListener); // 같은 함수!
    }

    const newListener = (e: Event) => {
      const target = e.target; // 클릭된 요소
      const handlers = eventMap.get(target as EventTarget)?.[eventType]; // 그 요소의 click 핸들러들
      handlers?.forEach((h: Function) => h(e)); // 실행!
    };
    listenerMap.set(eventType, newListener);
    root.addEventListener(eventType, newListener);
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
