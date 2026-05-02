import os
import json
import re
from dotenv import load_dotenv
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference

# Phase 0 — Setup
load_dotenv()

WATSON_API_KEY = os.getenv("WATSON_API_KEY")
WATSON_PROJECT_ID = os.getenv("WATSON_PROJECT_ID")
WATSON_URL = os.getenv("WATSON_URL", "https://us-south.ml.cloud.ibm.com")

if not all([WATSON_API_KEY, WATSON_PROJECT_ID]):
    print("Error: WATSON_API_KEY and WATSON_PROJECT_ID must be set in .env file.")
    exit(1)

credentials = Credentials(url=WATSON_URL, api_key=WATSON_API_KEY)
client = APIClient(credentials)

model_id = "meta-llama/llama-3-3-70b-instruct"

model = ModelInference(
    model_id=model_id,
    project_id=WATSON_PROJECT_ID,
    credentials=credentials
)

def clean_json(text):
    # Remove markdown code blocks
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    return text.strip()

def experiment_1():
    print("\n--- Experiment 1: Bare minimum call ---")
    response = model.generate_text("What is 2 + 2?")
    print(f"Response: {response}")

def experiment_2():
    print("\n--- Experiment 2: Structured JSON output ---")
    prompt = """
You are a code scaffolding agent. Given a task, output ONLY valid JSON.

Task: "Create a React login component"

Output this shape:
{
  "files": [
    { "path": "src/components/Login.jsx", "content": "..." },
    { "path": "src/components/Login.css", "content": "..." }
  ],
  "dependencies": ["react", "react-dom"]
}

No explanation. No markdown. Only JSON.
"""
    response = model.generate_text(prompt, params={"max_new_tokens": 500})
    print(f"Raw Response: {response}")
    try:
        cleaned = clean_json(response)
        parsed = json.loads(cleaned)
        print("Successfully parsed JSON after cleaning.")
    except Exception as e:
        print(f"Failed to parse JSON: {e}")

def experiment_3():
    print("\n--- Experiment 3: System prompt + chat format ---")
    # Checking if model.chat exists and works
    messages = [
        {"role": "system", "content": "You are a code generation agent. Always output only valid JSON."},
        {"role": "user", "content": "Scaffold a Node.js Express server with one /health endpoint"}
    ]
    try:
        response = model.chat(messages=messages)
        print(f"Chat Response: {response['choices'][0]['message']['content']}")
    except AttributeError:
        print("model.chat() not found. Experimenting with alternative chat-like prompt.")
        chat_prompt = f"<|system|>\n{messages[0]['content']}\n<|user|>\n{messages[1]['content']}\n<|assistant|>\n"
        response = model.generate_text(chat_prompt)
        print(f"Prompt-based Chat Response: {response}")
    except Exception as e:
        print(f"Chat failed: {e}")

def experiment_4():
    print("\n--- Experiment 4: Streaming output ---")
    print("Streaming: ", end="", flush=True)
    for chunk in model.generate_text_stream("Write a Python hello world function"):
        print(chunk, end="", flush=True)
    print("\nDone streaming.")

def experiment_5():
    print("\n--- Experiment 5: Token limits and cost awareness ---")
    prompt = "Scaffold a React todo app with basic styling."
    # Using model.generate which returns more detailed results
    response = model.generate(
        prompt=prompt,
        params={
            "max_new_tokens": 100, 
            "return_options": {
                "input_token_count": True, 
                "generated_token_count": True
            }
        }
    )
    print(f"Detailed Response Type: {type(response)}")
    print(f"Detailed Response: {json.dumps(response, indent=2) if isinstance(response, dict) else response}")

def experiment_6():
    print("\n--- Experiment 6: Multi-step agent simulation ---")
    # Step 1: generate
    task = "Build a React component for a mood tracker with a slider and a submit button"
    scaffold_prompt = f"""
You are a code scaffolding agent. Given a task, output ONLY valid JSON.
Task: "{task}"
Output this shape:
{{
  "files": [
    {{ "path": "path/to/file", "content": "..." }}
  ],
  "dependencies": ["..."]
}}
"""
    scaffold = model.generate_text(scaffold_prompt)
    print(f"Step 1 (Generate) result length: {len(scaffold)}")

    # Step 2: self-verify
    verify_prompt = f"""
You generated this code scaffold:
{scaffold}

Is it complete and runnable? If not, what is missing?
Respond only with JSON: {{"complete": true, "missing": []}}
"""
    verification = model.generate_text(verify_prompt)
    print(f"Step 2 (Verify) response: {verification}")

if __name__ == "__main__":
    experiment_1()
    experiment_2()
    experiment_3()
    experiment_4()
    experiment_5()
    experiment_6()
