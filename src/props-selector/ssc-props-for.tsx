import type {
  ArrayPropsSelectorDescriptor,
  SinglePropSelectorDescriptor,
} from "./props-selector-types";

export type SSCPropsFor<P extends object | any[]> = {
  [K in keyof P]: P[K] extends [string, boolean][]
    ?
        | P[K]
        | ArrayPropsSelectorDescriptor<[value: string, isChecked: boolean]>
        | [
            ...P[K],
            SinglePropSelectorDescriptor<[value: string, isChecked: boolean]>
          ]
    : P[K] extends string[] | boolean[]
    ?
        | P[K]
        | ArrayPropsSelectorDescriptor<P[K] extends (infer AT)[] ? AT : never>
        | [
            ...P[K],
            SinglePropSelectorDescriptor<P[K] extends (infer AT)[] ? AT : never>
          ]
    : P[K] extends string | boolean
    ? SinglePropSelectorDescriptor<P[K]> | P[K]
    : P[K] extends object | any[]
    ? SSCPropsFor<P[K]> | P[K]
    : P;
};
