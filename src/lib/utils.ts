export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatFecha(fecha: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(fecha));
}

export function formatFechaCorta(fecha: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(fecha));
}

export function formatHora(hora: string): string {
  return hora.slice(0, 5) + " hs";
}

export function tipoSiniestroLabel(tipo: string): string {
  const labels: Record<string, string> = {
    choque: "Choque",
    robo_total: "Robo total",
    robo_parcial: "Robo parcial",
    incendio: "Incendio",
    dano_terceros: "Daño por terceros",
    granizo: "Granizo",
    inundacion: "Inundación",
    otro: "Otro",
  };
  return labels[tipo] || tipo;
}
