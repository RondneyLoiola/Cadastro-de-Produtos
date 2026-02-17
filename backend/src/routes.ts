import { Router } from "express";
import CategoryController from "./app/controllers/categoryController";
import productController from "./app/controllers/productController";
import sessionController from "./app/controllers/sessionController";
import UserController from "./app/controllers/userController";
import { requireAdmin } from "./app/middleware/auth";
import { upload } from "./config/multer";

const router = Router();

router.post("/session", sessionController.store);

router.post("/user", UserController.store);
router.get("/user", UserController.index);
router.get("/user/:userId", UserController.getUserById);
router.delete("/user/:userId", UserController.delete);

router.post("/categories", requireAdmin, CategoryController.store);
router.get("/categories", CategoryController.index);
router.get("/categories/:categoryId", CategoryController.show);
router.put("/categories/:categoryId", requireAdmin, CategoryController.update);
router.delete(
	"/categories/:categoryId",
	requireAdmin,
	CategoryController.delete,
);

router.post("/products", requireAdmin, upload.single("image"), productController.store);
router.get("/products", productController.index);
router.get("/products/:productId", productController.show);
router.put("/products/:productId", requireAdmin, upload.single("image"), productController.edit);
router.delete("/products/:productId", requireAdmin, productController.delete);

export default router;
