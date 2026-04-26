import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Maximize2, Minimize2, Settings, RefreshCw, Upload } from "lucide-react";
import { AssistantProfile } from "../types";
import { ChatWorkspace, type ChatMessage } from "./ChatWorkspace";

interface PersonalAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  assistant?: AssistantProfile;
  onOpenPersonas?: () => void;
  onUploadTrainingDocs?: () => void;
  onProvideFeedback?: () => void;
}

interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
}

const defaultAssistant: AssistantProfile = {
  id: "assistant",
  name: "Your Assistant",
  role: "Assistant",
  avatarColor: "#6366f1",
};

export function PersonalAssistant({
  isOpen,
  onClose,
  assistant = defaultAssistant,
  onOpenPersonas,
  onUploadTrainingDocs,
  onProvideFeedback,
}: PersonalAssistantProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState("main");
  const [showSettings, setShowSettings] = useState(false);

  const conversations: Conversation[] = [
    { id: "main", name: "Main conversation", lastMessage: "How can I help?", timestamp: new Date() },
    { id: "sprint-planning", name: "Sprint planning help", lastMessage: "Let me help with that", timestamp: new Date("2026-04-08T09:00:00") },
    { id: "meeting-notes", name: "Meeting notes assistance", lastMessage: "I've summarized the key points", timestamp: new Date("2026-04-07T14:30:00") },
  ];

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your personal assistant. I can help you schedule meetings, take notes, or assist with daily tasks. How can I help?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const handleSendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "I understand. Let me help you with that.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  const workspaceMessages: ChatMessage[] = messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    timestamp: message.timestamp,
  }));

  if (!isOpen) return null;

  const Component = isFullscreen ? "div" : motion.div;
  const containerClass = isFullscreen
    ? "fixed inset-0 bg-background z-50 flex flex-col"
    : "fixed bottom-4 left-20 w-96 h-[500px] bg-background border border-border rounded-lg shadow-2xl z-50 flex flex-col";

  return (
    <AnimatePresence>
      <Component
        {...(!isFullscreen && {
          initial: { opacity: 0, y: 20, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 20, scale: 0.95 },
        })}
        className={containerClass}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer"
              style={{ backgroundColor: assistant.avatarColor }}
            >
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <button
                type="button"
                onClick={onOpenPersonas}
                className="text-sm hover:underline cursor-pointer"
              >
                {assistant.name}
              </button>
              <div className="text-xs text-muted-foreground">{assistant.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowConversations(!showConversations)}
              className="w-8 h-8 rounded hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              title="Switch conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-8 h-8 rounded hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              title="Settings & Training"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 rounded hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conversation Switcher */}
        {showConversations && (
          <div className="border-b border-border bg-muted/50">
            <div className="px-4 py-2 text-xs text-muted-foreground">Switch conversation</div>
            <div className="max-h-48 overflow-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setShowConversations(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-accent transition-colors border-l-2 ${
                    activeConversationId === conv.id
                      ? "border-primary bg-accent/50"
                      : "border-transparent"
                  }`}
                >
                  <div className="text-sm mb-0.5">{conv.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {conv.lastMessage}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowConversations(false)}
              className="w-full px-4 py-2 text-sm text-primary hover:bg-accent transition-colors border-t border-border"
            >
              + New conversation
            </button>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-b border-border bg-muted/50 p-4">
            <div className="text-xs text-muted-foreground mb-3">Assistant Settings & Training</div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onOpenPersonas?.();
                  setShowSettings(false);
                }}
                className="block w-full px-3 py-2 text-sm rounded bg-background hover:bg-accent transition-colors text-left"
              >
                Edit persona profile
              </button>
              <button
                type="button"
                onClick={onUploadTrainingDocs}
                className="w-full px-3 py-2 text-sm rounded bg-background hover:bg-accent transition-colors text-left flex items-center gap-2"
              >
                <Upload className="w-3 h-3" />
                Upload training documents
              </button>
              <button
                type="button"
                onClick={onProvideFeedback}
                className="w-full px-3 py-2 text-sm rounded bg-background hover:bg-accent transition-colors text-left"
              >
                Provide feedback
              </button>
              <div className="pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground mb-1">Next training session</div>
                <div className="text-xs">Triggered from admin panel</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0">
          <ChatWorkspace
            compact
            hideHeader
            messages={workspaceMessages}
            draft={inputValue}
            onDraftChange={setInputValue}
            onSendMessage={handleSendMessage}
            placeholder="Ask me anything..."
          />
        </div>
      </Component>
    </AnimatePresence>
  );
}
