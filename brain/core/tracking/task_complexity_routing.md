# Issue: Task Complexity Prediction Heuristics

**Subsystem:** Resource Sentry / Resource Manager (`resource_manager.md`)
**Severity:** Medium

## Description
The Resource Manager outlines a routing logic heuristic: `if (task == "trivial") use_local_templates()`. It claims a "Prediction Model" will analyze the complexity of an implementation plan before routing.

## Reality Check
Accurately predicting the complexity of a task *before* execution via a programmatic heuristic is an open research problem and highly prone to error. An algorithmic Resource Manager guessing task complexity is likely to route incorrectly, either wasting budget or failing to execute complex tasks.

## Recommendation
Instead of relying on the Resource Manager to guess algorithmic complexity, rely on the "Planner" model (Llama-3.3 in the IDE). The reasoning model should explicitly tag the complexity and destination of the sub-tasks in its structured output/plan (e.g., `{"task": "scaffold", "complexity": "trivial", "tool": "forge.scaffold"}`). The Resource Manager then just enforces the budget constraints rather than guessing the intent.