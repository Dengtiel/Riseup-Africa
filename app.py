"""Top-level WSGI entrypoint for Riseup Africa.

Vercel (and other Python hosts) look for an `app` variable in a top-level module.
This file imports the existing Flask app from `backend/app.py` and exposes it as
`app` so deployment works without refactoring the backend.
"""
from backend import app as backend_app_module

# `backend.app` defines a Flask instance named `app`; expose it here as `app`.
app = backend_app_module.app

if __name__ == "__main__":
    # Run locally when executed directly
    app.run(debug=True)
