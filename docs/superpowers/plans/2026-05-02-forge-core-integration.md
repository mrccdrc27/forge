# Task 4: Forge Core Main Integration Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the main integration loop in `run_mini_forge.py` to coordinate budget checking, content generation, and atomic file writing.

**Architecture:** A central script imports the Sentry (budget), Contractor (LLM), and Writer (file system) modules. It executes a loop that checks resources, requests content for multiple files from the LLM, parses the JSON response, and writes the files.

**Tech Stack:** Python 3, JSON parsing, regex (for markdown stripping).

---

### Task 1: Create the Main Integration Script

**Files:**
- Create: `watson/experiments_forge_core/run_mini_forge.py`

- [ ] **Step 1: Write the implementation of run_mini_forge.py**

```python
import json
import re
import os
from dotenv import load_dotenv
from sentry import ResourceSentry
from writer import AtomicWriter
from contractor import GraniteContractor

# Load environment variables for Granite
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

def extract_json(text):
    """Robust JSON extraction from LLM response (strips markdown backticks)."""
    # Look for the first { and the last }
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return text

def main():
    # sentry.py uses budget_cents (default 100) and has_budget() / log_usage(input, output)
    sentry = ResourceSentry(budget_cents=1000)
    
    # writer.py uses base_path and bulk_write(files_dict)
    # Ensure output directory is within the experiments folder
    base_dir = os.path.join(os.path.dirname(__file__), "output")
    writer = AtomicWriter(base_path=base_dir)
    
    # contractor.py uses execute_task(prompt)
    contractor = GraniteContractor()
    
    prompt = """
    Task: Create a simple Python script 'hello.py' that prints 'Forge Ready' and a 'VERSION.txt' containing '0.1.0'.
    Output ONLY valid JSON: {"files": {"hello.py": "print('Forge Ready')", "VERSION.txt": "0.1.0"}}
    """
    
    # 1. Check budget (sentry uses has_budget with estimated tokens)
    if not sentry.has_budget(estimated_tokens=2000):
        print("Insufficient budget!")
        return
        
    # 2. Call contractor
    print("Requesting content from Granite...")
    raw_response = contractor.execute_task(prompt)
    
    # 3. Parse JSON
    try:
        json_str = extract_json(raw_response)
        data = json.loads(json_str)
        files = data.get("files", {})
        
        if not files:
            print("No files found in response.")
            print("Raw response was:", raw_response)
            return

        # 4. Write files
        print(f"Writing {len(files)} files to {base_dir}...")
        writer.bulk_write(files)
        
        # 5. Log usage (simulating token counts for experiment)
        # Assuming prompt + response is roughly 200 tokens
        sentry.log_usage(input_tokens=100, output_tokens=100)
        print("Success!")
        
    except Exception as e:
        print(f"Error during integration loop: {e}")
        print("Raw response was:", raw_response)

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run the integration script**

Run: `python watson/experiments_forge_core/run_mini_forge.py`
Expected: Output showing success and budget remaining.

- [ ] **Step 3: Verify output files**

Run: `ls watson/experiments_forge_core/output/`
Expected: `hello.py` and `VERSION.txt` exist.

Run: `cat watson/experiments_forge_core/output/hello.py`
Expected: `print('Forge Ready')`
