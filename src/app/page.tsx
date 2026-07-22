import { HeroSection } from "@/components/home/hero-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { FeaturedPackages } from "@/components/home/featured-packages";
import { PopularDestinations } from "@/components/home/popular-destinations";
import { CostCalculator } from "@/components/home/cost-calculator";
import { StatsSection } from "@/components/home/stats-section";
import { AnalyticsSection } from "@/components/home/analytics-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BlogSection } from "@/components/home/blog-section";
import { GallerySection } from "@/components/home/gallery-section";
import { FaqSection } from "@/components/home/faq-section";
import { ContactCta } from "@/components/home/contact-cta";
import { QuickBookSection } from "@/components/home/quick-book-section";
import {
  fetchFeaturedPackages,
  fetchBlogs,
  fetchGallery,
  fetchDestinations,
  fetchTestimonials,
  fetchFaqs,
  fetchSiteStats,
} from "@/lib/api";

export default async function Home() {
  const [packages, posts, images, destinations, testimonials, faqs, siteStats] = await Promise.all([
    fetchFeaturedPackages(),
    fetchBlogs(),
    fetchGallery(),
    fetchDestinations(),
    fetchTestimonials(),
    fetchFaqs(),
    fetchSiteStats(),
  ]);

  return (
    <>
      <HeroSection />
      <QuickBookSection />
      <WhyChooseUs />
      <FeaturedPackages packages={packages} />
      <PopularDestinations destinations={destinations} />
      <CostCalculator destinations={destinations} />
      <StatsSection siteStats={siteStats} />
      {/* <AnalyticsSection /> */}
      <TestimonialsSection testimonials={testimonials} />
      <BlogSection posts={posts.slice(0, 4)} />
      <GallerySection images={images.slice(0, 8)} />
      <FaqSection faqs={faqs} />
      <ContactCta />
    </>
  );
}
