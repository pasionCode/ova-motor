# PROMPT MAESTRO JARAMILLO V1

## 1. Propósito
Extraer conocimiento estructurado desde transcripciones de clases de Criminalística del profesor Jaramillo, con orientación editorial y trazabilidad para futura conversión en instrumentos de estudio.

## 2. Alcance
La extracción debe organizarse en cuatro ejes editoriales obligatorios:
1. Norma y referencias al Código de Procedimiento Penal.
2. Conceptos de criminalística.
3. Conceptos, reglas o procedimientos vinculados al manual de cadena de custodia de la Fiscalía y la Policía Nacional.
4. Anécdotas pedagógicas utilizadas por el profesor para fijar conceptos clave.

## 3. Instrucción maestra
Analiza la transcripción suministrada y extrae exclusivamente información sustentada en el texto de la clase.

Organiza la salida por hallazgos verificables. Cada hallazgo debe quedar clasificado en uno de los cuatro ejes editoriales obligatorios. Si un mismo fragmento aplica a más de un eje, repórtalo en todos los ejes pertinentes sin duplicar artificialmente el contenido.

Para cada hallazgo entrega:
- eje editorial;
- título corto;
- síntesis técnica;
- cita textual relevante, cuando exista;
- indicación de si se trata de cita expresa, inferencia razonable o dato pendiente de verificación;
- explicación de por qué ese hallazgo es importante para estudiar;
- indicación de si el hallazgo es potencialmente evaluable;
- referencia al fragmento o pasaje de origen.

Reglas obligatorias:
- no inventes normas, artículos, manuales ni definiciones;
- si una referencia normativa está incompleta, márcala como pendiente de verificación;
- diferencia con claridad entre lo dicho expresamente por el profesor y lo inferido;
- cuando aparezca una anécdota, identifica la enseñanza concreta que transmite y el concepto que ayuda a fijar;
- privilegia precisión editorial sobre cantidad;
- evita repetir el mismo hallazgo en formulaciones distintas.

## 4. Formato de salida esperado
La salida debe venir en Markdown, con esta estructura:

### A. Resumen ejecutivo
- tema central de la clase;
- subtemas detectados;
- número estimado de hallazgos útiles.

### B. Hallazgos por eje editorial

#### 1. Norma / CPP
Para cada hallazgo:
- título;
- síntesis;
- cita o referencia;
- estado: expresa / inferida / pendiente de verificación;
- utilidad pedagógica;
- evaluable: sí / no;
- fragmento de origen.

#### 2. Conceptos de criminalística
Misma estructura.

#### 3. Cadena de custodia
Misma estructura.

#### 4. Anécdotas pedagógicas
Para cada anécdota:
- breve relato;
- concepto que ilustra;
- lección pedagógica;
- error que previene;
- utilidad para estudio;
- fragmento de origen.

### C. Vacíos o alertas editoriales
- referencias dudosas;
- conceptos incompletos;
- puntos que requieren revisión humana.

## 5. Restricción metodológica
No conviertas todavía los hallazgos en preguntas cerradas de opción múltiple, salvo que se te pida expresamente en una segunda etapa. En esta primera etapa tu tarea es extraer y estructurar conocimiento con trazabilidad.
