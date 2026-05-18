import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  imageSrc: string;
}

export default function ProjectCard({ title, description, category, imageSrc }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 hover:border-yellow-500/50 transition-all duration-300">
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full mb-2">
          {category}
        </span>
        <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-yellow-400 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
