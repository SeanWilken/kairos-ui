import * as React from "react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { cn } from "./ui/utils";
import { WizardTemplate } from "./ui/wizard";
import type {
  ProfileCommunicationOption,
  ProfileDraft,
  ProfileGuidelines,
  ProfileKind,
  ProfileModelOption,
  ProfileSkillGroup,
  ProfileToolGroup,
  ProfileTraitOption,
} from "../types";

export const DEFAULT_PROFILE_TRAITS: ProfileTraitOption[] = [
  { id: "analytical", label: "Analytical", description: "Logic-first decision maker" },
  { id: "empathetic", label: "Empathetic", description: "People-centered collaborator" },
  { id: "direct", label: "Direct", description: "Clear and concise communicator" },
  { id: "creative", label: "Creative", description: "Finds non-obvious paths" },
  { id: "methodical", label: "Methodical", description: "Structured and systematic" },
  { id: "adaptive", label: "Adaptive", description: "Adjusts quickly to context" },
];

export const DEFAULT_COMMUNICATION_OPTIONS: ProfileCommunicationOption[] = [
  { id: "concise", label: "Concise", description: "Short, actionable responses" },
  { id: "detailed", label: "Detailed", description: "Context-rich explanations" },
  { id: "balanced", label: "Balanced", description: "Adapts depth to audience" },
];

export const DEFAULT_SKILL_GROUPS: ProfileSkillGroup[] = [
  {
    id: "engineering",
    label: "Engineering",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "API Design", "Testing"],
  },
  {
    id: "product",
    label: "Product",
    skills: ["Roadmapping", "User Research", "Prioritization", "Analytics", "Experimentation"],
  },
  {
    id: "leadership",
    label: "Leadership",
    skills: ["Mentoring", "Hiring", "Planning", "Stakeholder Communication", "Facilitation"],
  },
  {
    id: "ai",
    label: "AI and Data",
    skills: ["LLM Ops", "Prompt Design", "RAG", "Data Modeling", "Knowledge Workflows"],
  },
];

export const DEFAULT_TOOL_GROUPS: ProfileToolGroup[] = [
  {
    id: "communication",
    label: "Communication",
    tools: ["Email", "Chat", "Calendar", "Meeting Scheduling"],
  },
  {
    id: "knowledge",
    label: "Knowledge",
    tools: ["Docs", "Search", "Summarization", "Knowledge Base"],
  },
  {
    id: "delivery",
    label: "Delivery",
    tools: ["Task Tracking", "Project Boards", "Repo Access", "CI Hooks"],
  },
];

export const DEFAULT_MODEL_OPTIONS: ProfileModelOption[] = [
  {
    id: "balanced",
    label: "Balanced Model",
    tier: "Balanced",
    description: "General-purpose quality and throughput",
  },
  {
    id: "powerful",
    label: "Power Model",
    tier: "Advanced",
    description: "Best for complex reasoning and planning",
  },
  {
    id: "fast",
    label: "Fast Model",
    tier: "Fast",
    description: "Low latency for high-volume interactions",
  },
];

type ProfileTypeSelectorProps = {
  onSelect: (kind: ProfileKind) => void;
  className?: string;
};

type ProfileBuilderWizardProps = {
  kind?: ProfileKind;
  initialProfile?: Partial<ProfileDraft>;
  allowTypeSelection?: boolean;
  traitOptions?: ProfileTraitOption[];
  communicationOptions?: ProfileCommunicationOption[];
  skillGroups?: ProfileSkillGroup[];
  toolGroups?: ProfileToolGroup[];
  modelOptions?: ProfileModelOption[];
  onChange?: (draft: ProfileDraft) => void;
  onComplete?: (draft: ProfileDraft) => void;
  onCancel?: () => void;
  className?: string;
};

type ProfileCardProps = {
  profile: ProfileDraft;
  onSelect?: (profile: ProfileDraft) => void;
  className?: string;
};

