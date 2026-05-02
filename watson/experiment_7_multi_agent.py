import os
import json
import re
from dotenv import load_dotenv
from ibm_watsonx_ai.foundation_models import ModelInference

load_dotenv('watson/.env')

credentials = {
    "url": os.getenv("WATSON_URL"),
    "apikey": os.getenv("WATSON_API_KEY")
}
project_id = os.getenv("WATSON_PROJECT_ID")

def clean_json(text):
    # Remove markdown code blocks
    text = re.sub(r'```json\s*|\s*```', '', text).strip()
    # Find the first { and last }
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end != -1:
        text = text[start:end+1]
    return text

def get_model(model_id):
    return ModelInference(
        model_id=model_id,
        credentials=credentials,
        project_id=project_id,
        params={
            "max_new_tokens": 1000,
            "temperature": 0.1
        }
    )

manager = get_model("meta-llama/llama-3-3-70b-instruct")
worker = get_model("ibm/granite-8b-code-instruct")

print("--- EXPERIMENT 7: MULTI-AGENT ORCHESTRATION ---\n")

# Phase 1: Planning
request = "Create a FastAPI endpoint /greet/{name} that returns a JSON message and appends the name to a local file 'visitors.txt'."
print(f"[MANAGER - Llama-3.3-70b] Requirement: {request}")

plan_prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a Technical Lead. Decompose the user request into a specific coding task.
Output ONLY valid JSON. No prose.<|eot_id|><|start_header_id|>user<|end_header_id|>

Requirement: {request}

Output format:
{{
  "task_description": "Detailed implementation instructions",
  "file_target": "main.py"
}}<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""

try:
    plan_raw = manager.generate_text(prompt=plan_prompt)
    plan_json = clean_json(plan_raw)
    plan = json.loads(plan_json)
    print(f"[MANAGER] Created Plan: {json.dumps(plan, indent=2)}\n")

    # Phase 2: Execution
    print(f"[WORKER - Granite-8b-Code] Executing task: {plan['task_description']}")
    worker_prompt = f"Question: {plan['task_description']}\n\nAnswer:\n"
    code = worker.generate_text(prompt=worker_prompt)
    print(f"[WORKER] Generated Code:\n{code}\n")

    # Phase 3: Validation
    print("[MANAGER - Llama-3.3-70b] Validating output...")
    validation_prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Compare code against requirement. Output ONLY JSON: {{"valid": true, "feedback": "string"}}<|eot_id|><|start_header_id|>user<|end_header_id|>

Requirement: {request}
Code:
{code}
<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""

    val_raw = manager.generate_text(prompt=validation_prompt)
    validation = json.loads(clean_json(val_raw))
    print(f"[MANAGER] Validation Result: {json.dumps(validation, indent=2)}")

except Exception as e:
    print(f"ERROR: {str(e)}")
    if 'plan_raw' in locals(): print(f"Raw Plan: {plan_raw}")
    if 'val_raw' in locals(): print(f"Raw Val: {val_raw}")
