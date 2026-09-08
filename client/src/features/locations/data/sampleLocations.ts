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
      'Chitrakoot is an important chapter in the geographical journey of the Ramayana.',

    timelineOrder: 2,

    featured: true,
    active: true,
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

    timelineOrder: 3,

    active: true,
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

    timelineOrder: 4,

    active: true,
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