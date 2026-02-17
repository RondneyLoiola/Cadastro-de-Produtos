import cors from "cors";
import express, { type Application } from "express";
import fileRouteConfig from "./config/fileRoutes.js";
import routes from "./routes";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use("/product-file", fileRouteConfig);

app.use(routes);

export default app;
