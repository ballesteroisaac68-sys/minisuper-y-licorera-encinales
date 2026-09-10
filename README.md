# Minisuper y Licorera Encinales

Landing page estatica para un minisuper ficticio de San Jose, Costa Rica. Esta construida solo con HTML, CSS y JavaScript vanilla; no utiliza dependencias, APIs ni imagenes remotas.

## Estructura

- `index.html`: estructura y contenido de la pagina.
- `css/styles.css`: identidad visual, responsive y animaciones.
- `js/script.js`: productos, filtros, busqueda, carrito y menu movil.
- `assets/images/`: logo e ilustraciones SVG locales reemplazables.

## Ejecutar localmente

Desde la raiz del proyecto ejecuta `python -m http.server 8000` y visita `http://localhost:8000`.

## Personalizacion

- Reemplaza los SVG dentro de `assets/images/` manteniendo sus nombres para actualizar las imagenes.
- Edita el arreglo `products` de `js/script.js` para cambiar productos, descripciones y precios.
- Modifica las variables al inicio de `css/styles.css` para adaptar colores y estilo.

## Despliegue en Render

Crea un **Static Site**, conecta este directorio o repositorio y deja el directorio de publicacion como la raiz (`.`). No requiere comando de build ni variables de entorno.
