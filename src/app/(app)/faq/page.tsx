"use client";

import { useState } from "react";
import { ChevronDown, Laptop, UserCheck, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItem = { question: string; answer: string };
type FaqCategory = {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: FaqItem[];
};

const categories: FaqCategory[] = [
  {
    title: "Uso de la plataforma",
    icon: <Laptop size={18} />,
    color: "text-accent bg-accent/10",
    items: [
      {
        question: "¿Cómo cargo un nuevo siniestro?",
        answer:
          "Hacé clic en 'Nuevo' en el menú y seguí los pasos del asistente: describís el hecho, cargás los datos del vehículo y de las partes involucradas, adjuntás fotos y confirmás la denuncia. El proceso lleva menos de 5 minutos.",
      },
      {
        question: "¿Puedo adjuntar fotos del lugar del accidente?",
        answer:
          "Sí. En el paso de carga de fotos podés seleccionar imágenes desde tu galería o tomarlas en el momento. Las fotos quedan vinculadas al expediente y son accesibles en cualquier momento.",
      },
      {
        question: "¿Cómo sé en qué estado está mi siniestro?",
        answer:
          "Desde el panel 'Mis siniestros' podés ver el estado actualizado de cada expediente: Recibido, En revisión, Peritos asignados, Resolución pendiente o Cerrado. También recibís notificaciones por correo ante cada cambio.",
      },
    ],
  },
  {
    title: "Derechos del asegurado",
    icon: <UserCheck size={18} />,
    color: "text-success bg-success/10",
    items: [
      {
        question: "¿Qué derechos tengo frente a mi aseguradora?",
        answer:
          "Como asegurado tenés derecho a: recibir información clara sobre tu póliza, ser atendido dentro de los plazos legales, obtener una respuesta fundada ante cualquier rechazo, acceder a los informes periciales que te involucran y reclamar ante la Superintendencia de Seguros de la Nación (SSN) si la aseguradora no cumple.",
      },
      {
        question: "¿Puedo reclamar si la aseguradora demora en responder?",
        answer:
          "Sí. Si la aseguradora supera los plazos establecidos por la SSN sin contestar o resolver, podés presentar una queja formal ante ese organismo (www.ssn.gob.ar). También podés intimar a la compañía en forma fehaciente; el silencio tras la intimación puede considerarse aceptación.",
      },
      {
        question: "¿Qué es la franquicia y cuándo se me descuenta?",
        answer:
          "La franquicia es el monto que vos asumís de cada siniestro antes de que la aseguradora cubra el resto. Se descuenta de la indemnización al momento del pago. El valor está estipulado en tu póliza; si tenés dudas, podés verlo en la sección 'Condiciones particulares'.",
      },
      {
        question: "¿Qué hago si rechazan mi denuncia?",
        answer:
          "Solicitá el rechazo por escrito con los fundamentos. Si considerás que es injustificado, podés: presentar documentación adicional, contratar un perito de parte, iniciar una queja ante la SSN o recurrir a la vía judicial. SiniestrosYA conserva toda la documentación y el historial para que cuentes con el respaldo necesario.",
      },
    ],
  },
  {
    title: "Plazos legales",
    icon: <CalendarClock size={18} />,
    color: "text-warning bg-warning/10",
    items: [
      {
        question: "¿Cuánto tiempo tengo para denunciar un siniestro?",
        answer:
          "La ley argentina (Ley 17.418, art. 46) establece que el asegurado debe denunciar el siniestro dentro de los 3 días de conocerlo, salvo que la póliza establezca un plazo mayor. Algunos seguros de automotores amplían este plazo a 72 horas hábiles. Te recomendamos denunciar siempre en el día.",
      },
      {
        question: "¿En cuánto tiempo debe responder la aseguradora?",
        answer:
          "La aseguradora tiene 30 días corridos desde la recepción de la denuncia y la documentación completa para pronunciarse (aceptar o rechazar el siniestro), según lo dispuesto por la SSN. Para ciertos tipos de siniestros con pérdida total, el plazo puede extenderse a 60 días.",
      },
      {
        question: "¿Qué pasa si no denuncié a tiempo?",
        answer:
          "La aseguradora puede alegar caducidad del derecho e impugnar la cobertura. Sin embargo, si podés demostrar que la tardanza se debió a causa de fuerza mayor o que el siniestro no causó perjuicio adicional por la demora, el reclamo puede mantenerse. En caso de duda, consultá con un abogado especializado.",
      },
      {
        question: "¿Cuánto tiempo tengo para iniciar acciones judiciales?",
        answer:
          "La acción judicial contra la aseguradora prescribe al año desde que la obligación es exigible (Ley 17.418, art. 58). Este plazo se interrumpe con una carta documento fehaciente dirigida a la compañía. Es importante actuar con tiempo para no perder el derecho.",
      },
    ],
  },
];

function AccordionItem({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 py-3.5 text-left"
      >
        <span className="text-sm font-medium text-gray-800">{question}</span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-gray-400 transition-transform duration-200 mt-0.5",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="text-sm text-gray-600 pb-3.5 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Preguntas frecuentes</h1>
        <p className="text-gray-500 text-sm mt-1">
          Plataforma, derechos del asegurado y plazos legales en Argentina.
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.title} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className={cn("w-8 h-8 rounded-xl flex items-center justify-center", cat.color)}>
                {cat.icon}
              </span>
              <h2 className="font-semibold text-gray-800 text-sm">{cat.title}</h2>
            </div>
            <div>
              {cat.items.map((item) => (
                <AccordionItem key={item.question} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
