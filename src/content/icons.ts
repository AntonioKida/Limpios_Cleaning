/**
 * The set of lucide-react icon names referenced by the content layer. The UI
 * `<Icon>` registry maps each of these to a component. Keeping the union here
 * (content owns it, the UI consumes it) preserves a clean dependency direction
 * and gives type-safety on every icon reference.
 */
export type IconName =
  // Services
  | "House"
  | "Building2"
  | "Sparkles"
  | "KeyRound"
  | "HardHat"
  | "PaintRoller"
  // Value props / trust
  | "ShieldCheck"
  | "Leaf"
  | "BadgeCheck"
  | "Languages"
  | "Star"
  // How it works
  | "CalendarCheck"
  | "SprayCan"
  | "Smile"
  // Contact / misc
  | "Phone"
  | "Mail"
  | "MapPin"
  | "Clock"
  | "Check"
  | "ArrowRight"
  | "Quote"
  | "Instagram"
  | "Facebook";
