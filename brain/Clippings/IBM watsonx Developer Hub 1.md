---
title: "IBM watsonx Developer Hub"
source: "https://www.ibm.com/watsonx/developer/capabilities/embeddings/"
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

Use an embedding model and the embeddings API to create text embeddings that capture the meaning of sentences or passages for use in your generative AI applications. Converting text into [text embeddings](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-embed-overview.html?context=wx&audience=wdp) helps with document comparison, question-answering, and in retrieval-augmented generation (RAG) tasks, when you need to retrieve relevant content quickly.

Embedding models that are used for this API request are detailed [in this list](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-embed.html?context=wx&audience=wdp).

### Example

The following example uses the `slate-125m-english-rtrvr` to generate embeddings from three lines of text input. Replace `{token}` and `{watsonx_ai_url}` with your information.

```
curl -X POST \
-H "Authorization: Bearer {token}" \
-H "Accept: application/json" \
-d "{
  "inputs": [
    \"Youth craves thrills while adulthood cherishes wisdom.\",
    \"Youth seeks ambition while adulthood finds contentment.\",
    \"Dreams chased in youth while goals pursued in adulthood.\"
  ],
  \"model_id": \"ibm/slate-125m-english-rtrvr\",
  \"project_id": \"12ac4cf1-252f-424b-b52d-5cdd9814987f\"
}" \
"{watsonx_ai_url}/ml/v1/text/embeddings?version=2024-05-31"
```

### Response

The response is an array of embeddings for each input string, as in this sample.

```json
{
  "model_id": "ibm/slate-125m-english-rtrvr",
  "results": [
    {
      "embedding": [-0.006929283, -0.005336422, -0.024047505]
    }
  ],
  "created_at": "2024-02-21T17:32:28Z",
  "input_token_count": 10
}
```

## Next steps

For more examples and information about the embeddings API, see the following links: