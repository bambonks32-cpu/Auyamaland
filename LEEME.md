# Auyamaland: la página

Todo lo de esta carpeta va a la raíz del repositorio de GitHub Pages, junto a `unirse.html`. No hay que compilar nada.

## Qué borrar del repositorio

Ya no se usan: `kit.js`, `mcui.js`, `arte.js`, `es_es.json` (ahora es `lang/auyamaland.json`), `item.rar`, `text`, `lang/main`, `textures/item/main`.

## Para que lea los datos reales

`config.js` ya lleva tu llave pública (anon). Si la página dice abajo "Datos de ejemplo", falta esa llave.

## Archivos

| archivo | qué es |
|---|---|
| index.html | la página |
| theme.css | todos los colores (los mismos de unirse.html) |
| style.css | el diseño |
| app.js | lee Supabase: estado, temporada, reliquias, mapa, encantamientos, reglas, cuenta, skin, tu sombra, el muro |
| ui.js | tooltips, texturas, objetos, caras, el cielo del inicio |
| textos.js | lo que hace cada reliquia, lo que trae cada noche, nombres de respaldo |
| mcmap.js | el mapa |
| tune.js | el panel de colores: escribe **colores** en la página |
| font.js | la fuente de Minecraft (títulos, reloj, números) |
| sprites.js | dibujos de respaldo para objetos sin textura |
| demo.js | datos de ejemplo cuando no hay llave |

## Texturas y nombres

- `textures/item/...`: las tuyas, con las rutas del mod. La brújula del diablo va en `textures/item/devils_compass/closed.png` y `open_00.png` (en el repositorio están sueltas en `textures/item/`; la página las encuentra igual).
- `textures/minecraft/item/` y `block/`: las de Minecraft, ya están.
- `textures/minecraft/entity/steve.png` y `alex.png`: la cara de quien no ha subido skin. Faltan.
- `textures/map/world.png` y `world.json`: el mapa del mundo, cuando el servidor lo genere (`/auyamaland site map`).
- `lang/minecraft.json` y `lang/auyamaland.json`: nombres de objetos en español.
