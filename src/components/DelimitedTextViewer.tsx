import * as React from "react";

import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { cn } from "./ui/utils";

export type DelimitedTextViewerProps = {
  content: string;
  delimiter?: "," | "\t" | ";";
  hasHeader?: boolean;
  title?: string;
  className?: string;
  maxRows?: number;
};

function parseDelimited(content: string, delimiter: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      row.push(cell);
      cell = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(cell);
      if (row.length > 1 || row[0] !== "") {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

export function DelimitedTextViewer({
  content,
  delimiter = ",",
  hasHeader = true,
  title,
  className,
  maxRows = 100,
}: DelimitedTextViewerProps) {
  const rows = React.useMemo(() => parseDelimited(content, delimiter), [content, delimiter]);
  const header = hasHeader ? rows[0] ?? [] : [];
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const visibleRows = dataRows.slice(0, maxRows);
  const columnCount = Math.max(header.length, ...visibleRows.map((row) => row.length), 0);

  return (
    <div className={cn("w-full min-w-0 overflow-hidden rounded-lg border border-border bg-background", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0 text-sm font-medium">{title ?? (delimiter === "\t" ? "TSV Preview" : "CSV Preview")}</div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{columnCount} cols</Badge>
          <Badge variant="secondary">{dataRows.length} rows</Badge>
        </div>
      </div>

      <Table containerClassName="max-h-[36rem] overflow-auto">
        {hasHeader && header.length > 0 ? (
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead key={`head-${index}`}>{header[index] ?? `Column ${index + 1}`}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
        ) : null}
        <TableBody>
          {visibleRows.map((row, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {Array.from({ length: columnCount }).map((_, columnIndex) => (
                <TableCell key={`cell-${rowIndex}-${columnIndex}`} className="whitespace-pre-wrap align-top">
                  {row[columnIndex] ?? ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {dataRows.length > visibleRows.length ? (
        <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
          Showing first {visibleRows.length} rows of {dataRows.length}.
        </div>
      ) : null}
    </div>
  );
}
