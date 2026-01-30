import { ScrollTimeline, type TimelineItem } from '@/components/timeline'
import { ChevronDown } from 'lucide-react'

const items: TimelineItem[] = [
  {
    id: '1986-founding',
    title: 'ACI Founded',
    description:
      'ACI was founded and operated by 2 women, with 2 part-time social workers, and a bookkeeper. They provided primarily domestic home studies for independent and agency situations along with post placement services.',
    meta: '1986',
    mediaSrc: 'https://placehold.co/600x400/1e3a5f/ffffff?text=1986',
  },
  {
    id: '1990-international',
    title: 'International Expansion',
    description:
      'Due to increased interest in foreign adoption, ACI began to work with international adoption more, particularly Guatemala and Paraguay.',
    meta: '1990',
    mediaSrc: 'https://placehold.co/600x400/2d4a6f/ffffff?text=1990',
  },
  {
    id: '1993-growth',
    title: '50 Placements Per Year',
    description:
      'Adoption Choice was seeing 50 placements a year with about 1/3 being foreign adoptions.',
    meta: '1993',
    mediaSrc: 'https://placehold.co/600x400/3d5a7f/ffffff?text=1993',
  },
  {
    id: '1996-nonprofit',
    title: 'Non-Profit Status',
    description: 'Adoption Choice received its Certificate of Incorporation and Non-Profit Status.',
    meta: '1996',
    mediaSrc: 'https://placehold.co/600x400/4d6a8f/ffffff?text=1996',
  },
  {
    id: '1997-international-majority',
    title: '80% International Adoptions',
    description:
      'Over 80% of the adoptions were international from countries including Guatemala, Romania, Vietnam, Chile and Latin America.',
    meta: '1997',
    mediaSrc: 'https://placehold.co/600x400/5d7a9f/ffffff?text=1997',
  },
  {
    id: '2000-new-countries',
    title: 'New Countries Added',
    description:
      'Ukraine, Bulgaria, China and Poland were added to the list of countries available for ACI families.',
    meta: '2000',
    mediaSrc: 'https://placehold.co/600x400/6d8aaf/ffffff?text=2000',
  },
  {
    id: '2003-russia',
    title: 'Russia Program Begins',
    description: 'Families at Adoption Choice began adopting from Russia.',
    meta: '2003',
    mediaSrc: 'https://placehold.co/600x400/7d9abf/1e3a5f?text=2003',
  },
  {
    id: '2009-partnership',
    title: 'Community Adoption Center Partnership',
    description:
      'ACI formed a relationship with another adoption agency located in NE Wisconsin. The partnership with Community Adoption Center allowed the domestic program to grow in service area and size.',
    meta: '2009',
    mediaSrc: 'https://placehold.co/600x400/8daacf/1e3a5f?text=2009',
  },
  {
    id: '2010-merger',
    title: 'Adoption Advocates Merger',
    description:
      'Adoption Advocates, a Wisconsin adoption agency located in the Madison area merged with ACI.',
    meta: '2010',
    mediaSrc: 'https://placehold.co/600x400/9dbadf/1e3a5f?text=2010',
  },
  {
    id: '2011-central-wi',
    title: 'Central Wisconsin Expansion',
    description: 'ACI enhanced its services by adding staff in Central Wisconsin.',
    meta: '2011',
    mediaSrc: 'https://placehold.co/600x400/adcaef/1e3a5f?text=2011',
  },
  {
    id: '2013-cac-merger',
    title: 'Statewide Coverage',
    description:
      'Adoption Choice, Inc. merged with Community Adoption Center, Inc. allowing the agency to provide services to all of Wisconsin under one organization.',
    meta: '2013',
    mediaSrc: 'https://placehold.co/600x400/3b82f6/ffffff?text=2013',
  },
  {
    id: '2013-embryo',
    title: 'Embryo Adoption Program',
    description: 'Embryo Adoption was added as an option to adoptive families.',
    meta: '2013',
    mediaSrc: 'https://placehold.co/600x400/6366f1/ffffff?text=2013',
  },
  {
    id: '2014-foster-care',
    title: 'Foster Care Adoption Program',
    description: 'ACI formed its Foster Care Adoption Program.',
    meta: '2014',
    mediaSrc: 'https://placehold.co/600x400/8b5cf6/ffffff?text=2014',
  },
  {
    id: '2016-grants',
    title: 'Scholarship & Support Funds',
    description:
      'Through a grant from The Heart of Canal Program, the Birth Parent Scholarship and Sliding Fee Funds were established.',
    meta: '2016',
    mediaSrc: 'https://placehold.co/600x400/a855f7/ffffff?text=2016',
  },
  {
    id: '2019-digital',
    title: 'Digital Expansion',
    description: 'ACI expanded its digital footprint by focusing on online advertising.',
    meta: '2019',
    mediaSrc: 'https://placehold.co/600x400/d946ef/ffffff?text=2019',
  },
  {
    id: '2019-fundraiser',
    title: 'First Touched by Adoption Event',
    description: 'The first Touched by Adoption fundraising event was held in Green Bay.',
    meta: '2019',
    mediaSrc: 'https://placehold.co/600x400/ec4899/ffffff?text=2019',
  },
  {
    id: '2019-picnic',
    title: 'First Annual Family Picnic',
    description: 'ACI held its first Annual Family Picnic.',
    meta: '2019',
    mediaSrc: 'https://placehold.co/600x400/f43f5e/ffffff?text=2019',
  },
  {
    id: '2021-support-group',
    title: 'Waiting Families Support Group',
    description:
      'In an effort to support adoptive families, the Waiting Families Support Group was started.',
    meta: '2021',
    mediaSrc: 'https://placehold.co/600x400/f97316/ffffff?text=2021',
  },
  {
    id: '2023-mad-cares',
    title: 'MAD Cares Program',
    description:
      'ACI selected as a beneficiary organization to participate in MAD Cares program through MLG Capital.',
    meta: '2023',
    mediaSrc: 'https://placehold.co/600x400/eab308/ffffff?text=2023',
  },
  {
    id: '2024-sw-wisconsin',
    title: 'Southwestern Wisconsin Expansion',
    description: 'ACI enhanced its services by adding staff in Southwestern Wisconsin.',
    meta: '2024',
    mediaSrc: 'https://placehold.co/600x400/84cc16/ffffff?text=2024',
  },
  {
    id: '2024-development',
    title: 'Development Director Hired',
    description: 'ACI hired a Development Director to focus on fundraising.',
    meta: '2024',
    mediaSrc: 'https://placehold.co/600x400/22c55e/ffffff?text=2024',
  },
  {
    id: '2024-past',
    title: 'P.A.S.T. Program Launched',
    description: 'ACI formed its P.A.S.T. (Post Adoption Support Team) and began offering events.',
    meta: '2024',
    mediaSrc: 'https://placehold.co/600x400/14b8a6/ffffff?text=2024',
  },
  {
    id: '2025-eau-claire',
    title: 'Eau Claire Office Opens',
    description: 'ACI opened a 4th office in Eau Claire.',
    meta: '2025',
    mediaSrc: 'https://placehold.co/600x400/06b6d4/ffffff?text=2025',
  },
  {
    id: '2025-fall-fest',
    title: 'First Fall Fest Event',
    description: 'ACI held its first Fall Fest event for families.',
    meta: '2025',
    mediaSrc: 'https://placehold.co/600x400/0ea5e9/ffffff?text=2025',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f5f5f4' }}>
      {/* Hero section */}
      <section className="h-screen flex items-center justify-center relative">
        <div className="text-center px-4">
          <a href="https://www.adoptionchoiceinc.org" target="_blank" rel="noopener noreferrer">
            <img
              src="/logo.svg"
              alt="Adoption Choice Inc."
              className="w-48 lg:w-64 h-auto mx-auto mb-8 hover:opacity-80 transition-opacity"
            />
          </a>
          <h1 className="text-5xl lg:text-7xl font-bold mb-4 text-foreground">Our History</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto">
            Nearly 40 years of connecting families through adoption in Wisconsin
          </p>
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 mx-auto text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Scroll-driven timeline */}
      <ScrollTimeline items={items} sectionVh={100} layout="twoCol" railAlign="center" />

      {/* Footer section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
        {/* Gradient background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at top left, #759845 0%, transparent 50%), radial-gradient(ellipse at bottom right, #672542 0%, transparent 50%)',
          }}
        />

        {/* Watermark logo */}
        <img
          src="/logo-notext.svg"
          alt=""
          className="absolute opacity-5 w-[600px] h-[600px] pointer-events-none"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />

        <div className="text-center px-4 relative z-10 max-w-4xl mx-auto">
          {/* Main heading */}
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Building Families Since 1986
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-lg mx-auto">
            Join us in our mission to connect children with loving families across Wisconsin.
          </p>

          {/* Impact statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <span className="text-4xl lg:text-5xl font-bold" style={{ color: '#759845' }}>
                39+
              </span>
              <span className="text-sm text-muted-foreground mt-1">Years of Service</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl lg:text-5xl font-bold" style={{ color: '#672542' }}>
                1000+
              </span>
              <span className="text-sm text-muted-foreground mt-1">Families Served</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl lg:text-5xl font-bold" style={{ color: '#759845' }}>
                4
              </span>
              <span className="text-sm text-muted-foreground mt-1">Office Locations</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl lg:text-5xl font-bold" style={{ color: '#672542' }}>
                72
              </span>
              <span className="text-sm text-muted-foreground mt-1">Wisconsin Counties</span>
            </div>
          </div>

          {/* CTA buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="px-8 py-3 rounded-full font-medium text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#672542' }}
            >
              Contact Us
            </button>
            <button
              className="px-8 py-3 rounded-full font-medium text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#759845' }}
            >
              Support Our Mission
            </button>
            <button
              className="px-8 py-3 rounded-full font-medium border-2 transition-all hover:scale-105"
              style={{ borderColor: '#672542', color: '#672542' }}
            >
              Our Services
            </button>
          </div> */}

          {/* Office locations */}
          {/* <div className="mt-16 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">Serving families from our offices in:</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-foreground">
              <span>Green Bay</span>
              <span className="text-muted-foreground">•</span>
              <span>Madison</span>
              <span className="text-muted-foreground">•</span>
              <span>Central Wisconsin</span>
              <span className="text-muted-foreground">•</span>
              <span>Eau Claire</span>
            </div>
          </div> */}
        </div>
      </section>
    </main>
  )
}
