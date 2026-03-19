import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import openaiChatRouter from "./openai/chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use("/openai", openaiChatRouter);

export default router;
