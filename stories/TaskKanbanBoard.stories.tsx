import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { TaskKanbanBoard, TaskRow, type TaskItem, type TaskStatus } from "../src";
import { MEMBERS, SPRINTS, TASKS } from "./taskingFixtures";

const meta = {
  title: "Components/Tasking/Kanban Board",
  component: TaskKanbanBoard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TaskKanbanBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Fully interactive board: drag a card to reveal the drop overlay with status
 * columns, move-to-sprint zones, and a delete zone. The story owns task state,
 * exactly like a consuming app would.
 */
export const Interactive: Story = {
  args: { tasks: TASKS, members: MEMBERS },
  render: (args) => {
    const [tasks, setTasks] = React.useState<TaskItem[]>(args.tasks);
    const [dragging, setDragging] = React.useState<string | null>(null);
    const [selected, setSelected] = React.useState<string | null>(null);

    const handleDrop = (target: TaskStatus | string) => {
      setTasks((prev) => {
        if (!dragging) return prev;
        if (target === "delete") return prev.filter((t) => t.id !== dragging);
        if (SPRINTS.some((s) => s.id === target)) {
          return prev.map((t) => (t.id === dragging ? { ...t, sprintId: target } : t));
        }
        return prev.map((t) => (t.id === dragging ? { ...t, status: target as TaskStatus } : t));
      });
      setDragging(null);
    };

    return (
      <div className="h-[100dvh] flex flex-col bg-[#0b0d14] text-[#e8e8f2]" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
        <div className="h-10 px-4 flex items-center border-b border-[rgba(255,255,255,0.07)] text-[11px] text-[#6b7194]">
          {selected ? `Selected: ${tasks.find((t) => t.id === selected)?.key}` : "Drag a card to move it — sprint and delete zones appear while dragging"}
        </div>
        <TaskKanbanBoard
          tasks={tasks.filter((t) => t.sprintId === "s1")}
          members={MEMBERS}
          draggingTaskId={dragging}
          dropSprints={SPRINTS.filter((s) => s.id !== "s1")}
          onSelectTask={setSelected}
          onDragStart={setDragging}
          onDragEnd={() => setDragging(null)}
          onDrop={handleDrop}
        />
      </div>
    );
  },
};

/** Compact TaskRow used in backlogs and sidebars, sharing the same TaskItem contract. */
export const RowList: Story = {
  args: { tasks: TASKS, members: MEMBERS },
  render: () => {
    const [selected, setSelected] = React.useState<string | null>("t1");
    return (
      <div className="min-h-[100dvh] bg-[#0b0d14] p-6" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
        <div className="w-[280px] space-y-0.5">
          {TASKS.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              member={MEMBERS.find((m) => m.id === task.assigneeId)}
              selected={selected === task.id}
              onSelect={() => setSelected(task.id)}
            />
          ))}
        </div>
      </div>
    );
  },
};
