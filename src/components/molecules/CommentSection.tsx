"use client";

import { useState, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { MessageCircle, Send, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  postId: string;
  author: string;
  text: string;
  timestamp: number;
  likes: number;
}

interface CommentSectionProps {
  postId: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function CommentSection({ postId, isOpen, onToggle }: CommentSectionProps) {
  const [comments, setComments] = useLocalStorage<Comment[]>("valo-comments", []);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const postComments = comments.filter((c) => c.postId === postId);

  const addComment = useCallback(() => {
    if (!newComment.trim() || !authorName.trim()) return;
    const comment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      author: authorName.trim(),
      text: newComment.trim(),
      timestamp: Date.now(),
      likes: 0,
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
  }, [newComment, authorName, postId, setComments]);

  const likeComment = useCallback(
    (commentId: string) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        )
      );
    },
    [setComments]
  );

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 text-gray-400 hover:text-black transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-xs font-mono">{postComments.length}</span>
      </button>

      {isOpen && (
        <div className="mt-4 bg-cream p-4 rounded">
          {/* Comments list */}
          {postComments.length > 0 && (
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {postComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-gray-500">
                      {comment.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">{comment.author}</span>
                      <span className="text-[10px] text-gray-400">{formatTime(comment.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{comment.text}</p>
                    <button
                      onClick={() => likeComment(comment.id)}
                      className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                      {comment.likes > 0 && comment.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add comment */}
          <div className="space-y-2">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-white border border-divider px-3 py-2 text-xs outline-none focus:border-gold transition-colors"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-white border border-divider px-3 py-2 text-xs outline-none focus:border-gold transition-colors"
                onKeyDown={(e) => e.key === "Enter" && addComment()}
              />
              <button
                onClick={addComment}
                disabled={!newComment.trim() || !authorName.trim()}
                className="px-3 py-2 bg-black text-white text-xs disabled:opacity-30 transition-opacity"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
