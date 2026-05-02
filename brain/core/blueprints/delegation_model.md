[Back to Core Index](../index.md)

# AI Feature: The Delegation Model
**"The Architect vs. The Contractor"**

Forge operates on a **Strategic Delegation** model, dividing labor between the primary reasoning engine and the Forge execution host.

## 🏗️ Roles & Responsibilities

### 1. The Architect (IBM Bob / VS Code)
*   **Role:** Reasoning, Strategy, and Decision Making.
*   **Model Profile:** High-Reasoning (e.g., Llama-3.3-70B+).
*   **Key Output:** Implementation Plans, Feature Blueprints, and logic verification.
*   **Context:** Maintains the high-level "Why" of the project.

### 2. The Contractor (Forge)
*   **Role:** Surgical & Bulk Execution.
*   **Model Profile:** Performance-Optimized (e.g., IBM Granite-8B).
*   **Key Output:** Code generation, Shell command execution, and File system operations.
*   **Context:** Maintains the low-level "How" of the implementation.

## 🤝 The Hand-off Process
1.  **Plan:** The Architect generates a structured implementation plan (blueprint).
2.  **Contract:** The Architect identifies "Commodity Tasks" (boilerplate, standard patterns) and sends them to Forge via MCP.
3.  **Execute:** Forge performs the heavy lifting (writing files, running installs) using cost-effective models.
4.  **Verify:** Forge reports completion, and the Architect verifies the result.
