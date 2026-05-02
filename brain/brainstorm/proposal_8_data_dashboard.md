# Proposal 8: Forge "Data-to-Dashboard Orchestrator"
**Dimension:** Data Engineering

## Overview
Forge automates the creation of data pipelines and visualization dashboards. It uses Llama to map natural language data requests to SQL/Python and Granite to build the frontend visualizers.

## Technology Stack
- **Data Engineer:** `meta-llama/llama-3-3-70b-instruct`.
- **Visualization Coder:** `ibm/granite-8b-code-instruct`.
- **Workflow:** `bob -p "create a python script to fetch CSV data and generate a Plotly chart"`.

## End-to-End Use Case
1. **Request:** "I want to see a weekly trend of user signups from our Postgres DB."
2. **Action:** Granite generates the SQL query and a Node.js endpoint to serve the data.
3. **Execution:** Forge drives Bob Shell to create the visualization frontend using Recharts.
4. **Result:** User gets a functional dashboard in Bob IDE within minutes.
