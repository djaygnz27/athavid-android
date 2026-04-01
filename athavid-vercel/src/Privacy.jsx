export default function Privacy() {
  return (
    <div style={{ background:"#0f0f1a", minHeight:"100vh", padding:"32px 20px", color:"#ddd", fontFamily:"sans-serif", maxWidth:700, margin:"0 auto" }}>
      <div style={{ color:"#ff6b6b", fontSize:28, fontWeight:900, marginBottom:4 }}>🔒 Privacy Policy</div>
      <div style={{ color:"#888", fontSize:13, marginBottom:28 }}>Last updated: April 1, 2026</div>

      <p style={{ color:"#aaa", fontSize:14, lineHeight:1.8, marginBottom:20 }}>
        This Privacy Policy explains how <strong style={{color:"#fff"}}>LDNA Consulting</strong> ("we", "us", "our") collects, uses, and protects your personal information when you use <strong style={{color:"#fff"}}>Sachi</strong>.
      </p>

      {[
        { title: "1. Information We Collect", body: "We collect information you provide when creating an account (name, email address, password), content you upload (videos, photos, captions), and usage data (device type, IP address, pages visited, interactions within the app)." },
        { title: "2. How We Use Your Information", body: "We use your information to: operate and improve the Sachi platform, authenticate your identity and secure your account, display your content to other users, send account-related notifications (e.g. email verification, password reset), and comply with legal obligations." },
        { title: "3. Data Sharing", body: "We do not sell your personal information to third parties. We may share data with trusted service providers who help us operate the platform (e.g. cloud storage, email delivery), only to the extent necessary. We may disclose information if required by law or to protect the rights, property, or safety of our users." },
        { title: "4. Cookies & Tracking", body: "Sachi uses local browser storage (localStorage) to maintain your login session. We do not use third-party advertising cookies. Basic analytics may be used to understand how the app is used, without identifying individual users." },
        { title: "5. Data Retention", body: "We retain your account data and content for as long as your account is active. If you delete your account, we will remove your personal information from our systems within 30 days, except where retention is required by law." },
        { title: "6. Your Rights", body: "You have the right to access, update, or delete your personal information at any time. You can update your profile within the app or contact us directly to request deletion of your account and data." },
        { title: "7. Children's Privacy", body: "Sachi is strictly intended for users aged 18 and older. We do not knowingly collect personal information from anyone under 18. If we discover that a user is under 18, their account will be terminated immediately." },
        { title: "8. Security", body: "We take reasonable technical and organizational measures to protect your data against unauthorized access, loss, or misuse. However, no online platform can guarantee absolute security." },
        { title: "9. Changes to This Policy", body: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice in the app or via email. Continued use of Sachi after changes are posted means you accept the updated policy." },
        { title: "10. Contact Us", body: "If you have questions or concerns about this Privacy Policy, please contact us at: jaygnz27@gmail.com — LDNA Consulting, New Providence, NJ 07974" },
      ].map(({ title, body }) => (
        <div key={title} style={{ marginBottom:22 }}>
          <div style={{ color:"#ff8e53", fontWeight:800, fontSize:15, marginBottom:6 }}>{title}</div>
          <p style={{ color:"#bbb", fontSize:14, lineHeight:1.8, margin:0 }}>{body}</p>
        </div>
      ))}

      <div style={{ marginTop:32, paddingTop:20, borderTop:"1px solid rgba(255,255,255,0.1)", textAlign:"center" }}>
        <a href="/" style={{ color:"#ff6b6b", fontSize:14, textDecoration:"none" }}>← Back to Sachi</a>
      </div>
    </div>
  );
}
