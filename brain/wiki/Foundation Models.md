---
tags:
  - concept
  - watsonx
---

# Foundation Models

Foundation models are large-scale AI models trained on vast amounts of data, capable of performing a wide range of tasks including text generation, code generation, and image processing.

## Types in watsonx.ai
- **IBM Granite**: IBM-developed models for business use cases, including code, time-series, and language tasks.
- **Third-Party**: Includes Llama (Meta), Mistral, and others.
- **Multimodal**: Models that process both text and images (e.g., [[Granite Vision]]).

## Selection Criteria
- **Benchmarks**: Performance on specific tasks (summarization, Q&A).
- **Context Window**: Maximum number of [[Tokens]] the model can process at once.
- **Modality**: Support for text-only or text+image inputs.

## Deployment
- **Pay-per-token**: Multitenant hardware.
- **Deploy-on-demand**: Dedicated hardware (pay-by-hour).

## Sources
- [[Source: Choosing a foundation model]]
- [[Source: Supported foundation models]]
