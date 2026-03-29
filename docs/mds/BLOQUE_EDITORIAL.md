# BLOQUE MDS — FLUJO EDITORIAL OVA
## Motor de Evaluación Académica · Criminalística I (Piloto)

**Repositorio:** `pasionCode/lexum`
**Ruta del bloque:** `ova-motor/docs/mds/`
**Apertura:** 2026-03-29
**Versión:** v2
**Estado:** ABIERTO

---

## Índice del bloque

| Archivo | Contenido | Estado |
|---|---|---|
| `01_APERTURA.md` | Apertura formal del frente | ✅ Cerrado |
| `02_BASELINE.md` | Estado real de partida | ✅ Cerrado |
| `03_DISEÑO_MINIMO.md` | Modelo lógico y artefactos editoriales | ✅ Cerrado |
| `04_VALIDACION_PILOTO.md` | Plantilla de validación del piloto | ⏳ En curso |
| `05_CIERRE.md` | Nota de cierre del bloque | ⬜ Pendiente |

---

## Descripción del frente

Este bloque gobierna el desarrollo del **flujo editorial piloto** que
convierte transcripciones de clase en hallazgos evaluables y, como
salida operativa inmediata, en preguntas JSON para el banco del OVA.

**Distinción de capas:**

```
CONOCIMIENTO CANÓNICO          SALIDA OPERATIVA DEL PILOTO
(aún sin persistencia)         (banco JSON del OVA)

Transcripción
    ↓
Fragmento (eje editorial)
    ↓
Hallazgo ←————————————————— unidad editorial mínima
    ↓
Pregunta JSON ————————————→  /public/bancos/*.json
                               (consumo del OVA, no fuente canónica)
```

El banco JSON en `/public/bancos/` es la **salida de consumo del piloto**,
no la arquitectura canónica final del conocimiento. La capa de
persistencia estructurada que gobernará el conocimiento a largo plazo
es objeto de un bloque posterior.

---

## Criterio de cierre del bloque

Este bloque se cierra cuando:

1. El flujo editorial corre sobre una transcripción real de Jaramillo
2. El JSON generado pasa validación editorial sin correcciones mayores
3. El JSON integra al OVA sin romper el build
4. La plantilla de validación registra evidencia de runtime
5. Cada pregunta tiene trazabilidad documentada hacia su hallazgo origen

---

*Bloque gobernado bajo MDS v2.3 — no se avanza sin evidencia de cierre de etapa anterior.*
