export const categories = [
  {
    id: "trabajo",
    slug: "trabajo",
    name: "Trabajo",
    description:
      "Estima salario, prima y liquidación con las reglas laborales que citamos.",
    icon: "work",
  },
  {
    id: "dinero",
    slug: "dinero",
    name: "Dinero",
    description:
      "Cuotas, intereses y porcentajes para decidir antes de endeudarte o comparar cifras.",
    icon: "money",
  },
  {
    id: "vehiculos",
    slug: "vehiculos",
    name: "Vehículos",
    description:
      "Combustible y costo de un recorrido, con la distancia y el precio que tú ingresas.",
    icon: "vehicle",
  },
  {
    id: "vivienda",
    slug: "vivienda",
    name: "Vivienda",
    description:
      "Decisiones de arriendo y compra. Las calculadoras de esta categoría llegan después.",
    icon: "home",
  },
  {
    id: "freelancers",
    slug: "freelancers",
    name: "Freelancers",
    description:
      "Tarifas y cotizaciones para trabajo independiente. Aún no hay una calculadora propia.",
    icon: "freelance",
  },
  {
    id: "vida-cotidiana",
    slug: "vida-cotidiana",
    name: "Vida cotidiana",
    description:
      "Porcentajes, descuentos y comparaciones que sirven en el día a día.",
    icon: "daily",
  },
] as const;

export type ToolCategory = (typeof categories)[number]["id"];
export type CategoryIcon = (typeof categories)[number]["icon"];

export function getCategory(id: ToolCategory): (typeof categories)[number] {
  const category = categories.find((item) => item.id === id);
  if (!category) {
    throw new Error(`Unknown category: ${id}`);
  }

  return category;
}

export function getCategoryBySlug(
  slug: string,
): (typeof categories)[number] | undefined {
  return categories.find((item) => item.slug === slug);
}
