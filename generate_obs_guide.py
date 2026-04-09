from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# Colors
GOLD = HexColor("#F5C842")
NAVY = HexColor("#0B0C1A")
DARK_NAVY = HexColor("#070810")
LIGHT_NAVY = HexColor("#12142A")
CORAL = HexColor("#FF6B6B")
LIGHT_GRAY = HexColor("#E8E8F0")
MID_GRAY = HexColor("#666680")
WHITE = white

doc = SimpleDocTemplate(
    "/app/Sachi_OBS_Setup_Guide.pdf",
    pagesize=letter,
    rightMargin=0.6*inch,
    leftMargin=0.6*inch,
    topMargin=0.5*inch,
    bottomMargin=0.5*inch
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=28, textColor=GOLD, alignment=TA_CENTER, spaceAfter=4)
subtitle_style = ParagraphStyle('Subtitle', fontName='Helvetica', fontSize=13, textColor=WHITE, alignment=TA_CENTER, spaceAfter=2)
tagline_style = ParagraphStyle('Tagline', fontName='Helvetica-Oblique', fontSize=10, textColor=HexColor("#AAAACC"), alignment=TA_CENTER, spaceAfter=16)
section_header_style = ParagraphStyle('SectionHeader', fontName='Helvetica-Bold', fontSize=14, textColor=GOLD, spaceBefore=14, spaceAfter=6)
step_num_style = ParagraphStyle('StepNum', fontName='Helvetica-Bold', fontSize=22, textColor=GOLD, alignment=TA_CENTER)
step_title_style = ParagraphStyle('StepTitle', fontName='Helvetica-Bold', fontSize=13, textColor=NAVY)
body_style = ParagraphStyle('Body', fontName='Helvetica', fontSize=10, textColor=HexColor("#1A1A2E"), leading=15, spaceAfter=4)
bullet_style = ParagraphStyle('Bullet', fontName='Helvetica', fontSize=10, textColor=HexColor("#1A1A2E"), leading=14, leftIndent=16, spaceAfter=3, bulletIndent=4)
note_style = ParagraphStyle('Note', fontName='Helvetica-Oblique', fontSize=9, textColor=MID_GRAY, leading=13)
code_style = ParagraphStyle('Code', fontName='Courier-Bold', fontSize=9, textColor=NAVY, backColor=LIGHT_GRAY, leftIndent=10, rightIndent=10, leading=13, spaceAfter=2)
tip_style = ParagraphStyle('Tip', fontName='Helvetica', fontSize=9, textColor=HexColor("#1A4A1A"), leading=13)
warning_style = ParagraphStyle('Warning', fontName='Helvetica', fontSize=9, textColor=HexColor("#4A1A1A"), leading=13)

story = []

# ── HEADER BANNER ──────────────────────────────────────────────────────────────
header_data = [[
    Paragraph("🌸 SACHI STREAM", title_style),
]]
header_table = Table(header_data, colWidths=[7.3*inch])
header_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), NAVY),
    ('TOPPADDING', (0,0), (-1,-1), 18),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 12),
    ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ('ROUNDEDCORNERS', [8]),
]))
story.append(header_table)

sub_data = [[
    Paragraph("Live Podcast Setup Guide for Hosts", subtitle_style),
    Paragraph("OBS Studio → Cloudflare Stream → Sachi", tagline_style),
]]
sub_table = Table([[Paragraph("Live Podcast Setup Guide for Hosts", subtitle_style)],
                   [Paragraph("Stream directly to your Sachi audience using OBS Studio", tagline_style)]], colWidths=[7.3*inch])
sub_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), LIGHT_NAVY),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ('LEFTPADDING', (0,0), (-1,-1), 12),
    ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ('ROUNDEDCORNERS', [8]),
]))
story.append(sub_table)
story.append(Spacer(1, 12))

