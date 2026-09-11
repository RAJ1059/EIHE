import type { Metadata } from "next";
import { LegalPage, H2, P, UL } from "@/components/sections/legal/LegalContent";

export const metadata: Metadata = {
  title: "Legal Notice",
  description: "Publisher and legal information for the EIHE website.",
};

export default function LegalNoticePage() {
  return (
    <LegalPage eyebrow="Legal" title="Legal Notice" updated="September 12, 2026">
      <H2>Site Publisher</H2>
      <P>
        This website is published and operated by the European Institute For Healthcare
        Excellence (&ldquo;EIHE&rdquo;), an international healthcare education institute with a
        presence in Sevilla, Spain and New Delhi, India.
      </P>
      <UL>
        <li>Email: info@europeanihe.com</li>
        <li>Phone: +91 92205 00981</li>
        <li>Address: Sevilla, Spain &amp; New Delhi, India</li>
      </UL>
      <P>
        For our full company registration details, please contact us using the information above.
      </P>

      <H2>Intellectual Property</H2>
      <P>
        The overall structure of this website, along with its text, graphics, logos, images, and
        course content, is the property of EIHE or its licensors and is protected under applicable
        copyright and intellectual property laws. Reproduction or distribution of any part of this
        site without prior written consent is prohibited, other than for your own personal,
        non-commercial use of a course you have enrolled in.
      </P>

      <H2>Hyperlinks</H2>
      <P>
        This site may link to third-party websites (for example, our social media pages or
        payment processor). EIHE is not responsible for the content or practices of external
        sites we do not control.
      </P>

      <H2>Disclaimer</H2>
      <P>
        EIHE programs provide education and professional development. They do not replace
        national licensing, medical registration, or regulatory requirements. While we take
        reasonable care to keep information on this site accurate and up to date, we do not
        guarantee that it is free of errors or omissions at all times.
      </P>

      <H2>Governing Law</H2>
      <P>
        These terms and this notice are governed by applicable law in the jurisdictions in which
        EIHE operates. Any dispute arising from use of this site will first be addressed through
        good-faith discussion between the parties.
      </P>

      <H2>Contact</H2>
      <P>
        For any legal inquiries regarding this website, please reach out to info@europeanihe.com.
      </P>
    </LegalPage>
  );
}
