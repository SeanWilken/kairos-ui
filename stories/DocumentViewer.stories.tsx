import type { Meta, StoryObj } from "@storybook/react";

import type { DocumentDescriptor } from "../src";
import { DelimitedTextViewer, DocumentViewer, MarkdownViewer, PdfViewer, SpreadsheetViewer } from "../src";

const markdownSample = `# Quarterly Review

This viewer supports regular markdown documents, not just chat messages.

## Highlights

- Revenue grew by **18%**
- Retention improved to ` + "`92.4%`" + `
- Follow-up actions were tracked in spreadsheets

> Keep markdown readable without forcing app teams to add typography hacks.

| Area | Status |
| --- | --- |
| Product | On Track |
| Ops | Needs Review |`;

const csvSample = `Account,Owner,Status,ARR
Acme,Jordan,Active,42000
Northwind,Riley,Pending,15000
Globex,Alex,Active,88000`;

const tsvSample = `Metric\tTarget\tActual
Error Rate\t<1%\t0.6%
Retry Success\t>95%\t97.2%`;

const sheets = [
  {
    name: "Summary",
    columns: ["Metric", "Target", "Actual"],
    rows: [
      ["Error Rate", "< 1%", "0.6%"],
      ["Retry Success", "> 95%", "97.2%"],
      ["Rollout Coverage", "20%", "20%"],
    ],
  },
  {
    name: "Owners",
    columns: ["Workstream", "Owner", "Due"],
    rows: [
      ["Validation copy", "Jordan", "2026-06-09"],
      ["Telemetry review", "Riley", "2026-06-10"],
    ],
  },
];

const descriptorSamples: DocumentDescriptor[] = [
  {
    id: "doc-md-1",
    kind: "markdown",
    name: "quarterly-review.md",
    title: "Quarterly Review",
    content: markdownSample,
    tags: ["finance", "summary", "q2"],
    metadata: { owner: "Finance Ops", sensitivity: "internal" },
  },
  {
    id: "doc-csv-1",
    kind: "csv",
    name: "accounts.csv",
    title: "Accounts CSV",
    content: csvSample,
    tags: ["sales", "accounts"],
    metadata: { importedFrom: "crm-export" },
  },
  {
    id: "doc-sheet-1",
    kind: "spreadsheet",
    name: "rollout-tracker.xlsx",
    title: "Rollout Tracker",
    sheets,
    tags: ["ops", "rollout"],
    metadata: { workbookSource: "manual upload" },
  },
];

const meta = {
  title: "Components/Document Viewer",
  component: DocumentViewer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Multi-format document viewing primitives for markdown, PDF, CSV/TSV, and spreadsheet-style data. Use the specific viewers directly or the higher-level `DocumentViewer` switcher when the file type is already known.",
      },
    },
  },
} satisfies Meta<typeof DocumentViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MarkdownDocument: Story = {
  render: () => (
    <div className="mx-auto max-w-5xl p-6">
      <MarkdownViewer content={markdownSample} />
    </div>
  ),
};

export const PdfDocument: Story = {
  render: () => (
    <div className="mx-auto max-w-6xl p-6">
      <PdfViewer title="Sample PDF" src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" />
    </div>
  ),
};

export const CsvDocument: Story = {
  render: () => (
    <div className="mx-auto max-w-6xl p-6">
      <DelimitedTextViewer title="Accounts CSV" content={csvSample} />
    </div>
  ),
};

export const SpreadsheetDocument: Story = {
  render: () => (
    <div className="mx-auto max-w-6xl p-6">
      <SpreadsheetViewer sheets={sheets} />
    </div>
  ),
};

export const UnifiedSwitcher: Story = {
  render: () => (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <DocumentViewer type="markdown" content={markdownSample} />
      <DocumentViewer type="csv" title="Rollout Metrics" content={csvSample} />
      <DocumentViewer type="tsv" title="Operational Targets" content={tsvSample} />
      <DocumentViewer type="spreadsheet" sheets={sheets} />
    </div>
  ),
};

export const DescriptorDriven: Story = {
  render: () => (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {descriptorSamples.map((document) => (
        <DocumentViewer key={document.id} document={document} />
      ))}
    </div>
  ),
};
