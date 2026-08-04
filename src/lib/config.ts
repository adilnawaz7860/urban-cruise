export const siteConfig = {
  name: "Urban Cruise",
  shortName: "Urban Cruise",
  url: "https://www.urbancruiselko.com",
  phone: "+91 92609 94765",
  phoneRaw: "+919260994765",
  whatsappNumber: "919260994765",
  email: "info@urbancruiselko.com",
  address: "Vineet Khand 6, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
  social: {
    facebook: "https://facebook.com/urbancruiselko",
    instagram: "https://instagram.com/urbancruiselko",
    youtube: "https://youtube.com/@urbancruiselko",
    twitter: "https://twitter.com/urbancruiselko",
  },
} as const;

export const navLinks = [
  { href: "/", key: "home" },
  { href: "/packages", key: "packages" },
  { href: "/destinations", key: "destinations" },
  { href: "/gallery", key: "gallery" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export const moreLinks = [
  { href: "/planner", key: "planner" },
  { href: "/track-inquiry", key: "trackInquiry" },
] as const;

export const servicesLinks = [
  { href: "/services/book-taxi", key: "bookTaxi" },
  { href: "/services/corporate-car-rental", key: "corporateCarRental" },
  { href: "/services/wedding-car-rental", key: "weddingCarRental" },
  { href: "/services/luxury-car-rental", key: "luxuryCarRental" },
] as const;

export function buildWhatsappLink(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
