# Duety - Prototipo Interactivo y Presentación

Sitio web estático interactivo (HTML5, CSS3 y JavaScript ES6 puro sin dependencias externas ni compiladores).

## Estructura del Proyecto
- `index.html`: Estructura narrativa en 7 secciones:
  1. **Hero**: Título interactivo, cintas 3D y ticker de conceptos clave.
  2. **Problema y Audiencia**: Salir de la zona de confort, causas de la saturación mainstream y beneficios para oyentes y artistas emergentes.
  3. **Funciones de la Aplicación**: Los 6 pilares de Duety (Diagnóstico sin registro, Control de novedad 1-5, Mood, Filtro de emergentes, Algoritmo vectorial y Duelo 1 vs 1).
  4. **Prototipo Funcional de Duety**: Duelo musical básico estilo *Higher or Lower*. Te presenta 2 canciones enfrentadas con snippets de audio; al elegir una opción, el algoritmo te pasa la siguiente recomendación y calcula tu índice de ruptura de la zona de confort.
  5. **Algoritmo de Distancia Sónica**: Explicación matemática de vectores de audio (energía, valencia, bailabilidad) y órbitas concéntricas SVG.
  6. **Ruta y Objetivos del Proyecto**: Las 4 fases de desarrollo (Estudio de mercado, Algoritmo, Frontend UI/UX y Validación beta).
  7. **Cierre**: Call to action final.
- `styles.css`: Sistema de diseño dark minimalist, arena de duelo 1 vs 1 responsiva, tarjetas de canciones con gradientes y tipografía fluida.
- `script.js`: Motor del prototipo *Higher or Lower*, síntesis de snippets de audio procedural con Web Audio API, cálculo de distancias y navegación por teclado.

## Subir a Vercel / GitHub Pages
1. Sube esta carpeta a tu repositorio en GitHub.
2. En Vercel: **Add New > Project**, importa el repositorio.
3. Framework Preset: **Other**. Deja vacíos Build Command y Output Directory.
4. Deploy.

Las fuentes (*Outfit* y *Space Grotesk*) se cargan desde Google Fonts.
