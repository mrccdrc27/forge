---
tags: [watsonx, ai, prompt lab, models]
source: IBM-Bob-Dev-Day-hackathon-guide.pdf
date: 2026-05-02
---
[Back to Index](../meta/index.md)

# IBM watsonx.ai

A powerful AI studio that supports the development of agentic AI solutions using [[Foundation Models]] (like IBM Granite). It serves as an inference provider.

*   **Status:** Optional for the hackathon.
*   **[Efficient Usage Tips (PDF)](https://watsonx-hackathons-2026.s3.us.cloud-object-storage.appdomain.cloud/watsonx-ai-platform-efficient-usage-tips.pdf)**
*   **[Track Runtime Usage](https://dataplatform.cloud-object-storage.appdomain.cloud/docs/content/analyze-data/track-runtime-usage.html?context=wx)**

## Credits and Usage
> [!WARNING] Limit
> **$80 credits** are provided. Usage is monitored; account suspends at 100% usage.
*   **[[Tokens]] and Resource Units (RUs)**: 1,000 tokens = 1 Resource Unit (RU) = $0.0001 USD.
*   **[Notebook Runtimes (CUH)](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/notebook-editor.html?context=cpdaas)**: Capacity Unit Hours (CUH) at $1.02 USD per CUH.

## Capabilities
*   **[[Prompt Lab]]**: Interface for prompt engineering and [tuning parameters](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-lab.html?context=wx).
*   **[[Model Gateway]]**: Unified API access for cross-provider routing.
*   **[[Retrieval-Augmented Generation (RAG)]]**: Grounding models in facts.
*   **[[Foundation Models]] Selection**: Choosing the right model (Note: [Smaller models can be better](https://www.ibm.com/think/insights/bigger-isnt-always-better-how-hybrid-ai-pattern-enables-smaller-language-models)).
*   **[Programmatic Access (API/SDK)](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx)**:
    *   [Chat](https://www.ibm.com/watsonx/developer/capabilities/chat)
    *   [Tool Calling](https://www.ibm.com/watsonx/developer/capabilities/tool-calling)
    *   [Text Generation](https://www.ibm.com/watsonx/developer/capabilities/text-generation)
    *   [Embeddings](https://www.ibm.com/watsonx/developer/capabilities/embeddings)
    *   [Text Extraction](https://www.ibm.com/watsonx/developer/capabilities/text-extraction)

## Sources
- [[Source: Choosing a foundation model]]
- [[Source: Supported foundation models]]
- [[Source: Prompt Lab Docs]]
- [[Source: Tokens and Tokenization Docs]]

## Agent Libraries
Supports popular agent frameworks: [LangChain, LangGraph, LlamaIndex, CrewAI, BeeAI, AutoGen](https://www.ibm.com/watsonx/developer/get-started/libraries/).

## Important Restrictions
> [!IMPORTANT] Out of Scope Capabilities
> Do not use: Agent Lab (Beta), Bring your own model, Fine tuning models, AutoAI pipeline, AI governance, Evaluation Studio, SPSS Modeler.
> 
> [!IMPORTANT] Out of Scope Models
> Using these will negatively impact judging: `llama-3-405b-instruct`, `mistral-medium-2505`, `mistral-small-3-1-24b-instruct-2503`.

## Saving Work
The cloud account will be deactivated post-hackathon. Save prompts as templates, notebooks, or export the entire project to retain work.