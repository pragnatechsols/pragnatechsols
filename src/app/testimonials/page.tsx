import { Metadata } from 'next';
import TestimonialsContent from './TestimonialsContent';

export const metadata: Metadata = {
  title: 'Success Stories | Pragna Techsols',
  description: 'Discover how Pragna Techsols has helped businesses and organizations achieve their engineering goals with our comprehensive MEPF solutions.',
};

export default function TestimonialsPage() {
  return <TestimonialsContent />;
}
