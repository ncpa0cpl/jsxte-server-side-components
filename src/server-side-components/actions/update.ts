import type { SSPropsFor } from "../../props-selector/ss-props-for";
import type { SSCComponentInstance } from "../ssc-types";

export const update = <P extends object>(
  ssc: SSCComponentInstance<P>,
  props: SSPropsFor<P>
) => {
  return `ssc_updateComponent('${ssc.id}', event, '${Buffer.from(
    JSON.stringify(props)
  ).toString("base64")}')`;
};
