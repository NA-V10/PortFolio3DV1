import type { AnchorHTMLAttributes, ReactNode } from "react";
import Magnetic from "./Magnetic";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "solid" | "ghost";
  icon?: ReactNode;
  cursor?: string;
  magnetic?: boolean;
};

/** Pill link-button. External links get rel/target automatically. */
export default function Button({ variant = "ghost", icon, cursor, magnetic = true, children, className = "", href, ...rest }: Props) {
  const external = href?.startsWith("http");
  const link = (
    <a
      href={href}
      className={`btn ${variant === "solid" ? "btn-solid" : "btn-ghost"} ${className}`}
      data-cursor={cursor}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      <span>{children}</span>
      {icon && <span className="btn-icon">{icon}</span>}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
