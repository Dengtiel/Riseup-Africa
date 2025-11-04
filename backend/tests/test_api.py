import io
import os
import tempfile
import pytest
from backend.app import app, db
import werkzeug
if not hasattr(werkzeug, '__version__'):
    # newer werkzeug distributions may not expose __version__; tests expect it
    werkzeug.__version__ = '2.3.0'


@pytest.fixture
def client(tmp_path, monkeypatch):
    # use a temporary database
    db_fd = tmp_path / 'test.db'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + str(db_fd)
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False

    # create a temporary uploads directory and point the app to it so tests don't pollute project uploads/
    temp_uploads = tmp_path / 'uploads'
    temp_uploads.mkdir(parents=True, exist_ok=True)
    # monkeypatch the UPLOAD_FOLDER used by the backend upload handler
    monkeypatch.setattr('backend.app.UPLOAD_FOLDER', str(temp_uploads))

    with app.test_client() as client:
        with app.app_context():
            # ensure fresh schema for tests
            db.drop_all()
            db.create_all()
        yield client

    # teardown: remove the temporary uploads directory
    try:
        import shutil
        shutil.rmtree(str(temp_uploads))
    except Exception:
        pass


def test_health(client):
    rv = client.get('/api/health')
    assert rv.status_code == 200
    assert rv.json.get('status') == 'ok'


def test_login_and_profile_and_upload(client):
    # login (creates demo user if not exists)
    rv = client.post('/api/login', json={'email': 'alice@example.com', 'password': 'pwd'})
    assert rv.status_code == 200
    assert rv.json.get('ok') is True

    # create youth profile
    rv = client.post('/api/youth', json={'fullName': 'Test Youth', 'category': 'Refugee', 'country': 'Kenya'})
    assert rv.status_code == 200
    data = rv.json
    assert 'id' in data
    youth_id = data['id']

    # upload file
    data = {'file': (io.BytesIO(b'testfile'), 'id.txt')}
    rv = client.post(f'/api/upload/{youth_id}', data=data, content_type='multipart/form-data')
    assert rv.status_code == 200
    assert 'saved' in rv.json
    saved = rv.json['saved']
    assert isinstance(saved, list) and len(saved) >= 1
    item = saved[0]
    assert item.get('original') == 'id.txt'
    stored = item.get('stored')
    assert stored
    # file exists on disk in the app's configured upload folder
    from backend import app as _app
    upload_path = _app.UPLOAD_FOLDER
    assert os.path.exists(os.path.join(upload_path, stored))
    # DB record exists
    from backend.app import Document
    doc = Document.query.filter_by(stored_filename=stored).first()
    assert doc is not None
    # cleanup uploaded file if present (the fixture also removes the uploads directory)
    file_path = os.path.join(upload_path, stored)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        # don't fail the test on cleanup problems; print for diagnostics
        print('test cleanup failed:', e)