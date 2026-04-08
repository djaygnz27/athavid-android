import React from 'react';

export default function ChildSafety() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#333', lineHeight: '1.7' }}>
      <h1 style={{ color: '#1a1a2e', borderBottom: '3px solid #F5C842', paddingBottom: '10px' }}>
        Child Safety Standards
      </h1>
      <p><strong>Last updated: April 8, 2026</strong></p>
      <p>Sachi, operated by <strong>LDNA Consulting</strong>, is committed to maintaining a safe platform and actively combating child sexual abuse and exploitation (CSAE).</p>

      <h2>1. Prohibited Content</h2>
      <p>Sachi strictly prohibits any content that sexually exploits minors, including child sexual abuse material (CSAM). Any such content is immediately removed and reported to the National Center for Missing & Exploited Children (NCMEC) and relevant law enforcement authorities.</p>

      <h2>2. Age Restrictions</h2>
      <p>Sachi is intended for users aged 18 and older. Users must confirm their age during registration. Accounts found to belong to minors are immediately suspended.</p>

      <h2>3. Content Moderation</h2>
      <p>Sachi employs both automated AI-based content detection and human moderation to identify and remove harmful content, including CSAM. Our moderation team reviews flagged content promptly.</p>

      <h2>4. Reporting Mechanism</h2>
      <p>Users can report any content they believe violates our child safety standards using the in-app report feature. Reports are reviewed within 24 hours.</p>
      <p>You may also report directly to: <a href="mailto:safety@sachistream.com">safety@sachistream.com</a></p>

      <h2>5. CSAM Reporting</h2>
      <p>Any discovered CSAM is immediately reported to the <a href="https://www.missingkids.org/gethelpnow/cybertipline" target="_blank" rel="noopener noreferrer">NCMEC CyberTipline</a> and cooperating law enforcement agencies. We maintain a zero-tolerance policy.</p>

      <h2>6. Designated Safety Contact</h2>
      <p><strong>Email:</strong> <a href="mailto:jaygnz27@gmail.com">jaygnz27@gmail.com</a><br /><strong>Organization:</strong> LDNA Consulting</p>

      <h2>7. Compliance</h2>
      <p>Sachi complies with the PROTECT Our Children Act, COPPA, and all applicable federal and state laws regarding child safety online.</p>

      <p style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        © 2026 LDNA Consulting. | <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
      </p>
    </div>
  );
}
