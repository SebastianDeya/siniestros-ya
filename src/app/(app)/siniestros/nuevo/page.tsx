"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WizardData, INITIAL_WIZARD_DATA } from "@/lib/types";
import WizardProgress from "@/components/wizard/WizardProgress";
import Paso1Situacion from "@/components/wizard/Paso1Situacion";
import Paso2QuePaso from "@/components/wizard/Paso2QuePaso";
import Paso3Guia from "@/components/wizard/Paso3Guia";
import Paso4Datos from "@/components/wizard/Paso4Datos";
import Paso5Fotos from "@/components/wizard/Paso5Fotos";
import Paso6Confirmacion from "@/components/wizard/Paso6Confirmacion";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";

const STEPS = [
  "Situación",
  "Qué pasó",
  "Guía",
  "Datos",
  "Fotos",
  "Confirmación"
];

export default function NuevoSiniestroPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_WIZARD_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      // Generate a tracking number
      const numero_seguimiento = `SIN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;

      // 1. Insert Siniestro
      const { data: siniestro, error: siniestroError } = await supabase
        .from("siniestros")
        .insert({
          user_id: user.id,
          numero_seguimiento,
          en_lugar_hecho: data.en_lugar_hecho,
          hay_heridos: false,
          ubicacion: data.ubicacion,
          ubicacion_lat: data.ubicacion_lat,
          ubicacion_lng: data.ubicacion_lng,
          fecha_siniestro: data.fecha_siniestro,
          hora_siniestro: data.hora_siniestro,
          tipo_siniestro: data.tipo_siniestro,
          subtipo_choque: data.subtipo_choque,
          descripcion: data.descripcion,
          cantidad_vehiculos: data.cantidad_vehiculos,
          guia_leida: data.guia_leida,
          compania_aseguradora: data.compania_aseguradora,
          numero_poliza: data.numero_poliza,
          tipo_seguro: data.tipo_seguro,
          vehiculo_marca: data.vehiculo_marca,
          vehiculo_modelo: data.vehiculo_modelo,
          vehiculo_anio: data.vehiculo_anio ? parseInt(data.vehiculo_anio) : null,
          vehiculo_patente: data.vehiculo_patente,
          asegurado_nombre: data.asegurado_nombre,
          asegurado_dni: data.asegurado_dni,
          asegurado_telefono: data.asegurado_telefono,
          asegurado_email: data.asegurado_email,
          tercero_nombre: data.tercero_nombre,
          tercero_dni: data.tercero_dni,
          tercero_patente: data.tercero_patente,
          tercero_aseguradora: data.tercero_aseguradora,
          estado: "denuncia_recibida"
        })
        .select()
        .single();

      if (siniestroError) throw siniestroError;
      
      // 2. Insert files if any (photos)
      if (data.fotos && data.fotos.length > 0) {
        for (const file of data.fotos) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${siniestro.id}/${Math.random()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('siniestros')
            .upload(fileName, file);
            
          if (!uploadError) {
             await supabase.from('siniestro_archivos').insert({
                siniestro_id: siniestro.id,
                nombre_archivo: file.name,
                storage_path: fileName,
                tipo_archivo: file.type || 'image/jpeg',
                tamano_bytes: file.size,
             });
          }
        }
      }

      router.push(`/siniestros/${siniestro.id}`);
      
    } catch (err: any) {
      console.error("Error submitting:", err);
      setError(err.message || "Ocurrió un error al enviar el siniestro");
      setIsSubmitting(false);
    }
  };

  const getValidationMessage = (): string | null => {
    if (currentStep === 1) {
      if (data.en_lugar_hecho === null) return "Indicá si estás en el lugar del hecho";
      if (!data.ubicacion) return "Ingresá la ubicación del siniestro";
      if (!data.fecha_siniestro) return "Ingresá la fecha del siniestro";
    }
    if (currentStep === 2) {
      if (!data.tipo_siniestro) return "Seleccioná el tipo de siniestro";
      if (!data.descripcion) return "Describí brevemente qué pasó";
    }
    if (currentStep === 3) {
      if (!data.guia_leida) return "Primero leé la guía de pasos a seguir";
    }
    if (currentStep === 4) {
      if (!data.compania_aseguradora) return "Seleccioná una póliza para continuar";
      if (!data.asegurado_nombre) return "Completá tu nombre";
      if (!data.asegurado_dni) return "Completá tu DNI";
    }
    return null;
  };

  const isNextDisabled = () => getValidationMessage() !== null;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="mb-8">
        <WizardProgress currentStep={currentStep} steps={STEPS} />
      </div>

      <div className="bg-gray-50/50 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-8">
        {currentStep === 1 && (
          <Paso1Situacion data={data} onUpdate={handleUpdate} />
        )}
        {currentStep === 2 && (
          <Paso2QuePaso data={data} onUpdate={handleUpdate} />
        )}
        {currentStep === 3 && (
          <Paso3Guia data={data} onUpdate={handleUpdate} />
        )}
        {currentStep === 4 && (
          <Paso4Datos data={data} onUpdate={handleUpdate} />
        )}
        {currentStep === 5 && (
          <Paso5Fotos data={data} onUpdate={handleUpdate} />
        )}
        {currentStep === 6 && (
          <Paso6Confirmacion data={data} onGoToStep={goToStep} />
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-danger/10 text-danger border border-danger/20 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {currentStep < 6 && getValidationMessage() && (
          <p className="text-xs text-center text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
            ⚠ {getValidationMessage()}
          </p>
        )}
        <div className="flex gap-3">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            disabled={isSubmitting}
            className="flex-1 py-4 px-6 rounded-2xl font-bold bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Atrás
          </button>
        )}

        {currentStep < 6 ? (
          <button
            onClick={nextStep}
            disabled={isNextDisabled()}
            className="flex-2 w-full py-4 px-6 rounded-2xl font-bold bg-primary text-white hover:bg-primary-light focus:ring-4 focus:ring-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-primary-sm"
          >
            Siguiente
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-2 w-full py-4 px-6 rounded-2xl font-bold bg-primary text-white hover:bg-primary-light focus:ring-4 focus:ring-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-primary-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enviar denuncia
              </>
            )}
          </button>
        )}
        </div>
      </div>
    </div>
  );
}
