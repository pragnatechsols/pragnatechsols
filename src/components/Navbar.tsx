'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
      className="fixed top-4 inset-x-0 z-50 px-4"
    >
      <div
        className={`mx-auto max-w-4xl rounded-[28px] transition-colors duration-500 border overflow-hidden ${
          isMenuOpen
            ? 'bg-[#2e1a52]/90 supports-[backdrop-filter]:bg-[#2e1a52]/70 backdrop-blur-2xl border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
            : isScrolled
            ? 'bg-[#2e1a52]/70 supports-[backdrop-filter]:bg-white/10 backdrop-blur-2xl border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
            : 'bg-[#2e1a52]/50 supports-[backdrop-filter]:bg-white/5 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)]'
        }`}
      >
        <div className="flex items-center justify-between h-14 pl-6 pr-4">
          {/* Logo */}
          <Link href="/" className="group">
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="text-white font-bold text-sm sm:text-base tracking-tight"
            >
              PRAGNA TECHSOLS
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-2 text-sm font-medium transition-colors duration-200 group"
              >
                <span className={pathname === link.href ? 'text-white' : 'text-gray-300 group-hover:text-white'}>
                  {link.label}
                </span>
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-amber-400"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                animate={isMenuOpen ? { d: 'M6 18L18 6M6 6l12 12' } : { d: 'M4 6h16M4 12h16M4 18h16' }}
              />
            </svg>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence initial={false}>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.2 },
              }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 px-4 pt-1">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + index * 0.04, duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors duration-200 ${
                          pathname === link.href
                            ? 'text-amber-400 bg-white/5'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
