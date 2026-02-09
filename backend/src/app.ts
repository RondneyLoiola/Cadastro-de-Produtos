import cors from "cors";
import express, { type Application } from "express";
import routes from "./routes";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use(routes);

export default app;
