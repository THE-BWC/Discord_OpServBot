import express from "express";
import RoleController from "../controllers/role.controller.js";

const roleRouter = express.Router();

// bot/api/v?/role => POST
roleRouter.post('/sync', RoleController.sync)
roleRouter.post('/revoke', RoleController.revoke)
roleRouter.post('/give', RoleController.give)
roleRouter.post('/remove', RoleController.remove)

// bot/api/v?/role => GET
roleRouter.get('/fetchallroles', RoleController.fetchAllRoles)
roleRouter.get('/forcesyncusers', RoleController.forceSyncUsers)

export default roleRouter;