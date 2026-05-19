"""
Dr. Cahit Cenksoy IVF - Secure Admin Panel
Flask + SQLite Backend
Author: Admin Panel Generator
"""

import os
import re
import uuid
import sqlite3
from datetime import datetime, date
from functools import wraps

def format_db_row(row):
    if row is None:
        return None
    d = dict(row)
    if 'date' in d and d['date']:
        val = d['date']
        if isinstance(val, (datetime, date)):
            d['date'] = val.strftime('%Y-%m-%d')
        elif isinstance(val, str):
            if len(val) >= 10 and val[4] == '-' and val[7] == '-':
                d['date'] = val[:10]
    return d

# pyrefly: ignore [missing-import]
from flask import (
    Flask, render_template, request, redirect, url_for,
    session, flash, g, jsonify, abort
)
# pyrefly: ignore [missing-import]
from werkzeug.security import generate_password_hash, check_password_hash
import html

# ─── App Configuration ────────────────────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
DB_PATH  = os.path.join(UPLOAD_FOLDER, 'cenksoy_admin.db')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'CHANGE_THIS_IN_PRODUCTION_df9a3f2e7c1b4d8a')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'database'), exist_ok=True)


# ─── Dual Database Adapter (SQLite & PostgreSQL) ──────────────────────────────
DATABASE_URL = os.environ.get('DATABASE_URL')
IS_POSTGRES = False

if DATABASE_URL:
    try:
        import psycopg2
        import psycopg2.extras
        IS_POSTGRES = True
    except ImportError:
        print("Warning: DATABASE_URL is set but 'psycopg2' is not installed. Falling back to SQLite.")

class PostgreSQLWrapper:
    def __init__(self, conn):
        self.conn = conn

    def execute(self, sql, params=None):
        sql = sql.replace('?', '%s')
        
        if "INSERT OR IGNORE" in sql:
            sql = sql.replace("INSERT OR IGNORE INTO", "INSERT INTO")
            if "site_content" in sql:
                sql += " ON CONFLICT (key) DO NOTHING"
            elif "users" in sql:
                sql += " ON CONFLICT (username) DO NOTHING"
            else:
                sql += " ON CONFLICT DO NOTHING"

        if "SELECT last_insert_rowid()" in sql:
            cur = self.conn.cursor()
            cur.execute("SELECT lastval()")
            val = cur.fetchone()[0]
            class MockCursor:
                def fetchone(self):
                    return [val]
            return MockCursor()

        cur = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            cur.execute(sql, params)
        except Exception as e:
            self.conn.rollback()
            raise e
        return CursorWrapper(cur)

    def executescript(self, sql_script):
        cur = self.conn.cursor()
        statements = [s.strip() for s in sql_script.split(';') if s.strip()]
        for stmt in statements:
            if stmt.upper().startswith("PRAGMA"):
                continue
            stmt = stmt.replace('?', '%s')
            try:
                cur.execute(stmt)
            except Exception as e:
                self.conn.rollback()
                raise e
        self.conn.commit()

    def commit(self):
        self.conn.commit()

    def close(self):
        self.conn.close()

class PostgreSQLRow(dict):
    def __init__(self, dict_row):
        super().__init__(dict_row)
        self._keys = list(dict_row.keys())

    def __getitem__(self, key):
        if isinstance(key, int):
            return super().__getitem__(self._keys[key])
        return super().__getitem__(key)

class CursorWrapper:
    def __init__(self, cur):
        self.cur = cur

    def fetchone(self):
        row = self.cur.fetchone()
        if row is not None:
            return PostgreSQLRow(row)
        return None

    def fetchall(self):
        rows = self.cur.fetchall()
        return [PostgreSQLRow(r) for r in rows]


# ─── Database Helpers ─────────────────────────────────────────────────────────

def get_db():
    if 'db' not in g:
        if IS_POSTGRES:
            url = DATABASE_URL
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql://", 1)
            conn = psycopg2.connect(url)
            g.db = PostgreSQLWrapper(conn)
        else:
            g.db = sqlite3.connect(DB_PATH)
            g.db.row_factory = sqlite3.Row
            g.db.execute("PRAGMA journal_mode=WAL;")
            g.db.execute("PRAGMA foreign_keys=ON;")
    return g.db

