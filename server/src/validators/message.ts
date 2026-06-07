import { body } from "express-validator";

export const sendMessageValidator = [
  // At least one of text, image_url, or file_data is required
  body().custom((value) => {
    if (!value.text && !value.image_url && !value.file_data) {
      throw new Error("Either text, image, or file is required.");
    }
    return true;
  }),
];
