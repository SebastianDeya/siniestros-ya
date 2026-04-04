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
    descripcion: "Tu denuncia fue registrada correctamente",
  },
  {
    value: "en_revision",
    label: "En revisión por la aseguradora",
    descripcion: "La aseguradora está evaluando tu caso",
  },
  {
    value: "perito_asignado",
    label: "Perito asignado",
    descripcion: "Se asignó un perito para evaluar los daños",
  },
  {
    value: "peritaje_realizado",
    label: "Peritaje realizado",
    descripcion: "El perito completó la evaluación",
  },
  {
    value: "resolucion_emitida",
    label: "Resolución emitida",
    descripcion: "La aseguradora emitió una resolución",
  },
  {
    value: "caso_cerrado",
    label: "Caso cerrado",
    descripcion: "El siniestro fue cerrado",
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
