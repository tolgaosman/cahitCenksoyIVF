"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { TREATMENTS } from "@/data/dummy";
import { fadeUp } from "@/lib/animations";
import styles from "./page.module.css";

export default function TreatmentsPage() {
  return (
    <>
      {/* Page header */}
      <section className={styles.header}>
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className={styles.headerInner}
          >
            <span className="label">What we offer</span>
            <h1 className={styles.pageTitle}>Treatments</h1>
            <p className={styles.pageSubtitle}>
              From standard IVF to complex donor cycles and genetic testing, we
              offer the complete spectrum of assisted reproductive technology,
              always tailored to your individual profile.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Treatments list — alternating layout for rhythm */}
      <section className="section">
        <div className="container">
          <div className={styles.list}>
            {TREATMENTS.map((t, i) => (
              <motion.article
                key={t.id}
                id={t.id}
                className={`${styles.treatment} ${i % 2 === 1 ? styles.reverse : ""}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={0}
                variants={fadeUp}
              >
                <div className={styles.imageWrap}>
                  <Image
                    src={t.image}
                    alt={t.title}
                    width={600}
                    height={440}
                    className={styles.image}
                  />
                </div>
                <div className={styles.content}>
                  <span className="label">{t.subtitle}</span>
                  <h2 className={styles.treatmentTitle}>{t.title}</h2>
                  <p className={styles.description}>{t.description}</p>
                  <p className={styles.duration}>
                    <strong>Typical duration:</strong> {t.duration}
                  </p>
                  <ul className={styles.highlights}>
                    {t.highlights.map((h) => (
                      <li key={h} className={styles.highlight}>
                        <span className={styles.bullet} aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="btn btn-primary">
                    Enquire about this treatment
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
