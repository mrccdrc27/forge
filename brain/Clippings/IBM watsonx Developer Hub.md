---
title: "IBM watsonx Developer Hub"
source: "https://www.ibm.com/watsonx/developer/capabilities/text-extraction/"
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

Use the extraction method of the REST API to convert files that are highly structured and use diagrams, images, and tables to convey information, into an AI-model-friendly JSON file format. [Extracting text from documents](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-text-extraction.html?context=wx&audience=wdp) works by applying natural language understanding technology that is developed by IBM to identify document structures.

Supported file types for this API request are detailed [in this list](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-text-extraction.html?context=wx&audience=wdp#supported-input-file-types).

### Extract text

The following command submits a request to extract text from a file called `document.pdf`.

#### Example

```
curl --request POST 'https://{cluster_url}/ml/v1/text/extractions?version=2023-10-25'
-H 'Authorization: Bearer eyJhbGciOiJSUzUxM...'
-H 'Content-Type: application/json'
-H 'Accept: application/json'
-d '{
  "project_id": "12ac4cf1-252f-424b-b52d-5cdd9814987f"
  "document_reference": {
    "type": "connection_asset",
    "connection": {
      "id": "6f5688fd-f3bf-42c2-a18b-49c0d8a1920d"
    },
    "location": {
      "file_name": "files/document.pdf"
    }
  },
  "results_reference": {
    "type": "connection_asset",
    "connection": {
      "id": "6f5688fd-f3bf-42c2-a18b-49c0d8a1920d"
    },
    "location": {
      "file_name": "results"
    }
  },
  "steps": {
    "tables_processing": {
      "enabled": true
    }
  }
}'
```

#### Response

The response is a created resource and details for the text extraction.

```json
{
  "metadata": {
    "id": "6213cf1-252f-424b-b52d-5cdd9814956c",
    "created_at": "2023-05-02T16:27:51Z",
    "project_id": "12ac4cf1-252f-424b-b52d-5cdd9814987f",
    "name": "extract"
  },
  "entity": {
    "document_reference": {
      "type": "connection_asset",
      "connection": {
        "id": "6f5688fd-f3bf-42c2-a18b-49c0d8a1920d"
      },
      "location": {
        "file_name": "files/document.pdf"
      }
    },
    "results_reference": {
      "type": "connection_asset",
      "connection": {
        "id": "2a7c11bc-2913-48d0-9581-a8d9f40fa159"
      },
      "location": {
        "file_name": "results"
      }
    },
    "steps": {
      "tables_processing": {
        "enabled": true
      }
    },
    "results": {
      "status": "submitted",
      "number_pages_processed": 0
    }
  }
}
```

For more information about some of the structures recognized by the API, see [Extracting text from documents](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-text-extraction.html?context=wx&audience=wdp#example-output).

### Use the extracted text

Take the extracted text from the generated JSON file and store it as plain text. For example, take the extracted text from the generated JSON file and store it in a plain text file named `parsed_output_text.txt`.

#### Example

```sh
cat output_report | jq '[.all_structures.tokens[].text] | join(" ")' > parsed_output_text.txt
```

Or return the number of pages in the original PDF file.

#### Example

```sh
cat output_report.json | jq '.metadata.num_pages'
```

## Next steps

For additional information about the extraction API, see the following links: