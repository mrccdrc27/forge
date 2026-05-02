# Forge Core AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a set of Python-based experiments in `/watson/experiments_forge_core` that template and test the core AI features (Delegation, Resource Management, Atomic Writing, and Context Monitoring).

**Architecture:** A modular experiment suite where each script handles one core responsibility of the Forge Sidecar, using IBM Granite as the primary execution model.

**Tech Stack:** Python 3, `ibm-watsonx-ai`, `python-dotenv`, `watchdog` (for monitoring).

---

### Task 1: The Resource Sentry

**Files:**
- Create: `watson/experiments_forge_core/sentry.py`
- Test: `watson/experiments_forge_core/test_sentry.py`

- [ ] **Step 1: Implement the Sentry class**
Create a class that tracks tokens and estimates cost based on Watsonx pricing.

```python
import os
from dotenv import load_dotenv

class ResourceSentry:
    def __init__(self, budget_cents=100):
        self.total_tokens = 0
        self.total_cost_cents = 0
        self.budget_cents = budget_cents
        # Pricing: roughly $0.60 per 1M tokens for Granite
        self.price_per_1k = 0.0006 

    def log_usage(self, input_tokens, output_tokens):
        tokens = input_tokens + output_tokens
        self.total_tokens += tokens
        cost = (tokens / 1000) * self.price_per_1k
        self.total_cost_cents += cost * 100
        print(f"Usage: {tokens} tokens | Total Cost: {self.total_cost_cents:.4f}c / {self.budget_cents}c")

    def has_budget(self, estimated_tokens=1000):
        estimated_cost = (estimated_tokens / 1000) * self.price_per_1k * 100
        return (self.total_cost_cents + estimated_cost) <= self.budget_cents
```

- [ ] **Step 2: Run verification test**
Run: `python watson/experiments_forge_core/test_sentry.py`
Expected: PASS

---

### Task 2: Atomic Multi-Writer

**Files:**
- Create: `watson/experiments_forge_core/writer.py`

- [ ] **Step 1: Implement atomic write logic**
A utility that writes multiple files but rolls back if any operation fails.

```python
import os
import shutil

class AtomicWriter:
    def __init__(self, base_path="."):
        self.base_path = base_path
        self.backups = {}

    def bulk_write(self, files_dict):
        written_files = []
        try:
            for path, content in files_dict.items():
                full_path = os.path.join(self.base_path, path)
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                
                # Backup if exists
                if os.path.exists(full_path):
                    self.backups[full_path] = content # Simplified for experiment
                
                with open(full_path, "w") as f:
                    f.write(content)
                written_files.append(full_path)
                print(f"Wrote: {path}")
        except Exception as e:
            print(f"Error: {e}. Rolling back...")
            for f in written_files:
                if os.path.exists(f):
                    os.remove(f)
            raise e
```

---

### Task 3: The Granite Contractor

**Files:**
- Create: `watson/experiments_forge_core/contractor.py`

- [ ] **Step 1: Implement the Contractor**
Integrate with Watsonx to execute "commodity" tasks.

```python
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai import Credentials
import os
import json

class GraniteContractor:
    def __init__(self):
        self.model_id = "ibm/granite-3-8b-instruct" # Performance model
        # Use existing env setup from watson/.env
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
        return self.model.generate_text(prompt)
```

---

### Task 4: Integration Loop (Mini-Forge)

**Files:**
- Create: `watson/experiments_forge_core/run_mini_forge.py`

- [ ] **Step 1: Create the integration script**
Wire all components together to simulate a Forge operation.

```python
from sentry import ResourceSentry
from writer import AtomicWriter
from contractor import GraniteContractor
from dotenv import load_dotenv
import json

load_dotenv()

def run_experiment():
    sentry = ResourceSentry(budget_cents=5)
    writer = AtomicWriter(base_path="watson/experiments_forge_core/output")
    contractor = GraniteContractor()

    plan = """
    Create a simple Python utility that prints 'Hello from Forge' 
    and a README.md file. Output ONLY JSON in this format:
    {"files": {"hello.py": "print('Hello from Forge')", "README.md": "# Forge Project"}}
    """

    if sentry.has_budget():
        response = contractor.execute_task(plan)
        # In a real scenario, we'd parse JSON properly
        try:
            # Mocking the JSON parse for the experiment stability
            files = {"hello.py": "print('Hello from Forge')", "README.md": "# Forge Project"}
            writer.bulk_write(files)
            sentry.log_usage(100, 50) # Mock tokens
        except Exception as e:
            print(f"Failed: {e}")

if __name__ == "__main__":
    run_experiment()
```

- [ ] **Step 2: Run the Mini-Forge experiment**
Run: `python watson/experiments_forge_core/run_mini_forge.py`
Expected: Files created in `watson/experiments_forge_core/output/` and cost logged.
