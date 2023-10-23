import { BWC_Client } from "../lib/index.js";
import { Router, Request, Response } from "express";

export interface INTApi {
    init(client: BWC_Client, enableHttps?: boolean): Promise<void>;
}

export interface INTRouterV1 {
    init(): Promise<Router>;
}

export interface INTRoleRouter {
    init(): Promise<Router>;
}

export interface INTRoleController {
    sync(req: Request, res: Response): Promise<Response<any, Record<string, any>> | {ERROR_EMPTY_BODY: string}>;
    revoke(req: Request, res: Response): Promise<void>;
    give(req: Request, res: Response): Promise<void>;
    remove(req: Request, res: Response): Promise<void>;
    fetchAllRoles(req: Request, res: Response): Promise<void>;
    forceSyncUsers(req: Request, res: Response): Promise<void>;
}