from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai import Credentials
import os
import json

class GraniteContractor:
    def __init__(self):
        self.model_id = "meta-llama/llama-3-3-70b-instruct" 
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
        print(f"Executing with {self.model_id}: {prompt[:50]}...")
        # Use generate_text or equivalent
        return self.model.generate_text(prompt, params={"max_new_tokens": 500})
