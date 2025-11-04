from flask import Flask, jsonify, request, session, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import os
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'data.db')

# uploads folder for multipart file uploads — store at project root '/uploads' so frontend and tests
# can reference files consistently (one level above backend/)
PROJECT_ROOT = os.path.normpath(os.path.join(BASE_DIR, '..'))
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # Serve the static frontend (project root) so frontend and API share origin for easy local testing
static_root = os.path.normpath(os.path.join(BASE_DIR, '..'))
# serve frontend files from project root so front-end can be loaded from same origin
app = Flask(__name__, static_folder=static_root, static_url_path='')
app.secret_key = os.environ.get('HAF_SECRET') or 'dev-secret-for-prototype'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DB_PATH
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)


class Opportunity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(100))
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    # optional attachment uploaded by donor when posting the opportunity
    attachment_original = db.Column(db.String(300), nullable=True)
    attachment_stored = db.Column(db.String(300), nullable=True)

    poster = db.relationship('User', backref='opportunities', lazy=True)

    def to_dict(self):
        out = {'id': self.id, 'title': self.title, 'location': self.location, 'description': self.description}
        try:
            if self.poster:
                out['owner'] = {'id': self.poster.id, 'name': self.poster.name or self.poster.email}
            else:
                out['owner'] = None
        except Exception:
            out['owner'] = None
        # include attachment info if available
        if getattr(self, 'attachment_stored', None):
            out['attachment'] = {
                'original_filename': getattr(self, 'attachment_original', None),
                'url': f'/backend/uploads/{getattr(self, "attachment_stored")}'
            }
        else:
            out['attachment'] = None
        return out


class Youth(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(60))
    country = db.Column(db.String(80))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

    # verification workflow
    status = db.Column(db.String(40), default='draft')  # draft | submitted | verified | rejected
    submitted_at = db.Column(db.DateTime, nullable=True)
    verified_at = db.Column(db.DateTime, nullable=True)

    documents = db.relationship('Document', backref='youth', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'country': self.country,
            'status': self.status,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'verified_at': self.verified_at.isoformat() if self.verified_at else None,
            'documents': [d.to_dict() for d in (self.documents or [])]
        }


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(300))
    name = db.Column(db.String(200))
    # role: user | donor | admin | field
    role = db.Column(db.String(30), default='user')
    # email verification fields for a simple prototype
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(100), nullable=True)
    verification_sent_at = db.Column(db.DateTime, nullable=True)

    def set_password(self, pw):
        self.password_hash = generate_password_hash(pw)

    def check_password(self, pw):
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, pw)


class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    youth_id = db.Column(db.Integer, db.ForeignKey('youth.id'), nullable=False)
    original_filename = db.Column(db.String(300), nullable=False)
    stored_filename = db.Column(db.String(300), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'original_filename': self.original_filename,
            'stored_filename': self.stored_filename,
            'uploaded_at': self.uploaded_at.isoformat(),
            'url': f'/backend/uploads/{self.stored_filename}'
        }


class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunity.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(50), default='applied')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    applicant = db.relationship('User', backref='applications', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'opportunity_id': self.opportunity_id,
            'user': {'id': self.applicant.id, 'name': self.applicant.name} if self.applicant else None,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }


