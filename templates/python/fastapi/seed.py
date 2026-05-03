import os

def main():
    print("🚀 Initializing FastAPI seed...")
    
    # Core boilerplate code
    app_code = """from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI!"}
"""

    with open("main.py", "w") as f:
        f.write(app_code)
    
    print("✅ main.py created.")
    print("Seed initialization complete.")

if __name__ == "__main__":
    main()
