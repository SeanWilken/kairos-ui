import * as React from "react";
import { X, Plus } from "lucide-react";
import { type KnowledgeTag } from "../types/knowledge";
import { cn } from "./ui/utils";

export type TagEditorProps = {
  tags: KnowledgeTag[];
  onAddTag?: (label: string) => void;
  onRemoveTag?: (tagId: string) => void;
  readOnly?: boolean;
  className?: string;
  placeholder?: string;
};

export function TagEditor({
  tags,
  onAddTag,
  onRemoveTag,
  readOnly = false,
  className,
  placeholder = "Add tag…",
}: TagEditorProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commit = () => {
    const trimmed = inputValue.trim();
    if (trimmed) onAddTag?.(trimmed);
    setInputValue("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { setInputValue(""); setIsAdding(false); }
  };

  React.useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  return (
    <div className={cn("flex flex-wrap gap-1 items-center", className)}>
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground border border-border"
          style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
        >
          {tag.label}
          {!readOnly && onRemoveTag && (
            <button
              type="button"
              onClick={() => onRemoveTag(tag.id)}
              className="hover:text-foreground transition-colors"
              aria-label={`Remove ${tag.label}`}
            >
              <X size={10} />
            </button>
          )}
        </span>
      ))}

      {!readOnly && onAddTag && (
        isAdding ? (
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            placeholder={placeholder}
            className="h-5 w-24 px-1.5 text-xs rounded border border-border bg-background outline-none focus:ring-1 focus:ring-primary"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs text-muted-foreground hover:bg-muted border border-dashed border-border transition-colors"
          >
            <Plus size={10} />
            Tag
          </button>
        )
      )}
    </div>
  );
}
