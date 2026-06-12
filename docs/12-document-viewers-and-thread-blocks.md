# 12 - Document Viewers and Thread Blocks

This guide is the handoff document for integrating document rendering into Council, Studio, and KnowLedger using `@myai-tech/myui`.

## Goal

Use one shared package for:

- viewing attached documents in knowledge-node and workspace flows
- rendering markdown cleanly in chat/thread surfaces
- embedding generated files or structured outputs inside assistant/persona responses
- preserving a path toward richer multi-block thread cards without forcing each app to invent its own viewer model

## What Exists Today

The package now exports these document-related primitives:

- `ChatMarkdown`
- `MarkdownViewer`
- `PdfViewer`
- `DelimitedTextViewer`
- `SpreadsheetViewer`
- `DocumentViewer`
- `NodeDetailsPane`

It also exports shared document types:

- `DocumentDescriptor`
- `DocumentKind`
- `SpreadsheetSheetDTO`

Knowledge nodes can now carry attached documents through:

- `KnowledgeNode.relatedDocuments?: DocumentDescriptor[]`

## Core Contract

All applications should normalize document-like content to `DocumentDescriptor` before rendering.

```ts
import type { DocumentDescriptor } from "@myai-tech/myui";

const document: DocumentDescriptor = {
  id: "doc_123",
  kind: "markdown",
  name: "bulk-edit-rollout.md",
  title: "Bulk Edit Rollout Plan",
  content: "# Rollout Plan\n\n- Start at 20%\n- Monitor retries",
  tags: ["rollout", "ops", "bulk-edit"],
  metadata: {
    owner: "Platform",
    sensitivity: "internal",
  },
  sourceSystem: "council",
  sourceRef: "thread:m-148",
  updatedAt: "2026-06-11T14:22:00.000Z",
};
```

## Recommended Integration Pattern

### 1. Normalize in the app layer

Do not pass raw API file payloads straight into shared UI.

Instead:

- map backend DTOs to `DocumentDescriptor`
- keep MIME, source references, tags, and metadata in the mapped object
- pass the normalized object to `DocumentViewer`

```tsx
import { DocumentViewer, type DocumentDescriptor } from "@myai-tech/myui";

export function GeneratedDocumentPane({ document }: { document: DocumentDescriptor }) {
  return <DocumentViewer document={document} />;
}
```

### 2. Use `DocumentViewer` for generic file rendering

`DocumentViewer` is the app-facing default when file type is already known.

Supported now:

- `markdown`
- `pdf`
- `csv`
- `tsv`
- `spreadsheet`

### 3. Use specific viewers only when app-level layout needs differ

Examples:

- `MarkdownViewer` inside a report page
- `PdfViewer` in a modal or side pane
- `SpreadsheetViewer` in a workspace panel with app-specific controls

## Knowledge Node / Graph Usage

Yes: the intended model is that a node can carry one or more attached documents and those documents can be viewed from the node.

Current support:

- `KnowledgeNodeMap` now shows document counts and tag badges directly on map cards
- `NodeDetailsPane` can render node metadata, document list, and document preview
- `KnowledgeNode.relatedDocuments` supports attached file descriptors

Recommended shape for a document-backed node:

```ts
import type { DocumentDescriptor, KnowledgeNode } from "@myai-tech/myui";

const docs: DocumentDescriptor[] = [
  {
    id: "prd-q2",
    kind: "markdown",
    name: "q2-prd.md",
    title: "Q2 Product Requirements",
    content: "# Q2 Requirements\n\n- Bulk edit MVP",
    tags: ["product", "requirements"],
    metadata: { owner: "Product", sensitivity: "internal" },
  },
];

const node: KnowledgeNode = {
  id: "product-req",
  type: "knowledge",
  title: "Product Requirements",
  content: "Planning docs linked to roadmap milestones.",
  position: { x: 760, y: 150 },
  relatedDocuments: docs,
  metadata: {
    sourceType: "Documents",
    accessLevel: "Internal",
    sensitivity: "Low",
    tags: ["product", "requirements"],
    documentCount: docs.length,
  },
};
```

This is a good fit for the neural-network / graph view because it lets nodes represent:

