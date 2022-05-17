import type { Express } from "express";
import { onRouterRegisterCallbacks, routerState, SSCRouter } from "./router";

/**
 * Registers the Server Side Component to the Express App, this
 * allows clients to fetch component updates from the server.
 *
 * @param app Express app
 * @param path Path under which Server Side Components and Server
 *   Side Actions endpoints will be available. This defaults to `/ssc`.
 */
export const register = (app: Express, path = "/ssc") => {
  if (routerState.isRegistered) {
    throw new Error(
      "Server Side Components have already been registered with an Express App."
    );
  }

  app.use(path, SSCRouter);
  routerState.path = path;
  routerState.isRegistered = true;

  onRouterRegisterCallbacks.forEach((callback) => callback());
  onRouterRegisterCallbacks.clear();
};
