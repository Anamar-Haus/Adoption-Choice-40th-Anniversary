import { ScrollTimeline, type TimelineItem } from '@/components/timeline'
import { FadeInText } from '@/components/fade-in-text'
import { SimpleFadeIn } from '@/components/simple-fade-in'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

const items: TimelineItem[] = [
  {
    id: '1986-founding',
    title: 'ACI Founded',
    description:
      'ACI was founded and operated by 2 women, with 2 part-time social workers, and a bookkeeper. They provided primarily domestic home studies for independent and agency situations along with post placement services.',
    meta: '1986',
    mediaSrc: 'https://placehold.co/600x400/789051/ffffff?text=1986',
  },
  {
    id: '1990-international',
    title: 'International Expansion',
    description:
      'Due to increased interest in foreign adoption, ACI began to work with international adoption more, particularly Guatemala and Paraguay.',
    meta: '1990',
    mediaSrc: 'https://placehold.co/600x400/7a9454/ffffff?text=1990',
  },
  {
    id: '1993-growth',
    title: '50 Placements Per Year',
    description:
      'Adoption Choice was seeing 50 placements a year with about 1/3 being foreign adoptions.',
    meta: '1993',
    mediaSrc: 'https://placehold.co/600x400/7c9857/ffffff?text=1993',
  },
  {
    id: '1996-nonprofit',
    title: 'Non-Profit Status',
    description: 'Adoption Choice received its Certificate of Incorporation and Non-Profit Status.',
    meta: '1996',
    mediaSrc: 'https://placehold.co/600x400/8a9a62/ffffff?text=1996',
  },
  {
    id: '1997-international-majority',
    title: '80% International Adoptions',
    description:
      'Over 80% of the adoptions were international from countries including Guatemala, Romania, Vietnam, Chile and Latin America.',
    meta: '1997',
    mediaSrc: 'https://placehold.co/600x400/9a9a72/ffffff?text=1997',
  },
  {
    id: '2000-new-countries',
    title: 'New Countries Added',
    description:
      'Ukraine, Bulgaria, China and Poland were added to the list of countries available for ACI families.',
    meta: '2000',
    mediaSrc: 'https://placehold.co/600x400/b08a80/ffffff?text=2000',
  },
  {
    id: '2003-russia',
    title: 'Russia Program Begins',
    description: 'Families at Adoption Choice began adopting from Russia.',
    meta: '2003',
    mediaSrc: 'https://placehold.co/600x400/c07a8a/ffffff?text=2003',
  },
  {
    id: '2009-partnership',
    title: 'Community Adoption Center Partnership',
    description:
      'ACI formed a relationship with another adoption agency located in NE Wisconsin. The partnership with Community Adoption Center allowed the domestic program to grow in service area and size.',
    meta: '2009',
    mediaSrc: 'https://placehold.co/600x400/d06a94/ffffff?text=2009',
  },
  {
    id: '2010-merger',
    title: 'Adoption Advocates Merger',
    description:
      'Adoption Advocates, a Wisconsin adoption agency located in the Madison area merged with ACI.',
    meta: '2010',
    mediaSrc: 'https://placehold.co/600x400/d55a9a/ffffff?text=2010',
  },
  {
    id: '2011-central-wi',
    title: 'Central Wisconsin Expansion',
    description: 'ACI enhanced its services by adding staff in Central Wisconsin.',
    meta: '2011',
    mediaSrc: 'https://placehold.co/600x400/d84a9c/ffffff?text=2011',
  },
  // {
  //   id: '2013-cac-merger',
  //   title: 'Statewide Coverage',
  //   description:
  //     'Adoption Choice, Inc. merged with Community Adoption Center, Inc. allowing the agency to provide services to all of Wisconsin under one organization.',
  //   meta: '2013',
  //   mediaSrc: 'https://placehold.co/600x400/3b82f6/ffffff?text=2013',
  // },
  {
    id: '2013-embryo',
    title: 'Embryo Adoption Program',
    description: 'Embryo Adoption was added as an option to adoptive families.',
    meta: '2013',
    mediaSrc: 'https://placehold.co/600x400/d04098/ffffff?text=2013',
  },
  {
    id: '2014-foster-care',
    title: 'Foster Care Adoption Program',
    description: 'ACI formed its Foster Care Adoption Program.',
    meta: '2014',
    mediaSrc: 'https://placehold.co/600x400/c83894/ffffff?text=2014',
  },
  {
    id: '2016-grants',
    title: 'Scholarship & Support Funds',
    description:
      'Through a grant from The Heart of Canal Program, the Birth Parent Scholarship and Sliding Fee Funds were established.',
    meta: '2016',
    mediaSrc: 'https://placehold.co/600x400/c03490/ffffff?text=2016',
  },
  {
    id: '2019-digital',
    title: 'Digital Expansion',
    description: 'ACI expanded its digital footprint by focusing on online advertising.',
    meta: '2019',
    mediaSrc: 'https://placehold.co/600x400/b8308c/ffffff?text=2019',
  },
  {
    id: '2019-fundraiser',
    title: 'First Touched by Adoption Event',
    description: 'The first Touched by Adoption fundraising event was held in Green Bay.',
    meta: '2019',
    mediaSrc: 'https://placehold.co/600x400/b02e8a/ffffff?text=2019',
  },
  {
    id: '2019-picnic',
    title: 'First Annual Family Picnic',
    description: 'ACI held its first Annual Family Picnic.',
    meta: '2019',
    mediaSrc: 'https://placehold.co/600x400/aa2e88/ffffff?text=2019',
  },
  {
    id: '2021-support-group',
    title: 'Waiting Families Support Group',
    description:
      'In an effort to support adoptive families, the Waiting Families Support Group was started.',
    meta: '2021',
    mediaSrc: 'https://placehold.co/600x400/942d7e/ffffff?text=2021',
  },
  {
    id: '2023-mad-cares',
    title: 'MAD Cares Program',
    description:
      'ACI selected as a beneficiary organization to participate in MAD Cares program through MLG Capital.',
    meta: '2023',
    mediaSrc: 'https://placehold.co/600x400/9a2d80/ffffff?text=2023',
  },
  {
    id: '2024-sw-wisconsin',
    title: 'Southwestern Wisconsin Expansion',
    description: 'ACI enhanced its services by adding staff in Southwestern Wisconsin.',
    meta: '2024',
    mediaSrc: 'https://placehold.co/600x400/9e2d82/ffffff?text=2024',
  },
  {
    id: '2024-development',
    title: 'Development Director Hired',
    description: 'ACI hired a Development Director to focus on fundraising.',
    meta: '2024',
    mediaSrc: 'https://placehold.co/600x400/a02d83/ffffff?text=2024',
  },
  {
    id: '2024-past',
    title: 'P.A.S.T. Program Launched',
    description: 'ACI formed its P.A.S.T. (Post Adoption Support Team) and began offering events.',
    meta: '2024',
    mediaSrc: 'https://placehold.co/600x400/a12d83/ffffff?text=2024',
  },
  {
    id: '2025-eau-claire',
    title: 'Eau Claire Office Opens',
    description: 'ACI opened a 4th office in Eau Claire.',
    meta: '2025',
    mediaSrc: 'https://placehold.co/600x400/a22d84/ffffff?text=2025',
  },
  {
    id: '2025-fall-fest',
    title: 'First Fall Fest Event',
    description: 'ACI held its first Fall Fest event for families.',
    meta: '2025',
    mediaSrc: 'https://placehold.co/600x400/a32d84/ffffff?text=2025',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f5f5f4' }}>
      {/* 40th Anniversary Logo Section */}

      <section className="w-full max-w-7xl mx-auto px-6 py-16 relative overflow-hidden">
        {/* Background watermark logos */}
        <div
          className="absolute pointer-events-none select-none opacity-[0.04] w-[350px] h-[350px]"
          style={{ top: '50%', left: '55%' }}
        >
          <Image src="/logo-notext.svg" alt="" fill className="object-contain" aria-hidden="true" />
        </div>
        <div
          className="absolute pointer-events-none select-none opacity-[0.04] w-[500px] h-[500px]"
          style={{ bottom: '10%', right: '60%' }}
        >
          <Image src="/logo-notext.svg" alt="" fill className="object-contain" aria-hidden="true" />
        </div>

        {/* Mobile logo */}
        <Image
          src="/40-logo-short.svg"
          alt="Celebrating 40 Years"
          width={800}
          height={400}
          className="w-full h-auto relative z-10 md:hidden"
        />
        {/* Desktop logo */}
        <Image
          src="/40-logo.svg"
          alt="Celebrating 40 Years"
          width={1920}
          height={400}
          className="w-full h-auto relative z-10 hidden md:block"
        />

        {/* Tagline */}
        <p className="text-center md:text-4xl text-2xl  text-[#789051]/60 mt-16 mb-16 tracking-wide font-bold">
          Hope. Heart. Home.
        </p>

        {/* Staggered fade-in text sections */}
        <div className="space-y-24 max-w-4xl mx-auto">
          <FadeInText>
            <p className="text-2xl text-black leading-relaxed text-center">
              For 40 years, Adoption Choice, Inc. has walked alongside children, birth parents, and adoptive families with one purpose: building loving families through adoption.
            </p>
          </FadeInText>

          <FadeInText>
            <p className="text-2xl text-black leading-relaxed text-center">
              As adoption counselors, social workers, and advocates, we have seen how hope takes root, how heart carries families through uncertainty, and how home becomes more than a place. It becomes a promise.
            </p>
          </FadeInText>

          <FadeInText>
            <p className="text-2xl text-black leading-relaxed text-center">
              This year, we are honoring our 40th anniversary by celebrating 40 years of adoption through 40 meaningful highlights, each one reflecting the care, trust, and community behind every adoption journey.
            </p>
          </FadeInText>

          <FadeInText>
            <p className="text-2xl text-black leading-relaxed text-center">
              To honor our 40th year, we are inviting our community to help us reach one shared goal:
            </p>
          </FadeInText>

          <FadeInText>
            <p className="text-2xl text-black leading-relaxed text-center font-semibold">
              40 new donors supporting the next generation of adoption journeys.
            </p>
          </FadeInText>

          <FadeInText>
            <div className="text-center bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2" style={{ borderColor: '#789051' }}>
              <p className="text-3xl text-[#a32d84] leading-relaxed mb-8 font-extrabold">
                Your Donation Directly Supports:
              </p>
              <ul className="text-base md:text-xl text-black leading-relaxed space-y-3">
                <li>Adoption counseling and education</li>
                <li>Ethical adoption services focused on child wellbeing</li>
                <li>Birth parent support and resources</li>
                <li>Pre- and post-adoption guidance for families</li>
              </ul>
            </div>
          </FadeInText>

          <FadeInText>
            <p className="text-2xl text-black leading-relaxed text-center">
              Every gift, no matter the size, helps turn hope into heart and heart into home.
            </p>
          </FadeInText>


          <SimpleFadeIn className="text-center mt-60">
            <h2 className="text-4xl font-bold text-black mb-8">
              Help Us Build The Next 40 Years
            </h2>
            <a
              href="https://adoptionchoice.app.neoncrm.com/campaigns/40th-anniversary"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 text-xl font-semibold text-white rounded-full transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#a32d84' }}
            >
              Donate Today
            </a>
          </SimpleFadeIn>
          <div className="animate-bounce" aria-hidden="true">
            <ChevronDown className="w-8 h-8 mx-auto text-muted-foreground" />
          </div>
        </div>
      </section>


      {/* Hero section */}


      <section className="h-screen flex items-center justify-center relative">
        <div className="text-center px-4">
          <a
            href="https://www.adoptionchoiceinc.org"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-48 lg:w-64 h-auto mx-auto mb-8 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.svg"
              alt="Adoption Choice Inc."
              width={256}
              height={256}
              className="w-full h-auto"
              priority
            />
          </a>
          <h1 className="text-5xl lg:text-7xl font-bold mb-4 text-foreground">Our History</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto">
            40 years of connecting families through adoption in Wisconsin
          </p>
          <div className="animate-bounce" aria-hidden="true">
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
        <div
          className="select-none absolute opacity-5 w-150 h-150 pointer-events-none"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <Image src="/logo-notext.svg" alt="" fill className="object-contain" aria-hidden="true" />
        </div>

        <div className="select-none text-center px-4 relative z-10 max-w-4xl mx-auto">
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
