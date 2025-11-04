import time
import os
import importlib.util
from pathlib import Path


def _load_backend_with_db(db_path):
    """Helper: set BACKEND_DB_URI and import backend/app.py as a fresh module."""
    # ensure absolute path
    db_uri = f"sqlite:///{db_path}"
    os.environ['BACKEND_DB_URI'] = db_uri
    HERE = Path(__file__).resolve().parent
    APP_PY = HERE.parent / 'app.py'
    spec = importlib.util.spec_from_file_location('backend_app', str(APP_PY))
    backend_app = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(backend_app)
    return backend_app


def test_register_verify_login_create_opportunity(tmp_path):
    db_file = tmp_path / 'test_register.db'
    backend_app = _load_backend_with_db(str(db_file))

    # ensure DB/tables exist
    backend_app.seed_data()

    client = backend_app.app.test_client()

    # unique email per test run
    email = f"testdonor_py{int(time.time())}@example.com"
    password = "TestPass123!"
    name = "Py Donor"

    # register
    rv = client.post("/api/register", json={"email": email, "password": password, "name": name, "role": "donor"})
    assert rv.status_code == 200, f"register failed: {rv.data}"
    data = rv.get_json()
    assert data.get("ok") is True
    verify_url = data.get("verification_url")
    assert verify_url, "no verification_url returned"

    # verify (verification_url is a path like /api/verify?token=...)
    rv = client.get(verify_url)
    assert rv.status_code == 200, f"verify failed: {rv.data}"
    vdata = rv.get_json()
    assert vdata.get("ok") is True

    # login
    rv = client.post("/api/login", json={"email": email, "password": password})
    assert rv.status_code == 200, f"login failed: {rv.data}"
    ldata = rv.get_json()
    assert ldata.get("ok") is True

    # me
    rv = client.get("/api/me")
    assert rv.status_code == 200
    m = rv.get_json()
    assert m.get("authenticated") is True
    assert m.get("role") == "donor"

    # create opportunity
    rv = client.post("/api/opportunities", json={"title": "Test Opp", "location": "Remote", "description": "desc"})
    assert rv.status_code == 201, f"create_opportunity failed: {rv.status_code} {rv.data}"
    odata = rv.get_json()
    assert odata.get("id")

    # confirm presence and owner in listing
    rv = client.get("/api/opportunities")
    assert rv.status_code == 200
    ops = rv.get_json()
    found = next((o for o in ops if o.get("title") == "Test Opp"), None)
    assert found is not None, f"Created opportunity not found in list: {ops}"
    assert found.get("owner") and found["owner"].get("name") == name


def test_anonymous_post_fails(tmp_path):
    db_file = tmp_path / 'test_anon.db'
    backend_app = _load_backend_with_db(str(db_file))
    backend_app.seed_data()
    client = backend_app.app.test_client()

    # attempt to create opportunity without login
    rv = client.post("/api/opportunities", json={"title": "Anon Opp"})
    assert rv.status_code == 401 or rv.status_code == 403


def test_upload_and_apply_flow(tmp_path):
    db_file = tmp_path / 'test_upload_apply.db'
    backend_app = _load_backend_with_db(str(db_file))
    backend_app.seed_data()
    client = backend_app.app.test_client()

    # register and verify a donor
    email = f"uploader{int(time.time())}@example.com"
    password = "TestPass123!"
    rv = client.post("/api/register", json={"email": email, "password": password, "name": "Uploader", "role": "donor"})
    data = rv.get_json()
    client.get(data.get("verification_url"))
    client.post("/api/login", json={"email": email, "password": password})

    # create opportunity
    rv = client.post("/api/opportunities", json={"title": "Upload Opp", "location": "City", "description": "desc"})
    assert rv.status_code == 201
    opp = rv.get_json()
    op_id = opp.get('id')

    # call upload endpoint without a file to assert route is reachable and returns 400
    rv = client.post(f"/api/opportunities/{op_id}/upload")
    assert rv.status_code == 400

    # register another user and apply
    email2 = f"applicant{int(time.time())}@example.com"
    rv = client.post("/api/register", json={"email": email2, "password": password, "name": "Applicant", "role": "user"})
    data = rv.get_json()
    client.get(data.get("verification_url"))
    client2 = backend_app.app.test_client()
    client2.post("/api/login", json={"email": email2, "password": password})

    # apply to opportunity using separate client (applicant session)
    rv = client2.post("/api/apply", json={"opportunity_id": op_id})
    assert rv.status_code == 200
    a = rv.get_json()
    assert a.get('ok') is True

