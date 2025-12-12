import { addEvent, removeEvent } from "./eventManager.ts";
import { createElement } from "./createElement.ts";
import { normalizeVNode } from "./normalizeVNode.ts";
import { VNode, VNodeChild } from "../type.ts";

function updateAttributes(
  target: HTMLElement,
  originNewProps: Record<string, any> | null,
  originOldProps: Record<string, any> | null,
) {
  const originKeys = Object.keys(originOldProps ?? {});
  const newKeys = Object.keys(originNewProps ?? {});

  const keys = [...new Set([...originKeys, ...newKeys])];

  for (const key of keys) {
    const originValue = originOldProps ? originOldProps[key] : null;
    const newValue = originNewProps ? originNewProps[key] : null;

    if (originValue === newValue) {
      continue;
    } else {
      if (newValue && !originValue) {
        if (key.startsWith("on")) {
          // addEvent 사용! (이벤트 위임)
          const eventType = key.slice(2).toLowerCase(); // onClick → click
          addEvent(target, eventType, newValue);
        } else {
          if (["checked", "selected", "disabled", "readOnly"].includes(key)) {
            target[key] = newValue;
          } else {
            target.setAttribute(key === "className" ? "class" : key, newValue);
          }
        }
      }
      if (newValue !== undefined && originValue !== undefined) {
        if (key.startsWith("on")) {
          // addEvent 사용! (이벤트 위임)
          const eventType = key.slice(2).toLowerCase(); // onClick → click
          removeEvent(target, eventType, originValue);
          addEvent(target, eventType, newValue);
        } else {
          if (["checked", "selected", "disabled", "readOnly"].includes(key)) {
            target[key] = newValue;
          } else {
            target.setAttribute(key === "className" ? "class" : key, newValue);
          }
        }
      } else if (!newValue && originValue) {
        if (key.startsWith("on")) {
          // addEvent 사용! (이벤트 위임)
          const eventType = key.slice(2).toLowerCase(); // onClick → click
          removeEvent(target, eventType, originValue);
        } else {
          target.removeAttribute(key === "className" ? "class" : key);
        }
      }
    }
  }

  return target;
}

export function updateElement(parentElement: HTMLElement, newNode: VNodeChild, oldNode: VNodeChild, index = 0) {
  const rNewNode = newNode as VNode;
  const rOldNode = oldNode as VNode;

  if (!oldNode && newNode) {
    // 새 요소 추가!
    parentElement.appendChild(createElement(rNewNode));
  } else if (oldNode && !newNode) {
    // 자식 제거할 때 children 범위가 앞당겨질 경우, index가 벗어나지 않도록 조정
    const oldIndex = parentElement.childNodes.length <= index ? parentElement.childNodes.length - 1 : index;
    const oldElement = parentElement.childNodes?.[oldIndex];

    if (oldElement) {
      // 요소 제거!
      parentElement.removeChild(oldElement);
    }
  } else if (rNewNode?.type !== rOldNode?.type) {
    const node = createElement(rNewNode);

    // 완전 교체!
    parentElement.replaceChild(node, parentElement.childNodes[index]);
  } else if (typeof newNode === "string") {
    if (newNode !== oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
  } else {
    const element = parentElement.childNodes[index];
    // 속성 업데이트
    const target = updateAttributes(element as HTMLElement, rNewNode.props, rOldNode.props);

    // 자식들 재귀 업데이트!
    const maxLength = Math.max((rNewNode.children || []).length, (rOldNode.children || []).length);
    for (let i = 0; i < maxLength; i++) {
      updateElement(target, rNewNode.children[i] ?? null, rOldNode.children[i], i);
    }
  }

  return parentElement;
}
