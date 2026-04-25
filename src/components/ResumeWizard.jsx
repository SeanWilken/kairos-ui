import { useState } from "react";
import {
  ChevronRight, ChevronLeft, Check, Plus, X,
  Bot, User, Brain, Heart, Zap, Target, Users,
  Sparkles, Settings, Eye, Layers, Download,
  RotateCcw, FileText, CheckSquare, Shield
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────

export const TRAIT_OPTIONS = [
  { id:"analytical", label:"Analytical", desc:"Logic-first problem solver", Icon:Brain },
  { id:"empathetic",  label:"Empathetic",  desc:"Connects deeply with people", Icon:Heart },
  { id:"direct",      label:"Direct",      desc:"No fluff, says what they mean", Icon:Zap },
  { id:"patient",     label:"Patient",     desc:"Never rushes, takes time",      Icon:Target },
  { id:"collaborative",label:"Collaborative",desc:"Better work together",         Icon:Users },
  { id:"creative",    label:"Creative",    desc:"Finds unexpected paths",         Icon:Sparkles },
  { id:"methodical",  label:"Methodical",  desc:"Organized and systematic",       Icon:Settings },
  { id:"proactive",   label:"Proactive",   desc:"Anticipates before asked",       Icon:Eye },
  { id:"adaptive",    label:"Adaptive",    desc:"Adjusts to any context",         Icon:Layers },
];

export const COMM_OPTIONS = [
  { id:"concise",  label:"Concise",  sub:"Quick answers, get to the point",   ex:'"Run npm install to fix it."' },
  { id:"detailed", label:"Detailed", sub:"Full context with examples",         ex:'"First, check Node version, then..."' },
  { id:"balanced", label:"Balanced", sub:"Adjusts to the situation",           ex:'"Here\'s the short version — want more?"' },
];

export const SKILL_MAP = {
  Engineering:  ["React","TypeScript","Node.js","Python","Go","AWS","Docker","PostgreSQL","GraphQL","Kubernetes","Rust","C#"],
  Product:      ["Roadmapping","User Research","A/B Testing","Analytics","Figma","Growth","Copywriting","OKRs"],
  Leadership:   ["Mentoring","Code Review","Architecture","Agile","Hiring","Stakeholder Comms","Planning"],
  "AI / Data":  ["LLMs","RAG Systems","Prompt Engineering","Vector DBs","ML Pipelines","Data Science","NLP"],
};

export const TOOL_MAP = [
  { cat:"Communication", items:["Email Read","Email Write","Slack","Calendar","Meeting Scheduling"] },
  { cat:"Productivity",  items:["Tasks","Notes","Documents","File Search","Project Boards"] },
  { cat:"Knowledge",     items:["Web Search","Knowledge Base","Summarization","Research"] },
  { cat:"Development",   items:["Code Execution","Repo Access","CI/CD Hooks","Debug Tools"] },
];

export const MODEL_OPTIONS = [
  { id:"claude-sonnet-4-6", name:"Claude Sonnet 4.6", tier:"Balanced", note:"Smart & efficient for most tasks" },
  { id:"claude-opus-4-6",   name:"Claude Opus 4.6",   tier:"Powerful", note:"Max capability, complex reasoning" },
  { id:"claude-haiku-4-5",  name:"Claude Haiku 4.5",  tier:"Fast",     note:"High-volume, quick responses" },
];

const PERSONA_EMOJIS = ["🤖","🧠","⚡","🎯","🦉","🔬","🚀","💡","🎨","🛡️","📊","🌐"];
const INDUSTRIES = ["Software Engineering","Healthcare","Finance","Design","Marketing","Data Science","Product","Operations","Legal","Research"];
const ROLES = ["Assistant","Developer","Analyst","Advisor","Coach","Researcher","Lead","Architect","Specialist"];
const TONES = ["Professional","Friendly","Casual","Formal","Encouraging","Neutral"];

const INIT_VALUES = {
  name:"", emoji:"🤖", role:"", industry:"", headline:"",
  traits:[], commStyle:"", tone:"Professional", initiative:"Medium",
  skills:[], activeSkillTab:"Engineering", customSkill:"",
  doList:["Break down complex tasks","Provide code examples","Ask clarifying questions"],
  dontList:["Execute without explicit approval","Skip testing in recommendations"],
  guardrails:["Decline harmful or destructive requests politely"],
  tools:[], model:"",
  newDo:"", newDont:"", newGuard:"",
};

// ─── ATOMIC COMPONENTS ────────────────────────────────────────────

/** Selectable trait card. Accepts selected, onClick, and a trait object from TRAIT_OPTIONS. */
export function TraitCard({ trait, selected, onClick }) {
  const { label, desc, Icon } = trait;
  return (
    <button
      onClick={onClick}
      className={`group relative text-left p-3 rounded-xl border-2 transition-all duration-150 ${
        selected
          ? "bg-zinc-900 border-zinc-900"
          : "bg-white border-zinc-200 hover:border-zinc-400"
      }`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 transition-colors ${
        selected ? "bg-white/15" : "bg-zinc-50 group-hover:bg-zinc-100"
      }`}>
        <Icon size={14} className={selected ? "text-white" : "text-zinc-600"} />
      </div>
      <p className={`text-xs font-semibold mb-0.5 ${selected ? "text-white" : "text-zinc-900"}`}>{label}</p>
      <p className={`text-xs leading-tight ${selected ? "text-white/65" : "text-zinc-500"}`}>{desc}</p>
      {selected && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <Check size={9} className="text-zinc-900" />
        </div>
      )}
    </button>
  );
}

/** Communication style selector card. */
export function CommunicationCard({ opt, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border-2 transition-all duration-150 ${
        selected ? "bg-zinc-900 border-zinc-900" : "bg-white border-zinc-200 hover:border-zinc-400"
      }`}
    >
      <p className={`text-sm font-semibold mb-1 ${selected ? "text-white" : "text-zinc-900"}`}>{opt.label}</p>
      <p className={`text-xs mb-3 leading-relaxed ${selected ? "text-white/65" : "text-zinc-500"}`}>{opt.sub}</p>
      <p className={`text-xs font-mono italic ${selected ? "text-indigo-300" : "text-indigo-600"}`}>{opt.ex}</p>
    </button>
  );
}

/** Pill-style skill tag with selected state. */
export function SkillTag({ skill, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
        selected
          ? "bg-zinc-900 text-white border-zinc-900"
          : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900"
      }`}
    >
      {skill}
    </button>
  );
}

/** A single do/don't/guardrail item with remove button. type: 'do' | 'dont' | 'guard' */
export function GuidelineItem({ text, type, onRemove }) {
  const styles = {
    do:    { wrap:"bg-emerald-50", num:"bg-emerald-200 text-emerald-800", text:"text-emerald-800", icon:"text-emerald-700" },
    dont:  { wrap:"bg-red-50",     num:"bg-red-200 text-red-800",         text:"text-red-800",     icon:"text-red-700" },
    guard: { wrap:"bg-amber-50",   num:"bg-amber-200 text-amber-800",     text:"text-amber-800",   icon:"text-amber-700" },
  }[type] ?? {};
  const symbol = type === "do" ? "✓" : type === "dont" ? "✗" : "!";
  return (
    <div className={`flex items-start gap-2 p-2.5 rounded-lg ${styles.wrap}`}>
      <div className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold ${styles.num}`}>
        {symbol}
      </div>
      <span className={`text-xs flex-1 leading-relaxed ${styles.text}`}>{text}</span>
      <button onClick={onRemove} className={`opacity-40 hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5 ${styles.icon}`}>
        <X size={12} />
      </button>
    </div>
  );
}

