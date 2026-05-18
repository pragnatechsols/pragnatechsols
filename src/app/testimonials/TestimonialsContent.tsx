'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  BoltIcon,
  FireIcon,
  SunIcon,
  BuildingOfficeIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  StarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { CircuitPattern, FloatingParticles, GlowingLine } from '@/components/decorations/CircuitPatterns';

const successStories = [
  {
    id: 1,
    title: 'Industrial Complex Electrical Overhaul',
    client: 'ABC Manufacturing Ltd.',
    category: 'Electrical',
    icon: <BoltIcon className="w-6 h-6" />,
    image: '/projects/industrial.jpg',
    problem: 'The client was facing frequent power outages and inefficient energy distribution across their 50,000 sq ft manufacturing facility, leading to production losses.',
    solution: 'We designed and implemented a complete HT/LT electrical infrastructure overhaul including new substations, smart distribution panels, and energy monitoring systems.',
    result: '40% reduction in energy costs, zero unplanned outages in the past 2 years, and improved production efficiency.',
    stats: [
      { label: 'Energy Savings', value: '40%' },
      { label: 'Facility Size', value: '50,000 sq ft' },
      { label: 'Completion Time', value: '4 months' },
    ],
    testimonial: {
      text: 'Pragna Techsols transformed our electrical infrastructure completely. Their expertise and professionalism exceeded our expectations.',
      author: 'Rajesh Kumar',
      role: 'Plant Manager',
    },
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    id: 2,
    title: 'Hospital Fire Safety System',
    client: 'City General Hospital',
    category: 'Fire & Safety',
    icon: <FireIcon className="w-6 h-6" />,
    image: '/projects/hospital.jpg',
    problem: 'The hospital needed a comprehensive fire safety upgrade to meet new regulatory standards and ensure patient safety across all 8 floors.',
    solution: 'We installed state-of-the-art fire detection systems, sprinklers, hydrants, and emergency evacuation systems with centralized monitoring.',
    result: 'Full regulatory compliance achieved, enhanced patient safety, and successful certification from the Fire Department.',
    stats: [
      { label: 'Floors Covered', value: '8' },
      { label: 'Detection Points', value: '500+' },
      { label: 'Response Time', value: '<30 sec' },
    ],
    testimonial: {
      text: 'The fire safety system installed by Pragna Techsols gives us complete peace of mind. Their attention to detail is remarkable.',
      author: 'Dr. Priya Sharma',
      role: 'Hospital Director',
    },
    gradient: 'from-red-400 to-orange-500',
  },
  {
    id: 3,
    title: 'Solar Power Installation',
    client: 'Tech Park Developers',
    category: 'Solar Projects',
    icon: <SunIcon className="w-6 h-6" />,
    image: '/projects/solar.jpg',
    problem: 'The client wanted to reduce their carbon footprint and electricity costs for their IT park campus with sustainable energy solutions.',
    solution: 'We designed and installed a 500 kW rooftop solar system with net metering, battery backup, and smart monitoring dashboard.',
    result: '60% reduction in grid dependency, annual savings of ₹45 lakhs, and significant contribution to green energy goals.',
    stats: [
      { label: 'Capacity', value: '500 kW' },
      { label: 'Annual Savings', value: '₹45L' },
      { label: 'CO2 Reduced', value: '400 tons/yr' },
    ],
    testimonial: {
      text: 'Switching to solar with Pragna was the best decision. The ROI has been excellent and their maintenance support is outstanding.',
      author: 'Venkat Rao',
      role: 'Facilities Director',
    },
    gradient: 'from-amber-400 to-yellow-500',
  },
  {
    id: 4,
    title: 'Commercial Complex HVAC System',
    client: 'Sunrise Mall',
    category: 'HVAC',
    icon: <BuildingStorefrontIcon className="w-6 h-6" />,
    image: '/projects/mall.jpg',
    problem: 'Inconsistent temperature control and high energy bills were affecting tenant satisfaction and operational costs.',
    solution: 'We installed a centralized VRF system with zone-based controls, air quality monitoring, and smart scheduling.',
    result: '35% energy savings, consistent comfort across all zones, and improved indoor air quality scores.',
    stats: [
      { label: 'Energy Savings', value: '35%' },
      { label: 'Zones', value: '120+' },
      { label: 'AQI Improvement', value: '50%' },
    ],
    testimonial: {
      text: 'Our tenants are much happier with the new HVAC system. The energy savings have been a pleasant bonus.',
      author: 'Anitha Reddy',
      role: 'Property Manager',
    },
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    id: 5,
    title: 'Residential Township MEP',
    client: 'Green Valley Residences',
    category: 'Complete MEP',
    icon: <HomeIcon className="w-6 h-6" />,
    image: '/projects/residential.jpg',
    problem: 'New residential township of 200+ units needed complete MEP services from design to execution with strict timelines.',
    solution: 'We provided end-to-end MEP consultancy and execution including electrical, plumbing, fire safety, and HVAC for all units.',
    result: 'On-time delivery, zero quality issues during handover, and excellent feedback from residents.',
    stats: [
      { label: 'Units', value: '200+' },
      { label: 'On-time Delivery', value: '100%' },
      { label: 'Customer Rating', value: '4.9/5' },
    ],
    testimonial: {
      text: 'Pragna Techsols handled the entire MEP scope flawlessly. Their coordination and project management skills are exceptional.',
      author: 'Suresh Babu',
      role: 'Project Developer',
    },
    gradient: 'from-green-400 to-teal-500',
  },
  {
    id: 6,
    title: 'Corporate Office Retrofit',
    client: 'Fintech Solutions Pvt Ltd',
    category: 'Retrofit',
    icon: <BuildingOfficeIcon className="w-6 h-6" />,
    image: '/projects/corporate.jpg',
    problem: 'Aging building infrastructure needed modernization without disrupting daily operations of 500+ employees.',
    solution: 'We executed phased retrofitting of electrical systems, lighting upgrades to LED, and smart building automation.',
    result: '45% energy reduction, modern workplace environment, and seamless transition with minimal disruption.',
    stats: [
      { label: 'Energy Reduction', value: '45%' },
      { label: 'Employees', value: '500+' },
      { label: 'Downtime', value: 'Zero' },
    ],
    testimonial: {
      text: "The retrofit was done so smoothly that our employees barely noticed. The new systems are fantastic.",
      author: 'Meera Joshi',
      role: 'Admin Head',
    },
    gradient: 'from-indigo-400 to-purple-500',
  },
];

