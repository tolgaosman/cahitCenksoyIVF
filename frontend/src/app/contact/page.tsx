"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CLINIC } from "@/data/dummy";
import { fadeUp } from "@/lib/animations";
import styles from "./page.module.css";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    treatment: "",
    message: "",
  });
  const [status, setStatus] = useState<FormState>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulated submission (portfolio demo — no real backend)
    await new Promise((res) => setTimeout(res, 1200));
    setStatus("success");
  };

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
            <span className="label">We would love to hear from you</span>
            <h1 className={styles.pageTitle}>Contact us</h1>
            <p className={styles.pageSubtitle}>
              Book a free initial consultation, ask a question, or simply find
              out whether our clinic is the right fit for your journey.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {/* Contact form */}
            <motion.div
              className={styles.formWrap}
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
            >
              {status === "success" ? (
                <div className={styles.success}>
                  <span className={styles.successIcon} aria-hidden="true">✓</span>
                  <h2 className={styles.successTitle}>Thank you</h2>
                  <p className={styles.successText}>
                    We have received your message and one of our patient
                    coordinators will be in touch within one working day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  <h2 className={styles.formTitle}>Send us a message</h2>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label htmlFor="name" className={styles.label}>
                        Full name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="email" className={styles.label}>
                        Email address <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label htmlFor="phone" className={styles.label}>
                        Phone / WhatsApp
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="treatment" className={styles.label}>
                        Treatment of interest
                      </label>
                      <select
                        id="treatment"
                        name="treatment"
                        value={form.treatment}
                        onChange={handleChange}
                        className={styles.input}
                      >
                        <option value="">Select a treatment</option>
                        <option value="IVF">IVF</option>
                        <option value="ICSI">ICSI</option>
                        <option value="Egg Donation">Egg Donation</option>
                        <option value="Sperm Donation">Sperm Donation</option>
                        <option value="PGT-A">PGT-A / PGT-M</option>
                        <option value="Fertility Preservation">Fertility Preservation</option>
                        <option value="Embryo Donation">Embryo Donation</option>
                        <option value="Other">Other / Not sure</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="message" className={styles.label}>
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={form.message}
                      onChange={handleChange}
                      className={`${styles.input} ${styles.textarea}`}
                      placeholder="Tell us a bit about where you are in your fertility journey and any questions you have..."
                    />
                  </div>

                  <p className={styles.privacy}>
                    Your information is kept strictly confidential and will only
                    be used to respond to your enquiry.
                  </p>

                  <button
                    type="submit"
                    className={`btn btn-primary ${styles.submit}`}
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Sending..." : "Send message"}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Info sidebar */}
            <motion.aside
              className={styles.info}
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
            >
              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>Clinic details</h2>
                <dl className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <dt className={styles.infoLabel}>Address</dt>
                    <dd className={styles.infoValue}>{CLINIC.address}</dd>
                  </div>
                  <div className={styles.infoItem}>
                    <dt className={styles.infoLabel}>Phone</dt>
                    <dd className={styles.infoValue}>
                      <a href={`tel:${CLINIC.phone.replace(/\s/g, "")}`} className={styles.infoLink}>
                        {CLINIC.phone}
                      </a>
                    </dd>
                  </div>
                  <div className={styles.infoItem}>
                    <dt className={styles.infoLabel}>WhatsApp</dt>
                    <dd className={styles.infoValue}>
                      <a
                        href={`https://wa.me/${CLINIC.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.infoLink}
                      >
                        {CLINIC.whatsapp}
                      </a>
                    </dd>
                  </div>
                  <div className={styles.infoItem}>
                    <dt className={styles.infoLabel}>Email</dt>
                    <dd className={styles.infoValue}>
                      <a href={`mailto:${CLINIC.email}`} className={styles.infoLink}>
                        {CLINIC.email}
                      </a>
                    </dd>
                  </div>
                  <div className={styles.infoItem}>
                    <dt className={styles.infoLabel}>Response time</dt>
                    <dd className={styles.infoValue}>Within 1 working day</dd>
                  </div>
                </dl>
              </div>

              <div className={styles.note}>
                <p>
                  <strong>Portfolio note:</strong> This site is a design
                  demonstration. Form submissions are simulated and no data is
                  transmitted.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </>
  );
}
