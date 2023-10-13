import express from "express";
import NicknameController from "../controllers/nickname.controller.js";

const nicknameRouter = express.Router();

// bot/api/v?/nickname => POST
nicknameRouter.post('/set', NicknameController.set)

export default nicknameRouter;