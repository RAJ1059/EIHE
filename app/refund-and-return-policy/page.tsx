import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, H2, P, UL } from "@/components/sections/legal/LegalContent";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description: "EIHE's refund policy for course enrollments and digital program access.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Refund & Return Policy" updated="September 12, 2026">
      <P>
        EIHE courses are delivered as digital, self-paced online programs — there is no physical
        product to return. This policy explains when a refund is available for a course
        enrollment.
      </P>

      <H2>1. Refund Window</H2>
      <P>
        You may request a full refund within 7 days of your purchase date, provided that:
      </P>
      <UL>
        <li>You have not completed more than 20% of the course content, and</li>
        <li>No certificate of completion has been issued for the course.</li>
      </UL>
      <P>
        Requests made after 7 days, or after either of the above conditions no longer applies, are
        not eligible for a refund under this policy, except where required by applicable
        consumer-protection law.
      </P>

      <H2>2. How to Request a Refund</H2>
      <P>
        Email info@europeanihe.com with your order details (the email address used at checkout and
        the course name) and the reason for your request. We may ask a few follow-up questions to
        verify eligibility.
      </P>

      <H2>3. Processing Time</H2>
      <P>
        Approved refunds are issued to the original payment method via Razorpay within 7–10
        business days of approval. Depending on your bank or card issuer, it may take a few
        additional days for the refund to appear in your account.
      </P>

      <H2>4. Non-Refundable Situations</H2>
      <UL>
        <li>Courses purchased more than 7 days ago, or where more than 20% of the content has been accessed;</li>
        <li>Courses for which a certificate of completion has already been issued;</li>
        <li>
          Fully or partially discounted enrollments made using a coupon marked as non-refundable
          at checkout.
        </li>
      </UL>

      <H2>5. Failed, Duplicate, or Cancelled Payments</H2>
      <P>
        If a payment fails but funds are deducted, or you are charged more than once for the same
        order due to a technical issue, contact us and we will investigate and refund the
        incorrect amount promptly once confirmed with Razorpay.
      </P>

      <H2>6. Coupons &amp; Promotions</H2>
      <P>
        Where a coupon or promotional discount was applied to your order, any refund is calculated
        based on the amount actually paid, not the course&rsquo;s original list price.
      </P>

      <H2>7. Contact</H2>
      <P>
        For any refund request or question about this policy, contact us at info@europeanihe.com
        or +91 92205 00981. See also our{" "}
        <Link href="/terms-conditions" className="font-semibold text-teal hover:underline">
          Terms &amp; Conditions
        </Link>
        .
      </P>
    </LegalPage>
  );
}
