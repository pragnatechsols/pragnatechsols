'use client';

import { useState } from 'react';
import Link from 'next/link';

// Real clients and the work Pragna delivered for them (source: company records).
const projects = [
  {
    title: 'Bharat Electronics Limited, AP',
    works: ['Supply of Circuit Breakers'],
    category: 'Industrial',
    logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845627/pragna-techsols/vendors/bel.png',
  },
  {
    title: 'VIT-AP University',
    works: [
      'Switch Gears',
      'Cable laying (300 sq.mm electrical cable)',
      'Lightning Arrestors',
    ],
    category: 'Educational',
    logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845628/pragna-techsols/vendors/vit-ap.png',
  },
  {
    title: 'SRM University, AP',
    works: ['Water tank cleaning', 'Material supply — Glowguard'],
    category: 'Educational',
    logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845629/pragna-techsols/vendors/srm-ap.png',
  },
  {
    title: 'NID, AP',
    works: [
      'Electrical cable laying & associated works',
      'Transformer oil filtration',
    ],
    category: 'Educational',
    logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845630/pragna-techsols/vendors/nid-ap.png',
  },
  {
    title: 'UltraTech, AP',
    works: [
      'Transformer oil service',
      'Supply of lights',
      'Electrical circuit checking & new electrical works',
    ],
    category: 'Industrial',
    logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845631/pragna-techsols/vendors/ultratech.png',
  },
  {
    title: 'Sentini Group',
    works: ['Electrical works — Elevate Mall'],
    category: 'Commercial',
    logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845634/pragna-techsols/vendors/sentini.jpg',
  },
  {
    title: 'MEIL',
    works: ['MEP works at Medical College, Piduguralla, Andhra Pradesh'],
    category: 'Infrastructure',
    logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845636/pragna-techsols/vendors/meil.jpg',
  },
  {
    title: 'Blue Star, Vijayawada',
    works: ['MEPF engineering services'],
    category: 'Commercial',
    logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845632/pragna-techsols/vendors/blue-star.jpg',
  },
  {
    title: 'Zomato',
    works: ['MEPF engineering services'],
    category: 'Commercial',
    logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845633/pragna-techsols/vendors/zomato.png',
  },
  {
    title: 'ACT Fibernet',
    works: ['MEPF engineering services'],
    category: 'Infrastructure',
    logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845636/pragna-techsols/vendors/act-fibernet.png',
  },
];

const categories = ['All', 'Commercial', 'Industrial', 'Educational', 'Infrastructure'];

export default function ProjectsContent() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3d2063] via-purple-950/30 to-[#3d2063]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl" />
        
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
            <div className="text-center glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold text-amber-400">500+</div>
              <div className="text-gray-400 text-sm mt-1">Projects Completed</div>
            </div>
            <div className="text-center glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold text-amber-400">50+</div>
              <div className="text-gray-400 text-sm mt-1">Ongoing Projects</div>
            </div>
            <div className="text-center glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold text-amber-400">10+</div>
              <div className="text-gray-400 text-sm mt-1">States Covered</div>
            </div>
            <div className="text-center glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold text-amber-400">100%</div>
              <div className="text-gray-400 text-sm mt-1">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 bg-[#442676]/50 sticky top-16 z-40 backdrop-blur-sm border-b border-[#4f2e88]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  category === selectedCategory
                    ? 'bg-amber-500 text-[#3d2063]'
                    : 'bg-[#4f2e88] text-gray-300 hover:bg-[#5e3a9e] hover:text-white'
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
                <div
                  key={project.title}
                  className="glass-card group flex flex-col overflow-hidden rounded-2xl"
                >
                  {/* Logo panel on a light backdrop so the client mark reads clearly */}
                  <div className="relative flex h-40 items-center justify-center bg-white p-8">
                    <img
                      src={project.logo}
                      alt={project.title}
                      className="max-h-full max-w-[70%] object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 inline-block rounded-full bg-amber-500/90 px-3 py-1 text-xs font-medium text-[#3d2063]">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-4 text-lg font-semibold text-white transition-colors duration-200 group-hover:text-amber-400">
                      {project.title}
                    </h3>
                    <ul className="space-y-2">
                      {project.works.map((work) => (
                        <li
                          key={work}
                          className="flex items-start gap-2 text-sm text-gray-400"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-amber-400" />
                          <span>{work}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
      <section className="py-20 bg-gradient-to-r from-purple-900/50 via-purple-900/50 to-purple-900/50">
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
                className="bg-amber-500 hover:bg-amber-400 text-[#3d2063] px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
              >
                Get Started
              </Link>
              <Link
                href="/services"
                className="bg-[#4f2e88] hover:bg-[#5e3a9e] text-white px-8 py-4 rounded-xl font-semibold border border-[#5e3a9e] transition-all duration-300"
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
