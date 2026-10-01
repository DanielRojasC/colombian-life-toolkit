function readSiteUrl(): string {
  if (
    typeof import.meta.env !== "undefined" &&
    typeof import.meta.env.SITE === "string" &&
    import.meta.env.SITE.length > 0
  ) {
    return import.meta.env.SITE;
  }

  return "http://localhost:4321";
}

export const siteConfig = {
  name: "Tu Caja de Herramientas",
  shortName: "Tu Caja",
  description:
    "Herramientas gratuitas para calcular, comparar y tomar decisiones sobre dinero, trabajo, vehículos y vida cotidiana en Colombia.",
  locale: "es-CO",
  language: "es",
  currency: "COP",
  siteUrl: readSiteUrl(),
  disclaimer:
    "Los resultados son estimaciones basadas en los datos que ingresas y en las reglas indicadas en cada herramienta. Para decisiones legales, tributarias o financieras, verifica la información con la entidad oficial o con un profesional competente.",
} as const;
