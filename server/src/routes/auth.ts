import { Router } from "express";
import {
  loginValidator,
  registerValidator,
  uploadProfileImageValidator,
} from "../validators/user";
import { validateRequest } from "../middlewares/validateRequest";
import {
  getUserInfo,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/auth";
import { protect } from "../middlewares/auth";
import { arcjetProtection } from "../middlewares/arcjet";

const router = Router();

router.use(arcjetProtection);

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.post("/logout", logout);
router.put(
  "/update-profile",
  uploadProfileImageValidator,
  validateRequest,
  protect,
  updateProfile
);
router.get("/me", protect, getUserInfo);

export default router;
