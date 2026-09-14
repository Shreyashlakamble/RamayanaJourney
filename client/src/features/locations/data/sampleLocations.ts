import type { Location } from '../../../types/location'

export const sampleLocations: Location[] = [
  {
    id: 'ayodhya',
    name: 'Ayodhya',
    slug: 'ayodhya',
    type: 'main',
    parentId: null,

    latitude: 26.7922,
    longitude: 82.1998,

    region: 'Northern India',
    state: 'Uttar Pradesh',
    country: 'India',

    shortDescription:
      'The sacred city associated with the birth and early life of Shri Ram.',

    description:
      'Ayodhya is one of the most important locations in the Ramayana Journey and serves as the starting point of the geographical narrative.',

    timelineOrder: 1,

    featured: true,
    active: true,
  },

{
  id: 'chitrakoot',
  name: 'Chitrakoot',
  slug: 'chitrakoot',
  type: 'main',
  parentId: null,

  latitude: 25.146,
  longitude: 80.865,

  region: 'Central India',
  state: 'Uttar Pradesh / Madhya Pradesh',
  country: 'India',

  shortDescription:
    'A forest region deeply connected with the exile period of Shri Ram.',

  description:
    'Chitrakoot occupies a central place in the geographical memory of the Ramayana and is associated with a significant period of Shri Ram, Sita and Lakshmana’s years of exile.',

  introduction:
    'Among the forest landscapes associated with the Ramayana, Chitrakoot stands out as a place of retreat, devotion and remembrance. The region brings together rivers, hills, caves and sacred spaces that continue to shape its living cultural landscape.',

  history:
    'The traditions surrounding Chitrakoot connect the region with the exile journey of Shri Ram, Sita and Lakshmana. Many places across the wider landscape preserve local memories, narratives and devotional traditions associated with this chapter of the Ramayana.',

  significance:
    'Chitrakoot represents a meeting point between landscape, memory and living tradition.',

  highlights: [
    'Ramghat and the Mandakini River',
    'Kamadgiri pilgrimage circuit',
    'Gupt Godavari caves',
    'Hanuman Dhara',
  ],

  timelineOrder: 2,

  featured: true,
  active: true,

  gallery: [
  '/images/hero/gallery-01.svg',
  '/images/hero/gallery-02.svg',
  '/images/hero/gallery-03.svg',
  '/images/hero/hero-placeholder.svg',
],
},

{
  id: 'ramghat',
  name: 'Ramghat',
  slug: 'ramghat',
  type: 'sub',
  parentId: 'chitrakoot',

  latitude: 25.2006,
  longitude: 80.8562,

  region: 'Chitrakoot',
  state: 'Uttar Pradesh',
  country: 'India',

  shortDescription:
    'A prominent riverside location associated with Chitrakoot.',

  description:
    'Ramghat lies along the Mandakini River and is one of the most prominent sacred spaces within the Chitrakoot landscape.',

  introduction:
    'The riverfront forms one of the defining landscapes of Chitrakoot, bringing together pilgrimage, ritual and everyday life.',

  history:
    'Local traditions associate the wider river landscape with the period of Shri Ram’s stay in Chitrakoot.',

  significance:
    'Ramghat demonstrates how the geographical memory of the Ramayana continues to exist within a living pilgrimage landscape.',

  highlights: [
    'Mandakini River',
    'Riverside pilgrimage',
    'Evening devotional traditions',
  ],

  timelineOrder: 3,

  active: true,

  gallery: [
  '/images/hero/gallery-02.svg',
  '/images/hero/gallery-03.svg',
  '/images/hero/hero-placeholder.svg',
],
},

{
  id: 'gupt-godavari',
  name: 'Gupt Godavari',
  slug: 'gupt-godavari',
  type: 'sub',
  parentId: 'chitrakoot',

  latitude: 25.155,
  longitude: 80.806,

  region: 'Chitrakoot',
  state: 'Madhya Pradesh',
  country: 'India',

  shortDescription:
    'A cave complex associated with the Ramayana traditions of Chitrakoot.',

  description:
    'Gupt Godavari is a dramatic cave landscape associated with the Ramayana traditions of the Chitrakoot region.',

  introduction:
    'The caves create one of the most distinctive natural environments within the Chitrakoot journey, where geology and sacred tradition meet.',

  history:
    'Local traditions connect the caves with episodes from the Ramayana and preserve a strong association with Shri Ram and Lakshmana.',

  significance:
    'Gupt Godavari demonstrates the way natural landscapes become part of remembered sacred geography.',

  highlights: [
    'Natural cave formations',
    'Water within the cave system',
    'Local Ramayana traditions',
  ],

  active: true,

  gallery: [
  '/images/hero/gallery-03.svg',
  '/images/hero/gallery-01.svg',
  '/images/hero/gallery-02.svg',
],
},

  {
    id: 'panchavati',
    name: 'Panchavati',
    slug: 'panchavati',
    type: 'main',
    parentId: null,

    latitude: 20.0059,
    longitude: 73.7905,

    region: 'Western India',
    state: 'Maharashtra',
    country: 'India',

    shortDescription:
      'A major forest setting associated with the exile period and events involving Sita.',

    timelineOrder: 5,

    featured: true,
    active: true,
  },

  {
    id: 'kala-ram-temple',
    name: 'Kala Ram Temple',
    slug: 'kala-ram-temple',
    type: 'sub',
    parentId: 'panchavati',

    latitude: 20.0068,
    longitude: 73.7919,

    region: 'Panchavati',
    state: 'Maharashtra',
    country: 'India',

    shortDescription:
      'A prominent cultural and devotional landmark in Panchavati.',

    active: true,
  },

  {
    id: 'kishkindha',
    name: 'Kishkindha',
    slug: 'kishkindha',
    type: 'main',
    parentId: null,

    latitude: 15.3347,
    longitude: 76.4608,

    region: 'Southern India',
    state: 'Karnataka',
    country: 'India',

    shortDescription:
      'The legendary region associated with Shri Ram, Hanuman and the Vanara kingdom.',

    timelineOrder: 6,

    featured: true,
    active: true,
  },

  {
    id: 'anjanadri',
    name: 'Anjanadri',
    slug: 'anjanadri',
    type: 'sub',
    parentId: 'kishkindha',

    latitude: 15.3323,
    longitude: 76.4763,

    region: 'Kishkindha',
    state: 'Karnataka',
    country: 'India',

    shortDescription:
      'A hill traditionally associated with the birth of Hanuman.',

    active: true,
  },

  {
    id: 'rameshwaram',
    name: 'Rameshwaram',
    slug: 'rameshwaram',
    type: 'main',
    parentId: null,

    latitude: 9.2876,
    longitude: 79.3129,

    region: 'Southern India',
    state: 'Tamil Nadu',
    country: 'India',

    shortDescription:
      'A major southern location associated with the journey toward Lanka.',

    timelineOrder: 7,

    featured: true,
    active: true,
  },
]