import { createClient } from "@supabase/supabase-js";

interface GetDataQuery {
  email?: string;
  password?: string;
  from?: number;
  to?: number;
}

class SupabaseService {
  client;

  constructor() {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error(
        "Missing SUPABASE_URL or SUPABASE_KEY in environment variables"
      );
    }

    this.client = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  async getData(
    table: any,
    { email, password, from = 0, to = 1000 }: GetDataQuery
  ) {
    let query = this.client.from(table).select("*").range(from, to);

    if (email) {
      query = query.eq("email", email); // Filter by email
    }

    if (password) {
      query = query.eq("password", password); // Filter by password
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching data from Supabase:", error); // Log error for debugging
      throw error; // Rethrow the error to be handled properly at the caller level
    }

    return { data, error };
  }

  async insertData(table: string, payload: Record<string, any>) {
    const { data, error } = await this.client
      .from(table)
      .insert(payload)
      .select();
    if (error) {
      throw error;
    }
    return data[0];
  }
  // Update data in a table based on condition
  async editData(
    table: string,
    updates: Record<string, any>,
    filters: Record<string, any>
  ) {
    const { data, error } = await this.client
      .from(table)
      .update(updates)
      .match(filters)
      .select();

    if (error) {
      console.error("Error updating data:", error);
      return { data: null, error };
    }

    return { data, error: null };
  }

  // Delete data from a table based on condition
  async deleteData(table: string, condition: Record<string, any>) {
    const { data, error } = await this.client
      .from(table)
      .delete()
      .match(condition)
      .select(); // Ensures the deleted record is returned

    if (error) {
      console.error("Error deleting data:", error);
      return { data: null, error };
    }

    return { data, error: null };
  }
}

export default SupabaseService;
