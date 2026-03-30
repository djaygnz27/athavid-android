export default function Privacy() {
  return (
    <div style={{
      background: "#0a0a0a",
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "0 0 60px 0"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #ff6b6b22 100%)",
        padding: "40px 24px 32px",
        borderBottom: "1px solid #ffffff15"
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎬</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", color: "#fff" }}>AthaVid</h1>
          <p style={{ color: "#ff6b6b", fontWeight: 600, margin: 0, fontSize: 14 }}>Privacy Policy</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>

        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 32 }}>
          <strong style={{ color: "#fff" }}>Effective Date:</strong> March 30, 2026 &nbsp;|&nbsp;
          <strong style={{ color: "#fff" }}>Last Updated:</strong> March 30, 2026
        </p>

        <Section title="1. Introduction">
          AthaVid ("we," "our," or "us"), operated by LDNA Consulting, is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
          use the AthaVid mobile application and website (collectively, the "Platform").
          By using AthaVid, you agree to the practices described in this policy.
        </Section>

        <Section title="2. Information We Collect">
          <b>a) Information You Provide</b>
          <ul>
            <li>Account information: username, display name, email address, phone number, date of birth</li>
            <li>Profile information: bio, profile picture</li>
            <li>Content you upload: videos, captions, hashtags, comments</li>
          </ul>
          <b>b) Information Collected Automatically</b>
          <ul>
            <li>Device information: device type, operating system, unique device identifiers</li>
            <li>Usage data: videos viewed, interactions (likes, comments, shares), time spent</li>
            <li>Log data: IP address, browser type, pages visited, timestamps</li>
          </ul>
          <b>c) Information from Third Parties</b>
          <ul>
            <li>If you sign in via a third-party service, we may receive basic profile information</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          We use your information to:
          <ul>
            <li>Provide, operate, and improve the AthaVid Platform</li>
            <li>Personalize your content feed and recommendations</li>
            <li>Enable social features (following, comments, sharing)</li>
            <li>Ensure platform safety and moderate content</li>
            <li>Communicate with you about your account and updates</li>
            <li>Comply with legal obligations</li>
            <li>Detect and prevent fraud, abuse, and violations of our Terms of Service</li>
          </ul>
        </Section>

        <Section title="4. Age Requirements & Parental Consent">
          AthaVid is intended for users aged <strong>13 and older</strong>. We do not knowingly collect
          personal information from children under 13. If we become aware that a child under 13 has
          provided personal information, we will delete such information promptly.
          <br /><br />
          Certain features may require users to be 18 or older. We use date of birth to verify eligibility
          for age-restricted content.
        </Section>

        <Section title="5. Sharing Your Information">
          We do not sell your personal information. We may share your information with:
          <ul>
            <li><strong>Service providers</strong> who assist us in operating the Platform (hosting, analytics, moderation)</li>
            <li><strong>Other users</strong> — your public profile, videos, and comments are visible to other users</li>
            <li><strong>Law enforcement</strong> when required by law or to protect rights and safety</li>
            <li><strong>Business transfers</strong> — in the event of a merger, acquisition, or sale of assets</li>
          </ul>
        </Section>

        <Section title="6. Content You Upload">
          Videos and other content you post publicly on AthaVid are visible to all users of the Platform.
          You retain ownership of your content, but grant AthaVid a license to host, display, and distribute
          it as part of the Platform's operation. You may delete your content at any time.
        </Section>

        <Section title="7. Data Retention">
          We retain your personal information for as long as your account is active or as needed to provide
          services. You may request deletion of your account and associated data by contacting us at
          <a href="mailto:privacy@athavid.app" style={{ color: "#ff6b6b" }}> lasanjaya@gmail.com</a>.
        </Section>

        <Section title="8. Security">
          We use industry-standard security measures to protect your information, including encryption in
          transit and at rest. However, no method of transmission over the internet is 100% secure, and
          we cannot guarantee absolute security.
        </Section>

        <Section title="9. Your Rights">
          Depending on your location, you may have the right to:
          <ul>
            <li>Access and receive a copy of your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of certain data processing activities</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
          To exercise these rights, contact us at <a href="mailto:lasanjaya@gmail.com" style={{ color: "#ff6b6b" }}>lasanjaya@gmail.com</a>.
        </Section>

        <Section title="10. Cookies & Tracking">
          AthaVid uses cookies and similar tracking technologies to enhance your experience, remember
          preferences, and analyze usage. You can control cookies through your browser settings, though
          some features may not function properly if cookies are disabled.
        </Section>

        <Section title="11. Third-Party Links">
          The Platform may contain links to third-party websites or services. We are not responsible for
          the privacy practices of those third parties and encourage you to review their privacy policies.
        </Section>

        <Section title="12. Changes to This Policy">
          We may update this Privacy Policy from time to time. We will notify you of significant changes
          by posting the new policy on this page and updating the "Last Updated" date. Continued use of
          the Platform after changes constitutes acceptance of the updated policy.
        </Section>

        <Section title="13. Contact Us">
          If you have questions or concerns about this Privacy Policy, please contact us:
          <br /><br />
          <strong>LDNA Consulting / AthaVid</strong><br />
          New Providence, NJ 07974<br />
          Email: <a href="mailto:lasanjaya@gmail.com" style={{ color: "#ff6b6b" }}>lasanjaya@gmail.com</a><br />
          Website: <a href="https://athavid-vercel.vercel.app" style={{ color: "#ff6b6b" }}>athavid-vercel.vercel.app</a>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{
        fontSize: 17,
        fontWeight: 700,
        color: "#ff6b6b",
        margin: "0 0 12px",
        paddingBottom: 8,
        borderBottom: "1px solid #ffffff10"
      }}>{title}</h2>
      <div style={{ color: "#ccc", fontSize: 14, lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}
