import { fetchGallery } from "@/lib/api";
import { GalleryPageClient } from "./gallery-page-client";

export default async function GalleryPage() {
  const images = await fetchGallery();
  return <GalleryPageClient images={images} />;
}
