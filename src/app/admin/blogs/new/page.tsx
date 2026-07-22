import { BlogForm } from "../blog-form";

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New Blog Post</h1>
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
