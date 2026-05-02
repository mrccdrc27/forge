import os
from dotenv import load_dotenv
import sys

# Add current directory to path so we can import contractor
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from contractor import GraniteContractor

# Load environment variables - try multiple locations
# 1. From root
load_dotenv(os.path.join(current_dir, '..', '.env'))
# 2. From CWD
load_dotenv('.env')

def main():
    print("Initializing GraniteContractor...")
    try:
        # Check if environment variables are set
        url = os.getenv("WATSON_URL")
        api_key = os.getenv("WATSON_API_KEY")
        project_id = os.getenv("WATSON_PROJECT_ID")
        
        if not all([url, api_key, project_id]):
            print(f"ERROR: Missing environment variables.")
            print(f"WATSON_URL: {'Set' if url else 'Missing'}")
            print(f"WATSON_API_KEY: {'Set' if api_key else 'Missing'}")
            print(f"WATSON_PROJECT_ID: {'Set' if project_id else 'Missing'}")
            return

        contractor = GraniteContractor()
        prompt = "Hello world! Respond with 'Ready to forge.'"
        result = contractor.execute_task(prompt)
        print(f"Result: {result}")
        
        if result and len(result) > 0:
            print("VERIFICATION SUCCESSFUL (Received response)")
            if "Ready to forge" in result:
                print("Exact expected phrase found!")
        else:
            print("VERIFICATION FAILED: Empty response")
            
    except Exception as e:
        print(f"VERIFICATION FAILED with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
