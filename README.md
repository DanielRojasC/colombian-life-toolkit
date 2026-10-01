# "Tu Caja de Herramientas para Colombia"

Sitio estático de calculadoras para decisiones cotidianas en Colombia. Los cálculos corren en el navegador. No hay cuentas, base de datos ni backend.

## Stack

- Astro y TypeScript estricto
- HTML y CSS
- JavaScript solo en buscador y calculadoras
- Vitest para la matemática
- ESLint y Prettier

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

Define la URL pública antes de construir. Sirve para los enlaces canónicos, Open Graph y el sitemap.

```bash
SITE_URL=https://tu-dominio.example npm run build
npm run preview
```

Si omites `SITE_URL`, el build usa `http://localhost:4321`.

## Pruebas y verificación

```bash
npm test
npm run lint
npm run typecheck
npm run verify
```

`verify` ejecuta lint, chequeo de tipos, pruebas y build.

## Arquitectura

```text
páginas Astro
  → application/tools        lee el formulario y valida
    → domain                  calcula, sin DOM ni red
      → labor/rules           porcentajes y topes con fuente
infraestructura
  → sources                   fichas de normas
  → analytics                 eventos en el navegador, sin proveedor
```

El texto visible está en español. El código, en inglés.

## Convenciones

- Commits: `feat(tools): ...`, `fix(credit): ...`
- Ramas: `main`, `develop`, `feature/*`, `fix/*`
- Pesos enteros, redondeo half-up al peso
- No inventar una regla laboral que no esté en `labor-rules.ts` y en `/fuentes`

## Despliegue

El build de `dist/` se puede publicar en Cloudflare Pages, Netlify, Vercel u otro hosting estático. No depende de un proveedor.

## Variables

| Variable   | Uso                                                  |
| ---------- | ---------------------------------------------------- |
| `SITE_URL` | Origen público en tiempo de build. No es un secreto. |

No hay variables `PUBLIC_` con llaves. La analítica no llama a un tercero. El script de AdSense vive en `src/config/ads.ts`. Los espacios manuales siguen apagados hasta tener un id de bloque.

## Decisiones

Ver `docs/adr/`.
