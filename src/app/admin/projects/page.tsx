"use client";

import { useEffect, useState } from "react";
import {
  GripVertical,
  Plus,
  X,
  Pencil,
  Trash2,
  FolderKanban,
  Tag,
} from "lucide-react";
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

type Project = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  tags: string[];
  order_index: number;
};

type Toast = {
  message: string;
  type: "success" | "error";
};

function SortableProject({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={`group flex items-center gap-4 rounded-xl border border-indigo-500/20 bg-linear-to-r from-indigo-500/5 to-purple-500/5 p-5 hover:border-indigo-500/40 hover:from-indigo-500/10 hover:to-purple-500/10 backdrop-blur-sm transition-all ${isDragging ? "opacity-50" : ""}`}
      style={
        {
          transform: CSS.Transform.toString(transform),
          transition,
        } as React.CSSProperties
      }
    >
      <button
        {...listeners}
        aria-label="Drag to reorder"
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-white/5 rounded-lg transition"
      >
        <GripVertical className="h-5 w-5 text-indigo-400" />
      </button>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{project.title}</h3>
        <p className="text-sm text-neutral-400 truncate">
          {project.description}
        </p>
        {project.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-xs text-indigo-300 font-medium"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(project)}
          aria-label="Edit project"
          className="rounded-lg p-2.5 bg-white/5 border border-white/10 text-neutral-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 transition-all"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(project.id)}
          aria-label="Delete project"
          className="rounded-lg p-2.5 bg-white/5 border border-white/10 text-neutral-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    href: "",
    image: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setToast({ message: "Failed to fetch projects", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newOrder = arrayMove(projects, oldIndex, newIndex);
      setProjects(newOrder);

      try {
        await fetch("/api/admin/projects/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projects: newOrder.map((p, idx) => ({ ...p, order_index: idx })),
          }),
          credentials: "include",
        });
        setToast({
          message: "Projects reordered successfully!",
          type: "success",
        });
      } catch (error) {
        console.error("Error reordering projects:", error);
        setToast({ message: "Failed to reorder projects", type: "error" });
        fetchProjects();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingProject) {
        const response = await fetch(
          `/api/admin/projects/${editingProject.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include",
          },
        );

        if (response.ok) {
          setToast({
            message: "Project updated successfully!",
            type: "success",
          });
          fetchProjects();
          handleCloseModal();
        }
      } else {
        const response = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        });

        if (response.ok) {
          setToast({
            message: "Project created successfully!",
            type: "success",
          });
          fetchProjects();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Error saving project:", error);
      setToast({ message: "Failed to save project", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setToast({ message: "Project deleted successfully!", type: "success" });
        fetchProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setToast({ message: "Failed to delete project", type: "error" });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      href: project.href,
      image: project.image,
      tags: project.tags || [],
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      href: "",
      image: "",
      tags: [],
    });
    setTagInput("");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  if (loading) {
    return (
      <div className="text-center text-neutral-400 py-12">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-indigo-400" />
            Projects Management
          </h1>
          <p className="text-neutral-400 mt-2">
            Manage your portfolio projects with drag & drop ordering
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-5 w-5" /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center text-neutral-400 py-16 rounded-2xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm">
          <FolderKanban className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
          <p className="text-lg font-medium mb-1">No projects yet</p>
          <p className="text-sm">
            Click &quot;Add Project&quot; to create your first one
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {projects.map((project) => (
                <SortableProject
                  key={project.id}
                  project={project}
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
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingProject ? "Edit Project" : "Add New Project"}
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
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="Project title"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="Project description"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Link (URL) (Optional)
                </label>
                <input
                  type="url"
                  value={formData.href}
                  onChange={(e) =>
                    setFormData({ ...formData, href: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value })}
                label="Project Image"
                placeholder="https://example.com/project-image.png"
              />
              <p className="mt-2 text-xs text-indigo-300/70">
                💡 Tip: Use a project screenshot or upload a PNG/JPG image
                (recommended: 1200x630px)
              </p>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="Add tag (press Enter)"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-sm text-white"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingProject ? "Update" : "Create"}
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
              ? "bg-linear-to-r from-green-500/90 to-emerald-500/90 border-green-400/20 text-white"
              : "bg-linear-to-r from-red-500/90 to-rose-500/90 border-red-400/20 text-white"
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
