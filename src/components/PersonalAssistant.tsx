import { useState } from "react";
import { Upload } from "lucide-react";
import { AssistantProfile, type Message, type Persona } from "../types";
import { ChatWidget } from "./CompactAssistant";
import type { TurnCardProps } from "./TurnCard";

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

  const assistantPersona: Persona = {
    id: assistant.id ?? "assistant",
    name: assistant.name,
    role: "Support",
    description: assistant.role,
    avatarColor: assistant.avatarColor,
  };

  const posts: TurnCardProps[] = messages.map((message) => ({
    message: {
      id: message.id,
      role: message.role === "assistant" ? "persona" : "user",
      personaId: message.role === "assistant" ? assistantPersona.id : undefined,
      content: message.content,
      timestamp: message.timestamp,
    } as Message,
    persona: message.role === "assistant" ? assistantPersona : null,
  }));

  if (!isOpen) return null;

  return (
    <ChatWidget
      isOpen={isOpen}
      assistantPersona={assistantPersona}
      posts={posts}
      draft={inputValue}
      showSettingsButton
      position="bottom-left"
      isFullscreen={isFullscreen}
      onRefresh={() => setShowConversations((current) => !current)}
      onSettingsClick={() => setShowSettings((current) => !current)}
      onToggleFullscreen={() => setIsFullscreen((current) => !current)}
      onClose={onClose}
      onDraftChange={setInputValue}
      onSendMessage={handleSendMessage}
      topSlot={(
        <>
          {showConversations ? (
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
          ) : null}

          {showSettings ? (
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
          ) : null}
        </>
      )}
    />
  );
}
