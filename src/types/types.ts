export type PersonaRole =
  | "PM"
  | "Senior Dev"
  | "Finance"
  | "Design Lead"
  | "QA"
  | "Security"
  | "Sales"
  | "Support"
  | "Legal"
  | "Marketing";

export type MessageRole = "user" | "persona";

export type RoomMode = "ask" | "debate" | "decide" | "plan" | "execute";

export type MessageStatus =
  | "pending"
  | "thinking"
  | "complete"
  | "awaiting_approval"
  | "blocked";

export interface Persona {
  id: string;
  name: string;
  role: PersonaRole;
  description: string;
  avatarColor: string;
  scope?: string;
  guardrails?: string[];
}

export interface Message {
  id: string;
  role: MessageRole;
  personaId?: string;
  content: string;
  timestamp: Date;
  status?: MessageStatus;
  confidence?: number;
  citations?: Citation[];
}

export interface Citation {
  id: string;
  source: string;
  text: string;
}

export interface Room {
  id: string;
  name: string;
  type: "1:1" | "council";
  mode: RoomMode;
  personaIds: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  isPinned?: boolean;
}

export interface Decision {
  id: string;
  roomId: string;
  content: string;
  alternatives: string[];
  rationale: string;
  timestamp: Date;
  participants: string[];
}

export interface ActionItem {
  id: string;
  roomId: string;
  content: string;
  assignee?: string;
  dueDate?: Date;
  status: "pending" | "in_progress" | "complete";
  timestamp: Date;
}

export interface Meeting {
  id: string;
  title: string;
  agenda: string[];
  roomId: string;
  scheduledTime: Date;
  duration: number;
  participants: string[];
  status: "upcoming" | "in_progress" | "completed";
}

export interface ReasoningStep {
  step: number;
  description: string;
  confidence: number;
  reasoning: string;
}

export interface MessageAuditData {
  messageId: string;
  personaId?: string;
  reasoning: ReasoningStep[];
  sources: string[];
  alternatives: string[];
  uncertainties?: string[];
}

export type MessageInteractionAction =
  | "align"
  | "brainstorm"
  | "reply"
  | "silence"
  | "timeout";

export type AssistantProfile = {
  id?: string;
  name: string;
  role: string;
  avatarColor: string;
};

export type ProfileKind = "human" | "persona";

export type ProfileTraitOption = {
  id: string;
  label: string;
  description?: string;
};

export type ProfileCommunicationOption = {
  id: string;
  label: string;
  description?: string;
};

export type ProfileSkillGroup = {
  id: string;
  label: string;
  skills: string[];
};

export type ProfileToolGroup = {
  id: string;
  label: string;
  tools: string[];
};

export type ProfileModelOption = {
  id: string;
  label: string;
  tier?: string;
  description?: string;
};

export type ProfileGuidelines = {
  dos: string[];
  donts: string[];
  guardrails: string[];
};

export type ProfileContact = {
  email?: string;
  location?: string;
  timezone?: string;
  links?: string[];
};

export type ProfileDraft = {
  id?: string;
  kind: ProfileKind;
  orgId?: string;
  scope?: string;
  name: string;
  role: string;
  industry: string;
  headline: string;
  summary: string;
  avatarText?: string;
  traits: string[];
  communicationStyle: string;
  tone: string;
  initiative: string;
  skills: string[];
  tools: string[];
  model: string;
  modelProfile?: string;
  systemPromptOverride?: string;
  guidelines: ProfileGuidelines;
  contact: ProfileContact;
};
