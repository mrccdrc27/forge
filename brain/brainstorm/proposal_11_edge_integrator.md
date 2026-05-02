# Proposal 11: Forge "IoT Edge Integrator"
**Dimension:** Edge Computing

## Overview
Forge automates the connection between IoT sensors/edge devices and IBM Cloud. It generates the MQTT subscriber logic, data normalization scripts, and Cloud Object Storage uploaders.

## Technology Stack
- **Systems Architect:** `meta-llama/llama-3-3-70b-instruct`.
- **Hardware/Embedded Coder:** `ibm/granite-8b-code-instruct`.
- **Tooling:** `bob -p "create a node.js mqtt client for IBM Watson IoT Platform"`.

## End-to-End Use Case
1. **Goal:** "I need to stream temperature data from my Raspberry Pi to IBM Cloud for analysis."
2. **Action:** Granite generates the device-side Python script and the cloud-side storage function.
3. **Build:** Forge drives Bob Shell to set up the credentials and the message routing.
4. **Impact:** Lowers the barrier for enterprise IoT development.
