"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { CLINIC, TREATMENTS } from "@/data/dummy";
import Icon from "./Icon";

const NAV_LINKS = [
  { href: "/team", label: "Our Team" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileTreatmentsOpen, setMobileTreatmentsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close every open menu whenever the route changes. Adjusting state
  // during render (rather than in an effect) avoids an extra commit —
  // see https://react.dev/learn/you-might-not-need-an-effect
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setDropdownOpen(false);
    setMobileTreatmentsOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
      role="banner"
    >
      <div className={`container ${styles.inner}`}>
        <Link
          href="/"
          className={styles.logo}
          aria-label={`${CLINIC.name} — Home`}
        >
          <span className={styles.logoMark}>NFC</span>
          <span className={styles.logoText}>{CLINIC.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.links} aria-label="Primary navigation">
          <div className={styles.dropdown} ref={dropdownRef}>
            <Link
              href="/treatments"
              className={`${styles.link} ${
                isActive("/treatments") ? styles.linkActive : ""
              }`}
            >
              Treatments
            </Link>
            <button
              type="button"
              className={styles.dropdownToggle}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="Toggle treatments menu"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen((v) => !v);
              }}
            >
              <Icon
                name="chevron-down"
                size={14}
                className={dropdownOpen ? styles.chevronOpen : ""}
              />
            </button>
            <div
              className={`${styles.dropdownMenu} ${
                dropdownOpen ? styles.dropdownMenuOpen : ""
              }`}
            >
              {TREATMENTS.map((t) => (
                <Link
                  key={t.id}
                  href={`/treatments#${t.id}`}
                  className={styles.dropdownLink}
                >
                  {t.title}
                </Link>
              ))}
              <Link href="/treatments" className={styles.dropdownLinkAll}>
                All Treatments
              </Link>
            </div>
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${
                isActive(link.href) ? styles.linkActive : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link href="/contact" className={`btn btn-primary ${styles.cta}`}>
          Book Consultation
        </Link>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.bar1Open : ""}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.bar2Open : ""}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.bar3Open : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className={styles.mobileMenu} aria-label="Mobile navigation">
          <div className={styles.mobileGroup}>
            <button
              type="button"
              className={styles.mobileLink}
              onClick={() => setMobileTreatmentsOpen((v) => !v)}
              aria-expanded={mobileTreatmentsOpen}
            >
              Treatments
              <Icon
                name="chevron-down"
                size={16}
                className={mobileTreatmentsOpen ? styles.chevronOpen : ""}
              />
            </button>
            {mobileTreatmentsOpen && (
              <div className={styles.mobileSubLinks}>
                {TREATMENTS.map((t) => (
                  <Link
                    key={t.id}
                    href={`/treatments#${t.id}`}
                    className={styles.mobileSubLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={`btn btn-primary ${styles.mobileCta}`}
            onClick={() => setMenuOpen(false)}
          >
            Book Consultation
          </Link>
        </nav>
      )}
    </header>
  );
}
