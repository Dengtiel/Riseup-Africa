import sqlite3, os

db = 'backend/data.db'
if not os.path.exists(db):
    print('backend/data.db not found')
else:
    conn = sqlite3.connect(db)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
    tables = [r[0] for r in cur.fetchall()]
    print('TABLES:', tables)
    conn.close()
