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
  const { name, genre, year } = await c.req.json();

  const data = await db.insertData("tv_series", { name, genre, year });

  return c.json({ message: "TV series successfully inserted" }, 201);
});

//edit tv series
app.put("/:id", async (c) => {
  const db = new SupabaseService(c);
  const id = c.req.param("id");
  const { name, genre, year } = await c.req.json();

  const upddates: any = {};
  if (name) upddates.name = name;
  if (genre) upddates.genre = genre;
  if (year) upddates.year = year;

  const data = await db.editData("tv_series", upddates, { id });

  if (!data) return c.json({ message: "TV series not found" }, 404);

  return c.json({ message: "TV series successfully updated" }, 200);
});

//Delete a TV series
app.delete("/:id", async (c) => {
  const db = new SupabaseService(c);
  const id = c.req.param("id");

  const data = await db.deleteData("tv_series", { id });

  if (!data) return c.json({ message: "TV series not found" }, 404);

  return c.json({ message: "TV series successfully deleted" }, 200);
});

export default app;
