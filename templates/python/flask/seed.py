import os

def main():
    print("🚀 Initializing Flask seed...")
    
    app_code = """from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World from Flask!'
"""

    with open("app.py", "w") as f:
        f.write(app_code)
    
    print("✅ app.py created.")
    print("Seed initialization complete.")

if __name__ == "__main__":
    main()
