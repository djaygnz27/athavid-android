from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# Colors
PURPLE = colors.HexColor('#7B2FBE')
GOLD = colors.HexColor('#F5C842')
BLACK = colors.HexColor('#000000')
DARK_GREY = colors.HexColor('#1A1A1A')
LIGHT_GREY = colors.HexColor('#F5F5F5')
WHITE = colors.white

doc = SimpleDocTemplate(
    "/app/Sachi_Stream_TShirt_PrintSpec.pdf",
    pagesize=A4,
    rightMargin=2*cm,
    leftMargin=2*cm,
    topMargin=2*cm,
    bottomMargin=2*cm
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle('Title', fontSize=22, textColor=WHITE, alignment=TA_CENTER,
    fontName='Helvetica-Bold', spaceAfter=4, backColor=BLACK, leading=28)
subtitle_style = ParagraphStyle('Subtitle', fontSize=10, textColor=GOLD, alignment=TA_CENTER,
    fontName='Helvetica', spaceAfter=2, backColor=BLACK)
section_style = ParagraphStyle('Section', fontSize=12, textColor=WHITE, fontName='Helvetica-Bold',
    spaceBefore=10, spaceAfter=4, backColor=PURPLE, leftIndent=6, leading=18)
body_style = ParagraphStyle('Body', fontSize=9, textColor=DARK_GREY, fontName='Helvetica',
    spaceAfter=3, leading=14)
note_style = ParagraphStyle('Note', fontSize=8, textColor=colors.HexColor('#CC0000'),
    fontName='Helvetica-Oblique', spaceAfter=3, leading=12)

def section_header(text):
    return Table([[Paragraph(f"  {text}", ParagraphStyle('SH', fontSize=11, textColor=WHITE,
        fontName='Helvetica-Bold', leading=16))]],
        colWidths=[17*cm],
        style=TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), PURPLE),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
        ])
    )

def data_table(headers, rows, col_widths):
    data = [headers] + rows
    style = TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK_GREY),
        ('TEXTCOLOR', (0,0), (-1,0), GOLD),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 9),
        ('TEXTCOLOR', (0,1), (-1,-1), DARK_GREY),
        ('BACKGROUND', (0,1), (-1,-1), WHITE),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GREY]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ])
    return Table(data, colWidths=col_widths, style=style)

elements = []

# ── HEADER BLOCK ──────────────────────────────────────────────
header_data = [[
    Paragraph("<font color='#7B2FBE'><b>SACHi</b></font><font color='#F5C842'><b>i</b></font> <font color='white'>STREAM</font>", 
        ParagraphStyle('H', fontSize=24, fontName='Helvetica-Bold', textColor=WHITE, alignment=TA_CENTER)),
    Paragraph("T-SHIRT PRINT SPECIFICATION SHEET", 
        ParagraphStyle('H2', fontSize=11, fontName='Helvetica-Bold', textColor=GOLD, alignment=TA_CENTER, leading=16)),
    Paragraph("LDNA Consulting LLC &nbsp;|&nbsp; jaygnz27@gmail.com &nbsp;|&nbsp; 908-255-2195<br/>sachistream.com &nbsp;|&nbsp; May 17, 2026",
        ParagraphStyle('H3', fontSize=8, fontName='Helvetica', textColor=colors.HexColor('#AAAAAA'), alignment=TA_CENTER, leading=13))
]]

header_table = Table([[
    Paragraph("SACHi STREAM", ParagraphStyle('BrandH', fontSize=26, fontName='Helvetica-Bold', textColor=GOLD, alignment=TA_CENTER, leading=30)),
]], colWidths=[17*cm], style=TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), BLACK),
    ('TOPPADDING', (0,0), (-1,-1), 14),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))

subheader_table = Table([[
    Paragraph("T-SHIRT PRINT SPECIFICATION SHEET", ParagraphStyle('Sub', fontSize=12, fontName='Helvetica-Bold', textColor=WHITE, alignment=TA_CENTER)),
]], colWidths=[17*cm], style=TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), BLACK),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))

