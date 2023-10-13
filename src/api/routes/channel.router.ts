import express from "express";
import ChannelController from "../controllers/channel.controller.js";

const channelRouter = express.Router();

// bot/api/v?/channel => GET
channelRouter.get('/getAllVoiceChannels', ChannelController.getAllVoiceChannels)

export default channelRouter;