/* The site's own texts: everything players read that the server doesn't send. Edit freely, keep the quotes.
   Item names: the site uses lang/minecraft.json and lang/auyamaland.json when they exist (LEEME.md says where to
   get them); the names below are only the fallback. */
window.TXT = {
  /* what each relic does: plain, no numbers. Shown on discovered relics only. */
  reliquias: {
    wanderer: 'Se carga mientras viajas, a pie o montado, y la carga es velocidad. Al chocar con alguien la gastas entera: tu primer golpe pega mucho más fuerte, o, si te golpean primero, aguantas sin que te empujen. Mientras la llevas saltas más alto, das un segundo salto en el aire y las caídas no te hacen daño.',
    stalker: 'Todo lo que haces queda en silencio para los demás, y también para ti: pasos, golpes, bloques, comer, recibir daño. Te mueves más rápido, con los bordes de la vista oscurecidos.',
    devils_compass: 'Cada pocos segundos fija dónde está el jugador más cercano, y la aguja apunta a ese lugar hasta la siguiente fijación. Nunca dice la distancia. Mientras rastrea, brillas para todos.',
    disabler: 'Un golpe que acierta apaga la reliquia de tu víctima y sus objetos malditos durante mucho más tiempo del que tarda en recargarse.',
    dark_skull: 'Hermana de la Calavera clara. Mientras sus dos portadores estén cerca el uno del otro, la oscura da fuerza.',
    light_skull: 'Hermana de la Calavera oscura. Mientras sus dos portadores estén cerca el uno del otro, la clara da corazones extra que se rellenan solos y resistencia al daño.',
    second_life: 'Un golpe que te mataría te cura en su lugar y te deja resistente un momento para darle la vuelta a la pelea. Se vuelve a cargar cuando recuperas toda tu vida.',
    berserker: 'Clic derecho sin nada que usar en la mano principal: un rato de fuerza enorme. Después llega el agotamiento, lento y débil, hasta que pasa.',
    blood_pact: 'Clic derecho a un jugador para atarlo. Mientras estén cerca, le quitas parte de cada golpe que recibe y lo pagas con hambre, nunca con vida, y aguantas más daño. Agachado y clic derecho lo sueltas; golpearlo rompe el pacto.'
  },
  reliquias_todas: 'Solo funciona en la mano secundaria. Llevarla cuesta el escudo.',

  /* the season bar: what each night brings (hour, what) */
  noches: {
    1: [['7:00pm', 'Se abre el mundo'], ['9:00pm', 'Cargamento cerca del spawn']],
    2: [['7:00pm', '5 estanterías por mesa']],
    3: [['9:00pm', 'Cargamento']],
    4: [['9:00pm', 'La bóveda se llena']],
    5: [],
    6: [['7:00pm', 'Se abre el Nether'], ['7:00pm', '15 estanterías por mesa']],
    7: [],
    8: [['9:00pm', 'La bóveda se llena']],
    9: [['7:00pm', 'El Nether se mueve']],
    10: [['10:00pm', 'Cargamento']],
    11: [['7:00pm', 'Se publica el centro del colapso']],
    12: [['7:00pm', 'El borde avanza a 1530'], ['7:00pm', 'Se cierra el Nether'], ['10:00pm', 'La bóveda se llena por última vez']],
    13: [['8:00pm', 'El borde avanza a 1150'], ['11:00pm', 'El borde avanza a 900']],
    14: [['8:00pm', 'El borde avanza a 720'], ['10:00pm', 'La última noche']]
  },
  final: ['8:00pm: el borde avanza a 720', '10:00pm: cae a 550 de golpe y nadie reaparece', 'Quien muere, también su sombra, mira el final', '10:15pm: último momento para entrar con vida', 'Gana el último en pie'],

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
