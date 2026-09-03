"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FAQS } from "@/data/dummy";
import { fadeUp } from "@/lib/animations";
import styles from "./page.module.css";

function FAQItem({ faq, index }: { faq: (typeof FAQS)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className={`${styles.item} ${open ? styles.itemOpen : ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      custom={index % 4}
      variants={fadeUp}
    >
      <button
        className={styles.question}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`faq-${faq.id}`}
        id={`faq-btn-${faq.id}`}
      >
        <span className={styles.questionText}>{faq.question}</span>
        <span className={`${styles.icon} ${open ? styles.iconOpen : ""}`} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-${faq.id}`}
            role="region"
            aria-labelledby={`faq-btn-${faq.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className={styles.answerWrap}
          >
            <p className={styles.answer}>{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
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
            <span className="label">Common questions</span>
            <h1 className={styles.pageTitle}>FAQ</h1>
            <p className={styles.pageSubtitle}>
              Honest answers to the questions we hear most often from patients
              considering fertility treatment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Accordion */}
      <section className="section">
        <div className="container">
          <div className={styles.faqGrid}>
            <div className={styles.faqList}>
              {FAQS.map((faq, i) => (
                <FAQItem key={faq.id} faq={faq} index={i} />
              ))}
            </div>

            {/* Sidebar CTA — different composition for RHYTHM */}
            <aside className={styles.sidebar}>
              <div className={styles.sideCard}>
                <span className="label">Still have questions?</span>
                <h2 className={styles.sideTitle}>
                  Speak with a coordinator
                </h2>
                <p className={styles.sideText}>
                  Our international patient team speaks English, German, Arabic,
                  Spanish, and Greek. We typically respond within one working day.
                </p>
                <Link href="/contact" className="btn btn-primary">
                  Contact us
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
