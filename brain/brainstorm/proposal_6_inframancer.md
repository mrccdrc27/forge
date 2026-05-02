# Proposal 6: Forge "Cloud-Native Inframancer"
**Dimension:** DevOps & Infrastructure

## Overview
Forge turns architecture descriptions into deployment-ready infrastructure code (IaC). It specializes in IBM Cloud resources, generating Bicep, Terraform, or Kubernetes manifests via Bob Shell.

## Technology Stack
- **Cloud Architect:** `meta-llama/llama-3-3-70b-instruct`.
- **IaC Specialist:** `ibm/granite-8b-code-instruct`.
- **Provisioning:** `bob -p "generate terraform for a VPC with 2 public subnets and an Object Storage bucket"`.

## End-to-End Use Case
1. **Request:** "I need to deploy this app to IBM Cloud with a PostgreSQL database and auto-scaling."
2. **Planning:** Llama designs the network topology.
3. **Action:** Granite generates the `.tf` files.
4. **Validation:** Forge runs `terraform validate` to ensure correctness before handing it to the user in Bob IDE.
