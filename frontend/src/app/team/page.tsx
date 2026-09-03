"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TEAM } from "@/data/dummy";
import { fadeUp } from "@/lib/animations";
import styles from "./page.module.css";

export default function TeamPage() {
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
            <span className="label">The people behind your care</span>
            <h1 className={styles.pageTitle}>Our team</h1>
            <p className={styles.pageSubtitle}>
              A multidisciplinary team of specialists, nurses, embryologists,
              psychologists, and coordinators dedicated to your care at every
              step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team grid */}
      <section className="section">
        <div className="container">
          <div className={styles.teamGrid}>
            {TEAM.map((member, i) => (
              <motion.article
                key={member.id}
                className={`card ${styles.card}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i % 3}
                variants={fadeUp}
              >
                <div className={styles.photoWrap}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={480}
                    height={380}
                    className={styles.photo}
                  />
                </div>
                <div className={styles.body}>
                  <div className={styles.meta}>
                    <span className="label">{member.specialty}</span>
                  </div>
                  <h2 className={styles.name}>{member.name}</h2>
                  <p className={styles.title}>{member.title}</p>
                  <p className={styles.bio}>{member.bio}</p>
                  <div className={styles.footer}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Education</span>
                      <span className={styles.infoValue}>{member.education}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Languages</span>
                      <span className={styles.infoValue}>{member.languages.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
