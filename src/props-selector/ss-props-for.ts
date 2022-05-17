import type {
  ArrayPropsSelectorDescriptor,
  SinglePropSelectorDescriptor,
} from "./props-selector-types";

export type SSPropsFor<P extends object | any[]> = {
  [K in keyof P]: Exclude<P[K], undefined> extends [string, boolean][]
    ?
        | P[K]
        | ArrayPropsSelectorDescriptor<[value: string, isChecked: boolean]>
        | [
            ...Exclude<P[K], undefined>,
            SinglePropSelectorDescriptor<[value: string, isChecked: boolean]>
          ]
    : Exclude<P[K], undefined> extends string[] | boolean[]
    ?
        | P[K]
        | ArrayPropsSelectorDescriptor<P[K] extends (infer AT)[] ? AT : never>
        | [
            ...Exclude<P[K], undefined>,
            SinglePropSelectorDescriptor<P[K] extends (infer AT)[] ? AT : never>
          ]
    : Exclude<P[K], undefined> extends string | boolean
    ? SinglePropSelectorDescriptor<Exclude<P[K], undefined>> | P[K]
    : Exclude<P[K], undefined> extends object | any[]
    ? SSPropsFor<Exclude<P[K], undefined>> | P[K]
    : P[K];
};
