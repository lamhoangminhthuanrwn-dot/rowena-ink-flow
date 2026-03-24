import { useEffect, useState, useRef } from "react";
import { MapPin, Phone, Clock, MessageSquare, Navigation } from "lucide-react";
import { setSEO, resetSEO } from "@/lib/seo";
import { siteConfig } from "@/data/siteConfig";
import { supabase } from "@/integrations/supabase/client";
import { SITE_DOMAIN } from "@/lib/constants";

const Branches = () => {
  const [artists, setArtists] = useState<Record<string, string[]>>({});
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const mapsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSEO({
      title: "Chi nhánh",
      description: `Hệ thống chi nhánh Rowena Tattoo tại ${siteConfig.branches.map(b => b.area).join(", ")}. Tìm studio gần bạn nhất.`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "TattooParlor",
        name: "ROWENA TATTOO CLUB",
        url: `https://${SITE_DOMAIN}`,
        address: siteConfig.branches.map(b => ({
          "@type": "PostalAddress",
          streetAddress: b.address,
          addressLocality: b.area,
        })),
      },
    });

    supabase
      .from("artists")
      .select("name, branches(name)")
      .eq("is_active", true)
      .then(({ data }) => {
        if (!data) return;
        const map: Record<string, string[]> = {};
        data.forEach((a: any) => {
          const branchName = a.branches?.name;
          if (branchName) {
            if (!map[branchName]) map[branchName] = [];
            map[branchName].push(a.name);
          }
        });
        setArtists(map);
      });
    return () => resetSEO();
  }, []);

  useEffect(() => {
    if (!mapsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setMapsLoaded(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(mapsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="border-b border-border bg-secondary/30 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Hệ thống</p>
          <h1 className="mt-3 font-mono text-3xl font-bold uppercase tracking-wider text-foreground md:text-5xl">
            Chi nhánh Studio
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Rowena Tattoo hiện có mặt tại {siteConfig.branches.length} địa điểm. Tìm studio gần bạn nhất để đặt lịch tư vấn.
          </p>
        </div>
      </section>

      {/* Branches */}
      <section ref={mapsRef} className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1440px] space-y-8">
          {siteConfig.branches.map((branch) => {
            const branchArtists = artists[branch.name] || [];
            return (
              <div key={branch.name} className="grid gap-6 border border-border p-6 md:p-8 lg:grid-cols-2">
                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{branch.area}</p>
                    <h2 className="mt-1 font-mono text-xl font-bold uppercase tracking-wider text-foreground md:text-2xl">
                      Rowena Tattoo {branch.name}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="text-sm text-muted-foreground">{branch.address}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <a href={siteConfig.hotlineHref} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                        {siteConfig.hotline}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="text-sm text-muted-foreground">{siteConfig.workingHours}</p>
                    </div>
                  </div>

                  {branchArtists.length > 0 && (
                    <div>
                      <p className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">Artist tại chi nhánh</p>
                      <p className="mt-1 text-sm text-muted-foreground">{branchArtists.join(" · ")}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={siteConfig.hotlineHref}
                      className="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <Phone className="h-3.5 w-3.5" /> Gọi ngay
                    </a>
                    <a
                      href={siteConfig.zaloLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> Nhắn Zalo
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${branch.mapQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Chỉ đường
                    </a>
                  </div>
                </div>

                {/* Map */}
                <div className="aspect-[4/3] lg:aspect-auto">
                  {mapsLoaded ? (
                    <iframe
                      src={`https://maps.google.com/maps?q=${branch.mapQuery}&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: 250 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="border border-border h-full w-full"
                      title={`Bản đồ ${branch.name}`}
                    />
                  ) : (
                    <div className="h-full min-h-[250px] border border-border bg-secondary/50" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Branches;
