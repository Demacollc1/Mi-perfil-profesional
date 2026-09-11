# Mi Perfil Profesional — Roberth Gomez Da Silva

Perfil profesional trilingüe (EN / ES / PT) como sitio estático de una sola página.
Diseñado para: aplicaciones de trabajo, consultorías y contenido en redes sociales.

**Live:** publicar con GitHub Pages desde la rama `main` (o `claude/professional-profile-projects-wkvw8d` mientras se itera).

## Estructura

```
.
├── index.html            # Estructura semántica de la página
├── assets/
│   ├── styles.css        # Tema navy + accent azul, light/dark, print-ready
│   ├── data.js           # ÚNICA fuente de verdad — toda la info trilingüe
│   └── app.js            # Rendering, i18n, filtros, theme toggle
├── data/                 # Reservado para JSON externos
└── docs/                 # Reservado para PDFs / assets descargables
```

## Editar contenido

Todo el contenido vive en **`assets/data.js`**. No hay CMS, no hay base de datos.

Para actualizar:

- **Proyectos:** editar array `projects` — id, categoría, título, meta, bullets, stack.
- **Experiencia:** editar array `experience`.
- **Habilidades:** editar array `skills` (agrupado por dominio).
- **Educación / Certificaciones / Idiomas:** arrays al final del archivo.

Cada bloque tiene 3 subclaves (`en`, `es`, `pt`). Si dejas una en blanco, cae en inglés por default.

## Configurar el formulario de contacto

El form usa Formspree como placeholder. En `index.html` buscar:

```html
<form ... action="https://formspree.io/f/YOUR_FORM_ID" ...>
```

Reemplazar `YOUR_FORM_ID` con el ID real de Formspree (o cambiar a Netlify Forms).
Mientras esté como placeholder, el form abre `mailto:demacollc@gmail.com` como fallback.

## Publicar en GitHub Pages

Ya hay un workflow de GitHub Actions (`.github/workflows/pages.yml`) que despliega el sitio en cada push a `main`.

**Paso único de activación (una sola vez):**

1. Ir a `Settings` → `Pages` en el repo
2. En `Build and deployment` → `Source`, seleccionar **GitHub Actions**
3. Guardar

Después de eso, cada push a `main` publica el sitio en `https://demacollc1.github.io/Mi-perfil-profesional/`. Para desplegar manualmente sin push, ir a `Actions` → `Deploy to GitHub Pages` → `Run workflow`.

## Categorías de proyectos

- `ai` — IA, Claude Code, RAG, agentes
- `erp` — JD Edwards, EDI, motor fiscal
- `bi` — Tableau, dashboards, analítica
- `tms` — Logística, flota, última milla
- `sales` — CRM, comisiones, marketing
- `construction` — Obras civiles, WMS/TMS planning

Un proyecto puede tener múltiples categorías (array).

## Notas técnicas

- Sin frameworks. Sin build step.
- Compatible con GitHub Pages, Netlify, Vercel, S3 estático.
- Print-friendly: `Ctrl+P` da un PDF decente sin header/footer del sitio.
- Theme: respeta `prefers-color-scheme`; el toggle en header override manualmente.
- i18n: persiste selección de idioma en `localStorage`.
