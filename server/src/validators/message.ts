import { body } from "express-validator";

export const sendMessageValidator = [
  body("text").notEmpty().withMessage("Text is required."),
];
