"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  user: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
  };
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/siniestros", label: "Siniestros", icon: FileText },
  { href: "/siniestros/nuevo", label: "Nuevo", icon: PlusCircle },
  { href: "/perfil", label: "Perfil", icon: User },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/iniciar-sesion");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-primary-dark text-white">
        <div className="p-6">
          <Link href="/dashboard" className="text-xl font-bold">
            Siniestros<span className="text-accent-light">YA</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold">
              {user.nombre?.[0] || user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.nombre} {user.apellido}
              </p>
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 mt-2 text-white/70 hover:text-white text-sm w-full rounded-xl hover:bg-white/10 transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/dashboard" className="text-lg font-bold text-primary">
            Siniestros<span className="text-accent">YA</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {sidebarOpen && (
          <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 p-4">
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                {user.nombre?.[0] || user.email[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-danger text-sm font-medium"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/siniestros/nuevo" &&
                pathname.startsWith(item.href));
            const isNew = item.href === "/siniestros/nuevo";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 text-xs font-medium transition",
                  isNew
                    ? "text-white -mt-4"
                    : isActive
                    ? "text-primary"
                    : "text-gray-400"
                )}
              >
                {isNew ? (
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <item.icon size={24} className="text-white" />
                  </div>
                ) : (
                  <item.icon size={22} />
                )}
                <span className={cn(isNew && "text-primary mt-1")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
