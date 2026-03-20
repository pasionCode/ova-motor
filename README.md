\# OVA-MOTOR



Motor OVA modular para estudio por parciales con feedback inmediato, historial y repaso de errores.



\## Descripción



OVA-MOTOR es una aplicación construida en \*\*React + Vite\*\* para apoyar el estudio académico mediante cuestionarios interactivos organizados por parciales.  

Su objetivo es servir como \*\*motor maestro reutilizable\*\* para distintas materias, comenzando con \*\*Criminalística I\*\*.



El sistema permite:



\- evaluar por parcial

\- generar modos de práctica por banco completo o demo

\- ofrecer retroalimentación inmediata

\- guardar historial de sesiones

\- identificar preguntas falladas

\- facilitar repaso de errores

\- escalar a nuevas materias sin rehacer el motor



\---



\## Estado del proyecto



\*\*Versión actual:\*\* `v0.1.0`  

\*\*Estado:\*\* baseline estable para uso académico



Esta versión se encuentra congelada como línea base funcional para estudio y validación durante semana de parciales.



\---



\## Funcionalidades actuales



\- Selección de materia

\- Configuración de quiz por:

&#x20; - modo de banco (`full` / `demo`)

&#x20; - parcial

&#x20; - tipo de pregunta

&#x20; - temas

&#x20; - cantidad

\- Ejecución de quiz interactivo

\- Resultado inmediato

\- Historial de intentos

\- Repaso de errores

\- Persistencia local en navegador



\---



\## Estructura general



```text

OVA-MOTOR/

├── public/

│   └── bancos/

├── src/

│   ├── components/

│   │   ├── screens/

│   │   └── ui/

│   ├── engine/

│   ├── storage/

│   ├── styles/

│   ├── App.jsx

│   └── main.jsx

├── index.html

├── package.json

└── vite.config.js

