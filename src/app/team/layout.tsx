import type { Metadata } from 'next';
import TeamLayoutClient from './TeamLayoutClient';

export const metadata: Metadata = {
  title: 'Team Portal | Pragna Techsols',
  description: 'Team member task portal for Pragna Techsols',
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <TeamLayoutClient>{children}</TeamLayoutClient>;
}
