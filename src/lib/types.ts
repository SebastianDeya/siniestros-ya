export interface Aseguradora {
  id: string;
  user_id: string;
  alias: string;
  compania_aseguradora: string;
  numero_poliza: string;
  tipo_seguro: TipoSeguro;
  vehiculo_marca: string | null;
  vehiculo_modelo: string | null;
  vehiculo_anio: number | null;
  vehiculo_patente: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  dni: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Siniestro {
  id: string;
  user_id: string;
  numero_seguimiento: string;
  en_lugar_hecho: boolean;
  hay_heridos: boolean;
  ubicacion: string | null;
  ubicacion_lat: number | null;
  ubicacion_lng: number | null;
  fecha_siniestro: string;
  hora_siniestro: string | null;
  tipo_siniestro: TipoSiniestro;
  subtipo_choque: SubtipoChoque | null;
  descripcion: string;
  cantidad_vehiculos: number | null;
  guia_leida: boolean;
  compania_aseguradora: string | null;
  numero_poliza: string | null;
  tipo_seguro: TipoSeguro | null;
  vehiculo_marca: string | null;
  vehiculo_modelo: string | null;
  vehiculo_anio: number | null;
  vehiculo_patente: string | null;
  asegurado_nombre: string | null;
  asegurado_dni: string | null;
  asegurado_telefono: string | null;
  asegurado_email: string | null;
  tercero_nombre: string | null;
  tercero_dni: string | null;
  tercero_patente: string | null;
  tercero_aseguradora: string | null;
  estado: EstadoSiniestro;
  created_at: string;
  updated_at: string;
}

export interface SiniestroEvento {
  id: string;
  siniestro_id: string;
  etapa: EtapaSiniestro;
  descripcion: string;
  fecha: string;
  created_at: string;
}

export interface SiniestroArchivo {
  id: string;
  siniestro_id: string;
  nombre_archivo: string;
  storage_path: string;
  tipo_archivo: string;
  tamano_bytes: number;
  created_at: string;
}

export type TipoSiniestro =
  | "choque"
  | "robo_total"
  | "robo_parcial"
  | "incendio"
  | "dano_terceros"
  | "granizo"
  | "inundacion"
  | "otro";

export type SubtipoChoque =
  | "frontal"
  | "trasero"
  | "lateral"
  | "en_cadena"
  | "objeto_fijo"
  | "vuelco"
  | "otro";

export type TipoSeguro = "automotor" | "hogar" | "vida" | "otro";

export type EstadoSiniestro =
  | "denuncia_recibida"
  | "en_revision"
  | "perito_asignado"
  | "peritaje_realizado"
  | "resolucion_emitida"
  | "caso_cerrado";

export type EtapaSiniestro = EstadoSiniestro;

export interface WizardData {
  // Paso 1
  en_lugar_hecho: boolean | null;
  hay_heridos: boolean | null;
  ubicacion: string;
  ubicacion_lat: number | null;
  ubicacion_lng: number | null;
  fecha_siniestro: string;
  hora_siniestro: string;
  // Paso 2
  tipo_siniestro: TipoSiniestro | "";
  subtipo_choque: SubtipoChoque | "";
  descripcion: string;
  cantidad_vehiculos: number;
  // Paso 3
  guia_leida: boolean;
  // Paso 4
  aseguradora_id: string;
  compania_aseguradora: string;
  numero_poliza: string;
  tipo_seguro: TipoSeguro | "";
  vehiculo_marca: string;
  vehiculo_modelo: string;
  vehiculo_anio: string;
  vehiculo_patente: string;
  asegurado_nombre: string;
  asegurado_dni: string;
  asegurado_telefono: string;
  asegurado_email: string;
  // Paso 5
  fotos: File[];
  tercero_nombre: string;
  tercero_dni: string;
  tercero_patente: string;
  tercero_aseguradora: string;
}

export const INITIAL_WIZARD_DATA: WizardData = {
  en_lugar_hecho: null,
  hay_heridos: null,
  ubicacion: "",
  ubicacion_lat: null,
  ubicacion_lng: null,
  fecha_siniestro: new Date().toISOString().split("T")[0],
  hora_siniestro: new Date().toTimeString().slice(0, 5),
  tipo_siniestro: "",
  subtipo_choque: "",
  descripcion: "",
  cantidad_vehiculos: 1,
  guia_leida: false,
  aseguradora_id: "",
  compania_aseguradora: "",
  numero_poliza: "",
  tipo_seguro: "",
  vehiculo_marca: "",
  vehiculo_modelo: "",
  vehiculo_anio: "",
  vehiculo_patente: "",
  asegurado_nombre: "",
  asegurado_dni: "",
  asegurado_telefono: "",
  asegurado_email: "",
  fotos: [],
  tercero_nombre: "",
  tercero_dni: "",
  tercero_patente: "",
  tercero_aseguradora: "",
};
