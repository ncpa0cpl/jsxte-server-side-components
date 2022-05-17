import type { Request } from "express";
import { renderToHtmlAsync } from "jsxte";
import { jsx } from "jsxte/jsx-runtime";
import { v4 } from "uuid";
import { routerState, SSCRouter } from "../express-router/router";
import type { SSCComponent, SSCComponentProps } from "./ssc-types";

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

/**
 * Creates a new Server Side Component.
 *
 * @param uniqueName A unique name used to identify this
 *   component. It should be different for each server side component.
 * @param Component A functional component, takes an optional
 *   props property `request` which contains en Express `Request`
 *   object or an undefined value. `request` is populated only if
 *   the components is being updated per the client request, it
 *   is always undefined during the initial render.
 */
export const createSSC = <P extends object>(
  uniqueName: string,
  Component:
    | ((props: P & { request?: Request }) => JSX.Element)
    | ((props: P & { request?: Request }) => Promise<JSX.Element>)
): SSCComponent<P> => {
  const sscUID = Buffer.from(uniqueName).toString("base64");

  let urlMemo: string | null = null;
  const getUrl = () => {
    if (!routerState.isRegistered) {
      throw new Error(
        "Server Side Components are being used but have not been registered. Make sure to register them before rendering!"
      );
    }

    if (urlMemo !== null) {
      return urlMemo;
    }

    urlMemo =
      "/" +
      [routerState.path.replace(/^\//, ""), "component", sscUID]
        .filter((e) => e)
        .join("/");

    return urlMemo;
  };

  const ServerComponent: JSX.Component<SSCComponentProps<P>> = ({
    cacheExpire,
    useCache,
    ...props
  }) => {
    return (
      <server-component
        data-sscuid={sscUID}
        data-component-endpoint={getUrl()}
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
          data-component-endpoint={getUrl()}
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

  SSCRouter.post(`/component/${sscUID}`, async (request, resp) => {
    try {
      const html = await renderToHtmlAsync(Component, {
        ...request.body,
        request,
      });
      resp.send(html);
    } catch (e) {
      resp.sendStatus(500);
    }
  });

  return {
    id: sscUID,
    get url() {
      return getUrl();
    },
    newInstance,
    Component: ServerComponent,
  };
};
