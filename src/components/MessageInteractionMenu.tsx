import { motion, AnimatePresence } from "motion/react";
import { Lightbulb, Users, Reply, VolumeX, Clock } from "lucide-react";
import { MessageInteractionAction } from "../types";

interface MessageInteractionMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: MessageInteractionAction, messageId: string) => void;
  messageId: string;
}

export function MessageInteractionMenu({ isOpen, position, onClose, onAction, messageId }: MessageInteractionMenuProps) {
  const actions = [
    { id: "align" as const, icon: Users, label: "Align", description: "Get others on board" },
    { id: "brainstorm" as const, icon: Lightbulb, label: "Brainstorm", description: "Group ideation" },
    { id: "reply" as const, icon: Reply, label: "Reply", description: "Start sidebar" },
    { id: "silence" as const, icon: VolumeX, label: "Silence", description: "Stop responding" },
    { id: "timeout" as const, icon: Clock, label: "Timeout", description: "Cooldown period" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              left: position.x,
              top: position.y,
            }}
            className="bg-popover border border-border rounded-lg shadow-lg p-1 z-50 min-w-[200px]"
          >
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => {
                    onAction(action.id, messageId);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-accent transition-colors text-left"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
