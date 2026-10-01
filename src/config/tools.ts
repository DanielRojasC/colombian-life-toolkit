import { categories, getCategory, type ToolCategory } from "./categories";
import type { SourceId } from "../infrastructure/sources/official-sources";

export interface ToolDefinition {
  slug: string;
  name: string;
  shortDescription: string;
  category: ToolCategory;
  keywords: readonly string[];
  seo: {
    title: string;
    description: string;
  };
  status: "active" | "draft";
  relatedSlugs: readonly string[];
  sourceIds: readonly SourceId[];
  updatedAt: string;
}

export const tools = [
  {
    slug: "calculadora-salario",
    name: "Calculadora de salario neto",
    shortDescription:
      "Estima cuánto queda del salario después de salud, pensión y fondo de solidaridad.",
    category: "trabajo",
    keywords: [
      "salario",
      "neto",
      "salud",
      "pension",
      "descuento",
      "nomina",
      "fondo de solidaridad",
    ],
    seo: {
      title: "Calculadora de salario neto en Colombia",
      description:
        "Estima el salario después de los descuentos de salud, pensión y fondo de solidaridad pensional. Incluye fuentes, topes y lo que no calcula.",
    },
    status: "active",
    relatedSlugs: ["calculadora-liquidacion", "calculadora-prima"],
    sourceIds: [
      "decreto-1469-2025",
      "ley-797-2003",
      "decreto-4982-2007",
      "ley-100-salud",
      "ley-1122-2007",
    ],
    updatedAt: "2026-10-01",
  },
  {
    slug: "calculadora-liquidacion",
    name: "Calculadora de liquidación",
    shortDescription:
      "Estima cesantías, intereses, prima, vacaciones y días pendientes de un periodo.",
    category: "trabajo",
    keywords: [
      "liquidacion",
      "cesantias",
      "vacaciones",
      "intereses",
      "finiquito",
      "despido",
    ],
    seo: {
      title: "Calculadora de liquidación laboral en Colombia",
      description:
        "Estima cesantías, intereses de cesantías, prima proporcional, vacaciones y salario pendiente. No calcula indemnización ni retención.",
    },
    status: "active",
    relatedSlugs: ["calculadora-salario", "calculadora-prima"],
    sourceIds: [
      "cst-cesantias",
      "ley-52-1975",
      "decreto-116-1976",
      "cst-prima",
      "cst-vacaciones",
    ],
    updatedAt: "2026-10-01",
  },
  {
    slug: "calculadora-prima",
    name: "Calculadora de prima",
    shortDescription:
      "Estima la prima de servicios de un semestre o de los días que llevas trabajados.",
    category: "trabajo",
    keywords: [
      "prima",
      "prima de servicios",
      "junio",
      "diciembre",
      "prestaciones",
    ],
    seo: {
      title: "Calculadora de prima de servicios en Colombia",
      description:
        "Estima la prima de servicios con la fórmula de 30 días de salario por año, proporcional a los días trabajados.",
    },
    status: "active",
    relatedSlugs: ["calculadora-liquidacion", "calculadora-salario"],
    sourceIds: ["cst-prima"],
    updatedAt: "2026-10-01",
  },
  {
    slug: "calculadora-combustible",
    name: "Calculadora de combustible",
    shortDescription:
      "Estima galones, litros y costo según la distancia, el consumo y el precio que ingresas.",
    category: "vehiculos",
    keywords: ["gasolina", "combustible", "galon", "litro", "consumo", "carro"],
    seo: {
      title: "Calculadora de costo de combustible",
      description:
        "Calcula el combustible y el costo de uno o varios recorridos con tu consumo y el precio por galón o por litro.",
    },
    status: "active",
    relatedSlugs: ["costo-viaje"],
    sourceIds: [],
    updatedAt: "2026-10-01",
  },
  {
    slug: "costo-viaje",
    name: "Costo de viaje",
    shortDescription:
      "Suma combustible y peajes de un trayecto, de ida o de ida y vuelta.",
    category: "vehiculos",
    keywords: ["viaje", "peajes", "ruta", "gasolina", "pasajeros"],
    seo: {
      title: "Calculadora de costo de viaje en carro",
      description:
        "Estima combustible, peajes, costo total y costo por pasajero. Tú ingresas la distancia: no usa mapas.",
    },
    status: "active",
    relatedSlugs: ["calculadora-combustible"],
    sourceIds: [],
    updatedAt: "2026-10-01",
  },
  {
    slug: "calculadora-credito",
    name: "Calculadora de crédito",
    shortDescription:
      "Estima la cuota fija, los intereses y la tabla de amortización.",
    category: "dinero",
    keywords: [
      "credito",
      "cuota",
      "interes",
      "tasa efectiva",
      "amortizacion",
      "prestamo",
    ],
    seo: {
      title: "Calculadora de crédito y cuota fija",
      description:
        "Calcula la cuota de un crédito con tasa efectiva anual, nominal mensual o nominal anual mes vencido, y muestra la amortización.",
    },
    status: "active",
    relatedSlugs: ["porcentajes"],
    sourceIds: [],
    updatedAt: "2026-10-01",
  },
  {
    slug: "porcentajes",
    name: "Porcentajes y descuentos",
    shortDescription:
      "Calcula un porcentaje, un aumento, un descuento o la diferencia entre dos valores.",
    category: "vida-cotidiana",
    keywords: [
      "porcentaje",
      "descuento",
      "aumento",
      "iva",
      "rebaja",
      "diferencia",
    ],
    seo: {
      title: "Calculadora de porcentajes y descuentos",
      description:
        "Calcula qué es un porcentaje de un valor, un incremento, un descuento o la diferencia porcentual entre dos números.",
    },
    status: "active",
    relatedSlugs: ["calculadora-credito"],
    sourceIds: [],
    updatedAt: "2026-10-01",
  },
] as const satisfies readonly ToolDefinition[];

export type ToolSlug = (typeof tools)[number]["slug"];

export function getActiveTools(): ToolDefinition[] {
  return tools.filter((tool) => tool.status === "active");
}

export function getTool(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return getActiveTools().filter((tool) => tool.category === category);
}

export function getCategoriesWithActiveTools(): Array<
  (typeof categories)[number]
> {
  return categories.filter(
    (category) => getToolsByCategory(category.id).length > 0,
  );
}

export function getRelatedTools(slug: string): ToolDefinition[] {
  const tool = getTool(slug);
  if (!tool) {
    return [];
  }

  return tool.relatedSlugs
    .map((relatedSlug) => getTool(relatedSlug))
    .filter(
      (related): related is ToolDefinition =>
        related !== undefined && related.status === "active",
    );
}

export function getToolPath(slug: string): string {
  return `/herramientas/${slug}`;
}

export function getCategoryPath(category: ToolCategory): string {
  return `/categorias/${getCategory(category).slug}`;
}
