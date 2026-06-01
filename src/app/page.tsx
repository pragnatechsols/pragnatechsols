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
  },
  {
    icon: <WrenchScrewdriverIcon className="w-6 h-6" />,
    title: 'HVAC',
    description: 'Heating, ventilation, and air conditioning systems for optimal comfort.',
    href: '/services#hvac',
  },
  {
    icon: <BeakerIcon className="w-6 h-6" />,
    title: 'Plumbing',
    description: 'Comprehensive plumbing solutions including installation and maintenance.',
    href: '/services#plumbing',
  },
  {
    icon: <FireIcon className="w-6 h-6" />,
    title: 'Fire & Safety',
    description: 'Advanced fire detection, suppression systems, and safety compliance.',
    href: '/services#fire-safety',
  },
  {
    icon: <SunIcon className="w-6 h-6" />,
    title: 'Solar Projects',
    description: 'Sustainable solar energy solutions for reduced energy costs.',
    href: '/services#solar-projects',
  },
  {
    icon: <VideoCameraIcon className="w-6 h-6" />,
    title: 'CCTV',
    description: 'State-of-the-art surveillance systems for comprehensive security.',
    href: '/services#cctv',
  },
];

const stats = [
  { value: '15', suffix: '+', label: 'Years' },
  { value: '500', suffix: '+', label: 'Projects' },
  { value: '100', suffix: '+', label: 'Clients' },
  { value: '50', suffix: '+', label: 'Engineers' },
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
      className="relative inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-black font-semibold rounded-full overflow-hidden group"
    >
      <span className="relative z-10">{children}</span>
      <ArrowUpRightIcon className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      <motion.div
        className="absolute inset-0 bg-yellow-300"
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
      <section ref={containerRef} className="relative min-h-[110vh] flex items-center overflow-visible bg-[#0a0a0f]">
        {/* Gradient orbs - simplified for mobile */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-yellow-500/20 rounded-full blur-[128px] md:blur-[128px] will-change-transform" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] md:blur-[128px] will-change-transform" />
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
              <div className="h-px w-12 bg-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium tracking-[0.2em] uppercase">
                Engineering Excellence Since 2010
              </span>
            </motion.div>

            {/* Main headline */}
            <div className="overflow-hidden mb-6 pb-2">
              <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[1] tracking-[-0.03em] text-white">
                <AnimatedTitle>Engineering</AnimatedTitle>
              </h1>
            </div>
            <div className="overflow-hidden mb-6 pb-2">
              <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[1] tracking-[-0.03em]">
                <motion.span
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
                  className="inline-block text-outline text-yellow-400"
                >
                  Excellence
                </motion.span>
              </h1>
            </div>
            <div className="overflow-hidden mb-12 pb-2">
              <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[1] tracking-[-0.03em] text-white">
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
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-12 border-t border-white/10"
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
            className="w-px h-12 bg-gradient-to-b from-yellow-400 to-transparent"
          />
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="py-8 bg-yellow-400 overflow-hidden relative z-10" style={{ backgroundColor: '#facc15' }}>
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

      {/* Services Section */}
      <section className="py-32 bg-[#0a0a0f] relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium tracking-[0.2em] uppercase">
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
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium group"
            >
              View All Services
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-[#0d0d12] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium tracking-[0.2em] uppercase">
                  Why Choose Us
                </span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-8">
                Built on Trust,<br />
                <span className="text-outline text-yellow-400">Delivered with Excellence</span>
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
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-yellow-400/30 transition-colors group">
                    <span className="text-yellow-400 text-sm font-medium">{item.num}</span>
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
      <section className="py-32 bg-[#0a0a0f] relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="relative p-12 lg:p-20 rounded-3xl bg-gradient-to-br from-yellow-400/10 via-transparent to-indigo-500/10 border border-white/5 overflow-hidden">
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
