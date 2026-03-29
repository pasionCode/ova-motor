# 02 · BASELINE
## Estado Real de Partida — Flujo Editorial OVA

---

**Fecha:** 2026-03-29
**Versión del documento:** v2
**Estado de esta etapa:** CERRADO

---

## 1. Materia piloto

| Campo | Valor |
|---|---|
| **Materia** | Criminalística I |
| **Programa** | Investigación Criminal |
| **Universidad** | Universidad de Medellín |
| **Docente** | Carlos Augusto Jaramillo Gutiérrez |
| **Parciales** | 4 (P1 completado, P2 en curso, P3–P4 pendientes) |

---

## 2. Estado actual del banco

| Banco | Preguntas | Temas | Estado |
|---|---|---|---|
| `criminalistica-p1.json` | 133 | 15 | ✅ Estable |
| `criminalistica-p2.json` | 96 | 18 | ✅ Estable |
| `criminalistica-p1.demo.json` | 15 | 15 | ✅ Estable |
| `criminalistica-p2.demo.json` | 20 | 18 | ✅ Estable |

**Nota:** estos bancos son la salida operativa del flujo artesanal
actual. Son funcionales para el OVA pero no constituyen una capa
canónica del conocimiento. No existe hoy ningún sistema de persistencia
estructurada ni trazabilidad automatizada entre pregunta y fuente.

---

## 3. Estado del flujo editorial — diagnóstico honesto

### Lo que existe hoy

```
Docente dicta clase
      ↓
Estudiante transcribe (audio → texto .docx)
      ↓
Estudiante entrega transcripción a Claude en sesión conversacional
      ↓
Claude extrae conceptos sin criterio editorial documentado
      ↓
Claude genera preguntas JSON en el chat
      ↓
Estudiante valida manualmente sin plantilla formal
      ↓
JSON se copia al banco del OVA
```

### Problemas del flujo actual

| Problema | Impacto |
|---|---|
| Sin criterio editorial documentado | Inclusiones inconsistentes entre parciales |
| Sin trazabilidad pregunta → transcripción | No se puede auditar el origen de ninguna pregunta |
| Sin capa editorial canónica fuera del JSON | El JSON es simultáneamente fuente y salida, sin distinción |
| Sin prompt estándar | Calidad variable según el contexto de cada sesión |
| Sin plantilla de validación | El criterio de aceptación es subjetivo y no reproducible |
| Proceso acoplado a la conversación | No es reproducible sin el historial del chat |

### Lo que no existe hoy

- No hay base de datos estructurada del conocimiento extraído
- No hay capa editorial canónica separada del banco JSON
- No hay trazabilidad automatizada entre hallazgo y pregunta
- No hay persistencia de los fragmentos ni los hallazgos intermedios
- El JSON en `/public/bancos/` es la única fuente disponible hoy,
  pero es salida de consumo, no fuente canónica

---

## 4. Ejes editoriales oficiales

Todo hallazgo evaluable debe pertenecer a al menos uno de estos ejes.
Son el criterio de inclusión/exclusión del flujo editorial.

### Eje 1 — Norma / CPP
Artículos del CPP, CP y normatividad complementaria citada por el docente
con consecuencia evaluable. Se registra el número exacto verificado.

**Ejemplos confirmados:**
Art. 254 (cadena de custodia), Art. 275 (EMP/EF),
Art. 420/430 (prueba pericial / mesa de la ciencia),
Art. 67–74 (noticia criminal), Ley 2535/1993 (definición de arma).

### Eje 2 — Criminalística
Conceptos, principios, disciplinas y procedimientos técnicos.
Es el eje más denso del curso.

**Ejemplos confirmados:**
Principios criminalísticos (unicidad, uso, producción, correspondencia,
reconstrucción, intercambio, transferencia, certeza), clasificación de
evidencias, dactiloscopia, tanatocronodiagnóstico, metrología forense.

### Eje 3 — Cadena de custodia
Principios CAPRICIAS, etapas del ciclo, formatos FPJ,
embalaje, rotulado y trazabilidad de los EMP/EF.

**Ejemplos confirmados:**
9 requisitos CAPRICIAS, 8 etapas del ciclo,
FPJ 007, reglas de embalaje (papel vs. plástico).

### Eje 4 — Anécdota pedagógica
Casos reales narrados por el docente para ilustrar conceptos.
El docente los evalúa directamente en parcial por el concepto
subyacente, no por el relato literal.

**Anécdotas confirmadas como evaluables:**
La Morcilla, El Noticiero RCN, Media Tonelada en Turbo,
El Avión y el Ciervo, La Pecera, El Jardinero y la Modelo,
Carlos el Chacal, El Cuerpo Envenenado, El Sospechoso en el Bus,
El Accidente con Explosivos.

---

## 5. Restricciones conocidas del piloto

- Las transcripciones son capturas de audio con ruido: errores
  fonéticos, términos distorsionados, conversaciones laterales
  sin contenido evaluable.
- El docente usa anécdotas como vehículo pedagógico pero evalúa
  el concepto subyacente, no el relato.
- Algunos artículos CPP citados en clase tienen errores de numeración
  que el docente corrige. El banco refleja la corrección, no el error.
- El JSON generado es salida de consumo del piloto. No sustituye
  una capa de persistencia canónica del conocimiento.

---

*Baseline cerrado. Siguiente etapa: `03_DISEÑO_MINIMO.md`*
