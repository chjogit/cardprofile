"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { BLOCK_LABELS, createBlock } from "@/lib/defaults";
import type { Block, BlockType } from "@/lib/types";
import { BlockEditor } from "./BlockEditor";

function summary(b: Block) {
  switch (b.type) {
    case "profile":
      return b.name;
    case "text":
      return b.text;
    case "link":
      return b.label;
    case "socials":
      return `${b.items.length}개`;
    case "image":
      return b.src ? "이미지 있음" : "비어 있음";
    case "divider":
      return "";
  }
}

function SortableItem({
  block,
  open,
  onToggle,
  onChange,
  onRemove,
}: {
  block: Block;
  open: boolean;
  onToggle: () => void;
  onChange: (b: Block) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-2xl border bg-surface ${isDragging ? "z-10 border-cobalt shadow-lg" : "border-line"}`}
    >
      <div className="flex items-center gap-1 py-1 pl-1 pr-2">
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="grid h-10 w-8 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-ink-soft hover:bg-paper active:cursor-grabbing"
          aria-label={`${BLOCK_LABELS[block.type]} 블록 옮기기`}
        >
          <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor" aria-hidden="true">
            {[3, 9, 15].map((y) => [3, 9].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.5" />))}
          </svg>
        </button>
        <button
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-baseline gap-2 py-2 text-left"
        >
          <span className="shrink-0 text-sm font-semibold">{BLOCK_LABELS[block.type]}</span>
          <span className="truncate text-sm text-ink-soft">{summary(block)}</span>
        </button>
        <button
          onClick={onRemove}
          className="shrink-0 rounded-lg px-2 py-1.5 text-xs text-ink-soft hover:bg-red-50 hover:text-red-600"
        >
          삭제
        </button>
      </div>
      {open && (
        <div className="border-t border-line px-4 pb-4 pt-3">
          <BlockEditor block={block} onChange={onChange} />
        </div>
      )}
    </li>
  );
}

const ADDABLE: BlockType[] = ["link", "text", "socials", "image", "divider", "profile"];

export function BlockList({ blocks, onChange }: { blocks: Block[]; onChange: (b: Block[]) => void }) {
  const [openId, setOpenId] = useState<string | null>(blocks[0]?.id ?? null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = blocks.findIndex((b) => b.id === active.id);
    const to = blocks.findIndex((b) => b.id === over.id);
    onChange(arrayMove(blocks, from, to));
  }

  function add(type: BlockType) {
    const b = createBlock(type);
    onChange([...blocks, b]);
    setOpenId(b.id);
  }

  return (
    <div className="flex flex-col gap-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2">
            {blocks.map((b) => (
              <SortableItem
                key={b.id}
                block={b}
                open={openId === b.id}
                onToggle={() => setOpenId(openId === b.id ? null : b.id)}
                onChange={(nb) => onChange(blocks.map((x) => (x.id === nb.id ? nb : x)))}
                onRemove={() => onChange(blocks.filter((x) => x.id !== b.id))}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div>
        <p className="mb-2 text-sm font-semibold">블록 추가</p>
        <div className="flex flex-wrap gap-2">
          {ADDABLE.map((t) => (
            <button key={t} onClick={() => add(t)} className="btn btn-ghost px-3.5 py-2">
              + {BLOCK_LABELS[t]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
