import Image from "next/image";
import { partnerInstitutions } from "@/data/homepage";
import { Reveal } from "@/components/motion/Reveal";

function InstitutionLogo({
  institution,
}: {
  institution: (typeof partnerInstitutions)[number];
}) {
  return (
    <div className="flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-white p-3 grayscale transition-all hover:grayscale-0">
      <Image
        src={institution.logo}
        alt={institution.name}
        width={160}
        height={80}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export function PartnerInstitutionsSection() {
  return (
    <section className="bg-white" id="partner-institutions">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold uppercase tracking-tight text-teal">
            Our Partner Institutions
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            <div className="flex w-max animate-[marquee-rtl_32s_linear_infinite] gap-6 hover:[animation-play-state:paused]">
              <div className="flex gap-6 pr-6">
                {partnerInstitutions.map((institution) => (
                  <InstitutionLogo
                    key={institution.name}
                    institution={institution}
                  />
                ))}
              </div>
              <div aria-hidden="true" className="flex gap-6 pr-6">
                {partnerInstitutions.map((institution) => (
                  <InstitutionLogo
                    key={`${institution.name}-dup`}
                    institution={institution}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
