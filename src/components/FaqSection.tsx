"use client";

import { useState } from "react";
import { ChevronDown, Laptop, UserCheck, CalendarClock } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCategory = {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: FaqItem[];
};

const categories: FaqCategory[] = [
  {
    title: "Uso de la plataforma",
    icon: <Laptop size={20} />,
    color: "text-accent bg-accent/10",
    items: [
      {
        question: "¿Necesito registrarme para usar SiniestrosYA?",
        answer:
          "Sí. El registro es gratuito y solo requiere tu correo electrónico. Una vez registrado, podés cargar siniestros, adjuntar documentación y hacer seguimiento del estado desde cualquier dispositivo.",
      },
      {
        question: "¿Cómo cargo un nuevo siniestro?",
        answer:
          "Después de iniciar sesión, hacé clic en 'Nuevo siniestro' y seguí los pasos del asistente: describís el hecho, cargás los datos del vehículo y de las partes involucradas, adjuntás fotos y confirmás la denuncia. El proceso lleva menos de 5 minutos.",
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
    icon: <UserCheck size={20} />,
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
    icon: <CalendarClock size={20} />,
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
          "La acción judicial contra la aseguradora prescribe a los 1 año desde que la obligación es exigible (Ley 17.418, art. 58). Este plazo se interrumpe con una carta documento fehaciente dirigida a la compañía. Es importante actuar con tiempo para no perder el derecho.",
      },
    ],
  },
];

function AccordionItem({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-gray-800">{question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="text-sm text-gray-600 pb-4 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
            Preguntas frecuentes
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            Todo lo que necesitás saber sobre la plataforma, tus derechos como
            asegurado y los plazos que aplican en Argentina.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div key={cat.title} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.color}`}
                >
                  {cat.icon}
                </span>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {cat.title}
                </h3>
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
    </section>
  );
}
