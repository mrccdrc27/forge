---
title: "Supported foundation models in watsonx.ai — Docs"
source: "https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx"
author:
published:
created: 2026-05-02
description: "You can work with third-party and IBM foundation models in IBM watsonx.ai.You can use foundation models that are provided by IBM and are ready to use immediately, or deploy foundation models on-demand to use exclusively for your organization."
tags:
  - "clippings"
---
You can work with third-party and IBM foundation models in IBM watsonx.ai.You can use foundation models that are provided by IBM and are ready to use immediately, or deploy foundation models on-demand to use exclusively for your organization.

## How to choose a model

To review factors that can help you to choose a model, such as supported tasks and languages, see [Choosing a model](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-model-choose.html?context=wx) and [Foundation model benchmarks](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-model-benchmarks.html?context=wx).

For more information about the foundation models provided with watsonx.ai for embedding and reranking text, see [Supported encoder models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-embed.html?context=wx).

## Accessing models from other providers through the model gateway

You can securely access and interact with foundation models from multiple model providers through the model gateway. The model gateway provides an OpenAI-compatible API that routes requests to these foundation models. Use the model gateway to efficiently switch between multiple model providers by routing and formatting requests through a unified interface. You can build and deploy AI agents, RAG patterns, and more by using these models.

For more information, see [Model gateway](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-model-gateway-overview.html?context=wx).

Attention:

