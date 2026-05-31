import { Metadata } from 'next';
import ProjectsContent from './ProjectsContent';

export const metadata: Metadata = {
  title: 'Our Projects | Pragna Techsols',
  description: 'Explore our portfolio of successful MEPF projects including commercial buildings, industrial facilities, residential complexes, and more.',
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
