import { BrowserScript } from "./components/browser-script";
import { register } from "./express-router/register";
import {
  ExtractFromEvent,
  QueryAllCheckboxValue,
  QueryAllInputValue,
  QueryAllSelectorValue,
  QueryCheckboxValue,
  QueryInputValue,
  QueryRadioValue,
  QuerySelectorValue,
} from "./props-selector/props-selector";
import { createSSA } from "./server-side-actions/create-ssa";
import { createSSC } from "./server-side-components/create-ssc";

import { clearCache } from "./server-side-components/actions/clear-cache";
import { combine } from "./server-side-components/actions/combine";
import { onEvent } from "./server-side-components/actions/event-handler";
import { executeServerAction } from "./server-side-components/actions/execute-server-action";
import { update } from "./server-side-components/actions/update";

export type {
  ArrayPropsSelectorDescriptor,
  PropsSelectorDescriptor,
  SinglePropSelectorDescriptor,
} from "./props-selector/props-selector-types";
export type { SSPropsFor as SSCPropsFor } from "./props-selector/ss-props-for";
export type { ServerSideAction } from "./server-side-actions/ssa-types";
export type {
  SSCComponent,
  SSCComponentInstance,
  SSCComponentProps,
} from "./server-side-components/ssc-types";
export {
  createSSA,
  createSSC,
  BrowserScript,
  register,
  ExtractFromEvent,
  QueryAllCheckboxValue,
  QueryAllInputValue,
  QueryAllSelectorValue,
  QueryCheckboxValue,
  QueryInputValue,
  QueryRadioValue,
  QuerySelectorValue,
};

export const ClientAction = {
  update,
  clearCache,
  combine,
  onEvent,
  executeServerAction,
};

export default {
  BrowserScript,
  createSSA,
  createSSC,
  ExtractFromEvent,
  QueryAllCheckboxValue,
  QueryAllInputValue,
  QueryAllSelectorValue,
  QueryCheckboxValue,
  QueryInputValue,
  QueryRadioValue,
  QuerySelectorValue,
  register,
  ClientAction,
};
