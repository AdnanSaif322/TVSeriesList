import { Hono } from "hono";
import SupabaseService from "../db/supabase";

const app = new Hono();

// Get all tv series
app.get("/", async (c) => {
  const db = new SupabaseService(c);
  const data = await db.getData("tv_series");
  return c.json({ data }, 200);
});

// Create a new tv series
app.post("/", async (c) => {
  const db = new SupabaseService(c);
  const { name, genre, year, rating } = await c.req.json();

  if (!name || !genre || !year || !rating) {
    return c.json(
      { message: "All fields (name, genre, year, and rating) are required." },
      400
    );
  }

  const data = await db.insertData("tv_series", { name, genre, year, rating });

  return c.json({ message: "TV series successfully inserted", data }, 201);
});

//edit tv series
app.put("/:id", async (c) => {
  const db = new SupabaseService(c);
  const id = c.req.param("id");
  const { name, genre, year, rating } = await c.req.json();

  const upddates: Record<string, any> = {};
  if (name) upddates.name = name;
  if (genre) upddates.genre = genre;
  if (year) upddates.year = year;
  if (rating) upddates.rating = rating;

  const { data, error } = await db.editData("tv_series", upddates, { id });

  if (error || !data) return c.json({ message: "TV series not found" }, 404);

  return c.json({ message: "TV series successfully updated", data }, 200);
});

//Delete a TV series
app.delete("/:id", async (c) => {
  const db = new SupabaseService(c);
  const id = c.req.param("id");

  const { data, error } = await db.deleteData("tv_series", { id });

  if (error || !data || data.length === 0)
    return c.json(
      { message: "TV series not found or could not be deleted" },
      404
    );

  return c.json({ message: "TV series successfully deleted", data }, 200);
});

export default app;
