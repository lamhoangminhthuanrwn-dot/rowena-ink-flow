import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedPortfolio from "@/components/home/FeaturedPortfolio";
import ArtistTeam from "@/components/home/ArtistTeam";
import BranchesSection from "@/components/home/BranchesSection";
import FAQSection from "@/components/home/FAQSection";
import { homeFaqs } from "@/components/home/FAQSection";
import SocialProof from "@/components/home/SocialProof";
import { setSEO, resetSEO, buildLocalBusinessJsonLd, buildFAQJsonLd } from "@/lib/seo";
import { Link } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    setSEO({
      title: undefined,
      description:
        "ROWENA TATTOO CLUB - Xăm hình nghệ thuật chuyên nghiệp tại TP.HCM & Hà Nội. Đặt lịch online, xem mẫu xăm và giá.",
      jsonLd: buildLocalBusinessJsonLd(),
      jsonLdExtra: { id: "seo-jsonld-faq", data: buildFAQJsonLd(homeFaqs) },
    });
    return () => resetSEO();
  }, []);

  return (
    <>
      <HeroSection />
      <WhyChooseUs />
      <FeaturedPortfolio />
      <ArtistTeam />
      <BranchesSection />
      <SocialProof />
      <FAQSection />

      {/* Final CTA */}
      <section className="mx-auto max-w-[1440px] py-20 px-6 md:px-16 text-center">
        <h2 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          Sẵn sàng sở hữu tác phẩm riêng?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Đặt lịch tư vấn miễn phí — Artist sẽ giúp bạn biến ý tưởng thành hình xăm hoàn hảo.
        </p>
        <Link
          to="/dat-lich"
          className="mt-8 inline-block bg-primary px-12 py-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:bg-foreground hover:text-background border border-border"
        >
          Đặt lịch ngay
        </Link>
      </section>
    </>
  );
};

export default Index;
