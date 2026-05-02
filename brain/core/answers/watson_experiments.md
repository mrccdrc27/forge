# 🧠 Forge Core Q&A: Watson Experiments & Findings
> **"Validating the Sidecar Mechanics"**

## ❓ Q: What was the goal of the /watson experiments?
**A:** To template and empirically test the four "Superpowers" of the Forge Core:
1.  **Resource Management (Sentry):** Can we track tokens and block execution before a budget is blown?
2.  **Atomic Operations (Writer):** Can we write multiple files simultaneously and roll back safely on failure?
3.  **Tiered Delegation (Contractor):** Can we offload "commodity" tasks to smaller, faster models like IBM Granite?
4.  **Integration Loop (Mini-Forge):** Do these parts work together in a single autonomous cycle?

---

## ❓ Q: How is the Resource Sentry structured in /watson?
**A:** It acts as a "Fuel Gauge" for the AI.
- **The Mechanic:** Tracks `input_tokens` and `output_tokens` across every request.
- **The Logic:** Uses a `price_per_1k` heuristic (optimized for IBM Granite) to calculate cost in real-time.
- **The Result:** It exposes a `has_budget()` check that is called *before* any model inference, preventing expensive "Token Runaway."

---

## ❓ Q: What did the Atomic Writer experiment prove?
**A:** That multi-file expansion can be made safe via transaction-like logic.
- **Atomic Bulk Write:** Instead of writing files sequentially (where a fail at file 3 leaves a mess), Forge buffers the operation.
- **Rollback Capability:** If an error occurs (e.g., "Disk Full" or "Invalid Path"), Forge deletes the partial artifacts from the current batch, ensuring the workspace stays clean.

---

## ❓ Q: Why did we pivot models during the Granite Contractor test?
**A:** Regional availability and task-specific performance.
- **Granite vs. Llama:** While Granite-8B is the target "Contractor" for speed/cost, we found that Llama-3-3-70B was more reliable for the **Integration Loop** specifically for generating structured JSON payloads without markdown noise.
- **The Finding:** Forge must be "Model Agnostic"—routing tasks based on the specific capability needed (e.g., Granite for code-gen, Llama for complex JSON structuring).

---

## 🧪 Experiment Structure: /watson/experiments_forge_core/

| Component | File | Responsibility |
| :--- | :--- | :--- |
| **The Sentry** | `sentry.py` | Cost tracking and budget gating. |
| **The Writer** | `writer.py` | Atomic multi-file writes with rollback. |
| **The Contractor** | `contractor.py` | Watsonx interface for the execution model. |
| **Mini-Forge** | `run_mini_forge.py` | The main autonomous integration loop. |

---

## ❓ Q: What are the key takeaways for the Forge MVP?
**A:** 
1. **JSON is the Glue:** The Contractor must output strict JSON for the Writer to work; regex-based "Markdown Stripping" is essential.
2. **Budgeting is Preventive:** Sentry logic must be baked into the MCP tool layer, not just the UI.
3. **Atomic Writing is Mandatory:** To prevent broken codebases, we must never write single files when a feature spans multiple files.

---
**Last Updated:** 2026-05-02
**Status:** Experimental Validation Complete.
