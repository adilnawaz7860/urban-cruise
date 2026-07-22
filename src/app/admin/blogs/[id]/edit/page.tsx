"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminGet } from "@/lib/admin/api-client";
import { BlogForm, type BlogFormValues } from "../../blog-form";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<BlogFormValues | null>(null);

  useEffect(() => {
    adminGet<BlogFormValues>(`/api/admin/blogs/${params.id}`).then((res) => setInitial(res.data));
  }, [params.id]);

  if (!initial) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      <div className="mt-6">
        <BlogForm initial={initial} />
      </div>
    </div>
  );
}
