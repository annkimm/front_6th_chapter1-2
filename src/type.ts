export interface VNode {
  type: string | Function;
  props: Record<string, any> | null;
  children: VNodeChild[];
}

export type VNodeChild =
  | string
  | number
  | VNode // 다른 VNode
  | boolean
  | null
  | undefined
  | VNodeChild[]; // 중첩 배열! (재귀적 정의)
