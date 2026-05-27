// app/dashboard/admin/blog/page.tsx
"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { PageHeader, Btn, SectionCard, Badge, EmptyState, SkeletonTable } from "@/components/dashboard/shared";
import { useBlogPosts } from "@/hooks";
import { adminBlogAPI } from "@/services/api";
import type { BlogPost } from "@/types/dashboard";

const CARD_GRADIENTS = [
  "from-[#daeeff] to-[#b3d4f5]",
  "from-[#e0f7fa] to-[#b2ebf2]",
  "from-[#f3e5f5] to-[#e1bee7]",
  "from-[#fce4ec] to-[#f8bbd9]",
];
const ICON_COLORS = ["text-[#00418d]","text-[#00796b]","text-[#6a1b9a]","text-[#ad1457]"];

export default function AdminBlogPage() {
  const { data, loading, reload } = useBlogPosts();
  const posts: BlogPost[] = data ?? [];
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    setDeleting(id);
    await adminBlogAPI.remove(id);
    setDeleting(null);
    reload();
  };

  const handleToggle = async (post: BlogPost) => {
    await adminBlogAPI.update(post._id, {
      status: post.status === "published" ? "draft" : "published",
    });
    reload();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Blog CMS"
        subtitle="Manage platform articles and announcements"
        actions={<Btn variant="primary" icon={<Plus size={14} />}>New Post</Btn>}
      />

      {loading ? (
        <SkeletonTable rows={4} />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No blog posts yet"
          description="Create your first post to get started."
          action={<Btn variant="primary" icon={<Plus size={14} />}>New Post</Btn>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {posts.map((post, i) => (
            <div key={post._id}
              className="bg-white border border-[#e2edf7] rounded-xl overflow-hidden
                hover:shadow-md transition-shadow">
              {/* Thumbnail / Gradient placeholder */}
              <div className={`h-24 bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}
                flex items-center justify-center`}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5"
                  className={ICON_COLORS[i % ICON_COLORS.length]}>
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>

              {/* Content */}
              <div className="p-3 space-y-3">
                <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
                  {post.title}
                </p>
                <p className="text-xs text-gray-400">{post.createdAt}</p>

                <div className="flex items-center justify-between">
                  <Badge
                    label={post.status === "published" ? "Published" : "Draft"}
                    variant={post.status === "published" ? "green" : "yellow"}
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggle(post)}
                      className="text-[11px] text-[#00418d] hover:underline px-1"
                      title="Toggle status"
                    >
                      <Eye size={13} />
                    </button>
                    <Btn size="sm" icon={<Edit2 size={12} />} />
                    <Btn
                      size="sm"
                      variant="danger"
                      icon={<Trash2 size={12} />}
                      disabled={deleting === post._id}
                      onClick={() => handleDelete(post._id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor placeholder */}
      <SectionCard title="Rich Text Editor">
        <div className="border border-dashed border-[#daeeff] rounded-xl p-8 text-center
          text-sm text-gray-400">
          <p className="mb-1 font-medium text-gray-600">New Post Editor</p>
          <p>Integrate your preferred editor here (e.g. TipTap, Quill, or React-Quill).</p>
          <p className="mt-1 text-xs">The editor state posts to <code className="bg-[#f0f7ff] px-1 rounded">POST /api/blogs</code></p>
        </div>
      </SectionCard>
    </div>
  );
}
