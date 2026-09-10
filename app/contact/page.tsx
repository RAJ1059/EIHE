import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the European Institute for Healthcare Excellence for admissions, course details, support, or partnership guidance.",
};

const contactDetails = [
  {
    icon: PinIcon,
    label: "Address",
    value: "Sevilla, Spain & New Delhi, India",
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: "+91 92205 00981",
  },
  {
    icon: MailIcon,
    label: "Email",
    value: "info@europeanihe.com",
  },
  {
    icon: ClockIcon,
    label: "WhatsApp",
    value: "Chat with our team",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-lime">
        <Reveal className="mx-auto max-w-3xl px-6 py-16 text-center lg:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            We&rsquo;re Here to Help
          </h1>
        </Reveal>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">
          <Reveal>
            <h2 className="text-2xl font-bold text-sage">Have questions?</h2>
            <p className="mt-4 leading-relaxed text-ink/70">
              Need guidance about a program, partnership, or enrolment?
              <br />
              Our team is always ready to assist you.
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="rounded-2xl bg-sage p-6 text-white sm:p-8"
          >
            <h2 className="text-xl font-bold text-white">
              Customer Service
            </h2>
            <p className="mt-1 text-teal">info@europeanihe.com</p>
            <p className="mt-4 leading-relaxed text-white/80">
              Whether you&rsquo;re a healthcare professional seeking advanced
              training, a prospective student exploring our offerings, or a
              partner institution looking to collaborate, we&rsquo;re
              committed to providing prompt and helpful responses.
            </p>
            <p className="mt-4 leading-relaxed text-white/80">
              Contact Us Today and take the next step toward advancing your
              career in aesthetic medicine, cosmetic dermatology, and
              healthcare excellence.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
            <Reveal className="lg:col-span-3">
              <ContactForm />
            </Reveal>

            <Reveal delay={0.12} className="lg:col-span-2">
              <div className="rounded-2xl bg-teal p-6 text-white shadow-sm transition-transform duration-500 ease-out hover:-translate-y-1 sm:p-8">
                <h2 className="text-xl font-semibold text-white">
                  Contact information
                </h2>
                <RevealGroup className="mt-6 space-y-5" stagger={0.06}>
                  {contactDetails.map(({ icon: Icon, label, value }) => (
                    <RevealItem key={label} className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.15em] text-white/60 uppercase">
                          {label}
                        </p>
                        <p className="mt-0.5 text-sm text-white">{value}</p>
                      </div>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
