import type { Metadata } from "next";
import { LegalPage, H2, P, UL } from "@/components/sections/legal/LegalContent";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "EIHE's commitment to making our website and courses accessible to all learners.",
};

export default function AccessibilityPage() {
  return (
    <LegalPage eyebrow="Legal" title="Accessibility Statement" updated="September 12, 2026">
      <P>
        The European Institute For Healthcare Excellence (EIHE) is committed to making our
        website and course platform accessible to the widest possible audience, including
        learners with disabilities.
      </P>

      <H2>1. Our Standard</H2>
      <P>
        We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA across our
        website and student portal, covering areas such as color contrast, keyboard navigation,
        readable text sizing, and clear page structure.
      </P>

      <H2>2. What We&rsquo;ve Built In</H2>
      <UL>
        <li>A light and dark theme with accessible color contrast in both modes;</li>
        <li>Keyboard-navigable forms, menus, and course navigation;</li>
        <li>Descriptive labels on interactive elements such as buttons and form fields;</li>
        <li>Responsive layouts that work across desktop, tablet, and mobile devices.</li>
      </UL>

      <H2>3. Ongoing Efforts</H2>
      <P>
        Accessibility is an ongoing process. As we add new features to the site and the student
        portal, we review them for accessibility and correct issues as they&rsquo;re identified.
      </P>

      <H2>4. Known Limitations</H2>
      <P>
        Some third-party content — such as embedded video players or our payment provider&rsquo;s
        checkout popup — is provided by external services, and their accessibility is managed by
        those providers rather than by EIHE directly.
      </P>

      <H2>5. Feedback</H2>
      <P>
        If you encounter any accessibility barrier while using this site or a course, please let
        us know so we can address it:
      </P>
      <UL>
        <li>Email: info@europeanihe.com</li>
        <li>Phone: +91 92205 00981</li>
      </UL>
    </LegalPage>
  );
}
