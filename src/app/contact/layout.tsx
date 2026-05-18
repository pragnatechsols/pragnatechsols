import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Pragna Techsols',
  description: 'Get in touch with Pragna Techsols for your MEPF engineering needs. Contact us for electrical, HVAC, plumbing, fire safety, and more.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
