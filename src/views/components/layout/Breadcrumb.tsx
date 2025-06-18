import React, { useEffect, useState } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
  isCurrent?: boolean;
};

type BreadcrumbsProps = {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  navSelector?: string; // Optional: selector for the navigation bar
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = "/",
  className = "",
  navSelector = 'nav[aria-label="Main Navigation"], nav.navbar, nav', // default selectors
}) => {
  const [navLinks, setNavLinks] = useState<BreadcrumbItem[] | null>(null);

  useEffect(() => {
    if (!items) {
      const nav =
        document.querySelector(navSelector) || document.querySelector("nav");
      if (nav) {
        const links = Array.from(nav.querySelectorAll("a")).map(
          (a, idx, arr) => ({
            label: a.textContent?.trim() || `Link ${idx + 1}`,
            href: a.getAttribute("href") || undefined,
            isCurrent: idx === arr.length - 1,
          }),
        );
        setNavLinks(links);
      }
    }
  }, [items, navSelector]);

  const breadcrumbItems = items && items.length > 0 ? items : navLinks;

  if (!breadcrumbItems || breadcrumbItems.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol style={{ display: "flex", listStyle: "none", padding: 0, margin: 0 }}>
        {breadcrumbItems.map((item, idx) => {
          const isLast = idx === breadcrumbItems.length - 1;
          return (
            <li
              key={item.label + idx}
              style={{ display: "flex", alignItems: "center" }}
              aria-current={item.isCurrent || isLast ? "page" : undefined}
            >
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  style={{
                    color: "#0366d6",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  style={{
                    color: "#6c757d",
                    fontWeight: isLast ? 700 : 500,
                    cursor: isLast ? "default" : "pointer",
                  }}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span
                  aria-hidden="true"
                  style={{ margin: "0 0.5em", color: "#adb5bd" }}
                >
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
