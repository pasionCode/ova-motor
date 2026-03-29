# 03 · DISEÑO MÍNIMO
## Modelo Lógico y Artefactos Editoriales

---

**Fecha:** 2026-03-29
**Versión del documento:** v2
**Estado de esta etapa:** CERRADO

---

## 1. Modelo lógico mínimo

Cinco entidades describen el flujo completo. La distinción clave:
`HALLAZGO` es la unidad editorial mínima del conocimiento;
`PREGUNTA` es su derivación evaluativa para el piloto.
El JSON es salida de consumo, no fuente canónica.

```
CLASE
  └── tiene una o más TRANSCRIPCIONES
        └── se divide en FRAGMENTOS (por eje editorial)
              └── cada fragmento produce HALLAZGOS
                    │
                    └── [derivación evaluativa del piloto]
                          └── PREGUNTA → JSON → OVA
```

La flecha punteada indica que la pregunta JSON es una derivación
operativa del hallazgo, no el hallazgo mismo. En una arquitectura
canónica futura, el hallazgo persistiría independientemente de
cualquier derivación evaluativa.

---

### Entidad: CLASE

Sesión académica real. Unidad de trazabilidad de origen.

| Atributo | Tipo | Ejemplo |
|---|---|---|
| `id` | string | `CR_10` |
| `fecha` | date | `2026-03-10` |
| `materia` | string | `Criminalística I` |
| `docente` | string | `Jaramillo` |
| `parcial` | string | `P2` |
| `temas_principales` | string[] | `["Evidencia invisible", "Lofoscopia"]` |

---

### Entidad: TRANSCRIPCIÓN

Texto crudo capturado del audio de la clase.
Punto de entrada del flujo editorial.

| Atributo | Tipo | Ejemplo |
|---|---|---|
| `clase_id` | string | `CR_10` |
| `formato` | string | `docx` |
| `calidad` | enum | `alta / media / baja` |
| `notas_de_ruido` | string | `"Interrupciones minuto 12-15"` |

---

### Entidad: FRAGMENTO

Recorte temático de la transcripción clasificado por eje editorial.
Unidad de procesamiento del flujo.

| Atributo | Tipo | Ejemplo |
|---|---|---|
| `transcripcion_id` | string | `CR_10` |
| `eje` | enum | `norma / criminalistica / cadena / anecdota` |
| `texto_original` | string | Fragmento literal de la transcripción |
| `resumen` | string | Síntesis del concepto central |

---

### Entidad: HALLAZGO

**Unidad editorial mínima del conocimiento extraído.**

Un hallazgo es un concepto evaluable identificado en un fragmento.
Existe con independencia de cualquier derivación evaluativa.
En el piloto se convierte en pregunta JSON; en una arquitectura
canónica futura persistiría en base de datos por sí mismo.

| Atributo | Tipo | Ejemplo |
|---|---|---|
| `id` | string | `H_CR10_001` |
| `fragmento_id` | string | Referencia al fragmento origen |
| `clase_id` | string | `CR_10` |
| `eje` | enum | `criminalistica` |
| `concepto` | string | `"Evidencia invisible requiere reactivo químico para revelarse"` |
| `nivel` | enum | `definición / aplicación / análisis / caso` |
| `evaluable` | boolean | `true` |
| `nota_editorial` | string | `"Docente lo ejemplifica con huellas en vidrio pulimentado"` |

El atributo `id` del hallazgo es la **clave de trazabilidad** entre
la pregunta JSON del piloto y su origen en la transcripción.

---

### Entidad: PREGUNTA

**Derivación evaluativa del hallazgo. Salida de consumo del piloto.**

No es el conocimiento en sí — es la forma en que ese conocimiento
se evalúa a través del OVA en esta etapa del proyecto.

| Atributo | Tipo | Ejemplo |
|---|---|---|
| `id` | number | `307` |
| `hallazgo_ref` | string | `H_CR10_001` — trazabilidad al hallazgo origen |
| `tema` | string | `"Clasificación de Evidencia"` |
| `tipo` | enum | `MC / TF / CC / CD` |
| `parcial` | string | `P2` |
| `pregunta` | string | Texto de la pregunta |
| `opciones` | string[] | Solo para MC |
| `respuesta` | any | Según tipo |
| `palabrasClave` | string[] | Para CC y CD |
| `explicacion` | string | Retroalimentación pedagógica |

