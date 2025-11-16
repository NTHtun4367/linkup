import { Router } from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessageByUserId,
  sendMessage,
} from "../controllers/message";
import { protect } from "../middlewares/auth";
import { arcjetProtection } from "../middlewares/arcjet";
import { sendMessageValidator } from "../validators/message";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

router.use(arcjetProtection, protect);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessageByUserId);
router.post("/send/:id", sendMessageValidator, validateRequest, sendMessage);

export default router;
