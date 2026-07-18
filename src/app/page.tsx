'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ServiceCard } from '@/components';
import {
  BoltIcon,
  FireIcon,
  SunIcon,
  WrenchScrewdriverIcon,
  VideoCameraIcon,
  BeakerIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/outline';
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/AnimatedComponents';

const services = [
  {
    icon: <BoltIcon className="w-6 h-6" />,
    title: 'Electrical',
    description: 'Complete electrical solutions for residential, commercial, and industrial projects.',
    href: '/services#electrical',
    imageSrc: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
  },
  {
    icon: <WrenchScrewdriverIcon className="w-6 h-6" />,
    title: 'HVAC',
    description: 'Heating, ventilation, and air conditioning systems for optimal comfort.',
    href: '/services#hvac',
    imageSrc: 'https://images.unsplash.com/photo-1631545806609-c2b999c8b28f?w=800&q=80',
  },
  {
    icon: <BeakerIcon className="w-6 h-6" />,
    title: 'Plumbing',
    description: 'Comprehensive plumbing solutions including installation and maintenance.',
    href: '/services#plumbing',
    imageSrc: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80',
  },
  {
    icon: <FireIcon className="w-6 h-6" />,
    title: 'Fire & Safety',
    description: 'Advanced fire detection, suppression systems, and safety compliance.',
    href: '/services#fire-safety',
    imageSrc: 'https://images.unsplash.com/photo-1599691889120-3f70a41b3e75?w=800&q=80',
  },
  {
    icon: <SunIcon className="w-6 h-6" />,
    title: 'Solar Projects',
    description: 'Sustainable solar energy solutions for reduced energy costs.',
    href: '/services#solar-projects',
    imageSrc: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
  },
  {
    icon: <VideoCameraIcon className="w-6 h-6" />,
    title: 'CCTV',
    description: 'State-of-the-art surveillance systems for comprehensive security.',
    href: '/services#cctv',
    imageSrc: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80',
  },
];

const stats = [
  { value: '15', suffix: '+', label: 'Years' },
  { value: '500', suffix: '+', label: 'Projects' },
  { value: '100', suffix: '+', label: 'Clients' },
  { value: '50', suffix: '+', label: 'Engineers' },
];

const vendors = [
  { name: 'Bharat Electronics Limited', logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845627/pragna-techsols/vendors/bel.png' },
  { name: 'VIT-AP University', logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845628/pragna-techsols/vendors/vit-ap.png' },
  { name: 'SRM University, AP', logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845629/pragna-techsols/vendors/srm-ap.png' },
  { name: 'NID, AP', logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845630/pragna-techsols/vendors/nid-ap.png' },
  { name: 'UltraTech', logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845631/pragna-techsols/vendors/ultratech.png' },
  { name: 'Blue Star', logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845632/pragna-techsols/vendors/blue-star.jpg' },
  { name: 'Zomato', logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845633/pragna-techsols/vendors/zomato.png' },
  { name: 'Sentini Group', logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845634/pragna-techsols/vendors/sentini.jpg' },
  { name: 'MEIL', logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845636/pragna-techsols/vendors/meil.jpg' },
  { name: 'ACT Fibernet', logo: 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845636/pragna-techsols/vendors/act-fibernet.png' },
];

// Animated text component with stagger
function AnimatedTitle({ children, className = '' }: { children: string; className?: string }) {
  const words = children.split(' ');
  
  return (
    <motion.span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 100, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="inline-block mr-[0.25em]"
          style={{ transformOrigin: 'bottom' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Magnetic button effect
function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.3;
    const y = (clientY - top - height / 2) * 0.3;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative inline-flex items-center gap-2 px-8 py-4 bg-amber-400 text-black font-semibold rounded-full overflow-hidden group"
    >
      <span className="relative z-10">{children}</span>
      <ArrowUpRightIcon className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      <motion.div
        className="absolute inset-0 bg-amber-300"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.5, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ borderRadius: '100%', transformOrigin: 'center' }}
      />
    </motion.a>
  );
}

// Counter animation
function Counter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const target = parseInt(value);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      {/* Hero Section */}
      <section ref={containerRef} className="relative min-h-[110vh] flex items-center overflow-hidden bg-transparent">
        {/* Purple gradient base - lighter top-left to deeper bottom-right, semi-transparent so the light leaks bleed through */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5b3aa0]/40 via-[#3d2063]/35 to-[#2a1548]/45" />

        {/* Soft glow accents */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-[128px] will-change-transform" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-400/25 rounded-full blur-[128px] will-change-transform" />
        </div>

        {/* Wireframe building illustration (right side) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block pointer-events-none opacity-40">
          <svg
            viewBox="0 0 600 800"
            className="absolute right-0 bottom-0 h-full w-auto"
            fill="none"
            stroke="rgba(224,176,68,0.35)"
            strokeWidth="1"
            preserveAspectRatio="xMaxYMax meet"
          >
            {/* Tower 1 */}
            <rect x="180" y="140" width="200" height="620" />
            <rect x="410" y="280" width="150" height="480" />
            {/* Floor lines - tower 1 */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`a${i}`} x1="180" y1={170 + i * 30} x2="380" y2={170 + i * 30} />
            ))}
            {/* Floor lines - tower 2 */}
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={`b${i}`} x1="410" y1={310 + i * 30} x2="560" y2={310 + i * 30} />
            ))}
            {/* Vertical mullions - tower 1 */}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`c${i}`} x1={180 + i * 40} y1="140" x2={180 + i * 40} y2="760" />
            ))}
            {/* Vertical mullions - tower 2 */}
            {Array.from({ length: 4 }).map((_, i) => (
              <line key={`d${i}`} x1={410 + i * 50} y1="280" x2={410 + i * 50} y2="760" />
            ))}
            {/* Perspective / ground lines */}
            <line x1="0" y1="760" x2="600" y2="760" />
            <line x1="60" y1="700" x2="180" y2="620" />
            <line x1="60" y1="760" x2="180" y2="760" />
          </svg>
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] hidden md:block"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div 
          style={isMobile ? {} : { y, opacity }} 
          className="relative w-full"
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-32 pb-40">
            {/* Top line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px w-12 bg-amber-400" />
              <span className="text-amber-400 text-sm font-medium tracking-[0.2em] uppercase">
                Engineering Excellence Since 2010
              </span>
            </motion.div>

            {/* Main headline */}
            <div className="overflow-hidden mb-6 pb-4">
              <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[1.15] tracking-[-0.03em] text-white">
                <AnimatedTitle>Engineering</AnimatedTitle>
              </h1>
            </div>
            <div className="overflow-hidden mb-6 pb-4">
              <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[1.15] tracking-[-0.03em]">
                <motion.span
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
                  className="inline-block text-outline text-amber-400"
                >
                  Excellence
                </motion.span>
              </h1>
            </div>
            <div className="overflow-hidden mb-12 pb-4">
              <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[1.15] tracking-[-0.03em] text-white">
                <AnimatedTitle>Delivered.</AnimatedTitle>
              </h1>
            </div>

            {/* Description and CTA */}
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-gray-400 text-lg lg:text-xl leading-relaxed max-w-xl"
              >
                Comprehensive MEPF solutions for domestic, commercial & industrial projects. 
                15+ years of trusted expertise in Vijayawada, Andhra Pradesh.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <MagneticButton href="/contact">Get a Quote</MagneticButton>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-colors"
                >
                  Explore Services
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-12 pb-16 border-t border-white/10"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-12 bg-gradient-to-b from-amber-400 to-transparent"
          />
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="py-8 bg-amber-400 overflow-hidden relative z-10" style={{ backgroundColor: '#e0b044' }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              {['ELECTRICAL', 'HVAC', 'PLUMBING', 'FIRE SAFETY', 'SOLAR', 'CCTV', 'MEPF'].map((item) => (
                <span key={item} className="text-black font-bold text-xl tracking-wider flex items-center gap-8">
                  {item}
                  <span className="w-2 h-2 bg-black rounded-full" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Vendor / Partner Logo Strip */}
      <section className="py-20 bg-[#3d2063]/50 overflow-hidden relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-12">
          <div className="flex items-center gap-4 mb-6 justify-center">
            <div className="h-px w-12 bg-amber-400" />
            <span className="text-amber-400 text-sm font-medium tracking-[0.2em] uppercase">
              Trusted By
            </span>
            <div className="h-px w-12 bg-amber-400" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center">
            Leading Organizations
          </h2>
        </div>

        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#3d2063] to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#3d2063] to-transparent z-20" />

          <div className="flex w-max animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-6 pr-6" aria-hidden={i === 1}>
                {vendors.map((vendor) => (
                  <div
                    key={`${i}-${vendor.name}`}
                    className="flex items-center justify-center h-24 w-44 flex-none rounded-xl bg-white p-4 shadow-lg"
                  >
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      title={vendor.name}
                      loading="eager"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-[#3d2063]/50 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-amber-400" />
              <span className="text-amber-400 text-sm font-medium tracking-[0.2em] uppercase">
                What We Do
              </span>
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Comprehensive<br />
                <span className="text-gray-500">Engineering Solutions</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed self-end">
                From electrical installations to fire safety systems, we provide end-to-end 
                MEPF services with certified expertise and proven results.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <StaggerItem key={service.title}>
                <ServiceCard {...service} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection className="mt-16 text-center" delay={0.4}>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium group"
            >
              View All Services
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-[#2e1a52]/50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-amber-400" />
                <span className="text-amber-400 text-sm font-medium tracking-[0.2em] uppercase">
                  Why Choose Us
                </span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-8">
                Built on Trust,<br />
                <span className="text-outline text-amber-400">Delivered with Excellence</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                With over 15 years of experience and a commitment to excellence, 
                we bring unmatched expertise to every project we undertake.
              </p>
              <MagneticButton href="/about">Learn More</MagneticButton>
            </AnimatedSection>

            <StaggerContainer className="grid grid-cols-2 gap-6">
              {[
                { num: '01', title: 'Trusted Partner', desc: 'Reliable & Professional' },
                { num: '02', title: '15+ Years', desc: 'Industry Experience' },
                { num: '03', title: 'Expert Team', desc: '50+ Skilled Engineers' },
                { num: '04', title: 'Quality Assured', desc: 'Certified Processes' },
              ].map((item) => (
                <StaggerItem key={item.num}>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-amber-400/30 transition-colors group">
                    <span className="text-amber-400 text-sm font-medium">{item.num}</span>
                    <h3 className="text-white text-xl font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#3d2063]/50 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="relative p-12 lg:p-20 rounded-3xl bg-gradient-to-br from-amber-400/10 via-transparent to-purple-500/10 border border-white/5 overflow-hidden">
            <div className="relative text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-6xl font-bold text-white mb-6"
              >
                Ready to Start<br />
                Your Project?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 text-lg mb-10 max-w-xl mx-auto"
              >
                Let&apos;s discuss your requirements and deliver engineering solutions 
                that exceed your expectations.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <MagneticButton href="/contact">Get Free Consultation</MagneticButton>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
