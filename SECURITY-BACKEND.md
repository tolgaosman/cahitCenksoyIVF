# Backend Güvenlik Sertleştirme Rehberi (Render — Node/Express)

Bu dosya **bu (frontend) repoda değil**, ayrı çalışan Render backend'ine
(`cahit-cenksoy-admin.onrender.com`) uygulanacak kopyala-yapıştır kod ve konfigürasyon
bloklarını içerir. Buradaki kod **bu repoda çalıştırılmaz**; backend repona taşı.

Frontend tarafı (`contact.html`) zaten `POST /api/basvuru` çağrısı yapıyor; aşağıdaki
sertleştirmeler bu endpoint'i ve admin/auth uçlarını kapsar.

## 0. Kurulum

```bash
npm i express cors helmet express-rate-limit zod cookie-parser jsonwebtoken
# (TypeScript ise) npm i -D typescript @types/express @types/cors @types/cookie-parser @types/jsonwebtoken
```

`.env` yönetimi: `.env.example` dosyasını referans al. Yerelde `.env` oluştur (git'e gitmez —
`.gitignore` bunu engelliyor). Render'da değerleri **Dashboard > Environment** bölümünden gir.
Node 20+ ise `node --env-file=.env server.js` ile yükleyebilir veya `dotenv` kullanabilirsin.

---

## 1. Güvenli uygulama iskeleti (`server.js` / `app.ts`)

```js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.set("trust proxy", 1); // Render reverse-proxy arkasında doğru IP için (rate-limit'in işine yarar)

// --- 6. Helmet: güvenlik header'ları (XSS, clickjacking, MIME-sniffing) ---
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "frame-ancestors": ["'none'"],          // clickjacking koruması (X-Frame-Options eşdeğeri)
      "object-src": ["'none'"],
      "base-uri": ["'self'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  // helmet zaten X-Content-Type-Options: nosniff ve X-Frame-Options ekler
}));

// --- 2. Sıkı CORS (wildcard YOK) ---
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, cb) {
    // origin yoksa (server-to-server, curl) izin ver; tarayıcı isteklerinde allowlist'i zorla
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS: origin reddedildi"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // HTTP-only cookie kullanılacaksa gerekli
  maxAge: 86400,
}));

app.use(express.json({ limit: "32kb" })); // gövde boyutu sınırı (DoS azaltma)
app.use(cookieParser());
```

---

## 2. Rate limiting (Brute-Force / DDoS) — `middleware/rateLimit.js`

```js
import rateLimit from "express-rate-limit";

// Tüm API için makul genel limit
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 dk
  max: 300,                   // IP başına 300 istek
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth / form gibi hassas uçlar için SIKI limit
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                    // IP başına 10 deneme
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Çok fazla deneme. Lütfen sonra tekrar deneyin." },
});
```

Kullanım:

```js
app.use("/api/", globalLimiter);
app.use("/api/login", strictLimiter);
app.use("/api/basvuru", strictLimiter);
app.use("/api/reset", strictLimiter);
```

---

## 3. Input doğrulama & injection koruması (Zod) — `validation.js`

```js
import { z } from "zod";

// contact.html'in gönderdiği gövde:  { name, email, phone?, message }
export const basvuruSchema = z.object({
  name:    z.string().trim().min(2).max(120),
  email:   z.string().trim().email().max(160),
  phone:   z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(1).max(4000),
}).strict(); // bilinmeyen alanları reddet (NoSQL operatör enjeksiyonunu da engeller)

// Genel doğrulama middleware fabrikası
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Geçersiz veri", details: result.error.flatten() });
  }
  req.body = result.data; // sanitize edilmiş/temiz veriyi geri yaz
  next();
};
```

Kullanım + NoSQL injection notu:

```js
app.post("/api/basvuru", validate(basvuruSchema), async (req, res) => {
  const { name, email, phone, message } = req.body; // sadece tip-güvenli string'ler
  // Firestore Admin SDK ile YAZARKEN alanları string olarak ata; req.body'yi olduğu gibi
  // spread ETME (`...req.body`). Mongo kullanıyorsan `$gt` vb. operatör enjeksiyonu .strict()
  // ile zaten engellendi; ayrıca express-mongo-sanitize eklenebilir.
  await db.collection("basvurular").add({ name, email, phone, message, createdAt: Date.now() });
  res.json({ ok: true });
});
```

---

## 4. Güvenli şifre sıfırlama — 30 dakikalık token — `resetToken.js`

> Not: Firebase Auth'un kendi `sendPasswordResetEmail` akışı kullanılıyorsa link ömrü Firebase
> tarafından yönetilir (client'tan 30 dk'ya sabitlenemez). Aşağıdaki kendi token mekanizman için.

