import { Hono } from "hono";
import SupabaseService from "../db/supabase";

const app = new Hono();

// Get all TV series for a specific user
app.get("/:userId", async (c) => {
  const db = new SupabaseService(c);
  const userId = c.req.param("userId");

  if (!userId) {
    return c.json({ message: "User ID is required" }, 400);
  }

  const data = await db.getData("tv_series", { userId });

  return c.json({ data }, 200);
});

// Add a new TV series for a user
app.post("/:userId", async (c) => {
  try {
    const db = new SupabaseService(c);
    const { name, genre, year, voteAverage, imageUrl } = await c.req.json();
    const { userId } = c.req.param();

    if (!userId || !name || !genre || !year || !voteAverage) {
      return c.json(
        {
          message: "User ID, name, genre, year, and voteAverage are required.",
        },
        400
      );
    }

    const data = await db.insertData("tv_series", {
      name,
      genre,
      year,
      voteAverage,
      imageUrl,
      user_id: userId,
    });

    return c.json({ message: "TV series successfully added", data }, 201);
  } catch (error) {
    // Narrow the 'error' type
    if (error instanceof Error) {
      console.error("Error:", error.message);
      return c.json(
        { message: "Internal Server Error", error: error.message },
        500
      );
    } else {
      // Fallback for non-Error objects
      console.error("Unknown Error:", error);
      return c.json({ message: "An unexpected error occurred" }, 500);
    }
  }
});

// Delete a TV series for a user
app.delete("/:userId/:id", async (c) => {
  const db = new SupabaseService(c);
  const userId = c.req.param("userId");
  const id = c.req.param("id");

  if (!userId) {
    return c.json({ message: "User ID is required" }, 400);
  }

  const { data, error } = await db.deleteData("tv_series", {
    id,
    user_id: userId,
  });

  if (error || !data || data.length === 0) {
    return c.json(
      { message: "TV series not found or could not be deleted" },
      404
    );
  }

  return c.json({ message: "TV series successfully deleted", data }, 200);
});

// Global error handler
app.onError((err, c) => {
  console.error("Unhandled Error:", err);
  return c.json({ message: "Internal Server Error", error: err.message }, 500);
});

export default app;
