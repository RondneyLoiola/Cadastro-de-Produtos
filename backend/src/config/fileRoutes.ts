import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

//__dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadPath = resolve(__dirname, "..", "..", "uploads", "productsImg");
const fileRouteConfig = express.static(uploadPath);

export default fileRouteConfig;
