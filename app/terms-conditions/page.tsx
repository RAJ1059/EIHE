import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, H2, P, UL } from "@/components/sections/legal/LegalContent";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms and conditions governing use of the EIHE website and enrollment in EIHE courses and programs.",
};

export default function TermsConditionsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms & Conditions" updated="September 12, 2026">
      <P>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the
        website operated by the European Institute For Healthcare Excellence
        (&ldquo;EIHE&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), including
        browsing our programs, creating an account, and enrolling in any course. By using this
        site or enrolling in a course, you agree to be bound by these Terms. If you do not agree,
        please do not use the site or enroll.
      </P>

      <H2>1. Eligibility</H2>
      <P>
        Our courses are intended for healthcare professionals, students, and institutions. You
        must provide accurate information when creating an account and are responsible for
        keeping your login credentials confidential and for all activity under your account.
      </P>

      <H2>2. Courses, Enrollment &amp; Access</H2>
      <P>
        Course listings describe the content, format, duration, and access terms available at the
        time of purchase. Access to a course begins once enrollment is confirmed (payment received
        or, for free courses, registration completed) and continues for the access period stated
        on the course page (for example, lifetime access or a fixed number of weeks/months).
      </P>
      <P>
        We may update course content, structure, or instructors from time to time to keep programs
        current, without reducing the overall value of what you enrolled in.
      </P>

      <H2>3. Certificates</H2>
      <P>
        Where a course offers a certificate of completion, it is issued once you meet the stated
        completion requirements (for example, finishing all lessons and passing any required
        quizzes at the minimum passing score). Certificates recognize completion of an educational
        program and do not constitute a professional license, medical registration, or regulatory
        qualification of any kind.
      </P>

      <H2>4. Fees &amp; Payment</H2>
      <P>
        Course fees are shown in the currency displayed at checkout and are payable in full at the
        time of enrollment unless a specific payment plan is offered on the course page. Payments
        are processed securely through our payment processor (Razorpay); EIHE does not store your
        full card details. Coupons and discounts are subject to the terms shown at the time they
        are applied and may be withdrawn or changed at any time.
      </P>
      <P>
        See our{" "}
        <Link href="/refund-and-return-policy" className="font-semibold text-teal hover:underline">
          Refund &amp; Return Policy
        </Link>{" "}
        for details on cancellations and refunds.
      </P>

      <H2>5. Acceptable Use</H2>
      <P>You agree not to:</P>
      <UL>
        <li>Share your account, course materials, or certificates with anyone who has not enrolled;</li>
        <li>Copy, redistribute, or resell course content without our written permission;</li>
        <li>Attempt to disrupt, reverse-engineer, or gain unauthorized access to the site or its systems;</li>
        <li>Use the site for any unlawful purpose or in a way that infringes the rights of others.</li>
      </UL>

      <H2>6. Intellectual Property</H2>
      <P>
        All course content, videos, text, graphics, logos, and the EIHE brand are owned by EIHE or
        its licensors and are protected by copyright and other intellectual property laws.
        Enrollment grants you a personal, non-transferable license to access the content for your
        own learning — it does not transfer ownership of any materials to you.
      </P>

      <H2>7. Educational Purpose &amp; Disclaimer</H2>
      <P>
        EIHE programs provide education and professional development. They do not replace
        national licensing, medical registration, or regulatory requirements in your country or
        place of practice. You remain responsible for verifying how any certificate or
        qualification is recognized in your jurisdiction before relying on it professionally.
      </P>

      <H2>8. Limitation of Liability</H2>
      <P>
        To the fullest extent permitted by law, EIHE is not liable for any indirect, incidental,
        or consequential loss arising from your use of the site or a course, including loss of
        income or professional opportunity. Nothing in these Terms limits liability that cannot
        lawfully be excluded.
      </P>

      <H2>9. Termination</H2>
      <P>
        We may suspend or terminate access to an account that violates these Terms, including
        sharing credentials or course content. Where reasonably possible, we will attempt to
        notify you and give you an opportunity to resolve the issue first.
      </P>

      <H2>10. Changes to These Terms</H2>
      <P>
        We may update these Terms from time to time to reflect changes to our courses, systems, or
        legal requirements. The &ldquo;Last updated&rdquo; date above shows when this page was
        last revised; continued use of the site after an update means you accept the revised
        Terms.
      </P>

      <H2>11. Contact</H2>
      <P>Questions about these Terms can be sent to:</P>
      <UL>
        <li>Email: info@europeanihe.com</li>
        <li>Phone: +91 92205 00981</li>
        <li>Address: Sevilla, Spain &amp; New Delhi, India</li>
      </UL>
    </LegalPage>
  );
}
