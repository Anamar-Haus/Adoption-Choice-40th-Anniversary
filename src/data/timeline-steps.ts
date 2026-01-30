export interface TimelineStep {
  id: string
  index: number
  title: string
  subtitle: string
  description: string
  bullets: string[]
  images: string[]
}

export const timelineSteps: TimelineStep[] = [
  {
    id: 'discover',
    index: 0,
    title: 'Discover',
    subtitle: 'Research & Analysis',
    description:
      'We begin by understanding your business, target audience, and competitive landscape through comprehensive research.',
    bullets: [
      'Stakeholder interviews',
      'Market research',
      'Competitive analysis',
      'User research',
    ],
    images: [
      'https://placehold.co/600x400/6366f1/ffffff?text=Discover+1',
      'https://placehold.co/600x400/818cf8/ffffff?text=Discover+2',
      'https://placehold.co/600x400/a5b4fc/1e1b4b?text=Discover+3',
    ],
  },
  {
    id: 'define',
    index: 1,
    title: 'Define',
    subtitle: 'Strategy & Planning',
    description:
      'Based on our findings, we define clear objectives, user personas, and project requirements.',
    bullets: [
      'Goal setting',
      'User personas',
      'Requirements documentation',
      'Project roadmap',
    ],
    images: [
      'https://placehold.co/600x400/ec4899/ffffff?text=Define+1',
      'https://placehold.co/600x400/f472b6/ffffff?text=Define+2',
      'https://placehold.co/600x400/f9a8d4/831843?text=Define+3',
    ],
  },
  {
    id: 'design',
    index: 2,
    title: 'Design',
    subtitle: 'Visual & UX Design',
    description:
      'Our design team creates wireframes, prototypes, and high-fidelity mockups that bring your vision to life.',
    bullets: [
      'Wireframing',
      'UI/UX design',
      'Prototyping',
      'Design system creation',
    ],
    images: [
      'https://placehold.co/600x400/f97316/ffffff?text=Design+1',
      'https://placehold.co/600x400/fb923c/ffffff?text=Design+2',
      'https://placehold.co/600x400/fdba74/7c2d12?text=Design+3',
    ],
  },
  {
    id: 'develop',
    index: 3,
    title: 'Develop',
    subtitle: 'Build & Integrate',
    description:
      'We transform designs into functional products using modern technologies and best practices.',
    bullets: [
      'Frontend development',
      'Backend integration',
      'Quality assurance',
      'Performance optimization',
    ],
    images: [
      'https://placehold.co/600x400/22c55e/ffffff?text=Develop+1',
      'https://placehold.co/600x400/4ade80/ffffff?text=Develop+2',
      'https://placehold.co/600x400/86efac/14532d?text=Develop+3',
    ],
  },
  {
    id: 'deliver',
    index: 4,
    title: 'Deliver',
    subtitle: 'Launch & Support',
    description:
      'We deploy your product, provide training, and offer ongoing support to ensure long-term success.',
    bullets: [
      'Deployment',
      'Training & documentation',
      'Monitoring setup',
      'Ongoing support',
    ],
    images: [
      'https://placehold.co/600x400/06b6d4/ffffff?text=Deliver+1',
      'https://placehold.co/600x400/22d3ee/ffffff?text=Deliver+2',
      'https://placehold.co/600x400/67e8f9/164e63?text=Deliver+3',
    ],
  },
]
