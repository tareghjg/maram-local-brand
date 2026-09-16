import express from "express";
import cors from "cors";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const connectDB = require("../server/config/db.js");
const orderRoutes = require("../server/routes/orderRoutes.js");
const productRoutes = require("../server/routes/productRoutes.js");
const uploadRoutes = require("../server/routes/uploadRoutes.js");

export const config = {
  api: {
    bodyParser: false,
  },
};

const app = express();
let databaseConnection;

app.use(cors());
app.use(express.json());

const ensureDatabase = async (req, res, next) => {
  try {
    if (!databaseConnection) {
      databaseConnection = connectDB();
    }

    await databaseConnection;
    next();
  } catch (error) {
    databaseConnection = null;
    console.error("Serverless database connection failed:", error.message);
    res.status(503).json({
      success: false,
      message: "Database is temporarily unavailable.",
    });
  }
};

app.get("/", (req, res) => {
  res.json({ message: "MARAM API is running" });
});

const apiRouter = express.Router();

apiRouter.use(ensureDatabase);

apiRouter.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is working correctly",
  });
});

apiRouter.use("/orders", orderRoutes);
apiRouter.use("/products", productRoutes);
apiRouter.use("/upload", uploadRoutes);

app.use("/api", apiRouter);
app.use("/", apiRouter);

export default app;
