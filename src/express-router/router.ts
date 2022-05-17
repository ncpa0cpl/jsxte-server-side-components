import { Router } from "express";

export const SSCRouter = Router();
export const routerState = { path: "", isRegistered: false };
export const onRouterRegisterCallbacks = new Set<() => void>();