const clientTestimonials = [
  {
    name: 'Prakash Reddy',
    role: 'CEO, Reddy Industries',
    text: 'Working with Pragna Techsols has been a game-changer for our manufacturing facilities. Their expertise in electrical systems is unmatched.',
    rating: 5,
  },
  {
    name: 'Lakshmi Devi',
    role: 'Hospital Administrator',
    text: 'Their fire safety solutions gave us complete peace of mind. The team was professional and delivered beyond expectations.',
    rating: 5,
  },
  {
    name: 'Mohammed Rafi',
    role: 'Construction Manager',
    text: 'Pragna has been our go-to MEPF partner for 5+ years. Reliable, skilled, and always on time.',
    rating: 5,
  },
  {
    name: 'Srinivas Rao',
    role: 'IT Park Director',
    text: 'The solar installation was seamless. Great ROI and excellent ongoing support.',
    rating: 5,
  },
];

function StoryCard({ story, index }: { story: typeof successStories[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative grid lg:grid-cols-2 gap-8 items-center ${
        index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
      }`}
    >
      {/* Content */}
      <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${story.gradient} rounded-xl flex items-center justify-center`}>
            <div className="text-white">{story.icon}</div>
          </div>
          <div>
            <span className="text-sm text-yellow-400 font-medium">{story.category}</span>
            <h3 className="text-xl font-bold text-white">{story.title}</h3>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4">Client: {story.client}</p>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h4 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              The Challenge
            </h4>
            <p className="text-gray-400 text-sm">{story.problem}</p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h4 className="text-blue-400 font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Our Solution
            </h4>
            <p className="text-gray-400 text-sm">{story.solution}</p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h4 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              The Result
            </h4>
            <p className="text-gray-400 text-sm">{story.result}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {story.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-yellow-400">{stat.value}</div>
              <div className="text-gray-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Card */}
      <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-8 border border-slate-700 overflow-hidden"
        >
          {/* Quote mark */}
          <div className="absolute top-4 right-4 text-6xl text-yellow-500/10 font-serif">"</div>

          <div className="relative">
            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
              ))}
            </div>

            <p className="text-gray-300 italic mb-6 leading-relaxed">
              "{story.testimonial.text}"
            </p>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {story.testimonial.author.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-white">{story.testimonial.author}</div>
                <div className="text-gray-500 text-sm">{story.testimonial.role}</div>
              </div>
            </div>
          </div>

          {/* Decorative gradient */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${story.gradient}`} />
        </motion.div>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof clientTestimonials[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-yellow-500/30 transition-all duration-300"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
        ))}
      </div>

      <p className="text-gray-400 text-sm mb-4 leading-relaxed">"{testimonial.text}"</p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
          <span className="text-slate-900 font-bold">{testimonial.name.charAt(0)}</span>
        </div>
        <div>
          <div className="font-medium text-white text-sm">{testimonial.name}</div>
          <div className="text-gray-500 text-xs">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950" />
        <CircuitPattern className="opacity-30" />
        <FloatingParticles count={15} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-medium mb-4">
              Success Stories
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Trusted by <span className="gradient-text">Industry Leaders</span>
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Discover how we've helped businesses across various sectors achieve their engineering goals
              with innovative solutions and exceptional service.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">500+</div>
              <div className="text-gray-400 text-sm">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">100+</div>
              <div className="text-gray-400 text-sm">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">98%</div>
              <div className="text-gray-400 text-sm">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">15+</div>
              <div className="text-gray-400 text-sm">Years Experience</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Projects</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real challenges, innovative solutions, and measurable results.
            </p>
          </div>

          <div className="space-y-20">
            {successStories.map((story, index) => (
              <div key={story.id}>
                <StoryCard story={story} index={index} />
                {index < successStories.length - 1 && (
                  <GlowingLine className="my-16" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium mb-4">
              Client Testimonials
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">What Our Clients Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Don't just take our word for it — hear from our satisfied clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientTestimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-slate-700 mt-2">
                Let's discuss how we can help you achieve your engineering goals.
              </p>
            </div>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300"
            >
              Start Your Project
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
