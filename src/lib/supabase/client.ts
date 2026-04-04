"use client";

import { mockSupabase } from "./mock";

export function createClient() {
  return mockSupabase as any;
}
