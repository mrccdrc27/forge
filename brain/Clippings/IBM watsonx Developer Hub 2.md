---
title: "IBM watsonx Developer Hub"
source: "https://www.ibm.com/watsonx/developer/capabilities/text-generation/"
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

Text generation is the process of automatically producing coherent and meaningful text, which can be in the form of sentences, paragraphs, or even entire documents. The goal is to create text that is not only grammatically correct but also contextually appropriate and engaging for the intended audience.

Text generation is a versatile capability with a wide range of applications in various domains. The following example applications are good areas for text generation:

- Blog posts and articles
- News articles and reports
- Social media posts
- Product descriptions and reviews
- Creative writing
- Language translation
- Text summaries
- Virtual assistant interactions
- Storytelling and narrative generation

## Example

You can generate text in IBM watsonx.ai by prompting foundation models programmatically with the API or SDKs.

The following example uses the `ibm/granite-13b-instruct-v2` foundation model, which works well with text generation. For information about the full set of supported IBM and third-party foundation models, see [Models](https://www.ibm.com/watsonx/developer/get-started/models).

Replace `{token}`, `{watsonx_ai_url}`, and `{project_id}` with your information.

```sh
curl -X POST \
-H 'Authorization: Bearer {token}' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
--data-raw '{
  "input": "How far is Paris from Bangalore?",
  "parameters": {
    "max_new_tokens": 100,
    "time_limit": 10000
  },
  "model_id": "ibm/granite-13b-instruct-v2",
  "project_id": "{project_id}"
}' \
"{watsonx_ai_url}/ml/v1/text/generation?version=2024-05-31"
```

## Streaming

You can also enable streaming when using the SDK for Node.js or Python.

```js
try {
  const textGenerationStream = watsonxAIService
    .generateTextStream(params)
    .then(async (res) => {
      console.log(res);

      for await (const line of res) {
        console.log(line);
      }
    });
} catch (err) {
  console.warn(err);
}
```

## Removing harmful content

To enable the filters with default settings applied when you use the Python library, include the following parameter in the request:

```python
response = model.generate(prompt,guardrails=True)
```

The following code example shows how to enable and configure the filters.

```python
guardrails_hap_params = {
  GenTextModerationsMetaNames.INPUT: False,
  GenTextModerationsMetaNames.THRESHOLD: 0.45
}
guardrails_pii_params = {
  GenTextModerationsMetaNames.INPUT: False,
  GenTextModerationsMetaNames.OUTPUT: True,
  GenTextModerationsMetaNames.MASK: {"remove_entity_value": True}
}

response = model.generate(prompt,
  guardrails=True,
  guardrails_hap_params=guardrails_hap_params,
  guardrails_pii_params=guardrails_pii_params)
```