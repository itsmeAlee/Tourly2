"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface NavLinkProps extends Omit<LinkProps, "className" | "href"> {
  children?: React.ReactNode;
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string);
  activeClassName?: string;
  pendingClassName?: string;
  href?: string;
  to?: string; // Compatibility with react-router-dom
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, href, to, ...props }, ref) => {
    const pathname = usePathname();
    const target = href || to;

    if (!target) {
      return null;
    }

    // Determine active state
    // Exact match or starts with (for sub-routes), excluding root "/"
    const targetPath = target.toString();
    const isActive =
      pathname === targetPath ||
      (targetPath !== "/" && pathname.startsWith(`${targetPath}/`));

    const isPending = false; // Next.js doesn't expose pending state naturally here

    let finalClassName: string;

    if (typeof className === "function") {
      finalClassName = className({ isActive, isPending });
    } else {
      finalClassName = cn(
        className,
        isActive && activeClassName,
        isPending && pendingClassName
      );
    }

    return (
      <Link
        href={target}
        ref={ref}
        className={finalClassName}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
