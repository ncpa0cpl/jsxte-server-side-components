export const onEvent = <E extends Event>(params: {
  action: string;
  condition: (ev: E) => boolean;
}) => {
  return `(${params.condition.toString()})(event) && ${params.action}`;
};
