/* Example documents shaped like docs/website-contract.md, used when config.js has no Supabase key (the demo). */
window.AUY_DEMO = {
  status: {
    open: false, server_running: true, players_online: 0, players_season: 31,
    ping_ms: 0, tick_ms: 18.4, season_day: 5, before_season: false, after_season: false,
    next_opening: "2026-11-10T19:00:00-04:00", next_opening_text: "7:00pm", closes_text: "3:00am",
    mod_version: "1.0.0", build: "3fa9c21b77d0", download: "", discord: "",
    subheaders: [
      "Catorce noches. Después, nada.",
      "Tu sombra se queda donde la dejaste.",
      "Las mesas duermen. Despertarlas se oye lejos.",
      "Aquí no hay perlas. Para escapar, el terreno.",
      "Lo que llevas puesto es lo que eres."
    ],
    updated: "2026-11-10T16:40:30-04:00"
  },

  board: { updated: "2026-11-09T22:15:03-04:00", slots: [
    { slot: 1, discovered: true, relic: "wanderer", name: "Errante", holder: { name: "papopei" }, last_equipped: "2026-11-09T22:15:03-04:00",
      custody: [
        { action: "found", name: "papopeya", day: 3, time: "9:40pm" },
        { action: "took", name: "papopei", from_name: "papopeya", day: 5, time: "10:02pm" } ] },
    { slot: 2, discovered: false },
    { slot: 3, discovered: true, relic: "devils_compass", name: "Brújula del diablo", holder: { name: "Kalimba" }, last_equipped: "2026-11-09T23:51:00-04:00",
      custody: [ { action: "found", name: "Kalimba", day: 4, time: "9:12pm" } ] },
    { slot: 4, discovered: false },
    { slot: 5, discovered: true, relic: "dark_skull", name: "Calavera oscura", holder: { name: "Yoryi" }, last_equipped: "2026-11-09T21:03:00-04:00",
      custody: [
        { action: "found", name: "Mostro", day: 4, time: "9:20pm" },
        { action: "took", name: "Yoryi", from_name: "Mostro", day: 4, time: "11:48pm" },
        { action: "took", name: "papopinga", from_name: "Yoryi", day: 5, time: "1:15am" },
        { action: "recovered", name: "Yoryi", from_name: "papopinga", day: 5, time: "2:31am" } ] },
    { slot: 6, discovered: false },
    { slot: 7, discovered: false },
    { slot: 8, discovered: true, relic: "berserker", name: "Berserker", holder: { name: "Mostro" }, last_equipped: "2026-11-09T22:40:00-04:00",
      custody: [ { action: "found", name: "Mostro", day: 4, time: "10:05pm" } ] },
    { slot: 9, discovered: true, relic: "blood_pact", name: "Pacto de sangre", holder: { name: "papopeya" }, last_equipped: "2026-11-08T21:02:00-04:00",
      custody: [ { action: "found", name: "papopeya", day: 3, time: "9:07pm" } ] },
    { slot: 10, discovered: false }
  ] },

  live_map: {
    border: { center_x: 0, center_z: 0, size: 1700, moving: false,
      next: { at: "2026-11-15T19:00:00-04:00", at_text: "7:00pm", day: 12, size: 1530, seconds: 7200 } },
    spawn: { x: -132, z: -238 },
    tables: [ { id: "island", x: -369, z: -179 }, { id: "beacon", x: 105, z: -95 } ],
    vault: { x: 425, z: 351 },
    airdrops: [
      { x: -40, z: -310, lands: "2026-11-06T21:00:00-04:00", landed: true },
      { x: 260, z: 120, lands: "2026-11-08T21:00:00-04:00", landed: true } ],
    unseals: [ { direction: "north_east", distance: "far", biome: "minecraft:dark_forest", day: 4, from: { x: -132, z: -238 } } ],
    traps: [ { direction: "south", distance: "", biome: "traverse:autumnal_woods", day: 5, from: { x: -132, z: -238 } } ],
    braziers: []
  },
  ladder: [
    { day: 1, size: 1700, falls: "" },
    { day: 12, size: 1530, falls: "El portal" },
    { day: 13, size: 1150, falls: "La bóveda" },
    { day: 13, size: 900, falls: "El spawn" },
    { day: 14, size: 720, falls: "La isla" },
    { day: 14, size: 550, falls: "El faro" },
    { day: 14, size: 100, falls: "Todo lo demás" } ],
  nights: {
    1: [["7:00pm", "Se abre el mundo"], ["9:00pm", "Cargamento cerca del spawn"]],
    2: [["7:00pm", "5 estanterías por mesa"]],
    3: [["9:00pm", "Cargamento"]],
    4: [["9:00pm", "La bóveda se llena"]],
    5: [],
    6: [["7:00pm", "Se abre el Nether"], ["7:00pm", "15 estanterías por mesa"]],
    7: [],
    8: [["9:00pm", "La bóveda se llena"]],
    9: [["7:00pm", "El Nether se mueve"]],
    10: [["10:00pm", "Cargamento"]],
    11: [["7:00pm", "Se publica el centro del colapso"]],
    12: [["7:00pm", "El borde avanza a 1530"], ["7:00pm", "Se cierra el Nether"], ["10:00pm", "La bóveda se llena por última vez"]],
    13: [["8:00pm", "El borde avanza a 1150"], ["11:00pm", "El borde avanza a 900"]],
    14: [["8:00pm", "El borde avanza a 720"], ["10:00pm", "La última noche"]]
  },

  factions: { factions: [
    { name: "CHAKAS", colour: "dark_red", founder: "papopeya", members: ["papopeya", "papopei", "papopinga"] },
    { name: "MANGO", colour: "gold", founder: "Kalimba", members: ["Kalimba", "Nena"] },
    { name: "BRUMA", colour: "dark_aqua", founder: "Yoryi", members: ["Yoryi", "Toto", "Mostro", "Lula"] } ] },
  colours: { green: "#55FF55", dark_green: "#00AA00", aqua: "#55FFFF", dark_aqua: "#00AAAA", blue: "#5555FF",
    light_purple: "#FF55FF", dark_purple: "#AA00AA", yellow: "#FFFF55", gold: "#FFAA00", red: "#FF5555", dark_red: "#AA0000" },

  mechanics: { categories: [
    { name: "Básico", entries: [
      { headline: "La noche manda", text: "El mundo abre cada noche a las 7:00pm y cierra a las 3:00am, durante 14 noches.\nA las 2:45am, 2:55am y 2:59am suenan los avisos. Al cerrar, tu sombra se queda donde estés." },
      { headline: "Lo que no existe", text: "No hay perlas de ender, cofres de ender, tótems ni Reparación.\nNo hay yunques: la forja de cada mesa hace su trabajo. Los aldeanos no comercian; los comerciantes errantes sí, y poco." },
      { headline: "El colapso", text: "El borde del mundo se cierra por pasos con los días.\nEl día 11 se publica hacia dónde se derrumba. Si entras fuera del borde, apareces justo dentro, sin perder nada." },
      { headline: "Una sola puerta", text: "El Nether se abre el día 6 en el portal que se anuncia, dentro de una ventana amurallada.\nEl día 9 se mueve. El día 12 se cierra para siempre: quien esté dentro sale, sin perder nada." } ] },
    { name: "Muerte y sombras", entries: [
      { headline: "Tu sombra", text: "Al desconectarte dejas tu sombra donde estás, con todo lo que llevas.\nSolo un jugador puede herirla. Si la matan, mueres tú: tus cosas quedan en un cofre y tus niveles van para quien la mató." },
      { headline: "Sangre por sangre", text: "Si te mata un jugador pierdes todos tus niveles, y caen para él.\nCualquier otra muerte te deja la experiencia." },
      { headline: "Cofres de muerte", text: "Lo que llevabas queda en un cofre donde caíste, abierto para cualquiera.\nSolo tú recibes las coordenadas." },
      { headline: "Trofeos", text: "Quien muere a manos de otro deja una calavera, anónima.\nClic derecho para llevártela. Es el único lugar de donde salen." } ] },
    { name: "La última noche", entries: [
      { headline: "Muerto se queda", text: "El día 14 a las 10:00pm el borde cae a 550 de golpe y empieza el final: nadie reaparece.\nQuien muere, también su sombra, queda fuera y mira como espectador." },
      { headline: "Llega a tiempo", text: "Si a las 10:00pm no estás conectado, tienes hasta las 10:15pm para entrar con vida.\nDespués estás fuera, y desconectarte te elimina." },
      { headline: "El último en pie", text: "El borde se cierra a 100 hacia las 10:46pm y casi a nada hacia las 11:01pm.\nGana quien quede vivo. Si los últimos caen en el mismo instante, ganan juntos." } ] },
    { name: "Encantar", entries: [
      { headline: "Tres mesas", text: "En el mundo hay tres mesas de encantamiento. No se fabrican, no se rompen, no se mueven." },
      { headline: "Cuarzo-lapislázuli", text: "Las mesas solo aceptan cuarzo-lapislázuli: un cuarzo del Nether y un lapislázuli. Tres por encantamiento." },
      { headline: "Las mesas duermen", text: "Una mesa se despierta antes de usarla, y despertarla se oye y se ve de lejos.\nMientras encantas quedas ciego. Un golpe lo cancela y te devuelve todo." } ] },
    { name: "Objetos", entries: [
      { headline: "Reliquias", text: "Solo funcionan en la mano secundaria: quien lleva una renuncia a su escudo.\nCada una se nota a la vista. Sus dueños quedan escritos en el tablero." },
      { headline: "Malditos", text: "Nombre rojo, irrompibles, imposibles de encantar o forjar. Cada hallazgo se anuncia." },
      { headline: "El cristal", text: "Un Cristal de experiencia guarda puntos. Si lo dejas en cualquier contenedor, se rompe y los suelta." } ] },
    { name: "Eventos", entries: [
      { headline: "Cargamentos", text: "Caen del cielo en coordenadas anunciadas, dejan un cráter y llegan con monstruos alrededor." },
      { headline: "La bóveda", text: "Se llena los días 4, 8 y 12. Se anuncia diez minutos antes, con coordenadas." } ] }
  ] },

  enchantments: { enchantments: [
    { id: "minecraft:sharpness", name: "Filo", description: "Más daño cuerpo a cuerpo contra todo.", items: ["sword", "axe"],
      levels: [{ level: 1, source: "table" }, { level: 2, source: "table" }, { level: 3, source: "table" }, { level: 4, source: "found" }, { level: 5, source: "ceiling" }] },
    { id: "minecraft:protection", name: "Protección", description: "Reduce el daño de casi todo lo que te golpea.", items: ["helmet", "chestplate", "leggings", "boots"],
      levels: [{ level: 1, source: "table" }, { level: 2, source: "table" }, { level: 3, source: "table" }, { level: 4, source: "ceiling" }] },
    { id: "minecraft:efficiency", name: "Eficiencia", description: "Picas, cavas y talas más rápido.", items: ["pickaxe", "shovel", "axe"],
      levels: [{ level: 1, source: "table" }, { level: 2, source: "table" }, { level: 3, source: "table" }, { level: 4, source: "found" }, { level: 5, source: "ceiling" }] },
    { id: "minecraft:power", name: "Poder", description: "Tus flechas hacen más daño.", items: ["bow"],
      levels: [{ level: 1, source: "table" }, { level: 2, source: "table" }, { level: 3, source: "table" }, { level: 4, source: "table" }, { level: 5, source: "ceiling" }] },
    { id: "auyamaland:hearty", name: "Corpulencia", description: "2 corazones más de vida por nivel.", items: ["chestplate"],
      levels: [{ level: 1, source: "ceiling" }, { level: 2, source: "ceiling" }] },
    { id: "auyamaland:grace", name: "Gracia", description: "Tras recibir un golpe, quedas a salvo 0,25 segundos más de lo normal antes del siguiente.", items: ["leggings"],
      levels: [{ level: 1, source: "ceiling" }] },
    { id: "auyamaland:outburst", name: "Estallido", description: "Recibe 3 golpes en 3 segundos y empujas lejos a todos a 4 bloques de ti. Vuelve a estar listo 10 segundos después.", items: ["chestplate"],
      levels: [{ level: 1, source: "ceiling" }] },
    { id: "auyamaland:ice_aspect", name: "Aspecto gélido", description: "Tus golpes ralentizan al objetivo durante 3 segundos.", items: ["sword", "axe"],
      levels: [{ level: 1, source: "table" }, { level: 2, source: "found" }] },
    { id: "auyamaland:shotgun", name: "Escopeta", description: "30% más de daño por nivel a 6 bloques o menos del objetivo.", items: ["crossbow"],
      levels: [{ level: 1, source: "found" }, { level: 2, source: "found" }] },
    { id: "auyamaland:sugar_rush", name: "Subidón de azúcar", description: "Cada muerte que causas te da velocidad y salto durante 3 segundos.", items: ["sword", "axe"],
      levels: [{ level: 1, source: "table" }] },
    { id: "auyamaland:veinmining", name: "Minería de vetas", description: "Al picar un mineral, cae la veta entera, hasta 16 bloques. No sirve con lapislázuli ni cuarzo.", items: ["pickaxe"],
      levels: [{ level: 1, source: "found" }] },
    { id: "auyamaland:smelting", name: "Fundición", description: "Lo que rompes cae como si hubiera pasado por un horno, con su experiencia.", items: ["pickaxe", "shovel", "axe"],
      levels: [{ level: 1, source: "table" }] }
  ] },
  sourceNames: { table: "Mesa", found: "Encontrado", ceiling: "Libro de techo", commons: "Único" },

  player: {
    name: "papopeya", online: false, season_day: 5,
    last_connection: { day: 5, time: "2:58am" },
    shadow: { state: "standing", since: "2026-11-10T02:58:11-04:00" },
    inventory: { source: "shadow", selected: 0,
      main: [ { slot: 0, id: "minecraft:diamond_sword", count: 1, enchantments: [{ id: "minecraft:sharpness", level: 3 }], damage: 120, max_damage: 1561 },
              { slot: 1, id: "minecraft:bow", count: 1 }, { slot: 2, id: "minecraft:golden_apple", count: 3 },
              { slot: 3, id: "minecraft:torch", count: 41 }, { slot: 8, id: "auyamaland:activation_core", count: 2 },
              { slot: 12, id: "minecraft:bread", count: 9 }, { slot: 20, id: "auyamaland:xp_tome", count: 6 } ],
      armor: [ { slot: 3, id: "minecraft:iron_helmet", count: 1, damage: 4, max_damage: 165 }, { slot: 2, id: "minecraft:diamond_chestplate", count: 1 } ],
      offhand: { slot: 0, id: "auyamaland:blood_pact", count: 1 } },
    xp_level: 23,
    effects: [ { id: "minecraft:speed", amplifier: 0, seconds: 140 } ],
    blessing: { nights_left: 2 },
    last_relic: { id: "blood_pact", name: "Pacto de sangre" },
    faction: { name: "CHAKAS", colour: "dark_red", members: [ { name: "papopeya", online: false, founder: true }, { name: "papopei", online: false }, { name: "papopinga", online: false } ] }
  },

  feed: [
    { id: 'p1', author: 'papopei', anonymous: false, body: 'Encontramos el cargamento antes que nadie. Bueno, casi.', images: [], created_at: '2026-11-10T02:31:00Z', edited_at: null, likes: 14, comments: 2, mine: false, liked: false },
    { id: 'p2', author: null, anonymous: true, body: 'Alguien dejó su sombra en medio del río. Ya no está.', images: [], created_at: '2026-11-10T06:59:00Z', edited_at: null, likes: 31, comments: 1, mine: false, liked: true },
    { id: 'p3', author: 'Kalimba', anonymous: false, body: 'La mesa del faro despertó tres veces seguidas. Pura carnada.', images: [], created_at: '2026-11-09T03:02:00Z', edited_at: null, likes: 8, comments: 0, mine: false, liked: false }
  ],
  feed_comments: {
    p1: [ { id: 'c1', post_id: 'p1', author: 'Kalimba', anonymous: false, body: 'Casi.', created_at: '2026-11-10T02:40:00Z', mine: false },
          { id: 'c2', post_id: 'p1', author: 'Yoryi', anonymous: false, body: 'Los vimos desde el cerro.', created_at: '2026-11-10T02:52:00Z', mine: false } ],
    p2: [ { id: 'c3', post_id: 'p2', author: null, anonymous: true, body: 'Fui yo.', created_at: '2026-11-10T07:10:00Z', mine: false } ]
  },
  settings: { feed_frozen: false, vote_open: false, survey_open: false },
  profile: { name: 'papopeya', created_at: '2026-11-06T23:14:03Z', skin_model: 'classic', skin_present: false, skin_updated_at: null },
  biomes: { "minecraft:dark_forest": "Bosque oscuro", "traverse:autumnal_woods": "Bosque otoñal" },
  dirs: { north: "norte", north_east: "noreste", east: "este", south_east: "sureste", south: "sur", south_west: "suroeste", west: "oeste", north_west: "noroeste" }
};
