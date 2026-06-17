function getLocalProfile(userId: string): any {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`profile_${userId}`);
  return raw ? JSON.parse(raw) : null;
}

function saveLocalProfile(userId: string, payload: Record<string, any>) {
  if (typeof window === "undefined") return;
  const existing = getLocalProfile(userId) || {};
  const updated = { ...existing, ...payload, id: userId };
  localStorage.setItem(`profile_${userId}`, JSON.stringify(updated));

  // Keep user_session cookie in sync so the server sidebar shows the right name
  try {
    const sessionRaw = localStorage.getItem("user_session");
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      if (payload.nombre !== undefined) session.nombre = payload.nombre;
      if (payload.apellido !== undefined) session.apellido = payload.apellido;
      localStorage.setItem("user_session", JSON.stringify(session));
      document.cookie = `user_session=${encodeURIComponent(JSON.stringify(session))}; path=/; SameSite=Lax`;
    }
  } catch {}
}

export const mockSupabase = {
  auth: {
    getUser: async () => {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("user_session");
        if (raw) {
          try {
            const session = JSON.parse(raw);
            return {
              data: {
                user: {
                  id: session.id,
                  email: session.email || "",
                  user_metadata: { nombre: session.nombre || "", apellido: session.apellido || "" },
                },
              },
              error: null,
            };
          } catch {}
        }
      }
      return {
        data: {
          user: {
            id: "mock-user-123",
            email: "",
            user_metadata: { nombre: "Usuario Demo", apellido: "" },
          },
        },
        error: null,
      };
    },
    signOut: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_session");
        document.cookie = "user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      return { error: null };
    },
    signInWithPassword: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
  },
  from: (table: string) => {
    return {
      select: () => {
        let singleId: string | null = null;

        const queryChain = {
          eq: (field: string, value: string) => {
            if (field === "id") singleId = value;
            return queryChain;
          },
          order: async () => {
            if (table === "siniestros") {
              try {
                const url =
                  typeof window !== "undefined"
                    ? "/api/siniestros"
                    : "http://localhost:3000/api/siniestros";
                const res = await fetch(url, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
                const data = await res.json();
                return { data, error: null };
              } catch {
                return { data: [], error: null };
              }
            }
            return { data: [], error: null };
          },
          single: async () => {
            if (table === "profiles" && singleId) {
              return { data: getLocalProfile(singleId), error: null };
            }
            if (table === "siniestros") {
              try {
                const query = singleId ? `?id=${singleId}` : "";
                const url =
                  typeof window !== "undefined"
                    ? `/api/siniestros${query}`
                    : `http://localhost:3000/api/siniestros${query}`;
                const res = await fetch(url, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
                const data = await res.json();
                return { data: Array.isArray(data) ? data[0] : data, error: null };
              } catch {
                return { data: {}, error: null };
              }
            }
            return { data: {}, error: null };
          },
        };

        Object.assign(queryChain, {
          then: (resolve: any) => {
            if (table === "siniestros") {
              const url =
                typeof window !== "undefined"
                  ? "/api/siniestros"
                  : "http://localhost:3000/api/siniestros";
              fetch(url, { cache: "no-store", headers: { "Cache-Control": "no-cache" } })
                .then((r) => r.json())
                .then((data) => resolve({ data, error: null }))
                .catch(() => resolve({ data: [], error: null }));
            } else {
              resolve({ data: [], error: null });
            }
          },
        });

        return queryChain;
      },
      insert: (payload: any) => {
        const queryChain = {
          select: () => ({
            single: async () => {
              try {
                const url =
                  typeof window !== "undefined"
                    ? "/api/siniestros"
                    : "http://localhost:3000/api/siniestros";
                const res = await fetch(url, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
                const data = await res.json();
                return { data, error: null };
              } catch {
                return { data: { id: "mock-id-" + Date.now(), ...payload }, error: null };
              }
            },
          }),
        };
        Object.assign(queryChain, {
          then: (resolve: any) => resolve({ data: payload, error: null }),
        });
        return queryChain;
      },
      update: (payload: any) => {
        const queryChain = {
          eq: (field: string, value: string) => {
            const innerChain = {
              select: () => ({ single: async () => ({ data: {}, error: null }) }),
            };
            Object.assign(innerChain, {
              then: (resolve: any) => {
                if (table === "profiles" && field === "id") {
                  saveLocalProfile(value, payload);
                }
                resolve({ data: {}, error: null });
              },
            });
            return innerChain;
          },
        };
        return queryChain;
      },
    };
  },
  storage: {
    from: (_bucket: string) => ({
      upload: async () => ({ error: null }),
      getPublicUrl: () => ({
        data: { publicUrl: "https://mock-url.com/image.jpg" },
      }),
    }),
  },
};
