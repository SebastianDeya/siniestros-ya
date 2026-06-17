import { cookies } from "next/headers";
import { mockSupabase } from "./mock";

export async function createClient() {
  let serverUser = {
    id: "mock-user-123",
    email: "",
    user_metadata: { nombre: "Usuario Demo", apellido: "" } as Record<string, string>,
  };

  try {
    const cookieStore = await cookies();
    const sessionRaw = cookieStore.get("user_session")?.value;
    if (sessionRaw) {
      const session = JSON.parse(decodeURIComponent(sessionRaw));
      serverUser = {
        id: session.id || "mock-user-123",
        email: session.email || "",
        user_metadata: { nombre: session.nombre || "", apellido: session.apellido || "" },
      };
    }
  } catch {}

  return {
    ...mockSupabase,
    auth: {
      ...mockSupabase.auth,
      getUser: async () => ({ data: { user: serverUser }, error: null }),
    },
  } as any;
}
