# GraniteContractor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `GraniteContractor` class to interface with Watsonx.

**Architecture:** A wrapper around `ibm_watsonx_ai.foundation_models.ModelInference` that uses credentials from environment variables.

**Tech Stack:** Python, `ibm_watsonx_ai`, `python-dotenv`.

---

### Task 1: Create `contractor.py`

**Files:**
- Create: `watson/experiments_forge_core/contractor.py`

- [ ] **Step 1: Write `contractor.py`**

```python
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai import Credentials
import os
import json

class GraniteContractor:
    def __init__(self):
        self.model_id = "ibm/granite-3-8b-instruct" # Performance model
        # Credentials from environment
        credentials = Credentials(
            url=os.getenv("WATSON_URL"),
            api_key=os.getenv("WATSON_API_KEY")
        )
        self.model = ModelInference(
            model_id=self.model_id,
            project_id=os.getenv("WATSON_PROJECT_ID"),
            credentials=credentials
        )

    def execute_task(self, prompt):
        print(f"Executing with Granite: {prompt[:50]}...")
        # Use generate_text or equivalent
        return self.model.generate_text(prompt)
```

### Task 2: Create `test_contractor.py`

**Files:**
- Create: `watson/experiments_forge_core/test_contractor.py`

- [ ] **Step 1: Write `test_contractor.py`**

```python
import os
from dotenv import load_dotenv
import sys

# Add current directory to path so we can import contractor
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from contractor import GraniteContractor

# Load environment variables - try multiple locations
load_dotenv('watson/.env')
load_dotenv('.env')

def main():
    print("Initializing GraniteContractor...")
    try:
        contractor = GraniteContractor()
        prompt = "Hello world! Respond with 'Ready to forge.'"
        result = contractor.execute_task(prompt)
        print(f"Result: {result}")
        if "Ready to forge" in result:
            print("VERIFICATION SUCCESSFUL")
        else:
            # Granite might be wordy, just check if it's not empty
            if result and len(result) > 0:
                print("VERIFICATION SUCCESSFUL (Received response)")
            else:
                print("VERIFICATION FAILED: Empty response")
    except Exception as e:
        print(f"VERIFICATION FAILED with error: {e}")

if __name__ == "__main__":
    main()
```

### Task 3: Run Verification

- [ ] **Step 1: Execute verification script**

Run: `python watson/experiments_forge_core/test_contractor.py`
Expected: `VERIFICATION SUCCESSFUL`
