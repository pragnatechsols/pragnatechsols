import type { ComponentType, SVGProps } from 'react';
import {
  BoltIcon,
  FireIcon,
  SunIcon,
  WrenchScrewdriverIcon,
  VideoCameraIcon,
  BeakerIcon,
  CogIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  BriefcaseIcon,
  AcademicCapIcon,
  TruckIcon,
  WifiIcon,
  CpuChipIcon,
  LightBulbIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// Preset icon map for admin-managed services. Keys are stored in
// services.icon_name; the /services page renders the matching component
// (unless a custom icon_image_url is provided, which takes precedence).
export const SERVICE_ICONS: Record<string, IconComponent> = {
  bolt: BoltIcon,
  fire: FireIcon,
  sun: SunIcon,
  wrench: WrenchScrewdriverIcon,
  video: VideoCameraIcon,
  beaker: BeakerIcon,
  cog: CogIcon,
  shield: ShieldCheckIcon,
  building: BuildingOffice2Icon,
  briefcase: BriefcaseIcon,
  academic: AcademicCapIcon,
  truck: TruckIcon,
  wifi: WifiIcon,
  chip: CpuChipIcon,
  bulb: LightBulbIcon,
  tools: WrenchIcon,
};

// Human-friendly labels for the admin icon picker dropdown.
export const SERVICE_ICON_OPTIONS: { value: string; label: string }[] = [
  { value: 'bolt', label: 'Bolt (Electrical)' },
  { value: 'wrench', label: 'Wrench (HVAC / Tools)' },
  { value: 'beaker', label: 'Beaker (Plumbing / Water)' },
  { value: 'fire', label: 'Fire (Fire & Safety)' },
  { value: 'sun', label: 'Sun (Solar)' },
  { value: 'video', label: 'Video (CCTV)' },
  { value: 'cog', label: 'Cog (Treatment / Machinery)' },
  { value: 'shield', label: 'Shield (Retrofit / Safety)' },
  { value: 'building', label: 'Building (Commercial)' },
  { value: 'briefcase', label: 'Briefcase (Careers / Consulting)' },
  { value: 'academic', label: 'Academic (Education)' },
  { value: 'truck', label: 'Truck (Logistics)' },
  { value: 'wifi', label: 'WiFi (Networking)' },
  { value: 'chip', label: 'Chip (Automation)' },
  { value: 'bulb', label: 'Bulb (Lighting / Ideas)' },
  { value: 'tools', label: 'Tools (Maintenance)' },
];

// Tailwind gradient presets for the admin service form.
export const SERVICE_GRADIENT_OPTIONS: { value: string; label: string }[] = [
  { value: 'from-amber-400 to-orange-500', label: 'Amber → Orange' },
  { value: 'from-blue-400 to-cyan-500', label: 'Blue → Cyan' },
  { value: 'from-cyan-400 to-blue-500', label: 'Cyan → Blue' },
  { value: 'from-red-400 to-orange-500', label: 'Red → Orange' },
  { value: 'from-amber-400 to-amber-500', label: 'Amber → Amber' },
  { value: 'from-purple-400 to-purple-500', label: 'Purple → Purple' },
  { value: 'from-teal-400 to-green-500', label: 'Teal → Green' },
];

export const DEFAULT_SERVICE_ICON = 'bolt';

// Resolve a stored icon_name to a component, falling back to the default.
export function getServiceIcon(name: string | null | undefined): IconComponent {
  return (name && SERVICE_ICONS[name]) || SERVICE_ICONS[DEFAULT_SERVICE_ICON];
}
