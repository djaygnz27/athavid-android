import React from "react";

const EFFECTIVE_DATE = "April 1, 2026";
const COMPANY = "LDNA Consulting LLC";
const EMAIL = "support@sachistream.com";
const APP = "Sachi";
const DOMAIN = "sachistream.com";

export default function Privacy() {
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
        <div style={{ color:"#fff", fontWeight:800, fontSize:22, marginBottom:6 }}>Privacy Policy</div>
        <div style={s.subtitle}>Effective Date: {EFFECTIVE_DATE} · Last Updated: {EFFECTIVE_DATE}</div>
      </div>
      <div style={s.body}>
        <a href="/" style={s.back}>← Back to {APP}</a>

        <p style={s.p}>{COMPANY} ("we," "us," "our") operates the {APP} platform at {DOMAIN}. This Privacy Policy explains what data we collect, how we use it, and your rights. By using {APP}, you consent to the practices described here.</p>

        <div style={s.h2}>1. Information We Collect</div>
        <p style={s.p}><strong style={{color:"#fff"}}>Information you provide:</strong></p>
        <ul>
          <li style={s.li}>Account data: name, email address, username, date of birth, profile photo (from Google Sign-In)</li>
          <li style={s.li}>Location: city and country (auto-detected via IP at sign-up; required for posting content)</li>
          <li style={s.li}>Content: videos, photos, text posts, comments, and audio you upload or create</li>
          <li style={s.li}>Communications: messages sent to us via email or support channels</li>
        </ul>
        <p style={s.p}><strong style={{color:"#fff"}}>Information collected automatically:</strong></p>
        <ul>
          <li style={s.li}>Usage data: pages visited, videos watched, interactions (likes, comments, shares)</li>
          <li style={s.li}>Device data: device type, operating system, browser type</li>
          <li style={s.li}>IP address (used for approximate location detection and security)</li>
        </ul>

        <div style={s.h2}>2. How We Use Your Information</div>
        <ul>
          <li style={s.li}>To create and manage your account</li>
          <li style={s.li}>To display your content in the {APP} feed</li>
          <li style={s.li}>To personalize your content recommendations based on your interests and location</li>
          <li style={s.li}>To enforce our Terms of Service and community guidelines</li>
          <li style={s.li}>To communicate with you about platform updates, security alerts, and new features</li>
          <li style={s.li}>To analyze platform performance and improve user experience</li>
          <li style={s.li}>To comply with legal obligations</li>
        </ul>

        <div style={s.h2}>3. Google Sign-In</div>
        <p style={s.p}>We use Google OAuth 2.0 for authentication. When you sign in with Google, we receive your name, email address, and profile photo from Google. We do not receive or store your Google password. Your use of Google Sign-In is also governed by <a href="https://policies.google.com/privacy" target="_blank" style={{color:"#F5C842"}}>Google's Privacy Policy</a>.</p>

        <div style={s.h2}>4. Location Data</div>
        <p style={s.p}>We collect your approximate city and country using IP-based geolocation at sign-up. When you post content, your city and country are stored with that post and displayed publicly. We do not collect precise GPS location data. You may update your location in your profile settings.</p>

        <div style={s.h2}>5. Sharing Your Information</div>
        <p style={s.p}>We do not sell your personal information. We may share data with:</p>
        <ul>
          <li style={s.li}><strong style={{color:"#fff"}}>Service providers:</strong> Infrastructure partners (e.g. Cloudflare for video streaming, Base44 for data storage) who process data on our behalf under confidentiality agreements</li>
          <li style={s.li}><strong style={{color:"#fff"}}>Law enforcement:</strong> When required by law, court order, or to protect the safety of users or the public</li>
          <li style={s.li}><strong style={{color:"#fff"}}>NCMEC:</strong> Any CSAM content and associated user data is reported to the National Center for Missing and Exploited Children as required by US federal law</li>
          <li style={s.li}><strong style={{color:"#fff"}}>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice to users)</li>
        </ul>

        <div style={s.h2}>6. Data Retention</div>
        <p style={s.p}>We retain your account data for as long as your account is active or as needed to provide services. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it by law or for legitimate security purposes.</p>

        <div style={s.h2}>7. Your Rights</div>
        <p style={s.p}>Depending on your location, you may have the right to:</p>
        <ul>
          <li style={s.li}>Access the personal data we hold about you</li>
          <li style={s.li}>Correct inaccurate data</li>
          <li style={s.li}>Request deletion of your data ("right to be forgotten")</li>
          <li style={s.li}>Object to certain processing of your data</li>
          <li style={s.li}>Data portability (receive a copy of your data in a structured format)</li>
        </ul>
        <p style={s.p}>To exercise any of these rights, contact us at <a href={`mailto:${EMAIL}`} style={{color:"#F5C842"}}>{EMAIL}</a>. We will respond within 30 days.</p>

        <div style={s.h2}>8. Children's Privacy (COPPA)</div>
        <p style={s.p}>{APP} is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected information from a child under 13, we will delete it immediately. If you believe a child under 13 has created an account, contact us at {EMAIL}.</p>

        <div style={s.h2}>9. Security</div>
        <p style={s.p}>We take reasonable technical and organizational measures to protect your data from unauthorized access, loss, or misuse. Video content is served via Cloudflare's secure CDN. However, no system is 100% secure, and we cannot guarantee absolute security.</p>

        <div style={s.h2}>10. Third-Party Links & Services</div>
        <p style={s.p}>{APP} may contain links to third-party websites or embed third-party content (e.g. news streams). We are not responsible for the privacy practices of those third parties. We encourage you to review their privacy policies.</p>

        <div style={s.h2}>11. International Users</div>
        <p style={s.p}>{APP} is operated from the United States. If you access the Platform from outside the US, your data may be transferred to and processed in the US. By using {APP}, you consent to such transfer.</p>
        <p style={s.p}>For users in the European Economic Area (EEA) or UK, our legal basis for processing is your consent (given at sign-up) and our legitimate interests in operating a safe platform.</p>

        <div style={s.h2}>12. Cookies & Local Storage</div>
        <p style={s.p}>We use browser localStorage to maintain your session, remember your preferences (e.g. liked videos, dark mode), and improve performance. We do not use advertising cookies or cross-site tracking.</p>

        <div style={s.h2}>13. Changes to This Policy</div>
        <p style={s.p}>We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or via an in-app notice at least 7 days before they take effect. Your continued use of {APP} after changes indicates your acceptance.</p>

        <div style={s.h2}>14. Contact Us</div>
        <p style={s.p}>If you have questions, concerns, or requests regarding this Privacy Policy, contact us at:<br /><a href={`mailto:${EMAIL}`} style={{color:"#F5C842"}}>{EMAIL}</a><br />{COMPANY}<br />New Providence, NJ 07974, USA</p>
      </div>
    </div>
  );
}
