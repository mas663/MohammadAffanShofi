"use client";

import { useState, useEffect } from "react";
import { Trash2, MessageCircle, Mail, Calendar } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  email: string | null;
  message: string;
  created_at: string;
  is_approved: boolean;
}

type Toast = {
  message: string;
  type: "success" | "error";
};

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/admin/comments");
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments(comments.filter((c) => c.id !== id));
        showToast("Comment deleted successfully");
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("Failed to delete comment", "error");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">
              Comments Management
            </h1>
          </div>
          <p className="text-sm text-neutral-400">
            Manage and moderate user comments on your portfolio
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-indigo-500/20 bg-linear-to-r from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
          <div className="text-3xl font-bold text-white mb-1">
            {comments.length}
          </div>
          <div className="text-sm text-neutral-400">Total Comments</div>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-linear-to-r from-green-500/5 to-emerald-500/5 p-6 backdrop-blur-sm">
          <div className="text-3xl font-bold text-white mb-1">
            {comments.filter((c) => c.is_approved).length}
          </div>
          <div className="text-sm text-neutral-400">Approved</div>
        </div>
        <div className="rounded-xl border border-orange-500/20 bg-linear-to-r from-orange-500/5 to-red-500/5 p-6 backdrop-blur-sm">
          <div className="text-3xl font-bold text-white mb-1">
            {comments.filter((c) => !c.is_approved).length}
          </div>
          <div className="text-sm text-neutral-400">Pending Review</div>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-indigo-500/20 bg-linear-to-r from-indigo-500/5 to-purple-500/5 backdrop-blur-sm">
          <MessageCircle className="w-16 h-16 text-indigo-400/50 mx-auto mb-4" />
          <p className="text-neutral-300 text-lg font-medium">
            No comments yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="group flex items-start gap-4 rounded-xl border border-indigo-500/20 bg-linear-to-r from-indigo-500/5 to-purple-500/5 p-6 hover:border-indigo-500/40 hover:from-indigo-500/10 hover:to-purple-500/10 backdrop-blur-sm transition-all"
            >
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {comment.name}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-xs text-neutral-400 mt-1">
                      {comment.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {comment.email}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={deleting === comment.id}
                    aria-label="Delete comment"
                    className="rounded-lg p-2.5 bg-white/5 border border-white/10 text-neutral-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting === comment.id ? (
                      <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Message */}
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-indigo-500/10 mt-3">
                  <p className="text-neutral-300 text-sm whitespace-pre-wrap wrap-break-word">
                    {comment.message}
                  </p>
                </div>

                {/* Status Badge */}
                {!comment.is_approved && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-xs font-medium">
                      Pending Review
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div
            className={`rounded-xl px-6 py-3 shadow-2xl backdrop-blur-sm border ${
              toast.type === "success"
                ? "bg-linear-to-r from-green-600/90 to-emerald-600/90 border-green-500/50"
                : "bg-linear-to-r from-red-600/90 to-rose-600/90 border-red-500/50"
            }`}
          >
            <p className="font-medium text-white">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