def seed_data():
    # Run seeding inside an application context
    with app.app_context():
        db.create_all()
        # ensure opportunity table has user_id column in case of schema drift
        try:
            # check pragma table_info
            res = db.session.execute(text("PRAGMA table_info(opportunity);"))
            cols = [r[1] for r in res.fetchall()]
            if 'user_id' not in cols:
                # SQLite supports ADD COLUMN
                db.session.execute(text('ALTER TABLE opportunity ADD COLUMN user_id INTEGER'))
                db.session.commit()
            # add attachment columns if missing
            if 'attachment_original' not in cols:
                db.session.execute(text("ALTER TABLE opportunity ADD COLUMN attachment_original TEXT"))
                db.session.commit()
            if 'attachment_stored' not in cols:
                db.session.execute(text("ALTER TABLE opportunity ADD COLUMN attachment_stored TEXT"))
                db.session.commit()
            # ensure user table has verification columns
            res2 = db.session.execute(text("PRAGMA table_info(user);"))
            ucols = [r[1] for r in res2.fetchall()]
            if 'is_verified' not in ucols:
                db.session.execute(text("ALTER TABLE user ADD COLUMN is_verified BOOLEAN DEFAULT 0"))
                db.session.commit()
            if 'verification_token' not in ucols:
                db.session.execute(text("ALTER TABLE user ADD COLUMN verification_token TEXT"))
                db.session.commit()
            if 'verification_sent_at' not in ucols:
                db.session.execute(text("ALTER TABLE user ADD COLUMN verification_sent_at DATETIME"))
                db.session.commit()
            if 'role' not in ucols:
                db.session.execute(text("ALTER TABLE user ADD COLUMN role TEXT DEFAULT 'user'"))
                db.session.commit()
            # ensure youth table has verification workflow columns
            res3 = db.session.execute(text("PRAGMA table_info(youth);"))
            ycols = [r[1] for r in res3.fetchall()]
            if 'status' not in ycols:
                db.session.execute(text("ALTER TABLE youth ADD COLUMN status TEXT DEFAULT 'draft'"))
                db.session.commit()
            if 'submitted_at' not in ycols:
                db.session.execute(text("ALTER TABLE youth ADD COLUMN submitted_at DATETIME"))
                db.session.commit()
            if 'verified_at' not in ycols:
                db.session.execute(text("ALTER TABLE youth ADD COLUMN verified_at DATETIME"))
                db.session.commit()
        except Exception:
            pass
        # if already seeded, skip
        try:
            if Opportunity.query.first() or Youth.query.first():
                # ensure at least one demo user exists
                if not User.query.first():
                    demo = User(email='demo@example.com', name='Demo User')
                    demo.set_password('demo')
                    db.session.add(demo)
                    db.session.commit()
                return
        except Exception:
            pass

        # sample opportunities
        ops = [
            Opportunity(title='STEM Scholarship 2025', location='Nairobi', description='Full scholarship for STEM studies.'),
            Opportunity(title='Tech Internship — Nairobi', location='Nairobi', description='6-month remote-friendly internship.'),
            Opportunity(title='Vocational Program – Solar', location='Kampala', description='Hands-on solar installation program.'),
            Opportunity(title='Agritech Bootcamp', location='Hybrid', description='Agri-tech training and mentorship.'),
        ]
        for o in ops:
            db.session.add(o)

        youths = [
            Youth(name='Amina K.', category='Refugee', country='Kenya'),
            Youth(name='John D.', category='Vulnerable', country='Uganda'),
            Youth(name='Mary S.', category='IDP', country='Kenya'),
        ]
        for y in youths:
            db.session.add(y)

        # try commit; if schema is missing youth verification columns, attempt to add them and retry
        try:
            db.session.commit()
        except Exception as ex:
            # detect missing youth columns and attempt to add them, then retry once
            try:
                msg = str(ex)
                # refresh PRAGMA for youth
                res3 = db.session.execute("PRAGMA table_info(youth);")
                ycols = [r[1] for r in res3.fetchall()]
                if 'status' not in ycols:
                    db.session.execute("ALTER TABLE youth ADD COLUMN status TEXT DEFAULT 'draft'")
                    db.session.commit()
                if 'submitted_at' not in ycols:
                    db.session.execute("ALTER TABLE youth ADD COLUMN submitted_at DATETIME")
                    db.session.commit()
                if 'verified_at' not in ycols:
                    db.session.execute("ALTER TABLE youth ADD COLUMN verified_at DATETIME")
                    db.session.commit()
                # retry commit
                db.session.commit()
            except Exception as ex2:
                # if still failing, re-raise the original exception to show the error
                raise ex2

        # create a demo user if none
        if not User.query.first():
            demo = User(email='demo@example.com', name='Demo User')
            demo.set_password('demo')
            demo.is_verified = True
            db.session.add(demo)
            db.session.commit()


@app.route('/api/health')
def health():
    return jsonify({'status': 'ok'})


@app.route('/api/opportunities')
def get_opportunities():
    ops = Opportunity.query.all()
    return jsonify([o.to_dict() for o in ops])


@app.route('/api/opportunities/<int:op_id>')
def get_opportunity(op_id):
    o = Opportunity.query.get(op_id)
    if not o:
        return jsonify({'error': 'not found'}), 404
    return jsonify(o.to_dict())


@app.route('/api/opportunities', methods=['POST'])
def create_opportunity():
    # require authenticated user (prototype session-based auth)
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'ok': False, 'error': 'authentication required'}), 401

    # require donor role
    user = User.query.get(user_id)
    if not user or getattr(user, 'role', 'user') != 'donor':
        return jsonify({'ok': False, 'error': 'only donors can post opportunities'}), 403

    data = request.get_json() or {}
    title = data.get('title') or data.get('name')
    if not title:
        return jsonify({'error': 'title required'}), 400
    location = data.get('location')
    description = data.get('description')
    o = Opportunity(title=title, location=location, description=description, user_id=user_id)
    db.session.add(o)
    db.session.commit()
    return jsonify({'id': o.id, 'title': o.title}), 201


