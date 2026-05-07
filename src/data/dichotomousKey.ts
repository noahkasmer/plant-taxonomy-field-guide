import type { KeyNode } from '@/types/dichotomousKey';

export const ROOT_NODE_ID = 'q-is-blooming';

export const keyNodes: KeyNode[] = [
  {
    id: 'q-is-blooming',
    question: 'Is the plant in bloom right now?',
    context: 'Look for open flowers or visible petals. Buds that have not opened yet do not count.',
    a: {
      label: 'Yes — I can see open flowers',
      next: 'q-bloom-season',
    },
    b: {
      label: 'No — I need to use leaves, stem, and location instead',
      next: 'q-veg-arrangement',
    },
  },
  {
    id: 'q-bloom-season',
    question: 'Is it blooming in spring, or later in the summer and fall?',
    context: 'Spring runs roughly March through June. Summer and fall is July onward.',
    a: {
      label: 'Spring — mostly March through June',
      next: 'q-spring-main-color',
    },
    b: {
      label: 'Summer or fall — July or later',
      next: 'q-summer-main-color',
    },
  },

  // ── Spring branch ────────────────────────────────────────────────────────

  {
    id: 'q-spring-main-color',
    question: 'What color are the flowers?',
    a: {
      label: 'White or greenish',
      next: 'q-spring-white-structure',
    },
    b: {
      label: 'Blue, purple, pink, red, or yellow',
      next: 'q-spring-colored-flowers',
    },
  },
  {
    id: 'q-spring-white-structure',
    question: 'Does the plant form large umbrella-like colonies on the forest floor?',
    context: 'Look for patches of broad leaves spreading like umbrellas from a central stalk, often covering the ground in groups.',
    a: {
      label: 'Yes — big umbrella-shaped leaves in patches',
      hint: 'Colonies on shaded forest floor',
      next: ['mayapple'],
    },
    b: {
      label: 'No — a single flower or a hooded structure',
      next: 'q-spring-white-structure-2',
    },
  },
  {
    id: 'q-spring-white-structure-2',
    question: 'Is the flower a curved hood shape, greenish or dark maroon inside?',
    context: 'The hood curves forward and partially hides a finger-like spike inside it. Two large three-part leaves grow nearby on the same plant.',
    a: {
      label: 'Yes — hooded woodland flower',
      hint: 'Greenish or maroon hood hiding a spike inside',
      next: ['jack-in-the-pulpit'],
    },
    b: {
      label: 'No — open white flower with a single deeply lobed leaf',
      hint: 'One large leaf per stem, flower has many white petals',
      next: ['bloodroot'],
    },
  },
  {
    id: 'q-spring-colored-flowers',
    question: 'Are the flowers blue, violet, or lavender?',
    a: {
      label: 'Yes — blue, violet, or lavender',
      next: 'q-spring-blue-flower-shape',
    },
    b: {
      label: 'No — red, yellow, pink, or mixed colors',
      next: 'q-spring-warm-colors',
    },
  },
  {
    id: 'q-spring-blue-flower-shape',
    question: 'Do the flowers look like an iris — large with petals that droop downward?',
    context: 'Iris flowers have three large petals that fall outward and downward, and three smaller ones that stand up. The leaves are long, flat, and sword-shaped.',
    a: {
      label: 'Yes — large iris-like flowers in wet or boggy ground',
      hint: 'Sword-shaped leaves, grows in water or wet soil',
      next: ['blue-flag-iris'],
    },
    b: {
      label: 'No — smaller bells or open five-petaled flowers',
      next: 'q-spring-blue-flower-shape-2',
    },
  },
  {
    id: 'q-spring-blue-flower-shape-2',
    question: 'Are the flowers nodding bell shapes hanging in drooping clusters?',
    context: 'The bells hang downward from curved stems in a tight cluster. Leaves are smooth and blue-green.',
    a: {
      label: 'Yes — nodding blue bells',
      hint: 'Trumpet-shaped, hanging downward in clusters',
      next: ['virginia-bluebells'],
    },
    b: {
      label: 'No — open pink-lavender flowers with deeply cut hand-shaped leaves',
      hint: 'Five petals, leaves with 5–7 lobes like a hand',
      next: ['wild-geranium'],
    },
  },
  {
    id: 'q-spring-warm-colors',
    question: 'Do the flowers have long spurs dangling downward, red on the outside and yellow inside?',
    context: 'Each flower hangs from a curved stalk. The hollow spur points backward and up. The whole flower nods downward.',
    a: {
      label: 'Yes — nodding spurred flowers, red and yellow',
      next: ['wild-columbine'],
    },
    b: {
      label: 'No — small yellow flowers in a flat-topped umbrella cluster',
      hint: 'Tiny flowers grouped in a wide, flat head',
      next: ['golden-alexanders'],
    },
  },

  // ── Summer / fall branch ─────────────────────────────────────────────────

  {
    id: 'q-summer-main-color',
    question: 'Are the flowers yellow or orange?',
    a: {
      label: 'Yes — yellow or orange',
      next: 'q-summer-yellow',
    },
    b: {
      label: 'No — red, pink, purple, blue, white, or greenish',
      next: 'q-summer-wet-or-upland',
    },
  },
  {
    id: 'q-summer-yellow',
    question: 'Are the flowers vivid orange in flat-topped clusters — not daisy-like heads?',
    context: 'Milkweed-type clusters are dense and rounded or flat, not the classic petal-around-a-center shape.',
    a: {
      label: 'Yes — flat-topped vivid orange clusters',
      next: ['butterfly-milkweed'],
    },
    b: {
      label: 'No — daisy-like yellow heads or tall stalks with yellow flowers',
      next: 'q-summer-yellow-2',
    },
  },
  {
    id: 'q-summer-yellow-2',
    question: 'Does the flower have a dark raised center disk surrounded by yellow petals?',
    context: 'The center should look like a button or raised dome — dark brown or black, clearly visible. The yellow petals surround it like rays of the sun.',
    a: {
      label: 'Yes — yellow petals around a dark raised center',
      hint: 'Like a small sunflower with a dark eye',
      diagram: 'ray-disk',
      next: ['black-eyed-susan'],
    },
    b: {
      label: 'No — very tall plant with enormous rough leaves at the base',
      hint: 'Basal leaves over a foot long, rough like sandpaper',
      next: ['prairie-dock'],
    },
  },
  {
    id: 'q-summer-wet-or-upland',
    question: 'Is the plant growing in or right next to wet ground?',
    context: 'Wet ground includes marsh edges, streambanks, ditches, wet meadows, and low spots that stay damp. Step close — does the soil feel soft or soggy?',
    a: {
      label: 'Yes — marsh, streambank, wet prairie, or flooded low ground',
      next: 'q-summer-wet-color',
    },
    b: {
      label: 'No — drier prairie, savanna, meadow, or open upland',
      next: 'q-summer-upland-color',
    },
  },
  {
    id: 'q-summer-wet-color',
    question: 'Are the flowers bright scarlet red on a tall upright spike?',
    a: {
      label: 'Yes — vivid red spike',
      hint: 'Cardinal red, unmistakable in wet areas',
      next: ['cardinal-flower'],
    },
    b: {
      label: 'No — blue, pink, or purple flowers',
      next: 'q-summer-wet-color-2',
    },
  },
  {
    id: 'q-summer-wet-color-2',
    question: 'Are the flowers large and rich blue, packed tightly on an upright spike?',
    a: {
      label: 'Yes — large blue flowers on a single spike',
      hint: 'Deep blue, each flower has a distinctive shape with a split lower lip',
      next: ['great-blue-lobelia'],
    },
    b: {
      label: 'No — smaller flowers in clusters or branching spikes',
      next: 'q-summer-wet-color-3',
    },
  },
  {
    id: 'q-summer-wet-color-3',
    question: 'Do the flowers form rounded pink-purple clusters on narrow leaves that grow in pairs?',
    context: 'Swamp milkweed has leaves that grow directly across from each other (opposite). The flower clusters are domed and fragrant.',
    a: {
      label: 'Yes — rounded pink clusters, narrow opposite leaves',
      next: ['swamp-milkweed'],
    },
    b: {
      label: 'No — many small flowers running along branching spikes',
      next: 'q-summer-wet-color-4',
    },
  },
  {
    id: 'q-summer-wet-color-4',
    question: 'Are the spikes thin and branched like a candelabra, with tiny blue-violet flowers?',
    context: 'Blue vervain branches near the top into multiple thin spikes. Flowers open in a ring that moves upward as the season progresses.',
    a: {
      label: 'Yes — slender branched blue-violet spikes',
      next: ['blue-vervain'],
    },
    b: {
      label: 'No — pink-purple flowers in a single neat upright spike',
      hint: 'Flowers are snapdragon-like and can be nudged sideways',
      next: ['obedient-plant'],
    },
  },
  {
    id: 'q-summer-upland-color',
    question: 'Are the flowers white or pale greenish — not purple or pink?',
    a: {
      label: 'Yes — pale or whitish, in spherical or bristly heads',
      hint: 'Stiff yucca-like leaves, spiny flower balls',
      next: ['rattlesnake-master'],
    },
    b: {
      label: 'No — purple, pink, or blue',
      next: 'q-summer-purple-form',
    },
  },
  {
    id: 'q-summer-purple-form',
    question: 'Is there a large raised cone in the center, with petals that droop downward around it?',
    context: 'The cone should be prominent — like a raised thimble or dome. The pink-purple petals hang down around it rather than spreading flat.',
    a: {
      label: 'Yes — big cone with drooping petals',
      hint: 'Cone is orange-brown and very noticeable',
      diagram: 'ray-disk',
      next: ['eastern-purple-coneflower'],
    },
    b: {
      label: 'No — spikes, shaggy heads, or fall daisy clusters',
      next: 'q-summer-purple-form-2',
    },
  },
  {
    id: 'q-summer-purple-form-2',
    question: 'Are the flowers packed into a single upright wand-like spike, with narrow grasslike leaves?',
    a: {
      label: 'Yes — dense purple spike, narrow leaves',
      hint: 'Leaves look almost like grass blades along the stem',
      next: ['prairie-blazingstar'],
    },
    b: {
      label: 'No — rounded heads or many-rayed daisy flowers',
      next: 'q-summer-purple-form-3',
    },
  },
  {
    id: 'q-summer-purple-form-3',
    question: 'Does the stem feel square when you roll it, and do the leaves smell herbal when you crush one?',
    context: 'Run your fingers down the stem — a square stem has four distinct flat sides. Then pinch a leaf and bring it to your nose.',
    a: {
      label: 'Yes — square stem, aromatic leaves',
      hint: 'Oregano or thyme-like smell; shaggy rounded flower heads',
      diagram: 'square-stem',
      next: ['wild-bergamot'],
    },
    b: {
      label: 'No — round stem, fall daisy with many purple rays',
      hint: 'Dozens of thin purple petals around a yellow center',
      next: ['new-england-aster'],
    },
  },

  // ── Vegetative (not blooming) branch ─────────────────────────────────────

  {
    id: 'q-veg-arrangement',
    question: 'Do the leaves grow in matching pairs directly across from each other on the stem?',
    context: 'Look at where the leaves attach to the stem. Opposite leaves grow in pairs at the same spot. Alternate leaves stagger one at a time up the stem.',
    a: {
      label: 'Yes — leaves grow in pairs, one on each side',
      hint: 'Both leaves at the same height on the stem',
      diagram: 'opposite',
      next: 'q-veg-opposite-stem',
    },
    b: {
      label: 'No — leaves stagger one at a time, or grow from the base',
      hint: 'Each leaf at a different height, or all leaves low to the ground',
      diagram: 'alternate',
      next: 'q-veg-basal-vs-stem',
    },
  },
  {
    id: 'q-veg-opposite-stem',
    question: 'Does the stem feel square when you roll it between your fingers?',
    context: 'Pinch the stem and roll it slowly. A square stem has four flat sides and distinct corners. A round stem feels smooth all around.',
    a: {
      label: 'Yes — four flat sides, clearly square',
      diagram: 'square-stem',
      next: 'q-veg-square-stem',
    },
    b: {
      label: 'No — round and smooth',
      next: ['swamp-milkweed', 'wild-geranium'],
    },
  },
  {
    id: 'q-veg-square-stem',
    question: 'Do the leaves smell minty or herbal when you firmly crush one?',
    context: 'Pinch a leaf hard and bring it to your nose within a few seconds. Mint-family plants have a strong, distinctive scent.',
    a: {
      label: 'Yes — minty, herbal, or oregano-like smell',
      next: ['wild-bergamot'],
    },
    b: {
      label: 'No — little or no scent, grows in wet ground',
      next: ['blue-vervain', 'obedient-plant'],
    },
  },
  {
    id: 'q-veg-basal-vs-stem',
    question: 'Are most of the leaves clustered at the base of the plant near the ground?',
    context: 'Basal leaves grow from the root crown and stay low. Stem leaves are spaced up the stalk at different heights.',
    a: {
      label: 'Yes — leaves mostly low, in a ground-level cluster or rosette',
      diagram: 'basal',
      next: 'q-veg-basal-shape',
    },
    b: {
      label: 'No — leaves spaced up the stem',
      diagram: 'alternate',
      next: 'q-veg-stem-leaves',
    },
  },
  {
    id: 'q-veg-basal-shape',
    question: 'Are the basal leaves long, narrow, and sword-like — or stiff and spiny at the tips?',
    a: {
      label: 'Yes — long sword-like or stiff spiny leaves',
      next: 'q-veg-basal-sword',
    },
    b: {
      label: 'No — broad, lobed, or umbrella-shaped leaves',
      next: 'q-veg-basal-broad',
    },
  },
  {
    id: 'q-veg-basal-sword',
    question: 'Is the plant rooted in wet or boggy ground, with flat leaves that fan out in one plane?',
    context: 'Iris leaves are smooth, flat, and arranged like a fan — all in the same flat plane rather than spreading in all directions.',
    a: {
      label: 'Yes — flat fan-shaped leaves in wet or boggy ground',
      next: ['blue-flag-iris'],
    },
    b: {
      label: 'No — stiff, spiny, yucca-like leaves in dry prairie or open ground',
      next: ['rattlesnake-master'],
    },
  },
  {
    id: 'q-veg-basal-broad',
    question: 'Are the leaves enormous — over a foot long — rough like sandpaper, with a heart-shaped base?',
    a: {
      label: 'Yes — giant rough prairie leaves',
      hint: 'Leaves can be 12–20 inches long, very coarse texture',
      next: ['prairie-dock'],
    },
    b: {
      label: 'No — smaller woodland leaves',
      next: 'q-veg-basal-broad-2',
    },
  },
  {
    id: 'q-veg-basal-broad-2',
    question: 'Does the plant form umbrella-like colonies on the forest floor, covering the ground in patches?',
    a: {
      label: 'Yes — umbrella leaves spreading in colonies',
      next: ['mayapple'],
    },
    b: {
      label: 'No — a smaller solitary woodland plant',
      next: ['bloodroot'],
    },
  },
  {
    id: 'q-veg-stem-leaves',
    question: 'Are the leaves very narrow and grasslike, hugging an unbranched upright stem?',
    a: {
      label: 'Yes — narrow grasslike leaves on an upright stem',
      next: ['prairie-blazingstar'],
    },
    b: {
      label: 'No — broader leaves or leaves divided into leaflets',
      next: 'q-veg-compound-or-broad',
    },
  },
  {
    id: 'q-veg-compound-or-broad',
    question: 'Are the leaves divided into separate leaflets — like a hand or a feather?',
    context: 'A compound leaf looks like multiple small leaves all attached to one shared stalk. Each small piece (a leaflet) is part of a single leaf.',
    a: {
      label: 'Yes — leaves divided into distinct leaflets',
      diagram: 'compound',
      next: ['wild-columbine', 'jack-in-the-pulpit'],
    },
    b: {
      label: 'No — single undivided leaf blades',
      diagram: 'simple',
      next: 'q-veg-broad-stemmed',
    },
  },
  {
    id: 'q-veg-broad-stemmed',
    question: 'Are the leaves and stem rough or scratchy to the touch, with coarse hairs?',
    context: 'Run the back of your hand along a leaf. Rough means it catches your skin like sandpaper or velcro.',
    a: {
      label: 'Yes — rough and hairy',
      next: ['black-eyed-susan', 'eastern-purple-coneflower', 'new-england-aster'],
    },
    b: {
      label: 'No — smoother leaves, or blue-green foliage on a floodplain plant',
      next: ['virginia-bluebells', 'great-blue-lobelia', 'cardinal-flower'],
    },
  },
];