info_table = Table([[
    Paragraph("LDNA Consulting LLC  |  jaygnz27@gmail.com  |  908-255-2195  |  sachistream.com  |  May 17, 2026",
        ParagraphStyle('Info', fontSize=8, fontName='Helvetica', textColor=GOLD, alignment=TA_CENTER)),
]], colWidths=[17*cm], style=TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), BLACK),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 12),
]))

elements += [header_table, subheader_table, info_table, Spacer(1, 0.3*cm)]

# ── GARMENT ───────────────────────────────────────────────────
elements.append(section_header("1.  GARMENT SPECIFICATIONS"))
elements.append(Spacer(1, 0.15*cm))
elements.append(data_table(
    ['FIELD', 'DETAIL'],
    [
        ['Garment Type', 'Unisex Crew Neck T-Shirt'],
        ['Fit', 'Fitted / Athletic cut'],
        ['Garment Color', 'Black — Pantone Black 6 C'],
        ['Fabric', '100% Cotton  OR  95% Cotton / 5% Elastane (athletic fit)'],
        ['Weight', '180–200 GSM recommended'],
        ['Sizes Required', 'S, M, L, XL, XXL'],
    ],
    [5*cm, 12*cm]
))
elements.append(Spacer(1, 0.3*cm))

# ── PRINT METHOD ──────────────────────────────────────────────
elements.append(section_header("2.  PRINT METHOD"))
elements.append(Spacer(1, 0.15*cm))
elements.append(data_table(
    ['METHOD', 'WHEN TO USE'],
    [
        ['DTF — Direct to Film  ✦ RECOMMENDED', 'Best for gold detail, gradients, and full color Dharma Chakra'],
        ['Screen Print', 'Use for large bulk quantities (50+ shirts)'],
    ],
    [7*cm, 10*cm]
))
elements.append(Spacer(1, 0.3*cm))

# ── FRONT PRINT ───────────────────────────────────────────────
elements.append(section_header("3.  FRONT PRINT DESIGN"))
elements.append(Spacer(1, 0.15*cm))
elements.append(data_table(
    ['FIELD', 'DETAIL'],
    [
        ['Position', 'Center chest — approximately 3 inches (7.5 cm) below collar'],
        ['Print Size', '28 cm wide × 14 cm tall  (approx 11" × 5.5")'],
        ['"SACH" Text', 'Bold sans-serif, ALL CAPS — Purple #7B2FBE / Pantone 266 C'],
        ['"i" Letter', 'Lowercase, same font — Gold #F5C842 / Pantone 116 C'],
        ['"STREAM" Text', 'Smaller bold ALL CAPS, wide letter spacing — Gold #F5C842'],
        ['STREAM Size', 'Approx 40% the height of "SACHi" text — center aligned below'],
    ],
    [5*cm, 12*cm]
))
elements.append(Spacer(1, 0.3*cm))

# ── BACK PRINT ────────────────────────────────────────────────
elements.append(section_header("4.  BACK PRINT DESIGN"))
elements.append(Spacer(1, 0.15*cm))

elements.append(Paragraph("<b>Element 1 — Dharma Chakra Logo Badge (upper back)</b>", 
    ParagraphStyle('EL', fontSize=9, fontName='Helvetica-Bold', textColor=PURPLE, spaceBefore=4, spaceAfter=3)))
elements.append(data_table(
    ['FIELD', 'DETAIL'],
    [
        ['Position', 'Upper center back — 3 inches (7.5 cm) below collar'],
        ['Print Size', '15 cm × 15 cm  (approx 6" × 6")'],
        ['Design', 'Ornate Buddhist Dharma Chakra — 8-spoke wheel, intricate gold carvings'],
        ['Wheel Color', 'Antique gold on black background'],
        ['Center Hub', 'Black circle with glowing gold ring border'],
        ['Hub Text Line 1', '"SACHi" — SACH in Purple #7B2FBE, "i" in Gold #F5C842'],
        ['Hub Text Line 2', '"STREAM" in small gold letters, center aligned'],
    ],
    [5*cm, 12*cm]
))
elements.append(Spacer(1, 0.2*cm))

