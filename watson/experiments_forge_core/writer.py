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
