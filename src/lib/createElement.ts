import { VNode, VNodeChild } from "../type";
import { addEvent } from "./eventManager";

export function createElement(vNode: VNodeChild) {
  if (typeof vNode === "boolean" || vNode === undefined || vNode === null) {
    return createTextNode("");
  }

  const node = vNode as VNode;

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((item) => {
      fragment.appendChild(createElement(item));
    });

    return fragment;
  }

  if (typeof node.type === "string") {
    const tag = updateAttributes(createTag(node.type), node.props);

    node.children.forEach((item) => {
      tag.appendChild(createElement(item));
    });

    return tag;
  }

  if (typeof node?.type === "function") {
    throw Error();
  }

  return createTextNode(`${vNode}`);
}

function createTextNode(text: string) {
  return document.createTextNode(text);
}

function createTag(type: string) {
  return document.createElement(type);
}

function updateAttributes($el: HTMLElement, props: Record<string, any> | null) {
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key.startsWith("on")) {
        // addEvent 사용! (이벤트 위임)
        const eventType = key.slice(2).toLowerCase(); // onClick → click
        addEvent($el, eventType, value);
      } else {
        if (["checked", "selected", "disabled", "readOnly"].includes(key)) {
          $el[key] = value;
        } else {
          $el.setAttribute(key === "className" ? "class" : key, value);
        }
      }
    }
  }

  return $el;
}
