"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, User, Mail, Send } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  email: string | null;
  message: string;
  created_at: string;
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments");
      const data = await res.json();
      // Ensure data is array, fallback to empty array if error object
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const toast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      toast("Please fill in all required fields", "error");
      return;
    }

    if (formData.message.length > 1000) {
      toast("Message is too long (max 1000 characters)", "error");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit comment");
      }

      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setFormData({ name: "", email: "", message: "" });
      toast("Comment posted successfully!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to post comment";
      toast(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <section
      id="comments"
      className="relative min-h-screen bg-black py-20 overflow-hidden"
    >
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-7xl px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Leave a Comment
          </h2>
          <p className="text-neutral-400 text-lg flex items-center justify-center gap-2">
            <MessageCircle className="h-5 w-5 text-indigo-400" />
            Share your thoughts, feedback, or just say hi!
            <MessageCircle className="h-5 w-5 text-indigo-400" />
          </p>
        </motion.div>

        {/* 2 Column Layout: Form (Left) | Comments List (Right) */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT: Comment Form */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="relative space-y-5 rounded-2xl border border-white/10 bg-white/3 p-6 md:p-8 backdrop-blur-sm h-fit lg:sticky lg:top-24"
          >
            <div className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 blur-2xl" />
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Name Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 bg-neutral-900/50 border border-indigo-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    maxLength={255}
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Email <span className="text-gray-500">(optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-neutral-900/50 border border-indigo-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Write your comment here..."
                rows={4}
                className="w-full px-4 py-3 bg-neutral-900/50 border border-indigo-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                maxLength={1000}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-indigo-400/60">
                  {formData.message.length}/1000 characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Post Comment
                </>
              )}
            </button>
          </motion.form>

          {/* RIGHT: Comments List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-400" />
              Comments ({comments.length})
            </h3>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                <p className="text-neutral-400 mt-4">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 bg-white/3 rounded-2xl border border-white/10 backdrop-blur-sm">
                <MessageCircle className="w-16 h-16 text-indigo-400/30 mx-auto mb-4" />
                <p className="text-neutral-200 text-lg font-medium">
                  No comments yet
                </p>
                <p className="text-neutral-500 text-sm mt-2">
                  Be the first to leave a comment!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-150 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/3 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:border-indigo-500/30 hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-white font-semibold text-sm">
                            {comment.name}
                          </h4>
                          <p className="text-neutral-500 text-xs whitespace-nowrap">
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                        <p className="text-neutral-300 text-sm whitespace-pre-wrap wrap-break-word">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-60"
          >
            <div
              className={`px-6 py-3 rounded-xl shadow-2xl backdrop-blur-xl border ${
                toastType === "success"
                  ? "bg-green-600/90 border-green-500/50 text-white"
                  : "bg-red-600/90 border-red-500/50 text-white"
              }`}
            >
              <p className="text-white font-medium">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
