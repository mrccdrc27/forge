---
title: "IBM watsonx Developer Hub"
source: "https://www.ibm.com/watsonx/developer/capabilities/tool-calling/"
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

Tool calling enables a chat model to respond to a given prompt by invoking an (external) tool. When using watsonx.ai you can use the API or SDKs with supported chat models, and pass a list of tools from which the model will suggest what tool to use to answer your question.

Here are the foundation models that you can use with the chat API in conjunction with tool calling:

- `ibm/granite-3-8b-instruct`
- `meta-llama/llama-3-3-70b-instruct`
- `meta-llama/llama-3-2-1b-instruct`
- `meta-llama/llama-3-2-3b-instruct`
- `meta-llama/llama-3-2-11b-vision-instruct`
- `meta-llama/llama-3-2-90b-vision-instruct`
- `meta-llama/llama-guard-3-11b-vision-instruct`
- `mistralai/mistral-large`

Support for tool calling will be added to more models over time.

## Example

You can generate text by sending a structured list of messages, together with a list of tools.

The following example uses the `mistralai/mistral-large` foundation model, which works well with text generation and also supports [tool calling](https://www.ibm.com/watsonx/developer/capabilities/tool-calling). The model is given a single tool called `add`, and a message with the question “What is 2 plus 4?“. The response of the model will be a new message containing the tool that should be called, including the method of calling that tool.

Replace `{token}`, `{watsonx_ai_url}`, and `{project_id}` with your information.

```sh
curl -X POST \
-H "Authorization: Bearer {token}" \
-H "Content-Type: application/json" \
"{watsonx_ai_url}/ml/v1/text/chat?version=2024-05-31" \
--data-raw '{
    "model_id": "mistralai/mistral-large",
    "project_id": "{project_id}",
    "messages": [{
        "role": "user",
        "content": [{
            "type": "text",
            "text": "What is 2 plus 4?"
        }]
    }],
    "tools": [{
        "type": "function",
        "function": {
            "name": "add",
            "description": "Adds the values a and b to get a sum.",
            "parameters": {
                "type": "object",
                "properties": {
                    "a": {
                        "description": "A number value",
                        "type": "number"
                    },
                    "b": {
                        "description": "A number value",
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b"
                ]
            }
        }
    }],
    "tool_choice_option": "auto",
    "max_tokens": 300,
    "time_limit": 1000
  }'
```

For more information and examples, see the [API reference](https://cloud.ibm.com/apidocs/watsonx-ai#text-chat).

The response of the model will look something like the following JSON:

```json
{
  "id": "chat-a00942a130e84f83bc0090c38c2f419f",
  "model_id": "mistralai/mistral-large",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "tool_calls": [
          {
            "id": "chatcmpl-tool-77cbe4e94d88489383a0c6ed1b644674",
            "type": "function",
            "function": {
              "name": "add",
              "arguments": "{\"a\": 2, \"b\": 4}"
            }
          }
        ]
      },
      "finish_reason": "tool_calls"
    }
  ]
}
```

You would then have to call a function called `add` with the arguments `{a: 2, b: 4}`. The function returns the sum of the two numbers, which is 6. This value has to be passed back to the model as part of the next message, together with the tool call identifier. The `message` object should look something like this:

```json
[
  {
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "What is 2 plus 4?"
      }
    ]
  },
  {
    "role": "assistant",
    "tool_calls": [
      {
        "id": "chatcmpl-tool-77cbe4e94d88489383a0c6ed1b644674",
        "type": "function",
        "function": {
          "name": "add",
          "arguments": "{\"a\": 2, \"b\": 4}"
        }
      }
    ]
  },
  {
    "role": "tool",
    "tool_call_id": "chatcmpl-tool-77cbe4e94d88489383a0c6ed1b644674",
    "content": [
      {
        "type": "text",
        "text": "6"
      }
    ]
  }
]
```

The model will respond with a natural language answer that includes the response of the tool call.