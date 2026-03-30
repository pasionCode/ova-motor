#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# INICIALIZACION DE CORPUS EDITORIAL
# Proyecto: OVA-MOTOR
# Frente: Criminalistica / Jaramillo
# Objetivo:
# - Crear estructura editorial del corpus
# - Copiar fuentes originales
# - Generar copias de trabajo renombradas
# - Preparar carpetas por clase
# - Incorporar manuales
# - Generar manifiesto trazable
# ============================================================

# -----------------------------
# AJUSTAR ESTAS RUTAS REALES
# -----------------------------
SOURCE_TRANSCRIPCIONES_DIR="/c/TRABAJO/03_INVESTIGACION_CRIMINAL/01_FORMACION/INVESTIGACIÓN CRIMINAL/CRIMINALÍSTICA/TRANSCRIPCIONES"
SOURCE_MANUALES_DIR="/c/TRABAJO/01_DERECHO/04_AREAS_DEL_DERECHO/PENAL/CADENA_CUSTODIA"

# Nombres exactos de los dos manuales
MANUAL_POLICIA_FILE="Manual-de-Policia-Judicial-Actualizado.pdf"
MANUAL_FISCALIA_FILE="MANUAL-DEL-SISTEMA-DE-CADENA-DE-CUSTODIA.pdf"

# Comportamiento de sobreescritura:
# 0 = no sobreescribir si ya existe
# 1 = sobreescribir
ALLOW_OVERWRITE=0

# -----------------------------
# VALIDACIONES DE ENTORNO
# -----------------------------
if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git no esta disponible en el entorno." >&2
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "ERROR: no se detecto una raiz Git valida." >&2
  exit 1
fi

cd "${REPO_ROOT}"

if [[ ! -d "${SOURCE_TRANSCRIPCIONES_DIR}" ]]; then
  echo "ERROR: no existe SOURCE_TRANSCRIPCIONES_DIR: ${SOURCE_TRANSCRIPCIONES_DIR}" >&2
  exit 1
fi

if [[ ! -d "${SOURCE_MANUALES_DIR}" ]]; then
  echo "ERROR: no existe SOURCE_MANUALES_DIR: ${SOURCE_MANUALES_DIR}" >&2
  exit 1
fi

# -----------------------------
# ESTRUCTURA DESTINO
# -----------------------------
BASE="corpus/criminalistica/jaramillo"

DIR_ORIG_TRANS="${BASE}/00_fuentes_originales/transcripciones"
DIR_ORIG_MAN="${BASE}/00_fuentes_originales/manuales"

DIR_LIMPIAS="${BASE}/01_transcripciones_limpias"
DIR_EXTRACCION="${BASE}/02_extraccion_por_clase"
DIR_CONTRASTE="${BASE}/03_contraste_manuales"
DIR_CONSOLIDADO="${BASE}/04_consolidado"
DIR_BANCO="${BASE}/05_banco_borrador"

DIR_DOCS_EDITORIAL="docs/editorial"

mkdir -p "${DIR_ORIG_TRANS}"
mkdir -p "${DIR_ORIG_MAN}"
mkdir -p "${DIR_LIMPIAS}"
mkdir -p "${DIR_EXTRACCION}"
mkdir -p "${DIR_CONTRASTE}"
mkdir -p "${DIR_CONSOLIDADO}"
mkdir -p "${DIR_BANCO}"
mkdir -p "${DIR_DOCS_EDITORIAL}"
mkdir -p "scripts"

# -----------------------------
# MAPEO DE TRANSCRIPCIONES
# Regla:
# - no inventar fechas para CR_*
# - usar fecha normalizada solo cuando ya viene en el nombre
# -----------------------------
declare -A TRANSCRIPCIONES=(
  ["CR_C1.docx"]="CR_C1"
  ["CR_C2.docx"]="CR_C2"
  ["CR_C3.docx"]="CR_C3"
  ["CR_C4.docx"]="CR_C4"
  ["CR_C5.docx"]="CR_C5"
  ["CR_C6.docx"]="CR_C6"
  ["CR_C7.docx"]="CR_C7"
  ["CR_8.docx"]="CR_8"
  ["CR_9.docx"]="CR_9"
  ["CR_10.docx"]="CR_10"
  ["11-03-2026.docx"]="2026-03-11"
  ["16-03-2026.docx"]="2026-03-16"
  ["18-03-2026.docx"]="2026-03-18"
  ["25-03-2026.docx"]="2026-03-25"
)

MANIFIESTO="${BASE}/MANIFIESTO_CORPUS.csv"
echo "tipo,id,nombre_original,destino_original,destino_trabajo,sha256" > "${MANIFIESTO}"

safe_copy() {
  local src="$1"
  local dst="$2"

  if [[ ! -f "${src}" ]]; then
    echo "ERROR: no existe archivo fuente: ${src}" >&2
    exit 1
  fi

  mkdir -p "$(dirname "${dst}")"

  if [[ -f "${dst}" && "${ALLOW_OVERWRITE}" -eq 0 ]]; then
    echo "INFO: se conserva archivo existente: ${dst}"
    return 0
  fi

  cp -f "${src}" "${dst}"
}

create_placeholder_file() {
  local path="$1"
  local content="$2"

  if [[ -f "${path}" && "${ALLOW_OVERWRITE}" -eq 0 ]]; then
    return 0
  fi

  printf "%s\n" "${content}" > "${path}"
}

