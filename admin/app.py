"""
Dr. Cahit Cenksoy IVF - Secure Admin Panel
Flask + SQLite Backend
Author: Admin Panel Generator
"""

import os
import re
import uuid
import sqlite3
from datetime import datetime
from functools import wraps

from flask import (
    Flask, render_template, request, redirect, url_for,
    session, flash, g, jsonify, abort
)
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import html

# ─── App Configuration ────────────────────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH  = os.path.join(BASE_DIR, 'database', 'cenksoy_admin.db')
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'CHANGE_THIS_IN_PRODUCTION_df9a3f2e7c1b4d8a')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'database'), exist_ok=True)


# ─── Database Helpers ─────────────────────────────────────────────────────────

def get_db():
    if 'db' not in g:
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
            created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
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

    # Seed default admin user if none exists
    existing = db.execute("SELECT id FROM users LIMIT 1").fetchone()
    if not existing:
        pw_hash = generate_password_hash('Admin@2025!')
        db.execute(
            "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
            ('admin', pw_hash, 'admin')
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


# ─── Dashboard ────────────────────────────────────────────────────────────────

@app.route('/yonetim')
@app.route('/yonetim/dashboard')
@login_required
def dashboard():
    db = get_db()
    stats = {
        'total_posts':      db.execute("SELECT COUNT(*) FROM blog_posts").fetchone()[0],
        'published_posts':  db.execute("SELECT COUNT(*) FROM blog_posts WHERE status='published'").fetchone()[0],
        'total_inquiries':  db.execute("SELECT COUNT(*) FROM patient_inquiries").fetchone()[0],
        'new_inquiries':    db.execute("SELECT COUNT(*) FROM patient_inquiries WHERE status='new'").fetchone()[0],
    }
    recent_inquiries = db.execute(
        "SELECT * FROM patient_inquiries ORDER BY created_at DESC LIMIT 5"
    ).fetchall()
    return render_template('admin/dashboard.html', stats=stats, recent_inquiries=recent_inquiries)


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
                safe_name  = sanitize_filename(file.filename)
                save_path  = os.path.join(app.config['UPLOAD_FOLDER'], safe_name)
                file.save(save_path)
                image_path = f"uploads/{safe_name}"

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
                safe_name  = sanitize_filename(file.filename)
                save_path  = os.path.join(app.config['UPLOAD_FOLDER'], safe_name)
                file.save(save_path)
                image_path = f"uploads/{safe_name}"

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
    if post['image_path']:
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
def not_found(e):
    return render_template('errors/404.html'), 404

@app.errorhandler(413)
def too_large(e):
    flash('Dosya boyutu 5MB sınırını aşıyor.', 'danger')
    return redirect(request.referrer or url_for('dashboard'))

@app.errorhandler(500)
def server_error(e):
    return render_template('errors/500.html'), 500


# ─── Entry Point ──────────────────────────────────────────────────────────────

# Initialize DB on every startup (safe — uses IF NOT EXISTS + INSERT OR IGNORE)
with app.app_context():
    init_db()

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