> **Nota:** el atributo `hallazgo_ref` no existe aún en el banco JSON
> del OVA. Se introduce aquí como campo de trazabilidad para el piloto.
> Su inclusión en el JSON es opcional en esta etapa pero recomendable
> para preparar la migración a persistencia estructurada.

---

## 2. Prompt maestro v1

```
SISTEMA:
Eres un asistente editorial especializado en criminalística colombiana.
Tu tarea es extraer hallazgos evaluables de transcripciones de clase
del docente Carlos Augusto Jaramillo Gutiérrez (Universidad de Medellín)
y convertirlos en preguntas JSON para el banco del OVA Motor.

FLUJO DE TRABAJO:
1. Lees la transcripción completa
2. Identificas fragmentos por eje editorial
3. Extraes hallazgos de cada fragmento
4. Conviertes cada hallazgo en una o más preguntas JSON
5. Reportas la trazabilidad: hallazgo_ref por cada pregunta

EJES EDITORIALES (solo procesas contenido de estos ejes):
1. NORMA/CPP: artículos citados con consecuencia evaluable
2. CRIMINALÍSTICA: principios, conceptos y procedimientos técnicos
3. CADENA DE CUSTODIA: CAPRICIAS, etapas, formatos, embalaje
4. ANÉCDOTA PEDAGÓGICA: casos reales que ilustran conceptos evaluables

REGLAS DE EXTRACCIÓN:
- Solo conviertes en hallazgo lo que el docente enfatiza o repite
- Si el docente corrige un error, el hallazgo refleja la corrección
- Las anécdotas se formulan por el CONCEPTO que ilustran, no el relato
- Los artículos CPP se citan con número exacto verificado
- No inventas contenido; todo viene de la transcripción
- Cada pregunta incluye el campo hallazgo_ref con ID del hallazgo origen

TIPOS DE PREGUNTA (distribuir equilibradamente):
- MC: selección múltiple, 4 opciones, 1 correcta
- TF: afirmación verdadero/falso con justificación
- CC: caso clínico con escenario y pregunta abierta
- CD: completar definición con palabras clave

FORMATO DE SALIDA:
JSON válido con estructura exacta del banco OVA.
Campos obligatorios: id, hallazgo_ref, tema, tipo, parcial,
pregunta, respuesta, explicacion.
MC agrega: opciones. CC/CD agregan: palabrasClave.

RESTRICCIONES:
- Sin lenguaje subjetivo en las explicaciones
- Sin términos no aparecidos en la transcripción
- Si hay duda sobre un dato, agrégalo como nota_editorial, no lo inventes
- El JSON es salida de consumo del piloto; la fuente es el hallazgo
```

---

## 3. Guía editorial v1

### Criterios de inclusión

Un fragmento **SÍ entra** al banco si:

- El docente lo define con término técnico explícito
- El docente lo repite en más de una clase
- El docente señala explícitamente que es evaluable
- Es una distinción entre dos conceptos que el docente contrasta
- Es una anécdota con concepto técnico subyacente identificable
- Es un artículo CPP/CP citado con número y consecuencia

### Criterios de exclusión

Un fragmento **NO entra** al banco si:

- Es gestión académica (tareas, asistencia, grupos)
- Es broma o comentario sin contenido evaluable
- Es ruido de transcripción (palabras ininteligibles, conversación lateral)
- Es contenido de otra materia sin vínculo con criminalística
- Es opinión personal del docente sin base técnica verificable

### Niveles de hallazgo y tipos de pregunta recomendados

| Nivel | Descripción | Tipo recomendado |
|---|---|---|
| **Definición** | Qué es, cómo se llama, qué significa | CD, MC |
| **Aplicación** | Cómo se usa en escena o en juicio | MC, TF |
| **Análisis** | Por qué, qué diferencia, qué implica | TF, MC |
| **Caso** | Dado un escenario, qué ocurre | CC |

### Distribución recomendada por banco

| Tipo | % recomendado |
|---|---|
| MC | 40–50% |
| TF | 10–15% |
| CC | 20–25% |
| CD | 15–20% |

---

## 4. Convención de IDs

Para evitar colisiones entre bancos:

| Banco | Rango de IDs |
|---|---|
| P1 Criminalística | 1 – 199 |
| P2 Criminalística | 200 – 399 |
| P3 Criminalística | 400 – 599 |
| P4 Criminalística | 600 – 799 |
| Otras materias | 1000+ (por materia) |

---

*Diseño mínimo cerrado. Siguiente etapa: `04_VALIDACION_PILOTO.md`*
