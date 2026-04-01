export default function Terms() {
  return (
    <div style={{ background:"#0f0f1a", minHeight:"100vh", padding:"32px 20px", color:"#ddd", fontFamily:"sans-serif", maxWidth:700, margin:"0 auto" }}>
      <div style={{ color:"#ff6b6b", fontSize:28, fontWeight:900, marginBottom:4 }}>📋 Terms of Service</div>
      <div style={{ color:"#888", fontSize:13, marginBottom:28 }}>Last updated: April 1, 2026</div>

      <p style={{ color:"#aaa", fontSize:14, lineHeight:1.8, marginBottom:20 }}>
        Welcome to <strong style={{color:"#fff"}}>Sachi</strong>, a short-video sharing platform operated by <strong style={{color:"#fff"}}>LDNA Consulting, New Providence, NJ 07974</strong>. By creating an account or using Sachi, you agree to these Terms of Service. Please read them carefully.
      </p>

      {[
        { title: "1. Eligibility", body: "You must be at least 18 years old to create an account and use Sachi. By registering, you confirm that you are 18 or older. We reserve the right to terminate accounts of users found to be under 18." },
        { title: "2. User Accounts", body: "You are responsible for maintaining the confidentiality of your login credentials. You agree to provide accurate information when registering and to update it as needed. You are fully responsible for all activity that occurs under your account." },
        { title: "3. Content You Post", body: "You retain ownership of the content you upload. However, by posting on Sachi, you grant LDNA Consulting a non-exclusive, royalty-free, worldwide license to display, distribute, and promote your content within the platform. You are solely responsible for everything you post. You must not post content that is illegal, harassing, defamatory, or infringes on any third party's rights." },
        { title: "4. Prohibited Content", body: "The following content is strictly prohibited: content involving minors in any sexual context, content that promotes violence or terrorism, content that infringes copyrights or trademarks, spam or misleading information, and any content that violates applicable law." },
        { title: "5. Content Moderation", body: "We reserve the right — but not the obligation — to review, remove, or restrict any content or account that we determine, in our sole discretion, violates these Terms or is harmful to our community." },
        { title: "6. Intellectual Property", body: "The Sachi name, logo, and platform design are the property of LDNA Consulting. You may not copy, reproduce, or use them without prior written permission." },
        { title: "7. Disclaimers", body: "Sachi is provided 'as is' without warranties of any kind. We do not guarantee uninterrupted service or that the platform will be error-free. We are not liable for any user-generated content." },
        { title: "8. Limitation of Liability", body: "To the maximum extent permitted by law, LDNA Consulting shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of Sachi." },
        { title: "9. Termination", body: "We may suspend or terminate your account at any time for violations of these Terms, without prior notice. You may also delete your account at any time." },
        { title: "10. Changes to Terms", body: "We may update these Terms from time to time. Continued use of Sachi after changes are posted constitutes your acceptance of the updated Terms." },
        { title: "11. Governing Law", body: "These Terms are governed by the laws of the State of New Jersey, United States, without regard to its conflict of law provisions." },
        { title: "12. Contact", body: "For questions about these Terms, contact us at: jaygnz27@gmail.com" },
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
