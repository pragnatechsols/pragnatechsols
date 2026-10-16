import { Metadata } from 'next';
import Image from 'next/image';
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

const team = [
  {
    name: 'Rajendra Prasad Chinnam',
    role: 'Managing Director',
    qualification: 'M.Tech (Electrical), MBA (HRM), PG Diploma in Fire & Safety',
    image: '/team/rajendra.jpeg',
  },
  {
    name: 'Vijaya Chandar Chinam',
    role: 'Senior Electrical Consultant',
    qualification: 'M.Tech (Electrical), M.Tech (CSE)',
  },
  {
    name: 'Rajani Gandepudi',
    role: 'Electrical Consultant',
    qualification: 'M.Tech (Electrical)',
  },
  {
    name: 'Chandra Shekhara Rao Chinnam',
    role: 'Mechanical Consultant',
    qualification: 'B.Tech (Mechanical)',
  },
  {
    name: 'Preethi Balagari',
    role: 'IT Consultant',
    qualification: 'M.Tech (CSE)',
    image: '/team/preethi.jpeg',
  },
  {
    name: 'Keerthi Balagari',
    role: 'Civil Consultant',
    qualification: 'M.Tech (IIT Guwahati), Civil Structural',
    image: '/team/keerthi.jpeg',
  },
  {
    name: 'Ratna Babu Kuchipudi',
    role: 'Admin Operations',
    qualification: 'MBA (HRM)',
    image: '/team/ratna-babu.jpeg',
  },
  {
    name: 'Navanya Deepthi Gurvindapalli',
    role: 'Electronics Consultant',
    qualification: 'B.Tech (Electronics)',
  },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

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
        <div className="absolute inset-0 bg-gradient-to-br from-[#3d2063] via-[#2e1a52]/30 to-[#3d2063]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium mb-4">
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
      <section className="py-20 bg-[#442676]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium mb-4">
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
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/20 rounded-3xl p-8 border border-[#5e3a9e]">
                <div className="bg-[#4f2e88] rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-white mb-6">Company Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-[#5e3a9e]">
                      <span className="text-gray-400">Established</span>
                      <span className="text-white font-semibold">2009</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#5e3a9e]">
                      <span className="text-gray-400">Headquarters</span>
                      <span className="text-white font-semibold">Vijayawada, AP</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#5e3a9e]">
                      <span className="text-gray-400">Projects Completed</span>
                      <span className="text-white font-semibold">500+</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#5e3a9e]">
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

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium mb-4">
              Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A team of qualified engineers and consultants committed to excellence, innovation, and building lasting relationships.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={`${member.name}-${index}`}
                className="glass-card rounded-2xl p-6 text-center flex flex-col items-center"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#3d2063] font-bold text-2xl">{getInitials(member.name)}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-amber-400 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-xs mt-auto">{member.qualification}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-[#442676]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium mb-4">
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
                className="glass-card rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-[#3d2063]">{cert.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{cert.title}</h3>
                <p className="text-gray-400 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20 bg-[#442676]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium mb-4">
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
                className="bg-gradient-to-br from-[#4f2e88] to-[#4f2e88]/50 rounded-2xl p-8 border border-[#5e3a9e] hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-purple-400">{item.icon}</div>
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
              <span className="inline-block px-4 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium mb-4">
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
                    <CheckCircleIcon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-500/20 to-purple-500/20 rounded-3xl p-6 border border-[#5e3a9e]">
                <div className="w-full h-full bg-[#4f2e88] rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
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
      <section className="py-20 bg-gradient-to-r from-purple-900/50 via-purple-900/50 to-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#3d2063]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400">
                To deliver innovative, sustainable, and cost-effective MEPF engineering solutions that 
                exceed client expectations while maintaining the highest standards of safety and quality.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
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
