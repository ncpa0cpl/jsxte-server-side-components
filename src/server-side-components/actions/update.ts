import type { SSCPropsFor } from "../../props-selector/ssc-props-for";
import type { SSCComponentInstance } from "../ssc-component-types";

export const update = <P extends object>(
  ssc: SSCComponentInstance<P>,
  props: SSCPropsFor<P>
) => {
  return `ssc_updateComponent('${ssc.id}', event, '${Buffer.from(
    JSON.stringify(props)
  ).toString("base64")}')`;
};