# ── WHAT YOU NEED ──────────────────────────────────────────────────────────────
story.append(Paragraph("What You'll Need", section_header_style))
req_data = [
    ["✅", "OBS Studio installed (free — obsproject.com)"],
    ["✅", "Your Sachi Podcast Host Dashboard open (sachistream.com/podcast-host)"],
    ["✅", "Your RTMP Stream Key (from the dashboard — unique to your show)"],
    ["✅", "A webcam or microphone (built-in works fine to start)"],
]
req_table = Table(req_data, colWidths=[0.35*inch, 6.95*inch])
req_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), LIGHT_GRAY),
    ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
    ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 10),
    ('TEXTCOLOR', (0,0), (-1,-1), HexColor("#1A1A2E")),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ('ROWBACKGROUNDS', (0,0), (-1,-1), [WHITE, LIGHT_GRAY]),
    ('ROUNDEDCORNERS', [6]),
]))
story.append(req_table)
story.append(Spacer(1, 14))

# ── STEPS ──────────────────────────────────────────────────────────────────────
steps = [
    {
        "num": "1",
        "title": "Download & Install OBS Studio",
        "bullets": [
            "Go to obsproject.com in your browser",
            "Click Download and choose your OS (Windows / Mac / Linux)",
            "Run the installer — all default settings are fine",
            "Open OBS Studio when installation completes",
        ],
        "note": "OBS is completely free and open-source. No account needed.",
        "type": "normal"
    },
    {
        "num": "2",
        "title": "Run the Auto-Configuration Wizard",
        "bullets": [
            "When OBS opens for the first time, it'll offer an 'Auto-Configuration Wizard'",
            "Select: Optimize for streaming, click Next",
            "Set Video Base Resolution to 1920×1080 (or leave as detected)",
            "Click Next → Apply Settings",
        ],
        "note": "If the wizard doesn't appear, go to Tools → Auto-Configuration Wizard.",
        "type": "normal"
    },
    {
        "num": "3",
        "title": "Get Your Stream Key from Sachi",
        "bullets": [
            "Open sachistream.com/podcast-host in your browser",
            "Log in with your Google account",
            "Find your podcast show and click 'Get Stream Key'",
            "Copy the Stream Key shown — keep it private, like a password",
        ],
        "note": "Your stream key is permanent. You only need to do this once unless you reset it.",
        "type": "normal"
    },
    {
        "num": "4",
        "title": "Configure OBS Stream Settings",
        "bullets": [
            "In OBS, click Settings (bottom right gear icon)",
            "Click Stream in the left sidebar",
            "Set Service to: Custom...",
            "In the Server field, paste exactly:",
        ],
        "code": "rtmps://live.cloudflare.com:443/live/",
        "bullets2": [
            "In the Stream Key field, paste your key from Step 3",
            "Click Apply, then OK",
        ],
        "note": "Make sure there are no extra spaces before or after the server URL.",
        "type": "code"
    },
    {
        "num": "5",
        "title": "Set Up Your Audio & Video Sources",
        "bullets": [
            "In the main OBS window, look at the Sources panel (bottom left)",
            "Click the + button to add sources:",
            "  → Video Capture Device = your webcam",
            "  → Audio Input Capture = your microphone",
            "  → Display Capture = your screen (optional)",
            "Drag sources to resize them in the preview window",
        ],
        "note": "Check your audio levels in the Mixer panel — the green bar should move when you speak.",
        "type": "normal"
    },
    {
        "num": "6",
        "title": "Go Live on Sachi",
        "bullets": [
            "In OBS, click Start Streaming (bottom right blue button)",
            "Wait 5–10 seconds for Cloudflare to pick up the signal",
            "Switch to your Sachi podcast-host dashboard",
            "Toggle the Go Live switch ON for your show",
            "Your listeners will now see your stream live in Sachi! 🎉",
        ],
        "note": "Always start OBS streaming BEFORE toggling Go Live on Sachi.",
        "type": "success"
    },
    {
        "num": "7",
        "title": "Ending Your Stream",
        "bullets": [
            "When you're done, toggle Go Live OFF on your Sachi dashboard",
            "Then click Stop Streaming in OBS",
            "Cloudflare automatically saves your stream as a recorded episode",
            "The recording will appear in your podcast episode list within minutes",
        ],
        "note": "Always stop in this order: Sachi first, then OBS. This ensures a clean recording.",
        "type": "normal"
    },
]

