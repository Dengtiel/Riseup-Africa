# Riseup Africa — Local Development README

This repository contains a small prototype web application (frontend + Flask backend) used to manage opportunities and youth profiles.

The instructions below are written for Windows (PowerShell) and assume you have Python 3.10+ installed. They show how to set up a virtual environment, install dependencies, run the dev server, and run the automated tests.

## Quick facts
- Frontend: static files (served from project root)
- Backend: Flask app at `backend/app.py`
- Database: SQLite (`backend/data.db` by default) — tests use isolated SQLite files
- Uploads: saved to `uploads/` in the project root

## 1) Prerequisites
- Python 3.10 or newer installed and on PATH
- Git (optional, if you cloned this repository)

## 2) Create and activate a virtual environment (PowerShell)
Open PowerShell in the project root (where this README lives) and run:

```powershell
# create a venv named .venv
python -m venv .venv

# Activate in PowerShell
# If you get an execution policy error you can run PowerShell as Admin and run:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\.venv\Scripts\Activate.ps1

# You should now see '(.venv)' in your prompt
```

If you prefer cmd.exe use:

```cmd
.\.venv\Scripts\activate.bat
```

## 3) Install dependencies

```powershell
# from project root
.\.venv\Scripts\pip.exe install -r requirements.txt
```

If you need to add a new package later, install it into the venv and update `requirements.txt` with:

```powershell
.\.venv\Scripts\pip.exe freeze > requirements.txt
```

## 4) Run the development server

The backend application is in `backend/app.py`. It seeds demo data on startup (if needed) and listens on `127.0.0.1:5000` by default.

Start the dev server from the project root:

```powershell
# recommended: ensure the virtualenv is active (see step 2)
python backend\app.py
```

Open your browser at:

```
http://127.0.0.1:5000/
```

Notes:
- The server seeds demo data the first time it runs.
- Uploaded files are written to `uploads/` (created automatically).
- For development you can set a secret via environment variable `HAF_SECRET` before running the app:

```powershell
$env:HAF_SECRET = 'your-secret-here'
python backend\app.py
```

## 5) Running tests (pytest)

Tests are under `backend/tests`. They run against isolated temporary SQLite files by default.

Run the tests:

```powershell
.\.venv\Scripts\pytest.exe -q
```

Or run a single test file:

```powershell
.\.venv\Scripts\pytest.exe -q backend/tests/test_register_verify_create_opportunity.py
```

If you'd like the tests to use a custom DB URI, set the `BACKEND_DB_URI` environment variable before running pytest. Example:

```powershell
$env:BACKEND_DB_URI = 'sqlite:///C:\tmp\my_test.db'
.\.venv\Scripts\pytest.exe -q
```

## 6) API notes (useful endpoints)
- `POST /api/register` — registers a new user. Prototype returns a `verification_url` you can open to verify the account.
- `GET /api/verify?token=...` — verify an email token. This sets a session for the verified user.
- `POST /api/login` — login (expects `email` and `password`). Sets a server-side session cookie.
- `GET /api/me` — returns current session user info (authenticated/email/role/profiles).
- `GET /api/opportunities` and `POST /api/opportunities` — list/create opportunities. Creating requires a logged-in donor.

All endpoints are reachable at `http://127.0.0.1:5000/api/...` when the dev server is running.

## 7) Troubleshooting
- If the server says port 5000 is in use, stop the other process or change the port in `backend/app.py` (last line `app.run(debug=True, port=XXXX)`).
- If Python complains about missing packages, ensure the venv is active and run the install command in step 3.
- If session-based login appears not to persist in external HTTP tools, test using the browser (the app sets cookie for the running origin) or use the Python/PowerShell session helper shown earlier.

## 8) Next improvements (suggested)
- Convert `backend/app.py` to a factory (`create_app`) for cleaner testing and configuration.
- Add a small `Makefile` or PowerShell script to automate start/test steps.
- Add CI integration to run pytest on push.

---

# If you'd like, I can also add a simple PowerShell helper script (run.ps1) that activates the venv and starts the server in one step. Say the word and I will add it.
# Riseup Africa — UnseenFutures (Verified Opportunity Platform)

Short description
-----------------
UnseenFutures (a.k.a. Riseup Africa) is a verified opportunity platform that empowers marginalized African graduates (refugees, IDPs, vulnerable youth, persons with disabilities) by matching them with donors, scholarships, internships, vocational programs, and mentorships — only after documents and recommendation letters are reviewed and field verification (when required) is completed.

What's included
----------------
- `UnseenFutures_SRS.md` — Full Software Requirements Specification (SRS) produced for the platform.
- Existing HTML pages in the workspace (front-end MVP static pages): `index.html`, `donor_dashboard.html`, `youth_dashboard.html`, `admin_verification.html`, `profile_upload.html`, `opportunity_detail.html`.
- `docs/mission_problem.md` — condensed mission statement, problem statement, hypothesis and references for quick sharing.

MVP technology suggestions
--------------------------
- Frontend: Static HTML + Bootstrap for quick MVP; React for next iteration.
- Backend: Flask (Python) or Node.js (Express) for APIs.
- Database: SQLite for initial MVP, PostgreSQL for production.
- Hosting: Small VPS or Platform-as-a-Service (Heroku/Azure App Service) for MVP.

How to run an initial local MVP (static pages)
---------------------------------------------
For a simple local preview of the existing static HTML pages (no backend yet):

# Use PowerShell to start a basic HTTP server (Python must be installed)
python -m http.server 8000

Then open `http://localhost:8000/` in your browser and navigate to the files.

Next steps (recommended)
------------------------
1. Wireframe missing pages and implement forms for registration, document upload, and admin verification UI.
2. Implement a minimal backend API (Flask/Express) with endpoints for user registration, file uploads, verification management, opportunities, and applications.
3. Add authentication (JWT / session) and role-based access control.
4. Implement secure file storage (server filesystem or cloud object storage) and ensure HTTPS in deployment.
5. Add automated tests: unit tests for API endpoints and an end-to-end test for registration → verification → application.

Contact / Author
----------------
Prepared by Deng Mayen Deng Akol (ALU)

License
-------
This is project documentation for academic / prototype use. Add a license file if you want to make it public.
