import express from "express";

import roleRouter from "./roleRouter.js";

const RouterV1 = express.Router();

RouterV1.use('/role', roleRouter);

export default RouterV1;