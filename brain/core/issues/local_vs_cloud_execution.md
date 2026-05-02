# Issue: Local vs. Cloud Execution Ambiguity

**Subsystem:** Core Capabilities / MCP Hub (`capabilities_and_scope.md`, `mcp_hub.md`)
**Severity:** Resolved (Documentation Update)

## Description
There was ambiguity in the documentation regarding "local execution" vs. "local models" and whether the Granite-8B model was expected to run locally on the user's machine.

## Reality Check / Resolution
To clear up the ambiguity:
1. **Code Execution:** All actual code execution (e.g., running tests, building, scripts) occurs **locally** within the user's environment to interact with the workspace directly.
2. **LLM Inference:** **No LLMs are hosted locally.** The architecture standardizes entirely on the Watsonx API for all model inferences (both the high-level Llama-3.3 planner and the Granite-8B execution workers). 

This resolves the high-risk hardware dependency of attempting to run an 8-billion parameter model locally during the hackathon MVP, while keeping workspace actions (like testing) local.

## Recommendation
Ensure all architectural diagrams and documentation clearly separate the concepts of "Local Code Execution" from "Cloud LLM Inference via Watsonx API".