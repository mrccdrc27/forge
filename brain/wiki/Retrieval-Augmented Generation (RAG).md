---
tags:
  - concept
  - watsonx
---

# Retrieval-Augmented Generation (RAG)

Retrieval-Augmented Generation (RAG) is a pattern used to ground foundation model responses in factual data.

## Implementation in watsonx.ai
- **Prompt Lab**: Upload documents directly to ground the chat.
- **Vector Stores**: Connect to third-party vector stores for larger datasets.
- **AutoAI**: Automated RAG workflows for specific models (e.g., Granite).

## Grounding
- Helps reduce hallucinations by providing the model with relevant context.
- Uses "System Prompts" to define how the model should use the retrieved information.

## Sources
- [[Source: Choosing a foundation model]]
- [[Source: Prompt Lab Docs]]
