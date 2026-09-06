import { CLINIC } from "@/data/dummy";
import Icon from "./Icon";
import styles from "./WhatsAppFab.module.css";

export default function WhatsAppFab() {
  const number = CLINIC.whatsapp.replace(/\D/g, "");

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.fab}
      aria-label={`Chat with ${CLINIC.name} on WhatsApp`}
    >
      <span className={styles.ring} aria-hidden="true" />
      <Icon name="whatsapp" size={30} />
    </a>
  );
}
