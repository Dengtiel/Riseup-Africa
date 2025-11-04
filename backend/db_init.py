import os
from config import Config
from models import db, User, Opportunity

def init_db(app):
    with app.app_context():
        db.init_app(app)
        db.create_all()
        # seed some sample data if none exists
        if User.query.count() == 0:
            u = User(full_name='Amina K.', category='Refugee', country='Kenya', camp='Kakuma', verified=True)
            db.session.add(u)
        if Opportunity.query.count() == 0:
            o = Opportunity(title='STEM Scholarship 2025', category_focus='Refugee', country='Any', description='Scholarship for STEM students')
            db.session.add(o)
        db.session.commit()

def ensure_upload_folder():
    upload_dir = Config.UPLOAD_FOLDER
    os.makedirs(upload_dir, exist_ok=True)
