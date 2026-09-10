import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { qualityAssurance } from "@/data/homepage";
import { Reveal } from "@/components/motion/Reveal";

export function QualityAssuranceSection() {
  return (
    <section className="bg-white" id="quality-assurance">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {qualityAssurance.title}
          </h2>
          <div className="mt-6 space-y-4">
            {qualityAssurance.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-ink/70">
                {paragraph}
              </p>
            ))}
          </div>
          <Button
            href={qualityAssurance.buttonHref}
            target="_blank"
            rel="noopener noreferrer"
            withArrow={false}
            className="mt-8 !rounded-lg !bg-sage"
          >
            {qualityAssurance.buttonLabel}
          </Button>
        </Reveal>

        <Reveal delay={0.15}>
          <Image
            src="/images/arp-certificate-preview.png"
            alt="ARP Certificate for European Institute For Healthcare Excellence — Status: Active"
            width={1200}
            height={866}
            className="h-auto w-full rounded-2xl shadow-lg"
          />
        </Reveal>
      </div>
    </section>
  );
}
