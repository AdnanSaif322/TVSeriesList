import { Hono } from "hono";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import SupabaseService from "../db/supabase"; // Adjust this import as needed

const app = new Hono();

// Authentication middleware for admin routes
const authenticateAdmin = async (c: any, next: Function) => {
  const token = c.req.header("Authorization")?.split(" ")[1]; // Use .header() instead of .headers.get()
  if (!token) {
    return c.json({ message: "Authentication required" }, 401);
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey) as { role: string };

    if (decoded.role !== "admin") {
      return c.json({ message: "Access denied" }, 403);
    }

    // Allow the request to continue if the user is an admin
    return next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      return c.json({ message: "Invalid token", error: err.message }, 401);
    } else {
      return c.json({ message: "Unknown error", error: String(err) }, 500);
    }
  }
};

// User Registration (with hashed password)
app.post("/register", async (c) => {
  try {
    const db = new SupabaseService(c);
    const { email, password, user_name } = await c.req.json();

    if (!email || !password || !user_name) {
      return c.json(
        { message: "Email, password, and user name are required" },
        400
      );
    }
    const existingUser = await db.getData("users", { user_name });
    console.log("Input User Name:", user_name);
    console.log("Fetched User Data:", existingUser);

    if (existingUser.data && existingUser.data.length > 0) {
      const matchedUser = existingUser.data.find(
        (user: { user_name: any }) => user.user_name === user_name
      );
      console.log("Matched User:", matchedUser);

      if (matchedUser) {
        return c.json({ message: "User name is already taken" }, 400);
      }
    }

    // Check if the user_name matches the desired admin user
    const role = user_name === "saif" ? "admin" : "user";

    // Hash the password before inserting it into the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await db.insertData("users", {
      email,
      password: hashedPassword,
      user_name,
      role,
    });

    if (error) {
      // Handle unique constraint violation error (23505)
      if (
        error.code === "23505" &&
        error.message.includes(
          'duplicate key value violates unique constraint "users_user_name_key"'
        )
      ) {
        return c.json({ message: "User name is already taken" }, 400);
      }

      // Handle other types of errors
      console.error("Registration error:", error);
      return c.json(
        { message: "Failed to register user", error: error.message || error },
        500
      );
    }

    return c.json({ message: "User registered successfully", data }, 201);
  } catch (err: unknown) {
    // Handle unknown errors
    if (err instanceof Error) {
      return c.json(
        { message: "Error during registration", error: err.message },
        500
      );
    } else {
      return c.json(
        { message: "Unknown error", error: JSON.stringify(err) },
        500
      ); // Stringify the error
    }
  }
});

// Admin Route: Get all users
app.get("/admin/users", authenticateAdmin, async (c) => {
  const db = new SupabaseService(c);

  try {
    // Fetch all users from the database
    const { data, error } = await db.getData("users", {});

    if (error) {
      return c.json({ message: "Failed to fetch users", error }, 500);
    }

    return c.json({ message: "Users fetched successfully", data }, 200);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return c.json(
        { message: "Error during fetching users", error: err.message },
        500
      );
    } else {
      return c.json(
        { message: "Unknown error", error: JSON.stringify(err) },
        500
      );
    }
  }
});

// Admin Route: Delete a User
app.delete("/admin/users/:id", authenticateAdmin, async (c) => {
  const { id } = c.req.param(); // Get user ID to delete
  const db = new SupabaseService(c);

  // Delete user by id
  const { data, error } = await db.deleteData("users", { id });

  if (error) {
    return c.json({ message: "Failed to delete user", error }, 500);
  }

  return c.json({ message: "User deleted successfully", data }, 200);
});

// User Login (with JWT generation)
app.post("/login", async (c) => {
  const db = new SupabaseService(c);
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ message: "Email and password are required" }, 400);
  }

  const { data, error } = await db.getData("users", { email });

  if (error || !data || data.length === 0) {
    return c.json({ message: "Invalid credentials" }, 401);
  }

  // Check if the password matches
  const isMatch = await bcrypt.compare(password, data[0].password);
  if (!isMatch) {
    return c.json({ message: "Invalid credentials" }, 401);
  }

  // Generate JWT Token
  const secretKey = process.env.JWT_SECRET || "your_secret_key";
  const token = jwt.sign(
    { id: data[0].id, email: data[0].email, role: data[0].role },
    secretKey,
    { expiresIn: "1h" }
  );

  return c.json({ message: "Login successful", token }, 200);
});

export default app;
