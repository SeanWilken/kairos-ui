import * as React from "react";
import { RefreshCcw } from "lucide-react";

import { cn } from "./ui/utils";

export type DynamicWorkspacePaneOption = {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  groupId?: string;
};

export type DynamicWorkspacePaneProps = {
  className?: string;
  options?: DynamicWorkspacePaneOption[];
  optionMap?: Record<string, DynamicWorkspacePaneOption>;
  optionKeys?: string[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (optionId: string) => void;
  renderLoaded: (option: DynamicWorkspacePaneOption) => React.ReactNode;
  onRequestCustomLoad?: () => void;
  customLoadLabel?: string;
  showReset?: boolean;
  resetLabel?: string;
  onReset?: () => void;
};

export function DynamicWorkspacePane({
  className,
  options,
  optionMap,
  optionKeys,
  value,
  defaultValue,
  onValueChange,
  renderLoaded,
  onRequestCustomLoad,
  customLoadLabel = "Load custom content",
  showReset = true,
  resetLabel = "Change content",
  onReset,
}: DynamicWorkspacePaneProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const selectedId = value ?? internalValue;

  const resolvedOptions = React.useMemo(() => {
    if (optionMap) {
      const keys = optionKeys?.length ? optionKeys : Object.keys(optionMap);
      return keys
        .map((key) => optionMap[key])
        .filter((option): option is DynamicWorkspacePaneOption => Boolean(option));
    }
    return options ?? [];
  }, [optionKeys, optionMap, options]);

  const selectedOption = React.useMemo(
    () => resolvedOptions.find((option) => option.id === selectedId),
    [resolvedOptions, selectedId],
  );

  const setSelected = (optionId: string) => {
    if (value === undefined) {
      setInternalValue(optionId);
    }
    onValueChange?.(optionId);
  };

  const reset = () => {
    if (value === undefined) {
      setInternalValue("");
    }
    onReset?.();
  };

  if (selectedOption) {
    return (
      <div className={cn("h-full min-h-0 flex flex-col", className)}>
        {showReset ? (
          <div className="h-10 border-b border-border px-3 flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground truncate">{selectedOption.title}</span>
            <button
              type="button"
              onClick={reset}
              className="h-7 px-2 rounded-md border border-border text-xs inline-flex items-center gap-1.5 hover:bg-accent"
            >
              <RefreshCcw className="w-3 h-3" />
              {resetLabel}
            </button>
          </div>
        ) : null}
        <div className="flex-1 min-h-0 overflow-auto">{renderLoaded(selectedOption)}</div>
      </div>
    );
  }

  return (
    <div className={cn("h-full min-h-0 p-4", className)}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {resolvedOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={option.disabled}
            onClick={() => setSelected(option.id)}
            className="rounded-lg border border-border p-3 text-left hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2 mb-1">
              {option.icon}
              <h4 className="text-sm">{option.title}</h4>
            </div>
            {option.description ? <p className="text-xs text-muted-foreground">{option.description}</p> : null}
          </button>
        ))}

        <button
          type="button"
          onClick={onRequestCustomLoad}
          className="rounded-lg border border-dashed border-border p-3 text-left hover:bg-accent"
        >
          <h4 className="text-sm">{customLoadLabel}</h4>
          <p className="text-xs text-muted-foreground mt-1">Use app-defined loader behavior for arbitrary components.</p>
        </button>
      </div>
    </div>
  );
}

export const DynamicMenuSelector = DynamicWorkspacePane;
