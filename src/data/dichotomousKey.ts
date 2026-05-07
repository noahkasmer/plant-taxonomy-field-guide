import type { KeyNode } from '@/types/dichotomousKey';

export const ROOT_NODE_ID = 'q-is-blooming';

// Guided key tuned to the current seeded Illinois catalog.
// Some vegetative branches intentionally return a short candidate list where
// the current dataset does not support a clean species-level split without blooms.
export const keyNodes: KeyNode[] = [
  {
    id: 'q-is-blooming',
    question: 'Is the plant currently in bloom?',
    a: {
      label: 'Yes - flowers are visible right now',
      next: 'q-bloom-season',
    },
    b: {
      label: 'No - I need to use leaves, stem, and habitat instead',
      next: 'q-veg-arrangement',
    },
  },
  {
    id: 'q-bloom-season',
    question: 'Is it blooming in spring or later in summer and fall?',
    a: {
      label: 'Spring - mostly March through June',
      next: 'q-spring-main-color',
    },
    b: {
      label: 'Summer or fall - mostly July or later',
      next: 'q-summer-main-color',
    },
  },

  // Spring branch
  {
    id: 'q-spring-main-color',
    question: 'Are the flowers mostly white or greenish?',
    a: {
      label: 'Yes - white or greenish',
      next: 'q-spring-white-structure',
    },
    b: {
      label: 'No - blue, purple, pink, red, or yellow',
      next: 'q-spring-colored-flowers',
    },
  },
  {
    id: 'q-spring-white-structure',
    question: 'Does the plant form umbrella-like colonies on the woodland floor?',
    a: {
      label: 'Yes - broad umbrella leaves in colonies',
      next: ['mayapple'],
    },
    b: {
      label: 'No - solitary flower or hooded structure',
      next: 'q-spring-white-structure-2',
    },
  },
  {
    id: 'q-spring-white-structure-2',
    question: 'Is the flower hooded, greenish or maroon, with two large three-part leaves nearby?',
    a: {
      label: 'Yes - hooded woodland flower',
      next: ['jack-in-the-pulpit'],
    },
    b: {
      label: 'No - open white flower with a single lobed leaf',
      next: ['bloodroot'],
    },
  },
  {
    id: 'q-spring-colored-flowers',
    question: 'Are the flowers blue or purple?',
    a: {
      label: 'Yes - blue, violet, or lavender',
      next: 'q-spring-blue-flower-shape',
    },
    b: {
      label: 'No - red, yellow, pink, or mixed colors',
      next: 'q-spring-warm-colors',
    },
  },
  {
    id: 'q-spring-blue-flower-shape',
    question: 'Do the flowers look iris-like, with large drooping sepals and sword-like basal leaves?',
    a: {
      label: 'Yes - large iris flowers in wet ground',
      next: ['blue-flag-iris'],
    },
    b: {
      label: 'No - smaller bells or open five-petaled flowers',
      next: 'q-spring-blue-flower-shape-2',
    },
  },
  {
    id: 'q-spring-blue-flower-shape-2',
    question: 'Are the flowers nodding bell-shaped clusters on smooth blue-green leaves?',
    a: {
      label: 'Yes - nodding blue bells',
      next: ['virginia-bluebells'],
    },
    b: {
      label: 'No - open pink-lavender flowers with palmate leaves',
      next: ['wild-geranium'],
    },
  },
  {
    id: 'q-spring-warm-colors',
    question: 'Do the flowers have red and yellow spurs that hang downward?',
    a: {
      label: 'Yes - nodding spurred flowers',
      next: ['wild-columbine'],
    },
    b: {
      label: 'No - yellow umbrella-like flower clusters',
      next: ['golden-alexanders'],
    },
  },

  // Summer / fall branch
  {
    id: 'q-summer-main-color',
    question: 'Are the flowers yellow or orange?',
    a: {
      label: 'Yes - yellow or orange',
      next: 'q-summer-yellow',
    },
    b: {
      label: 'No - red, pink, purple, blue, white, or greenish',
      next: 'q-summer-wet-or-upland',
    },
  },
  {
    id: 'q-summer-yellow',
    question: 'Are the flowers vivid orange clusters rather than daisy-like heads?',
    a: {
      label: 'Yes - flat-topped orange clusters',
      next: ['butterfly-milkweed'],
    },
    b: {
      label: 'No - daisy-like yellow heads or tall composite stalks',
      next: 'q-summer-yellow-2',
    },
  },
  {
    id: 'q-summer-yellow-2',
    question: 'Is there a dark brown or black center disk in the flower head?',
    a: {
      label: 'Yes - yellow rays around a dark disk',
      next: ['black-eyed-susan'],
    },
    b: {
      label: 'No - very tall plant with huge rough basal leaves',
      next: ['prairie-dock'],
    },
  },
  {
    id: 'q-summer-wet-or-upland',
    question: 'Is the plant growing in wet ground or right beside water?',
    a: {
      label: 'Yes - marsh, streambank, wet prairie, or floodplain',
      next: 'q-summer-wet-color',
    },
    b: {
      label: 'No - prairie, savanna, meadow, or drier open ground',
      next: 'q-summer-upland-color',
    },
  },
  {
    id: 'q-summer-wet-color',
    question: 'Are the flowers bright scarlet red on a tall spike?',
    a: {
      label: 'Yes - scarlet spike',
      next: ['cardinal-flower'],
    },
    b: {
      label: 'No - blue, pink, or purple flowers',
      next: 'q-summer-wet-color-2',
    },
  },
  {
    id: 'q-summer-wet-color-2',
    question: 'Are the flowers large, rich blue, and packed into a vertical spike?',
    a: {
      label: 'Yes - large blue lobelia flowers',
      next: ['great-blue-lobelia'],
    },
    b: {
      label: 'No - smaller flowers in spikes or rounded clusters',
      next: 'q-summer-wet-color-3',
    },
  },
  {
    id: 'q-summer-wet-color-3',
    question: 'Do the flowers form rounded pink clusters on narrow opposite leaves?',
    a: {
      label: 'Yes - rounded pink clusters',
      next: ['swamp-milkweed'],
    },
    b: {
      label: 'No - flowers run along spikes',
      next: 'q-summer-wet-color-4',
    },
  },
  {
    id: 'q-summer-wet-color-4',
    question: 'Are the spikes made of many tiny blue-violet flowers on branched candelabra-like stems?',
    a: {
      label: 'Yes - slender branched blue spikes',
      next: ['blue-vervain'],
    },
    b: {
      label: 'No - pink-purple flowers line a neat upright spike',
      next: ['obedient-plant'],
    },
  },
  {
    id: 'q-summer-upland-color',
    question: 'Are the flowers white or greenish rather than purple, pink, or blue?',
    a: {
      label: 'Yes - pale spherical or bristly heads',
      next: ['rattlesnake-master'],
    },
    b: {
      label: 'No - purple, pink, or blue flowers',
      next: 'q-summer-purple-form',
    },
  },
  {
    id: 'q-summer-purple-form',
    question: 'Is there a large raised cone with drooping purple-pink petals?',
    a: {
      label: 'Yes - big cone and drooping rays',
      next: ['eastern-purple-coneflower'],
    },
    b: {
      label: 'No - spikes, shaggy heads, or fall daisy clusters',
      next: 'q-summer-purple-form-2',
    },
  },
  {
    id: 'q-summer-purple-form-2',
    question: 'Are the flowers packed into a single vertical wand-like spike with narrow grasslike leaves?',
    a: {
      label: 'Yes - dense upright purple spike',
      next: ['prairie-blazingstar'],
    },
    b: {
      label: 'No - rounded heads or many ray flowers',
      next: 'q-summer-purple-form-3',
    },
  },
  {
    id: 'q-summer-purple-form-3',
    question: 'Does the stem feel square and do the leaves smell minty when crushed?',
    a: {
      label: 'Yes - square stem and aromatic leaves',
      next: ['wild-bergamot'],
    },
    b: {
      label: 'No - fall-like daisy heads with many purple rays',
      next: ['new-england-aster'],
    },
  },

  // Vegetative branch
  {
    id: 'q-veg-arrangement',
    question: 'Are the leaves opposite or whorled rather than alternate or basal?',
    a: {
      label: 'Yes - opposite or whorled leaves',
      next: 'q-veg-opposite-stem',
    },
    b: {
      label: 'No - mostly alternate, basal, or in a rosette',
      next: 'q-veg-basal-vs-stem',
    },
  },
  {
    id: 'q-veg-opposite-stem',
    question: 'Does the stem feel square when you roll it between your fingers?',
    a: {
      label: 'Yes - square stem',
      next: 'q-veg-square-stem',
    },
    b: {
      label: 'No - round stem',
      next: ['swamp-milkweed', 'wild-geranium'],
    },
  },
  {
    id: 'q-veg-square-stem',
    question: 'Do the leaves smell minty or herbal when crushed?',
    a: {
      label: 'Yes - aromatic leaves',
      next: ['wild-bergamot'],
    },
    b: {
      label: 'No - wet-ground spike plant with opposite leaves',
      next: ['blue-vervain', 'obedient-plant'],
    },
  },
  {
    id: 'q-veg-basal-vs-stem',
    question: 'Are most leaves clustered at the base or in a ground-level rosette?',
    a: {
      label: 'Yes - mostly basal leaves',
      next: 'q-veg-basal-shape',
    },
    b: {
      label: 'No - leaves are spaced along the stem',
      next: 'q-veg-stem-leaves',
    },
  },
  {
    id: 'q-veg-basal-shape',
    question: 'Are the basal leaves long and sword-like or stiff and narrow?',
    a: {
      label: 'Yes - sword-like or yucca-like leaves',
      next: 'q-veg-basal-sword',
    },
    b: {
      label: 'No - broad, lobed, or umbrella-like leaves',
      next: 'q-veg-basal-broad',
    },
  },
  {
    id: 'q-veg-basal-sword',
    question: 'Is the plant rooted in wet ground with flat fan-shaped leaves?',
    a: {
      label: 'Yes - fan-shaped leaves in wet ground',
      next: ['blue-flag-iris'],
    },
    b: {
      label: 'No - stiff yucca-like leaves in prairie or open ground',
      next: ['rattlesnake-master'],
    },
  },
  {
    id: 'q-veg-basal-broad',
    question: 'Are the leaves enormous, rough, and heart-based, often over a foot long?',
    a: {
      label: 'Yes - giant rough prairie leaves',
      next: ['prairie-dock'],
    },
    b: {
      label: 'No - smaller woodland leaves',
      next: 'q-veg-basal-broad-2',
    },
  },
  {
    id: 'q-veg-basal-broad-2',
    question: 'Does the plant form umbrella-like colonies on the forest floor?',
    a: {
      label: 'Yes - umbrella leaves in colonies',
      next: ['mayapple'],
    },
    b: {
      label: 'No - a shorter solitary woodland plant',
      next: ['bloodroot'],
    },
  },
  {
    id: 'q-veg-stem-leaves',
    question: 'Are the leaves very narrow and grasslike along a mostly unbranched stem?',
    a: {
      label: 'Yes - narrow grasslike stem leaves',
      next: ['prairie-blazingstar'],
    },
    b: {
      label: 'No - broader leaves or divided leaves',
      next: 'q-veg-compound-or-broad',
    },
  },
  {
    id: 'q-veg-compound-or-broad',
    question: 'Are the leaves divided into obvious leaflets or delicate segments?',
    a: {
      label: 'Yes - divided leaves',
      next: ['wild-columbine', 'jack-in-the-pulpit'],
    },
    b: {
      label: 'No - single broad leaves',
      next: 'q-veg-broad-stemmed',
    },
  },
  {
    id: 'q-veg-broad-stemmed',
    question: 'Are the leaves and stem very rough or hairy to the touch?',
    a: {
      label: 'Yes - rough or hairy plant',
      next: ['black-eyed-susan', 'eastern-purple-coneflower', 'new-england-aster'],
    },
    b: {
      label: 'No - smoother leaves or blue-green floodplain foliage',
      next: ['virginia-bluebells', 'great-blue-lobelia', 'cardinal-flower'],
    },
  },
];
