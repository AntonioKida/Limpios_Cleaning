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
  | "Grid2x2" // window cleaning (four-pane window)
  | "Waves" // carpet cleaning (fibers / extraction)
  // Value props / trust
  | "ShieldCheck"
  | "Leaf"
  | "BadgeCheck"
  | "Languages"
  | "Star"
  | "Landmark" // South Lake Chamber of Commerce membership
  // Audiences (who we work with)
  | "Handshake" // property managers
  | "Building" // HOAs / communities
  // How it works
  | "CalendarCheck"
  | "ClipboardList" // walkthrough
  | "FileText" // written estimate
  | "SprayCan"
  | "Smile"
  // Why / proof
  | "Users"
  | "ListChecks"
  | "Zap"
  // Contact / misc
  | "Phone"
  | "Mail"
  | "MapPin"
  | "Clock"
  | "Check"
  | "ArrowRight"
  | "Quote";
