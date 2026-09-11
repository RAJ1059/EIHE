import type { Metadata } from "next";
import { LegalPage, H2, P, UL } from "@/components/sections/legal/LegalContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How the European Institute For Healthcare Excellence (EIHE) collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="September 12, 2026">
      <P>
        This Privacy Policy explains how the European Institute For Healthcare Excellence
        (&ldquo;EIHE&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, and protects your
        personal data when you visit our website, create an account, or enroll in a course.
      </P>

      <H2>1. Information We Collect</H2>
      <P>We collect information you provide directly, including:</P>
      <UL>
        <li>Account details: name, email address, and password (stored securely, never in plain text);</li>
        <li>
          Billing details at checkout: name, email, phone, country, and address, used to process
          your order and generate receipts;
        </li>
        <li>Course activity: enrollments, lesson progress, quiz results, and certificates earned;</li>
        <li>Communications you send us, such as support requests or contact form submissions.</li>
      </UL>
      <P>
        We also collect limited technical information automatically (such as browser type and
        pages visited) to keep the site secure and working correctly.
      </P>

      <H2>2. How We Use Your Information</H2>
      <UL>
        <li>To create and manage your account and track your course progress;</li>
        <li>To process payments and send order confirmations and receipts;</li>
        <li>To issue certificates and respond to support requests;</li>
        <li>To send you course-related updates and, where you&rsquo;ve agreed to receive them, occasional announcements about new programs;</li>
        <li>To maintain the security and integrity of the platform.</li>
      </UL>

      <H2>3. Payment Processing</H2>
      <P>
        Payments are handled by our payment processor, Razorpay. When you check out, your card,
        UPI, or netbanking details are entered directly into Razorpay&rsquo;s secure payment
        interface — EIHE never sees or stores your full payment card details.
      </P>

      <H2>4. Cookies &amp; Similar Technologies</H2>
      <P>
        We use essential cookies to keep you signed in and to remember items in your cart. We do
        not use these cookies to sell your data to third parties.
      </P>

      <H2>5. Sharing Your Information</H2>
      <P>
        We do not sell your personal data. We share information only with service providers who
        help us operate the platform — for example, our payment processor (Razorpay) to process
        transactions, and our hosting/infrastructure providers to run the website — and only to
        the extent needed for them to provide that service, or where required by law.
      </P>

      <H2>6. Data Security</H2>
      <P>
        We use industry-standard measures — including encrypted password storage and secure
        (HTTPS) connections — to protect your data. No method of transmission or storage is
        completely secure, but we work to protect your information using commercially reasonable
        safeguards.
      </P>

      <H2>7. Data Retention</H2>
      <P>
        We retain account and enrollment data for as long as your account is active, and for a
        reasonable period afterward to meet legal, accounting, or certificate-verification
        requirements. You may request deletion of your account as described below.
      </P>

      <H2>8. Your Rights</H2>
      <P>
        Depending on where you live, you may have the right to access, correct, or request
        deletion of your personal data, or to object to certain uses of it. To exercise any of
        these rights, contact us using the details below and we will respond within a reasonable
        time.
      </P>

      <H2>9. Children&rsquo;s Privacy</H2>
      <P>
        Our courses are designed for healthcare professionals and adult learners. We do not
        knowingly collect personal data from children.
      </P>

      <H2>10. Changes to This Policy</H2>
      <P>
        We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date
        above reflects the most recent revision. Material changes will be reflected on this page.
      </P>

      <H2>11. Contact</H2>
      <P>For any privacy-related questions or requests, contact us at:</P>
      <UL>
        <li>Email: info@europeanihe.com</li>
        <li>Phone: +91 92205 00981</li>
        <li>Address: Sevilla, Spain &amp; New Delhi, India</li>
      </UL>
    </LegalPage>
  );
}
