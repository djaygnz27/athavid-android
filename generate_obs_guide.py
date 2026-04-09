from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# Colors
GOLD = HexColor("#F5C842")
NAVY = HexColor("#0B0C1A")
DARK_NAVY = HexColor("#070810")
LIGHT_NAVY = HexColor("#12142A")
CORAL = HexColor("#FF6B6B")
LIGHT_GRAY = HexColor("#EEEEEE")
MID_GRAY = HexColor("#666680")
WHITE = white

doc = SimpleDocTemplate(
    "/app/Sachi_OBS_Setup_Guide.pdf",
    pagesize=letter,
    rightMargin=0.65*inch,
    leftMargin=0.65*inch,
    topMargin=0.65*inch,
    bottomMargin=0.55*inch
)

# ── STYLES ──────────────────────────────────────────────────────────────────────
title_style      = ParagraphStyle('Title',    fontName='Helvetica-Bold',    fontSize=26, textColor=GOLD,                 alignment=TA_CENTER, spaceAfter=2)
subtitle_style   = ParagraphStyle('Subtitle', fontName='Helvetica',         fontSize=12, textColor=WHITE,                alignment=TA_CENTER, spaceAfter=0)
tagline_style    = ParagraphStyle('Tagline',  fontName='Helvetica-Oblique', fontSize=9,  textColor=HexColor("#AAAACC"),  alignment=TA_CENTER)
section_style    = ParagraphStyle('Section',  fontName='Helvetica-Bold',    fontSize=13, textColor=GOLD, spaceBefore=12, spaceAfter=5)
step_num_style   = ParagraphStyle('StepNum',  fontName='Helvetica-Bold',    fontSize=20, textColor=NAVY,                 alignment=TA_CENTER)
step_title_style = ParagraphStyle('StepTitle',fontName='Helvetica-Bold',    fontSize=12, textColor=WHITE)
bullet_style     = ParagraphStyle('Bullet',   fontName='Helvetica',         fontSize=10, textColor=HexColor("#111122"),  leading=15, leftIndent=14, spaceAfter=3)
code_style       = ParagraphStyle('Code',     fontName='Courier-Bold',      fontSize=9,  textColor=NAVY,                 backColor=LIGHT_GRAY, leftIndent=10, leading=13)
tip_style        = ParagraphStyle('Tip',      fontName='Helvetica-Oblique', fontSize=9,  textColor=HexColor("#2A4A1A"),  leading=13)
success_style    = ParagraphStyle('Success',  fontName='Helvetica-Oblique', fontSize=9,  textColor=HexColor("#1A3A4A"),  leading=13)
footer_style     = ParagraphStyle('Footer',   fontName='Helvetica',         fontSize=8,  textColor=HexColor("#AAAACC"),  alignment=TA_CENTER)

story = []

# ── TITLE BANNER ───────────────────────────────────────────────────────────────
banner = Table([
    [Paragraph("🌸  SACHI STREAM", title_style)],
    [Paragraph("Live Podcast Setup Guide for Hosts", subtitle_style)],
    [Spacer(1, 4)],
    [Paragraph("Stream directly to your Sachi audience using OBS Studio", tagline_style)],
    [Spacer(1, 6)],
], colWidths=[7.2*inch])
banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), NAVY),
    ('TOPPADDING',    (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING',   (0,0), (-1,-1), 16),
    ('RIGHTPADDING',  (0,0), (-1,-1), 16),
    ('ROUNDEDCORNERS', [10]),
]))
story.append(banner)
story.append(Spacer(1, 14))