for i, step in enumerate(steps):
    # Step card
    step_content = []
    
    # Step number + title row
    num_cell = Paragraph(step["num"], step_num_style)
    title_cell = Paragraph(step["title"], step_title_style)
    
    header_row = Table([[num_cell, title_cell]], colWidths=[0.5*inch, 6.2*inch])
    header_row.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (0,0), GOLD),
        ('BACKGROUND', (1,0), (1,0), NAVY),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('ROUNDEDCORNERS', [6]),
    ]))
    
    body_rows = []
    for bullet in step["bullets"]:
        body_rows.append(Paragraph(f"• {bullet}", bullet_style))
    
    if step.get("code"):
        body_rows.append(Spacer(1, 4))
        body_rows.append(Paragraph(step["code"], code_style))
        body_rows.append(Spacer(1, 4))
    
    if step.get("bullets2"):
        for bullet in step["bullets2"]:
            body_rows.append(Paragraph(f"• {bullet}", bullet_style))
    
    if step.get("note"):
        note_bg = HexColor("#FFF9E6") if step["type"] != "success" else HexColor("#E6F9EC")
        note_prefix = "💡 Tip: " if step["type"] != "success" else "✅ "
        body_rows.append(Spacer(1, 4))
        note_table = Table([[Paragraph(f"{note_prefix}{step['note']}", tip_style if step['type'] != 'success' else tip_style)]], colWidths=[6.7*inch])
        note_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), note_bg),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('ROUNDEDCORNERS', [4]),
        ]))
        body_rows.append(note_table)
    
    body_cell = [b for b in body_rows]
    
    # Combine header + body in one styled card
    card_inner = []
    card_inner.append(header_row)
    card_inner.append(Spacer(1, 0))
    
    body_table = Table([[b] for b in body_rows], colWidths=[6.7*inch])
    body_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), WHITE),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    
    outer = Table([
        [header_row],
        [body_table],
    ], colWidths=[7.3*inch])
    outer.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, HexColor("#CCCCDD")),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('ROUNDEDCORNERS', [8]),
    ]))
    
    story.append(KeepTogether([outer]))
    story.append(Spacer(1, 10))

# ── TROUBLESHOOTING ─────────────────────────────────────────────────────────────
story.append(Paragraph("Quick Troubleshooting", section_header_style))
trouble_data = [
    ["Problem", "Solution"],
    ["Stream won't connect", "Double-check the RTMP URL — must be exactly: rtmps://live.cloudflare.com:443/live/"],
    ["No audio for listeners", "Check OBS Mixer — mic should show green bars when you speak"],
    ["Sachi player shows nothing", "Wait 10–15 sec after starting OBS before toggling Go Live"],
    ["Stream is choppy", "Lower Video Bitrate in OBS Settings → Output to 2500 Kbps"],
    ["Lost your stream key", "Go to sachistream.com/podcast-host and click Get Stream Key again"],
]
trouble_table = Table(trouble_data, colWidths=[2.2*inch, 5.1*inch])
trouble_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('TEXTCOLOR', (0,0), (-1,0), GOLD),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
    ('FONTNAME', (1,1), (1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('TEXTCOLOR', (0,1), (-1,-1), HexColor("#1A1A2E")),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GRAY]),
    ('TOPPADDING', (0,0), (-1,-1), 7),
    ('BOTTOMPADDING', (0,0), (-1,-1), 7),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ('GRID', (0,0), (-1,-1), 0.5, HexColor("#CCCCDD")),
    ('ROUNDEDCORNERS', [6]),
]))
story.append(trouble_table)
story.append(Spacer(1, 14))

# ── FOOTER ──────────────────────────────────────────────────────────────────────
footer_data = [[
    Paragraph("Need help? Contact the Sachi team at sachistream.com  |  © 2026 Sachi Stream™ — Sachi means Truth", 
              ParagraphStyle('Footer', fontName='Helvetica', fontSize=8, textColor=HexColor("#AAAACC"), alignment=TA_CENTER))
]]
footer_table = Table(footer_data, colWidths=[7.3*inch])
footer_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), NAVY),
    ('TOPPADDING', (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ('ROUNDEDCORNERS', [6]),
]))
story.append(footer_table)

doc.build(story)
print("PDF generated successfully!")
