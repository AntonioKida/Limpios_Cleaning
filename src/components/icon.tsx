import {
  House,
  Building2,
  Sparkles,
  KeyRound,
  HardHat,
  PaintRoller,
  Grid2x2,
  Waves,
  ShieldCheck,
  Leaf,
  BadgeCheck,
  Languages,
  Star,
  Landmark,
  Handshake,
  Building,
  CalendarCheck,
  ClipboardList,
  FileText,
  SprayCan,
  Smile,
  Phone,
  Mail,
  MapPin,
  Clock,
  Check,
  ArrowRight,
  Quote,
  Users,
  ListChecks,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/content/icons";

/** Single registry mapping content `IconName`s to lucide components. */
const registry: Record<IconName, LucideIcon> = {
  House,
  Building2,
  Sparkles,
  KeyRound,
  HardHat,
  PaintRoller,
  Grid2x2,
  Waves,
  ShieldCheck,
  Leaf,
  BadgeCheck,
  Languages,
  Star,
  Landmark,
  Handshake,
  Building,
  CalendarCheck,
  ClipboardList,
  FileText,
  SprayCan,
  Smile,
  Phone,
  Mail,
  MapPin,
  Clock,
  Check,
  ArrowRight,
  Quote,
  Users,
  ListChecks,
  Zap,
};

export interface IconProps {
  name: IconName;
  className?: string;
  /** Decorative by default; pass a label to expose it to assistive tech. */
  label?: string;
  strokeWidth?: number;
}

export function Icon({ name, className, label, strokeWidth }: IconProps) {
  const Cmp = registry[name];
  return (
    <Cmp
      className={className}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
