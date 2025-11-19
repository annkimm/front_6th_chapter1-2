interface VNode {
  type: string | Function;
  props: Record<string, any> | null;
  children: VNodeChild[];
}

type VNodeChild =
  | string
  | number
  | VNode // 다른 VNode
  | boolean
  | null
  | undefined
  | VNodeChild[]; // 중첩 배열! (재귀적 정의)

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
