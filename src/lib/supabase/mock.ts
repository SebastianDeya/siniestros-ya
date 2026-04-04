export const mockSupabase = {
  auth: {
    getUser: async () => ({
      data: {
        user: {
          id: "mock-user-123",
          user_metadata: { nombre: "Usuario Demo" },
        },
      },
      error: null,
    }),
    signOut: async () => ({ error: null }),
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
                const res = await fetch(url, { cache: "no-store", headers: { 'Cache-Control': 'no-cache' } });
                const data = await res.json();
                return { data, error: null };
              } catch (e) {
                console.error("Mock fetch error", e);
                return { data: [], error: null };
              }
            }
            return { data: [], error: null };
          },
          single: async () => {
            if (table === "siniestros") {
              try {
                const query = singleId ? `?id=${singleId}` : "";
                const url =
                  typeof window !== "undefined"
                    ? `/api/siniestros${query}`
                    : `http://localhost:3000/api/siniestros${query}`;
                const res = await fetch(url, { cache: "no-store", headers: { 'Cache-Control': 'no-cache' } });
                const data = await res.json();
                return {
                  data: Array.isArray(data) ? data[0] : data,
                  error: null,
                };
              } catch (e) {
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
              fetch(url, { cache: "no-store", headers: { 'Cache-Control': 'no-cache' } })
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
          select: () => {
            return {
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
                } catch (e) {
                  return {
                    data: { id: "mock-id-" + Date.now(), ...payload },
                    error: null,
                  };
                }
              },
            };
          },
        };
        Object.assign(queryChain, {
          then: (resolve: any) => resolve({ data: payload, error: null }),
        });
        return queryChain;
      },
      update: () => {
        const queryChain = {
          eq: () => {
            const innerChain = {
              select: () => ({ single: async () => ({ data: {}, error: null }) }),
            };
            Object.assign(innerChain, {
              then: (resolve: any) => resolve({ data: {}, error: null }),
            });
            return innerChain;
          },
        };
        return queryChain;
      },
    };
  },
  storage: {
    from: (bucket: string) => ({
      upload: async () => ({ error: null }),
      getPublicUrl: () => ({
        data: { publicUrl: "https://mock-url.com/image.jpg" },
      }),
    }),
  },
};
