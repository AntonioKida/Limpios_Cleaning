import { Phone } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

interface PhoneLinkProps {
  className?: string;
  showIcon?: boolean;
  iconClassName?: string;
  /** Override the visible label (defaults to the formatted phone number). */
  children?: React.ReactNode;
  "aria-label"?: string;
}

/**
 * Click-to-call link. The phone is a Google Voice line — this is the ONLY way
 * we surface it (no SMS automation). Always points at the single NAP source.
 */
export function PhoneLink({
  className,
  showIcon = false,
  iconClassName,
  children,
  "aria-label": ariaLabel,
}: PhoneLinkProps) {
  return (
    <a
      href={site.phone.href}
      data-call-cta
      aria-label={ariaLabel ?? `Call ${site.phone.display}`}
      className={cn("inline-flex items-center gap-2", className)}
    >
      {showIcon ? (
        <Phone className={cn("size-4", iconClassName)} aria-hidden />
      ) : null}
      <span>{children ?? site.phone.display}</span>
    </a>
  );
}
