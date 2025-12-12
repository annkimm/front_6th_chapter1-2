import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";
import { VNodeChild } from "../type";

export function renderElement(vNode: VNodeChild, container: HTMLElement) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.

  const node = normalizeVNode(vNode);

  if (!container.firstChild) {
    const elements = createElement(node);
    container.append(elements);
  } else {
    updateElement(container, node, container["_vNode"]);
  }

  container["_vNode"] = node;

  return setupEventListeners(container);
}
