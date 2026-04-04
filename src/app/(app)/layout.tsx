import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/iniciar-sesion");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <AppShell
      user={{
        id: user.id,
        email: user.email || "",
        nombre: profile?.nombre || user.user_metadata?.nombre || "",
        apellido: profile?.apellido || user.user_metadata?.apellido || "",
      }}
    >
      {children}
    </AppShell>
  );
}
