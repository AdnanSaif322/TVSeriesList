import { createClient } from "@supabase/supabase-js";

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

  async getData(table: any, from = 0, to = 1000) {
    const { data, error } = await this.client
      .from(table)
      .select("*")
      .range(from, to);
    if (error) {
      throw error;
    }
    return data;
  }

  async insertData(table: any, payload: any) {
    const { data, error } = await this.client.from(table).insert(payload);
    if (error) {
      throw error;
    }
    return data;
  }
  // Update data in a table based on condition
  async editData(table: any, payload: any, condition: any) {
    const { data, error } = await this.client
      .from(table)
      .update(payload)
      .match(condition);
    if (error) {
      throw error;
    }
    return data;
  }

  // Delete data from a table based on condition
  async deleteData(table: any, condition: any) {
    const { data, error } = await this.client
      .from(table)
      .delete()
      .match(condition);
    if (error) {
      throw error;
    }
    return data;
  }
}

export default SupabaseService;