```js
import crypto from "crypto";

const TTL_MS = (Number(process.env.RESET_TOKEN_TTL_MINUTES) || 30) * 60 * 1000;

// Token üret (e-postayla gönderilecek ham token) + DB'ye HASH'ini sakla
export function createResetToken() {
  const raw = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(raw).digest("hex");
  const expiresAt = Date.now() + TTL_MS;       // üretimden tam 30 dk sonra geçersiz
  return { raw, tokenHash, expiresAt };
}

// /api/reset isteği: kullanıcıya mail at
// Kayıt: { tokenHash, expiresAt, used:false, userId } olarak DB'ye yaz, MAİL'e `raw`'ı koy.

// Doğrulama (şifre değiştirme adımında)
export function verifyResetToken(record, rawFromLink) {
  if (!record || record.used) return false;
  if (Date.now() > record.expiresAt) return false;          // süre dolmuş
  const incoming = crypto.createHash("sha256").update(rawFromLink).digest("hex");
  // sabit zamanlı karşılaştırma (timing attack koruması)
  const a = Buffer.from(incoming), b = Buffer.from(record.tokenHash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
// Başarılı doğrulamadan sonra: record.used = true (tek kullanımlık) + yeni şifreyi yaz.
```

---

## 5. JWT & oturum güvenliği (HTTP-only cookie) — `auth.js`

```js
import jwt from "jsonwebtoken";

const COOKIE = "session";
const isProd = process.env.NODE_ENV === "production";

export function issueSession(res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  });
  // Token'ı localStorage'a DEĞİL, HTTP-only cookie'ye koy (XSS ile çalınamaz)
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: isProd,             // sadece HTTPS
    sameSite: "strict",         // CSRF azaltma
    maxAge: 2 * 60 * 60 * 1000, // 2 saat
    path: "/",
  });
}

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.session;
    if (!token) return res.status(401).json({ error: "Yetkisiz" });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Geçersiz oturum" });
  }
}

export function logout(res) {
  res.clearCookie(COOKIE, { path: "/" });
}
```

---

## 6. Breach / şüpheli aktivite uyarısı — `alert.js`

```js
// Discord/Slack webhook'a anlık alarm + basit başarısız-giriş sayacı
const failCounts = new Map(); // ip -> { n, ts }  (kalıcılık için Redis/DB tercih et)
const THRESHOLD = Number(process.env.ALERT_FAIL_THRESHOLD) || 5;

export async function sendAlert(title, detail) {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Discord: { content }, Slack: { text } — ikisini de gönderiyoruz
      body: JSON.stringify({
        content: `🚨 **${title}**\n${detail}`,
        text: `🚨 ${title}\n${detail}`,
      }),
    });
  } catch (e) {
    console.error("Alert gönderilemedi:", e);
  }
}

// Başarısız giriş takibi
export function recordFailedLogin(ip) {
  const now = Date.now();
  const rec = failCounts.get(ip) || { n: 0, ts: now };
  if (now - rec.ts > 15 * 60 * 1000) { rec.n = 0; rec.ts = now; } // 15 dk pencere
  rec.n++;
  failCounts.set(ip, rec);
  if (rec.n >= THRESHOLD) {
    sendAlert("Şüpheli giriş aktivitesi", `IP ${ip} son 15 dk içinde ${rec.n} başarısız giriş denedi.`);
    rec.n = 0; // tekrar tekrar spam etme
  }
}
export function resetFailedLogin(ip) { failCounts.delete(ip); }
```

Login endpoint'inde kullanım:

```js
app.post("/api/login", strictLimiter, validate(loginSchema), async (req, res) => {
  const ip = req.ip;
  const ok = await verifyCredentials(req.body.email, req.body.password); // kendi kontrolün
  if (!ok) {
    recordFailedLogin(ip);
    return res.status(401).json({ error: "Giriş başarısız" });
  }
  resetFailedLogin(ip);
  issueSession(res, { sub: req.body.email, role: "admin" });
  res.json({ ok: true });
});
```

---

## 7. Entegrasyon kontrol listesi

1. `npm i` ile bağımlılıkları kur, `.env`'i doldur (Render'da Environment Variables).
2. `server.js`'i (Bölüm 1) helmet + CORS + json limit + cookieParser ile sertleştir.
3. Limiter'ları (Bölüm 2) `/api/`, `/api/login`, `/api/basvuru`, `/api/reset` uçlarına bağla.
4. Tüm POST uçlarına Zod `validate(...)` middleware ekle (Bölüm 3).
5. Admin uçlarını `requireAuth` ile koru; token'ı HTTP-only cookie'de tut (Bölüm 5).
6. Şifre sıfırlamayı kendi mekanizmanla yapıyorsan 30 dk token (Bölüm 4) uygula.
7. Login + kritik olaylara breach alert (Bölüm 6) bağla; `ALERT_WEBHOOK_URL`'i ayarla.
8. **CORS testi:** `ALLOWED_ORIGINS`'e yalnız GitHub Pages domainin + localhost olsun;
   başka origin'den fetch denemesi tarayıcıda CORS hatası vermeli.
9. **Sır taraması:** repoda `.env` / service account JSON OLMADIĞINI doğrula
   (`git ls-files | grep -i env` boş dönmeli). Yanlışlıkla commit edildiyse anahtarları
   Firebase/Render'dan **rotate et**.

> Hatırlatma: Firebase web `apiKey` (client) açıkta olması normaldir — bu bir sır değildir,
> gerçek koruma Firestore/Storage **Security Rules** + bu backend yetkilendirmesidir.
