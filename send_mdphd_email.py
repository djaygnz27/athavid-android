import os, base64, json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import urllib.request, urllib.error

token = os.environ["GMAIL_ACCESS_TOKEN"]

# Build email
msg = MIMEMultipart()
msg["To"] = "jaygnz27@gmail.com"
msg["From"] = "me"
msg["Subject"] = "MD-PhD Application Master Guide — Your Son's Roadmap to Top Programs"

body = """Hi Jay,

Attached is the complete MD-PhD Application Master Guide I put together for your son.

Here's what's inside (3 pages, landscape):

📋 PAGE 1 — PREPARATION CHECKLIST
Everything he needs to do NOW through May 2026 — MCAT, research experience, essays, letters of rec, transcripts — with priority levels and deadlines.

🏫 PAGE 2 — 21 SCHOOLS SIDE BY SIDE
Hopkins, Harvard/MIT, Yale, Columbia, Weill Cornell, Penn, NYU, Duke, UNC, Mt. Sinai, Pitt, UVA, Emory, BU, Georgetown, UMaryland, UW, UCSF, UChicago, NIH GPP — every school with:
  • AMCAS deadline
  • Secondary deadline
  • Interview dates
  • Rolling vs. Batch admissions
  • NIH funding status
  • Class size

🎯 PAGE 3 — INTERVIEW GUIDE + 90-DAY ACTION PLAN
What a 2-day MD-PhD interview looks like, rolling vs batch admissions explained, full benefits (free tuition + ~$35K/yr stipend), and a step-by-step action plan starting today.

THE MOST IMPORTANT THING: Submit AMCAS on Day 1 when it opens in May 2026. That single action determines everything downstream for rolling admissions schools.

Let me know if you have any questions or want me to tailor the school list based on your son's specific stats and research background!

— Sachi
"""

msg.attach(MIMEText(body, "plain"))

# Attach PDF
with open("/app/MDPHD_Application_Guide.pdf", "rb") as f:
    pdf_data = f.read()
attachment = MIMEApplication(pdf_data, _subtype="pdf")
attachment.add_header("Content-Disposition", "attachment", filename="MDPHD_Application_Guide_2026.pdf")
msg.attach(attachment)

raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()

payload = json.dumps({"raw": raw}).encode()
req = urllib.request.Request(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    data=payload,
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    method="POST"
)
try:
    resp = urllib.request.urlopen(req)
    print("Sent!", resp.status)
except urllib.error.HTTPError as e:
    print("Error:", e.code, e.read().decode())
