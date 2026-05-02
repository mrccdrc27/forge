import os
import shutil
import unittest
import sys

# Add current directory to sys.path to ensure writer is importable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from writer import AtomicWriter

class TestAtomicWriter(unittest.TestCase):
    def setUp(self):
        # Use a path relative to this script for the test directory
        self.test_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_output")
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)
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
        # We need a path that will definitely fail on open() or makedirs()
        # On Windows, using a path with invalid characters or an empty string as a key 
        # (which leads to trying to create a directory with no name) should fail.
        files = {
            "valid.txt": "valid content",
            "invalid\0path.txt": "invalid content" 
        }
        
        with self.assertRaises(Exception):
            self.writer.bulk_write(files)
        
        # Ensure valid.txt was deleted
        self.assertFalse(os.path.exists(os.path.join(self.test_dir, "valid.txt")))

if __name__ == "__main__":
    unittest.main()
