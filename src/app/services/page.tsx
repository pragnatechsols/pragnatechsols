import { Metadata } from 'next';
import ServicesContent from './ServicesContent';

export const metadata: Metadata = {
  title: 'Our Services | Pragna Techsols',
  description: 'Explore our comprehensive MEPF services including Electrical, HVAC, Plumbing, Fire & Safety, Solar Projects, CCTV, RO/STP/WTP, and Retrofit Services.',
};

export default function ServicesPage() {
  return <ServicesContent />;
}
