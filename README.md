# Duety - Prototipo Interactivo y Presentación

Sitio web estático interactivo (HTML5, CSS3 y JavaScript ES6 puro sin dependencias externas ni compiladores).

## Estructura del Proyecto
- `index.html`: Estructura narrativa en 7 secciones:
  1. **Hero**: Título interactivo, cintas 3D y ticker de conceptos clave.
  2. **Problema y Audiencia**: Salir de la zona de confort, causas de la saturación mainstream y beneficios para oyentes y artistas emergentes.
  3. **Funciones de la Aplicación**: Los 6 pilares de Duety (Diagnóstico sin registro, Control de novedad 1-5, Mood, Filtro de emergentes, Algoritmo vectorial y Snippets).
  4. **Prototipo Funcional de Duety**: Aplicación interactiva completa con 3 vistas (Explorador sónico, Radar de distancia y Mi Biblioteca), filtros en tiempo real, reproductor de audio procedural con Web Audio API y barra persistente.
  5. **Algoritmo de Distancia Sónica**: Explicación matemática de vectores de audio (energía, valencia, bailabilidad) y órbitas concéntricas SVG.
  6. **Ruta y Objetivos del Proyecto**: Las 4 fases de desarrollo (Estudio de mercado, Algoritmo, Frontend UI/UX y Validación beta).
  7. **Cierre**: Call to action final.
- `styles.css`: Sistema de diseño dark minimalist, tipografía fluida con `clamp()`, grid responsivo, animaciones de audio wave y estilos de componentes del prototipo.
- `script.js`: Motor de la aplicación interactiva, síntesis de audio procedural (Web Audio API), cálculo de distancias vectoriales, renderizado de radar SVG y navegación por teclado.

## Subir a Vercel / GitHub Pages
1. Sube esta carpeta a tu repositorio en GitHub.
2. En Vercel: **Add New > Project**, importa el repositorio.
3. Framework Preset: **Other**. Deja vacíos Build Command y Output Directory.
4. Deploy.

Las fuentes (*Outfit* y *Space Grotesk*) se cargan desde Google Fonts.
