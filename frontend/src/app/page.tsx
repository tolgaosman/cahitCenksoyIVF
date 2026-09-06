"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CLINIC, TEAM, TREATMENTS, TESTIMONIALS, QUICK_LINKS, PROCESS } from "@/data/dummy";
import { fadeUp } from "@/lib/animations";
import { useCountUp } from "@/lib/useCountUp";
import Icon, { type IconName } from "@/components/Icon";
import ProcessModal from "@/components/ProcessModal";
import decoStyles from "@/components/DecoSpheres.module.css";
import styles from "./page.module.css";

function StatItem({
  target,
  suffix = "",
  label,
  i,
}: {
  target: number;
  suffix?: string;
  label: string;
  i: number;
}) {
  const { value, ref } = useCountUp(target);

  return (
    <motion.div
      className={styles.statItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={i}
      variants={fadeUp}
    >
      <span className={styles.statValue} ref={ref as React.Ref<HTMLSpanElement>}>
        {value.toLocaleString("en-US")}
        {suffix}
      </span>
      <span className={styles.statDesc}>{label}</span>
    </motion.div>
  );
}

export default function HomePage() {
  const [activeProcess, setActiveProcess] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const doctor = TEAM[0];

  const scrollTeam = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  const activeStep = PROCESS.find((p) => p.id === activeProcess) ?? null;

  return (
    <>
      {/* ================================================================ */}
      {/* HERO                                                              */}
      {/* ================================================================ */}
      <section className={styles.hero}>
        <div className={`${decoStyles.sphere} ${decoStyles["pink-lg"]} ${styles.heroBlobTop}`} aria-hidden="true" />
        <div className={`${decoStyles.sphere} ${decoStyles["lav-md"]} ${styles.heroBlobBottom}`} aria-hidden="true" />

        <div className={`container ${styles.heroInner}`}>
          <motion.div className={styles.heroContent} initial="hidden" animate="visible">
            <motion.span className="eyebrow" variants={fadeUp} custom={0}>
              <Icon name="baby" size={16} />
              Nicosia, Cyprus
            </motion.span>
            <motion.h1 className={styles.heroTitle} variants={fadeUp} custom={1}>
              <span className="gradient-text">{CLINIC.name}</span>
              <br />
              Fertility care built around you.
            </motion.h1>
            <motion.p className={styles.heroSubtitle} variants={fadeUp} custom={2}>
              {CLINIC.description}
            </motion.p>
            <motion.div className={styles.heroActions} variants={fadeUp} custom={3}>
              <Link href="/contact" className="btn btn-primary">
                <span className="btn-icon">
                  <Icon name="calendar" size={16} />
                </span>
                Book a Free Consultation
              </Link>
              <Link href="/treatments" className="btn btn-secondary">
                View Treatments
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.heroImage}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=900&q=85"
              alt="State-of-the-art fertility laboratory"
              width={900}
              height={700}
              priority
              className={styles.heroImg}
            />
            <div className={`${styles.heroBadge} ${styles.heroBadgeTop}`}>
              <span className={styles.heroBadgeIcon}>
                <Icon name="baby" size={18} />
              </span>
              <div>
                <strong>{CLINIC.cyclesCompleted.toLocaleString("en-GB")}+</strong>
                <span>IVF cycles</span>
              </div>
            </div>
            <div className={`${styles.heroBadge} ${styles.heroBadgeBottom}`}>
              <span className={styles.heroBadgeIcon}>
                <Icon name="heart-pulse" size={18} />
              </span>
              <div>
                <strong>{CLINIC.successRate}%</strong>
                <span>Donor egg success</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* QUICK LINKS — overlaps the hero                                   */}
      {/* ================================================================ */}
      <section className={styles.featuresBar}>
        <div className="container">
          <div className={styles.featuresGrid}>
            {QUICK_LINKS.map((q, i) => (
              <motion.div
                key={q.id}
                className={`card ${styles.featureItem}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                variants={fadeUp}
              >
                <div className="icon-wrapper">
                  <Icon name={q.icon as IconName} size={26} />
                </div>
                <h3 className={styles.featureTitle}>{q.title}</h3>
                <Link href={q.href} className="btn-more">
                  {q.cta} <Icon name="arrow-right" size={12} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ABOUT / DOCTOR BIO                                                */}
      {/* ================================================================ */}
      <section className="section">
        <div className={`container ${styles.aboutGrid}`}>
          <motion.div
            className={styles.aboutMedia}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <Image src={doctor.image} alt={doctor.name} width={480} height={560} className={styles.aboutImg} />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={1}
            variants={fadeUp}
          >
            <span className="eyebrow">{doctor.title}</span>
            <h2 className={styles.aboutTitle}>{doctor.name}</h2>
            <div className={styles.aboutBody}>
              <p>{CLINIC.description}</p>
              <p>{doctor.bio}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TREATMENTS                                                        */}
      {/* ================================================================ */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <span className="eyebrow">What we offer</span>
            <h2>Treatments tailored to your journey</h2>
            <div className="header-line" />
          </motion.div>

          <div className={styles.treatmentGrid}>
            {TREATMENTS.map((t, i) => (
              <motion.div
                key={t.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i % 4}
                variants={fadeUp}
              >
                <Link href={`/treatments#${t.id}`} className={`card ${styles.treatmentCard}`}>
                  <div className="icon-wrapper">
                    <Icon name={t.icon as IconName} size={26} />
                  </div>
                  <h3 className={styles.treatmentTitle}>{t.title}</h3>
                  <span className="btn-more">Details</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PROCESS                                                           */}
      {/* ================================================================ */}
      <section className="section" id="process">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <span className="eyebrow">Step by step</span>
            <h2>Your journey with us</h2>
            <div className="header-line" />
          </motion.div>

          <div className={styles.processGrid}>
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.id}
                className={styles.processCard}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i % 3}
                variants={fadeUp}
              >
                <div className="icon-wrapper">
                  <Icon name={p.icon as IconName} size={24} />
                </div>
                <h3 className={styles.processTitle}>{p.title}</h3>
                <button className="btn-more btn-more--ghost" onClick={() => setActiveProcess(p.id)}>
                  Learn more
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ProcessModal
        open={activeStep !== null}
        title={activeStep?.title ?? ""}
        description={activeStep?.description ?? ""}
        onClose={() => setActiveProcess(null)}
      />

      {/* ================================================================ */}
      {/* TEAM CAROUSEL                                                     */}
      {/* ================================================================ */}
      <section className="section section--alt">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <span className="eyebrow">The people behind your care</span>
            <h2>Meet our specialists</h2>
            <div className="header-line" />
          </motion.div>

          <div className={styles.carouselWrap}>
            <button
              className={styles.carouselBtn}
              onClick={() => scrollTeam(-1)}
              aria-label="Previous team member"
            >
              <Icon name="arrow-right" size={18} className={styles.carouselBtnIconPrev} />
            </button>

            <div className={styles.teamTrack} ref={trackRef}>
              {TEAM.map((member) => (
                <div key={member.id} className={styles.teamCard}>
                  <div className={styles.teamImgWrap}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={360}
                      height={300}
                      className={styles.teamPhoto}
                    />
                    <div className={styles.teamOverlay}>
                      <p>{member.specialty}</p>
                    </div>
                  </div>
                  <div className={styles.teamBody}>
                    <h3 className={styles.teamName}>{member.name}</h3>
                    <p className={styles.teamTitle}>{member.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className={styles.carouselBtn}
              onClick={() => scrollTeam(1)}
              aria-label="Next team member"
            >
              <Icon name="arrow-right" size={18} />
            </button>
          </div>

          <div className={styles.centred}>
            <Link href="/team" className="btn btn-outline">
              Full Team
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* STATS BAND                                                        */}
      {/* ================================================================ */}
      <section className={styles.statsBar}>
        <div className={`container ${styles.statsGrid}`}>
          <StatItem target={CLINIC.successRate} suffix="%" label="Clinical pregnancy rate (donor egg)" i={0} />
          <StatItem target={CLINIC.patientCountries} suffix="+" label="Countries represented" i={1} />
          <StatItem target={CLINIC.cyclesCompleted} suffix="+" label="IVF cycles completed" i={2} />
          <StatItem
            target={new Date().getFullYear() - CLINIC.founded}
            suffix="+"
            label="Years of expertise"
            i={3}
          />
        </div>
      </section>

      {/* ================================================================ */}
      {/* TESTIMONIALS                                                      */}
      {/* ================================================================ */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <span className="eyebrow">Patient stories</span>
            <h2>Lives changed, families built</h2>
            <div className="header-line" />
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
            <span className="eyebrow">Your first step</span>
            <h2 className={styles.ctaTitle}>Ready to start your journey?</h2>
            <p className={styles.ctaSubtitle}>
              Our patient coordinators are available to answer your questions and
              guide you through your treatment options with no obligation.
            </p>
            <div className={styles.heroActions}>
              <Link href="/contact" className="btn btn-primary">
                <span className="btn-icon">
                  <Icon name="calendar" size={16} />
                </span>
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
