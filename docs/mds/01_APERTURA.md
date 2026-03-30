# 01 · APERTURA FORMAL DEL BLOQUE
## Flujo Editorial OVA — Criminalística I (Piloto)

---

**Fecha de apertura:** 2026-03-29
**Responsable:** Paul Duque
**Frente:** Flujo editorial: transcripción → hallazgo → banco OVA (piloto)
**Versión MDS:** 2.3
**Versión del documento:** v2
**Estado:** ABIERTO

---

## Justificación de apertura

El OVA Motor tiene un banco funcional para Criminalística I
(P1: 133 preguntas, P2: 96 preguntas). Sin embargo, el proceso
que convierte transcripciones en preguntas JSON es actualmente
**artesanal, manual y no trazable**.

Este bloque formaliza ese flujo como proceso **gobernado y reproducible**.

---

## Encuadre del piloto

La integración al OVA es la **salida operativa inmediata** del piloto,
no la arquitectura final del sistema.

Esta distinción es deliberada:

| Capa | Descripción | Estado |
|---|---|---|
| **Flujo editorial** | Transcripción → hallazgo → pregunta | Este bloque |
| **Salida del piloto** | JSON en `/public/bancos/` del OVA | Transitoria |
| **Persistencia canónica** | Base de datos estructurada del conocimiento | Bloque futuro |

El piloto valida el flujo editorial y produce un JSON útil
para el OVA hoy. No resuelve la persistencia del conocimiento
a largo plazo — ese es un problema de un bloque diferente.

---

## Alcance del bloque

**Incluye:**
- Modelo lógico mínimo del flujo editorial
- Prompt maestro de extracción v1
- Guía editorial con criterios de inclusión/exclusión
- Plantilla de validación con trazabilidad de hallazgo origen
- Ejecución del piloto sobre una transcripción real de Jaramillo
- JSON resultante integrado al OVA sin errores de build

**No incluye (bloque futuro):**
- Backend de persistencia ni base de datos
- Automatización del flujo
- Capa canónica del conocimiento
- Panel de administración
- Integración con Moodle u otros LMS

---

## Entregables comprometidos

| # | Entregable | Criterio de cierre |
|---|---|---|
| E1 | Modelo lógico mínimo | Cinco entidades definidas con atributos |
| E2 | Prompt maestro v1 | Genera preguntas válidas sobre transcripción real |
| E3 | Guía editorial v1 | Cubre los 4 ejes con criterios de inclusión/exclusión |
| E4 | Plantilla de validación | Incluye trazabilidad hallazgo → pregunta |
| E5 | Piloto ejecutado | JSON integrado al OVA + build verde + evidencia registrada |

---

## Condición de avance (MDS v2.3)

> Ninguna etapa se da por cerrada sin evidencia de runtime.
> El piloto no se considera exitoso hasta que el JSON generado
> pase por el OVA sin errores y la trazabilidad quede registrada
> en la plantilla de validación.

---

*Apertura registrada. Siguiente etapa: `02_BASELINE.md`*
