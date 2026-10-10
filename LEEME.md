# Auyamaland: la página

Todo lo de esta carpeta va tal cual a la raíz del repositorio de GitHub Pages. No hay que compilar nada.

## Para que lea los datos reales

1. Abre `config.js` y pega la llave **anon (public)** de Supabase en `supabase_anon_key`
   (Supabase > Project Settings > API). Nunca la service key.
2. Si quieres que la guía de instalación muestre la dirección del servidor, ponla en `server_address`.

Sin la llave, la página funciona con datos de ejemplo (`demo.js`) y lo dice abajo.

## Texturas (sin tocar código)

- `textures/item/...`: las tuyas, con las mismas rutas que el mod (`assets/auyamaland/textures/`).
  Cambias un PNG y la página lo usa.
- Objetos de Minecraft en el inventario de Tu sombra: abre `.minecraft/versions/1.16.5/1.16.5.jar` con 7-Zip y copia
  - `assets/minecraft/textures/item/` a `textures/minecraft/item/`
  - `assets/minecraft/textures/block/` a `textures/minecraft/block/`
  - `assets/minecraft/textures/entity/steve.png` y `alex.png` a `textures/minecraft/entity/` (la cara de quien no ha subido skin)

  Mientras falten, se ven los dibujos provisionales.

## Nombres de objetos en español

- `lang/auyamaland.json`: copia el `es_es.json` del mod (`src/main/resources/assets/auyamaland/lang/es_es.json`).
- `lang/minecraft.json`: el `es_es.json` de Minecraft. En 1.16.5 no está dentro del jar: abre
  `.minecraft/assets/indexes/1.16.json`, busca `minecraft/lang/es_es.json`, copia su `hash`, y el archivo es
  `.minecraft/assets/objects/<dos primeras letras del hash>/<hash>`. Cópialo como `lang/minecraft.json`.

Sin ellos, la página usa los nombres de respaldo de `textos.js`.

## Colores

Todos están en `theme.css`. Para elegirlos viendo la página: escribe la palabra **colores** en cualquier parte
de la página (fuera de un cuadro de texto) o abre la dirección con `?colores` al final. Mueve los colores, pulsa
**Copiar theme.css** y pega el resultado sobre `theme.css`.

## Textos

`textos.js`: lo que hace cada reliquia, lo que trae cada noche de la barra, nombres de biomas, efectos y objetos de
respaldo. Lo demás llega del servidor (estado, tablero, mapa, encantamientos, reglas).

## Archivos

| archivo | qué es |
|---|---|
| index.html | la página |
| app.js | lee Supabase según docs/website-contract.md: estado, tablero, mapa, encantamientos, reglas, cuenta, skin, Tu sombra, el muro |
| kit.js | las piezas: cielo, barra de la temporada, vitrina, libros, inventario |
| mcmap.js, mcui.js | el mapa y los tooltips |
| tune.js | el panel de colores |
| font.js, sprites.js | la fuente y los dibujos provisionales |
| demo.js | los datos de ejemplo |

Todavía no están en la página: las facciones desde la web, la votación del resumen y la encuesta.
