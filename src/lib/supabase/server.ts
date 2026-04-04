import { mockSupabase } from "./mock";

export async function createClient() {
  return mockSupabase as any;
}