type ProfileCardGridProps = {
  profiles: ProfileDraft[];
  onSelect?: (profile: ProfileDraft) => void;
  className?: string;
};

const DEFAULT_GUIDELINES: ProfileGuidelines = {
  dos: ["Ask clarifying questions", "Explain recommendations and tradeoffs"],
  donts: ["Act without explicit approval for risky operations"],
  guardrails: ["Decline unsafe or harmful requests"],
};

function createDefaultProfileDraft(kind: ProfileKind): ProfileDraft {
  return {
    kind,
    orgId: "",
    scope: kind === "persona" ? "organization" : "individual",
    name: "",
    role: "",
    industry: "",
    headline: "",
    summary: "",
    avatarText: kind === "persona" ? "AI" : "HP",
    traits: [],
    communicationStyle: "balanced",
    tone: "Professional",
    initiative: "Medium",
    skills: [],
    tools: [],
    model: "",
    modelProfile: "",
    systemPromptOverride: "",
    guidelines: { ...DEFAULT_GUIDELINES },
    contact: {},
  };
}

function mergeDraft(kind: ProfileKind, initial?: Partial<ProfileDraft>): ProfileDraft {
  const draft = createDefaultProfileDraft(kind);
  const nextModel = initial?.model ?? initial?.modelProfile ?? draft.model;
  const nextModelProfile = initial?.modelProfile ?? initial?.model ?? draft.modelProfile;

  return {
    ...draft,
    ...initial,
    kind,
    model: nextModel,
    modelProfile: nextModelProfile,
    guidelines: {
      ...DEFAULT_GUIDELINES,
      ...(initial?.guidelines ?? {}),
      dos: initial?.guidelines?.dos ?? DEFAULT_GUIDELINES.dos,
      donts: initial?.guidelines?.donts ?? DEFAULT_GUIDELINES.donts,
      guardrails: initial?.guidelines?.guardrails ?? DEFAULT_GUIDELINES.guardrails,
    },
    contact: {
      ...(initial?.contact ?? {}),
    },
  };
}