/** Tool capability toggle chip. */
export function ToolToggle({ tool, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
        selected
          ? "bg-indigo-50 border-indigo-300 text-indigo-800"
          : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
      }`}
    >
      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
        selected ? "bg-indigo-600 border-indigo-600" : "border-zinc-300"
      }`}>
        {selected && <Check size={8} className="text-white" />}
      </div>
      {tool}
    </button>
  );
}

/** Model selector card with tier badge. */
export function ModelCard({ model, selected, onClick }) {
  const tierColors = {
    Balanced: "bg-blue-50 text-blue-700 border-blue-200",
    Powerful: "bg-purple-50 text-purple-700 border-purple-200",
    Fast:     "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border-2 transition-all ${
        selected ? "bg-zinc-900 border-zinc-900" : "bg-white border-zinc-200 hover:border-zinc-400"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className={`text-sm font-semibold ${selected ? "text-white" : "text-zinc-900"}`}>{model.name}</p>
        <span className={`text-xs font-medium px-2 py-0.5 rounded border flex-shrink-0 ${
          selected ? "bg-white/10 text-white/75 border-white/20" : tierColors[model.tier]
        }`}>
          {model.tier}
        </span>
      </div>
      <p className={`text-xs ${selected ? "text-white/60" : "text-zinc-500"}`}>{model.note}</p>
      {selected && (
        <div className="mt-2 flex items-center gap-1 text-xs text-indigo-300 font-medium">
          <Check size={10} /> Selected
        </div>
      )}
    </button>
  );
}

