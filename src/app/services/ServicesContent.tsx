'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getServiceIcon } from '@/lib/service-icons';
import type { Service } from '@/types';

export default function ServicesContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success) setServices(data.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

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
      <section className="py-20 bg-[#442676]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No services available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {services.map((service, index) => {
                const IconComp = getServiceIcon(service.icon_name);
                return (
                  <div
                    key={service.id}
                    id={service.slug}
                    className={`scroll-mt-24 grid lg:grid-cols-2 gap-8 items-center ${
                      index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                    }`}
                  >
                    <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                      <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6`}>
                        {service.icon_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={service.icon_image_url} alt={service.title} className="w-10 h-10 object-contain" />
                        ) : (
                          <div className="text-white">
                            <IconComp className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">{service.title}</h2>
                      {service.short_desc && (
                        <p className="text-amber-400 font-medium mb-4">{service.short_desc}</p>
                      )}
                      {service.description && (
                        <p className="text-gray-400 mb-6">{service.description}</p>
                      )}
                      <Link
                        href="/contact"
                        className="inline-flex items-center text-amber-400 hover:text-amber-300 font-medium transition-colors duration-200"
                      >
                        Get a Quote
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                    {service.features && service.features.length > 0 && (
                      <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                        <div className="glass-card rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                          <ul className="space-y-3">
                            {service.features.map((feature) => (
                              <li key={feature} className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300 text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 via-purple-900/50 to-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-3xl p-8 sm:p-12 border border-amber-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full filter blur-3xl" />
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
                  className="bg-amber-500 hover:bg-amber-400 text-[#3d2063] px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
                >
                  Contact Us Today
                </Link>
                <a
                  href="tel:+917036335500"
                  className="bg-[#4f2e88] hover:bg-[#5e3a9e] text-white px-8 py-4 rounded-xl font-semibold border border-[#5e3a9e] transition-all duration-300 flex items-center justify-center gap-2"
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
