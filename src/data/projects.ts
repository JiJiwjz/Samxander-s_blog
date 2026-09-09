import type { ImageMetadata } from 'astro'

import firaSoccerRobotPhoto from '@/assets/fira-soccer-robot.avif'
import lingshuIntelligentControlPhoto from '@/assets/lingshu-intelligent-control.avif'
import lunarRobotPhoto from '@/assets/lunar-robot.avif'
import rescuePhoto from '@/assets/rescue.avif'

export interface ProjectLink {
  label: string
  href: string
  icon: 'earth' | 'github'
}

export interface Project {
  slug: string
  title: string
  badge?: string
  image: ImageMetadata
  imageAlt: string
  paragraphs: string[]
  links: ProjectLink[]
}

export const projects: Project[] = [
  {
    slug: 'rescue-team',
    title: 'Rescue Team - NPU Dancing Robot Base',
    image: rescuePhoto,
    imageAlt: 'NPU Dancing Robot Base Rescue Team',
    paragraphs: [
      'Mission: Locate and mark victims distributed across a simulated disaster environment.',
      'I am primarily responsible for manipulator software control. I developed MoveIt-based semi-autonomous arm control and implemented fully autonomous grasping through pose estimation, visual servoing, and inverse kinematics.'
    ],
    links: [
      {
        label: 'Dancing Robot Base Website',
        href: 'https://dance-robot-base.github.io/',
        icon: 'earth'
      }
    ]
  },
  {
    slug: 'lunar-robot',
    title: 'Lunar Robot - Intelligent Unmanned Base',
    badge: 'Team Leader',
    image: lunarRobotPhoto,
    imageAlt: 'Lunar Robot Team Leader - Intelligent Unmanned Base',
    paragraphs: [
      'Mission: Autonomously navigate, identify minerals, and perform robotic-arm sampling tasks in a simulated lunar environment.',
      'My responsibilities included building the vision pipeline, autonomous navigation, and robotic-arm grasping.'
    ],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/JiJiwjz/Intelligent-Unmanned-Base',
        icon: 'github'
      }
    ]
  },
  {
    slug: 'fira-5v5-soccer-robot',
    title: 'FIRA 5v5 Soccer Robot',
    badge: 'Team Leader',
    image: firaSoccerRobotPhoto,
    imageAlt: 'FIRA 5v5 Soccer Robot',
    paragraphs: [
      'Mission: Coordinate five soccer robots in a match through vision calibration, color-based recognition, serial communication, and low-level control.',
      'My work: Optimized the vision calibration pipeline and multi-robot coordination algorithms.',
      'Result: Second Prize.'
    ],
    links: []
  },
  {
    slug: 'lingshu-intelligent-control',
    title: 'Lingshu Intelligent Control',
    image: lingshuIntelligentControlPhoto,
    imageAlt: 'Lingshu Intelligent Control',
    paragraphs: [
      'Project Lead, NPU Peak Experience Program.',
      'Under the supervision of Prof. Bin Zhao.'
    ],
    links: [
      {
        label: 'Prof. Bin Zhao',
        href: 'https://teacher.nwpu.edu.cn/binzhao.html',
        icon: 'earth'
      }
    ]
  }
]
