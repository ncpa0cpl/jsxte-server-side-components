import type { Request } from "express";
import { routerState, SSCRouter } from "../express-router/router";
import type { ServerSideAction } from "./ssa-types";

/**
 * Creates a new Server Side Component.
 *
 * @param uniqueName A unique name used to identify this action.
 *   It should be different for each server side action.
 * @param action A function, takes an optional parameter
 *   `request` which contains en Express `Request` object or an
 *   undefined value. `request` is populated only if the actions
 *   is being called from a client, it is always undefined when
 *   called from within the server side code.
 */
export const createSSA = <P extends object, R extends void | Promise<void>>(
  uniqueName: string,
  action: (params: P, request?: Request) => R
): ServerSideAction<P, R> => {
  const ssaUID = Buffer.from(uniqueName).toString("base64");

  let urlMemo: string | null = null;
  const getUrl = () => {
    if (!routerState.isRegistered) {
      throw new Error(
        "Server Side Actions are being used but have not been registered. Make sure to register them before executing!"
      );
    }

    if (urlMemo !== null) {
      return urlMemo;
    }

    urlMemo =
      "/" +
      [routerState.path.replace(/^\//, ""), "action", ssaUID]
        .filter((e) => e)
        .join("/");

    return urlMemo;
  };

  SSCRouter.post(`/action/${ssaUID}`, async (request, resp) => {
    try {
      await action(request.body, request);
      resp.sendStatus(200);
    } catch (e) {
      resp.sendStatus(500);
    }
  });

  return {
    id: ssaUID,
    get url() {
      return getUrl();
    },
    run(params: P) {
      return action(params);
    },
  };
};
