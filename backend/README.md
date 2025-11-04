# Riseup Africa — Backend (development)

Lightweight Flask backend for prototype and local development.

Run locally (Windows PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

The server runs on http://127.0.0.1:5000 by default. Endpoints:

- GET /api/health — status
- GET /api/opportunities — list of opportunities (JSON)
- GET /api/youth — list of youth (JSON)
- GET /api/search?q=term — search suggestions (JSON)
- POST /api/login — prototype login (accepts JSON {email,password})
- POST /api/apply — prototype apply (accepts JSON)

This is intentionally minimal for the prototype. Use `seed` behavior in the app to populate initial sample data.
