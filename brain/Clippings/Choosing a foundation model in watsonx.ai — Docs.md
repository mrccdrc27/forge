---
title: "Choosing a foundation model in watsonx.ai — Docs"
source: "https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-model-choose.html?context=wx"
author:
published:
created: 2026-05-02
description: "There are many factors to consider when you choose a foundation model to use for inferencing from a generative AI project."
tags:
  - "clippings"
---
There are many factors to consider when you choose a foundation model to use for inferencing from a generative AI project.

For example, for a solution that summarizes call center problem reports, you might want a foundation model with these characteristics:

- Scores well on benchmarks for summarization tasks
- Handles large amounts of text, which means a large context window length
- Can interpret images of damaged items, so accepts inputs in both text and image modalities

Determine which factors are most important for you and your organization.

After you have a short list of models that best fit your needs, you can test the models to see which ones consistently return the results you want.

## Foundation models that support your use case

To get started, find foundation models that can do the type of task that you want to complete.

The following table shows the types of tasks that the foundation models in IBM watsonx.ai support. A checkmark (✓) indicates that the task that is named in the column header is supported by the foundation model. For some of the tasks, you can click a link to go to a sample prompt for the task.

| Model | Conversation   from Chat API | Tool interaction   from Chat API | Retrieval-augmented generation (RAG) | Samples |
| --- | --- | --- | --- | --- |
| granite-4-h-small | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| granite-4-h-tiny | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| granite-4-h-micro | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| granite-3-1-8b-base | ✓ | ✓ | ✓   RAG from Prompt Lab | • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| granite-3-3-2b-instruct | ✓ |  | ✓   RAG from Prompt Lab | • [Q&A](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample4b)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| granite-3-3-8b-instruct | ✓ |  | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Q&A](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample4b) |
| granite-7b-lab | ✓ |  | ✓   RAG from Prompt Lab | • [Summarization](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample5e)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| granite-8b-japanese |  |  | ✓   RAG from Prompt Lab | • [Q&A](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample4e)   • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8c) |
| granite-20b-multilingual | ✓ |  | ✓   RAG from Prompt Lab | • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8d)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| granite-3-2-8b-instruct | ✓ | ✓ | ✓   RAG from Prompt Lab | • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| granite-3-8b-instruct | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6c)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| granite-guardian-3-8b | ✓ |  |  | • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1ba) |
| granite-3b-code-instruct |  |  |  | • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6c)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| granite-8b-code-instruct | ✓ |  |  | • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6c)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| granite-20b-code-instruct | ✓ |  |  | • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6c)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| granite-20b-code-base-schema-linking |  |  |  | • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample-sql2text-link) |
| granite-20b-code-base-sql-gen |  |  |  | • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample-sql2text-gen) |
| granite-34b-code-instruct | ✓ |  |  | • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6c)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| granite-vision-3-3-2b | ✓ |  |  | • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| allam-1-13b-instruct |  |  | ✓   RAG from Prompt Lab | • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1e)   • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8e) |
| codellama-34b-instruct-hf |  |  |  | • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6a) |
| codestral-2501 |  |  |  | • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6a) |
| deepseek-r1-distill-llama-8b | ✓ |  |  | • [Q&A](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample4i) |
| deepseek-r1-distill-llama-70b | ✓ |  |  | • [Q&A](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample4i) |
| eurollm-1-7b-instruct | ✓ |  |  | • [Q&A](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample4e)   • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8a)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| eurollm-9b-instruct | ✓ |  |  | ✓   • [Q&A](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample4e)   • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8a)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| gpt-oss-20b | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| gpt-oss-120b | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| llama-4-maverick-17b-128e-instruct-int4 | ✓ | ✓ | ✓   • RAG from Prompt Lab | • [Chat](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx#llama-4)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx) |
| llama-4-maverick-17b-128e-instruct-fp8 | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Dialog](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample7a1)   • [Chat](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx#llama-4)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx) |
| llama-4-scout-17b-16e-instruct-fp8-dynamic | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Dialog](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample7a1)   • [Chat](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx#llama-4)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx) |
| llama-3-3-70b-instruct | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Sample chat](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample7a0)   • [Tool-calling sample](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| llama-3-2-11b-vision-instruct | ✓ | ✓ | ✓   RAG from Prompt Lab | • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling sample](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| llama-3-2-90b-vision-instruct | ✓ | ✓ | ✓   RAG from Prompt Lab | • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling sample](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| llama-3-1-8b |  |  | ✓   RAG from Prompt Lab | • [Dialog](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample7a0) |
| llama-3-1-8b-instruct | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Dialog](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample7a0)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| llama-3-1-70b | ✓ |  | ✓   RAG from Prompt Lab | • [Dialog](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample7a0) |
| llama-3-1-70b-instruct | ✓ | ✓ | ✓   RAG from AutoAI | • [Dialog](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample7a0)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| llama-3-405b-instruct-fp8 | ✓ | ✓ | ✓   RAG from Prompt Lab | • [Dialog](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample7a0)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| llama-3-70b-instruct |  |  | ✓   RAG from Prompt Lab | • [Dialog](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample7a0)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| llama-3-8b-instruct |  |  | ✓   RAG from Prompt Lab | • [Dialog](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample7a0)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| llama-guard-3-11b-vision | ✓ |  | ✓   RAG from Prompt Lab | • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1ba)   • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| ministral-8b-instruct-2410 |  | ✓ | ✓   RAG from Prompt Lab | • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1a)   • [Extraction](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample2b)   • [Summarization](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample5a)   • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8b) |
| ministral-3b-instruct-2512 | ✓ | ✓ | ✓   RAG from Prompt Lab | • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx) |
| ministral-8b-instruct-2512 | ✓ | ✓ | ✓   RAG from Prompt Lab | • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx) |
| mistral-large-2512 | ✓ | ✓ | ✓   • RAG from Prompt Lab | • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1a)   • [Extraction](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample2b)   • [Summarization](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample5a)   • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6a)   • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8b)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| mistral-large-instruct-2407 (Dedicated) | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1a)   • [Extraction](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample2b)   • [Summarization](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample5a)   • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6a)   • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8b)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Tool-calling](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| mistral-large-instruct-2411 | ✓ |  | ✓   RAG from Prompt Lab | ✓   • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1a)   • [Extraction](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample2b)   • [Summarization](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample5a)   • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6a)   • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8b)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |
| mistral-medium | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx) |
| mistral-nemo-instruct-2407 |  |  | ✓   RAG from Prompt Lab | • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1a)   • [Extraction](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample2b)   • [Generation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample3b)   • [Summarization](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample5a)   • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6a)   • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8b) |
| mistral-small-3-1-24b-instruct-2503 | ✓ | ✓ | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx)   • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx)   • [Tool-calling](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat-tools.html?context=wx) |
| mixtral-8x7b-base |  |  | ✓   • RAG from Prompt Lab | • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1a)   • [Extraction](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample2b)   • [Generation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample3b)   • [Summarization](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample5a)   • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6a)   • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8b) |
| mixtral-8x7b-instruct-v01 | ✓ |  | ✓   • RAG from Prompt Lab   • RAG from AutoAI | • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1a)   • [Extraction](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample2b)   • [Generation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample3b)   • [Summarization](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample5a)   • [Code](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample6a)   • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample8b) |
| mt0-xxl-13b |  |  | ✓   RAG from Prompt Lab | • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1a)   • [Q&A](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample4a) |
| pixtral-12b |  |  | ✓   RAG from Prompt Lab | • [Classification](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample1a)   • [Extraction](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample2b)   • [Summarization](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#sample5a)   • [Chat with image example](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-data.html?context=wx) |
| poro-34b-chat | ✓ |  | ✓   RAG from Prompt Lab | • [Translation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx#translation)   • [Chat API](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-chat.html?context=wx) |

- To review various prompt samples that are grouped by task type, see [Sample prompts](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-prompt-samples.html?context=wx).
- To determine how well a foundation model can perform certain tasks, see [Foundation model benchmarks](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-model-benchmarks.html?context=wx).

## Multimodal foundation models

Multimodal foundation models are capable of processing and integrating information from many modalities or types of data. These modalities can include text, images, audio, video, and other forms of sensory input.

The multimodal foundation models that are available from watsonx.ai can do the following types of tasks:

**Image-to-text generation**

Useful for visual question answering, interpretation of charts and graphs, captioning of images, and more.

**Audio-to-text generation**

Useful for speech recognition, transcription of spoken content, voice command understanding, meeting note generation, accessibility support, and more.

The following table lists the available foundation models that support modalities other than text-in and text-out.

| Model | Input modalities | Output modalities |
| --- | --- | --- |
| llama-4-maverick-17b-128e-instruct-fp8 | image, text | text |
| llama-3-2-11b-vision-instruct | image, text | text |
| llama-3-2-90b-vision-instruct | image, text | text |
| llama-guard-3-11b-vision | image, text | text |
| ministral-3b-instruct-2512 | image, text | text |
| ministral-8b-instruct-2512 | image, text | text |
| mistral-large-2512 | image, text | text |
| mistral-small-3-2-24b-instruct-2506 | image, text | text |
| pixtral-12b | image, text | text |

## Foundation models that support your language

Many foundation models work well only in English. But some model creators include multiple languages in the pretraining data sets to fine-tune their model on tasks in different languages, and to test their model's performance in multiple languages. If you plan to build a solution for a global audience or a solution that does translation tasks, look for models that were created with multilingual support in mind.

The following table lists natural languages that are supported in addition to English by foundation models in watsonx.ai. For more information about the languages that are supported for multilingual foundation models, see the model card for the foundation model.

Attention:

If your watsonx region is the Dallas data center on IBM Cloud, you can follow the model card links. Otherwise, search for the model name in the Resource hub. The model might not be available in all regions or cloud platforms.

| Model | Languages other than English |
| --- | --- |
| Granite 4.0 (granite-4-h-small, granite-4-h-micro, granite-4-h-tiny ) | German, Spanish, French, Japanese, Portuguese, Arabic, Czech, Italian, Korean, Dutch, and Chinese. You can fine tune these Granite models for languages beyond these 12 languages |
| Granite 3.1 (granite-3-1-8b-base) | English, German, Spanish, French, Japanese, Portuguese, Arabic, Czech, Italian, Korean, Dutch, and Chinese |
| Granite 3 (granite-3-8b-base) | English, German, Spanish, French, Japanese, Portuguese, Arabic, Czech, Italian, Korean, Dutch, Chinese (Simplified) |
| granite-8b-japanese | Japanese |
| granite-20b-multilingual | German, Spanish, French, and Portuguese |
| Granite Instruct 3.3 (granite-3-3-2b-instruct, granite-3-3-8b-instruct) | English, German, Spanish, French, Japanese, Portuguese, Arabic, Czech, Italian, Korean, Dutch, and Chinese |
| Granite Instruct 3.2 (granite-3-2-8b-instruct) | English, German, Spanish, French, Japanese, Portuguese, Arabic, Czech, Italian, Korean, Dutch, and Chinese (Simplified) |
| Granite Instruct 3.1 (granite-3-8b-instruct) | English, German, Spanish, French, Japanese, Portuguese, Arabic, Czech, Italian, Korean, Dutch, and Chinese (Simplified) |
| allam-1-13b-instruct | Arabic |
| EuroLLM Instruct models | Bulgarian, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, German, Greek, Hungarian, Irish, Italian, Latvian, Lithuanian, Maltese, Polish, Portuguese, Romanian, Slovak, Slovenian, Spanish, Swedish, Arabic, Catalan, Chinese, Galician, Hindi, Japanese, Korean, Norwegian, Russian, Turkish, and Ukrainian |
| jais-13b-chat | Arabic |
| Llama 4 (llama-4-maverick-17b-128e-instruct-fp8) | Arabic, French, German, Hindi, Indonesian, Italian, Portuguese, Spanish, Tagalog, Thai, and Vietnamese. |
| Llama 3.3 (llama-3-3-70b-instruct, llama-3-3-70b-instruct-hf) | English, German, French, Italian, Portuguese, Hindi, Spanish, and Thai |
| Llama 3.2 (llama-3-2-1b-instruct, llama-3-2-3b-instruct. Also llama-3-2-11b-vision-instruct, llama-3-2-90b-vision-instruct, and llama-guard-3-11b-vision with text-only inputs) | English, German, French, Italian, Portuguese, Hindi, Spanish, and Thai |
| Llama 3.1 (llama-3-1-8b-instruct, llama-3-1-70b-instruct, llama-3-405b-instruct) | English, German, French, Italian, Portuguese, Hindi, Spanish, and Thai |
| Ministral 3 (ministral-3b-instruct-2512, ministral-8b-instruct-2512) | French, Spanish, German, Italian, Portuguese, Dutch, Chinese, Japanese, Korean, Arabic, and dozens of other languages. |
| mistral-large | Multilingual ([See model card](https://dataplatform.cloud.ibm.com/wx/samples/models/mistralai/mistral-large?context=wx)) |
| mistral-large-instruct-2411, mistral-nemo-instruct-2407 | Multiple languages, especially English, French, German, Spanish, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, and Hindi. |
| Mistral Medium (mistral-medium-2505, mistral-medium-2508) | Multilingual (See model card) |
| mistral-small-3-1-24b-instruct-2503 | English, French, German, Greek, Hindi, Indonesian, Italian, Japanese, Korean, Malay, Nepali, Polish, Portuguese, Romanian, Russian, Serbian, Spanish, Swedish, Turkish, Ukrainian, Vietnamese, Arabic, Bengali, Chinese, Farsi and more. |
| mixtral-8x7b-base, mixtral-8x7b-instruct-v01 | French, German, Italian, Spanish |
| mt0-xxl-13b | Multilingual ([See model card](https://dataplatform.cloud.ibm.com/wx/samples/models/bigscience/mt0-xxl-curated?context=wx)) |
| poro-34b-chat | English and Finnish |

## Foundation models that you can tune

You can run tuning experiments that change the parameter weights of the underlying foundation model to guide the model to generate output that is optimized for a task.

The following table shows the methods that you can use to tune foundation models provided in IBM watsonx.ai. A checkmark (✓) indicates that the tuning method that is named in the column header is supported by the foundation model.

| Model name | LoRA fine tuning | QLoRA fine tuning |
| --- | --- | --- |
| granite-3-1-8b-base | ✓ |  |
| llama-3-1-8b | ✓ |  |
| llama-3-1-70b-gptq |  | ✓ |

For more information, see [Choosing a model to tune](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-tuning-model-choose.html?context=wx).

## Model types and IP indemnification

Review the intellectual property indemnification policy for the foundation model that you want to use. Some third-party foundation model providers require you to exempt them from liability for any IP infringement that might result from the use of their AI models.

IBM-developed foundation models that are available from watsonx.ai have standard intellectual property protection, similar to what IBM provides for hardware and software products.

IBM extends its standard intellectual property indemnification to the output that is generated by covered models. *Covered Models* include IBM-developed and some third-party foundation models that are available from watsonx.ai. Third-Party Covered Models are identified in table 4.

The following table describes the different foundation model types and their indemnification policies. See the reference materials for full details.

| Foundation model type | Indemnification policy | Foundation models | Details | Reference materials for IBM cloud | Reference materials for AWS Multicloud |
| --- | --- | --- | --- | --- | --- |
| IBM Covered Model | Uncapped IBM indemnification | • IBM Granite   • IBM Slate | IBM-developed foundation models that are available from watsonx.ai. | See [Service description](https://www.ibm.com/support/customer/csol/terms/?id=i126-6883) | See [Service description](https://www.ibm.com/support/customer/csol/terms/?id=i127-9067) |
| Third-Party Covered Model | Capped IBM indemnification | Mistral Commercial Models | Third-party covered models that are available from watsonx.ai. | See [Service description](https://www.ibm.com/support/customer/csol/terms/?id=i126-6883) | See [Service description](https://www.ibm.com/support/customer/csol/terms/?id=i127-9067) |
| Non-IBM Product | No IBM indemnification | Various | Third-party models that are available from watsonx.ai and are subject to their respective license terms, including associated obligations and restrictions. | See model information. | See [Service description](https://www.ibm.com/support/customer/csol/terms/?id=i127-9067) |
| Custom Model | No IBM indemnification | Various | Foundation models that you import to use in watsonx.ai are Client content. | Client is solely responsible for the selection and use of the model and output and compliance with third-party license terms, obligations, and restrictions. | See [Service description](https://www.ibm.com/support/customer/csol/terms/?id=i127-9067) |

For more information about third-party model license terms, see [Third-party foundation models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-details.html?context=wx).

## More considerations for choosing a model

| Model attribute | Considerations |
| --- | --- |
| Context length | Sometimes called *context window length*, *context window*, or *maximum sequence length*, context length is the maximum allowed value for the number of tokens in the input prompt plus the number of tokens in the generated output. When you generate output with models in watsonx.ai, the number of tokens in the generated output is limited by the Max tokens parameter. |
| Cost | The cost of using foundation models is measured in resource units. The price of a resource unit is based on the rate of the pricing tier for the foundation model. |
| Fine-tuned | After a foundation model is pretrained, many foundation models are fine tuned for specific tasks, such as classification, information extraction, summarization, responding to instructions, answering questions, or participating in a back-and-forth dialog chat. A model that undergoes fine tuning on tasks similar to your planned use typically do better with zero-shot prompts than models that are not fine tuned in a way that fits your use case. One way to improve results for a fine-tuned model is to structure your prompt in the same format as prompts in the data sets that were used to fine tune that model. |
| Instruction-tuned | *Instruction-tuned* means that the model was fine tuned with prompts that include an instruction. When a model is instruction tuned, it typically responds well to prompts that have an instruction even if those prompts don't have examples. |
| IP indemnity | In addition to license terms, review the intellectual property indemnification policy for the model. For more information, see [Model types and IP indemnification](#indemno). |
| License | In general, each foundation model comes with a different license that limits how the model can be used. Review model licenses to make sure that you can use a model for your planned solution. |
| Model architecture | The architecture of the model influences how the model behaves. A transformer-based model typically has one of the following architectures:   • *Encoder-only*: Understands input text at the sentence level by transforming input sequences into representational vectors called embeddings. Common tasks for encoder-only models include classification and entity extraction.   • *Decoder-only*: Generates output text word-by-word by inference from the input sequence. Common tasks for decoder-only models include generating text and answering questions.   • *Encoder-decoder*: Both understands input text and generates output text based on the input text. Common tasks for encoder-decoder models include translation and summarization. |
| Regional availability | You can work with models that are available in the same IBM Cloud regional data center as your watsonx services. |
| Supported programming languages | Not all foundation models work well for programming use cases. If you are planning to create a solution that summarizes, converts, generates, or otherwise processes code, review which programming languages were included in a model's pretraining data sets and fine-tuning activities to determine whether that model is a fit for your use case. |