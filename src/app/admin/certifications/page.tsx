"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GripVertical, Plus, X, Pencil, Trash2, Award } from "lucide-react";
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

type Certification = {
  id: string;
  name: string;
  href: string;
  image: string;
  order_index: number;
};

type Toast = {
  message: string;
  type: "success" | "error";
};

function SortableCertification({
  certification,
  onEdit,
  onDelete,
}: {
  certification: Certification;
  onEdit: (certification: Certification) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: certification.id });

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

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">
          {certification.name}
        </h3>
        <a
          href={certification.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-sky-400 hover:underline truncate block"
        >
          {certification.href}
        </a>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(certification)}
          aria-label="Edit certification"
          className="rounded-lg p-2.5 bg-white/5 border border-white/10 text-neutral-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 transition-all"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(certification.id)}
          aria-label="Delete certification"
          className="rounded-lg p-2.5 bg-white/5 border border-white/10 text-neutral-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    href: "",
    image: "",
  });
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetchCertifications();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchCertifications = async () => {
    try {
      const response = await fetch("/api/admin/certifications");
      if (response.ok) {
        const data = await response.json();
        setCertifications(data);
      }
    } catch (error) {
      console.error("Error fetching certifications:", error);
      setToast({ message: "Failed to fetch certifications", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = certifications.findIndex((c) => c.id === active.id);
      const newIndex = certifications.findIndex((c) => c.id === over.id);

      const newOrder = arrayMove(certifications, oldIndex, newIndex);
      setCertifications(newOrder);

      try {
        await fetch("/api/admin/certifications/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            certifications: newOrder.map((c, idx) => ({
              ...c,
              order_index: idx,
            })),
          }),
        });
        setToast({
          message: "Certifications reordered successfully!",
          type: "success",
        });
      } catch (error) {
        console.error("Error reordering certifications:", error);
        setToast({
          message: "Failed to reorder certifications",
          type: "error",
        });
        fetchCertifications();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = formData.image;

      // Handle file upload if file is selected
      if (uploadMethod === "file" && imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          imageUrl = url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      const dataToSave = {
        ...formData,
        image: imageUrl,
      };

      if (editingCertification) {
        const response = await fetch(
          `/api/admin/certifications/${editingCertification.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSave),
          },
        );

        if (response.ok) {
          setToast({
            message: "Certification updated successfully!",
            type: "success",
          });
          fetchCertifications();
          handleCloseModal();
        }
      } else {
        const response = await fetch("/api/admin/certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        });

        if (response.ok) {
          setToast({
            message: "Certification created successfully!",
            type: "success",
          });
          fetchCertifications();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Error saving certification:", error);
      setToast({ message: "Failed to save certification", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    try {
      const response = await fetch(`/api/admin/certifications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setToast({
          message: "Certification deleted successfully!",
          type: "success",
        });
        fetchCertifications();
      }
    } catch (error) {
      console.error("Error deleting certification:", error);
      setToast({ message: "Failed to delete certification", type: "error" });
    }
  };

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setFormData({
      name: certification.name,
      href: certification.href,
      image: certification.image || "",
    });
    setImagePreview(certification.image || "");
    setUploadMethod(certification.image?.startsWith("http") ? "url" : "file");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCertification(null);
    setFormData({
      name: "",
      href: "",
      image: "",
    });
    setImageFile(null);
    setImagePreview("");
    setUploadMethod("url");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isPDF = file.type === "application/pdf";

      if (isImage || isPDF) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  if (loading) {
    return (
      <div className="text-center text-neutral-400 py-12">
        Loading certifications...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <Award className="w-8 h-8 text-indigo-400" />
            Certifications Management
          </h1>
          <p className="text-neutral-400 mt-2">
            Manage your certifications with drag & drop ordering
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-5 w-5" /> Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center text-neutral-400 py-16 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm">
          <Award className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
          <p className="text-lg font-medium mb-1">No certifications yet</p>
          <p className="text-sm">
            Click &quot;Add Certification&quot; to create your first one
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={certifications.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {certifications.map((cert) => (
                <SortableCertification
                  key={cert.id}
                  certification={cert}
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
                {editingCertification
                  ? "Edit Certification"
                  : "Add New Certification"}
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
                  Certification Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-sky-500 focus:outline-none"
                  placeholder="e.g., AWS Certified Developer"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Certificate Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.href}
                  onChange={(e) =>
                    setFormData({ ...formData, href: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-sky-500 focus:outline-none"
                  placeholder="https://www.credly.com/..."
                />
              </div>

              {/* Image Upload Method */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Certificate Image
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setUploadMethod("url")}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      uploadMethod === "url"
                        ? "bg-sky-500 text-white"
                        : "bg-white/5 text-neutral-400 hover:bg-white/10"
                    }`}
                  >
                    URL Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod("file")}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      uploadMethod === "file"
                        ? "bg-sky-500 text-white"
                        : "bg-white/5 text-neutral-400 hover:bg-white/10"
                    }`}
                  >
                    Drag & Drop
                  </button>
                </div>

                {uploadMethod === "url" ? (
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-sky-500 focus:outline-none"
                    placeholder="https://example.com/certificate.jpg"
                  />
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add(
                        "border-sky-500",
                        "bg-sky-500/10",
                      );
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove(
                        "border-sky-500",
                        "bg-sky-500/10",
                      );
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove(
                        "border-sky-500",
                        "bg-sky-500/10",
                      );
                      const file = e.dataTransfer.files[0];
                      const isImage = file && file.type.startsWith("image/");
                      const isPDF = file && file.type === "application/pdf";

                      if (isImage || isPDF) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          setImagePreview(result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center cursor-pointer hover:border-white/20 transition"
                  >
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg
                        className="w-12 h-12 text-neutral-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm text-neutral-300 mb-1">
                        Drag & drop your certificate (image or PDF)
                      </p>
                      <p className="text-xs text-neutral-500">
                        Supports JPG, PNG, PDF • Click to browse
                      </p>
                    </label>
                  </div>
                )}

                {/* Image/PDF Preview */}
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-xs text-neutral-400 mb-2">Preview:</p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-neutral-800">
                      {imageFile?.type === "application/pdf" ? (
                        <iframe
                          src={imagePreview}
                          className="w-full h-full"
                          title="PDF Preview"
                        />
                      ) : (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-indigo-300/70 mt-2">
                💡 Tip: Upload your certificate image as PNG/JPG or PDF.
                Recommended size: 1920x1080px
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingCertification
                      ? "Update"
                      : "Create"}
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