elements.append(Paragraph("<b>Element 2 — Slogan</b>", 
    ParagraphStyle('EL', fontSize=9, fontName='Helvetica-Bold', textColor=PURPLE, spaceBefore=4, spaceAfter=3)))
elements.append(data_table(
    ['FIELD', 'DETAIL'],
    [
        ['Position', 'Center back — 2 cm below Dharma Chakra wheel'],
        ['Text', 'REAL PEOPLE. REAL VIDEOS. NO AI.'],
        ['Font', 'Bold ALL CAPS, clean sans-serif'],
        ['Color', 'Gold — Pantone 116 C / HEX #F5C842'],
        ['Letter Height', 'Approx 1.5 cm tall'],
    ],
    [5*cm, 12*cm]
))
elements.append(Spacer(1, 0.2*cm))

elements.append(Paragraph("<b>Element 3 — Website</b>", 
    ParagraphStyle('EL', fontSize=9, fontName='Helvetica-Bold', textColor=PURPLE, spaceBefore=4, spaceAfter=3)))
elements.append(data_table(
    ['FIELD', 'DETAIL'],
    [
        ['Position', 'Center back — 1.5 cm below slogan'],
        ['Text', 'sachistream.com'],
        ['Font', 'Regular weight sans-serif, lowercase'],
        ['Color', 'White — HEX #FFFFFF'],
        ['Letter Height', 'Approx 0.8 cm tall'],
    ],
    [5*cm, 12*cm]
))
elements.append(Spacer(1, 0.3*cm))

# ── COLOR REFERENCE ───────────────────────────────────────────
elements.append(section_header("5.  COLOR REFERENCE"))
elements.append(Spacer(1, 0.15*cm))
elements.append(data_table(
    ['COLOR NAME', 'PANTONE', 'HEX', 'CMYK', 'RGB'],
    [
        ['Purple', '266 C', '#7B2FBE', '73, 79, 0, 0', '123, 47, 190'],
        ['Gold', '116 C', '#F5C842', '0, 13, 80, 4', '245, 200, 66'],
        ['White', '—', '#FFFFFF', '0, 0, 0, 0', '255, 255, 255'],
        ['Black (garment)', 'Black 6 C', '#000000', '—', '0, 0, 0'],
    ],
    [3.5*cm, 3*cm, 3*cm, 4*cm, 3.5*cm]
))
elements.append(Spacer(1, 0.3*cm))

# ── QUANTITIES ────────────────────────────────────────────────
elements.append(section_header("6.  QUANTITIES (TO BE CONFIRMED)"))
elements.append(Spacer(1, 0.15*cm))
elements.append(data_table(
    ['SIZE', 'QUANTITY'],
    [['S', ''], ['M', ''], ['L', ''], ['XL', ''], ['XXL', ''], ['TOTAL', '']],
    [4*cm, 13*cm]
))
elements.append(Spacer(1, 0.3*cm))

# ── NOTES ─────────────────────────────────────────────────────
elements.append(section_header("7.  IMPORTANT NOTES TO PRINTER"))
elements.append(Spacer(1, 0.15*cm))
notes = [
    "⚠  Mockup images provided are AI-rendered references ONLY — please recreate all artwork as vector files (AI or EPS) using exact color codes above.",
    "⚠  The Dharma Chakra wheel has intricate fine detail — minimum 300 DPI at final print size required.",
    "⚠  Gold areas should use metallic or shimmer finish ink if DTF printing allows.",
    "⚠  Request a physical strike-off sample (1 shirt) for client approval BEFORE bulk production run.",
    "⚠  No bleed required — all designs contained within print area boundaries.",
]
for note in notes:
    elements.append(Paragraph(note, note_style))

elements.append(Spacer(1, 0.5*cm))

# ── FOOTER ────────────────────────────────────────────────────
footer = Table([[
    Paragraph("Sachi Stream  —  Real People. Real Videos. No AI.  |  © 2026 LDNA Consulting LLC. All rights reserved.",
        ParagraphStyle('Footer', fontSize=7, fontName='Helvetica', textColor=GOLD, alignment=TA_CENTER))
]], colWidths=[17*cm], style=TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), BLACK),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
]))
elements.append(footer)

doc.build(elements)
print("PDF built successfully!")
