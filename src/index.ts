import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", userRoutes());

app.listen(3333, () => {
  console.log("API está rodando!");
});
