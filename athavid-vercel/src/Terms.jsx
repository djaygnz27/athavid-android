import React from "react";

const EFFECTIVE_DATE = "April 1, 2026";
const COMPANY = "LDNA Consulting LLC";
const EMAIL = "support@sachistream.com";
const APP = "Sachi";
const DOMAIN = "sachistream.com";

export default function Terms() {
  const s = {
    wrapper: { minHeight:"100vh", background:"#0B0C1A", color:"#e0e0e0", fontFamily:"'Segoe UI', sans-serif", padding:"0 0 80px 0" },
    hero: { background:"linear-gradient(135deg,#1a1040 0%,#0B0C1A 100%)", borderBottom:"1px solid rgba(245,200,66,0.15)", padding:"40px 24px 32px", textAlign:"center" },
    logo: { fontSize:28, fontWeight:900, color:"#F5C842", marginBottom:6 },
    subtitle: { color:"#888", fontSize:13 },
    body: { maxWidth:720, margin:"0 auto", padding:"32px 24px" },
    h2: { color:"#F5C842", fontSize:17, fontWeight:800, marginTop:36, marginBottom:10, borderBottom:"1px solid rgba(245,200,66,0.12)", paddingBottom:8 },
    p: { fontSize:14, lineHeight:1.8, color:"#ccc", marginBottom:14 },
    li: { fontSize:14, lineHeight:1.8, color:"#ccc", marginBottom:6 },
    back: { display:"inline-flex", alignItems:"center", gap:6, color:"#F5C842", fontSize:13, fontWeight:700, textDecoration:"none", marginBottom:24, cursor:"pointer" },
  };

  return (
    <div style={s.wrapper}>
      <div style={s.hero}>
        <div style={s.logo}>⊛ {APP}</div>
        <div style={{ color:"#fff", fontWeight:800, fontSize:22, marginBottom:6 }}>Terms of Service</div>
        <div style={s.subtitle}>Effective Date: {EFFECTIVE_DATE} · Last Updated: {EFFECTIVE_DATE}</div>
      </div>
      <div style={s.body}>
        <a href="/" style={s.back}>← Back to {APP}</a>

        <p style={s.p}>Welcome to {APP} ("the Platform"), operated by {COMPANY} ("we," "us," or "our"). By accessing or using {DOMAIN} or any {APP} mobile application, you agree to be bound by these Terms of Service. Please read them carefully.</p>

        <div style={s.h2}>1. Acceptance of Terms</div>
        <p style={s.p}>By creating an account or using {APP}, you confirm that you are at least 13 years of age, that you have read and understood these Terms, and that you agree to be legally bound by them. If you do not agree, do not use the Platform.</p>

        <div style={s.h2}>2. Eligibility</div>
        <p style={s.p}>You must be at least 13 years old to create an account. Certain features — including mature or adult content — are restricted to users who have verified they are 18 years or older. By enabling 18+ content, you represent and warrant that you are of legal age in your jurisdiction.</p>

        <div style={s.h2}>3. Your Account</div>
        <p style={s.p}>You are responsible for maintaining the security of your account. You agree not to share your login credentials with any third party. {APP} uses Google Sign-In for authentication. You are responsible for all activity that occurs under your account.</p>
        <p style={s.p}>We reserve the right to suspend or terminate accounts that violate these Terms, at our sole discretion, with or without prior notice.</p>

        <div style={s.h2}>4. User Content</div>
        <p style={s.p}>You retain ownership of the content you post on {APP}. By posting content, you grant {COMPANY} a non-exclusive, worldwide, royalty-free, sublicensable license to use, display, reproduce, and distribute your content on the Platform and for promotional purposes.</p>
        <p style={s.p}>You represent and warrant that:</p>
        <ul>
          <li style={s.li}>You own or have the rights to all content you post.</li>
          <li style={s.li}>Your content does not infringe any third-party intellectual property rights.</li>
          <li style={s.li}>Your content complies with all applicable laws.</li>
        </ul>

        <div style={s.h2}>5. Prohibited Content & Conduct</div>
        <p style={s.p}>You agree NOT to post, share, or engage in any of the following on {APP}:</p>
        <ul>
          <li style={s.li}>Content that is illegal, defamatory, harassing, or threatening</li>
          <li style={s.li}>Child sexual abuse material (CSAM) or any content that sexualizes minors</li>
          <li style={s.li}>Content that promotes violence, hate speech, or discrimination</li>
          <li style={s.li}>Spam, scams, or misleading information</li>
          <li style={s.li}>Content that violates any third party's intellectual property rights</li>
          <li style={s.li}>AI-generated deepfakes or synthetic media designed to deceive</li>
          <li style={s.li}>Malware, viruses, or any malicious code</li>
        </ul>
        <p style={s.p}>Violations may result in immediate account termination and, where required by law, reporting to the appropriate authorities.</p>

        <div style={s.h2}>6. Child Safety (CSAM Policy)</div>
        <p style={s.p}>{APP} has a zero-tolerance policy for child sexual abuse material (CSAM). Any such content will be immediately removed, the responsible account permanently banned, and the content reported to the National Center for Missing and Exploited Children (NCMEC) and relevant law enforcement agencies.</p>

        <div style={s.h2}>7. Intellectual Property</div>
        <p style={s.p}>The {APP} name, logo (™), platform design, and original content are the intellectual property of {COMPANY}. The "SACHI" word mark is a pending trademark with the USPTO (effective April 1, 2026). You may not use our branding without written permission.</p>

        <div style={s.h2}>8. Music & Third-Party Content</div>
        <p style={s.p}>{APP} may include music powered by Audius and other licensed providers. You agree to use such content only within the Platform and not to download, redistribute, or repurpose it outside of {APP}.</p>

        <div style={s.h2}>9. Privacy</div>
        <p style={s.p}>Your use of {APP} is also governed by our <a href="/privacy" style={{ color:"#F5C842" }}>Privacy Policy</a>, which is incorporated into these Terms by reference.</p>

        <div style={s.h2}>10. Disclaimers & Limitation of Liability</div>
        <p style={s.p}>{APP} is provided "as is" without warranties of any kind. To the fullest extent permitted by law, {COMPANY} shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Platform.</p>

        <div style={s.h2}>11. Termination</div>
        <p style={s.p}>We may terminate or suspend your access at any time for any reason. You may delete your account at any time by contacting us at {EMAIL}. Upon termination, your license to use the Platform ends immediately.</p>

        <div style={s.h2}>12. Governing Law</div>
        <p style={s.p}>These Terms are governed by the laws of the State of New Jersey, United States, without regard to its conflict of law principles. Any disputes shall be resolved in the courts of Union County, New Jersey.</p>

        <div style={s.h2}>13. Changes to These Terms</div>
        <p style={s.p}>We may update these Terms at any time. If we make material changes, we will notify you via email or an in-app notice. Continued use of {APP} after changes constitutes acceptance of the new Terms.</p>

        <div style={s.h2}>14. Contact Us</div>
        <p style={s.p}>If you have questions about these Terms, please contact us at:<br /><a href={`mailto:${EMAIL}`} style={{ color:"#F5C842" }}>{EMAIL}</a><br />{COMPANY}<br />New Providence, NJ 07974, USA</p>
      </div>
    </div>
  );
}
