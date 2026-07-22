import { connectDB } from "@/lib/server/db";
import { Package } from "@/lib/server/models/Package";
import { Blog } from "@/lib/server/models/Blog";
import { Enquiry } from "@/lib/server/models/Enquiry";
import { Contact } from "@/lib/server/models/Contact";
import { Newsletter } from "@/lib/server/models/Newsletter";
import { requireAdmin, ok, fail } from "@/lib/server/api-helpers";

export async function GET() {
  try {
    await requireAdmin("admin");
    await connectDB();

    const [
      totalPackages,
      publishedPackages,
      totalBlogs,
      publishedBlogs,
      unreadEnquiries,
      totalEnquiries,
      unreadContacts,
      activeSubscribers,
    ] = await Promise.all([
      Package.countDocuments({}),
      Package.countDocuments({ status: "published" }),
      Blog.countDocuments({}),
      Blog.countDocuments({ status: "published" }),
      Enquiry.countDocuments({ isRead: false }),
      Enquiry.countDocuments({}),
      Contact.countDocuments({ isRead: false }),
      Newsletter.countDocuments({ isActive: true }),
    ]);

    return ok({
      packages: { total: totalPackages, published: publishedPackages },
      blogs: { total: totalBlogs, published: publishedBlogs },
      enquiries: { total: totalEnquiries, unread: unreadEnquiries },
      contacts: { unread: unreadContacts },
      subscribers: { active: activeSubscribers },
    });
  } catch (err) {
    return fail(err);
  }
}
