import { Router } from "express";
import CategoryController from "./app/controllers/categoryController";
import productController from "./app/controllers/productController";
import UserController from "./app/controllers/userController";

const router = Router();

router.post('/user', UserController.store);
router.get('/user', UserController.index);
router.get('/user/:userId', UserController.getUserById);
router.delete('/user/:userId', UserController.delete);

router.post("/categories", CategoryController.store);
router.get("/categories", CategoryController.index);
router.get("/categories/:categoryId", CategoryController.show);
router.put("/categories/:categoryId", CategoryController.update);
router.delete("/categories/:categoryId", CategoryController.delete);

router.post("/products", productController.store);
router.get("/products", productController.index);
router.get("/products/:productId", productController.show);
router.put("/products/:productId", productController.edit);
router.delete("/products/:productId", productController.delete);

export default router;
