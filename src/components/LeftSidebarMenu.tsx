import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { FileText, FileSearch, Download, FileOutput, Target, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LeftSidebarMenuItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  description?: string;
};

interface LeftSidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: string) => void;
  placement?: "app-shell" | "chat" | "workspace";
  chatOffsetLeft?: number;
  items?: LeftSidebarMenuItem[];
}

const defaultMenuItems: LeftSidebarMenuItem[] = [
  { id: "documents", icon: FileText, label: "Documents", description: "View side-by-side" },
  { id: "audit", icon: FileSearch, label: "Audit Review", description: "See reasoning" },
  { id: "export", icon: Download, label: "Export", description: "Save history" },
  { id: "summarize", icon: FileOutput, label: "Summarize", description: "Get summary" },
  { id: "create-docs", icon: FileText, label: "Create Docs", description: "Generate docs" },
  { id: "refocus", icon: Target, label: "Refocus", description: "Reshape topic" },
];

export function LeftSidebarMenu({
  isOpen,
  onClose,
  onSelectMode,
  placement = "app-shell",
  chatOffsetLeft = 256,
  items,
}: LeftSidebarMenuProps) {
  const isContainerPlacement = placement === "workspace";
  const isChatPlacement = placement === "chat";
  const menuItems = items ?? defaultMenuItems;

  const menu = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={
              isContainerPlacement
                ? "absolute inset-0 bg-black/30 backdrop-blur-[1px] z-[180]"
                : isChatPlacement
                  ? "fixed inset-0 z-[180] bg-black/35 backdrop-blur-[1px]"
                  : "fixed inset-0 bg-black/35 backdrop-blur-[1px] z-[140]"
            }
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={
              isContainerPlacement
                ? "absolute left-0 top-0 bottom-0 w-[26rem] max-w-[90vw] bg-background border-r border-border shadow-xl z-[190]"
                : isChatPlacement
                  ? "fixed top-0 bottom-0 z-[190] w-[26rem] max-w-[90vw] bg-background border-r border-border shadow-xl"
                  : "fixed left-16 top-0 bottom-0 w-[26rem] max-w-[90vw] bg-background border-r border-border shadow-xl z-[150]"
            }
            style={isChatPlacement ? { left: `${chatOffsetLeft}px` } : undefined}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <h3>Split Modes & Actions</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectMode(item.id);
                      onClose();
                    }}
                    className="w-full flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm mb-0.5">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document !== "undefined" && placement !== "workspace") {
    return createPortal(menu, document.body);
  }

  return menu;
}
