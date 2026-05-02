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
    # 1. Try to find a JSON code block
    code_block_match = re.search(r'```json\s*(\{.*?\})\s*```', text, re.DOTALL)
    if code_block_match:
        return code_block_match.group(1)
    
    # 2. If no code block, try to find the last occurrence of { ... } which is often the final output
    all_json_matches = re.findall(r'\{.*\}', text, re.DOTALL)
    if all_json_matches:
        # Sort by length and take the longest one that is valid JSON
        potential_jsons = sorted(all_json_matches, key=len, reverse=True)
        for pj in potential_jsons:
            try:
                json.loads(pj)
                return pj
            except json.JSONDecodeError:
                continue
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
    try:
        raw_response = contractor.execute_task(prompt)
    except Exception as e:
        print(f"Contractor error: {e}")
        return
    
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
