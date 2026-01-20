"use client";

import { useEffect, useState } from "react";
import { GripVertical, Plus, X, Pencil, Trash2, Code } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

type Skill = {
  id: string;
  name: string;
  icon_name: string;
  category?: string;
  order_index: number;
};

type Toast = {
  message: string;
  type: "success" | "error";
};

function SortableSkill({
  skill,
  onEdit,
  onDelete,
}: {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 p-5 hover:border-indigo-500/40 hover:from-indigo-500/10 hover:to-purple-500/10 backdrop-blur-sm transition-all"
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-white/5 rounded-lg transition"
      >
        <GripVertical className="h-5 w-5 text-indigo-400" />
      </button>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-10 w-10 relative flex-shrink-0 bg-white/5 rounded-lg p-1.5">
          <Image
            src={skill.icon_name}
            alt={skill.name}
            fill
            className="object-contain p-1"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{skill.name}</h3>
          <p className="text-xs text-neutral-500 truncate">{skill.icon_name}</p>
        </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(skill)}
          aria-label="Edit skill"
          className="rounded-lg p-2.5 bg-white/5 border border-white/10 text-neutral-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 transition-all"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(skill.id)}
          aria-label="Delete skill"
          className="rounded-lg p-2.5 bg-white/5 border border-white/10 text-neutral-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon_name: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/admin/skills", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      setToast({ message: "Failed to fetch skills", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = skills.findIndex((s) => s.id === active.id);
      const newIndex = skills.findIndex((s) => s.id === over.id);

      const newOrder = arrayMove(skills, oldIndex, newIndex);
      setSkills(newOrder);

      try {
        await fetch("/api/admin/skills/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skills: newOrder.map((s, idx) => ({ ...s, order_index: idx })),
          }),
          credentials: "include",
        });
        setToast({
          message: "Skills reordered successfully!",
          type: "success",
        });
      } catch (error) {
        console.error("Error reordering skills:", error);
        setToast({ message: "Failed to reorder skills", type: "error" });
        fetchSkills();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingSkill) {
        const response = await fetch(`/api/admin/skills/${editingSkill.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        });

        if (response.ok) {
          setToast({ message: "Skill updated successfully!", type: "success" });
          fetchSkills();
          handleCloseModal();
        }
      } else {
        const response = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        });

        if (response.ok) {
          setToast({ message: "Skill created successfully!", type: "success" });
          fetchSkills();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Error saving skill:", error);
      setToast({ message: "Failed to save skill", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setToast({ message: "Skill deleted successfully!", type: "success" });
        fetchSkills();
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      setToast({ message: "Failed to delete skill", type: "error" });
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      icon_name: skill.icon_name,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSkill(null);
    setFormData({
      name: "",
      icon_name: "",
    });
  };

  if (loading) {
    return (
      <div className="text-center text-neutral-400 py-12">
        Loading skills...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <Code className="w-8 h-8 text-indigo-400" />
            Skills Management
          </h1>
          <p className="text-neutral-400 mt-2">
            Manage your skills with drag & drop ordering
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-5 w-5" /> Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center text-neutral-400 py-16 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm">
          <Code className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
          <p className="text-lg font-medium mb-1">No skills yet</p>
          <p className="text-sm">
            Click &quot;Add Skill&quot; to create your first one
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={skills.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {skills.map((skill) => (
                <SortableSkill
                  key={skill.id}
                  skill={skill}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h2>
              <button
                onClick={handleCloseModal}
                aria-label="Close modal"
                className="rounded-lg p-2 text-neutral-400 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-sky-500 focus:outline-none"
                  placeholder="e.g., React, TypeScript, Python"
                  required
                />
              </div>

              <ImageUpload
                value={formData.icon_name}
                onChange={(value) =>
                  setFormData({ ...formData, icon_name: value })
                }
                label="Skill Icon"
                placeholder="https://cdn.simpleicons.org/react or https://example.com/icon.svg"
              />

              <div className="mt-2">
                <p className="text-xs text-indigo-300/70">
                  💡 Tip: Use Simple Icons:{" "}
                  <code className="text-indigo-400">
                    https://cdn.simpleicons.org/skill_name
                  </code>{" "}
                  or upload a PNG/SVG icon
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingSkill ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl px-6 py-4 shadow-2xl backdrop-blur-sm border animate-in slide-in-from-top-5 fade-in duration-300 ${
            toast.type === "success"
              ? "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/20 text-white"
              : "bg-gradient-to-r from-red-500/90 to-rose-500/90 border-red-400/20 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                toast.type === "success" ? "bg-white" : "bg-white"
              }`}
            />
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
