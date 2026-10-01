# ADR 002 — Pesos enteros y redondeo

## Estado

Aceptada. 2026-10-01.

## Decisión

El dinero en COP se guarda en pesos enteros. Un porcentaje se aplica como fracción `numerador/denominador` y se redondea half-up. La vista formatea con `es-CO`; no vuelve a calcular.

El crédito es la excepción controlada: la tasa periódica es un número decimal y cada interés del mes se redondea al peso. La última cuota deja el saldo en cero.

No se agregó una librería decimal. El rango de salarios y créditos del MVP cabe en enteros seguros de JavaScript.

## Consecuencias

Una planilla o un banco pueden diferir en pesos por su propio redondeo. Las herramientas lo dicen.