@app.teardown_appcontext
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db():
    """Initialize database schema and seed admin user."""
    if IS_POSTGRES:
        url = DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        conn = psycopg2.connect(url)
        db = PostgreSQLWrapper(conn)
        
        db.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id          SERIAL PRIMARY KEY,
                username    TEXT    NOT NULL UNIQUE,
                password_hash TEXT  NOT NULL,
                role        TEXT    NOT NULL DEFAULT 'admin',
                created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                avatar_path TEXT
            );

            CREATE TABLE IF NOT EXISTS blog_posts (
                id          SERIAL PRIMARY KEY,
                title       TEXT    NOT NULL,
                slug        TEXT    NOT NULL UNIQUE,
                summary     TEXT,
                content     TEXT,
                image_path  TEXT,
                status      TEXT    NOT NULL DEFAULT 'draft',
                date        DATE    NOT NULL DEFAULT CURRENT_DATE,
                author      TEXT    DEFAULT 'Dr. Cahit Cenksoy'
            );

            CREATE TABLE IF NOT EXISTS site_content (
                key         TEXT    PRIMARY KEY,
                value       TEXT,
                label       TEXT,
                updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS patient_inquiries (
                id          SERIAL PRIMARY KEY,
                name        TEXT    NOT NULL,
                email       TEXT,
                phone       TEXT,
                message     TEXT,
                status      TEXT    NOT NULL DEFAULT 'new',
                created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS team_members (
                id          SERIAL PRIMARY KEY,
                name        TEXT    NOT NULL,
                role        TEXT    NOT NULL,
                image_path  TEXT,
                bio         TEXT,
                sort_order  INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS faqs (
                id          SERIAL PRIMARY KEY,
                question    TEXT    NOT NULL,
                answer      TEXT    NOT NULL,
                category    TEXT    NOT NULL DEFAULT 'ivf-process',
                status      TEXT    NOT NULL DEFAULT 'published',
                sort_order  INTEGER DEFAULT 0,
                created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        """)
    else:
        db = sqlite3.connect(DB_PATH)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA journal_mode=WAL;")
        db.execute("PRAGMA foreign_keys=ON;")

        db.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                username    TEXT    NOT NULL UNIQUE,
                password_hash TEXT  NOT NULL,
                role        TEXT    NOT NULL DEFAULT 'admin',
                created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
                avatar_path TEXT
            );

            CREATE TABLE IF NOT EXISTS blog_posts (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                title       TEXT    NOT NULL,
                slug        TEXT    NOT NULL UNIQUE,
                summary     TEXT,
                content     TEXT,
                image_path  TEXT,
                status      TEXT    NOT NULL DEFAULT 'draft',
                date        TEXT    NOT NULL DEFAULT (date('now')),
                author      TEXT    DEFAULT 'Dr. Cahit Cenksoy'
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

            CREATE TABLE IF NOT EXISTS team_members (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name        TEXT    NOT NULL,
                role        TEXT    NOT NULL,
                image_path  TEXT,
                bio         TEXT,
                sort_order  INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS faqs (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                question    TEXT    NOT NULL,
                answer      TEXT    NOT NULL,
                category    TEXT    NOT NULL DEFAULT 'ivf-process',
                status      TEXT    NOT NULL DEFAULT 'published',
                sort_order  INTEGER DEFAULT 0,
                created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
            );
        """)

        # Dynamic schema migrations for SQLite
        try:
            db.execute("ALTER TABLE blog_posts ADD COLUMN author TEXT DEFAULT 'Dr. Cahit Cenksoy'")
            db.commit()
        except sqlite3.OperationalError:
            pass

        try:
            db.execute("ALTER TABLE users ADD COLUMN avatar_path TEXT")
            db.commit()
        except sqlite3.OperationalError:
            pass

    # Seed default admin user if none exists
    existing = db.execute("SELECT id FROM users LIMIT 1").fetchone()
    if not existing:
        pw_hash = generate_password_hash('123456')
        db.execute(
            "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
            ('cahitivf', pw_hash, 'admin')
        )

    # Seed default site_content keys
    defaults = [
        ('about_doctor',  'Dr. Cahit Cenksoy hakkında metin...',  'Doktor Hakkında'),
        ('contact_phone', '+90 548 888 0 112',                    'İletişim Telefonu'),
        ('contact_email', 'c_cenksoy@hotmail.com',                'İletişim E-postası'),
        ('clinic_address','Nicosia IVF - Sevinç Hastanesi, Lefkoşa', 'Klinik Adresi'),
        ('hero_title',   'Dr. Cahit Cenksoy | IVF Uzmanı',        'Hero Başlık'),
    ]
    for key, value, label in defaults:
        db.execute(
            "INSERT OR IGNORE INTO site_content (key, value, label) VALUES (?, ?, ?)",
            (key, value, label)
        )

    # Seed default team members if none exist
    existing_team = db.execute("SELECT COUNT(*) FROM team_members").fetchone()
    if existing_team and existing_team[0] == 0:
        team_seeds = [
            ('Op. Dr. Cahit Cenksoy', 'Kadın Hastalıkları, Doğum Ve Tüp Bebek Uzmanı', 'cahit.jpg', "Dr. Cahit Cenksoy, Kıbrıs'ta en yüksek tüp bebek başarı oranına sahip, en genç, en tecrübeli ve en başarılı Kadın Doğum Uzmanlarından biridir. Hem sezaryen hem de doğal doğumlarda adada en fazla doğum yaptıran doktor olduğu bilinmektedir.", 1),
            ('Hayriye Karakaya', 'Embriyolog', 'hayriye.jpg', '<ul style="list-style: none; padding: 0; margin: 0; text-align: left; font-size: 0.85rem;"><li style="margin-bottom: 5px;"><i class="fa-solid fa-language" style="margin-right: 8px;"></i><b>Dil:</b> İngilizce – Bulgarca – İspanyolca</li><li style="margin-bottom: 5px;"><i class="fa-solid fa-graduation-cap" style="margin-right: 8px;"></i><b>Yüksek Lisans:</b> T.C. İstanbul Bilim Üniversitesi (2009-2012)</li><li style="margin-bottom: 5px;"><i class="fa-solid fa-file-lines" style="margin-right: 8px;"></i><b>Tez:</b> İnsan Normospermi, Oligospermi, Astenospermi Grupları Arasında Nitrik Oksit İzoformlarının Etkisi</li><li style="margin-bottom: 5px;"><i class="fa-solid fa-book" style="margin-right: 8px;"></i><b>Lisans:</b> T.C. Eskişehir Osmangazi Üniversitesi (2004-2008)</li></ul>', 2),
            ('Güneş Özbaş', 'Yabancı Hasta Koordinatörü', 'gunes.jpg', '<ul style="list-style: none; padding: 0; margin: 0; text-align: left; font-size: 0.85rem;"><li style="margin-bottom: 8px;"><i class="fa-solid fa-language" style="margin-right: 8px;"></i><b>Dil:</b> İngilizce – Bulgarca – İspanyolca</li><li style="margin-bottom: 8px;"><i class="fa-solid fa-graduation-cap" style="margin-right: 8px;"></i><b>Eğitim:</b> Bilgisayar Programcılığı - Turizm</li><li style="margin-bottom: 8px;"><i class="fa-solid fa-briefcase" style="margin-right: 8px;"></i><b>Deneyim:</b> 9 Yıl Bankacılık + 1 Yıl Yabancı Hasta Koordinatörlüğü</li></ul>', 3),
            ('Gülseren Akbal', 'Tıbbi Dokümantasyon Ve Sekreter', 'gulseren.jpg', '<ul style="list-style: none; padding: 0; margin: 0; text-align: left; font-size: 0.85rem;"><li style="margin-bottom: 8px;"><i class="fa-solid fa-graduation-cap" style="margin-right: 8px;"></i><b>Eğitim:</b> Yakın Doğu Üniversitesi Tıp Fakültesi</li><li style="margin-bottom: 8px;"><i class="fa-solid fa-stethoscope" style="margin-right: 8px;"></i><b>Uzmanlık:</b> Kadın Hastalıkları ve Doğum</li><li style="margin-bottom: 8px;"><i class="fa-solid fa-hospital" style="margin-right: 8px;"></i><b>Deneyim:</b> Etlik Zübeyde Hanım Hastanesi & Dr. Burhan Nalbantoğlu Hastanesi</li></ul>', 4),
            ('Selcan Yüksel Çay', 'Hasta Koordinatörü', 'selcan.jpg', '<ul style="list-style: none; padding: 0; margin: 0; text-align: left; font-size: 0.85rem;"><li style="margin-bottom: 8px;"><i class="fa-solid fa-language" style="margin-right: 8px;"></i><b>Dil:</b> İngilizce</li><li style="margin-bottom: 8px;"><i class="fa-solid fa-school" style="margin-right: 8px;"></i><b>Eğitim:</b> İnebolu Sağlık Meslek Lisesi - Acil Tıp Teknisyenliği</li><li style="margin-bottom: 8px;"><i class="fa-solid fa-certificate" style="margin-right: 8px;"></i><b>Sertifika:</b> Özel İş Yeri Hemşireliği</li></ul>', 5),
            ('Zekiye Niyazi', 'Teknik Personel', 'zekiye.jpg', "Zekiye Niyazi, 5 yıldır ekibimizin ayrılmaz bir parçasıdır. Deneyimi ve iş disipliniyle operasyonel süreçlerin sorunsuz ilerlemesine katkı sağlarken, güler yüzüyle de güven vermektedir.", 6),
            ('Elham Morandi', 'Hemşire', 'elham.jpg', '<ul style="list-style: none; padding: 0; margin: 0; text-align: left; font-size: 0.85rem;"><li style="margin-bottom: 8px;"><i class="fa-solid fa-language" style="margin-right: 8px;"></i><b>Dil:</b> Farsça - Türkçe - İngilizce</li><li style="margin-bottom: 8px;"><i class="fa-solid fa-graduation-cap" style="margin-right: 8px;"></i><b>Eğitim - Lisans:</b> Hemşirelik – Islamic Azad University of Tuyserkan</li><li style="margin-bottom: 8px;"><i class="fa-solid fa-user-graduate" style="margin-right: 8px;"></i><b>Master:</b> Cerrahi Hemşirelik – Yakın Doğu Üniversitesi</li></ul>', 7)
        ]
        for name, role, img_name, bio, sort_order in team_seeds:
            db.execute(
                "INSERT INTO team_members (name, role, image_path, bio, sort_order) VALUES (?, ?, ?, ?, ?)",
                (name, role, img_name, bio, sort_order)
            )

    db.commit()
    db.close()
    print("[✓] Database initialized successfully.")


# ─── Security Helpers ─────────────────────────────────────────────────────────

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def sanitize_filename(filename: str) -> str:
    """Generate a unique, safe filename to prevent path traversal."""
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else 'bin'
    safe = f"{uuid.uuid4().hex}.{ext}"
    return safe


def save_image_as_base64(file) -> str:
    import base64
    image_data = file.read()
    ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'jpg'
    mime_type = 'image/jpeg' if ext in ['jpg', 'jpeg'] else f'image/{ext}'
    if mime_type == 'image/svg':
        mime_type = 'image/svg+xml'
    base64_str = base64.b64encode(image_data).decode('utf-8')
    return f"data:{mime_type};base64,{base64_str}"


def slugify(text: str) -> str:
    """Convert title text to a URL-safe slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text


def login_required(f):
    """Decorator to protect admin routes."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            flash('Bu sayfaya erişmek için giriş yapmanız gerekmektedir.', 'danger')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated


def escape_html(text: str) -> str:
    """Escape HTML special characters to prevent XSS."""
    return html.escape(str(text)) if text else ''


# ─── Auth Routes ──────────────────────────────────────────────────────────────

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))

    error = None
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')

        if not username or not password:
            error = 'Kullanıcı adı ve şifre gereklidir.'
        else:
            db   = get_db()
            user = db.execute(
                "SELECT * FROM users WHERE username = ?", (username,)
            ).fetchone()

            if user and check_password_hash(user['password_hash'], password):
                session.clear()
                session['user_id']   = user['id']
                session['username']  = user['username']
                session['role']      = user['role']
                session.permanent    = False
                return redirect(url_for('dashboard'))
            else:
                error = 'Geçersiz kullanıcı adı veya şifre.'

    return render_template('login.html', error=error)


@app.route('/logout')
def logout():
    session.clear()
    flash('Başarıyla çıkış yapıldı.', 'success')
    return redirect(url_for('login'))


# ─── Public API (CORS — callable from GitHub Pages) ──────────────────────────

@app.after_request
def add_cors(response):
    """Attach CORS headers to all /api/* responses so static frontends can call them."""
    if request.path.startswith('/api/'):
        response.headers['Access-Control-Allow-Origin']  = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@app.route('/api/posts', methods=['GET', 'OPTIONS'])
def public_posts():
    """Return all PUBLISHED blog posts — no authentication required."""
    if request.method == 'OPTIONS':
        return '', 200
    db    = get_db()
    posts = db.execute(
        "SELECT id, title, slug, summary, image_path, date, author FROM blog_posts WHERE status='published' ORDER BY date DESC"
    ).fetchall()
    
    # Get the admin's avatar path
    admin = db.execute("SELECT avatar_path FROM users ORDER BY id ASC LIMIT 1").fetchone()
    admin_avatar = admin['avatar_path'] if (admin and admin['avatar_path']) else None
    
    res = []
    for p in posts:
        d = format_db_row(p)
        if d.get('author') == 'Dr. Cahit Cenksoy' and admin_avatar:
            d['author_avatar'] = admin_avatar
        else:
            d['author_avatar'] = None
        res.append(d)
        
    return jsonify(res)


@app.route('/api/posts/<slug_or_id>', methods=['GET', 'OPTIONS'])
def public_post_detail(slug_or_id):
    """Return a single published blog post by slug or ID."""
    if request.method == 'OPTIONS':
        return '', 200
    db = get_db()
    
    # Try finding by ID first if numeric
    if str(slug_or_id).isdigit():
        post = db.execute(
            "SELECT * FROM blog_posts WHERE id = ? AND status='published'", (int(slug_or_id),)
        ).fetchone()
    else:
        post = db.execute(
            "SELECT * FROM blog_posts WHERE slug = ? AND status='published'", (slug_or_id,)
        ).fetchone()
        
    if not post:
        return jsonify({'error': 'Makale bulunamadı'}), 404
        
    d = format_db_row(post)
    # Get the admin's avatar path
    admin = db.execute("SELECT avatar_path FROM users ORDER BY id ASC LIMIT 1").fetchone()
    admin_avatar = admin['avatar_path'] if (admin and admin['avatar_path']) else None
    
    if d.get('author') == 'Dr. Cahit Cenksoy' and admin_avatar:
        d['author_avatar'] = admin_avatar
    else:
        d['author_avatar'] = None
        
    return jsonify(d)





@app.route('/api/basvuru', methods=['POST', 'OPTIONS'])
def public_basvuru():
    """Save a contact/inquiry form submission — no authentication required."""
    if request.method == 'OPTIONS':
        return '', 200
    data    = request.get_json(silent=True) or request.form
    name    = html.escape(str(data.get('name',    '')).strip()[:100])
    email   = html.escape(str(data.get('email',   '')).strip()[:100])
    phone   = html.escape(str(data.get('phone',   '')).strip()[:30])
    message = html.escape(str(data.get('message', '')).strip()[:2000])
    if not name:
        return jsonify({'error': 'Ad Soyad zorunludur.'}), 400
    db = get_db()
    db.execute(
        "INSERT INTO patient_inquiries (name, email, phone, message, status) VALUES (?, ?, ?, ?, 'new')",
        (name, email, phone, message)
    )
    db.commit()
    return jsonify({'success': True})


@app.route('/api/team', methods=['GET', 'OPTIONS'])
def public_team():
    """Return all team members — no authentication required."""
    if request.method == 'OPTIONS':
        return '', 200
    db = get_db()
    members = db.execute("SELECT * FROM team_members ORDER BY sort_order ASC, id ASC").fetchall()
    return jsonify([format_db_row(m) for m in members])


@app.route('/api/faqs', methods=['GET', 'OPTIONS'])
def public_faqs():
    """Return published FAQs — no authentication required."""
    if request.method == 'OPTIONS':
        return '', 200
    db = get_db()
    faqs = db.execute("SELECT * FROM faqs WHERE status='published' ORDER BY sort_order ASC, id ASC").fetchall()
    return jsonify([format_db_row(f) for f in faqs])


# ─── Dashboard (SPA) ─────────────────────────────────────────────────────────

@app.route('/yonetim')
@app.route('/yonetim/dashboard')
@app.route('/admin_panel')
@login_required
def dashboard():
    return render_template('admin/dashboard_spa.html')


# ─── Blog CRUD ────────────────────────────────────────────────────────────────

@app.route('/yonetim/blog')
@login_required
def blog_list():
    db    = get_db()
    posts = db.execute("SELECT * FROM blog_posts ORDER BY date DESC").fetchall()
    return render_template('admin/blog_list.html', posts=posts)


@app.route('/yonetim/blog/yeni', methods=['GET', 'POST'])
@login_required
def blog_create():
    if request.method == 'POST':
        title   = request.form.get('title', '').strip()
        summary = request.form.get('summary', '').strip()
        content = request.form.get('content', '')
        status  = request.form.get('status', 'draft')
        date    = request.form.get('date') or datetime.now().strftime('%Y-%m-%d')
        slug    = slugify(title)

        if not title:
            flash('Başlık zorunludur.', 'danger')
            return render_template('admin/blog_editor.html', post=None)

        # Make slug unique if needed
        db = get_db()
        existing_slug = db.execute("SELECT id FROM blog_posts WHERE slug = ?", (slug,)).fetchone()
        if existing_slug:
            slug = f"{slug}-{uuid.uuid4().hex[:6]}"

        image_path = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
                image_path = save_image_as_base64(file)

        db.execute(
            """INSERT INTO blog_posts (title, slug, summary, content, image_path, status, date)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (title, slug, summary, content, image_path, status, date)
        )
        db.commit()
        flash('Blog yazısı başarıyla oluşturuldu.', 'success')
        return redirect(url_for('blog_list'))

    return render_template('admin/blog_editor.html', post=None)


@app.route('/yonetim/blog/<int:post_id>/duzenle', methods=['GET', 'POST'])
@login_required
def blog_edit(post_id):
    db   = get_db()
    post = db.execute("SELECT * FROM blog_posts WHERE id = ?", (post_id,)).fetchone()
    if not post:
        abort(404)
        return  # unreachable — tells type checker post is not None below

    if request.method == 'POST':
        title   = request.form.get('title', '').strip()
        summary = request.form.get('summary', '').strip()
        content = request.form.get('content', '')
        status  = request.form.get('status', 'draft')
        date    = request.form.get('date') or post['date']

        image_path = post['image_path']
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
                image_path = save_image_as_base64(file)

        db.execute(
            """UPDATE blog_posts SET title=?, summary=?, content=?, image_path=?, status=?, date=?
               WHERE id=?""",
            (title, summary, content, image_path, status, date, post_id)
        )
        db.commit()
        flash('Blog yazısı güncellendi.', 'success')
        return redirect(url_for('blog_list'))

    return render_template('admin/blog_editor.html', post=post)


@app.route('/yonetim/blog/<int:post_id>/sil', methods=['POST'])
@login_required
def blog_delete(post_id):
    db   = get_db()
    post = db.execute("SELECT * FROM blog_posts WHERE id = ?", (post_id,)).fetchone()
    if not post:
        abort(404)

    # Remove image file if exists
    if post['image_path'] and post['image_path'].startswith('uploads/'):
        file_path = os.path.join(BASE_DIR, 'static', post['image_path'])
        if os.path.exists(file_path):
            os.remove(file_path)

    db.execute("DELETE FROM blog_posts WHERE id = ?", (post_id,))
    db.commit()
    flash('Blog yazısı silindi.', 'success')
    return redirect(url_for('blog_list'))


# ─── Site Content ─────────────────────────────────────────────────────────────

@app.route('/yonetim/icerik', methods=['GET', 'POST'])
@login_required
def site_content():
    db = get_db()

    if request.method == 'POST':
        for key, value in request.form.items():
            if key.startswith('_'):
                continue
            db.execute(
                """UPDATE site_content SET value=?, updated_at=datetime('now') WHERE key=?""",
                (value, key)
            )
        db.commit()
        flash('Site içerikleri güncellendi.', 'success')
        return redirect(url_for('site_content'))

    items = db.execute("SELECT * FROM site_content ORDER BY key").fetchall()
    return render_template('admin/site_content.html', items=items)


# ─── Patient Inquiries ────────────────────────────────────────────────────────

@app.route('/yonetim/hasta-basvurulari')
@login_required
def inquiries():
    db   = get_db()
    rows = db.execute(
        "SELECT * FROM patient_inquiries ORDER BY created_at DESC"
    ).fetchall()
    return render_template('admin/inquiries.html', inquiries=rows)


@app.route('/yonetim/hasta-basvurulari/<int:inq_id>/oku', methods=['POST'])
@login_required
def inquiry_mark_read(inq_id):
    db = get_db()
    db.execute("UPDATE patient_inquiries SET status='read' WHERE id=?", (inq_id,))
    db.commit()
    return redirect(url_for('inquiries'))


@app.route('/yonetim/hasta-basvurulari/<int:inq_id>/sil', methods=['POST'])
@login_required
def inquiry_delete(inq_id):
    db = get_db()
    db.execute("DELETE FROM patient_inquiries WHERE id=?", (inq_id,))
    db.commit()
    flash('Başvuru silindi.', 'success')
    return redirect(url_for('inquiries'))


# ─── Public API: Submit Inquiry (from contact form) ───────────────────────────

@app.route('/api/basvuru', methods=['POST'])
def submit_inquiry():
    """Public endpoint to receive patient inquiries from the contact form."""
    data = request.get_json(silent=True) or request.form
    name    = escape_html(data.get('name', '').strip())
    email   = escape_html(data.get('email', '').strip())
    phone   = escape_html(data.get('phone', '').strip())
    message = escape_html(data.get('message', '').strip())

    if not name or not message:
        return jsonify({'success': False, 'error': 'Ad ve mesaj zorunludur.'}), 400

    db = get_db()
    db.execute(
        "INSERT INTO patient_inquiries (name, email, phone, message) VALUES (?, ?, ?, ?)",
        (name, email, phone, message)
    )
    db.commit()
    return jsonify({'success': True, 'message': 'Başvurunuz alındı. Teşekkür ederiz.'})


# ─── Public-Facing Blog Routes ────────────────────────────────────────────────

@app.route('/blog')
def public_blog():
    db    = get_db()
    posts = db.execute(
        "SELECT * FROM blog_posts WHERE status='published' ORDER BY date DESC"
    ).fetchall()
    return render_template('public/blog.html', posts=posts)


@app.route('/blog/<slug>')
def public_blog_post(slug):
    db   = get_db()
    post = db.execute(
        "SELECT * FROM blog_posts WHERE slug=? AND status='published'", (slug,)
    ).fetchone()
    if not post:
        abort(404)
    return render_template('public/blog_post.html', post=post)


# ─── Error Handlers ───────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(_e):
    return render_template('errors/404.html'), 404

@app.errorhandler(413)
def too_large(_e):
    flash('Dosya boyutu 5MB sınırını aşıyor.', 'danger')
    return redirect(request.referrer or url_for('dashboard'))

@app.errorhandler(500)
def server_error(_e):
    return render_template('errors/500.html'), 500


# ─── JSON API — SPA Dashboard ────────────────────────────────────────────────

@app.route('/api/admin/stats')
@login_required
def api_stats():
    db = get_db()
    return jsonify({
        'total_posts':     db.execute("SELECT COUNT(*) FROM blog_posts").fetchone()[0],
        'published_posts': db.execute("SELECT COUNT(*) FROM blog_posts WHERE status='published'").fetchone()[0],
        'total_inquiries': db.execute("SELECT COUNT(*) FROM patient_inquiries").fetchone()[0],
        'new_inquiries':   db.execute("SELECT COUNT(*) FROM patient_inquiries WHERE status='new'").fetchone()[0],
    })


@app.route('/api/admin/posts', methods=['GET'])
@login_required
def api_posts_list():
    db    = get_db()
    posts = db.execute("SELECT * FROM blog_posts ORDER BY date DESC").fetchall()
    return jsonify([format_db_row(p) for p in posts])


@app.route('/api/admin/posts/<int:post_id>', methods=['GET'])
@login_required
def api_post_get(post_id):
    db   = get_db()
    post = db.execute("SELECT * FROM blog_posts WHERE id = ?", (post_id,)).fetchone()
    if not post:
        return jsonify({'error': 'Bulunamad\u0131'}), 404
    return jsonify(format_db_row(post))


@app.route('/api/admin/posts', methods=['POST'])
@login_required
def api_post_create():
    title   = request.form.get('title', '').strip()
    summary = request.form.get('summary', '').strip()
    content = request.form.get('content', '')
    status  = request.form.get('status', 'draft')
    author  = request.form.get('author', '').strip() or 'Dr. Cahit Cenksoy'
    date    = request.form.get('date') or datetime.now().strftime('%Y-%m-%d')
    slug    = slugify(title)
    if not title:
        return jsonify({'error': 'Başlık zorunludur.'}), 400
    db = get_db()
    if db.execute("SELECT id FROM blog_posts WHERE slug = ?", (slug,)).fetchone():
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"
    image_path = None
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename and allowed_file(file.filename):
            image_path = save_image_as_base64(file)
    db.execute(
        "INSERT INTO blog_posts (title,slug,summary,content,image_path,status,date,author) VALUES(?,?,?,?,?,?,?,?)",
        (title, slug, summary, content, image_path, status, date, author)
    )
    db.commit()
    new_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]
    return jsonify({'success': True, 'id': new_id, 'slug': slug})


@app.route('/api/admin/posts/<int:post_id>', methods=['PUT'])
@login_required
def api_post_update(post_id):
    db   = get_db()
    post = db.execute("SELECT * FROM blog_posts WHERE id = ?", (post_id,)).fetchone()
    if not post:
        return jsonify({'error': 'Bulunamadı'}), 404
    title      = request.form.get('title', '').strip()
    summary    = request.form.get('summary', '').strip()
    content    = request.form.get('content', '')
    status     = request.form.get('status', 'draft')
    author     = request.form.get('author', '').strip() or 'Dr. Cahit Cenksoy'
    date       = request.form.get('date') or post['date']
    image_path = post['image_path']
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename and allowed_file(file.filename):
            image_path = save_image_as_base64(file)
    db.execute(
        "UPDATE blog_posts SET title=?,summary=?,content=?,image_path=?,status=?,date=?,author=? WHERE id=?",
        (title, summary, content, image_path, status, date, author, post_id)
    )
    db.commit()
    return jsonify({'success': True})


@app.route('/api/admin/posts/<int:post_id>', methods=['DELETE'])
@login_required
def api_post_delete(post_id):
    db   = get_db()
    post = db.execute("SELECT * FROM blog_posts WHERE id = ?", (post_id,)).fetchone()
    if not post:
        return jsonify({'error': 'Bulunamad\u0131'}), 404
    if post['image_path'] and post['image_path'].startswith('uploads/'):
        fp = os.path.join(BASE_DIR, 'static', post['image_path'])
        if os.path.exists(fp):
            os.remove(fp)
    db.execute("DELETE FROM blog_posts WHERE id = ?", (post_id,))
    db.commit()
    return jsonify({'success': True})


# ─── API endpoints — Team Members ──────────────────────────────────────────

@app.route('/api/admin/team', methods=['GET'])
@login_required
def api_team_list():
    db = get_db()
    members = db.execute("SELECT * FROM team_members ORDER BY sort_order ASC, id ASC").fetchall()
    return jsonify([format_db_row(m) for m in members])

@app.route('/api/admin/team/<int:member_id>', methods=['GET'])
@login_required
def api_team_get(member_id):
    db = get_db()
    member = db.execute("SELECT * FROM team_members WHERE id = ?", (member_id,)).fetchone()
    if not member:
        return jsonify({'error': 'Bulunamadı'}), 404
    return jsonify(format_db_row(member))

@app.route('/api/admin/team', methods=['POST'])
@login_required
def api_team_create():
    name = request.form.get('name', '').strip()
    role = request.form.get('role', '').strip()
    bio = request.form.get('bio', '').strip()
    sort_order = int(request.form.get('sort_order', '0') or '0')

    if not name or not role:
        return jsonify({'error': 'İsim ve görev alanları zorunludur.'}), 400

    image_path = None
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename != '' and allowed_file(file.filename):
            image_path = save_image_as_base64(file)

    db = get_db()
    db.execute(
        "INSERT INTO team_members (name, role, image_path, bio, sort_order) VALUES (?, ?, ?, ?, ?)",
        (name, role, image_path, bio, sort_order)
    )
    db.commit()
    return jsonify({'success': True})

@app.route('/api/admin/team/<int:member_id>', methods=['POST', 'PUT'])
@login_required
def api_team_update(member_id):
    db = get_db()
    member = db.execute("SELECT * FROM team_members WHERE id = ?", (member_id,)).fetchone()
    if not member:
        return jsonify({'error': 'Bulunamadı'}), 404

    name = request.form.get('name', member['name']).strip()
    role = request.form.get('role', member['role']).strip()
    bio = request.form.get('bio', member['bio']).strip()
    sort_order = int(request.form.get('sort_order', str(member['sort_order']) or '0') or '0')

    if not name or not role:
        return jsonify({'error': 'İsim ve görev alanları zorunludur.'}), 400

    image_path = member['image_path']
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename != '' and allowed_file(file.filename):
            # Delete old custom image if it starts with uploads/
            if member['image_path'] and member['image_path'].startswith('uploads/'):
                fp_old = os.path.join(BASE_DIR, 'static', member['image_path'])
                if os.path.exists(fp_old):
                    try:
                        os.remove(fp_old)
                    except Exception:
                        pass
            
            image_path = save_image_as_base64(file)

    db.execute(
        "UPDATE team_members SET name = ?, role = ?, image_path = ?, bio = ?, sort_order = ? WHERE id = ?",
        (name, role, image_path, bio, sort_order, member_id)
    )
    db.commit()
    return jsonify({'success': True})

@app.route('/api/admin/team/<int:member_id>', methods=['DELETE'])
@login_required
def api_team_delete(member_id):
    db = get_db()
    member = db.execute("SELECT * FROM team_members WHERE id = ?", (member_id,)).fetchone()
    if not member:
        return jsonify({'error': 'Bulunamadı'}), 404

    if member['image_path'] and member['image_path'].startswith('uploads/'):
        fp = os.path.join(BASE_DIR, 'static', member['image_path'])
        if os.path.exists(fp):
            try:
                os.remove(fp)
            except Exception:
                pass

    db.execute("DELETE FROM team_members WHERE id = ?", (member_id,))
    db.commit()
    return jsonify({'success': True})


@app.route('/api/admin/content', methods=['GET'])
@login_required
def api_content_get():
    db    = get_db()
    items = db.execute("SELECT * FROM site_content ORDER BY key").fetchall()
    return jsonify([dict(i) for i in items])


@app.route('/api/admin/content', methods=['POST'])
@login_required
def api_content_update():
    data = request.get_json(silent=True) or {}
    db   = get_db()
    for key, value in data.items():
        db.execute(
            "UPDATE site_content SET value=?, updated_at=datetime('now') WHERE key=?",
            (value, key)
        )
    db.commit()
    return jsonify({'success': True})


@app.route('/api/admin/inquiries', methods=['GET'])
@login_required
def api_inquiries_list():
    db   = get_db()
    rows = db.execute("SELECT * FROM patient_inquiries ORDER BY created_at DESC").fetchall()
    return jsonify([dict(r) for r in rows])


@app.route('/api/admin/inquiries/<int:inq_id>/read', methods=['POST'])
@login_required
def api_inquiry_read(inq_id):
    db = get_db()
    db.execute("UPDATE patient_inquiries SET status='read' WHERE id=?", (inq_id,))
    db.commit()
    return jsonify({'success': True})


@app.route('/api/admin/inquiries/<int:inq_id>', methods=['DELETE'])
@login_required
def api_inquiry_delete_json(inq_id):
    db = get_db()
    db.execute("DELETE FROM patient_inquiries WHERE id=?", (inq_id,))
    db.commit()
    return jsonify({'success': True})


# ─── API endpoints — FAQs ────────────────────────────────────────────────────

@app.route('/api/admin/faqs', methods=['GET'])
@login_required
def api_faq_list():
    db = get_db()
    faqs = db.execute("SELECT * FROM faqs ORDER BY sort_order ASC, id ASC").fetchall()
    return jsonify([format_db_row(f) for f in faqs])

@app.route('/api/admin/faqs/<int:faq_id>', methods=['GET'])
@login_required
def api_faq_get(faq_id):
    db = get_db()
    faq = db.execute("SELECT * FROM faqs WHERE id = ?", (faq_id,)).fetchone()
    if not faq:
        return jsonify({'error': 'Bulunamadı'}), 404
    return jsonify(format_db_row(faq))

@app.route('/api/admin/faqs', methods=['POST'])
@login_required
def api_faq_create():
    question = request.form.get('question', '').strip()
    answer = request.form.get('answer', '').strip()
    category = request.form.get('category', 'ivf-process').strip()
    status = request.form.get('status', 'published').strip()
    sort_order = int(request.form.get('sort_order', '0') or '0')

    if not question or not answer:
        return jsonify({'error': 'Soru ve cevap alanları zorunludur.'}), 400

    db = get_db()
    db.execute(
        "INSERT INTO faqs (question, answer, category, status, sort_order) VALUES (?, ?, ?, ?, ?)",
        (question, answer, category, status, sort_order)
    )
    db.commit()
    return jsonify({'success': True})

@app.route('/api/admin/faqs/<int:faq_id>', methods=['POST', 'PUT'])
@login_required
def api_faq_update(faq_id):
    db = get_db()
    faq = db.execute("SELECT * FROM faqs WHERE id = ?", (faq_id,)).fetchone()
    if not faq:
        return jsonify({'error': 'Bulunamadı'}), 404

    question = request.form.get('question', faq['question']).strip()
    answer = request.form.get('answer', faq['answer']).strip()
    category = request.form.get('category', faq.get('category', 'ivf-process')).strip()
    status = request.form.get('status', faq['status']).strip()
    sort_order = int(request.form.get('sort_order', str(faq['sort_order']) or '0') or '0')

    if not question or not answer:
        return jsonify({'error': 'Soru ve cevap alanları zorunludur.'}), 400

    db.execute(
        "UPDATE faqs SET question = ?, answer = ?, category = ?, status = ?, sort_order = ? WHERE id = ?",
        (question, answer, category, status, sort_order, faq_id)
    )
    db.commit()
    return jsonify({'success': True})

@app.route('/api/admin/faqs/<int:faq_id>', methods=['DELETE'])
@login_required
def api_faq_delete(faq_id):
    db = get_db()
    db.execute("DELETE FROM faqs WHERE id = ?", (faq_id,))
    db.commit()
    return jsonify({'success': True})



@app.route('/api/admin/upload_image', methods=['POST'])
@login_required
def api_upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'Dosya bulunamadı'}), 400
    file = request.files['image']
    if not file or not file.filename:
        return jsonify({'error': 'Geçersiz dosya'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'İzin verilmeyen dosya türü'}), 400
    image_path = save_image_as_base64(file)
    return jsonify({
        'success': True,
        'url': image_path
    })


@app.route('/api/admin/profile', methods=['GET'])
@login_required
def api_profile_get():
    db = get_db()
    user = db.execute("SELECT id, username, role, avatar_path FROM users WHERE id = ?", (session['user_id'],)).fetchone()
    if not user:
        return jsonify({'error': 'Kullanıcı bulunamadı'}), 404
    return jsonify(dict(user))


@app.route('/api/admin/profile/avatar', methods=['POST'])
@login_required
def api_profile_avatar_update():
    if 'avatar' not in request.files:
        return jsonify({'error': 'Dosya seçilmedi'}), 400
    file = request.files['avatar']
    if not file or not file.filename:
        return jsonify({'error': 'Geçersiz dosya'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'İzin verilmeyen dosya türü'}), 400
    
    avatar_path = save_image_as_base64(file)
    
    db = get_db()
    db.execute("UPDATE users SET avatar_path = ? WHERE id = ?", (avatar_path, session['user_id']))
    db.commit()
    
    return jsonify({
        'success': True,
        'avatar_path': avatar_path
    })


# ─── Entry Point ──────────────────────────────────────────────────────────────

# Initialize DB on every startup (safe — uses IF NOT EXISTS + INSERT OR IGNORE)
with app.app_context():
    init_db()

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
