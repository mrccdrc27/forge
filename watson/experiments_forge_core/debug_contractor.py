import os
from dotenv import load_dotenv
from contractor import GraniteContractor

# Load environment variables for Granite
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

def test_contractor():
    contractor = GraniteContractor()
    prompt = "Hello, respond with ONLY the word 'SUCCESS'"
    try:
        response = contractor.execute_task(prompt)
        print(f"Response: '{response}'")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_contractor()
