import type { Express } from "express";
import { Router } from "express";
import { renderToHtmlAsync } from "jsxte";
import { jsx } from "jsxte/jsx-runtime";
import { v4 } from "uuid";
import type { SSCComponent, SSCComponentProps } from "./ssc-component-types";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "server-component": {
        "data-component-endpoint": string;
        "data-sscuid": string;
        "data-expire"?: string;
        "data-use-cache"?: "true" | "false";
        children?: JSX.Element | JSX.Element[] | string | string[];
      };
    }
  }
}

const SSCRouter = Router();
let isUsed = false;

const useSSCRouter = (app: Express) => {
  if (isUsed) return;

  app.use(SSCRouter);
  isUsed = true;
};

export const createSSC = <P extends object>(
  Component: JSX.Component<P> | JSX.AsyncComponent<P>,
  urlprefix = ""
): SSCComponent<P> => {
  const sscUID = Buffer.from(Component.name).toString("base64");
  const url = "/" + [urlprefix, "ssc", sscUID].filter((e) => e).join("/");

  const ServerComponent: JSX.Component<SSCComponentProps<P>> = ({
    cacheExpire,
    useCache,
    ...props
  }) => {
    return (
      <server-component
        data-sscuid={sscUID}
        data-component-endpoint={url}
        data-expire={cacheExpire?.toString()}
        data-use-cache={useCache ? "true" : "false"}
      >
        {
          // @ts-expect-error
          jsx(Component, props)
        }
      </server-component>
    );
  };

  const newInstance = () => {
    const instanceUUID = v4().replace("-", "");

    const InstanceServerComponent: JSX.Component<SSCComponentProps<P>> = ({
      cacheExpire,
      useCache,
      ...props
    }) => {
      return (
        <server-component
          data-sscuid={instanceUUID}
          data-component-endpoint={url}
          data-expire={cacheExpire?.toString()}
          data-use-cache={useCache ? "true" : "false"}
        >
          {
            // @ts-expect-error
            jsx(Component, props)
          }
        </server-component>
      );
    };

    return {
      id: instanceUUID,
      Component: InstanceServerComponent,
    };
  };

  const add = (app: Express) => {
    useSSCRouter(app);
    SSCRouter.post(url, async (req, resp) => {
      const html = await renderToHtmlAsync(Component, req.body);
      resp.send(html);
    });
  };

  return {
    id: sscUID,
    url,
    newInstance,
    add,
    Component: ServerComponent,
  };
};