/** Step progress indicator with clickable past steps. */
export function StepProgress({ steps, current, onJump }) {
  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-0.5">
          <button
            onClick={() => i < current && onJump(i)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              i === current ? "bg-zinc-900 text-white" :
              i < current  ? "text-zinc-600 hover:bg-zinc-100 cursor-pointer" :
                             "text-zinc-400 cursor-default"
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              i === current ? "bg-white/20 text-white" :
              i < current  ? "bg-indigo-100 text-indigo-700" :
                             "bg-zinc-100 text-zinc-400"
            }`}>
              {i < current ? <Check size={10} /> : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </button>
          {i < steps.length - 1 && (
            <div className={`w-3 h-px flex-shrink-0 ${i < current ? "bg-indigo-300" : "bg-zinc-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── STEP CONTENT COMPONENTS ─────────────────────────────────────

function StepIdentity({ v, upd, isPersona }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">Identity</h2>
        <p className="text-sm text-zinc-500">
          Give {isPersona ? "your persona" : "this profile"} a name, role, and defining headline.
        </p>
      </div>

      {isPersona && (
        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-2">Avatar</label>
          <div className="flex flex-wrap gap-2">
            {PERSONA_EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => upd("emoji", e)}
                className={`w-9 h-9 text-base rounded-lg flex items-center justify-center border-2 transition-all ${
                  v.emoji === e ? "border-zinc-900 bg-zinc-900" : "border-zinc-200 bg-white hover:border-zinc-400"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">
            {isPersona ? "Persona name" : "Full name"}
            <span className="text-red-400 ml-0.5">*</span>
          </label>
          <input
            value={v.name}
            onChange={e => upd("name", e.target.value)}
            placeholder={isPersona ? "e.g. Kai" : "e.g. Alex Chen"}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">Role</label>
          <select
            value={v.role}
            onChange={e => upd("role", e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
          >
            <option value="">Select role…</option>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-2">Industry / Domain</label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map(ind => (
            <button
              key={ind}
              onClick={() => upd("industry", ind)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all ${
                v.industry === ind
                  ? "bg-zinc-900 border-zinc-900 text-white"
                  : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-1.5">Headline</label>
        <input
          value={v.headline}
          onChange={e => upd("headline", e.target.value)}
          placeholder={
            isPersona
              ? "e.g. Your thoughtful software development companion"
              : "e.g. Senior full-stack engineer building scalable systems"
          }
          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
        />
        <p className="text-xs text-zinc-400 mt-1">
          Appears at the top of the exported resume and in chat introductions.
        </p>
      </div>
    </div>
  );
}

function StepPersonality({ v, upd }) {
  const toggle = id => {
    const arr = v.traits;
    upd("traits", arr.includes(id) ? arr.filter(x => x !== id) : arr.length < 5 ? [...arr, id] : arr);
  };
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">Personality</h2>
        <p className="text-sm text-zinc-500">Select 2–5 traits that define how this entity carries itself.</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-400">{v.traits.length} / 5 selected</p>
        {v.traits.length > 0 && (
          <button onClick={() => upd("traits", [])} className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
            Clear all
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {TRAIT_OPTIONS.map(t => (
          <TraitCard key={t.id} trait={t} selected={v.traits.includes(t.id)} onClick={() => toggle(t.id)} />
        ))}
      </div>
    </div>
  );
}

function StepCommunication({ v, upd }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">Communication</h2>
        <p className="text-sm text-zinc-500">Define how this entity communicates and calibrates responses.</p>
      </div>
      <div>
        <p className="text-xs font-medium text-zinc-600 mb-3">Response style</p>
        <div className="grid grid-cols-3 gap-3">
          {COMM_OPTIONS.map(o => (
            <CommunicationCard key={o.id} opt={o} selected={v.commStyle === o.id} onClick={() => upd("commStyle", o.id)} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-medium text-zinc-600 mb-2">Tone</p>
          <div className="space-y-1.5">
            {TONES.map(t => (
              <button
                key={t}
                onClick={() => upd("tone", t)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  v.tone === t
                    ? "bg-zinc-900 border-zinc-900 text-white"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-zinc-600 mb-2">Initiative</p>
          {[
            ["High",   "Acts proactively, leads conversations"],
            ["Medium", "Balanced, responds when appropriate"],
            ["Low",    "Reserved, waits for direction"],
          ].map(([lvl, sub]) => (
            <button
              key={lvl}
              onClick={() => upd("initiative", lvl)}
              className={`w-full text-left px-3 py-2.5 rounded-lg border mb-1.5 transition-all ${
                v.initiative === lvl
                  ? "bg-zinc-900 border-zinc-900 text-white"
                  : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              <span className={`text-xs font-semibold ${v.initiative === lvl ? "text-white" : "text-zinc-900"}`}>{lvl}</span>
              <span className={`text-xs ml-1.5 ${v.initiative === lvl ? "text-white/55" : "text-zinc-400"}`}>— {sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepSkills({ v, upd }) {
  const addCustom = () => {
    const s = v.customSkill.trim();
    if (s && !v.skills.includes(s)) {
      upd("skills", [...v.skills, s]);
      upd("customSkill", "");
    }
  };
  const toggle = skill => {
    const arr = v.skills;
    upd("skills", arr.includes(skill) ? arr.filter(s => s !== skill) : [...arr, skill]);
  };
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">Skills & Expertise</h2>
        <p className="text-sm text-zinc-500">
          Select relevant skills.{" "}
          {v.skills.length > 0 && (
            <span className="text-indigo-600 font-medium">{v.skills.length} selected.</span>
          )}
        </p>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {Object.keys(SKILL_MAP).map(cat => (
          <button
            key={cat}
            onClick={() => upd("activeSkillTab", cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              v.activeSkillTab === cat ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="min-h-24 p-4 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-wrap gap-2">
        {(SKILL_MAP[v.activeSkillTab] || []).map(skill => (
          <SkillTag key={skill} skill={skill} selected={v.skills.includes(skill)} onClick={() => toggle(skill)} />
        ))}
      </div>
      {v.skills.length > 0 && (
        <div>
          <p className="text-xs font-medium text-zinc-600 mb-2">Selected</p>
          <div className="flex flex-wrap gap-1.5">
            {v.skills.map(skill => (
              <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-900 text-white text-xs font-medium rounded-md">
                {skill}
                <button onClick={() => upd("skills", v.skills.filter(s => s !== skill))} className="opacity-50 hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={v.customSkill}
          onChange={e => upd("customSkill", e.target.value)}
          onKeyDown={e => e.key === "Enter" && addCustom()}
          placeholder="Add a custom skill…"
          className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
        />
        <button
          onClick={addCustom}
          className="px-3 py-2 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 flex items-center gap-1"
        >
          <Plus size={12} /> Add
        </button>
      </div>
    </div>
  );
}

function StepGuidelines({ v, upd }) {
  const addItem = (listKey, newKey) => {
    if (v[newKey].trim()) {
      upd(listKey, [...v[listKey], v[newKey].trim()]);
      upd(newKey, "");
    }
  };
  const removeItem = (listKey, idx) => upd(listKey, v[listKey].filter((_, i) => i !== idx));

  const cols = [
    { label: "Do's",       key:"doList",    newKey:"newDo",    type:"do",    ph:"e.g. Ask clarifying questions" },
    { label: "Don'ts",     key:"dontList",  newKey:"newDont",  type:"dont",  ph:"e.g. Execute without approval" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">Guidelines</h2>
        <p className="text-sm text-zinc-500">Define encouraged behaviors, things to avoid, and safety boundaries.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {cols.map(({ label, key, newKey, type, ph }) => (
          <div key={key}>
            <p className="text-xs font-semibold text-zinc-700 mb-2">{label}</p>
            <div className="space-y-1.5 mb-2 min-h-16">
              {v[key].map((item, i) => (
                <GuidelineItem key={i} text={item} type={type} onRemove={() => removeItem(key, i)} />
              ))}
            </div>
            <div className="flex gap-1.5">
              <input
                value={v[newKey]}
                onChange={e => upd(newKey, e.target.value)}
                onKeyDown={e => e.key === "Enter" && addItem(key, newKey)}
                placeholder={ph}
                className="flex-1 px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
              />
              <button onClick={() => addItem(key, newKey)} className="p-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800">
                <Plus size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield size={13} className="text-amber-600" />
          <p className="text-xs font-semibold text-zinc-700">Safety guardrails</p>
        </div>
        <div className="space-y-1.5 mb-2">
          {v.guardrails.map((item, i) => (
            <GuidelineItem key={i} text={item} type="guard" onRemove={() => removeItem("guardrails", i)} />
          ))}
        </div>
        <div className="flex gap-1.5">
          <input
            value={v.newGuard}
            onChange={e => upd("newGuard", e.target.value)}
            onKeyDown={e => e.key === "Enter" && addItem("guardrails", "newGuard")}
            placeholder="e.g. Never access production without explicit confirmation"
            className="flex-1 px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
          />
          <button onClick={() => addItem("guardrails", "newGuard")} className="p-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800">
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepToolsModel({ v, upd }) {
  const toggleTool = tool => {
    const arr = v.tools;
    upd("tools", arr.includes(tool) ? arr.filter(t => t !== tool) : [...arr, tool]);
  };
  const toggleGroup = items => {
    const allOn = items.every(t => v.tools.includes(t));
    upd("tools", allOn ? v.tools.filter(t => !items.includes(t)) : [...new Set([...v.tools, ...items])]);
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">Tools & Model</h2>
        <p className="text-sm text-zinc-500">Configure what this persona can do and which model powers it.</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-zinc-700 mb-3">Underlying model</p>
        <div className="grid grid-cols-3 gap-2.5">
          {MODEL_OPTIONS.map(m => (
            <ModelCard key={m.id} model={m} selected={v.model === m.id} onClick={() => upd("model", m.id)} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-zinc-700 mb-3">
          Tool access
          <span className="font-normal text-zinc-400 ml-2">{v.tools.length} enabled</span>
        </p>
        <div className="space-y-3">
          {TOOL_MAP.map(({ cat, items }) => {
            const allOn = items.every(t => v.tools.includes(t));
            return (
              <div key={cat} className="border border-zinc-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 border-b border-zinc-200">
                  <span className="text-xs font-semibold text-zinc-700">{cat}</span>
                  <button
                    onClick={() => toggleGroup(items)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {allOn ? "Clear all" : "Select all"}
                  </button>
                </div>
                <div className="p-2.5 flex flex-wrap gap-2">
                  {items.map(tool => (
                    <ToolToggle key={tool} tool={tool} selected={v.tools.includes(tool)} onClick={() => toggleTool(tool)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── MINI LIVE PREVIEW PANEL ──────────────────────────────────────

/** Sidebar preview card that updates in real-time as the user fills out the wizard. */
export function MiniPreviewPanel({ v, isPersona }) {
  const hasContent = v.traits.length || v.commStyle || v.skills.length;
  const displayName = v.name || (isPersona ? "Persona" : "Profile");
  return (
    <div className="sticky top-20">
      <p className="text-xs font-medium text-zinc-500 mb-3">Live preview</p>
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
        <div className="bg-zinc-900 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
              {isPersona ? v.emoji : <User size={18} className="text-white" />}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{displayName}</p>
              <p className="text-zinc-400 text-xs truncate">
                {[v.role, v.industry].filter(Boolean).join(" · ") || "Role TBD"}
              </p>
            </div>
          </div>
          {v.headline && (
            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{v.headline}</p>
          )}
        </div>
        <div className="p-4 space-y-4">
          {v.traits.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Traits</p>
              <div className="flex flex-wrap gap-1">
                {v.traits.map(t => {
                  const trait = TRAIT_OPTIONS.find(x => x.id === t);
                  return trait ? (
                    <span key={t} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded border border-indigo-200">
                      {trait.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
          {(v.commStyle || v.tone) && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Communication</p>
              <div className="flex flex-wrap gap-1">
                {v.commStyle && <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded capitalize">{v.commStyle}</span>}
                {v.tone     && <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded">{v.tone} tone</span>}
                {v.initiative && <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded">{v.initiative} initiative</span>}
              </div>
            </div>
          )}
          {v.skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Skills <span className="text-indigo-600 font-bold">{v.skills.length}</span>
              </p>
              <div className="flex flex-wrap gap-1">
                {v.skills.slice(0, 10).map(s => (
                  <span key={s} className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs rounded">{s}</span>
                ))}
                {v.skills.length > 10 && <span className="text-xs text-zinc-400">+{v.skills.length - 10}</span>}
              </div>
            </div>
          )}
          {isPersona && v.model && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Model</p>
              <span className="text-sm text-zinc-700 font-medium">
                {MODEL_OPTIONS.find(m => m.id === v.model)?.name}
              </span>
            </div>
          )}
          {isPersona && v.tools.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Tools <span className="text-indigo-600 font-bold">{v.tools.length}</span>
              </p>
              <p className="text-xs text-zinc-600">
                {v.tools.slice(0, 5).join(", ")}{v.tools.length > 5 ? ` +${v.tools.length - 5} more` : ""}
              </p>
            </div>
          )}
          {!hasContent && (
            <p className="text-xs text-zinc-400 text-center py-4 italic">Fill in the steps to see a live preview.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── RESUME VIEWS ─────────────────────────────────────────────────

/** Full stylized in-app resume card. Accepts the completed values object. */
export function StylizedResumeView({ v, isPersona }) {
  const traits = v.traits.map(id => TRAIT_OPTIONS.find(t => t.id === id)).filter(Boolean);
  const displayName = v.name || (isPersona ? "Unnamed Persona" : "Unnamed Profile");
  const modelName = MODEL_OPTIONS.find(m => m.id === v.model)?.name;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      <div style={{ height: 6, background: "linear-gradient(90deg, #4F46E5, #7C3AED)" }} />
      {/* Header */}
      <div className="p-8 border-b border-zinc-100">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
            {isPersona ? v.emoji : "👤"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none mb-2">
              {displayName.toUpperCase()}
            </h1>
            <p className="text-lg text-indigo-600 font-medium mb-1">
              {[v.role, v.industry].filter(Boolean).join(" · ") || "Role & Domain TBD"}
            </p>
            {v.headline && (
              <p className="text-sm text-zinc-500 leading-relaxed max-w-xl">{v.headline}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            {isPersona && modelName && (
              <span className="px-3 py-1 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-full">{modelName}</span>
            )}
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              isPersona ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"
            }`}>
              {isPersona ? "AI Persona" : "Human Profile"}
            </span>
          </div>
        </div>
      </div>
      {/* 3-column body */}
      <div className="grid grid-cols-3 divide-x divide-zinc-100">
        {/* Traits + Comm */}
        <div className="p-6 space-y-6">
          {traits.length > 0 && (
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Traits</p>
              <div className="space-y-2.5">
                {traits.map(t => (
                  <div key={t.id} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <t.Icon size={13} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">{t.label}</p>
                      <p className="text-xs text-zinc-400 leading-tight">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(v.commStyle || v.tone || v.initiative) && (
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Communication</p>
              <div className="space-y-2">
                {v.commStyle   && <div className="flex justify-between text-xs"><span className="text-zinc-500">Style</span><span className="font-medium text-zinc-900 capitalize">{v.commStyle}</span></div>}
                {v.tone        && <div className="flex justify-between text-xs"><span className="text-zinc-500">Tone</span><span className="font-medium text-zinc-900">{v.tone}</span></div>}
                {v.initiative  && <div className="flex justify-between text-xs"><span className="text-zinc-500">Initiative</span><span className="font-medium text-zinc-900">{v.initiative}</span></div>}
              </div>
            </div>
          )}
        </div>
        {/* Skills */}
        <div className="p-6">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Skills</p>
          {v.skills.length === 0 ? (
            <p className="text-xs text-zinc-400 italic">No skills added yet</p>
          ) : (
            <div className="space-y-2">
              {v.skills.slice(0, 14).map((skill, i) => (
                <div key={skill} className="flex items-center justify-between gap-3">
                  <span className="text-xs text-zinc-700 font-medium">{skill}</span>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {Array.from({ length: 5 }, (_, j) => (
                      <div
                        key={j}
                        className={`w-2 h-2 rounded-full ${j < Math.max(3, 5 - Math.floor(i / 4)) ? "bg-indigo-500" : "bg-zinc-200"}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {v.skills.length > 14 && (
                <p className="text-xs text-zinc-400 pt-1">+ {v.skills.length - 14} more</p>
              )}
            </div>
          )}
        </div>
        {/* Guidelines + Tools */}
        <div className="p-6 space-y-5">
          {v.doList.length > 0 && (
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Guidelines</p>
              <div className="space-y-1.5">
                {v.doList.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 text-xs font-bold mt-0.5">✓</span>
                    <span className="text-xs text-zinc-600 leading-tight">{item}</span>
                  </div>
                ))}
                {v.dontList.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-red-400 text-xs font-bold mt-0.5">✗</span>
                    <span className="text-xs text-zinc-600 leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isPersona && v.tools.length > 0 && (
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Tools <span className="text-indigo-600 font-bold normal-case">{v.tools.length}</span>
              </p>
              <div className="flex flex-wrap gap-1">
                {v.tools.slice(0, 8).map(t => (
                  <span key={t} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded border border-indigo-100">{t}</span>
                ))}
                {v.tools.length > 8 && <span className="text-xs text-zinc-400 self-center">+{v.tools.length - 8}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex gap-4 text-xs text-zinc-400">
          <span>{v.skills.length} skills</span>
          <span>{v.traits.length} traits</span>
          {isPersona && <span>{v.tools.length} tools</span>}
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-600 border border-zinc-200 bg-white rounded-lg hover:bg-zinc-50">
            <FileText size={11} /> View prompt
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            <CheckSquare size={11} /> Publish persona
          </button>
        </div>
      </div>
    </div>
  );
}

/** Clean, minimal export-ready resume view. */
export function ExportResumeView({ v, isPersona }) {
  const traits = v.traits.map(id => TRAIT_OPTIONS.find(t => t.id === id)).filter(Boolean);
  const displayName = v.name || (isPersona ? "Unnamed Persona" : "Unnamed Profile");
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      <div className="p-10">
        <div className="border-b-2 border-zinc-900 pb-6 mb-8">
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 mb-1">{displayName}</h1>
          <p className="text-xl text-zinc-500">
            {[v.role, v.industry].filter(Boolean).join(" — ") || "Professional"}
          </p>
          {v.headline && <p className="text-sm text-zinc-600 mt-2 leading-relaxed max-w-2xl">{v.headline}</p>}
        </div>
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-7">
            {traits.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Personality</h3>
                <div className="flex flex-wrap gap-2">
                  {traits.map(t => (
                    <span key={t.id} className="text-sm font-medium text-zinc-700 border border-zinc-300 px-3 py-1 rounded">{t.label}</span>
                  ))}
                </div>
              </div>
            )}
            {(v.commStyle || v.tone) && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Working Style</h3>
                <div className="space-y-1 text-sm text-zinc-700">
                  {v.commStyle  && <p><span className="text-zinc-400">Communication:</span> {v.commStyle}</p>}
                  {v.tone       && <p><span className="text-zinc-400">Tone:</span> {v.tone}</p>}
                  {v.initiative && <p><span className="text-zinc-400">Initiative:</span> {v.initiative}</p>}
                </div>
              </div>
            )}
            {v.doList.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Behaviors</h3>
                <ul className="space-y-1.5">
                  {v.doList.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-700 flex gap-2">
                      <span className="text-zinc-400">·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-7">
            {v.skills.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Skills</h3>
                <p className="text-sm text-zinc-700 leading-loose">
                  {v.skills.join("  ·  ")}
                </p>
              </div>
            )}
            {isPersona && v.tools.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Capabilities</h3>
                <p className="text-sm text-zinc-700 leading-loose">
                  {v.tools.join("  ·  ")}
                </p>
              </div>
            )}
            {v.guardrails.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Safety</h3>
                <ul className="space-y-1">
                  {v.guardrails.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-700 flex gap-2"><span className="text-zinc-400">·</span>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE TYPE SELECTOR ────────────────────────────────────────

/** Full-screen landing selector — Human Profile vs AI Persona. */
export function ProfileTypeSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 text-white text-xs font-medium rounded-full mb-4">
          Studio · Builder
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">What are you building?</h1>
        <p className="text-zinc-500 mt-2 text-sm">Both produce a portable profile — one for humans, one for AI agents.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
        {[
          {
            type: "persona",
            label: "AI Persona",
            sub: "Design an AI agent's personality, skills, and system behaviors",
            Icon: Bot,
            bullets: ["Personality & communication traits","System prompt generation","Model selection","Tool capabilities & guardrails"],
          },
          {
            type: "human",
            label: "Human Profile",
            sub: "Capture a person's strengths, skills, and preferred working style",
            Icon: User,
            bullets: ["Skills & domain expertise","Work preferences & habits","Strengths & growth areas","Communication & autonomy settings"],
          },
        ].map(({ type, label, sub, Icon, bullets }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="group text-left bg-white border-2 border-zinc-200 rounded-2xl p-6 hover:border-zinc-900 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-zinc-100 group-hover:bg-zinc-900 rounded-xl flex items-center justify-center mb-4 transition-colors">
              <Icon size={20} className="text-zinc-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 mb-1">{label}</h2>
            <p className="text-sm text-zinc-500 mb-4 leading-relaxed">{sub}</p>
            <ul className="space-y-1.5">
              {bullets.map(b => (
                <li key={b} className="flex items-center gap-2 text-xs text-zinc-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-zinc-400 group-hover:text-zinc-900 transition-colors">
              Get started <ChevronRight size={14} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── FULL WIZARD ──────────────────────────────────────────────────

/** Wrapper for the final preview step. */
function PreviewScreen({ v, isPersona, onBack, onReset }) {
  const [tab, setTab] = useState("stylized");
  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
            <ChevronLeft size={16} /> Back to editor
          </button>
          <span className="text-zinc-300">·</span>
          <div className="flex gap-1 bg-white border border-zinc-200 p-1 rounded-lg">
            {[["stylized","In-app view"],["export","Export preview"]].map(([id, lbl]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  tab === id ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onReset} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-600 border border-zinc-300 bg-white rounded-lg hover:bg-zinc-50">
            <RotateCcw size={12} /> Reset
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-zinc-900 rounded-lg hover:bg-zinc-800">
            <Download size={12} /> Export
          </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        {tab === "stylized"
          ? <StylizedResumeView v={v} isPersona={isPersona} />
          : <ExportResumeView v={v} isPersona={isPersona} />
        }
      </div>
    </div>
  );
}

/** Main builder wizard. Composes all step components into a multi-step flow. */
export function PersonaBuilderWizard({ onComplete } = {}) {
  const [state, set] = useState({ profileType: null, step: 0, v: { ...INIT_VALUES } });

  const upd = (k, val) => set(p => ({ ...p, v: { ...p.v, [k]: val } }));
  const setStep = n => set(p => ({ ...p, step: n }));
  const reset = () => set({ profileType: null, step: 0, v: { ...INIT_VALUES } });

  const { profileType, step, v } = state;
  const isPersona = profileType === "persona";

  const STEPS = isPersona
    ? ["Identity","Personality","Communication","Skills","Guidelines","Tools & Model","Preview"]
    : ["Identity","Personality","Communication","Skills","Guidelines","Preview"];

  const isFinalPreview = step === STEPS.length - 1;

  if (!profileType) {
    return <ProfileTypeSelector onSelect={type => set({ profileType: type, step: 0, v: { ...INIT_VALUES } })} />;
  }

  if (isFinalPreview) {
    return (
      <PreviewScreen
        v={v}
        isPersona={isPersona}
        onBack={() => setStep(step - 1)}
        onReset={reset}
      />
    );
  }

  const stepComponents = isPersona
    ? [
        <StepIdentity key="id" v={v} upd={upd} isPersona={isPersona} />,
        <StepPersonality key="per" v={v} upd={upd} />,
        <StepCommunication key="com" v={v} upd={upd} />,
        <StepSkills key="sk" v={v} upd={upd} />,
        <StepGuidelines key="gl" v={v} upd={upd} />,
        <StepToolsModel key="tm" v={v} upd={upd} />,
      ]
    : [
        <StepIdentity key="id" v={v} upd={upd} isPersona={false} />,
        <StepPersonality key="per" v={v} upd={upd} />,
        <StepCommunication key="com" v={v} upd={upd} />,
        <StepSkills key="sk" v={v} upd={upd} />,
        <StepGuidelines key="gl" v={v} upd={upd} />,
      ];

  const isLastBeforePreview = step === stepComponents.length - 1;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-zinc-900 rounded flex items-center justify-center">
              {isPersona ? <Bot size={13} className="text-white" /> : <User size={13} className="text-white" />}
            </div>
            <span className="text-sm font-semibold text-zinc-900">
              {isPersona ? "Persona builder" : "Profile builder"}
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-sm text-zinc-500">{STEPS[step]}</span>
          </div>
          <button onClick={reset} className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
            Start over
          </button>
        </div>
        <div className="max-w-5xl mx-auto px-6 pb-2.5 overflow-x-auto">
          <StepProgress
            steps={STEPS}
            current={step}
            onJump={n => n < step && setStep(n)}
          />
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid gap-6" style={{ gridTemplateColumns: "3fr 2fr" }}>
          <div>{stepComponents[step]}</div>
          <div>
            <MiniPreviewPanel v={v} isPersona={isPersona} />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-zinc-200">
          <button
            onClick={() => step === 0 ? reset() : setStep(step - 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 border border-zinc-200 bg-white rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <ChevronLeft size={15} />
            {step === 0 ? "Change type" : "Back"}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Step {step + 1} of {STEPS.length}</span>
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {isLastBeforePreview ? "Preview resume" : "Continue"}
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DEFAULT EXPORT (demo entry point) ───────────────────────────

export default function App() {
  return <PersonaBuilderWizard />;
}