import media from './giftRevealMedia.js'

// Presentation-only object identities, checked against the source edition names.
// Photo-folder numbers are not catalogue SKU numbers.
const definitions = [
  ['black-horse', ['Black Running Horse Showpiece with Single Red Embellishment', 'Black Running Horse'], 'Black running horse', 'A sculptural horse caught in forward movement, with a dark finish and red accents. Its energetic silhouette brings a sense of direction to the selection, giving the theme of purposeful movement a visible form.', 'black-horse'],
  ['white-horse', ['White Running Horse'], 'White running horse', 'A running horse in a light finish, chosen for the contrast between its poised form and its suggestion of movement. In this edition it represents taking the next step with intention.', 'white-horse'],
  ['fluorite-butterfly', ['Metal Stand with a Fluorite Butterfly Attached', 'Fluorite Butterfly'], 'Fluorite butterfly', 'A butterfly displayed on a slender stand. The open wings give this small sculptural piece its character; within the selection, the butterfly offers a symbol of perspective, change and room to grow.', 'fluorite-butterfly'],
  ['rose-quartz-composition', ['Rose Quartz Hamsa + Lotus + Love Ducks', 'Rose Quartz Hamsa + Ducks + Lotus', 'Rose Quartz Hamsa + Lotus + Ducks'], 'Rose quartz hamsa, lotus & ducks', 'A grouping of hamsa, lotus and duck forms in rose quartz. The pieces belong together as a composition, bringing the themes of companionship and care into a small, personal display.', 'rose-quartz-composition'],
  ['citrine-tortoise', ['Raw Citrine Cluster on Golden Tortoise Lamp Base', 'Citrine Tortoise', 'Citrine Tortoise Lamp'], 'Citrine tortoise', 'A citrine formation carried on a tortoise-shaped base. The contrast between the textured cluster and the measured posture of the tortoise gives this selection its symbol of patient, sustained progress.', 'citrine-tortoise'],
  ['chakra-massager', ['7 Chakra Stimulating Body Massager with Wooden Base', '7 Chakra Massager'], 'Seven-chakra massager', 'A handheld wooden form fitted with a row of coloured stone points. The rounded base and individual stone points give it a tactile character, offering a physical companion to the sculptural piece in the selection.', 'chakra-massager'],
  ['bismuth-heart', ['Heart-Shaped Bismuth Bowl'], 'Heart-shaped bismuth bowl', 'A small heart-shaped bowl with a textured bismuth interior. Its familiar outline and angular surface offer a contrast of softness and structure, a recurring theme in the editions that include it.', 'bismuth-heart'],
  ['amethyst-cup', ['Amethyst Cluster in Brass Cup', 'Amethyst Cluster Brass Cup'], 'Amethyst cluster in a brass cup', 'An amethyst cluster held in a brass cup. The textured purple formation and warm vessel make a composed pairing, chosen here as a visual reminder to give thought and attention a little space.', 'amethyst-cup'],
  ['citrine-cup', ['Citrine Cluster in Brass Cup'], 'Citrine cluster in a brass cup', 'A citrine cluster presented in a brass cup. The combination of a textured formation and a defined vessel gives the piece its character; the edition draws on that contrast as a symbol of considered growth.', 'citrine-cup'],
  ['jade-bismuth', ['Jade Hexagon + Bismuth Tray', 'Jade + Bismuth Tray'], 'Jade & bismuth tray', 'A jade and bismuth arrangement that places contrasting surfaces together. The structured form and irregular texture make this a composition about balance, with space for both order and a less predictable point of view.', 'jade-bismuth'],
  ['crystal-tree', ['Seven-Colour Crystal Tree'], 'Seven-colour crystal tree', 'A decorative tree with a branching arrangement of coloured crystals. Its many small elements form one connected silhouette, offering this edition a simple image of variety, relationship and growth over time.', 'crystal-tree'],
  ['nazar-wall', ['Nazar Mineral Wall Hanging'], 'Nazar mineral wall hanging', 'A wall piece centred on the familiar nazar motif. The circular composition brings a distinct visual focus to this selection; this edition draws on the motif as an expression of care for a personal space.', 'nazar-wall'],
  ['element-wall', ['Element-Balancing Wall Hanging'], 'Element-balancing wall hanging', 'A wall hanging selected around the theme of balance. In this edition it serves as a visible reminder of the intention, paired with a tactile object that brings attention back to the present.', null],
  ['sage-palo', ['Sage + Palo Santo Ritual'], 'Sage & palo santo', 'Sage and palo santo form the aromatic part of this selection. They accompany the keepsake as a traditional ritual pairing. Follow the instructions supplied with the items for their intended use.', null],
  ['copper-kalash', ['Copper Kalash'], 'Copper kalash', 'A copper kalash, the traditional vessel included in this edition. Its presence gives the selection a connection to ritual and the home, complementing the sculptural keepsake without prescribing a particular ceremony.', null],
  ['selenite-horses', ['Selenite + Rose Quartz Horses'], 'Selenite & rose quartz horses', 'Horse forms in selenite and rose quartz bring movement into this selection. Their pairing carries the edition’s theme of remaining connected while making space for the different ways two people move through life.', 'horse-study'],
]

