import type { Express } from "express";

export type SSCComponentProps<P extends object> = P & {
  cacheExpire?: number;
  useCache?: boolean;
};

export type SSCComponentInstance<P extends object> = {
  id: string;
  Component: JSX.Component<SSCComponentProps<P>>;
};

export type SSCComponent<P extends object> = SSCComponentInstance<P> & {
  url: string;
  add(app: Express): void;
  newInstance(): SSCComponentInstance<P>;
};
