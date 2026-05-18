import { Metadata } from 'next';
import Link from 'next/link';
import {
  BoltIcon,
  FireIcon,
  SunIcon,
  WrenchScrewdriverIcon,
  VideoCameraIcon,
  BeakerIcon,
  CogIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Our Services | Pragna Techsols',
  description: 'Explore our comprehensive MEPF services including Electrical, HVAC, Plumbing, Fire & Safety, Solar Projects, CCTV, RO/STP/WTP, and Retrofit Services.',
};

const services = [
  {
    icon: <BoltIcon className="w-10 h-10" />,
    title: 'Electrical',
    shortDesc: 'Complete electrical solutions for all project types',
    description: 'Our electrical services encompass the complete spectrum of electrical engineering solutions. From low voltage distribution systems to high voltage installations, we design, install, and maintain electrical infrastructure that meets the highest safety and efficiency standards.',
    features: [
      'LT & HT Electrical Installations',
      'Power Distribution Systems',
      'Substation Design & Installation',
      'Electrical Panel Design & Manufacturing',
      'Earthing & Lightning Protection',
      'Energy Audits & Optimization',
    ],
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    icon: <WrenchScrewdriverIcon className="w-10 h-10" />,
    title: 'HVAC',
    shortDesc: 'Heating, Ventilation & Air Conditioning systems',
    description: 'We provide comprehensive HVAC solutions designed for optimal comfort and energy efficiency. Our team specializes in designing and implementing climate control systems for residential, commercial, and industrial spaces.',
    features: [
      'Central Air Conditioning Systems',
      'VRF/VRV Systems',
      'Ducting Design & Installation',
      'Chiller Plant Systems',
      'Ventilation & Exhaust Systems',
      'HVAC Maintenance & AMC',
    ],
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    icon: <BeakerIcon className="w-10 h-10" />,
    title: 'Plumbing',
    shortDesc: 'Comprehensive plumbing & sanitary solutions',
    description: 'Our plumbing services cover everything from basic installations to complex industrial systems. We ensure efficient water supply, drainage, and sanitary systems that comply with all regulatory standards.',
    features: [
      'Water Supply Systems',
      'Drainage & Sewage Systems',
      'Sanitary Installations',
      'Rainwater Harvesting',
      'Swimming Pool Systems',
      'Hot Water Systems',
    ],
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    icon: <FireIcon className="w-10 h-10" />,
    title: 'Fire & Safety',
    shortDesc: 'Advanced fire detection & suppression systems',
    description: 'Safety is our priority. We design and implement fire detection, alarm, and suppression systems that protect lives and property. Our solutions comply with all national and international fire safety standards.',
    features: [
      'Fire Detection & Alarm Systems',
      'Sprinkler Systems',
      'Fire Hydrant Systems',
      'FM-200 & CO2 Suppression',
      'Public Address & Emergency Systems',
      'Fire Safety Audits',
    ],
    gradient: 'from-red-400 to-orange-500',
  },
  {
    icon: <SunIcon className="w-10 h-10" />,
    title: 'Solar Projects',
    shortDesc: 'Sustainable solar energy solutions',
    description: 'Embrace clean energy with our solar solutions. We design and install solar power systems that reduce your carbon footprint and energy costs while contributing to a sustainable future.',
    features: [
      'Rooftop Solar Installations',
      'Ground-mounted Solar Systems',
      'Solar Water Heating',
      'Net Metering Solutions',
      'Solar Street Lighting',
      'Solar System Maintenance',
    ],
    gradient: 'from-amber-400 to-yellow-500',
  },
  {
    icon: <VideoCameraIcon className="w-10 h-10" />,
    title: 'CCTV',
    shortDesc: 'State-of-the-art surveillance systems',
    description: 'Protect your premises with our advanced CCTV and surveillance solutions. We provide end-to-end security systems with the latest technology for comprehensive monitoring and recording.',
    features: [
      'IP Camera Systems',
      'HD & 4K Surveillance',
      'Network Video Recorders (NVR)',
      'Remote Monitoring Solutions',
      'Access Control Integration',
      'Video Analytics',
    ],
    gradient: 'from-purple-400 to-indigo-500',
  },
  {
    icon: <CogIcon className="w-10 h-10" />,
    title: 'RO, STP & WTP',
    shortDesc: 'Water treatment & purification systems',
    description: 'We specialize in water treatment solutions including Reverse Osmosis, Sewage Treatment Plants, and Water Treatment Plants. Our systems ensure clean, safe water while meeting environmental regulations.',
    features: [
      'Reverse Osmosis Plants',
      'Sewage Treatment Plants (STP)',
      'Water Treatment Plants (WTP)',
      'Effluent Treatment Plants (ETP)',
      'Water Recycling Systems',
      'Operation & Maintenance',
    ],
    gradient: 'from-teal-400 to-green-500',
  },
  {
    icon: <ShieldCheckIcon className="w-10 h-10" />,
    title: 'Retrofit Services',
    shortDesc: 'Modernization & upgrade solutions',
    description: 'Upgrade and modernize your existing infrastructure with our retrofit services. We help you improve efficiency, safety, and compliance while extending the life of your systems.',
    features: [
      'Electrical System Upgrades',
      'HVAC Retrofitting',
      'Energy Efficiency Improvements',
      'Safety System Upgrades',
      'Building Automation',
      'Equipment Modernization',
    ],
    gradient: 'from-indigo-400 to-purple-500',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full filter blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium mb-4">
              Our Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Comprehensive<br />
              <span className="gradient-text">MEPF Solutions</span>
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              From electrical installations to water treatment systems, we provide end-to-end 
              engineering services tailored to meet your specific requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div 
                key={service.title}
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6`}>
                    <div className="text-white">{service.icon}</div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{service.title}</h2>
                  <p className="text-yellow-400 font-medium mb-4">{service.shortDesc}</p>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200"
                  >
                    Get a Quote
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-3xl p-8 sm:p-12 border border-yellow-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 rounded-full filter blur-3xl" />
            <div className="relative z-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Need a Custom Solution?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                Our team of experts is ready to help you design and implement solutions 
                tailored to your specific requirements.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/25"
                >
                  Contact Us Today
                </Link>
                <a
                  href="tel:+919876543210"
                  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold border border-slate-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
