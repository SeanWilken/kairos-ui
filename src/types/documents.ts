export type DocumentKind = "markdown" | "pdf" | "csv" | "tsv" | "spreadsheet";

export type SpreadsheetSheetDTO = {
  name: string;
  columns: string[];
  rows: Array<Array<unknown>>;
};

export type DocumentDescriptor = {
  id: string;
  kind: DocumentKind;
  name: string;
  title?: string;
  mimeType?: string;
  url?: string;
  content?: string;
  sheets?: SpreadsheetSheetDTO[];
  tags?: string[];
  metadata?: Record<string, unknown>;
  sourceSystem?: string;
  sourceRef?: string;
  updatedAt?: string;
};
