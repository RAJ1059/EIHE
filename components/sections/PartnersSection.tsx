import Image from "next/image";
import { partnerClinics } from "@/data/homepage";
import { Reveal } from "@/components/motion/Reveal";

function flagFor(location: string) {
  return location.includes("India") ? "🇮🇳" : "🇪🇸";
}

function PartnerCard({ partner }: { partner: (typeof partnerClinics)[number] }) {
  return (
    <div className="flex w-56 shrink-0 flex-col rounded-2xl border border-sage/15 bg-white shadow-sm sm:w-64">
      <div className="flex h-28 items-center justify-center border-b border-sage/10 p-4">
        <Image
          src={partner.logo}
          alt={partner.name}
          width={200}
          height={200}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex items-center gap-2 px-4 py-3">
        <span aria-hidden="true">{flagFor(partner.location)}</span>
        <span className="text-sm font-semibold text-ink">
          {partner.location}
        </span>
      </div>
    </div>
  );
}

export function PartnersSection() {
  return (
    <section className="bg-white" id="partners">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold uppercase tracking-tight text-sage sm:text-4xl">
            Our Partners
          </h2>
        </Reveal>

        <div className="mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div className="flex w-max animate-[marquee-rtl_40s_linear_infinite] gap-5 hover:[animation-play-state:paused]">
            <div className="flex gap-5 pr-5">
              {partnerClinics.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} />
              ))}
            </div>
            <div aria-hidden="true" className="flex gap-5 pr-5">
              {partnerClinics.map((partner) => (
                <PartnerCard key={`${partner.name}-dup`} partner={partner} />
              ))}
            </div>
          </div>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center gap-6 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:flex-row sm:justify-between sm:gap-8 sm:p-8">
            <p className="text-center leading-relaxed text-ink/80 sm:text-left">
              EIHE is certified by{" "}
              <strong className="font-bold text-sage">ARP Certificate</strong>
              , the European entity that evaluates the quality of online
              programs under pedagogical, technical, and transparency
              standards.
            </p>
            <div className="flex shrink-0 flex-col items-center gap-2">
              <Image
                src="/images/arp-badge.png"
                alt="ARP High Quality Online Education Certification"
                width={223}
                height={94}
                className="h-auto w-40"
              />
              <span className="text-xs font-semibold text-teal">
                European Union Certification Mark
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
