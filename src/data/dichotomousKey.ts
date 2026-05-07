import type { KeyNode } from '@/types/dichotomousKey';

export const ROOT_NODE_ID = 'q-is-blooming';

// Dichotomous key for 20 common Illinois wildflowers.
// Two parallel branches: flowering (flower color → structure) and vegetative
// (leaf arrangement → stem → habitat → texture) for plants not currently in bloom.
export const keyNodes: KeyNode[] = [
  // ─── ROOT ────────────────────────────────────────────────────────────────
  {
    id: 'q-is-blooming',
    question: 'Is the plant currently in bloom?',
    a: {
      label: 'Yes — flowers are visible right now',
      next: 'q-bloom-season',
    },
    b: {
      label: 'No — not blooming; I will use leaves, stem, and habitat',
      next: 'q-veg-leaf-arrangement',
    },
  },

  // ─── FLOWERING ROOT ──────────────────────────────────────────────────────
  {
    id: 'q-bloom-season',
    question: 'When is the plant blooming?',
    a: {
      label: 'Spring — flowers present primarily April through June, done by July',
      next: 'q-spring-color',
    },
    b: {
      label: 'Summer or fall — flowers appear in July or later',
      next: 'q-summer-color',
    },
  },

  // ─── VEGETATIVE BRANCH ───────────────────────────────────────────────────
  {
    id: 'q-veg-leaf-arrangement',
    question: 'How are the leaves arranged on the stem?',
    a: {
      label: 'Paired opposite each other — two leaves at each node',
      next: 'q-veg-opposite',
    },
    b: {
      label: 'Alternate, basal, or in a rosette — not paired',
      next: 'q-veg-alternate-or-basal',
    },
  },

  // Opposite-leaved plants: Swamp Milkweed, Wild Bergamot, Wild Geranium
  {
    id: 'q-veg-opposite',
    question: 'Does the stem feel square when you roll it between your fingers, and do the leaves smell slightly minty or herbal?',
    a: {
      label: 'Yes — square stem, aromatic leaves',
      next: ['wild-bergamot'],
    },
    b: {
      label: 'No — stem is round',
      next: 'q-veg-opposite-round',
    },
  },
  {
    id: 'q-veg-opposite-round',
    question: 'What do the leaves look like?',
    a: {
      label: 'Narrow lance-shaped leaves; plant growing in wet or moist ground (marsh, streambank)',
      next: ['swamp-milkweed'],
    },
    b: {
      label: 'Broad leaves that are palmately lobed with pointed toothed segments',
      next: ['wild-geranium'],
    },
  },

  // Alternate / basal split
  {
    id: 'q-veg-alternate-or-basal',
    question: 'Where are most of the leaves?',
    a: {
      label: 'Clustered at the base or in a ground-level rosette — stem is nearly leafless',
      next: 'q-veg-basal',
    },
    b: {
      label: 'Spaced alternately up the stem',
      next: 'q-veg-alternate',
    },
  },

  // Basal plants: Blue Flag Iris, Bloodroot, Prairie Dock, Rattlesnake Master, Shooting Star, Mayapple
  {
    id: 'q-veg-basal',
    question: 'What is the overall shape of the basal leaves?',
    a: {
      label: 'Long and narrow — sword-like, strap-like, or yucca-like',
      next: 'q-veg-basal-sword',
    },
    b: {
      label: 'Broad, rounded, lobed, or umbrella-shaped',
      next: 'q-veg-basal-broad',
    },
  },
  {
    id: 'q-veg-basal-sword',
    question: 'Do the leaf margins have fine teeth or bristles, and do the leaves feel stiff and leathery?',
    a: {
      label: 'Yes — stiff yucca-like leaves with finely toothed or bristled margins, parallel veins',
      next: ['rattlesnake-master'],
    },
    b: {
      label: 'No — smooth sword-like leaves in flat fan-shaped clusters, usually in wet or moist ground',
      next: ['blue-flag-iris'],
    },
  },
  {
    id: 'q-veg-basal-broad',
    question: 'Are the leaves enormous — more than a foot across and very rough to the touch?',
    a: {
      label: 'Yes — huge rough heart-shaped leaves, prairie habitat',
      next: ['prairie-dock'],
    },
    b: {
      label: 'No — leaves are smaller',
      next: 'q-veg-basal-small',
    },
  },
  {
    id: 'q-veg-basal-small',
    question: 'Does the plant form dense colonies carpeting the forest floor?',
    a: {
      label: 'Yes — umbrella-like lobed leaves, colonial on shaded forest floor',
      next: ['mayapple'],
    },
    b: {
      label: 'No — solitary or a small loose cluster',
      next: 'q-veg-basal-solitary',
    },
  },
  {
    id: 'q-veg-basal-solitary',
    question: 'What do the leaves look like up close?',
    a: {
      label: 'A single rounded deeply-lobed leaf clasping the stem; plant very short (under 1 ft); woodland floor',
      next: ['bloodroot'],
    },
    b: {
      label: 'A flat rosette of smooth narrow-oval leaves; flowering stalk is leafless; prairie or savanna',
      next: ['shooting-star'],
    },
  },

  // Alternate-leaved plants: Black-Eyed Susan, Butterfly Milkweed, Cardinal Flower,
  // Eastern Purple Coneflower, Prairie Blazingstar, Compass Plant, Virginia Bluebells,
  // Illinois Bundleflower, Wild Columbine, New England Aster, Purple Prairie Clover
  {
    id: 'q-veg-alternate',
    question: 'Are the leaves compound — divided into distinct separate leaflets?',
    a: {
      label: 'Yes — leaves divided into leaflets',
      next: 'q-veg-compound',
    },
    b: {
      label: 'No — leaves are simple (one blade, not divided)',
      next: 'q-veg-simple-alt',
    },
  },

  // Compound alternate: Wild Columbine, Illinois Bundleflower, Purple Prairie Clover
  {
    id: 'q-veg-compound',
    question: 'How finely divided are the leaves?',
    a: {
      label: 'Very finely divided and fernlike — many small leaflets giving a lacy texture',
      next: 'q-veg-compound-fine',
    },
    b: {
      label: 'Leaflets larger with rounded lobes, giving a delicate open look; rocky or open woodland slopes',
      next: ['wild-columbine'],
    },
  },
  {
    id: 'q-veg-compound-fine',
    question: 'What is the stem habit?',
    a: {
      label: 'Upright branching stems in prairie or disturbed open ground; bipinnate fernlike leaves',
      next: ['illinois-bundleflower'],
    },
    b: {
      label: 'Slender erect unbranched stem in dry sunny prairie; narrow strap-like leaflets',
      next: ['purple-prairie-clover'],
    },
  },

  // Simple alternate
  {
    id: 'q-veg-simple-alt',
    question: 'Are the leaves deeply lobed — cut nearly to the midrib — and sandpapery rough?',
    a: {
      label: 'Yes — deeply pinnately lobed, very rough, alternate along a tall stem; leaves may orient north–south',
      next: ['compass-plant'],
    },
    b: {
      label: 'No — leaves are not deeply lobed',
      next: 'q-veg-simple-alt-2',
    },
  },
  {
    id: 'q-veg-simple-alt-2',
    question: 'Are the leaves extremely narrow and grasslike — well under 1 cm wide?',
    a: {
      label: 'Yes — narrow grasslike leaves running up an unbranched stem; prairie',
      next: ['prairie-blazingstar'],
    },
    b: {
      label: 'No — leaves clearly wider than grass',
      next: 'q-veg-simple-alt-3',
    },
  },
  {
    id: 'q-veg-simple-alt-3',
    question: 'Where is the plant growing?',
    a: {
      label: 'Wet or moist ground — streambank, floodplain, marsh, or wet prairie',
      next: 'q-veg-wet-alt',
    },
    b: {
      label: 'Upland — prairie, savanna, or open woodland',
      next: 'q-veg-upland-alt',
    },
  },

  // Wet simple alternate: Cardinal Flower, Virginia Bluebells
  {
    id: 'q-veg-wet-alt',
    question: 'What do the leaves look like?',
    a: {
      label: 'Lance-shaped with toothed margins; stems smooth; wet prairie edges or shaded wet margins',
      next: ['cardinal-flower'],
    },
    b: {
      label: 'Smooth oval leaves with entire margins and a blue-green cast; floodplain or streambank woodland',
      next: ['bluebells'],
    },
  },

  // Upland simple alternate: Black-Eyed Susan, Butterfly Milkweed, Eastern Purple Coneflower, New England Aster
  {
    id: 'q-veg-upland-alt',
    question: 'Are the leaves and stems very rough and hairy — bristly enough to scratch skin?',
    a: {
      label: 'Yes — stems and leaves noticeably rough or bristly',
      next: 'q-veg-hairy-upland',
    },
    b: {
      label: 'No — stems and leaves smooth or only slightly hairy; narrow alternate leaves',
      next: ['butterfly-milkweed'],
    },
  },
  {
    id: 'q-veg-hairy-upland',
    question: 'Do the leaves clasp the stem at their base with no leaf stalk?',
    a: {
      label: 'Yes — leaves clasp the stem; plant tall (3–6 ft) with many hairy branches',
      next: ['new-england-aster'],
    },
    b: {
      label: 'No — leaves have a short stalk or taper to the stem',
      next: 'q-veg-hairy-upland-2',
    },
  },
  {
    id: 'q-veg-hairy-upland-2',
    question: 'What is the leaf shape?',
    a: {
      label: 'Broadly oval with toothed margins; stems may branch near the top; plant 2–3.5 ft',
      next: ['eastern-purple-coneflower'],
    },
    b: {
      label: 'Lance-shaped on slender hairy stems; plant 1–2.5 ft',
      next: ['black-eyed-susan'],
    },
  },

  // ─── SPRING BRANCH ───────────────────────────────────────────────────────
  {
    id: 'q-spring-color',
    question: 'What color are the flowers?',
    a: {
      label: 'White',
      next: 'q-white-spring',
    },
    b: {
      label: 'Blue, purple, pink, red, or yellow',
      next: 'q-colored-spring',
    },
  },
  {
    id: 'q-white-spring',
    question: 'What do the leaves look like?',
    a: {
      label: 'Large umbrella-like leaves with several deep lobes; plant forms colonies on forest floor',
      next: ['mayapple'],
    },
    b: {
      label: 'A single rounded lobed leaf that clasps the flower stalk; plant is solitary',
      next: ['bloodroot'],
    },
  },
  {
    id: 'q-colored-spring',
    question: 'Are the flowers blue or purple?',
    a: {
      label: 'Yes — blue or purple',
      next: 'q-blue-spring',
    },
    b: {
      label: 'No — pink, red, or yellow',
      next: 'q-pink-spring',
    },
  },
  {
    id: 'q-blue-spring',
    question: 'Does the plant have large iris-type flowers with sword-like basal leaves growing in wet or moist soil?',
    a: {
      label: 'Yes — iris-shaped blue-violet flowers, saturated or wet ground',
      next: ['blue-flag-iris'],
    },
    b: {
      label: 'No — flowers are smaller or differently shaped, soil is mesic to dry',
      next: 'q-blue-spring-2',
    },
  },
  {
    id: 'q-blue-spring-2',
    question: 'What is the flower shape?',
    a: {
      label: 'Bell-shaped blue flowers hanging in clusters; smooth oval blue-green leaves',
      next: ['bluebells'],
    },
    b: {
      label: 'Five-petaled pink to lavender flowers; opposite palmately lobed leaves; beak-like seed pods',
      next: ['wild-geranium'],
    },
  },
  {
    id: 'q-pink-spring',
    question: 'What is the flower shape?',
    a: {
      label: 'Nodding red and yellow flowers with backward-pointing spurs; delicate compound leaves',
      next: ['wild-columbine'],
    },
    b: {
      label: 'Petals swept sharply backward from a pointed center, like a shooting star; flowers on a leafless stalk above a basal rosette',
      next: ['shooting-star'],
    },
  },

  // ─── SUMMER / FALL BRANCH ────────────────────────────────────────────────
  {
    id: 'q-summer-color',
    question: 'Are the flowers yellow or orange?',
    a: {
      label: 'Yes — yellow or orange',
      next: 'q-yellow-summer',
    },
    b: {
      label: 'No — white, green, red, pink, or purple',
      next: 'q-upland-or-wet',
    },
  },
  {
    id: 'q-yellow-summer',
    question: 'What is the flower arrangement?',
    a: {
      label: 'Vivid orange flat-topped flower clusters (not daisy-like rays); alternate narrow leaves',
      next: ['butterfly-milkweed'],
    },
    b: {
      label: 'Yellow daisy-like composite heads with distinct ray petals surrounding a central disk',
      next: 'q-yellow-daisy',
    },
  },
  {
    id: 'q-yellow-daisy',
    question: 'Does the flower have a prominent dark brown or black central disk?',
    a: {
      label: 'Yes — golden yellow rays around a very dark brown disk; hairy stems; plant 1–2.5 ft tall',
      next: ['black-eyed-susan'],
    },
    b: {
      label: 'No dark disk; plant is tall (3 ft or more) with yellow heads spaced along an upper stalk',
      next: 'q-tall-yellow',
    },
  },
  {
    id: 'q-tall-yellow',
    question: 'What are the leaves like?',
    a: {
      label: 'Huge rough heart-shaped leaves clustered at the base; flowering stalk nearly leafless',
      next: ['prairie-dock'],
    },
    b: {
      label: 'Deeply lobed sandpapery alternate leaves along the stem; leaves tend to orient north–south',
      next: ['compass-plant'],
    },
  },

  {
    id: 'q-upland-or-wet',
    question: 'Where is the plant growing?',
    a: {
      label: 'In or immediately adjacent to wet habitat — marsh, fen, streambank, or saturated soil',
      next: 'q-wet-flower',
    },
    b: {
      label: 'Upland — prairie, savanna, open woodland, or dry to mesic roadside',
      next: 'q-upland-color',
    },
  },
  {
    id: 'q-wet-flower',
    question: 'What color and shape are the flowers?',
    a: {
      label: 'Intense red tubular flowers arranged on a tall upright spike',
      next: ['cardinal-flower'],
    },
    b: {
      label: 'Pink rounded flower clusters; opposite narrow leaves on upright branching stems',
      next: ['swamp-milkweed'],
    },
  },

  {
    id: 'q-upland-color',
    question: 'What color are the flowers?',
    a: {
      label: 'White or greenish',
      next: 'q-white-green-upland',
    },
    b: {
      label: 'Purple, pink, or lavender',
      next: 'q-purple-upland',
    },
  },
  {
    id: 'q-white-green-upland',
    question: 'What do the leaves and flower heads look like?',
    a: {
      label: 'Stiff yucca-like basal leaves with parallel veins; round prickly greenish-white flower heads on a tall stalk',
      next: ['rattlesnake-master'],
    },
    b: {
      label: 'Finely divided fernlike compound leaves; ball-shaped white flower heads; curled dark seed pods in late season',
      next: ['illinois-bundleflower'],
    },
  },

  {
    id: 'q-purple-upland',
    question: 'Do the flowers have distinct spreading ray petals (daisy-like)?',
    a: {
      label: 'Yes — composite flower with rays radiating outward',
      next: 'q-ray-purple',
    },
    b: {
      label: 'No rays — flowers are tubular, fluffy, or densely packed in a head or spike',
      next: 'q-no-ray-purple',
    },
  },
  {
    id: 'q-ray-purple',
    question: 'What is the cone/disk like?',
    a: {
      label: 'Prominent spiny orange-brown cone center; rays droop downward; broad rough leaves',
      next: ['eastern-purple-coneflower'],
    },
    b: {
      label: 'Small yellow disk; many fine purple-pink rays; hairy stems with clasping alternate leaves; plant 3–6 ft tall',
      next: ['new-england-aster'],
    },
  },
  {
    id: 'q-no-ray-purple',
    question: 'Are the flowers arranged in a tall wand-like spike?',
    a: {
      label: 'Yes — dense fluffy purple spike with narrow grasslike leaves; flowers open from top down',
      next: ['prairie-blazingstar'],
    },
    b: {
      label: 'No — flowers in a rounded or cone-shaped head at the branch tips',
      next: 'q-bergamot-clover',
    },
  },
  {
    id: 'q-bergamot-clover',
    question: 'What are the stem and leaf traits?',
    a: {
      label: 'Square stem; opposite aromatic leaves; tufted lavender flower head with tubular florets',
      next: ['wild-bergamot'],
    },
    b: {
      label: 'Round stem; fine pinnately compound leaves; dense cone-shaped head with purple florets opening in a ring',
      next: ['purple-prairie-clover'],
    },
  },
];