# -----------------------------
# COPIA DE TRANSCRIPCIONES
# -----------------------------
for original_name in "${!TRANSCRIPCIONES[@]}"; do
  class_id="${TRANSCRIPCIONES[$original_name]}"

  src="${SOURCE_TRANSCRIPCIONES_DIR}/${original_name}"
  dst_orig="${DIR_ORIG_TRANS}/${original_name}"

  class_dir_limpia="${DIR_LIMPIAS}/${class_id}"
  class_dir_extraccion="${DIR_EXTRACCION}/${class_id}"
  class_dir_contraste="${DIR_CONTRASTE}/${class_id}"
  class_dir_banco="${DIR_BANCO}/${class_id}"

  mkdir -p "${class_dir_limpia}"
  mkdir -p "${class_dir_extraccion}"
  mkdir -p "${class_dir_contraste}"
  mkdir -p "${class_dir_banco}"

  # 1. Original intacto
  safe_copy "${src}" "${dst_orig}"

  # 2. Copia de trabajo renombrada
  dst_work="${class_dir_limpia}/${class_id}__fuente.docx"
  safe_copy "${src}" "${dst_work}"

  # 3. Placeholder para limpieza
  create_placeholder_file \
    "${class_dir_limpia}/${class_id}__transcripcion_limpia.md" \
"# TRANSCRIPCION LIMPIA — ${class_id}

## Fuente original
- Archivo original: ${original_name}

## Estado
- Pendiente de limpieza

## Observaciones
- Eliminar ruido de transcripcion
- Separar contenido academico de interferencias
- Conservar trazabilidad con el original
"

  # 4. Placeholder para extraccion
  create_placeholder_file \
    "${class_dir_extraccion}/${class_id}__extraccion_v1.md" \
"# EXTRACCION V1 — ${class_id}

## Estado
- Pendiente

## Ejes
1. Norma / CPP
2. Criminalistica
3. Cadena de custodia
4. Anecdota pedagogica
"

  # 5. Placeholder para contraste
  create_placeholder_file \
    "${class_dir_contraste}/${class_id}__contraste_v1.md" \
"# CONTRASTE V1 — ${class_id}

## Estado
- Pendiente

## Referencias
- Manual de cadena de custodia Policia Nacional
- Manual de cadena de custodia Fiscalia
"

  # 6. Placeholder para banco borrador
  create_placeholder_file \
    "${class_dir_banco}/${class_id}__banco_borrador_v1.md" \
"# BANCO BORRADOR V1 — ${class_id}

## Estado
- Pendiente

## Observaciones
- No poblar hasta cerrar extraccion y contraste
"

  sha="$(sha256sum "${dst_orig}" | awk '{print $1}')"
  echo "transcripcion,${class_id},${original_name},${dst_orig},${dst_work},${sha}" >> "${MANIFIESTO}"
done

# -----------------------------
# COPIA DE MANUALES
# -----------------------------
if [[ -n "${MANUAL_POLICIA_FILE}" && "${MANUAL_POLICIA_FILE}" != "<NOMBRE_EXACTO_MANUAL_POLICIA>" ]]; then
  src_pol="${SOURCE_MANUALES_DIR}/${MANUAL_POLICIA_FILE}"
  dst_pol="${DIR_ORIG_MAN}/${MANUAL_POLICIA_FILE}"
  safe_copy "${src_pol}" "${dst_pol}"
  sha_pol="$(sha256sum "${dst_pol}" | awk '{print $1}')"
  echo "manual,MANUAL_POLICIA,${MANUAL_POLICIA_FILE},${dst_pol},,${sha_pol}" >> "${MANIFIESTO}"
else
  echo "ADVERTENCIA: no se configuro MANUAL_POLICIA_FILE"
fi

if [[ -n "${MANUAL_FISCALIA_FILE}" && "${MANUAL_FISCALIA_FILE}" != "<NOMBRE_EXACTO_MANUAL_FISCALIA>" ]]; then
  src_fis="${SOURCE_MANUALES_DIR}/${MANUAL_FISCALIA_FILE}"
  dst_fis="${DIR_ORIG_MAN}/${MANUAL_FISCALIA_FILE}"
  safe_copy "${src_fis}" "${dst_fis}"
  sha_fis="$(sha256sum "${dst_fis}" | awk '{print $1}')"
  echo "manual,MANUAL_FISCALIA,${MANUAL_FISCALIA_FILE},${dst_fis},,${sha_fis}" >> "${MANIFIESTO}"
else
  echo "ADVERTENCIA: no se configuro MANUAL_FISCALIA_FILE"
fi

# -----------------------------
# DOCUMENTO DE LECTURA RAPIDA
# -----------------------------
README_CORPUS="${BASE}/README.md"
create_placeholder_file "${README_CORPUS}" \
"# CORPUS CRIMINALISTICA / JARAMILLO

## Estructura
- 00_fuentes_originales: originales intocados
- 01_transcripciones_limpias: copias de trabajo y limpieza
- 02_extraccion_por_clase: salidas editoriales por clase
- 03_contraste_manuales: contraste clase vs manuales
- 04_consolidado: acumulados tematicos
- 05_banco_borrador: preguntas propuestas antes del motor

## Regla operativa
- Los originales no se editan.
- Las copias de trabajo viven en 01_transcripciones_limpias.
- La extraccion se hace por clase.
- No poblar banco hasta cerrar extraccion y contraste.
"

echo
echo "=== ESTRUCTURA CREADA ==="
find "${BASE}" -maxdepth 3 -type d | sort

echo
echo "=== MANIFIESTO ==="
sed -n '1,200p' "${MANIFIESTO}"

echo
echo "=== GIT STATUS ==="
git status --short
