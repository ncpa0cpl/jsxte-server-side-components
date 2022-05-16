export { BrowserScript } from "./components/browser-script";
export {
  ExtractFromEvent,
  QueryAllCheckboxValue,
  QueryAllInputValue,
  QueryAllSelectorValue,
  QueryCheckboxValue,
  QueryInputValue,
  QueryRadioValue,
  QuerySelectorValue,
} from "./props-selector/props-selector";
export { createSSC } from "./server-side-components/create-ssc";
import { clearCache } from "./server-side-components/actions/clear-cache";
import { combine } from "./server-side-components/actions/combine";
import { onEvent } from "./server-side-components/actions/event-handler";
import { update } from "./server-side-components/actions/update";

export const ServerAction = {
  update,
  clearCache,
  combine,
  onEvent,
};