Foundation model availability varies by data center location. For details, see [Regional availability of foundation models](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/regional-datactr.html?context=wx#data-centers).

## Foundation models by deployment method

Depending on the deployment method, you can use foundation models on multitenant hardware directly or deploy models on dedicated hardware for use by your organization. To learn more about the various ways you can use to deploy models, see [Foundation model deployment methods](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-model-deployment-methods.html?context=wx).

| Provider | Provided with watsonx.ai   (Pay per token) | Deploy on demand   (Pay by the hour) |
| --- | --- | --- |
| IBM | • [granite-4-h-small](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-4)   • [granite-guardian-3-8b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-guardian-3-8b)   • [granite-3-8b-base](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-3-8b-base)   • [granite-3-8b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-instruct-models) (deprecated)   • [granite-8b-code-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-instruct-models) | • [granite-4-h-small](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-4)   • [granite-4-h-tiny](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-4)   • [granite-4-h-micro](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-4)   • [granite-vision-3-3-2b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-vision-3-3-2b)   • [granite-3-3-8b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-instruct-3-3-models)   • [granite-3-3-2b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-instruct-3-3-models)   • [granite-3-2-8b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-3-2-8b-instruct)   • [granite-3-1-8b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx##granite-instruct-models)   • [granite-3-1-8b-base](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-3-8b-base)   • [granite-7b-lab](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-7b-lab)   • [granite-8b-japanese](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-8b-japanese)   • [granite-13b-chat-v2](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-13b-chat)   • [granite-20b-multilingual](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-20b-multilingual)   • [granite-3b-code-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-instruct-models)   • [granite-8b-code-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-instruct-models)   • [granite-20b-code-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-instruct-models)   • [granite-34b-code-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-instruct-models)   • [granite-20b-code-base-schema-linking](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-models)   • [granite-20b-code-base-sql-gen](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-models) |
| Meta | • [llama-4-maverick-17b-128e-instruct-fp8](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-4)   • [llama-3-3-70b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-3)   • [llama-3-2-11b-vision-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-2-vision)   • [llama-3-2-90b-vision-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-2-vision) (deprecated)   • [llama-guard-3-11b-vision-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-2-guard)   • [llama-3-405b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1-instruct) (deprecated) | • [llama-4-scout-17b-16e-instruct-fp8-dynamic](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-4)   • [llama-3-2-90b-vision-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-2-vision)   • [llama-3-1-405b-instruct-fp8](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1-instruct)   • [llama-4-maverick-17b-128e-instruct-int4](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-4)   • [llama-4-maverick-17b-128e-instruct-fp8](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-4)   • [llama-3-1-70b-gptq](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1-instruct)   • [llama-3-1-70b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1)   • [llama-3-2-11b-vision-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-2-vision)   • [llama-3-3-70b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-3)   • [llama-3-3-70b-instruct-hf](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-3)   • [llama-3-1-70b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1-instruct)   • [llama-2-70b-chat](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-2)   • [llama-3-8b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3)   • [llama-3-70b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3)   • [llama-3-1-8b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1)   • [llama-3-1-8b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1-instruct) |
| Mistral AI | • [mistral-large-2512](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-large-2512)   • [mistral-medium-2505](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-medium) | • [ministral-3b-instruct-2512](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-model-details.html?context=wx#mistral-3)   • [ministral-8b-instruct-2512](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-model-details.html?context=wx#mistral-3)   • [mistral-large-2512](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-large-2512)   • [mistral-small-3-2-24b-instruct-2506](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-small-3-2-24b-instruct-2506)   • [mistral-medium-2508](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-medium)   • [mistral-medium-2505](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-medium)   • [mistral-small-3-1-24b-instruct-2503](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-small-3-1-24b-instruct-2503)   • [codestral-2501](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#codestral-2501)   • [ministral-8b-instruct-2410](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#ministral-8b-instruct-2410)   • [mistral-large-instruct-2407](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-large)   • [mistral-large-instruct-2411](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-large-instruct-2411)   • [mistral-nemo-instruct-2407](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-nemo-instruct-2407)   • [mixtral-8x7b-base](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mixtral-8x7b-base)   • [mixtral-8x7b-instruct-v01](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mixtral-8x7b-instruct-v01)   • [pixtral-12b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#pixtral-12b) |
| BigScience |  | • [mt0-xxl-13b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mt0-xxl-13b) |
| Code Llama |  | • [codellama-34b-instruct-hf](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#codellama-34b-instruct-hf) |
| DeepSeek AI |  | • [deepseek-r1-distill-llama-8b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#deepseek-r1-distill)   • [deepseek-r1-distill-llama-70b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#deepseek-r1-distill) |
| SDAIA | • [allam-1-13b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#allam-1-13b-instruct) | • [allam-1-13b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#allam-1-13b-instruct) |
| Unified Transcription and Translation for Extended Reality (UTTER) project |  | • [eurollm-1-7b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#eurollm-instruct)   • [eurollm-9b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#eurollm-instruct) |
| LumiOpen |  | • [poro-34b-chat](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#poro-34b-chat) |
| OpenAI | • [gpt-oss-120b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#gpt-oss) | • [gpt-oss-20b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#gpt-oss)   • [gpt-oss-120b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#gpt-oss) |

## Provided foundation models that are ready to use

A collection of open source and IBM foundation models are deployed in IBM watsonx.ai. You can prompt these foundation models in the Prompt Lab or programmatically.

For details on metering for foundation model inference in watsonx.ai, see [Billing rates for inferencing foundation models](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/wxai-runtime-plans-genai.html?context=wx#ru-tokens). For more information about the IBM watsonx.ai service description with various cloud providers, see:

- [watsonx.ai service description on IBM Cloud](https://www.ibm.com/support/customer/csol/terms/?id=i126-6883)
- [watsonx.ai service description on AWS](https://www.ibm.com/support/customer/csol/terms/?id=i127-9067)

You can work with the following types of provided foundation models:

- [IBM foundation models](#ibm-provided)
- [Third-party foundation models](#third-party-provided)

### IBM foundation models

The following table lists the supported IBM foundation models that IBM provides for inferencing.

You can also access some IBM foundation models from third-party repositories, such as Hugging Face. IBM foundation models that you obtain from a third-party repository are not indemnified by IBM. Only IBM foundation models that you access from watsonx.ai are indemnified by IBM. For more information about contractual protections related to IBM indemnification, see the [IBM Client Relationship Agreement](https://www.ibm.com/support/customer/csol/terms/?id=Z126-6548&cc=us&lc=en).

Attention:

If your watsonx region is the Dallas data center on IBM Cloud, you can follow the model card links. Otherwise, search for the model name in the Resource hub. The model might not be available in all regions or cloud platforms.

| Model name | API model ID | Input price   (USD/1,000 tokens) | Output price   (USD/1,000 tokens) | Context window   (input + output tokens) | More information |
| --- | --- | --- | --- | --- | --- |
| [granite-4-h-small](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-4) | `` `ibm/granite-4-h-small` `` | $0.0000636 | $0.000265 | 131,072 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/ibm/granite-4-h-small?context=wx)   • [Website](https://www.ibm.com/granite/docs/models/granite) |
| [granite-3-8b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-instruct-models) | `` `ibm/granite-3-8b-instruct` `` | $0.000212 | $0.000212 | 131,072 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/ibm/granite-3-8b-instruct?context=wx)   • [Website](https://www.ibm.com/granite/docs/)   • [Research paper](http://ibm.biz/granite-report) |
| [granite-guardian-3-8b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-guardian-3-8b) | `` `ibm/granite-guardian-3-8b` `` | $0.0002 | $0.0002 | 131,072 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/ibm/granite-guardian-3-8b?context=wx)   • [Website](https://github.com/ibm-granite/granite-guardian) |
| [granite-8b-code-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-instruct-models) | `` `ibm/granite-8b-code-instruct` `` | $0.000636 | $0.000636 | 128,000 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/ibm/granite-8b-code-instruct?context=wx)   • [Website](https://www.ibm.com/granite/docs/models/code)   • [Research paper](https://arxiv.org/pdf/2405.04324) |

| Model name | API model ID | Input price   (USD/1,000 data points) | Output price   (USD/1,000 data points) | Context length   Min data points | More information |
| --- | --- | --- | --- | --- | --- |
| [granite-ttm-512-96-r2](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-time-series) | `` `ibm/granite-ttm-512-96-r2` `` | $0.0001378 | $0.0004028 | 512 | • [Model card](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2)   • [Website](https://www.ibm.com/granite/docs/models/time-series/)   • [Research paper](https://arxiv.org/abs/2401.03955) |
| [granite-ttm-1024-96-r2](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-time-series) | `` `ibm/granite-ttm-1024-96-r2` `` | $0.0001378 | $0.0004028 | 1,024 | • [Model card](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2)   • [Website](https://www.ibm.com/granite/docs/models/time-series/)   • [Research paper](https://arxiv.org/abs/2401.03955) |
| [granite-ttm-1536-96-r2](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-time-series) | `` `ibm/granite-ttm-1536-96-r2` `` | $0.0001378 | $0.0004028 | 1,536 | • [Model card](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2)   • [Website](https://www.ibm.com/granite/docs/models/time-series/)   • [Research paper](https://arxiv.org/abs/2401.03955) |

### Third-party foundation models

The following table lists the supported third-party foundation models that are provided with watsonx.ai.

Attention:

If your watsonx region is the Dallas data center on IBM Cloud, you can follow the model card links. Otherwise, search for the model name in the Resource hub. The model might not be available in all regions or cloud platforms.

| Model name | API model ID | Provider | Input price   (USD/1,000 tokens) | Output price   (USD/1,000 tokens) | Context window   (input + output tokens) | More information |
| --- | --- | --- | --- | --- | --- | --- |
| [allam-1-13b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#allam-1-13b-instruct) | `` `sdaia/allam-1-13b-instruct` `` | National Center for Artificial Intelligence and Saudi Authority for Data and Artificial Intelligence | $0.001908 | $0.001908 | 4,096 | • [Model card](https://www.ibm.com/docs/en/SSYOK8/wsj/analyze-data/assets/ALLaM-1-1-13b-instruct-model-card.pdf) |
| [gpt-oss-120b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#gpt-oss) | `` `openai/gpt-oss-120b` `` | OpenAI | $0.000159 | $0.000636 | 131,072 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/openai/gpt-oss-120b?context=wx)   • [OpenAI blog](https://openai.com/index/introducing-gpt-oss/) |
| [llama-4-maverick-17b-128e-instruct-fp8](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-4) | `` `meta-llama/llama-4-maverick-17b-128e-instruct-fp8` `` | Meta | $0.000371 | $0.001484 | 131,072 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/meta-llama/llama-4-maverick-17b-128e-instruct-fp8?context=wx)   • [Meta AI blog](https://ai.meta.com/blog/llama-4-multimodal-intelligence/) |
| [llama-3-3-70b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-3) | `` `meta-llama/llama-3-3-70b-instruct` `` | Meta | $0.0007526 | $0.0007526 | 131,072 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/meta-llama/llama-3-3-70b-instruct?context=wx)   • [Meta AI blog](https://ai.meta.com/blog/) |
| [llama-3-2-11b-vision-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-2-vision) | `` `meta-llama/llama-3-2-11b-vision-instruct` `` | Meta | $0.000371 | $0.000371 | 131,072 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/meta-llama/llama-3-2-11b-vision-instruct?context=wx)   • [Meta AI blog](https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/)   • [Research paper](https://arxiv.org/pdf/2407.21783) |
| [llama-3-2-90b-vision-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-2-vision) | `` `meta-llama/llama-3-2-90b-vision-instruct` `` | Meta | $0.00212 | $0.00212 | 131,072 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/meta-llama/llama-3-2-90b-vision-instruct?context=wx)   • [Meta AI blog](https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/)   • [Research paper](https://arxiv.org/pdf/2407.21783) |
| [llama-guard-3-11b-vision](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-2-guard) | `` `meta-llama/llama-guard-3-11b-vision` `` | Meta | $0.000371 | $0.000371 | 131,072 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/meta-llama/llama-guard-3-11b-vision?context=wx)   • [Meta AI blog](https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/)   • [Research paper](https://arxiv.org/pdf/2407.21783) |
| [llama-3-405b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1-instruct) | `` `meta-llama/llama-3-405b-instruct` `` | Meta | $0.0053 | $0.01696 | 16,384 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/meta-llama/llama-3-405b-instruct?context=wx)   • [Meta AI blog](https://ai.meta.com/blog/meta-llama-3-1/) |
| [mistral-large-2512](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-large-3) | `` `mistralai/mistral-large-2512` `` | Mistral AI | $0.000636 | $0.001908 | 256,000 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/mistral-large-2512?context=wx)   • [Blog post for Mistral Large 3](https://mistral.ai/news/mistral-3) |
| [mistral-medium-2505](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-medium) | `` `mistralai/mistral-medium-2505` `` | Mistral AI | $0.00337 | $0.01007 | 131,072 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/mistralai/mistral-medium-2505?context=wx)   • [Blog post for Mistral Medium 3](https://mistral.ai/news/mistral-medium-3) |
| [mistral-small-3-1-24b-instruct-2503](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-small-3-1-24b-instruct-2503) | `` `mistralai/mistral-small-3-1-24b-instruct-2503` `` | Mistral AI | $0.000106 | $0.000318 | 131,072 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/mistralai/mistral-small-3-1-24b-instruct-2503?context=wx)   • [Blog post for Mistral 3.1](https://mistral.ai/news/mistral-small-3-1) |
| [mt0-xxl-13b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mt0-xxl-13b) | `` `bigscience/mt0-xxl` `` | BigScience | $0.001908 | $0.001908 | 4,096 | • [Model card](https://dataplatform.cloud.ibm.com/wx/samples/models/bigscience/mt0-xxl?context=wx)   • [Research paper](https://arxiv.org/abs/2211.01786) |

## Deploy on demand foundation models

You can work with a foundation model from a set of IBM-curated models to deploy for the exclusive use of your organization.

You can choose to deploy the following foundation models on demand:

- [IBM deploy on demand foundation models](#dod-ibm-provided)
- [Third-party deploy on demand foundation models](#dod-third-party-provided)
Attention:

Deploying models on demand by specifying the deployment configuration size is deprecated. Use GPU hardware configuration for new model deployments and to calculate the price for hosting models. For details about the model hosting environments and pricing for deploy on demand models, see [Billing details for generative AI assets](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/wxai-runtime-plans-genai.html?context=wx#cfm-dod).

### IBM deploy on demand foundation models

The following table lists the IBM foundation models that you can deploy on demand.

Some IBM foundation models are also available from third-party repositories, such as Hugging Face. IBM foundation models that you obtain from a third-party repository are not indemnified by IBM. Only IBM foundation models that you access from watsonx.ai are indemnified by IBM. For more information about contractual protections related to IBM indemnification, see the [IBM Client Relationship Agreement](https://www.ibm.com/support/customer/csol/terms/?id=Z126-6548&cc=us&lc=en).

| Model name | Deployment configuration size | Context window   (input + output tokens) |
| --- | --- | --- |
| [granite-vision-3-3-2b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-vision-3-3-2b) | – | 131,072 |
| [granite-3-3-8b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-instruct-3-3-models) | Small | 131,072 |
| [granite-3-3-2b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-instruct-3-3-models) | Small | 131,072 |
| [granite-3-2-8b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-3-2-8b-instruct) | Small | 131,072 |
| [granite-3-1-8b-base](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-3-1-8b-base) | Small | 131,072 |
| [granite-8b-japanese](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-8b-japanese) | Small | 4,096 |
| [granite-20b-multilingual](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-20b-multilingual) | Small | 8,192 |
| [granite-13b-chat-v2](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-13b-chat) | Small | 8,192 |
| [granite-3b-code-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-instruct-models) | Small | 128,000 |
| [granite-8b-code-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-instruct-models) | Small | 128,000 |
| [granite-20b-code-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-instruct-models) | Small | 8,192 |
| [granite-34b-code-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-instruct-models) | Small | 8,192 |
| [granite-20b-code-base-schema-linking](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-models) | Small | 8,192 |
| [granite-20b-code-base-sql-gen](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-code-models) | Small | 8,192 |
| [granite-3-8b-base](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#granite-3-8b-base) | Small | 4,096 |

### Third-party deploy on demand foundation models

Note: There is an hourly access fee when you deploy certain foundation models for dedicated use. The total price for hosting these deploy on demand foundation models is the sum of the access price plus the hosting price.

GPU hosting price per hour in USD + Access fee per hour in USD = Total price per hour in USD

For details about GPU configuration pricing, see [Hourly billing costs for deploy on demand models](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/wxai-runtime-plans-genai.html?context=wx#cfm-dod).

The following table lists the third-party foundation models that you can deploy on demand.

| Model name | Provider | Access fee per hour in USD | Deployment configuration size | Context window   (input + output tokens) |
| --- | --- | --- | --- | --- |
| [allam-1-13b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#allam-1-13b-instruct) | National Center for Artificial Intelligence and Saudi Authority for Data and Artificial Intelligence | – | Small | 4,096 |
| [codellama-34b-instruct-hf](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#codellama-34b-instruct-hf) | Code Llama | – | Medium | 16,384 |
| [deepseek-r1-distill-llama-8b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#deepseek-r1-distill) | DeepSeek AI | – | Small | 131,072 |
| [deepseek-r1-distill-llama-70b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#deepseek-r1-distill) | DeepSeek AI | – | Large | 131,072 |
| [eurollm-1-7b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#eurollm-instruct) | Utter project | – | Small | 4,096 |
| [eurollm-9b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#eurollm-instruct) | Utter project | – | Small | 4,096 |
| [gpt-oss-20b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#gpt-oss) | OpenAI | – | – | 131,072 |
| [gpt-oss-120b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#gpt-oss) | OpenAI | – | – | 131,072 |
| [llama-2-13b-chat](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-2) | Meta | – | Small | 4,096 |
| [llama-2-70b-chat](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-2) | Meta | – | Large | 4,096 |
| [llama-3-8b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3) | Meta | – | Small | 8,192 |
| [llama-3-70b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3) | Meta | – | Large | 8,192 |
| [llama-3-1-8b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1) | Meta | – | Small | 131,072 |
| [llama-3-1-70b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1) | Meta | – | Large | 131,072 |
| [llama-3-1-8b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1-instruct) | Meta | – | Small | 131,072 |
| [llama-3-1-70b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1-instruct) | Meta | – | Large | 131,072 |
| [llama-3-1-70b-gptq](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1-instruct) | Meta | – | – | 131,072 |
| [llama-3-1-405b-instrcut-fp8](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-1-instruct) | Meta | – | – | 131,072 |
| [llama-3-2-11b-vision-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-2-vision) | Meta | – | Small | 131,072 |
| [llama-3-2-90b-vision-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-2-vision) | Meta | – | – | 131,072 |
| [llama-3-3-70b-instruct](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-3) | Meta | – | Medium | 131,072 |
| [llama-3-3-70b-instruct-hf](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-3-3) | Meta | – | Large | 131,072 |
| [llama-4-maverick-17b-128e-instruct-fp8](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-4) | Meta | – | – | 131,072 |
| [llama-4-maverick-17b-128e-instruct-int4](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-4) | Meta | – | – | 131,072 |
| [llama-4-scout-17b-16e-instruct-fp8-dynamic](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#llama-4) | Meta | – | – | 131,072 |
| [codestral-2501](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#codestral-2501) | Meta | $34.30 | – | 65,536 |
| [ministral-3b-instruct-2512](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#ministral-3) | Mistral AI | – | – | 262,144 |
| [ministral-8b-instruct-2512](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#ministral-3) | Mistral AI | – | – | 262,144 |
| [ministral-8b-instruct-2410](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx#ministral-8b-instruct-2410) | Mistral AI | $8.60 | – | 131,072 |
| [mistral-large-2512](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-large-instruct-2411) | Mistral AI | – | – | 256,000 |
| [mistral-large-instruct-2407](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-large) | Mistral AI | $34.30 | Large | 131,072 |
| [mistral-large-instruct-2411](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-large-instruct-2411) | Mistral AI | $34.30 | Large | 131,072 |
| [mistral-medium-2505](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-medium) | Mistral AI | $34.30 | – | 131,072 |
| [mistral-medium-2508](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-medium) | Mistral AI | $34.30 | – | 131,072 |
| [mistral-nemo-instruct-2407](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-nemo-instruct-2407) | Mistral AI | – | Small | 131,072 |
| [mistral-small-3-1-24b-instruct-2503](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-small-3-1-24b-instruct-2503) | Mistral AI | – | – | 131,072 |
| [mistral-small-3-2-24b-instruct-2506](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mistral-small-3-2-24b-instruct-2506) | Mistral AI | – | – | 131,072 |
| [mixtral-8x7b-base](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mixtral-8x7b-base) | Mistral AI | – | Medium | 32,768 |
| [mixtral-8x7b-instruct-v01](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mixtral-8x7b-instruct-v01) | Mistral AI | – | Medium | 32,768 |
| [mt0-xxl-13b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#mt0-xxl-13b) | BigScience | – | Small | 4,096 |
| [pixtral-12b](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#pixtral-12b) | Mistral AI | – | – | 128,000 |
| [poro-34b-chat](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx#poro-34b-chat) | LumiOpen | – | Medium | 2,048 |

## Learn more

- [IBM foundation models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-ibm.html?context=wx)
- [Third-party foundation models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx)
- For a list of which models are provided in each regional data center, see [Regional availability of foundation models](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/regional-datactr.html?context=wx#data-centers).
- For details about foundation model pricing, see [Billing details for generative AI assets](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/wxai-runtime-plans-genai.html?context=wx).
- For information about pricing and rate limiting, see [watsonx.ai Runtime plans](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/wml-plans.html?context=wx#ru-metering).