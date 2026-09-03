"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CLINIC, TEAM, TREATMENTS, TESTIMONIALS } from "@/data/dummy";
import { fadeUp } from "@/lib/animations";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      {/* ================================================================ */}
      {/* HERO                                                              */}
      {/* ================================================================ */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <motion.div
            className={styles.heroContent}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              className="label"
              variants={fadeUp}
              custom={0}
            >
              Nicosia, Cyprus
            </motion.span>
            <motion.h1 className={styles.heroTitle} variants={fadeUp} custom={1}>
              Fertility care built
              <br />
              <em className={styles.heroEm}>around you.</em>
            </motion.h1>
            <motion.p className={styles.heroSubtitle} variants={fadeUp} custom={2}>
              {CLINIC.description}
            </motion.p>
            <motion.div className={styles.heroActions} variants={fadeUp} custom={3}>
              <Link href="/contact" className="btn btn-primary">
                Book a Free Consultation
              </Link>
              <Link href="/treatments" className="btn btn-outline">
                View Treatments
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.heroImage}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <Image
              src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=900&q=85"
              alt="State-of-the-art fertility laboratory"
              width={900}
              height={700}
              priority
              className={styles.heroImg}
            />
            {/* Floating stat card — purposeful: shows real credential */}
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{CLINIC.cyclesCompleted.toLocaleString()}+</span>
              <span className={styles.statLabel}>Cycles completed</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom anchor */}
        <div className={styles.heroScroll}>
          <span className={styles.heroScrollLine} />
          <span className={styles.heroScrollText}>Scroll to explore</span>
        </div>
      </section>

      {/* ================================================================ */}
      {/* STATS STRIP                                                       */}
      {/* ================================================================ */}
      <section className={`${styles.stats} section--dark`}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[
              { value: `${CLINIC.successRate}%`, label: "Clinical pregnancy rate (donor egg)" },
              { value: `${CLINIC.patientCountries}+`, label: "Countries represented" },
              { value: `${CLINIC.cyclesCompleted.toLocaleString()}+`, label: "IVF cycles completed" },
              { value: `${new Date().getFullYear() - CLINIC.founded}+`, label: "Years of expertise" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className={styles.statItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                variants={fadeUp}
              >
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statDesc}>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TREATMENTS PREVIEW                                                */}
      {/* ================================================================ */}
      <section className="section">
        <div className="container">
          <motion.div
            className={styles.sectionHead}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <span className="label">What we offer</span>
            <h2 className={styles.sectionTitle}>Treatments tailored to your journey</h2>
            <p className={styles.sectionSubtitle}>
              Every fertility path is different. We offer the full spectrum of
              assisted reproduction techniques, each personalised to your
              specific medical profile.
            </p>
          </motion.div>

          <div className={styles.treatmentGrid}>
            {TREATMENTS.slice(0, 6).map((t, i) => (
              <motion.div
                key={t.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i % 3}
                variants={fadeUp}
              >
                <Link href={`/treatments#${t.id}`} className={`card ${styles.treatmentCard}`}>
                  <div className={styles.treatmentImageWrap}>
                    <Image
                      src={t.image}
                      alt={t.title}
                      width={400}
                      height={220}
                      className={styles.treatmentImage}
                    />
                  </div>
                  <div className={styles.treatmentBody}>
                    <span className="label">{t.subtitle}</span>
                    <h3 className={styles.treatmentTitle}>{t.title}</h3>
                    <p className={styles.treatmentDesc}>
                      {t.description.slice(0, 110)}...
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className={styles.centred}>
            <Link href="/treatments" className="btn btn-outline">
              All Treatments
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TEAM PREVIEW                                                      */}
      {/* ================================================================ */}
      <section className={`section section--alt ${styles.teamSection}`}>
        <div className="container">
          <motion.div
            className={styles.sectionHead}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <span className="label">The people behind your care</span>
            <h2 className={styles.sectionTitle}>Meet our specialists</h2>
          </motion.div>

          <div className={styles.teamGrid}>
            {TEAM.slice(0, 3).map((member, i) => (
              <motion.div
                key={member.id}
                className={`card ${styles.teamCard}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                variants={fadeUp}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={480}
                  height={320}
                  className={styles.teamPhoto}
                />
                <div className={styles.teamBody}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamTitle}>{member.title}</p>
                  <div className={styles.teamSpecialty}>{member.specialty}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={styles.centred}>
            <Link href="/team" className="btn btn-outline">
              Full Team
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TESTIMONIALS                                                      */}
      {/* ================================================================ */}
      <section className={`section section--dark ${styles.testimonialSection}`}>
        <div className="container">
          <motion.div
            className={styles.sectionHead}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <span className="label" style={{ color: "var(--color-rose-light)" }}>Patient stories</span>
            <h2 className={`${styles.sectionTitle} text-on-dark`}>
              Lives changed, families built
            </h2>
          </motion.div>

          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.map((t, i) => (
              <motion.blockquote
                key={t.id}
                className={styles.testimonial}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i % 2}
                variants={fadeUp}
              >
                <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
                <footer className={styles.testimonialFooter}>
                  <strong className={styles.testimonialAuthor}>{t.author}</strong>
                  <span className={styles.testimonialMeta}>
                    {t.origin} &middot; {t.treatment}
                  </span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINAL CTA                                                         */}
      {/* ================================================================ */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <motion.div
            className={styles.ctaInner}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <span className="label">Your first step</span>
            <h2 className={styles.ctaTitle}>
              Ready to start your journey?
            </h2>
            <p className={styles.ctaSubtitle}>
              Our patient coordinators are available to answer your questions and
              guide you through your treatment options with no obligation.
            </p>
            <div className={styles.heroActions}>
              <Link href="/contact" className="btn btn-primary">
                Book a Free Consultation
              </Link>
              <Link href="/faq" className="btn btn-outline">
                Read our FAQ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
