import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import seriesController from "./controllers/series.js";

const app = new Hono();

// Apply CORS middleware globally
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include HTTP methods
    allowHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  })
);

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

app.route("/series", seriesController);
//server start
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