const bottles = [
  ['howlite', ['Metal-Base Glass Water Bottle with Howlite Crystal Tower', 'Howlite Bottle'], 'Howlite'],
  ['lapis', ['Lapis Bottle'], 'Lapis'], ['tiger-eye', ['Tiger Eye Bottle'], 'Tiger eye'],
  ['clear-quartz', ['Clear Quartz Bottle'], 'Clear quartz'], ['carnelian', ['Carnelian Bottle'], 'Carnelian'],
  ['aventurine', ['Green Aventurine Bottle'], 'Green aventurine'], ['selenite', ['Selenite Bottle'], 'Selenite'],
  ['amethyst', ['Amethyst Bottle'], 'Amethyst'], ['citrine', ['Citrine Bottle'], 'Citrine'],
]
for (const [id, aliases, stone] of bottles) definitions.push([
  `${id}-bottle`, aliases, `${stone} bottle`,
  `The ${stone.toLowerCase()} bottle is the everyday companion in this selection. It connects the edition’s intention with an ordinary recurring routine. Its named crystal connects the edition’s theme with an object that has a continuing place in the day.`, 'bottle-study',
])

const fragrances = [
  ['moonstone', ['10 ml Scented Itr Oil with Raw Moonstone Crystal Chunks', 'Moonstone Itr'], 'Moonstone'],
  ['lapis', ['10 ml Scented Itr Oil with Raw Lapis Lazuli Crystal Chunks', 'Lapis Itr'], 'Lapis'],
  ['fluorite', ['Fluorite Itr', 'Fluorite Chunk Itr'], 'Fluorite'], ['garnet', ['Garnet Itr'], 'Garnet'],
  ['amethyst', ['Amethyst Chunk Itr', 'Amethyst Itr'], 'Amethyst'], ['carnelian', ['Carnelian Itr'], 'Carnelian'],
]
for (const [id, aliases, stone] of fragrances) definitions.push([
  `${id}-itr`, aliases, `${stone} itr`,
  `${stone} itr is the personal fragrance in this edition. It brings a sensory element to the pairing, giving the sculptural keepsake an everyday companion. Refer to the supplied product label for application and care.`, 'itr-study',
])

export const GIFT_REVEAL_ITEMS = Object.fromEntries(definitions.map(([id, sourceNames, name, description, imageId]) => [id, {
  id, sourceNames, name, description, care: null,
  media: imageId ? { ...media[imageId], alt: media[imageId].type === 'illustration' ? `Illustration for ${name.toLowerCase()}; not an exact product photograph` : name,
    caption: media[imageId].type === 'illustration' ? 'Illustration · form and details may vary' : 'An object from the edition' } : null,
  provenance: { names: 'combinations.json / Mercury edition source', photography: imageId || null },
}]))

export const REVEAL_ITEM_ALIASES = Object.fromEntries(definitions.flatMap(([id, names]) => names.map(name => [name, id])))
