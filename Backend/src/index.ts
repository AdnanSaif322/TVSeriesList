import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import seriesController from "./controllers/series.js";
import userController from "./controllers/user.js"; // Add user-related functionality

const app = new Hono();

// Apply CORS middleware globally
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include HTTP methods
    allowHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  })
);

// Base route
app.get("/", (c) => {
  return c.json({ message: "Welcome to the Hono API!" });
});

// Route for TV Series
app.route("/series", seriesController);

// Route for User functionality (e.g., login, signup)
app.route("/users", userController); // Add a new user controller for handling user-related operations

// Start the server
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
