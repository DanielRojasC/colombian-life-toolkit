# ADR 003 — Alcance laboral y dependencias

## Estado

Aceptada. 2026-10-01.

## Reglas incluidas

- Salario mínimo 2026: Decreto 1469 de 2025, $1.750.905. El Decreto 159 de 2026 repitió el mismo valor.
- Salud del trabajador: 4 %. Pensión del trabajador: 4 %, porque el Decreto 4982 de 2007 fija 16 % y la Ley 797 asigna el 25 % de esa cotización al trabajador.
- Fondo de solidaridad: tabla de la Ley 797 de 2003, artículo 7.
- Tope de cotización usado: 25 SMMLV. No se aplica un tope reglamentario mayor.
- Prima, cesantías, intereses del 12 % y vacaciones de 15 días, con año de 360 días.

## Reglas dejadas fuera

Retención en la fuente, indemnización, salario integral y el valor vigente del auxilio de transporte. No estaban verificadas con el detalle que exigiría calcularlas, o dependen de datos que el usuario debe traer. El auxilio, cuando aplica, lo escribe la persona.

## Dependencias

- `@astrojs/sitemap`: genera el sitemap sin mantenerlo a mano.
- `vitest`: corre las pruebas de TypeScript sin pelear con la resolución de Node.
- ESLint, typescript-eslint, eslint-plugin-astro y Prettier: los pide el criterio de calidad del proyecto.

No hay librería de anuncios ni de analítica. Los dos tienen un punto de extensión y están inactivos.
