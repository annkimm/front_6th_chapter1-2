import { VNode, VNodeChild } from "../type";

export function normalizeVNode(vNode: VNodeChild) {
  if (typeof vNode === "boolean" || typeof vNode === "undefined" || vNode === null) {
    return "";
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return `${vNode}`;
  }

  const node = vNode as VNode;

  if (typeof node.type === "function") {
    return normalizeVNode(node.type({ ...node.props, children: node.children }));
  }

  if ((node?.children ?? []).length > 0) {
    return { ...vNode, children: node.children.map((child) => normalizeVNode(child)) };
  }

  return vNode;
}
