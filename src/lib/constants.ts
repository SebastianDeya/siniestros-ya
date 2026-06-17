export const TIPOS_SINIESTRO = [
  { value: "choque", label: "Choque" },
  { value: "robo_total", label: "Robo total" },
  { value: "robo_parcial", label: "Robo parcial" },
  { value: "incendio", label: "Incendio" },
  { value: "dano_terceros", label: "Daño por terceros" },
  { value: "granizo", label: "Granizo" },
  { value: "inundacion", label: "Inundación" },
  { value: "otro", label: "Otro" },
] as const;

export const SUBTIPOS_CHOQUE = [
  { value: "frontal", label: "Frontal" },
  { value: "trasero", label: "Trasero" },
  { value: "lateral", label: "Lateral" },
  { value: "en_cadena", label: "En cadena" },
  { value: "objeto_fijo", label: "Con objeto fijo" },
  { value: "vuelco", label: "Vuelco" },
  { value: "otro", label: "Otro" },
] as const;

export const TIPOS_SEGURO = [
  { value: "automotor", label: "Automotor" },
  { value: "hogar", label: "Hogar" },
  { value: "vida", label: "Vida" },
  { value: "otro", label: "Otro" },
] as const;

export const COMPANIAS_ASEGURADORAS = [
  "Allianz Argentina",
  "Berkley Internacional",
  "Caja de Seguros",
  "Federación Patronal",
  "La Caja",
  "La Holando Sudamericana",
  "La Meridional",
  "La Segunda",
  "Mapfre Argentina",
  "Mercantil Andina",
  "Provincia Seguros",
  "QBE Seguros",
  "Rivadavia Seguros",
  "San Cristóbal",
  "Sancor Seguros",
  "Seguros Rivadavia",
  "SMG Seguros",
  "Zurich Argentina",
  "Otra",
] as const;

export const ETAPAS_SINIESTRO = [
  {
    value: "denuncia_recibida",
    label: "Denuncia recibida",
    descripcion: "Recibimos tu denuncia. Ya está en manos de la aseguradora.",
    empatia: "Sabemos que fue un momento difícil. Lo primero está hecho.",
  },
  {
    value: "en_revision",
    label: "En revisión",
    descripcion: "La aseguradora está analizando los detalles de tu caso.",
    empatia: "Gracias por tu paciencia. Esto suele tomar algunos días hábiles.",
  },
  {
    value: "perito_asignado",
    label: "Perito asignado",
    descripcion: "Un perito fue designado para evaluar los daños.",
    empatia: "Pronto te contactarán para coordinar la inspección del vehículo.",
  },
  {
    value: "peritaje_realizado",
    label: "Peritaje completado",
    descripcion: "El perito evaluó los daños. Ya casi llegamos.",
    empatia: "La información ya está en manos de la aseguradora para resolver.",
  },
  {
    value: "resolucion_emitida",
    label: "Resolución emitida",
    descripcion: "La aseguradora emitió una resolución para tu caso.",
    empatia: "Revisá los detalles de la resolución y contactanos si tenés dudas.",
  },
  {
    value: "caso_cerrado",
    label: "Caso cerrado",
    descripcion: "Tu siniestro fue resuelto y cerrado.",
    empatia: "Esperamos que todo haya salido bien. Gracias por confiar en nosotros.",
  },
] as const;

export const ESTADO_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  denuncia_recibida: {
    label: "Denuncia recibida",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  en_revision: {
    label: "En revisión",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  perito_asignado: {
    label: "Perito asignado",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  peritaje_realizado: {
    label: "Peritaje realizado",
    color: "text-primary-light",
    bgColor: "bg-primary-light/10",
  },
  resolucion_emitida: {
    label: "Resolución emitida",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  caso_cerrado: {
    label: "Caso cerrado",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
  },
};

// Guías para cuando el usuario ESTÁ en el lugar del siniestro
export const GUIA_QUE_HACER = [
  "Sacar fotos de todos los vehículos involucrados (daños, patentes, panorámica)",
  "Anotar los datos del otro conductor: nombre, DNI, aseguradora, número de póliza, patente",
  "Si hay testigos, pedirles nombre y teléfono",
  "Completar el acta de choque si aplica",
  "Llamar a tu aseguradora para dar aviso",
];

export const GUIA_QUE_NO_HACER = [
  "NO firmes ningún documento que no entiendas",
  "NO entregues tu DNI original ni documentación del vehículo al otro conductor (solo mostrarlo)",
  "NO admitas culpabilidad en el lugar",
  "NO te vayas del lugar sin tomar los datos del otro involucrado",
  "NO acordes pagos en efectivo sin intervención de la aseguradora",
];

// Guías para cuando el usuario NO está en el lugar del siniestro
export const GUIA_QUE_HACER_REMOTO = [
  "Reuní toda la documentación disponible: fotos, videos, partes policiales o testigos",
  "Contactá a tu aseguradora para dar aviso del siniestro lo antes posible",
  "Anotá la fecha y hora exacta en que ocurrió o te enteraste del hecho",
  "Guardá cualquier comunicación vinculada al siniestro (mensajes, emails, llamadas)",
  "Revisá tu póliza para conocer los plazos de denuncia que te aplican",
];

export const GUIA_QUE_NO_HACER_REMOTO = [
  "NO esperes demasiado para denunciar — tenés plazos legales que vencen",
  "NO firmes ningún documento sin leerlo completamente",
  "NO realices reparaciones antes de que el perito evalúe los daños",
  "NO acordes pagos ni arreglos directos sin intervención de la aseguradora",
];
