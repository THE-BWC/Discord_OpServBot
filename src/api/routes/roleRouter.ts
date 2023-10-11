import express from "express";
import roleController from "../controllers/role.controller.js";

const roleRouter = express.Router();

// bot/api/v?/role => POST
roleRouter.post('/sync', roleController.sync)
roleRouter.post('/revoke', roleController.revoke)
roleRouter.post('/give', roleController.give)
roleRouter.post('/remove', roleController.remove)

// bot/api/v?/role => GET
roleRouter.get('/fetchallroles', roleController.fetchAllRoles)
roleRouter.get('/forcesyncusers', roleController.forceSyncUsers)

export default roleRouter;