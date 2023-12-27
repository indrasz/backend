import express from "express";
import {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
} from "../../controllers/admin/UserControllerAdmin.js";
import {
  getMenu,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../../controllers/admin/MenuControllerAdmin.js";
import {
  getBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita,
} from "../../controllers/admin/BeritaControllerAdmin.js";
import { refreshToken } from "../../controllers/admin/RefreshTokenAdmin.js";
import { verifyToken } from "../../middleware/admin/VerifyToken.js";

const router = express.Router();

// router user
router.get("/api/auth/users", verifyToken, getUsers);
router.post("/api/auth/create", registerUser);
router.post("/api/auth/login", loginUser);
router.get("/api/auth/token", refreshToken);
router.delete("/api/auth/logout", logoutUser);

// router menu
router.get("/api/menus", getMenu);
router.get("/api/menu/:id", getMenuById);
router.post("/api/menu/create", createMenu);
router.patch("/api/menu/edit/:id", updateMenu);
router.delete("/api/menu/delete/:id", deleteMenu);

// router berita
router.get("/api/berita", getBerita);
router.get("/api/berita/:id", getBeritaById);
router.post("/api/berita/create", createBerita);
router.patch("/api/berita/edit/:id", updateBerita);
router.delete("/api/berita/delete/:id", deleteBerita);

export default router;
