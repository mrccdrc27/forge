---
title: "Tokens and tokenization — Docs"
source: "https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-tokens.html?context=wx"
author:
published:
created: 2026-05-02
description: "A token is a collection of characters that has semantic meaning for a model. Tokenization is the process of converting the words in your prompt into tokens."
tags:
  - "clippings"
---
Tokens and tokenization

A *token* is a collection of characters that has semantic meaning for a model. Tokenization is the process of converting the words in your prompt into tokens.

You can monitor foundation model token usage in a project on the **Environments** page on the **Resource usage** tab.

## Converting words to tokens and back again

Prompt text is converted to tokens before the prompt is processed by foundation models.

The correlation between words and tokens is complex:

- Sometimes a single word is broken into multiple tokens
- The same word might be broken into a different number of tokens, depending on context (such as: where the word appears, or surrounding words)
- Spaces, newline characters, and punctuation are sometimes included in tokens and sometimes not
- The way words are broken into tokens varies from language to language
- The way words are broken into tokens varies from model to model

For a rough idea, a sentence that has 10 words might be 15 to 20 tokens.

The raw output from a model is also in the form of tokens. In the Prompt Lab in IBM watsonx.ai, the output tokens from the model are converted to words to be displayed in the prompt editor.

### Example

The following image shows how this sample input might be tokenized:

> Tomatoes are one of the most popular plants for vegetable gardens. Tip for success: If you select varieties that are resistant to disease and pests, growing tomatoes can be quite easy. For experienced gardeners looking for a challenge, there are endless heirloom and specialty varieties to cultivate. Tomato plants come in a range of sizes.

![Visualization of tokenization](https://dataplatform.cloud.ibm.com/docs/api/content/wsj/analyze-data/images/fm-tokenization.png?context=wx&locale=en)

Notice a few interesting points:

- Some words are broken into multiple tokens and some are not
- The word "Tomatoes" is broken into multiple tokens at the beginning, but later "tomatoes" is all one token
- Spaces are sometimes included at the beginning of a word-token and sometimes spaces are a token all by themselves
- Punctuation marks are tokens

## Token limits

Every model has an upper limit to the number of tokens in the input prompt plus the number of tokens in the generated output from the model. This limit is sometimes called *context window length*, *context window*, *context length*, or *maximum sequence length*. In the Prompt Lab, an informational message shows how many tokens are used in a prompt submission and the resulting generated output.

In the Prompt Lab, you use the *Max tokens* parameter to specify an upper limit on the number of output tokens for the model to generate. The maximum number of tokens that are allowed in the output differs by model. For more information, see the *Maximum tokens* information in [Supported foundation models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).

## Learn more

- You can use the watsonx.ai API to check how many tokens will be calculated for your prompt by a foundation model before you submit it. For more information, see [Text tokenization](https://cloud.ibm.com/apidocs/watsonx-ai#text-tokenization).
- For information about how tokens are measured for billing purposes, see [watsonx.ai Runtime plans](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/wml-plans.html?context=wx).