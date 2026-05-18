"""
setup.py — Run this once to initialize the database and create the admin user.
Usage:  python setup.py
"""
import os
import sys
import sqlite3
from werkzeug.security import generate_password_hash

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
DB_DIR      = os.path.join(BASE_DIR, 'database')
DB_PATH     = os.path.join(DB_DIR, 'cenksoy_admin.db')
UPLOAD_DIR  = os.path.join(BASE_DIR, 'static', 'uploads')

os.makedirs(DB_DIR,     exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

def init_db(username: str, password: str):
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row

    db.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            username      TEXT    NOT NULL UNIQUE,
            password_hash TEXT    NOT NULL,
            role          TEXT    NOT NULL DEFAULT 'admin',
            created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS blog_posts (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT    NOT NULL,
            slug        TEXT    NOT NULL UNIQUE,
            summary     TEXT,
            content     TEXT,
            image_path  TEXT,
            status      TEXT    NOT NULL DEFAULT 'draft',
            date        TEXT    NOT NULL DEFAULT (date('now'))
        );

        CREATE TABLE IF NOT EXISTS site_content (
            key         TEXT    PRIMARY KEY,
            value       TEXT,
            label       TEXT,
            updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS patient_inquiries (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            email       TEXT,
            phone       TEXT,
            message     TEXT,
            status      TEXT    NOT NULL DEFAULT 'new',
            created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
        );
    """)

    # Insert admin user
    existing = db.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
    if existing:
        print(f"[!] Kullanıcı '{username}' zaten mevcut. Şifre güncelleniyor...")
        db.execute(
            "UPDATE users SET password_hash = ? WHERE username = ?",
            (generate_password_hash(password), username)
        )
    else:
        db.execute(
            "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
            (username, generate_password_hash(password), 'admin')
        )
        print(f"[✓] Admin kullanıcısı '{username}' oluşturuldu.")

    # Seed default site content
    defaults = [
        ('about_doctor',  'Dr. Cahit Cenksoy, Kıbrıs\'ta en yüksek tüp bebek başarı oranına sahip uzman hekimdir.', 'Doktor Hakkında'),
        ('contact_phone', '+90 548 888 0 112',   'İletişim Telefonu'),
        ('contact_email', 'c_cenksoy@hotmail.com','İletişim E-postası'),
        ('clinic_address','Nicosia IVF - Sevinç Hastanesi, Lefkoşa, Kıbrıs', 'Klinik Adresi'),
        ('hero_title',    'Dr. Cahit Cenksoy | Tüp Bebek ve IVF Uzmanı', 'Hero Başlık'),
        ('hero_subtitle', 'Uzman bakım ve şefkatle yönlendirilen, ebeveynlik yolculuğunuza özel en son teknoloji tedaviler.', 'Hero Alt Başlık'),
    ]
    for key, value, label in defaults:
        db.execute(
            "INSERT OR IGNORE INTO site_content (key, value, label) VALUES (?, ?, ?)",
            (key, value, label)
        )

    db.commit()
    db.close()
    print("[✓] Veritabanı başarıyla oluşturuldu:", DB_PATH)


if __name__ == '__main__':
    print("=" * 50)
    print("  Dr. Cahit Cenksoy — Admin Panel Kurulum")
    print("=" * 50)

    uname = input("\nAdmin kullanıcı adı [cahitivf]: ").strip() or "cahitivf"
    pw1   = input("Şifre: ").strip()
    pw2   = input("Şifre (tekrar): ").strip()

    if not pw1:
        print("[!] Şifre boş olamaz.")
        sys.exit(1)

    if pw1 != pw2:
        print("[!] Şifreler eşleşmiyor.")
        sys.exit(1)

    init_db(uname, pw1)

    print("\n" + "=" * 50)
    print("  Kurulum tamamlandı!")
    print(f"  Panel:   http://127.0.0.1:5000/yonetim")
    print(f"  Giriş:   http://127.0.0.1:5000/login")
    print(f"  Blog:    http://127.0.0.1:5000/blog")
    print("\n  Başlatmak için:")
    print("  pip install -r requirements.txt")
    print("  python app.py")
    print("=" * 50)
