export interface PropsSelectorDescriptor<T> {
  jsxte_ssc_selector_token: "jsxte_ssc_selector_token";
  selector: string;
  type: "input" | "radio" | "checkbox" | "select" | "event";
  list: boolean;
  propType?: T;
}

export interface SinglePropSelectorDescriptor<T>
  extends PropsSelectorDescriptor<T> {
  list: false;
}

export interface ArrayPropsSelectorDescriptor<T>
  extends PropsSelectorDescriptor<T> {
  list: true;
}
