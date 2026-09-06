export type IconName =
  | "dna"
  | "refresh"
  | "vial"
  | "egg"
  | "flask"
  | "microscope"
  | "syringe"
  | "snowflake"
  | "clipboard"
  | "clock"
  | "file"
  | "book"
  | "calendar"
  | "globe"
  | "hotel"
  | "stethoscope"
  | "baby"
  | "heart-pulse"
  | "chevron-down"
  | "arrow-right"
  | "whatsapp";

const PATHS: Record<IconName, React.ReactNode> = {
  dna: (
    <>
      <path d="M7 3c0 5 10 5 10 10s-10 5-10 9" />
      <path d="M17 3c0 5-10 5-10 10s10 5 10 9" />
      <path d="M8 7h8M8 12h8M8 17h8" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
      <path d="M3 21v-5h5" />
    </>
  ),
  vial: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v7.5L5.5 18a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L14 10.5V3" />
      <path d="M8 15h8" />
    </>
  ),
  egg: (
    <path d="M12 3C8 8 5 13 5 16.5A7 7 0 0 0 19 16.5C19 13 16 8 12 3Z" />
  ),
  flask: (
    <>
      <path d="M9 2h6" />
      <path d="M10 2v6l-6 11a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-6-11V2" />
      <path d="M7.5 14h9" />
    </>
  ),
  microscope: (
    <>
      <path d="M6 21h12" />
      <path d="M10 21v-4a4 4 0 0 1 4-4h0" />
      <path d="M9 3 6 6" />
      <path d="M11 5 8 8l2.5 2.5a3.5 3.5 0 0 0 5-5L13 3" />
      <path d="M13.5 9.5 17 13" />
      <circle cx="18.5" cy="14.5" r="2.5" />
    </>
  ),
  syringe: (
    <>
      <path d="m18 2 4 4" />
      <path d="m17 7 3-3" />
      <path d="M19 5 8.5 15.5 5 19l-2 2 3-1 3.5-3.5L20 6" />
      <path d="M9 12l3 3" />
      <path d="M12 9l3 3" />
    </>
  ),
  snowflake: (
    <>
      <path d="M12 2v20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
      <path d="M12 8 9.5 5.5M12 8l2.5-2.5M12 16l-2.5 2.5M12 16l2.5 2.5" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 15h6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
      <path d="M4 5.5v15A2.5 2.5 0 0 1 6.5 18H20" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
      <path d="m8.5 15 2 2 4-4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </>
  ),
  hotel: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 11h.01M12 11h.01M15 11h.01" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M6 3v6a4 4 0 0 0 8 0V3" />
      <path d="M10 13v2a5 5 0 0 0 10 0v-1.5" />
      <circle cx="20" cy="10.5" r="1.8" />
    </>
  ),
  baby: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M8.5 9.5c-2.5 1.5-4 4-3 8 .3 1.2 1.3 1.8 2.3 1.4" />
      <path d="M15.5 9.5c2.5 1.5 4 4 3 8-.3 1.2-1.3 1.8-2.3 1.4" />
      <path d="M9.5 6.5c.5.8 1.4 1.2 2.5 1.2s2-.4 2.5-1.2" />
    </>
  ),
  "heart-pulse": (
    <>
      <path d="M12.5 20.6c-4.6-3.1-8.5-6.5-8.5-10.6a4.6 4.6 0 0 1 8.5-2.6 4.6 4.6 0 0 1 8.5 2.6c0 .8-.14 1.53-.4 2.2" />
      <path d="M4 12h3l1.5-3L11 15l1.5-4 1.5 2h4" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  whatsapp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.27-4.36c0-4.55 3.7-8.25 8.26-8.25a8.2 8.2 0 0 1 5.84 2.42 8.2 8.2 0 0 1 2.41 5.84c0 4.55-3.7 8.21-8.25 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.65.81-.8.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31s-.88.86-.88 2.1.9 2.44 1.03 2.61c.12.17 1.78 2.72 4.32 3.81.6.26 1.08.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.29Z"
    />
  ),
};

export default function Icon({
  name,
  size = 22,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const isFilled = name === "whatsapp";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
