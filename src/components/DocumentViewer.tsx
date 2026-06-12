import type { DocumentDescriptor } from "../types";
import { DelimitedTextViewer, type DelimitedTextViewerProps } from "./DelimitedTextViewer";
import { MarkdownViewer, type MarkdownViewerProps } from "./MarkdownViewer";
import { PdfViewer, type PdfViewerProps } from "./PdfViewer";
import { SpreadsheetViewer, type SpreadsheetViewerProps } from "./SpreadsheetViewer";

type DocumentViewerVariantProps =
  | ({ type: "markdown" } & MarkdownViewerProps)
  | ({ type: "pdf" } & PdfViewerProps)
  | ({ type: "csv" } & Omit<DelimitedTextViewerProps, "delimiter">)
  | ({ type: "tsv" } & Omit<DelimitedTextViewerProps, "delimiter">)
  | ({ type: "spreadsheet" } & SpreadsheetViewerProps);

export type DocumentViewerProps =
  | DocumentViewerVariantProps
  | { document: DocumentDescriptor; className?: string };

export function DocumentViewer(props: DocumentViewerProps) {
  const resolved = "document" in props
    ? props.document.kind === "markdown"
      ? { type: "markdown" as const, content: props.document.content ?? "", className: props.className }
      : props.document.kind === "pdf"
        ? { type: "pdf" as const, src: props.document.url ?? "", title: props.document.title ?? props.document.name, className: props.className }
        : props.document.kind === "csv"
          ? { type: "csv" as const, content: props.document.content ?? "", title: props.document.title ?? props.document.name, className: props.className }
          : props.document.kind === "tsv"
            ? { type: "tsv" as const, content: props.document.content ?? "", title: props.document.title ?? props.document.name, className: props.className }
            : { type: "spreadsheet" as const, sheets: props.document.sheets ?? [], className: props.className }
    : props;

  switch (resolved.type) {
    case "markdown": {
      const { type: _type, ...rest } = resolved;
      return <MarkdownViewer {...rest} />;
    }
    case "pdf": {
      const { type: _type, ...rest } = resolved;
      return <PdfViewer {...rest} />;
    }
    case "csv": {
      const { type: _type, ...rest } = resolved;
      return <DelimitedTextViewer {...rest} delimiter="," />;
    }
    case "tsv": {
      const { type: _type, ...rest } = resolved;
      return <DelimitedTextViewer {...rest} delimiter={"\t" as "\t"} />;
    }
    case "spreadsheet": {
      const { type: _type, ...rest } = resolved;
      return <SpreadsheetViewer {...rest} />;
    }
    default:
      return null;
  }
}