- concepts
- policies
- tools
- domains
- projects
- attached evidence/documents

without forcing documents to become separate UI-only ad hoc objects.

## Combined-Effort Thread Post Card

This is the more important near-term integration for Council.

### Current reality

`TurnCard` supports:

- plain text
- markdown via `contentFormat="markdown"`
- full custom rendering via `renderMessageContent`

That means mixed-content thread posts are possible today, but they should be rendered through `renderMessageContent`, not by overloading `message.content` into one giant string.

### Recommended short-term approach

In Council or Studio, map a message plus generated outputs to a custom renderer that uses:

- `ChatMarkdown` for prose/markdown sections
- `DocumentViewer` for generated files

Example:

```tsx
import { ChatMarkdown, DocumentViewer, TurnCard, type DocumentDescriptor } from "@myai-tech/myui";

type CouncilMessageViewModel = {
  id: string;
  markdown: string;
  generatedDocuments: DocumentDescriptor[];
};

function CouncilResponseCard({ viewModel, message, persona }: {
  viewModel: CouncilMessageViewModel;
  message: any;
  persona: any;
}) {
  return (
    <TurnCard
      message={message}
      persona={persona}
      renderMessageContent={() => (
        <div className="space-y-4">
          <ChatMarkdown content={viewModel.markdown} />

          {viewModel.generatedDocuments.map((document) => (
            <div key={document.id} className="rounded-lg border border-border p-3">
              <div className="mb-3 text-xs text-muted-foreground">
                Generated file: {document.title ?? document.name}
              </div>
              <DocumentViewer document={document} />
            </div>
          ))}
        </div>
      )}
    />
  );
}
```

This is the recommended implementation for the next phase of Council work.

### Why this is the right short-term path

- no shared package fork is required
- uses normalized document descriptors immediately
- works in thread cards, split panes, and details panels
- keeps domain mapping in the app layer
- leaves room for a cleaner first-class block model later

## Recommended Next Shared UI Evolution

The package is not fully at “multi-section parent message” yet.

The next shared abstraction should be:

### `ChatMessageGroup`

One persisted message containing multiple blocks.

### `ChatContentBlock`

Each block can be:

- markdown
- text
- document
- spreadsheet
- image
- code

### Suggested block shape

```ts
type ChatContentBlockDTO =
  | { id: string; type: "markdown"; content: string }
  | { id: string; type: "text"; content: string }
  | { id: string; type: "document"; document: DocumentDescriptor };

type ChatMessageGroupDTO = {
  id: string;
  senderId?: string;
  senderType: "user" | "assistant" | "persona";
  timestamp: string;
  status?: "pending" | "thinking" | "complete" | "blocked";
  blocks: ChatContentBlockDTO[];
};
```

That is the model we should move toward if Council wants one assistant/persona response to include:

- markdown summary
- generated CSV/TSV preview
- generated spreadsheet output
- attached PDF or exported report

without pretending those are separate unrelated messages.

## Council Handoff Recommendation

For the next implementing agent:

1. Normalize all generated file outputs to `DocumentDescriptor`.
2. Use `TurnCard.renderMessageContent` for mixed-content thread cards.
3. Render markdown sections with `ChatMarkdown`.
4. Render files with `DocumentViewer`.
5. When documents are attached to graph/node entities, store them in `relatedDocuments`.
6. Use `NodeDetailsPane` or a thin Council wrapper around it for document-backed graph exploration.
7. Do not add Council-specific DTO assumptions inside `@myai-tech/myui`.

## Studio / KnowLedger Guidance

### Studio

Use these viewers in:

- admin/report panels
- workspace panes
- persona/tool/document detail screens

### KnowLedger

Use these viewers in:

- graph node detail panes
- supporting document workspaces
- contextual evidence previews for knowledge entities

## Acceptance Criteria for App Integration

The consuming app integration is in a good place when:

- markdown, PDFs, CSV/TSV, and spreadsheet-like outputs all render through shared package viewers
- graph nodes can expose attached documents through one normalized contract
- Council thread cards can show markdown plus generated documents in one response card
- app teams do not need one-off viewer implementations per frontend
