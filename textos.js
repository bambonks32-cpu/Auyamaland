/* The site's own texts: everything players read that the server doesn't send. Edit freely, keep the quotes.
   Item names: the site uses lang/minecraft.json and lang/auyamaland.json when they exist (LEEME.md says where to
   get them); the names below are only the fallback. */
window.TXT = {
  /* what each relic does: plain, no numbers. Shown on discovered relics only. */
  reliquias: {
    wanderer: 'Se carga mientras te mueves, y la carga es velocidad. Llena, se gasta de una vez: en un golpe mucho más fuerte, o en aguantar un golpe sin que te empujen. También: saltas más alto, saltas otra vez en el aire y las caídas no te hacen daño.',
    stalker: 'Todo lo que haces queda en silencio, para los demás y para ti: pasos, golpes, bloques, comer, recibir daño. Te da velocidad y oscurece los bordes de tu vista.',
    devils_compass: 'Cada pocos segundos fija dónde está el jugador más cercano, y la aguja apunta a ese lugar hasta la siguiente fijación. Nunca dice la distancia. Mientras rastrea, brillas para todos.',
    disabler: 'Tus golpes apagan la reliquia y los objetos malditos de quien golpeas, durante mucho más tiempo del que tarda en recargarse.',
    dark_skull: 'Fuerza, mientras quien lleva la Calavera clara esté cerca.',
    light_skull: 'Corazones extra que se rellenan solos y menos daño recibido, mientras quien lleva la Calavera oscura esté cerca.',
    second_life: 'Un golpe que te mataría te cura en su lugar y te deja resistente un momento. Se recarga cuando recuperas toda tu vida.',
    berserker: 'Un rato de fuerza enorme. Después, un rato de lentitud y debilidad.',
    blood_pact: 'Te ata a otro jugador. Mientras estén cerca, parte del daño que recibe lo pagas tú con hambre, nunca con vida, y tú recibes menos daño.'
  },

  /* the season bar and the clock: what each night brings: [hour, what, one line on what it is] */
  noches: {
    1: [['9:00pm', 'Cargamento cerca del spawn', 'Cae un cofre. Sus coordenadas se anuncian 30 minutos antes.']],
    2: [['7:00pm', '5 estanterías por mesa', 'Cada mesa recupera 5 estanterías alrededor.']],
    3: [['9:00pm', 'Cargamento', 'Cae un cofre con monstruos alrededor. Sus coordenadas se anuncian 30 minutos antes.']],
    4: [['9:00pm', 'La bóveda se llena', 'La bóveda se reconstruye y se llena. Se anuncia 10 minutos antes, con coordenadas.']],
    5: [],
    6: [['7:00pm', 'Se abre el Nether', 'El portal anunciado se enciende. Lleva a una zona amurallada.'], ['7:00pm', '15 estanterías por mesa', 'Cada mesa recupera 15 estanterías alrededor.']],
    7: [],
    8: [['9:00pm', 'La bóveda se llena', 'La bóveda se reconstruye y se llena. Se anuncia 10 minutos antes, con coordenadas.']],
    9: [['7:00pm', 'El Nether se mueve', 'La zona amurallada del Nether cambia de lugar. Quien esté dentro pasa a la nueva.']],
    10: [['10:00pm', 'Cargamento', 'Cae un cofre con monstruos alrededor. Sus coordenadas se anuncian una hora antes.']],
    11: [['7:00pm', 'Se publica el colapso', 'Se anuncia hacia dónde se va a cerrar el mundo.']],
    12: [['7:00pm', 'El borde avanza a 1530', 'Se cierra durante dos horas hacia el centro del colapso. El portal queda fuera.'], ['7:00pm', 'Se cierra el Nether', 'Para siempre. Quien esté dentro vuelve al mundo.'], ['10:00pm', 'La bóveda se llena por última vez', 'Último llenado de la bóveda.']],
    13: [['8:00pm', 'El borde avanza a 1150', 'Durante dos horas. La bóveda queda fuera.'], ['11:00pm', 'El borde avanza a 900', 'Durante dos horas. El spawn queda fuera y pasa al centro del colapso.']],
    14: [['8:00pm', 'El borde avanza a 720', 'Durante dos horas. La isla queda fuera.'], ['10:00pm', 'La última noche', 'El borde cae a 550 de golpe y ya nadie reaparece. Gana el último en pie.']]
  },
  final: ['8:00pm: El borde avanza a 720', '10:00pm: Cae a 550 de golpe y nadie reaparece', '10:15pm: Último momento para entrar con vida', '10:46pm: El borde llega a 100', 'Gana el último en pie. Quien muere, también su sombra, mira como espectador.'],

  mesas: { island: 'La mesa de la isla', beacon: 'La mesa del faro' },
  direcciones: { north: 'norte', north_east: 'noreste', east: 'este', south_east: 'sureste', south: 'sur', south_west: 'suroeste', west: 'oeste', north_west: 'noroeste' },
  biomas: {
    'minecraft:plains': 'Llanura', 'minecraft:sunflower_plains': 'Llanura de girasoles', 'minecraft:forest': 'Bosque', 'minecraft:flower_forest': 'Bosque florido',
    'minecraft:birch_forest': 'Bosque de abedules', 'minecraft:dark_forest': 'Bosque oscuro', 'minecraft:taiga': 'Taiga', 'minecraft:snowy_taiga': 'Taiga nevada',
    'minecraft:giant_tree_taiga': 'Taiga de árboles gigantes', 'minecraft:swamp': 'Pantano', 'minecraft:jungle': 'Jungla', 'minecraft:desert': 'Desierto',
    'minecraft:savanna': 'Sabana', 'minecraft:badlands': 'Badlands', 'minecraft:mountains': 'Montañas', 'minecraft:snowy_tundra': 'Tundra nevada',
    'minecraft:river': 'Río', 'minecraft:beach': 'Playa', 'minecraft:wooded_hills': 'Colinas boscosas', 'minecraft:mushroom_fields': 'Campo de champiñones',
    'traverse:autumnal_woods': 'Bosque otoñal', 'traverse:woodlands': 'Arboleda', 'traverse:mini_jungle': 'Pequeña jungla', 'traverse:rolling_hills': 'Colinas onduladas',
    'traverse:coniferous_forest': 'Bosque de coníferas', 'traverse:lush_swamp': 'Pantano frondoso', 'traverse:desert_shrubland': 'Matorral desértico'
  },
  efectos: {
    speed: 'Velocidad', slowness: 'Lentitud', haste: 'Prisa minera', mining_fatigue: 'Fatiga minera', strength: 'Fuerza', instant_health: 'Curación instantánea',
    instant_damage: 'Daño instantáneo', jump_boost: 'Impulso', nausea: 'Náuseas', regeneration: 'Regeneración', resistance: 'Resistencia',
    fire_resistance: 'Resistencia al fuego', water_breathing: 'Respiración acuática', invisibility: 'Invisibilidad', blindness: 'Ceguera',
    night_vision: 'Visión nocturna', hunger: 'Hambre', weakness: 'Debilidad', poison: 'Veneno', wither: 'Descomposición', health_boost: 'Vida extra',
    absorption: 'Absorción', saturation: 'Saturación', glowing: 'Luminiscencia', levitation: 'Levitación', luck: 'Suerte', unluck: 'Mala suerte',
    slow_falling: 'Caída lenta', conduit_power: 'Poder del conducto', dolphins_grace: 'Gracia de delfín', bad_omen: 'Mal presagio', hero_of_the_village: 'Héroe de la aldea'
  },
  /* fallback item names; lang files win */
  objetos: {
    'minecraft:bow': 'Arco', 'minecraft:crossbow': 'Ballesta', 'minecraft:trident': 'Tridente', 'minecraft:shield': 'Escudo', 'minecraft:arrow': 'Flecha',
    'minecraft:bread': 'Pan', 'minecraft:apple': 'Manzana', 'minecraft:golden_apple': 'Manzana dorada', 'minecraft:enchanted_golden_apple': 'Manzana dorada encantada',
    'minecraft:golden_carrot': 'Zanahoria dorada', 'minecraft:cooked_beef': 'Filete', 'minecraft:cooked_porkchop': 'Chuleta de cerdo cocinada', 'minecraft:cooked_chicken': 'Pollo asado',
    'minecraft:baked_potato': 'Patata asada', 'minecraft:torch': 'Antorcha', 'minecraft:diamond': 'Diamante', 'minecraft:iron_ingot': 'Lingote de hierro',
    'minecraft:gold_ingot': 'Lingote de oro', 'minecraft:netherite_ingot': 'Lingote de netherita', 'minecraft:emerald': 'Esmeralda', 'minecraft:lapis_lazuli': 'Lapislázuli',
    'minecraft:quartz': 'Cuarzo del Nether', 'minecraft:coal': 'Carbón', 'minecraft:charcoal': 'Carbón vegetal', 'minecraft:stick': 'Palo', 'minecraft:string': 'Cuerda',
    'minecraft:book': 'Libro', 'minecraft:enchanted_book': 'Libro encantado', 'minecraft:bucket': 'Cubo', 'minecraft:water_bucket': 'Cubo de agua',
    'minecraft:lava_bucket': 'Cubo de lava', 'minecraft:milk_bucket': 'Cubo de leche', 'minecraft:flint_and_steel': 'Mechero', 'minecraft:compass': 'Brújula',
    'minecraft:clock': 'Reloj', 'minecraft:map': 'Mapa', 'minecraft:filled_map': 'Mapa', 'minecraft:cobblestone': 'Roca', 'minecraft:crafting_table': 'Mesa de crafteo',
    'minecraft:furnace': 'Horno', 'minecraft:chest': 'Cofre', 'minecraft:skeleton_skull': 'Calavera de esqueleto', 'minecraft:potion': 'Poción',
    'minecraft:splash_potion': 'Poción arrojadiza', 'minecraft:obsidian': 'Obsidiana', 'minecraft:tnt': 'Dinamita', 'minecraft:ender_eye': 'Ojo de ender',
    'auyamaland:activation_core': 'Núcleo fundido', 'auyamaland:quartz_lapis': 'Cuarzo-lapislázuli', 'auyamaland:xp_tome': 'Tomo de experiencia',
    'auyamaland:xp_crystal': 'Cristal de experiencia', 'auyamaland:wanderer': 'Errante', 'auyamaland:stalker': 'Acechador', 'auyamaland:devils_compass': 'Brújula del diablo',
    'auyamaland:disabler': 'Silenciador', 'auyamaland:dark_skull': 'Calavera oscura', 'auyamaland:light_skull': 'Calavera clara', 'auyamaland:second_life': 'Segunda vida',
    'auyamaland:berserker': 'Berserker', 'auyamaland:blood_pact': 'Pacto de sangre', 'auyamaland:breach_sword': 'Espada quebrantadora',
    'auyamaland:consecutive_sword': 'Espada encadenada', 'auyamaland:raiders_axe': 'Hacha del saqueador', 'auyamaland:phase_pickaxe': 'Pico de fase',
    'auyamaland:nightstalker_helmet': 'Yelmo del acechador nocturno', 'auyamaland:close_bow': 'Arco de cerca', 'auyamaland:heavy_boots': 'Botas pesadas',
    'auyamaland:mask': 'Rostro robado', 'musketmod:musket': 'Mosquete', 'musketmod:cartridge': 'Cartucho'
  },
  materiales: { wooden: 'de madera', stone: 'de piedra', iron: 'de hierro', golden: 'de oro', diamond: 'de diamante', netherite: 'de netherita', leather: 'de cuero', chainmail: 'de malla' },
  piezas: { sword: 'Espada', pickaxe: 'Pico', axe: 'Hacha', shovel: 'Pala', hoe: 'Azada', helmet: 'Casco', chestplate: 'Peto', leggings: 'Grebas', boots: 'Botas' }
};
