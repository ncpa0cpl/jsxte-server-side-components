import type { SSCComponentInstance } from "../ssc-component-types";

export const clearCache = (ssc?: SSCComponentInstance<any>) => {
  if (ssc) {
    return `ssc_clearCache('${ssc.id}')`;
  }
  return "ssc_clearCache()";
};
