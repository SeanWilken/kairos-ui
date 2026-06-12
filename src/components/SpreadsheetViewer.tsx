import * as React from "react";

import type { SpreadsheetSheetDTO } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { cn } from "./ui/utils";

export type SpreadsheetViewerProps = {
  sheets: SpreadsheetSheetDTO[];
  className?: string;
  defaultSheetName?: string;
};

function renderSpreadsheetCell(value: unknown): React.ReactNode {
  if (value == null) return "";
  if (React.isValidElement(value)) return value;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

export function SpreadsheetViewer({ sheets, className, defaultSheetName }: SpreadsheetViewerProps) {
  const initialSheet = defaultSheetName ?? sheets[0]?.name ?? "sheet-1";

  return (
    <div className={cn("w-full min-w-0 overflow-hidden rounded-lg border border-border bg-background", className)}>
      <Tabs defaultValue={initialSheet} className="w-full">
        <div className="border-b border-border px-3 py-2">
          <TabsList>
            {sheets.map((sheet) => (
              <TabsTrigger key={sheet.name} value={sheet.name}>{sheet.name}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        {sheets.map((sheet) => (
          <TabsContent key={sheet.name} value={sheet.name} className="m-0">
            <Table containerClassName="max-h-[36rem] overflow-auto">
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  {sheet.columns.map((column) => (
                    <TableHead key={`${sheet.name}-${column}`}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sheet.rows.map((row, rowIndex) => (
                  <TableRow key={`${sheet.name}-row-${rowIndex}`}>
                    {sheet.columns.map((_, columnIndex) => (
                      <TableCell key={`${sheet.name}-cell-${rowIndex}-${columnIndex}`} className="whitespace-pre-wrap align-top">
                        {renderSpreadsheetCell(row[columnIndex])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
