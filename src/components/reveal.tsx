import { SignatureReveal } from "./signature-reveal";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger helper — seconds of delay before this element animates. */
  delay?: number;
  /** Vertical travel distance in px. */
  y?: number;
  once?: boolean;
  /**
   * Motion restraint: reveals are STATIC by default (a plain wrapper — zero
   * client JS). Pass `signature` only on the one or two moments worth animating
   * (the hero entrance); those get the lightweight `SignatureReveal`. No animation
   * library ships site-wide.
   */
  signature?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  signature = false,
}: RevealProps) {
  if (!signature) {
    return <div className={className}>{children}</div>;
  }
  return (
    <SignatureReveal className={className} delay={delay} y={y}>
      {children}
    </SignatureReveal>
  );
}
