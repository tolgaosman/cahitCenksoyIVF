import Link from "next/link";
import { CLINIC } from "@/data/dummy";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  {
    heading: "Treatments",
    links: [
      { href: "/treatments#ivf", label: "IVF" },
      { href: "/treatments#icsi", label: "ICSI" },
      { href: "/treatments#egg-donation", label: "Egg Donation" },
      { href: "/treatments#pgt", label: "PGT-A / PGT-M" },
      { href: "/treatments#freezing", label: "Fertility Preservation" },
    ],
  },
  {
    heading: "Clinic",
    links: [
      { href: "/team", label: "Our Team" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        {/* Brand column */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>NFC</span>
            <span className={styles.logoText}>{CLINIC.name}</span>
          </div>
          <p className={styles.tagline}>{CLINIC.tagline}</p>
          <address className={styles.address}>
            <p>{CLINIC.address}</p>
            <a href={`tel:${CLINIC.phone.replace(/\s/g, "")}`} className={styles.contactLink}>
              {CLINIC.phone}
            </a>
            <a href={`mailto:${CLINIC.email}`} className={styles.contactLink}>
              {CLINIC.email}
            </a>
          </address>
        </div>

        {/* Link columns */}
        {FOOTER_LINKS.map((col) => (
          <div key={col.heading} className={styles.col}>
            <h3 className={styles.colHeading}>{col.heading}</h3>
            <ul className={styles.colLinks}>
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.colLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact column */}
        <div className={styles.col}>
          <h3 className={styles.colHeading}>Book a Consultation</h3>
          <p className={styles.colText}>
            Speak with our patient coordinators to find out which treatment path
            is right for you.
          </p>
          <Link href="/contact" className={`btn btn-primary ${styles.cta}`}>
            Get in Touch
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className="container">
          <p className={styles.legal}>
            &copy; {year} {CLINIC.name}. All rights reserved. This site is a
            portfolio demonstration.
          </p>
        </div>
      </div>
    </footer>
  );
}
