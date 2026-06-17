import Link from "next/link";
import { Shield, Clock, FileCheck, ArrowRight } from "lucide-react";
import FaqSection from "@/components/FaqSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            Siniestros<span className="text-accent-light">YA</span>
          </h1>
          <div className="flex gap-3">
            <Link
              href="/iniciar-sesion"
              className="text-sm text-white/80 hover:text-white transition px-4 py-2"
            >
              Ingresar
            </Link>
            <Link
              href="/registrarse"
              className="text-sm bg-accent hover:bg-accent-light text-white px-4 py-2 rounded-xl transition font-medium"
            >
              Registrarse
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold leading-tight mb-6">
            Tu siniestro, bajo control.
            <br />
            <span className="text-accent-light">Siempre.</span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Cargá tu denuncia de siniestro en minutos, con una guía paso a paso
            que te dice exactamente qué hacer. Hacé seguimiento del estado en
            tiempo real.
          </p>
          <Link
            href="/registrarse"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-2xl hover:bg-gray-100 transition text-lg"
          >
            Empezar ahora
            <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-primary" size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Guía en el momento</h3>
            <p className="text-gray-600 text-sm">
              Te decimos qué hacer y qué NO hacer en el momento del siniestro.
              Paso a paso, sin confusiones.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="text-accent" size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Seguimiento en tiempo real
            </h3>
            <p className="text-gray-600 text-sm">
              Sabé en qué etapa está tu siniestro. Sin llamar a la aseguradora,
              sin esperar respuestas.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="text-success" size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Todo en un lugar</h3>
            <p className="text-gray-600 text-sm">
              Fotos, datos, documentos y estados. Todo centralizado y accesible
              desde tu celular.
            </p>
          </div>
        </div>
      </section>

      <FaqSection />

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <p>
          SiniestrosYA — Seminario de Integración Profesional, UADE 2026
        </p>
      </footer>
    </div>
  );
}
