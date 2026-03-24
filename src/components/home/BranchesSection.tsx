import { MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

const BranchesSection = () => (
  <section className="mx-auto max-w-[1440px] border-b border-border py-20 px-6 md:px-16">
    <div className="mb-12 text-center">
      <h2 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
        Hệ thống chi nhánh
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Đến trực tiếp studio gần bạn nhất để được tư vấn miễn phí.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {siteConfig.branches.map((b) => (
        <div
          key={b.name}
          className="group flex flex-col border border-border p-6 transition-colors hover:border-primary"
        >
          <h3 className="mb-2 font-sans text-base font-bold uppercase tracking-tight text-foreground">
            {b.name}
          </h3>
          <p className="mb-1 font-mono text-xs text-primary">{b.area}</p>
          <div className="mt-auto space-y-2 pt-4">
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
              {b.address}
            </p>
            <a
              href={siteConfig.hotlineHref}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Phone size={14} className="shrink-0 text-primary" />
              {siteConfig.hotline}
            </a>
          </div>
          <a
            href={`https://maps.google.com/maps?q=${b.mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block border border-border py-2 text-center font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Xem bản đồ
          </a>
        </div>
      ))}
    </div>
  </section>
);

export default BranchesSection;
