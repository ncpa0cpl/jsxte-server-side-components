import type {
  ArrayPropsSelectorDescriptor,
  SinglePropSelectorDescriptor,
} from "./props-selector-types";

export const QueryInputValue = (
  querySelector: string
): SinglePropSelectorDescriptor<string> => {
  return {
    jsxte_ssc_selector_token: "jsxte_ssc_selector_token",
    list: false,
    selector: querySelector,
    type: "input",
  };
};

export const QueryCheckboxValue = (
  querySelector: string
): SinglePropSelectorDescriptor<[value: string, isChecked: boolean]> => {
  return {
    jsxte_ssc_selector_token: "jsxte_ssc_selector_token",
    list: false,
    selector: querySelector,
    type: "checkbox",
  };
};

export const QuerySelectorValue = (
  querySelector: string
): SinglePropSelectorDescriptor<string> => {
  return {
    jsxte_ssc_selector_token: "jsxte_ssc_selector_token",
    list: false,
    selector: querySelector,
    type: "select",
  };
};

export const QueryRadioValue = (
  querySelector: string
): SinglePropSelectorDescriptor<string> => {
  return {
    jsxte_ssc_selector_token: "jsxte_ssc_selector_token",
    list: false,
    selector: querySelector,
    type: "radio",
  };
};

export const QueryAllInputValue = (
  querySelector: string
): ArrayPropsSelectorDescriptor<string> => {
  return {
    jsxte_ssc_selector_token: "jsxte_ssc_selector_token",
    list: true,
    selector: querySelector,
    type: "input",
  };
};

export const QueryAllCheckboxValue = (
  querySelector: string
): ArrayPropsSelectorDescriptor<[value: string, isChecked: boolean]> => {
  return {
    jsxte_ssc_selector_token: "jsxte_ssc_selector_token",
    list: true,
    selector: querySelector,
    type: "checkbox",
  };
};

export const QueryAllSelectorValue = (
  querySelector: string
): ArrayPropsSelectorDescriptor<string> => {
  return {
    jsxte_ssc_selector_token: "jsxte_ssc_selector_token",
    list: true,
    selector: querySelector,
    type: "select",
  };
};

export const ExtractFromEvent = <
  E extends Event,
  EXTR extends
    | string
    | boolean
    | number
    | Array<string | boolean | number>
    | Array<[string, boolean]>
>(
  extractor: (e: E) => EXTR
): SinglePropSelectorDescriptor<EXTR> => {
  return {
    jsxte_ssc_selector_token: "jsxte_ssc_selector_token",
    list: false,
    selector: extractor.toString(),
    type: "event",
  };
};
