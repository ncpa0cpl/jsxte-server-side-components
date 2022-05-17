import type { SSPropsFor } from "../../props-selector/ss-props-for";
import type { ServerSideAction } from "../../server-side-actions/ssa-types";

export const executeServerAction = <P extends object>(
  action: ServerSideAction<P, any>,
  params: SSPropsFor<P>,
  cache?: false | { expire: number }
) => {
  if (cache === false) {
    return `ssa_executeServerAction("${action.id}" ,"${
      action.url
    }", "${Buffer.from(JSON.stringify(params)).toString("base64")}", false)`;
  } else {
    return `ssa_executeServerAction("${action.id}" ,"${
      action.url
    }", "${Buffer.from(JSON.stringify(params)).toString("base64")}", true, ${
      cache?.expire ?? "undefined"
    })`;
  }
};
