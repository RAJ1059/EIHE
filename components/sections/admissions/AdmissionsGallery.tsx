import Image from "next/image";
import { admissionsGallery } from "@/data/admissions";

export function AdmissionsGallery() {
  return (
    <section className="bg-cream py-10">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max animate-[marquee-rtl_45s_linear_infinite] gap-4">
          {[admissionsGallery, admissionsGallery].map((set, setIndex) => (
            <div key={setIndex} className="flex gap-4 pr-4">
              {set.map((photo, index) => (
                <div
                  key={`${setIndex}-${index}`}
                  className="relative h-56 w-72 shrink-0 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
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
