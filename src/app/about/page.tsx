import { Metadata } from 'next';
import {
  ShieldCheckIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  HomeIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About Us | Pragna Techsols',
  description: 'Learn about Pragna Techsols - Your trusted partner for MEPF consultancy and engineering services with over 15 years of expertise.',
};

const founders = [
  {
    name: 'Founder Name 1',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    description: 'With over 20 years of experience in the MEPF industry, leading Pragna Techsols to deliver excellence.',
  },
  {
    name: 'Founder Name 2',
    role: 'Co-Founder & COO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    description: 'Expert in operations and project management, ensuring seamless execution of all projects.',
  },
  {
    name: 'Founder Name 3',
    role: 'Co-Founder & CTO',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    description: 'Technical visionary driving innovation in electrical and automation solutions.',
  },
];

const certifications = [
  {
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    title: "Quality Certified",
    description: "Recognized for excellence in electrical contracting services",
  },
  {
    icon: <AcademicCapIcon className="w-8 h-8" />,
    title: "ISO Certified",
    description: "Quality management systems meeting international standards",
  },
  {
    icon: <StarIcon className="w-8 h-8" />,
    title: "Industry Certified",
    description: "Recognized expertise in MEPF engineering solutions",
  },
];

const expertise = [
  {
    icon: <HomeIcon className="w-6 h-6" />,
    title: "Domestic Projects",
    description: "Residential buildings, apartments, and housing complexes with modern amenities",
  },
  {
    icon: <BuildingOffice2Icon className="w-6 h-6" />,
    title: "Commercial Projects",
    description: "Office buildings, retail spaces, malls, and hospitality establishments",
  },
  {
    icon: <WrenchScrewdriverIcon className="w-6 h-6" />,
    title: "Industrial Projects",
    description: "Manufacturing facilities, warehouses, and industrial complexes",
  },
];

const values = [
  "Quality Excellence",
  "Customer Satisfaction",
  "Safety First",
  "Innovation",
  "Integrity",
  "Sustainability",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full filter blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium mb-4">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Engineering Excellence<br />
              <span className="gradient-text">Since 2009</span>
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Pragna Techsols is a leading MEPF consultancy and engineering services company, 
              committed to delivering world-class solutions for domestic, commercial, and industrial projects.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Building Trust Through<br />
                <span className="gradient-text">Quality & Excellence</span>
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Founded in Vijayawada, Andhra Pradesh, Pragna Techsols has grown from a small electrical 
                  contracting firm to a comprehensive MEPF solutions provider. Our journey of over 15 years 
                  has been marked by consistent growth, innovation, and an unwavering commitment to quality.
                </p>
                <p>
                  As an established and certified MEPF solutions provider, we take pride in our 
                  technical expertise and the trust our clients place in us. Our team of skilled engineers 
                  and technicians brings together decades of combined experience in mechanical, electrical, 
                  plumbing, and fire safety systems.
                </p>
                <p>
                  We believe in building long-term relationships with our clients, understanding their unique 
                  needs, and delivering solutions that exceed expectations. Our commitment to safety, 
                  sustainability, and innovation drives everything we do.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl p-8 border border-slate-700">
                <div className="bg-slate-800 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-white mb-6">Company Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-700">
                      <span className="text-gray-400">Established</span>
                      <span className="text-white font-semibold">2009</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-700">
                      <span className="text-gray-400">Headquarters</span>
                      <span className="text-white font-semibold">Vijayawada, AP</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-700">
                      <span className="text-gray-400">Projects Completed</span>
                      <span className="text-white font-semibold">500+</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-700">
                      <span className="text-gray-400">Team Members</span>
                      <span className="text-white font-semibold">50+</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-400">Happy Clients</span>
                      <span className="text-white font-semibold">100+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-medium mb-4">
              Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Meet Our Founders
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Visionary leaders committed to excellence, innovation, and building lasting relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {founders.map((founder) => (
              <div 
                key={founder.name}
                className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 hover:border-yellow-500/50 transition-all duration-300 group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-1">{founder.name}</h3>
                  <p className="text-yellow-400 text-sm font-medium mb-3">{founder.role}</p>
                  <p className="text-gray-400 text-sm">{founder.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium mb-4">
              Certifications
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Licensed & Certified
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our certifications reflect our commitment to maintaining the highest standards in the industry.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {certifications.map((cert) => (
              <div 
                key={cert.title}
                className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-yellow-500/50 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-slate-900">{cert.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{cert.title}</h3>
                <p className="text-gray-400 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-medium mb-4">
              Our Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Serving All Sectors
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We bring specialized expertise to every type of project, ensuring tailored solutions for unique requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {expertise.map((item) => (
              <div 
                key={item.title}
                className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-indigo-400">{item.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium mb-4">
                Our Values
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Principles That<br />
                <span className="gradient-text">Guide Us</span>
              </h2>
              <p className="text-gray-400 mb-8">
                Our core values define who we are and how we operate. They guide our decisions, 
                shape our culture, and drive us to deliver excellence in every project.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {values.map((value) => (
                  <div key={value} className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl p-6 border border-slate-700">
                <div className="w-full h-full bg-slate-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
                  <div className="text-center p-8 relative z-10">
                    <div className="text-6xl font-bold gradient-text mb-4">15+</div>
                    <p className="text-white text-xl font-semibold mb-2">Years of Excellence</p>
                    <p className="text-gray-400">Building trust, one project at a time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400">
                To deliver innovative, sustainable, and cost-effective MEPF engineering solutions that 
                exceed client expectations while maintaining the highest standards of safety and quality.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400">
                To be the most trusted and preferred MEPF consultancy partner in India, known for our 
                technical excellence, innovation, and commitment to building a sustainable future.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
