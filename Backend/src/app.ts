import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { config } from "./config/env";

const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else if (config.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use("/api", routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
