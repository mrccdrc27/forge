---
title: "IBM watsonx Developer Hub"
source: "https://www.ibm.com/watsonx/developer/capabilities/chat/"
author:
published:
created: 2026-05-02
description: "Watsonx is IBM's AI platform designed for building, training, and deploying AI models, offering tools and services to integrate AI into enterprise workflows efficiently."
tags:
  - "clippings"
---
Free token limit increased!

New 300k token limit for all new, free trials to use for LLM API calls and more. Sign up for free [here](https://dataplatform.cloud.ibm.com/registration/stepone?context=wx).

## Overview

The watsonx.ai chat API & SDK provides ways to interact with foundation models in a conversational format. It allows you to recognize different types of messages, such as system prompts, user inputs, and responses from the foundation model, including follow-up questions and answers. You can use the chat API to recreate the experience of interacting with a foundation model, just like you would in the Prompt Lab’s chat mode.

Not all the available foundation models can be used with the chat API to create a conversational workflow. For information about the full set of supported IBM and third-party foundation models, see [Models](https://www.ibm.com/watsonx/developer/get-started/models).

These models support conversational tasks and can help you integrate foundation models into your applications using the watsonx.ai API & SDK.

## Example

You can generate text by sending a structured list of messages by prompting foundation models programmatically with the API or SDKs.

The following example show a chat interaction discussing the distance between Paris and Bangalore. The example uses the `meta-llama/llama-3-8b-instruct` foundation model, which works well with text generation and also supports [tool calling](https://www.ibm.com/watsonx/developer/capabilities/tool-calling).

Replace `{token}`, `{watsonx_ai_url}`, and `{project_id}` with your information.

```sh
curl -X POST \
-H "Authorization: Bearer {token}" \
-H "Content-Type: application/json" \
"{watsonx_ai_url}/ml/v1/text/chat?version=2024-05-31" \
--data-raw '{
    "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "How far is Paris from Bangalore?"
        }
      ]
    },
    {
      "role": "assistant",
      "content": "The distance between Paris, France, and Bangalore, India, is approximately 7,800 kilometers (4,850 miles)"
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What is the flight distance?"
        }
      ]
    }
  ],
  "parameters": {
    "max_new_tokens": 100,
    "time_limit": 10000
  },
  "model_id": "meta-llama/llama-3-2-3b-instruct",
  "project_id": "{project_id}"
}'
```

For more information and examples, see the [API reference](https://cloud.ibm.com/apidocs/watsonx-ai#text-chat).

The response will include the flight distance between Paris and Bangalore, including any relevant meta data.

## Streaming

You can also enable streaming when using the SDK for Node.js or Python.

```js
try {
  watsonxAIService.generateTextStream(params).then(async (res) => {
    for await (const line of res) {
      console.log(line);
    }
  });
} catch (err) {
  console.warn(err);
}
```