'use client';

import { useState } from 'react';
import { ProjectCard } from '@/components';
import Link from 'next/link';

const projects = [
  {
    title: 'Vijayawada Tech Park',
    description: 'Complete MEPF installation for a 10-story IT park including electrical systems, HVAC, fire safety, and smart building integration.',
    category: 'Commercial',
    imageSrc: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
  {
    title: 'Green Valley Apartments',
    description: 'Residential complex with sustainable energy solutions, centralized HVAC, and modern plumbing systems for 200+ units.',
    category: 'Residential',
    imageSrc: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  },
  {
    title: 'Andhra Steel Works',
    description: 'Industrial electrical infrastructure, heavy-duty HVAC systems, and comprehensive fire safety solutions for manufacturing facility.',
    category: 'Industrial',
    imageSrc: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  },
  {
    title: 'City Center Mall',
    description: 'Large-scale retail complex with integrated MEP systems, energy-efficient lighting, and advanced fire suppression systems.',
    category: 'Commercial',
    imageSrc: 'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=800&q=80',
  },
  {
    title: 'Solar Farm Project',
    description: '5MW solar power installation with grid integration, monitoring systems, and maintenance infrastructure.',
    category: 'Solar',
    imageSrc: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
  },
  {
    title: 'Heritage Hospital',
    description: 'Healthcare facility with critical power systems, specialized HVAC for operation theaters, and medical gas infrastructure.',
    category: 'Healthcare',
    imageSrc: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
  },
  {
    title: 'Luxury Hotel & Resort',
    description: 'Premium hospitality project with smart room controls, central plant systems, and integrated building management.',
    category: 'Hospitality',
    imageSrc: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  },
  {
    title: 'Water Treatment Plant',
    description: '10 MLD STP with advanced treatment technology, automation, and SCADA integration for municipal corporation.',
    category: 'Infrastructure',
    imageSrc: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
  },
  {
    title: 'University Campus',
    description: 'Educational institution with multiple buildings, centralized power distribution, and campus-wide CCTV surveillance.',
    category: 'Educational',
    imageSrc: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
  },
  {
    title: 'Smart Warehouse',
    description: 'Modern logistics facility with automated systems, energy-efficient lighting, and advanced fire detection systems.',
    category: 'Industrial',
    imageSrc: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
  },
  {
    title: 'Residential Township',
    description: 'Large-scale township project with sustainable infrastructure, rainwater harvesting, and solar-powered common areas.',
    category: 'Residential',
    imageSrc: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  },
  {
    title: 'Corporate Headquarters',
    description: 'Modern office building with BMS integration, efficient HVAC systems, and state-of-the-art electrical infrastructure.',
    category: 'Commercial',
    imageSrc: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
];

const categories = ['All', 'Commercial', 'Residential', 'Industrial', 'Solar', 'Healthcare', 'Hospitality', 'Infrastructure', 'Educational'];

export default function ProjectsContent() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium mb-4">
              Our Portfolio
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Projects That<br />
              <span className="gradient-text">Inspire Excellence</span>
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Explore our portfolio of successfully completed projects across various sectors. 
              Each project showcases our commitment to quality and innovation.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="text-3xl font-bold text-yellow-400">500+</div>
              <div className="text-gray-400 text-sm mt-1">Projects Completed</div>
            </div>
            <div className="text-center bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="text-3xl font-bold text-yellow-400">50+</div>
              <div className="text-gray-400 text-sm mt-1">Ongoing Projects</div>
            </div>
            <div className="text-center bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="text-3xl font-bold text-yellow-400">10+</div>
              <div className="text-gray-400 text-sm mt-1">States Covered</div>
            </div>
            <div className="text-center bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="text-3xl font-bold text-yellow-400">100%</div>
              <div className="text-gray-400 text-sm mt-1">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 bg-slate-900/50 sticky top-16 z-40 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  category === selectedCategory
                    ? 'bg-yellow-500 text-slate-900'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Let&apos;s discuss how we can bring your vision to life with our comprehensive 
              MEPF engineering solutions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/25"
              >
                Get Started
              </Link>
              <Link
                href="/services"
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold border border-slate-700 transition-all duration-300"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
