import { Button } from "@/components/ui/Button";
import { SearchIcon } from "@/components/ui/icons";
import { advisorBanner } from "@/data/programs";
import { Reveal } from "@/components/motion/Reveal";

export function AdvisorBanner() {
  return (
    <section className="bg-lime">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-14 text-center lg:px-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sage">
          <SearchIcon className="h-6 w-6" />
        </span>
        <h3 className="text-2xl font-extrabold tracking-tight text-ink">
          {advisorBanner.title}
        </h3>
        <p className="max-w-xl text-ink/70">{advisorBanner.description}</p>
        <Button
          href={advisorBanner.buttonHref}
          withArrow={false}
          className="mt-2 !rounded-full !bg-sage"
        >
          {advisorBanner.buttonLabel}
        </Button>
      </Reveal>
    </section>
  );
}
