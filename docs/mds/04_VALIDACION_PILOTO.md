# 04 · VALIDACIÓN DEL PILOTO
## Plantilla de Registro de Evidencia

---

**Versión del documento:** v2
**Estado de esta etapa:** EN CURSO

> Esta plantilla se completa durante y después de la ejecución del piloto.
> Nada se da por cerrado sin evidencia de runtime registrada aquí.

---

## 1. Datos del piloto

| Campo | Valor |
|---|---|
| **Clase** | _(completar al ejecutar)_ |
| **Fecha de clase** | _(completar al ejecutar)_ |
| **Archivo de transcripción** | _(nombre del .docx)_ |
| **Fecha de ejecución del piloto** | _(completar al ejecutar)_ |
| **Ejecutado por** | _(completar al ejecutar)_ |

---

## 2. Checklist de entrada

Antes de correr el flujo, verificar:

- [ ] La transcripción es de una clase real de Jaramillo
- [ ] El archivo está en formato `.docx` legible
- [ ] El parcial al que corresponde está identificado (P1/P2/P3/P4)
- [ ] Los IDs del JSON a generar no chocan con el banco existente
- [ ] El banco actual pasa `npm run build` antes de la integración

---

## 3. Fragmentación por eje editorial

| Eje | Fragmentos identificados | Fragmentos descartados | Motivo de descarte |
|---|---|---|---|
| Norma / CPP | | | |
| Criminalística | | | |
| Cadena de custodia | | | |
| Anécdota pedagógica | | | |
| **Total** | | | |

---

## 4. Registro de hallazgos

Cada hallazgo identificado se registra con su ID de trazabilidad.
Este registro es la fuente de verdad editorial del piloto.

| ID hallazgo | Eje | Concepto | Nivel | Evaluable | Nota editorial |
|---|---|---|---|---|---|
| `H_[clase]_001` | | | | | |
| `H_[clase]_002` | | | | | |
| _(continuar)_ | | | | | |

**Total hallazgos identificados:** ___
**Total hallazgos evaluables:** ___
**Total hallazgos descartados:** ___

---

## 5. Trazabilidad hallazgo → pregunta

Para cada pregunta generada, registrar su hallazgo de origen.
Este es el criterio de trazabilidad para futura persistencia estructurada.

| ID pregunta | hallazgo_ref | Tipo | Tema | Observación |
|---|---|---|---|---|
| | `H_[clase]_001` | | | |
| | `H_[clase]_002` | | | |
| _(continuar)_ | | | | |

**Preguntas sin hallazgo_ref documentado:** ___ (debe ser 0 para aprobar)

---

## 6. Generación de preguntas

| Hallazgos evaluables | Preguntas generadas | MC | TF | CC | CD |
|---|---|---|---|---|---|
| | | | | | |

**IDs asignados:** desde `___` hasta `___`

---

## 7. Validación editorial

Para cada pregunta generada, verificar:

- [ ] La pregunta tiene `hallazgo_ref` documentado
- [ ] El hallazgo_ref existe en el registro de la sección 4
- [ ] El tipo de pregunta corresponde al nivel del hallazgo
- [ ] La respuesta correcta es verificable en la transcripción
- [ ] La explicación no contiene información no aparecida en clase
- [ ] Los artículos CPP tienen número correcto
- [ ] Las anécdotas están formuladas por concepto, no por relato literal
- [ ] No hay términos inventados ni inferidos sin base en la transcripción

**Preguntas con observación editorial:**

| ID pregunta | Observación | Acción tomada |
|---|---|---|
| | | |

---

## 8. Integración al banco

- [ ] JSON generado es válido (sin errores de sintaxis)
- [ ] IDs únicos sin duplicados con banco existente
- [ ] Temas normalizados según convención del banco
- [ ] Campo `hallazgo_ref` presente en cada pregunta
- [ ] Archivo copiado a `ova-motor/public/bancos/`
- [ ] `npm run build` pasa sin errores
- [ ] Preguntas visibles en el OVA (full y demo actualizados si aplica)

**Resultado del build:**
```
_(pegar aquí la salida del terminal)_
```

---

## 9. Evaluación del piloto

| Criterio | Resultado | Observación |
|---|---|---|
| El prompt maestro generó preguntas sin intervención mayor | ✅ / ❌ | |
| La guía editorial fue suficiente para fragmentar | ✅ / ❌ | |
| Todos los hallazgos tienen ID de trazabilidad | ✅ / ❌ | |
| Todas las preguntas tienen hallazgo_ref documentado | ✅ / ❌ | |
| El JSON integró sin errores | ✅ / ❌ | |
| La distribución de tipos fue equilibrada | ✅ / ❌ | |
| Las preguntas son coherentes con el nivel del curso | ✅ / ❌ | |

---

## 10. Nota de trazabilidad para persistencia futura

El campo `hallazgo_ref` en cada pregunta JSON es la semilla de la
trazabilidad que permitirá, en un bloque futuro, migrar el conocimiento
desde el banco JSON hacia una capa de persistencia canónica estructurada.

Al completar este piloto, el registro de hallazgos de la sección 4
debe conservarse como documento de referencia aunque no esté
automatizado en ninguna base de datos todavía.

---

## 11. Ajustes identificados para v2 del flujo

_(Registrar aquí todo lo que el piloto reveló que debe mejorar
en el prompt maestro, la guía editorial o esta plantilla)_

---

## 12. Decisión de cierre

- [ ] El piloto se considera exitoso
- [ ] La trazabilidad hallazgo → pregunta está completa
- [ ] El bloque puede avanzar a `05_CIERRE.md`

**Firma de cierre:** _(completar al ejecutar)_
**Fecha:** _(completar al ejecutar)_

---

*Plantilla v2 lista. Se completa durante la ejecución del piloto.*
*Siguiente etapa: `05_CIERRE.md` — se abre solo cuando esta está completa.*
