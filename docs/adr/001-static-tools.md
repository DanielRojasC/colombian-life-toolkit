# ADR 001 — Sitio estático y lógica fuera de la interfaz

## Estado

Aceptada. 2026-10-01.

## Decisión

El MVP es un sitio Astro sin framework de cliente. Cada calculadora es una función pura en `src/domain`. La página solo lee el formulario y pinta el resultado.

No hay React, base de datos, login ni API. Esas piezas pueden aparecer después sin mover las fórmulas, porque el dominio no importa infraestructura.

## Consecuencias

El cálculo requiere JavaScript. La explicación, las fuentes y las preguntas quedan en HTML para quien no lo tenga y para los buscadores.
