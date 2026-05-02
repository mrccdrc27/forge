---
name: wiki-organizer
description: Use when managing a markdown-based personal knowledge base, including ingesting new sources, answering queries with synthesis, or linting wiki health.
---

# Wiki Organizer

## Overview
The Wiki Organizer maintains an "LLM Wiki"—a persistent, compounding knowledge base where new information is integrated into a structured web of interlinked markdown files.

## When to Use
- **Ingest**: You have a new file in `raw/` that needs to be processed.
- **Query**: You need an answer synthesized from multiple wiki pages.
- **Lint**: The wiki has grown and needs a consistency/health check.

## Core Workflows

### 1. Ingest
Process a new source from `raw/` to update the wiki.
1. **Read**: Analyze the source document.
2. **Synthesize**: Identify key entities, concepts, and takeaways.
3. **Integrate**:
   - Create a summary page for the source in `wiki/`.
   - Update existing entity/concept pages in `wiki/` with new info.
   - Create new pages for missing entities/concepts.
4. **Register**:
   - Update `meta/index.md` with the new source and pages.
   - Append an entry to `meta/log.md` (e.g., `## [YYYY-MM-DD] ingest | Title`).

### 2. Query
Synthesize answers from the existing wiki.
1. **Search**: Consult `meta/index.md` to identify relevant wiki pages.
2. **Read**: Review identified pages.
3. **Synthesize**: Generate a comprehensive answer with `[[wikilinks]]` to citations.
4. **Persistence**: If the answer is complex/valuable, save it as a new page in `wiki/` and update the index/log.

### 3. Lint
Health-check the wiki for maintenance.
- **Orphans**: Find pages with no inbound links.
- **Contradictions**: Flag conflicting claims between pages.
- **Gaps**: Identify concepts mentioned but lacking a dedicated page.
- **Stale info**: Note claims superseded by newer sources.

### 4. Suggest
Propose future improvements, systemic changes, or automated mechanisms for the wiki.
- **Identify Automation**: Note areas where scripts or tools could reduce manual maintenance (e.g., auto-ingest scripts, git hooks).
- **Log Suggestions**: Append proposed improvements to `meta/suggestions.md` for the user to review later, rather than implementing them immediately if they are out of current scope.

## Conventions
- **Wikilinks**: Use `[[Page Name]]` for all cross-references.
- **Frontmatter**: Include metadata (tags, source, date) in YAML headers.
- **Atomic Pages**: Keep concept/entity pages focused on a single topic.

## Common Mistakes
- **Summarizing in isolation**: Creating a source summary without updating existing concept pages.
- **Broken links**: Referencing a page name that doesn't exist or has changed.
- **Ignoring the log**: Forgetting to record operations, losing the audit trail.
