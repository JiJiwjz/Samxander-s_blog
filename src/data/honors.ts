import type { ImageMetadata } from 'astro'

import robocup2026 from '@/assets/robocup.avif'
import design3d2025 from '@/assets/honors/3d-design-2025.jpg'
import craic2025 from '@/assets/honors/craic-2025.png'
import cumcm2025 from '@/assets/honors/cumcm-2025.png'
import iscc2025 from '@/assets/honors/iscc-2025.png'
import marineVehicle2026 from '@/assets/honors/marine-vehicle-2026.jpeg'
import mcm2025 from '@/assets/honors/mcm-2025.png'
import mcm2026 from '@/assets/honors/mcm-2026.png'
import robocup2025 from '@/assets/honors/robocup-2025.png'
import rst2025 from '@/assets/honors/rst-2025.jpg'

export type HonorLevel = 'International' | 'National' | 'Provincial'
export type HonorCategory =
  | 'Robotics'
  | 'Mathematical Modeling'
  | 'Marine Engineering'
  | 'Aerospace Engineering'
  | 'Cybersecurity'

export interface Honor {
  slug: string
  title: string
  awards: string[]
  level: HonorLevel
  category: HonorCategory
  image: ImageMetadata
  imageAlt: string
  date?: string
}

export const honors: Honor[] = [
  {
    slug: 'robocup-china-2026',
    title: 'RoboCup China 2026',
    awards: [
      'National Champion, Dexterous Manipulation Challenge',
      'Runner-up, Rescue Group'
    ],
    level: 'National',
    category: 'Robotics',
    image: robocup2026,
    imageAlt: 'RoboCup rescue robot and championship trophies',
    date: 'May 2026'
  },
  {
    slug: 'mcm-2026',
    title: 'Mathematical Contest in Modeling 2026',
    awards: ['Honorable Mention'],
    level: 'International',
    category: 'Mathematical Modeling',
    image: mcm2026,
    imageAlt: '2026 Mathematical Contest in Modeling Honorable Mention certificate'
  },
  {
    slug: 'marine-vehicle-2026',
    title: '15th China Marine Vehicle Design and Construction Contest',
    awards: ['Second Prize, National'],
    level: 'National',
    category: 'Marine Engineering',
    image: marineVehicle2026,
    imageAlt: '15th China Marine Vehicle Design and Construction Contest certificate'
  },
  {
    slug: 'robocup-china-2025',
    title: '2025 China Robot Competition and RoboCup China Open',
    awards: ['Second Prize, National'],
    level: 'National',
    category: 'Robotics',
    image: robocup2025,
    imageAlt: '2025 China Robot Competition and RoboCup China Open certificate'
  },
  {
    slug: 'iscc-2025',
    title: '22nd National College Student Information Security and Countermeasures Contest',
    awards: ['Second Prize, National Finals'],
    level: 'National',
    category: 'Cybersecurity',
    image: iscc2025,
    imageAlt: '2025 Information Security and Countermeasures Contest certificate'
  },
  {
    slug: 'cumcm-2025',
    title: 'China Undergraduate Mathematical Contest in Modeling 2025',
    awards: ['First Prize, Shaanxi Division'],
    level: 'Provincial',
    category: 'Mathematical Modeling',
    image: cumcm2025,
    imageAlt: '2025 China Undergraduate Mathematical Contest in Modeling certificate'
  },
  {
    slug: 'national-3d-design-2025',
    title: '18th National 3D Digital Innovation Design Competition',
    awards: ['Special Prize, Shaanxi Division'],
    level: 'Provincial',
    category: 'Aerospace Engineering',
    image: design3d2025,
    imageAlt: '18th National 3D Digital Innovation Design Competition certificate'
  },
  {
    slug: 'rst-2025',
    title: '18th Advanced Robot and Simulation Technology Competition',
    awards: ['First Prize, National'],
    level: 'National',
    category: 'Robotics',
    image: rst2025,
    imageAlt: '18th Advanced Robot and Simulation Technology Competition certificate'
  },
  {
    slug: 'craic-2025',
    title: '27th China Robotics and Artificial Intelligence Competition',
    awards: ['Second Prize, National'],
    level: 'National',
    category: 'Robotics',
    image: craic2025,
    imageAlt: '27th China Robotics and Artificial Intelligence Competition certificate'
  },
  {
    slug: 'mcm-2025',
    title: 'Mathematical Contest in Modeling 2025',
    awards: ['Honorable Mention'],
    level: 'International',
    category: 'Mathematical Modeling',
    image: mcm2025,
    imageAlt: '2025 Mathematical Contest in Modeling Honorable Mention certificate'
  }
]

export const selectedHonors = honors.slice(0, 2)