function initials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "PR";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function ProfileTypeSelector({ onSelect, className }: ProfileTypeSelectorProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      <Card className="cursor-pointer border-2 transition-colors hover:border-primary" onClick={() => onSelect("persona")}>
        <CardHeader>
          <CardTitle>AI Persona Profile</CardTitle>
          <CardDescription>Configure model behavior, capabilities, and interaction style.</CardDescription>
        </CardHeader>
      </Card>
      <Card className="cursor-pointer border-2 transition-colors hover:border-primary" onClick={() => onSelect("human")}>
        <CardHeader>
          <CardTitle>Human Resume Profile</CardTitle>
          <CardDescription>Capture resume-style details and communication preferences.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

function ProfileCard({ profile, onSelect, className }: ProfileCardProps) {
  return (
    <Card
      className={cn("h-full border transition-colors", onSelect ? "cursor-pointer hover:border-primary" : "", className)}
      onClick={() => onSelect?.(profile)}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-muted text-foreground flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold">
              {profile.avatarText?.trim() || initials(profile.name)}
            </div>
            <div className="space-y-0.5">
              <CardTitle className="text-base">{profile.name || "Untitled profile"}</CardTitle>
              <CardDescription>{[profile.role, profile.industry].filter(Boolean).join(" • ") || "Role pending"}</CardDescription>
            </div>
          </div>
          <Badge variant={profile.kind === "persona" ? "secondary" : "outline"}>{profile.kind}</Badge>
        </div>
        {profile.headline ? <p className="text-muted-foreground text-sm">{profile.headline}</p> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
          {profile.skills.length > 4 ? <Badge variant="outline">+{profile.skills.length - 4} more</Badge> : null}
        </div>
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>{profile.traits.length} traits</span>
          <span>{profile.guidelines.guardrails.length} guardrails</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileCardGrid({ profiles, onSelect, className }: ProfileCardGridProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {profiles.map((profile, index) => (
        <ProfileCard key={profile.id ?? `${profile.kind}-${profile.name}-${index}`} profile={profile} onSelect={onSelect} />
      ))}
    </div>
  );
}

function ProfileResumeCard({ profile }: { profile: ProfileDraft }) {
  const profileModel = profile.modelProfile || profile.model;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{profile.name || "Untitled profile"}</CardTitle>
            <CardDescription>{[profile.role, profile.industry].filter(Boolean).join(" • ")}</CardDescription>
          </div>
          <Badge variant={profile.kind === "persona" ? "secondary" : "outline"}>{profile.kind}</Badge>
        </div>
        {profile.headline ? <p className="text-muted-foreground text-sm">{profile.headline}</p> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.summary ? (
          <div>
            <h4 className="text-sm font-semibold">Summary</h4>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{profile.summary}</p>
          </div>
        ) : null}
        <Separator />
        <div className="grid gap-4 md:grid-cols-2">
          {profile.kind === "persona" ? (
            <div>
              <h4 className="text-sm font-semibold">Persona scope</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile.orgId ? <Badge variant="outline">org: {profile.orgId}</Badge> : null}
                {profile.scope ? <Badge variant="outline">scope: {profile.scope}</Badge> : null}
                {profileModel ? <Badge variant="outline">model: {profileModel}</Badge> : null}
              </div>
            </div>
          ) : null}
          <div>
            <h4 className="text-sm font-semibold">Skills</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Traits and style</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.traits.map((trait) => (
                <Badge key={trait} variant="secondary">
                  {trait}
                </Badge>
              ))}
              <Badge variant="outline">{profile.tone}</Badge>
              <Badge variant="outline">{profile.initiative} initiative</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileBuilderWizard({
  kind,
  initialProfile,
  allowTypeSelection = true,
  traitOptions = DEFAULT_PROFILE_TRAITS,
  communicationOptions = DEFAULT_COMMUNICATION_OPTIONS,
  skillGroups = DEFAULT_SKILL_GROUPS,
  toolGroups = DEFAULT_TOOL_GROUPS,
  modelOptions = DEFAULT_MODEL_OPTIONS,
  onChange,
  onComplete,
  onCancel,
  className,
}: ProfileBuilderWizardProps) {
  const [selectedKind, setSelectedKind] = React.useState<ProfileKind | null>(kind ?? null);
  const [draft, setDraft] = React.useState<ProfileDraft>(
    mergeDraft(kind ?? "persona", initialProfile),
  );
  const [stepIndex, setStepIndex] = React.useState(0);
  const [activeSkillGroup, setActiveSkillGroup] = React.useState(skillGroups[0]?.id ?? "");
  const [skillInput, setSkillInput] = React.useState("");
  const [doInput, setDoInput] = React.useState("");
  const [dontInput, setDontInput] = React.useState("");
  const [guardrailInput, setGuardrailInput] = React.useState("");

  React.useEffect(() => {
    onChange?.(draft);
  }, [draft, onChange]);

  React.useEffect(() => {
    if (kind) {
      setSelectedKind(kind);
      setDraft((prev) => mergeDraft(kind, { ...prev, ...initialProfile }));
      setStepIndex(0);
    }
  }, [kind]);

  React.useEffect(() => {
    if (!initialProfile) return;
    const baseKind = kind ?? selectedKind ?? "persona";
    setDraft((prev) => mergeDraft(baseKind, { ...prev, ...initialProfile }));
  }, [initialProfile, kind, selectedKind]);

  const currentKind = selectedKind ?? kind;

  const stepDefinitions = React.useMemo(() => {
    const steps = [
      { id: "identity", label: "Identity", description: "Resume basics and contact data" },
      { id: "style", label: "Working Style", description: "Traits and communication" },
      { id: "skills", label: "Skills", description: "Capabilities and expertise" },
      { id: "guidelines", label: "Guidelines", description: "Do, do not, and safety" },
    ];

    if (currentKind === "persona") {
      steps.push({ id: "capabilities", label: "Capabilities", description: "Tools and model" });
    }

    steps.push({ id: "review", label: "Review", description: "Card-ready output" });

    return steps;
  }, [currentKind]);

  const currentStepId = stepDefinitions[stepIndex]?.id ?? stepDefinitions[0]?.id;
  const completedStepIds = stepDefinitions.slice(0, stepIndex).map((step) => step.id);
  const isLastStep = stepIndex === stepDefinitions.length - 1;

  function updateDraft<K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function updateGuidelines(partial: Partial<ProfileGuidelines>) {
    setDraft((prev) => ({
      ...prev,
      guidelines: {
        ...prev.guidelines,
        ...partial,
      },
    }));
  }

  function toggleSkill(skill: string) {
    updateDraft(
      "skills",
      draft.skills.includes(skill) ? draft.skills.filter((item) => item !== skill) : [...draft.skills, skill],
    );
  }

  function toggleTrait(traitId: string) {
    updateDraft(
      "traits",
      draft.traits.includes(traitId)
        ? draft.traits.filter((item) => item !== traitId)
        : [...draft.traits, traitId],
    );
  }

  function toggleTool(tool: string) {
    updateDraft(
      "tools",
      draft.tools.includes(tool) ? draft.tools.filter((item) => item !== tool) : [...draft.tools, tool],
    );
  }

  function canContinue(): boolean {
    if (currentStepId === "identity") {
      return draft.name.trim().length > 0 && draft.role.trim().length > 0;
    }
    return true;
  }

  function handleNext() {
    if (isLastStep) {
      onComplete?.(draft);
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, stepDefinitions.length - 1));
  }

  function handleBack() {
    if (stepIndex === 0) {
      onCancel?.();
      return;
    }
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }

  if (!currentKind && allowTypeSelection) {
    return (
      <div className={className}>
        <ProfileTypeSelector
          onSelect={(nextKind) => {
            setSelectedKind(nextKind);
            setDraft(mergeDraft(nextKind, initialProfile));
            setStepIndex(0);
          }}
        />
      </div>
    );
  }

  const activeSkillSet = skillGroups.find((group) => group.id === activeSkillGroup)?.skills ?? [];

  return (
    <div className={className}>
      <WizardTemplate
        steps={stepDefinitions}
        currentStepId={currentStepId}
        completedStepIds={completedStepIds}
        title={currentKind === "persona" ? "Persona Builder" : "Human Profile Builder"}
        description="Configuration-first profile contracts for cards, grid views, and AI interaction ledgering."
        contextValues={{
          Type: currentKind ?? "",
          Skills: String(draft.skills.length),
          Traits: String(draft.traits.length),
        }}
        canGoBack={true}
        canGoNext={canContinue()}
        nextLabel={isLastStep ? "Save profile" : "Continue"}
        backLabel={stepIndex === 0 ? "Cancel" : "Back"}
        onNext={handleNext}
        onBack={handleBack}
      >
        {currentStepId === "identity" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={draft.name}
                onChange={(event) => updateDraft("name", event.target.value)}
                placeholder={currentKind === "persona" ? "Kairos Analyst" : "Alex Rivera"}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="profile-role">Role</Label>
              <Input
                id="profile-role"
                value={draft.role}
                onChange={(event) => updateDraft("role", event.target.value)}
                placeholder={currentKind === "persona" ? "Research Advisor" : "Senior Product Manager"}
              />
            </div>
            {currentKind === "persona" ? (
              <>
                <div className="space-y-3">
                  <Label htmlFor="profile-org-id">Organization ID</Label>
                  <Input
                    id="profile-org-id"
                    value={draft.orgId ?? ""}
                    onChange={(event) => updateDraft("orgId", event.target.value)}
                    placeholder="org_123 (optional)"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="profile-scope">Scope</Label>
                  <Input
                    id="profile-scope"
                    value={draft.scope ?? ""}
                    onChange={(event) => updateDraft("scope", event.target.value)}
                    placeholder="organization | team | tenant"
                  />
                </div>
              </>
            ) : null}
            <div className="space-y-3">
              <Label htmlFor="profile-industry">Industry or domain</Label>
              <Input
                id="profile-industry"
                value={draft.industry}
                onChange={(event) => updateDraft("industry", event.target.value)}
                placeholder="Software, healthcare, legal, finance"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="profile-avatar">Avatar text</Label>
              <Input
                id="profile-avatar"
                value={draft.avatarText ?? ""}
                onChange={(event) => updateDraft("avatarText", event.target.value)}
                placeholder="AI, AR, JD"
              />
            </div>
            <div className="space-y-3 lg:col-span-2">
              <Label htmlFor="profile-headline">Headline</Label>
              <Input
                id="profile-headline"
                value={draft.headline}
                onChange={(event) => updateDraft("headline", event.target.value)}
                placeholder="Short summary displayed in cards and profile headers"
              />
            </div>
            <div className="space-y-3 lg:col-span-2">
              <Label htmlFor="profile-summary">Summary</Label>
              <Textarea
                id="profile-summary"
                value={draft.summary}
                onChange={(event) => updateDraft("summary", event.target.value)}
                placeholder="Resume-style summary that also informs AI interaction comfort and context"
                rows={5}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                value={draft.contact.email ?? ""}
                onChange={(event) => updateDraft("contact", { ...draft.contact, email: event.target.value })}
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="profile-location">Location</Label>
              <Input
                id="profile-location"
                value={draft.contact.location ?? ""}
                onChange={(event) => updateDraft("contact", { ...draft.contact, location: event.target.value })}
                placeholder="City, Country"
              />
            </div>
          </div>
        ) : null}

        {currentStepId === "style" ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Traits</h3>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {traitOptions.map((trait) => (
                  <button
                    key={trait.id}
                    type="button"
                    onClick={() => toggleTrait(trait.id)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors",
                      draft.traits.includes(trait.id)
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/50 border-border",
                    )}
                  >
                    <p className="text-sm font-semibold">{trait.label}</p>
                    {trait.description ? (
                      <p className="text-muted-foreground mt-1 text-xs">{trait.description}</p>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="profile-communication">Communication style</Label>
                <div className="grid gap-2 md:grid-cols-3">
                  {communicationOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => updateDraft("communicationStyle", option.id)}
                      className={cn(
                        "rounded-lg border p-3 text-left",
                        draft.communicationStyle === option.id ? "border-primary bg-primary/10" : "border-border",
                      )}
                    >
                      <p className="text-sm font-semibold">{option.label}</p>
                      {option.description ? (
                        <p className="text-muted-foreground mt-1 text-xs">{option.description}</p>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-tone">Tone</Label>
                <Input
                  id="profile-tone"
                  value={draft.tone}
                  onChange={(event) => updateDraft("tone", event.target.value)}
                  placeholder="Professional"
                />
                <Label htmlFor="profile-initiative">Initiative level</Label>
                <Input
                  id="profile-initiative"
                  value={draft.initiative}
                  onChange={(event) => updateDraft("initiative", event.target.value)}
                  placeholder="Medium"
                />
              </div>
            </div>
          </div>
        ) : null}

        {currentStepId === "skills" ? (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {skillGroups.map((group) => (
                <Button
                  key={group.id}
                  type="button"
                  size="sm"
                  variant={activeSkillGroup === group.id ? "default" : "outline"}
                  onClick={() => setActiveSkillGroup(group.id)}
                >
                  {group.label}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeSkillSet.map((skill) => (
                <Button
                  key={skill}
                  type="button"
                  size="sm"
                  variant={draft.skills.includes(skill) ? "default" : "outline"}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Button>
              ))}
            </div>
            <div className="grid gap-2 md:grid-cols-[1fr_auto]">
              <Input
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                placeholder="Add a custom skill"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const skill = skillInput.trim();
                  if (!skill) return;
                  if (!draft.skills.includes(skill)) {
                    updateDraft("skills", [...draft.skills, skill]);
                  }
                  setSkillInput("");
                }}
              >
                Add skill
              </Button>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-1.5">
              {draft.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    type="button"
                    aria-label={`remove ${skill}`}
                    onClick={() => updateDraft("skills", draft.skills.filter((item) => item !== skill))}
                  >
                    x
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        {currentStepId === "guidelines" ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Do</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  {draft.guidelines.dos.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-center justify-between gap-2 text-sm">
                      <span>{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateGuidelines({ dos: draft.guidelines.dos.filter((_, itemIndex) => itemIndex !== index) })
                        }
                      >
                        x
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={doInput} onChange={(event) => setDoInput(event.target.value)} placeholder="Add behavior" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const value = doInput.trim();
                      if (!value) return;
                      updateGuidelines({ dos: [...draft.guidelines.dos, value] });
                      setDoInput("");
                    }}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Do not</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  {draft.guidelines.donts.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-center justify-between gap-2 text-sm">
                      <span>{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateGuidelines({ donts: draft.guidelines.donts.filter((_, itemIndex) => itemIndex !== index) })
                        }
                      >
                        x
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={dontInput}
                    onChange={(event) => setDontInput(event.target.value)}
                    placeholder="Add restriction"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const value = dontInput.trim();
                      if (!value) return;
                      updateGuidelines({ donts: [...draft.guidelines.donts, value] });
                      setDontInput("");
                    }}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Guardrails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  {draft.guidelines.guardrails.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-center justify-between gap-2 text-sm">
                      <span>{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateGuidelines({
                            guardrails: draft.guidelines.guardrails.filter((_, itemIndex) => itemIndex !== index),
                          })
                        }
                      >
                        x
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={guardrailInput}
                    onChange={(event) => setGuardrailInput(event.target.value)}
                    placeholder="Add safety guardrail"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const value = guardrailInput.trim();
                      if (!value) return;
                      updateGuidelines({ guardrails: [...draft.guidelines.guardrails, value] });
                      setGuardrailInput("");
                    }}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {currentStepId === "capabilities" ? (
          <div className="space-y-5">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Model</h3>
              <div className="grid gap-3 md:grid-cols-3">
                {modelOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      updateDraft("model", option.id);
                      updateDraft("modelProfile", option.id);
                    }}
                    className={cn(
                      "rounded-lg border p-3 text-left",
                      (draft.modelProfile || draft.model) === option.id ? "border-primary bg-primary/10" : "border-border",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{option.label}</p>
                      {option.tier ? <Badge variant="outline">{option.tier}</Badge> : null}
                    </div>
                    {option.description ? (
                      <p className="text-muted-foreground mt-1 text-xs">{option.description}</p>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="profile-system-prompt-override">System prompt override</Label>
              <Textarea
                id="profile-system-prompt-override"
                value={draft.systemPromptOverride ?? ""}
                onChange={(event) => updateDraft("systemPromptOverride", event.target.value)}
                placeholder="Optional app-layer override for generated system prompt"
                rows={4}
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Tool access</h3>
              {toolGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{group.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2 md:grid-cols-2">
                    {group.tools.map((tool) => (
                      <label key={tool} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={draft.tools.includes(tool)} onCheckedChange={() => toggleTool(tool)} />
                        <span>{tool}</span>
                      </label>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}

        {currentStepId === "review" ? <ProfileResumeCard profile={draft} /> : null}
      </WizardTemplate>
    </div>
  );
}

export {
  ProfileBuilderWizard,
  ProfileCard,
  ProfileCardGrid,
  ProfileResumeCard,
  ProfileTypeSelector,
  createDefaultProfileDraft,
};
export type { ProfileBuilderWizardProps, ProfileCardGridProps, ProfileCardProps, ProfileTypeSelectorProps };
