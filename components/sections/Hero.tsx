import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

const programStatus = [
  { label: "Curriculum development", status: "Complete" as const },
  { label: "Faculty accreditation", status: "In progress" as const },
  { label: "Clinical placement review", status: "Pending" as const },
  { label: "Certification issuance", status: "Pending" as const },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-sage">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-16 h-96 w-96 rounded-full bg-teal/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-white/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-10 lg:py-24">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-sage uppercase shadow-sm backdrop-blur-sm">
              European-Standard
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 text-5xl leading-[1.05] font-semibold tracking-tight text-white sm:text-6xl">
              Medical Education for the Global Healthcare Workforce
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">
              We design and deliver practice-oriented medical education,
              joint certifications, and institutional training programs
              aligned with European standards — for doctors, clinics, and
              healthcare organizations worldwide.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button href="/programs">Professionals: Explore programs</Button>
              <Button
                href="/partnerships"
                variant="ghost"
                className="!text-white !decoration-white/40 hover:!decoration-white"
              >
                Institutions: Partner with EIHE
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Image
                src="/images/arp-badge.png"
                alt="ARP High Quality Online Education Certification"
                width={223}
                height={94}
                className="h-auto w-48 sm:w-56"
              />
              <p className="text-sm text-white/80">
                <strong className="font-semibold text-white">
                  Built by doctors.
                </strong>{" "}
                Designed for real-world practice.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={0.15}
          className="relative mx-auto w-full max-w-md pb-14 lg:max-w-none lg:pb-16"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-white/60 to-teal/10 blur-2xl"
          />
          <div className="relative rounded-2xl border border-ink/5 bg-white p-5 shadow-[0_20px_60px_-15px_rgba(111,163,190,0.35)] transition-transform duration-500 ease-out hover:-translate-y-1">
            <div className="flex items-center justify-between text-xs text-ink/60">
              <span className="font-medium">PROGRAM &middot; EIHE-2026-0741</span>
              <span className="rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white">
                On Track
              </span>
            </div>
            <h3 className="mt-2 text-xl font-semibold text-ink">
              Advanced Cardiac Care Certification
            </h3>
            <ul className="mt-4 space-y-3 border-t border-ink/10 pt-4">
              {programStatus.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-ink">{row.label}</span>
                  <StatusBadge status={row.status} />
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute left-1/2 bottom-0 w-[85%] -translate-x-1/2 rounded-2xl bg-teal px-6 py-4 shadow-[0_16px_40px_-10px_rgba(111,163,190,0.5)] transition-transform duration-500 ease-out hover:-translate-y-1">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/60 uppercase">
              Assigned Program Lead
            </p>
            <p className="mt-0.5 text-lg font-semibold text-white">
              Reviewing curriculum
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StatusBadge({
  status,
}: {
  status: "Complete" | "In progress" | "Pending";
}) {
  if (status === "Pending") {
    return <span className="text-xs text-ink/50">{status}</span>;
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        status === "Complete"
          ? "bg-teal text-white"
          : "bg-peach text-peach-ink"
      }`}
    >
      {status}
    </span>
  );
}