@app.route('/api/opportunities/<int:op_id>/upload', methods=['POST'])
def upload_opportunity_attachment(op_id):
    # require auth and ownership (simple prototype: must be same user)
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'ok': False, 'error': 'authentication required'}), 401

    opp = Opportunity.query.get(op_id)
    if not opp:
        return jsonify({'ok': False, 'error': 'opportunity not found'}), 404

    # require that the current user is the poster (owner)
    if opp.user_id and opp.user_id != user_id:
        return jsonify({'ok': False, 'error': 'not allowed'}), 403

    f = request.files.get('file')
    if not f:
        return jsonify({'error': 'no file uploaded'}), 400

    original = secure_filename(f.filename)
    ext = os.path.splitext(original)[1] or ''
    stored = f"{uuid.uuid4().hex}{ext}"
    dest = os.path.join(UPLOAD_FOLDER, stored)
    f.save(dest)

    # update opportunity with attachment metadata
    opp.attachment_original = original
    opp.attachment_stored = stored
    db.session.add(opp)
    db.session.commit()

    return jsonify({'ok': True, 'attachment': {'original': original, 'url': f'/backend/uploads/{stored}'}})


@app.route('/api/youth', methods=['POST'])
def create_youth():
    data = request.get_json() or {}
    name = data.get('fullName') or data.get('full_name') or data.get('name')
    if not name:
        return jsonify({'error': 'name required'}), 400
    y = Youth(name=name, category=data.get('category'), country=data.get('country'))
    # link to logged-in user if available
    user_id = session.get('user_id')
    if user_id:
        y.user_id = user_id
    # if client indicates immediate submission, set submitted status/timestamp
    if data.get('submit'):
        y.status = 'submitted'
        y.submitted_at = datetime.utcnow()
    db.session.add(y)
    db.session.commit()
    return jsonify({'id': y.id, 'name': y.name})


@app.route('/api/youth/<int:y_id>/submit', methods=['POST'])
def submit_youth_for_verification(y_id):
    # require owner or logged in user
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'ok': False, 'error': 'authentication required'}), 401
    y = Youth.query.get(y_id)
    if not y:
        return jsonify({'ok': False, 'error': 'not found'}), 404
    # only owner can submit
    if y.user_id and y.user_id != user_id:
        return jsonify({'ok': False, 'error': 'not allowed'}), 403
    y.status = 'submitted'
    y.submitted_at = datetime.utcnow()
    db.session.add(y)
    db.session.commit()
    return jsonify({'ok': True, 'id': y.id, 'status': y.status})


@app.route('/api/upload/<int:user_id>', methods=['POST'])
def upload_file(user_id):
    # accept multiple named fields: 'docs' and 'letter' or generic 'file'
    saved = []
    for key in ('docs', 'letter', 'file'):
        f = request.files.get(key)
        if not f:
            continue
        original = secure_filename(f.filename)
        # create a unique stored filename
        ext = os.path.splitext(original)[1] or ''
        stored = f"{uuid.uuid4().hex}{ext}"
        dest = os.path.join(UPLOAD_FOLDER, stored)
        f.save(dest)
        # persist metadata in Document table (if youth exists)
        try:
            doc = Document(youth_id=user_id, original_filename=original, stored_filename=stored)
            db.session.add(doc)
            db.session.commit()
        except Exception as ex:
            # continue even if DB fails
            print('Doc save error', ex)
        # return a path clients can fetch from the dev server
        saved.append({'field': key, 'original': original, 'stored': stored, 'url': f'/backend/uploads/{stored}'})
    if not saved:
        return jsonify({'error': 'no file uploaded'}), 400
    return jsonify({'saved': saved})


@app.route('/api/youth')
def get_youth():
    ys = Youth.query.all()
    return jsonify([y.to_dict() for y in ys])


@app.route('/api/search')
def search():
    q = (request.args.get('q') or '').strip().lower()
    results = []
    if not q:
        return jsonify(results)

    # search opportunities
    ops = Opportunity.query.filter(Opportunity.title.ilike(f'%{q}%')).limit(8).all()
    for o in ops:
        results.append({'type': 'opportunity', 'id': o.id, 'text': o.title})

    # search youth
    ys = Youth.query.filter(Youth.name.ilike(f'%{q}%')).limit(8).all()
    for y in ys:
        results.append({'type': 'youth', 'id': y.id, 'text': y.name})

    return jsonify(results[:12])


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password')
    if not email:
        return jsonify({'ok': False, 'error': 'email required'}), 400

    # try to find existing user
    user = User.query.filter_by(email=email).first()
    if user:
        # if password provided, verify; otherwise allow prototype login
        if password:
            if not user.check_password(password):
                return jsonify({'ok': False, 'error': 'invalid credentials'}), 401
        # require email verification
        if not user.is_verified:
            return jsonify({'ok': False, 'error': 'email not verified'}), 403
        # set session
        session['email'] = user.email
        session['name'] = user.name or user.email.split('@')[0]
        session['user_id'] = user.id
        return jsonify({'ok': True, 'email': user.email, 'name': session.get('name')})

    # create user if not exists (prototype) — require password if you want to enforce
    user = User(email=email, name=data.get('name') or email.split('@')[0])
    if password:
        user.set_password(password)
    db.session.add(user)
    db.session.commit()
    # create verification token and mark not verified
    token = uuid.uuid4().hex
    user.verification_token = token
    user.verification_sent_at = datetime.utcnow()
    user.is_verified = False
    db.session.add(user)
    db.session.commit()
    # For prototype: return a verification URL so developer/tester can click it. In production send by email.
    verify_url = f"/api/verify?token={token}"
    session['email'] = user.email
    session['name'] = user.name
    session['user_id'] = user.id
    return jsonify({'ok': True, 'email': user.email, 'name': user.name, 'verification_url': verify_url})


