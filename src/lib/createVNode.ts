import { VNode, VNodeChild } from "../type";

export function createVNode(
  type: string | Function,
  props: Record<string, any> | null,
  ...children: VNodeChild[]
): VNode {
  return {
    type,
    props,
    children: children
      .flat(2)
      .filter((child) => child !== null && child !== undefined && child !== true && child !== false) as VNodeChild[],
  };
}
