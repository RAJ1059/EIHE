import Image from "next/image";
import { admissionsPartners } from "@/data/admissions";

export function AdmissionsPartnersLogos() {
  return (
    <section className="bg-cream py-10">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max animate-[marquee-rtl_30s_linear_infinite] gap-6">
          {[admissionsPartners, admissionsPartners].map((set, setIndex) => (
            <div key={setIndex} className="flex gap-6 pr-6">
              {set.map((partner, index) => (
                <div
                  key={`${setIndex}-${index}`}
                  className="flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-white p-4"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={160}
                    height={80}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
