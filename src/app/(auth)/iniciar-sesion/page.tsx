"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff } from "lucide-react";

type Cuenta =
  | { tipo: "usuario"; nombre: string; apellido: string }
  | { tipo: "aseguradora"; compania: string };

const CUENTAS: Record<string, { password: string; cuenta: Cuenta }> = {
  usuario1:      { password: "demo2026", cuenta: { tipo: "usuario", nombre: "Juan",      apellido: "Pérez"   } },
  usuario2:      { password: "demo2026", cuenta: { tipo: "usuario", nombre: "María",     apellido: "García"  } },
  sebastiandeya: { password: "demo2026", cuenta: { tipo: "usuario", nombre: "Sebastian", apellido: "Deya"   } },
  sancor:        { password: "demo2026", cuenta: { tipo: "aseguradora", compania: "Sancor Seguros"      } },
  lacaja:        { password: "demo2026", cuenta: { tipo: "aseguradora", compania: "La Caja"             } },
  allianz:       { password: "demo2026", cuenta: { tipo: "aseguradora", compania: "Allianz Argentina"   } },
  cajaseguros:   { password: "demo2026", cuenta: { tipo: "aseguradora", compania: "Caja de Seguros"     } },
};

export default function IniciarSesionPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const entrada = CUENTAS[usuario.trim().toLowerCase()];

    if (!entrada || entrada.password !== password) {
      setError("Usuario o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    if (entrada.cuenta.tipo === "aseguradora") {
      localStorage.setItem(
        "aseguradora_session",
        JSON.stringify({ compania: entrada.cuenta.compania })
      );
      router.push("/aseguradora");
    } else {
      const { nombre, apellido } = entrada.cuenta;
      const username = usuario.trim().toLowerCase();
      const session = { id: `user-${username}`, nombre, apellido, email: `${username}@demo.com` };
      localStorage.setItem("user_session", JSON.stringify(session));
      document.cookie = `user_session=${encodeURIComponent(JSON.stringify(session))}; path=/; SameSite=Lax`;
      router.push("/dashboard");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Iniciar sesión
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => { setUsuario(e.target.value); setError(""); }}
            required
            autoComplete="username"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-gray-900"
            placeholder="ej: usuario1"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-gray-900 pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-danger-light text-danger px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-light text-white font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn size={20} />
              Ingresar
            </>
          )}
        </button>
      </form>

    </div>
  );
}
