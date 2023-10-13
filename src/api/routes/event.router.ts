import express from "express";
import eventController from "../controllers/event.controller.js";

const eventRouter = express.Router();

// bot/api/v?/event => POST
eventRouter.post('/sync', eventController.sync)
eventRouter.post('/create', eventController.create)
eventRouter.post('/singeUpdate', eventController.updateEvent)
eventRouter.post('/singeUpdate', eventController.updateEvents)
eventRouter.post('/delete', eventController.deleteEvent)

export default eventRouter;