# ── WHAT YOU NEED ─────────────────────────────────────────────────────────────
story.append(Paragraph("What You'll Need", section_style))
req_rows = [
    ["✅", "OBS Studio installed (free — obsproject.com)"],
    ["✅", "Your Sachi Podcast Host Dashboard open (sachistream.com/podcast-host)"],
    ["✅", "Your RTMP Stream Key from the dashboard (unique to your show)"],
    ["✅", "A webcam or microphone (built-in works fine to start)"],
]
req_table = Table(req_rows, colWidths=[0.35*inch, 6.85*inch])
req_table.setStyle(TableStyle([
    ('FONTNAME',  (0,0), (0,-1), 'Helvetica-Bold'),
    ('FONTNAME',  (1,0), (1,-1), 'Helvetica'),
    ('FONTSIZE',  (0,0), (-1,-1), 10),
    ('TEXTCOLOR', (0,0), (-1,-1), HexColor("#111122")),
    ('ROWBACKGROUNDS', (0,0), (-1,-1), [WHITE, LIGHT_GRAY]),
    ('TOPPADDING',    (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING',   (0,0), (-1,-1), 8),
    ('RIGHTPADDING',  (0,0), (-1,-1), 8),
    ('BOX',  (0,0), (-1,-1), 0.5, HexColor("#CCCCDD")),
    ('GRID', (0,0), (-1,-1), 0.5, HexColor("#CCCCDD")),
]))
story.append(req_table)
story.append(Spacer(1, 14))

# ── STEPS ─────────────────────────────────────────────────────────────────────
steps = [
    {
        "num": "1",
        "title": "Download & Install OBS Studio",
        "bullets": [
            "Go to obsproject.com in your browser",
            "Click Download and choose your OS (Windows / Mac / Linux)",
            "Run the installer — all default settings are fine",
            "Open OBS Studio once installation completes",
        ],
        "tip": "💡 OBS is completely free and open-source. No account needed.",
        "tip_type": "normal"
    },
    {
        "num": "2",
        "title": "Run the Auto-Configuration Wizard",
        "bullets": [
            "When OBS opens for the first time, click 'Auto-Configuration Wizard'",
            "Select: Optimize for streaming, click Next",
            "Set Video Base Resolution to 1920×1080 (or leave as detected)",
            "Click Next → Apply Settings",
        ],
        "tip": "💡 If the wizard doesn't appear, go to Tools → Auto-Configuration Wizard.",
        "tip_type": "normal"
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
        "tip": "💡 Your stream key is permanent. You only need to do this once unless you reset it.",
        "tip_type": "normal"
    },
    {
        "num": "4",
        "title": "Configure OBS Stream Settings",
        "bullets": [
            "In OBS, click Settings (gear icon, bottom right)",
            "Click Stream in the left sidebar",
            "Set Service to: Custom...",
            "In the Server field, paste this URL exactly:",
        ],
        "code": "rtmps://live.cloudflare.com:443/live/",
        "bullets2": [
            "In the Stream Key field, paste your key copied from Step 3",
            "Click Apply, then OK",
        ],
        "tip": "💡 Make sure there are no extra spaces before or after the server URL.",
        "tip_type": "normal"
    },
    {
        "num": "5",
        "title": "Set Up Your Audio & Video Sources",
        "bullets": [
            "In the main OBS window, look at the Sources panel (bottom left)",
            "Click the + button to add sources:",
            "    → Video Capture Device  =  your webcam",
            "    → Audio Input Capture   =  your microphone",
            "    → Display Capture       =  your screen (optional)",
            "Drag sources to resize them in the preview window",
        ],
        "tip": "💡 Check audio levels in the Mixer panel — the green bar should move when you speak.",
        "tip_type": "normal"
    },
    {
        "num": "6",
        "title": "Go Live on Sachi  🎉",
        "bullets": [
            "In OBS, click Start Streaming (blue button, bottom right)",
            "Wait 5–10 seconds for Cloudflare to pick up the signal",
            "Switch to your Sachi podcast-host dashboard",
            "Toggle the Go Live switch ON for your show",
            "Your listeners will now see your stream live in Sachi!",
        ],
        "tip": "✅ Always start OBS streaming BEFORE toggling Go Live on Sachi.",
        "tip_type": "success"
    },
    {
        "num": "7",
        "title": "Ending Your Stream",
        "bullets": [
            "When you're done, toggle Go Live OFF on your Sachi dashboard first",
            "Then click Stop Streaming in OBS",
            "Cloudflare automatically saves your stream as a recorded episode",
            "The recording will appear in your podcast episode list within minutes",
        ],
        "tip": "💡 Always stop in this order: Sachi OFF first, then OBS. This ensures a clean recording.",
        "tip_type": "normal"
    },
]

for step in steps:
    # Header row: gold number cell + navy title cell
    num_para   = Paragraph(step["num"], step_num_style)
    title_para = Paragraph(step["title"], step_title_style)

    hdr = Table([[num_para, title_para]], colWidths=[0.55*inch, 6.65*inch])
    hdr.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (0,0), GOLD),
        ('BACKGROUND',    (1,0), (1,0), NAVY),
        ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',    (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING',   (0,0), (0,0), 6),
        ('RIGHTPADDING',  (0,0), (0,0), 6),
        ('LEFTPADDING',   (1,0), (1,0), 12),
        ('RIGHTPADDING',  (1,0), (1,0), 10),
    ]))

    # Body rows
    body_items = []
    for b in step["bullets"]:
        body_items.append(Paragraph(f"• {b}", bullet_style))

    if step.get("code"):
        body_items.append(Spacer(1, 4))
        body_items.append(Paragraph(step["code"], code_style))
        body_items.append(Spacer(1, 4))

    if step.get("bullets2"):
        for b in step["bullets2"]:
            body_items.append(Paragraph(f"• {b}", bullet_style))

    if step.get("tip"):
        bg = HexColor("#E8F5E9") if step["tip_type"] == "success" else HexColor("#FFFBEA")
        tip_table = Table(
            [[Paragraph(step["tip"], tip_style if step["tip_type"] != "success" else success_style)]],
            colWidths=[6.7*inch]
        )
        tip_table.setStyle(TableStyle([
            ('BACKGROUND',    (0,0), (-1,-1), bg),
            ('TOPPADDING',    (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING',   (0,0), (-1,-1), 10),
            ('RIGHTPADDING',  (0,0), (-1,-1), 10),
            ('ROUNDEDCORNERS', [4]),
        ]))
        body_items.append(Spacer(1, 4))
        body_items.append(tip_table)

    body_rows = [[item] for item in body_items]
    body_tbl = Table(body_rows, colWidths=[7.2*inch])
    body_tbl.setStyle(TableStyle([
        ('TOPPADDING',    (0,0), (-1,-1), 1),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
        ('BACKGROUND',    (0,0), (-1,-1), WHITE),
    ]))

    card = Table([[hdr], [body_tbl]], colWidths=[7.2*inch])
    card.setStyle(TableStyle([
        ('BOX',           (0,0), (-1,-1), 0.75, HexColor("#CCCCDD")),
        ('TOPPADDING',    (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,1), (-1,-1), 8),
        ('LEFTPADDING',   (0,0), (-1,-1), 0),
        ('RIGHTPADDING',  (0,0), (-1,-1), 0),
    ]))

    story.append(KeepTogether([card]))
    story.append(Spacer(1, 9))

# ── TROUBLESHOOTING ───────────────────────────────────────────────────────────
story.append(Paragraph("Quick Troubleshooting", section_style))
t_rows = [
    ["Problem", "Solution"],
    ["Stream won't connect",       "Double-check the RTMP URL:\nrtmps://live.cloudflare.com:443/live/"],
    ["No audio for listeners",     "Check OBS Mixer — mic bar should go green when you speak"],
    ["Sachi player shows nothing", "Wait 10–15 sec after starting OBS before toggling Go Live"],
    ["Stream is choppy/buffering", "Lower bitrate: OBS Settings → Output → Video Bitrate → 2500 Kbps"],
    ["Lost your stream key",       "Go to sachistream.com/podcast-host and click Get Stream Key again"],
]
t_table = Table(t_rows, colWidths=[2.1*inch, 5.1*inch])
t_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), NAVY),
    ('TEXTCOLOR',  (0,0), (-1,0), GOLD),
    ('FONTNAME',   (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTNAME',   (0,1), (0,-1), 'Helvetica-Bold'),
    ('FONTNAME',   (1,1), (1,-1), 'Helvetica'),
    ('FONTSIZE',   (0,0), (-1,-1), 9),
    ('TEXTCOLOR',  (0,1), (-1,-1), HexColor("#111122")),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GRAY]),
    ('TOPPADDING',    (0,0), (-1,-1), 7),
    ('BOTTOMPADDING', (0,0), (-1,-1), 7),
    ('LEFTPADDING',   (0,0), (-1,-1), 10),
    ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ('GRID', (0,0), (-1,-1), 0.5, HexColor("#CCCCDD")),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t_table)
story.append(Spacer(1, 14))

# ── FOOTER ────────────────────────────────────────────────────────────────────
footer = Table(
    [[Paragraph("Need help? Visit sachistream.com  |  © 2026 Sachi Stream™  —  Sachi means Truth", footer_style)]],
    colWidths=[7.2*inch]
)
footer.setStyle(TableStyle([
    ('BACKGROUND',    (0,0), (-1,-1), NAVY),
    ('TOPPADDING',    (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ('ROUNDEDCORNERS', [6]),
]))
story.append(footer)

doc.build(story)
print("PDF generated!")
