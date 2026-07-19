import type { TeamMember } from "../../types/tasking";

export function MemberAvatar({ member, size = "sm" }: { member: TeamMember; size?: "xs" | "sm" | "md" }) {
  const cls = size === "xs" ? "w-5 h-5 text-[8px]" : size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  return (
    <div className={`${cls} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{ backgroundColor: member.color + "28", color: member.color, border: `1.5px solid ${member.color}45` }}>
      {member.initials}
    </div>
  );
}

export function TagChip({ label }: { label: string }) {
  return (
    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded text-[#6b7194] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)]">
      {label}
    </span>
  );
}

export function MiniProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}