@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('email', None)
    session.pop('name', None)
    return jsonify({'ok': True})


@app.route('/api/me')
def me():
    if 'email' not in session:
        return jsonify({'authenticated': False})
    user = None
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
    else:
        user = User.query.filter_by(email=session.get('email')).first()

    out = {'authenticated': True, 'email': session.get('email'), 'name': session.get('name')}
    if user:
        # include youth profiles for this user
        ys = Youth.query.filter_by(user_id=user.id).all()
        out['user_id'] = user.id
        out['profiles'] = [y.to_dict() for y in ys]
        out['is_verified'] = bool(user.is_verified)
        out['role'] = getattr(user, 'role', 'user')
    return jsonify(out)


@app.route('/api/apply', methods=['POST'])
def apply_opportunity():
    data = request.get_json() or {}
    # require authenticated user
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'ok': False, 'error': 'authentication required'}), 401

    opp_id = data.get('opportunity_id') or data.get('id')
    if not opp_id:
        return jsonify({'ok': False, 'error': 'opportunity_id required'}), 400

    # ensure opportunity exists
    opp = Opportunity.query.get(opp_id)
    if not opp:
        return jsonify({'ok': False, 'error': 'opportunity not found'}), 404

    # create application
    app_row = Application(opportunity_id=opp_id, user_id=user_id, status='applied')
    db.session.add(app_row)
    db.session.commit()
    return jsonify({'ok': True, 'id': app_row.id, 'status': app_row.status})


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password')
    role = (data.get('role') or 'user').strip().lower()
    if not email or not password:
        return jsonify({'ok': False, 'error': 'email and password required'}), 400
    # basic password policy: min 8 chars, contains letter and number
    if len(password) < 8 or not any(c.isalpha() for c in password) or not any(c.isdigit() for c in password):
        return jsonify({'ok': False, 'error': 'password must be at least 8 characters and include letters and numbers'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'ok': False, 'error': 'email already registered'}), 400
    # sanitize role
    if role not in ('user', 'donor', 'admin', 'field'):
        role = 'user'
    user = User(email=email, name=name or email.split('@')[0], role=role)
    user.set_password(password)
    token = uuid.uuid4().hex
    user.verification_token = token
    user.verification_sent_at = datetime.utcnow()
    user.is_verified = False
    db.session.add(user)
    db.session.commit()
    # prototype: return verification link (in prod, send email)
    verify_url = f"/api/verify?token={token}"
    return jsonify({'ok': True, 'verification_url': verify_url})


@app.route('/api/verify')
def verify_email():
    token = request.args.get('token')
    if not token:
        return jsonify({'ok': False, 'error': 'token required'}), 400
    user = User.query.filter_by(verification_token=token).first()
    if not user:
        return jsonify({'ok': False, 'error': 'invalid token'}), 400
    user.is_verified = True
    user.verification_token = None
    user.verification_sent_at = None
    db.session.add(user)
    db.session.commit()
    # set session so user is logged in after verification
    session['email'] = user.email
    session['name'] = user.name or user.email.split('@')[0]
    session['user_id'] = user.id
    return jsonify({'ok': True, 'email': user.email, 'name': user.name})


@app.route('/api/opportunities/<int:op_id>/applications')
def list_applications(op_id):
    apps = Application.query.filter_by(opportunity_id=op_id).all()
    return jsonify([a.to_dict() for a in apps])


@app.route('/backend/uploads/<path:filename>')
def serve_uploads(filename):
    # serve uploaded files saved in backend/uploads for local dev
    return send_from_directory(UPLOAD_FOLDER, filename)


# Serve index at root so visiting http://127.0.0.1:5000/ loads the frontend
@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    # ensure db folder exists
    os.makedirs(BASE_DIR, exist_ok=True)
    seed_data()
    app.run(debug=True)
