# AtomicWriter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an `AtomicWriter` class for bulk file operations with rollback and verify its behavior.

**Architecture:** A Python class `AtomicWriter` that handles bulk writing of files provided in a dictionary. It tracks successfully written files and deletes them if any write operation in the batch fails.

**Tech Stack:** Python 3 (os, shutil)

---

### Task 1: Implement AtomicWriter

**Files:**
- Create: `watson/experiments_forge_core/writer.py`

- [x] **Step 1: Write implementation**

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
                
                # Backup if exists (simplified for experiment)
                # In this task, just track written files for deletion on error
                
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

### Task 2: Create and Run Verification Script

**Files:**
- Create: `watson/experiments_forge_core/test_writer.py`

- [x] **Step 1: Create verification script**

```python
import os
import shutil
import unittest
from writer import AtomicWriter

class TestAtomicWriter(unittest.TestCase):
    def setUp(self):
        self.test_dir = "test_output"
        os.makedirs(self.test_dir, exist_ok=True)
        self.writer = AtomicWriter(base_path=self.test_dir)

    def tearDown(self):
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)

    def test_bulk_write_success(self):
        files = {
            "a.txt": "content a",
            "subdir/b.txt": "content b"
        }
        self.writer.bulk_write(files)
        
        self.assertTrue(os.path.exists(os.path.join(self.test_dir, "a.txt")))
        self.assertTrue(os.path.exists(os.path.join(self.test_dir, "subdir/b.txt")))
        
        with open(os.path.join(self.test_dir, "a.txt"), "r") as f:
            self.assertEqual(f.read(), "content a")

    def test_bulk_write_rollback(self):
        files = {
            "valid.txt": "valid content",
            "": "invalid path content" # Empty path should cause error
        }
        
        with self.assertRaises(Exception):
            self.writer.bulk_write(files)
        
        # Ensure valid.txt was deleted
        self.assertFalse(os.path.exists(os.path.join(self.test_dir, "valid.txt")))

if __name__ == "__main__":
    unittest.main()
```

- [x] **Step 2: Run verification script**

Run: `python3 watson/experiments_forge_core/test_writer.py`
Expected: 2 tests passed.

### Task 3: Cleanup and Report

- [x] **Step 1: Remove verification script** (Optional, based on user preference, but let's keep it for now as proof)
- [x] **Step 2: Final status check**
