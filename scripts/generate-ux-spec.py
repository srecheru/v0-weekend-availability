"""
Generate the WAB Front-End UX/UI Specification PDF.
Uses reportlab for PDF generation.
"""
import subprocess, sys
subprocess.check_call([sys.executable, "-m", "pip", "install", "reportlab", "-q"])

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)

# ---------- Document Setup ----------

pdf_path = "/vercel/share/v0-project/public/WAB_Frontend_UX_UI_Spec.pdf"
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    topMargin=0.75*inch,
    bottomMargin=0.75*inch,
    leftMargin=0.85*inch,
    rightMargin=0.85*inch,
)

styles = getSampleStyleSheet()

# Custom styles
COLOR_PRIMARY = HexColor("#3d3225")
COLOR_GREEN = HexColor("#2d8a4e")
COLOR_SAGE = HexColor("#6b9a6e")
COLOR_AMBER = HexColor("#9a8a5e")
COLOR_GREY = HexColor("#808080")
COLOR_CORAL = HexColor("#c25a3c")
COLOR_BG_WARM = HexColor("#f5f0e8")
COLOR_BORDER = HexColor("#e0d8ca")

styles.add(ParagraphStyle(
    "DocTitle", parent=styles["Title"],
    fontSize=24, leading=30, textColor=COLOR_PRIMARY,
    spaceAfter=4, alignment=TA_LEFT, fontName="Helvetica-Bold",
))
styles.add(ParagraphStyle(
    "DocSubtitle", parent=styles["Normal"],
    fontSize=11, leading=15, textColor=HexColor("#6b6050"),
    spaceAfter=20, fontName="Helvetica",
))
styles.add(ParagraphStyle(
    "SectionH1", parent=styles["Heading1"],
    fontSize=18, leading=24, textColor=COLOR_PRIMARY,
    spaceBefore=24, spaceAfter=10, fontName="Helvetica-Bold",
))
styles.add(ParagraphStyle(
    "SectionH2", parent=styles["Heading2"],
    fontSize=14, leading=18, textColor=COLOR_PRIMARY,
    spaceBefore=16, spaceAfter=6, fontName="Helvetica-Bold",
))
styles.add(ParagraphStyle(
    "SectionH3", parent=styles["Heading3"],
    fontSize=12, leading=16, textColor=HexColor("#4a4030"),
    spaceBefore=12, spaceAfter=4, fontName="Helvetica-Bold",
))
styles.add(ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontSize=10, leading=15, textColor=HexColor("#2e2a22"),
    spaceAfter=8, alignment=TA_JUSTIFY, fontName="Helvetica",
))
styles.add(ParagraphStyle(
    "BodyBold", parent=styles["Normal"],
    fontSize=10, leading=15, textColor=HexColor("#2e2a22"),
    spaceAfter=8, fontName="Helvetica-Bold",
))
styles.add(ParagraphStyle(
    "Bullet", parent=styles["Normal"],
    fontSize=10, leading=15, textColor=HexColor("#2e2a22"),
    spaceAfter=4, leftIndent=18, bulletIndent=6, fontName="Helvetica",
))
styles.add(ParagraphStyle(
    "SubBullet", parent=styles["Normal"],
    fontSize=9.5, leading=14, textColor=HexColor("#4a4030"),
    spaceAfter=3, leftIndent=36, bulletIndent=24, fontName="Helvetica",
))
styles.add(ParagraphStyle(
    "Code", parent=styles["Normal"],
    fontSize=9, leading=13, textColor=HexColor("#2e2a22"),
    spaceAfter=6, leftIndent=12, fontName="Courier",
    backColor=HexColor("#f0ebe0"),
))
styles.add(ParagraphStyle(
    "Caption", parent=styles["Normal"],
    fontSize=9, leading=12, textColor=HexColor("#7a7060"),
    spaceAfter=4, alignment=TA_CENTER, fontName="Helvetica-Oblique",
))
styles.add(ParagraphStyle(
    "TableCell", parent=styles["Normal"],
    fontSize=9, leading=12, textColor=HexColor("#2e2a22"),
    fontName="Helvetica",
))
styles.add(ParagraphStyle(
    "TableHeader", parent=styles["Normal"],
    fontSize=9, leading=12, textColor=white,
    fontName="Helvetica-Bold",
))
styles.add(ParagraphStyle(
    "Note", parent=styles["Normal"],
    fontSize=9, leading=13, textColor=HexColor("#5a5040"),
    spaceAfter=6, leftIndent=12, borderPadding=6, fontName="Helvetica-Oblique",
    backColor=HexColor("#f5f0e8"),
))

# Helpers
def h1(text): return Paragraph(text, styles["SectionH1"])
def h2(text): return Paragraph(text, styles["SectionH2"])
def h3(text): return Paragraph(text, styles["SectionH3"])
def body(text): return Paragraph(text, styles["Body"])
def bold(text): return Paragraph(text, styles["BodyBold"])
def bullet(text): return Paragraph(f"<bullet>&bull;</bullet> {text}", styles["Bullet"])
def sub_bullet(text): return Paragraph(f"<bullet>-</bullet> {text}", styles["SubBullet"])
def code(text): return Paragraph(text, styles["Code"])
def caption(text): return Paragraph(text, styles["Caption"])
def note(text): return Paragraph(f"<i>Note: {text}</i>", styles["Note"])
def spacer(h=8): return Spacer(1, h)
def hr(): return HRFlowable(width="100%", thickness=0.5, color=COLOR_BORDER, spaceBefore=8, spaceAfter=8)

def make_table(headers, rows, col_widths=None):
    """Build a styled table."""
    header_paras = [Paragraph(h, styles["TableHeader"]) for h in headers]
    data = [header_paras]
    for row in rows:
        data.append([Paragraph(str(c), styles["TableCell"]) for c in row])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('TOPPADDING', (0,0), (-1,0), 8),
        ('BACKGROUND', (0,1), (-1,-1), HexColor("#faf7f0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [HexColor("#faf7f0"), white]),
        ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 9),
        ('TOPPADDING', (0,1), (-1,-1), 6),
        ('BOTTOMPADDING', (0,1), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t

# ---------- Build Story ----------
story = []

# ---- Title Page ----
story.append(Spacer(1, 1.5*inch))
story.append(Paragraph("Weekend Availability Board", styles["DocTitle"]))
story.append(Paragraph("Front-End UX/UI Specification", ParagraphStyle(
    "TitleSub", parent=styles["DocTitle"], fontSize=16, leading=22, textColor=HexColor("#6b6050"),
)))
story.append(Spacer(1, 16))
story.append(Paragraph(
    "Standalone front-end specification for AI coding agents.<br/>"
    "Covers all screens, components, interactions, state management, styling, and data contracts.<br/>"
    "Excludes backend API implementation, database setup, and QA test suites.",
    styles["DocSubtitle"]
))
story.append(Spacer(1, 12))
story.append(hr())
story.append(Spacer(1, 8))

meta_data = [
    ["Document Version", "1.0"],
    ["Date", "February 18, 2026"],
    ["Source Spec", "Weekend Availability Board MVP Spec v4 (with Addenda A-D)"],
    ["Scope", "Front-end only: screens, components, interactions, styling, data shapes"],
    ["Out of Scope", "Backend API implementation, database schema, QA test suites"],
    ["Target Stack", "Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui"],
    ["Font", "Geist (sans), Geist Mono (mono)"],
]
for row in meta_data:
    story.append(Paragraph(f"<b>{row[0]}:</b>  {row[1]}", styles["Body"]))
story.append(PageBreak())

# ---- Table of Contents ----
story.append(h1("Table of Contents"))
toc_items = [
    "1. Product Overview & Scope Boundary",
    "2. Design System: Color Tokens, Typography & Spacing",
    "3. Route Map & Navigation Architecture",
    "4. Screen 1: Create Board",
    "5. Screen 2: Creator Join",
    "6. Screen 3: Participant Join",
    "7. Screen 4: My Availability",
    "8. Screen 5: Group Availability",
    "9. Shared Components Reference",
    "10. Data Types & Shapes (Front-End Contract)",
    "11. State Management Architecture",
    "12. Interaction Behaviors & Micro-interactions",
    "13. Accessibility Requirements",
    "14. Responsive Behavior",
    "15. Edge Cases & Empty States",
    "16. Prototype Scenario Matrix",
]
for item in toc_items:
    story.append(bullet(item))
story.append(PageBreak())


# ======================================================================
# SECTION 1: Product Overview
# ======================================================================
story.append(h1("1. Product Overview & Scope Boundary"))

story.append(body(
    "The Weekend Availability Board (WAB) helps a small, private group of up to 5 people "
    "find the best weekends to get together. Each participant marks which weekends they are "
    "<b>busy</b> (exceptions-first model -- all weekends default to free). The app then "
    "aggregates everyone's availability into a color-coded, tier-ranked view showing which "
    "weekends have the most people free."
))
story.append(body(
    "The app does <b>not</b> schedule events. It only identifies optimal weekends."
))

story.append(h2("1.1 Front-End Scope"))
story.append(bullet("5 screens: Create Board, Creator Join, Participant Join, My Availability, Group Availability"))
story.append(bullet("Reusable component library for calendar, lists, tier badges, and navigation"))
story.append(bullet("Client-side state management wired to API data shapes"))
story.append(bullet("Autosave with debounce, retry, and failure UI"))
story.append(bullet("Responsive mobile-first layout (max-width 448px content area)"))

story.append(h2("1.2 Explicitly Out of Scope for This Document"))
story.append(bullet("Backend API implementation (endpoints are referenced by contract shape only)"))
story.append(bullet("Database schema, migrations, or storage layer"))
story.append(bullet("QA test suites, E2E tests, or unit test files"))
story.append(bullet("Authentication, email, push notifications, calendar integrations"))
story.append(bullet("Dark mode (light mode only for MVP)"))
story.append(PageBreak())


# ======================================================================
# SECTION 2: Design System
# ======================================================================
story.append(h1("2. Design System: Color Tokens, Typography & Spacing"))

story.append(h2("2.1 Color Palette"))
story.append(body(
    "The app uses a warm, approachable palette with oklch color values defined as CSS custom properties. "
    "All colors are referenced via Tailwind CSS design tokens -- never hardcoded hex/rgb values."
))

color_table = make_table(
    ["Token Name", "oklch Value", "Usage"],
    [
        ["--background", "oklch(0.98 0.003 80)", "Page background, warm off-white"],
        ["--foreground", "oklch(0.18 0.02 50)", "Primary text, dark warm brown"],
        ["--card", "oklch(0.995 0.001 80)", "Card/surface background"],
        ["--primary", "oklch(0.30 0.04 50)", "Primary buttons, dark brown"],
        ["--primary-foreground", "oklch(0.98 0.003 80)", "Text on primary buttons"],
        ["--muted", "oklch(0.94 0.005 80)", "Muted backgrounds"],
        ["--muted-foreground", "oklch(0.50 0.01 50)", "Secondary text"],
        ["--border", "oklch(0.90 0.008 80)", "Card/input borders, warm beige"],
        ["--destructive", "oklch(0.577 0.245 27.325)", "Error text/icons"],
    ],
    col_widths=[1.8*inch, 2.2*inch, 2.6*inch]
)
story.append(color_table)
story.append(spacer(12))

story.append(h3("2.1.1 Tier Color Tokens"))
story.append(body(
    "These are the core visual identity of the app. They are used on calendar day cells, "
    "tier badge pills, summary bar chips, and weekend list row accents."
))

tier_table = make_table(
    ["Tier", "Token", "oklch Value", "Visual Description"],
    [
        ["Everyone Free", "--tier-everyone-free", "oklch(0.65 0.17 150)", "Vivid green"],
        ["Everyone Free (fg)", "--tier-everyone-free-foreground", "oklch(0.20 0.06 150)", "Dark green text"],
        ["Majority Free", "--tier-majority-free", "oklch(0.72 0.08 145)", "Soft sage green"],
        ["Majority Free (fg)", "--tier-majority-free-foreground", "oklch(0.22 0.04 145)", "Dark sage text"],
        ["Mixed", "--tier-mixed", "oklch(0.78 0.06 80)", "Warm amber/muted"],
        ["Mixed (fg)", "--tier-mixed-foreground", "oklch(0.30 0.03 60)", "Dark amber text"],
        ["All Busy", "--tier-all-busy", "oklch(0.70 0.01 0)", "Neutral grey"],
        ["All Busy (fg)", "--tier-all-busy-foreground", "oklch(0.30 0.01 0)", "Dark grey text"],
        ["Busy (Personal)", "--tier-busy-personal", "oklch(0.70 0.14 25)", "Coral/salmon"],
        ["Busy (Personal fg)", "--tier-busy-personal-foreground", "oklch(0.98 0.003 80)", "White on coral"],
    ],
    col_widths=[1.3*inch, 2.2*inch, 1.7*inch, 1.4*inch]
)
story.append(tier_table)
story.append(spacer(8))

story.append(h2("2.2 Typography"))
story.append(bullet("<b>Font families:</b> Geist (sans-serif, primary), Geist Mono (monospace, claim codes)"))
story.append(bullet("<b>Tailwind classes:</b> <font face='Courier' size=9>font-sans</font>, <font face='Courier' size=9>font-mono</font>"))
story.append(bullet("<b>Heading scale:</b> 2xl (24px) for page titles, base (16px) for card titles, sm (14px) for section labels"))
story.append(bullet("<b>Body text:</b> sm (14px) primary content, xs (12px) secondary/helper text, [10px] for navigation labels"))
story.append(bullet("<b>Line height:</b> relaxed (1.5) for body, tight for headings"))

story.append(h2("2.3 Spacing & Layout"))
story.append(bullet("<b>Border radius:</b> 0.75rem (--radius), used via Tailwind rounded-lg"))
story.append(bullet("<b>Content max-width:</b> max-w-md (28rem / 448px), centered with mx-auto"))
story.append(bullet("<b>Page padding:</b> px-4 (16px horizontal), py-6 (24px vertical)"))
story.append(bullet("<b>Card padding:</b> Uses shadcn Card defaults (p-6 on CardContent)"))
story.append(bullet("<b>Spacing between sections:</b> gap-5 (20px) vertical flex gap"))
story.append(bullet("<b>Bottom padding for nav:</b> pb-20 (80px) on all pages to clear fixed bottom nav"))
story.append(PageBreak())


# ======================================================================
# SECTION 3: Route Map
# ======================================================================
story.append(h1("3. Route Map & Navigation Architecture"))

story.append(h2("3.1 Canonical Routes"))
route_table = make_table(
    ["Route", "Page", "Description"],
    [
        ["/", "Create Board", "Entry point. Form to name a board and select planning window."],
        ["/boards/{boardId}/creator-join", "Creator Join", "Post-creation landing. Share link + board overview + claim code."],
        ["/boards/{boardId}/participant-join", "Participant Join", "Join form (or Board Full + reclaim). Accessed via share link."],
        ["/boards/{boardId}/my-availability", "My Availability", "Personal calendar to mark busy weekends. Autosave."],
        ["/boards/{boardId}/group-availability", "Group Availability", "Tier-colored group calendar + ranked weekend list."],
    ],
    col_widths=[2.4*inch, 1.2*inch, 3*inch]
)
story.append(route_table)
story.append(spacer(8))

story.append(h2("3.2 Navigation Flows"))
story.append(bullet("<b>Create Board submit</b> &rarr; redirect to <font face='Courier' size=9>/boards/{boardId}/creator-join</font>"))
story.append(bullet("<b>Creator Join: 'Add My Availability'</b> &rarr; navigates to <font face='Courier' size=9>/my-availability</font>"))
story.append(bullet("<b>Participant Join: 'Join Board' submit</b> &rarr; redirect to <font face='Courier' size=9>/my-availability</font>"))
story.append(bullet("<b>Reclaim (claim code valid)</b> &rarr; ADDED_AVAILABILITY state goes to <font face='Courier' size=9>/group-availability</font>; otherwise <font face='Courier' size=9>/my-availability</font>"))
story.append(bullet("<b>My Availability &harr; Group View</b>: Tab switcher component at top of both pages"))

story.append(h2("3.3 Access Gating (Client-Side)"))
story.append(bullet("If user is not joined and accesses /my-availability or /group-availability &rarr; redirect to /participant-join"))
story.append(bullet("If user is joined but NOT in ADDED_AVAILABILITY and accesses /group-availability &rarr; redirect to /my-availability"))
story.append(bullet("If localStorage participantId is invalid/mismatched &rarr; clear key, redirect to /participant-join"))

story.append(h2("3.4 Bottom Navigation Bar (Prototype)"))
story.append(body(
    "A fixed bottom nav bar provides quick access to all 5 screens. This is a prototype-only convenience. "
    "In production, navigation would follow the access gating rules above."
))
story.append(bullet("Fixed position: bottom-0, z-40, bg-card with border-t"))
story.append(bullet("5 icon+label links: Create, Creator, Join, My Avail., Group"))
story.append(bullet("Active state: text-foreground; Inactive: text-muted-foreground"))
story.append(bullet("Icon size: 16px (size-4). Label: 10px font, max-width 56px truncated"))
story.append(PageBreak())


# ======================================================================
# SECTION 4: Screen 1 - Create Board
# ======================================================================
story.append(h1("4. Screen 1: Create Board"))
story.append(body(
    "The entry point of the application. A centered card form for naming the board and selecting the planning window."
))

story.append(h2("4.1 Layout"))
story.append(bullet("Centered vertically and horizontally: <font face='Courier' size=9>min-h-screen flex flex-col items-center justify-center</font>"))
story.append(bullet("Max width: max-w-md (448px)"))
story.append(bullet("Header section above card: app icon (CalendarDays in a 48px rounded square), title, subtitle"))

story.append(h2("4.2 Form Fields"))

field_table = make_table(
    ["Field", "Type", "Placeholder", "Validation", "Helper Text"],
    [
        ["Board Name", "Text input", "e.g. Summer Hangouts", "Required, non-empty", "None"],
        ["Planning Window", "Select dropdown", "Select duration", "Required (default: 3)", "'Full calendar months from today. Cannot be changed later.'"],
    ],
    col_widths=[1.2*inch, 1*inch, 1.3*inch, 1.3*inch, 1.8*inch]
)
story.append(field_table)
story.append(spacer(8))

story.append(h3("4.2.1 Planning Window Options"))
story.append(bullet("Next 1 month"))
story.append(bullet("Next 3 months (default)"))
story.append(bullet("Next 6 months"))
story.append(bullet("Next 12 months"))

story.append(h2("4.3 Submit Button"))
story.append(bullet("Label: 'Create Board'"))
story.append(bullet("Full width, size='lg' (large), primary variant"))
story.append(bullet("On click: validate fields, then POST /api/boards, then redirect to /boards/{boardId}/creator-join"))

story.append(h2("4.4 Error States"))
story.append(bullet("Empty board name: inline red text 'Board name is required' below the input"))
story.append(bullet("API error: display error message below form"))
story.append(PageBreak())


# ======================================================================
# SECTION 5: Screen 2 - Creator Join
# ======================================================================
story.append(h1("5. Screen 2: Creator Join"))
story.append(body(
    "Displayed immediately after board creation. Shows the share link, board overview, "
    "the creator's claim code, and a CTA to add availability."
))

story.append(h2("5.1 Layout"))
story.append(bullet("Vertical stack: BoardHeader &rarr; ShareLinkCard &rarr; Board Overview Card &rarr; Claim Code Card &rarr; CTA Button"))
story.append(bullet("Max-width: max-w-md, px-4, py-6"))

story.append(h2("5.2 Components Used"))

story.append(h3("5.2.1 BoardHeader"))
story.append(bullet("Board name as h1 (text-2xl font-semibold)"))
story.append(bullet("Date range with CalendarDays icon + timezone with Globe icon"))
story.append(bullet("Metadata line: text-sm text-muted-foreground, flex-wrap with gap-x-4"))

story.append(h3("5.2.2 ShareLinkCard"))
story.append(bullet("Card with border-dashed style"))
story.append(bullet("Header: Link icon + 'Share this link with your group' (text-sm font-medium)"))
story.append(bullet("URL display: truncated, monospace, bg-muted, rounded, select-all"))
story.append(bullet("Copy button: outline variant, icon-only, toggles Check icon for 2 seconds on success"))
story.append(bullet("URL format: <font face='Courier' size=9>{origin}/boards/{boardId}/participant-join?joinToken={joinToken}</font>"))

story.append(h3("5.2.3 Board Overview Card"))
story.append(bullet("Card with title 'Board Overview'"))
story.append(bullet("Contains: TierSummaryBar + ParticipantList"))

story.append(h3("5.2.4 Claim Code Card"))
story.append(bullet("Muted/dashed card showing KeyRound icon + 'Your claim code' label + the code in font-mono font-semibold"))
story.append(bullet("Only shown when a current participant exists"))

story.append(h3("5.2.5 CTA Button"))
story.append(bullet("Link styled as Button, size='lg', full width"))
story.append(bullet("Label: 'Add My Availability' with CalendarPlus icon"))
story.append(bullet("Navigates to /boards/{boardId}/my-availability"))
story.append(PageBreak())


# ======================================================================
# SECTION 6: Screen 3 - Participant Join
# ======================================================================
story.append(h1("6. Screen 3: Participant Join"))
story.append(body(
    "Accessed via the shared link. Shows a join form when the board has open spots, "
    "or a Board Full state with claim code reclaim when the board is at capacity."
))

story.append(h2("6.1 Layout"))
story.append(bullet("Vertical stack: BoardHeader &rarr; Join Card (or Board Full Card) &rarr; Board Overview Card"))
story.append(bullet("Does NOT show the shareable URL (unlike Creator Join)"))

story.append(h2("6.2 Join Form (Board Not Full)"))
story.append(bullet("Card title: 'Join this Board'"))
story.append(bullet("Description: 'Enter your name to join. You'll be able to mark your busy weekends next.'"))
story.append(bullet("Field: Display Name text input, placeholder 'e.g. Alex'"))
story.append(bullet("Submit button: 'Join Board', full width"))
story.append(bullet("Validation: name required, name must not be taken (case-insensitive)"))
story.append(bullet("On success: POST /api/boards/{boardId}/participants, store participantId in localStorage, redirect to /my-availability"))

story.append(h2("6.3 Board Full State"))
story.append(bullet("Card title: AlertCircle icon + 'Board is Full'"))
story.append(bullet("Description: 'This board already has {cap} participants. If you were already part of this board, use your claim code below.'"))
story.append(bullet("ClaimCodeInput component replaces the join form"))
story.append(bullet("Claim code field: text input, placeholder 'e.g. mountain'"))
story.append(bullet("Reclaim button: 'Reclaim', outline variant"))
story.append(bullet("On valid code: route based on participant state -- ADDED_AVAILABILITY goes to /group-availability, others to /my-availability"))
story.append(bullet("On invalid code: inline error 'Invalid claim code. Please try again.'"))

story.append(h2("6.4 Board Overview (Shown in Both States)"))
story.append(bullet("Same Board Overview Card as Creator Join: TierSummaryBar + ParticipantList"))

story.append(h2("6.5 Error States"))
story.append(bullet("Empty name: 'Display name is required'"))
story.append(bullet("Name taken: 'That name is already taken. Use your claim code to reclaim.'"))
story.append(bullet("Invalid claim code: 'Invalid claim code. Please try again.'"))
story.append(PageBreak())


# ======================================================================
# SECTION 7: Screen 4 - My Availability
# ======================================================================
story.append(h1("7. Screen 4: My Availability"))
story.append(body(
    "The personal availability editor. Users tap weekend days (Fri/Sat/Sun) on a custom "
    "calendar to toggle them as busy. Below the calendar is a chronological list of busy weekends."
))

story.append(h2("7.1 Layout"))
story.append(bullet("Vertical stack: BoardHeader &rarr; AvailabilityTabs &rarr; Instructions + SaveIndicator &rarr; Calendar Card &rarr; WeekendListPersonal &rarr; User Info Footer"))

story.append(h2("7.2 AvailabilityTabs"))
story.append(body(
    "A segmented control that switches between 'My Availability' and 'Group View'. "
    "This is a shared component also used on the Group Availability page."
))
story.append(bullet("Container: rounded-lg bg-muted p-1 gap-1, flex row"))
story.append(bullet("Active tab: bg-card text-foreground shadow-sm"))
story.append(bullet("Inactive tab: text-muted-foreground hover:text-foreground"))
story.append(bullet("Tab labels: 'My Availability' | 'Group View'"))

story.append(h2("7.3 Instructions Line"))
story.append(bullet("Body text: 'Tap weekend days to mark them as <b>busy</b>. Everything else stays free.'"))
story.append(bullet("SaveIndicator floated to the right"))

story.append(h2("7.4 PersonalCalendar"))
story.append(body(
    "A fully custom calendar (not using react-day-picker) that renders a month grid with "
    "navigable month-by-month controls. Weekend days (Fri/Sat/Sun) are interactive buttons."
))

story.append(h3("7.4.1 Month Navigation"))
story.append(bullet("Left/right chevron buttons at top"))
story.append(bullet("Month name + year centered between them (e.g. 'February 2026')"))
story.append(bullet("Navigation bounded by the board's dateRangeStart and dateRangeEnd"))
story.append(bullet("Disabled when at boundary month"))

story.append(h3("7.4.2 Day Grid"))
story.append(bullet("7-column grid (Sun-Sat), weekday labels at top"))
story.append(bullet("<b>Weekday cells (Mon-Thu):</b> non-interactive, text-muted-foreground/30, very faded"))
story.append(bullet("<b>Out-of-month cells:</b> non-interactive, text-muted-foreground/20"))
story.append(bullet("<b>Weekend cells (Fri/Sat/Sun) -- Free state:</b> bg-tier-everyone-free/15, interactive button"))
story.append(bullet("<b>Weekend cells (Fri/Sat/Sun) -- Busy state:</b> bg-tier-busy-personal text-tier-busy-personal-foreground (coral fill, white text)"))
story.append(bullet("<b>Fri-Sun block shaping:</b> Friday gets rounded-l-lg, Sunday gets rounded-r-lg, creating a visual 3-day block"))
story.append(bullet("<b>Tap behavior:</b> Tapping any day in a Fri-Sun block toggles the entire block's busy state"))

story.append(h3("7.4.3 Calendar Aspect Ratio"))
story.append(bullet("Each day cell: aspect-square (1:1), filling the column width"))
story.append(bullet("Text: text-sm font-medium, centered"))

story.append(h2("7.5 WeekendListPersonal"))
story.append(bullet("Header: 'Busy Weekends ({count})' in xs uppercase tracking-wider"))
story.append(bullet("Each row: weekend range (e.g. 'Feb 21 - 23'), with X remove button"))
story.append(bullet("Row background: bg-tier-busy-personal/10 (subtle coral)"))
story.append(bullet("Remove button: ghost variant, icon-only, X icon (size 14px)"))
story.append(bullet("List order: chronological (sorted by Friday date)"))
story.append(bullet("<b>Empty state:</b> centered text 'No busy weekends selected' with sub-text 'Tap weekends on the calendar to mark them as busy'"))

story.append(h2("7.6 SaveIndicator"))
story.append(bullet("Appears inline in the instructions row"))
story.append(bullet("<b>Idle:</b> opacity-0 (invisible)"))
story.append(bullet("<b>Saving:</b> Loader2 spinning icon + 'Saving...' in muted text"))
story.append(bullet("<b>Saved:</b> Check icon (green) + 'Saved' in green text, fades after 3 seconds"))
story.append(bullet("Uses aria-live='polite' for screen reader announcements"))

story.append(h2("7.7 User Info Footer"))
story.append(bullet("Text: 'Logged in as <b>{name}</b> &middot; Claim code: <b>{code}</b>'"))
story.append(bullet("Centered, xs text, muted color"))

story.append(h2("7.8 Autosave Behavior (Implementation Notes for Wiring)"))
story.append(bullet("Trigger: 800ms debounce after any toggle"))
story.append(bullet("Payload: full replacement of busyWeekendFridays array"))
story.append(bullet("On failure: persistent banner 'Not saved. Retrying...' with 'Retry now' button"))
story.append(bullet("Auto-retry: every 5 seconds, cap at 30 seconds (6 attempts)"))
story.append(bullet("After retry cap: clear localStorage, redirect to /participant-join"))
story.append(PageBreak())


# ======================================================================
# SECTION 8: Screen 5 - Group Availability
# ======================================================================
story.append(h1("8. Screen 5: Group Availability"))
story.append(body(
    "The aggregated group view. Shows a tier-colored calendar where each weekend is colored "
    "by its availability tier, plus a ranked list of all weekends sorted by best-to-worst availability."
))

story.append(h2("8.1 Layout"))
story.append(bullet("Vertical stack: BoardHeader &rarr; AvailabilityTabs (active='group') &rarr; TierSummaryBar &rarr; Group Calendar Card &rarr; Ranked Weekend List"))

story.append(h2("8.2 TierSummaryBar"))
story.append(body(
    "A row of color-coded pill chips showing the count of weekends in each tier."
))
story.append(bullet("4 chips: {count} Everyone Free | {count} Majority Free | {count} Mixed | {count} All Busy"))
story.append(bullet("Each chip: rounded-full px-3 py-1, text-xs font-medium, background + foreground from TIER_CONFIG"))
story.append(bullet("Below chips: '{n} participant(s) pending' if pendingCount > 0"))
story.append(bullet("<b>No aggregation state:</b> 'No availability added yet' in centered muted text"))

story.append(h2("8.3 GroupCalendar"))
story.append(body(
    "Same CalendarShell as PersonalCalendar but with read-only, tier-colored weekend cells."
))
story.append(bullet("Weekend cells are NOT interactive (no toggle behavior)"))
story.append(bullet("Each Fri-Sat-Sun block is colored by its tier:"))
story.append(sub_bullet("<b>EVERYONE_FREE:</b> bg-tier-everyone-free/20 (translucent green)"))
story.append(sub_bullet("<b>MAJORITY_FREE:</b> bg-tier-majority-free/20 (translucent sage)"))
story.append(sub_bullet("<b>MIXED_NOT_MAJORITY:</b> bg-tier-mixed/20 (translucent warm amber)"))
story.append(sub_bullet("<b>ALL_BUSY:</b> bg-tier-all-busy/20 (translucent grey)"))
story.append(bullet("No aggregation: all weekends show bg-muted/50 (neutral)"))
story.append(bullet("Same Fri-Sun block rounding as PersonalCalendar"))

story.append(h2("8.4 Ranked Weekend List"))
story.append(h3("8.4.1 Section Header"))
story.append(bullet("Title: 'Ranked Weekends' (or 'Weekends' if no aggregation)"))
story.append(bullet("Sub-text: 'Sorted by availability. Tap mixed weekends to see who\\'s free.' (or empty state message)"))

story.append(h3("8.4.2 Weekend Row Component"))
story.append(body(
    "Each row has a left-side tier color bar, the weekend date range, and a one-line summary."
))
story.append(bullet("Container: rounded-lg, overflow-hidden, border border-border/50"))
story.append(bullet("Left accent: w-1.5 self-stretch rounded-full in tier background color"))
story.append(bullet("Date: text-sm font-medium (e.g. 'Feb 21 - 23')"))
story.append(bullet("Summary text (text-xs text-muted-foreground):"))
story.append(sub_bullet("busyCount == 0: 'Everyone Free'"))
story.append(sub_bullet("freeCount == 0: 'All Busy'"))
story.append(sub_bullet("Mixed: '{freeCount} Free &middot; {busyCount} Busy'"))
story.append(sub_bullet("Append '&middot; {pendingCount} Pending' if pendingCount > 0"))

story.append(h3("8.4.3 Expandable Rows (Mixed Tiers Only)"))
story.append(bullet("Rows with tier MAJORITY_FREE or MIXED_NOT_MAJORITY are expandable (if both freeCount > 0 and busyCount > 0)"))
story.append(bullet("Expand indicator: ChevronRight (collapsed) / ChevronDown (expanded)"))
story.append(bullet("Expanded content: border-t separator, then two sub-rows:"))
story.append(sub_bullet("<b>Free:</b> green pill label + comma-separated names"))
story.append(sub_bullet("<b>Busy:</b> grey pill label + comma-separated names"))
story.append(bullet("Non-expandable rows: cursor-default, no chevron"))

story.append(h3("8.4.4 Sort Order"))
story.append(bullet("Primary: tier priority (Everyone Free &rarr; Majority Free &rarr; Mixed &rarr; All Busy)"))
story.append(bullet("Secondary: chronological by Friday date within each tier"))

story.append(h2("8.5 Empty State (No Aggregation)"))
story.append(bullet("TierSummaryBar shows: 'No availability added yet'"))
story.append(bullet("Calendar shows all weekends in neutral muted color"))
story.append(bullet("Weekend list shows: 'No availability added yet' + 'Weekend dates will appear once participants add their availability'"))
story.append(PageBreak())


# ======================================================================
# SECTION 9: Shared Components Reference
# ======================================================================
story.append(h1("9. Shared Components Reference"))
story.append(body(
    "All custom WAB components live in <font face='Courier' size=9>components/wab/</font>. "
    "They build on top of shadcn/ui primitives (Card, Button, Input, Select, Label, Badge)."
))

comp_table = make_table(
    ["Component", "File", "Props / Key Details"],
    [
        ["BoardHeader", "board-header.tsx", "Reads board from context. Shows name, date range, timezone."],
        ["TierBadge", "tier-badge.tsx", "Props: tier (TierType). Renders colored pill with tier label."],
        ["TierSummaryBar", "tier-summary-bar.tsx", "Props: summary, hasAggregation, pendingCount. Shows 4 tier chips + pending text."],
        ["ShareLinkCard", "share-link-card.tsx", "Reads board from context. Copy-to-clipboard share URL."],
        ["ParticipantList", "participant-list.tsx", "Reads participants from context. Shows count/cap, names, pending count."],
        ["SaveIndicator", "save-indicator.tsx", "Reads saveStatus from context. Idle/Saving/Saved states."],
        ["PersonalCalendar", "weekend-calendar.tsx", "Props: dateRange, busyFridays, weekendFridays, onToggle. Interactive."],
        ["GroupCalendar", "weekend-calendar.tsx", "Props: dateRange, weekends (WeekendRow[]), hasAggregation. Read-only."],
        ["WeekendListPersonal", "weekend-list-personal.tsx", "Props: busyFridays, onRemove. Chronological busy list."],
        ["WeekendListGroup", "weekend-list-group.tsx", "Props: weekends (WeekendRow[]), hasAggregation. Ranked, expandable."],
        ["ClaimCodeInput", "claim-code-input.tsx", "Props: onReclaim callback. Text input + submit."],
        ["AvailabilityTabs", "screen-nav.tsx", "Props: activeTab ('my' | 'group'). Segmented control."],
        ["ScreenNav", "screen-nav.tsx", "Fixed bottom nav. Reads board from context for URL construction."],
        ["ScenarioSwitcher", "scenario-switcher.tsx", "Floating FAB. Prototype-only. Switches mock data scenarios."],
    ],
    col_widths=[1.4*inch, 1.6*inch, 3.6*inch]
)
story.append(comp_table)
story.append(PageBreak())


# ======================================================================
# SECTION 10: Data Types
# ======================================================================
story.append(h1("10. Data Types & Shapes (Front-End Contract)"))
story.append(body(
    "These TypeScript types define the data shapes the front-end expects. "
    "In production, they map directly to the API response shapes defined in the MVP spec (Addendum B)."
))

story.append(h2("10.1 Board"))
story.append(code(
    "interface Board {<br/>"
    "&nbsp;&nbsp;boardId: string;          // UUID<br/>"
    "&nbsp;&nbsp;boardName: string;<br/>"
    "&nbsp;&nbsp;timezone: string;         // IANA timezone<br/>"
    "&nbsp;&nbsp;durationMonths: 1 | 3 | 6 | 12;<br/>"
    "&nbsp;&nbsp;dateRangeStart: string;   // ISO YYYY-MM-DD<br/>"
    "&nbsp;&nbsp;dateRangeEnd: string;     // ISO YYYY-MM-DD<br/>"
    "&nbsp;&nbsp;participantCap: number;   // fixed 5 for MVP<br/>"
    "&nbsp;&nbsp;joinToken: string;        // opaque, for share URL<br/>"
    "&nbsp;&nbsp;createdAt: string;        // ISO datetime UTC<br/>"
    "}"
))

story.append(h2("10.2 Participant"))
story.append(code(
    "type ParticipantState =<br/>"
    "&nbsp;&nbsp;| 'JOINED_NOT_INITIATED'<br/>"
    "&nbsp;&nbsp;| 'INITIATED_ZERO_BUSY'<br/>"
    "&nbsp;&nbsp;| 'ADDED_AVAILABILITY';<br/><br/>"
    "interface Participant {<br/>"
    "&nbsp;&nbsp;participantId: string;    // UUID<br/>"
    "&nbsp;&nbsp;boardId: string;          // FK<br/>"
    "&nbsp;&nbsp;displayName: string;<br/>"
    "&nbsp;&nbsp;claimCode: string;        // single word, case-insensitive<br/>"
    "&nbsp;&nbsp;state: ParticipantState;<br/>"
    "&nbsp;&nbsp;busyWeekendFridays: string[];  // array of Friday ISO dates<br/>"
    "&nbsp;&nbsp;joinedAt: string;<br/>"
    "&nbsp;&nbsp;lastUpdatedAt: string;<br/>"
    "}"
))

story.append(h2("10.3 WeekendRow (Aggregation Output)"))
story.append(code(
    "type TierType =<br/>"
    "&nbsp;&nbsp;| 'EVERYONE_FREE'<br/>"
    "&nbsp;&nbsp;| 'MAJORITY_FREE'<br/>"
    "&nbsp;&nbsp;| 'MIXED_NOT_MAJORITY'<br/>"
    "&nbsp;&nbsp;| 'ALL_BUSY';<br/><br/>"
    "interface WeekendRow {<br/>"
    "&nbsp;&nbsp;friday: string;      // ISO YYYY-MM-DD (Friday anchor)<br/>"
    "&nbsp;&nbsp;tier: TierType;<br/>"
    "&nbsp;&nbsp;freeCount: number;<br/>"
    "&nbsp;&nbsp;busyCount: number;<br/>"
    "&nbsp;&nbsp;pendingCount: number;<br/>"
    "&nbsp;&nbsp;freeNames: string[];  // only present for Mixed tiers<br/>"
    "&nbsp;&nbsp;busyNames: string[];  // only present for Mixed tiers<br/>"
    "}"
))

story.append(h2("10.4 AggregationSummary"))
story.append(code(
    "interface AggregationSummary {<br/>"
    "&nbsp;&nbsp;everyoneFreeCount: number;<br/>"
    "&nbsp;&nbsp;majorityFreeCount: number;<br/>"
    "&nbsp;&nbsp;mixedNotMajorityCount: number;<br/>"
    "&nbsp;&nbsp;allBusyCount: number;<br/>"
    "&nbsp;&nbsp;totalConsideredParticipants: number;<br/>"
    "}"
))

story.append(h2("10.5 Tier Definitions"))
tier_def_table = make_table(
    ["Tier", "Enum Value", "Condition (among ADDED_AVAILABILITY participants)"],
    [
        ["Everyone Free", "EVERYONE_FREE", "busyCount == 0 (100% free)"],
        ["Majority Free", "MAJORITY_FREE", "freeCount / totalAdded > 0.5 (>50% free, not 100%)"],
        ["Mixed Not Majority", "MIXED_NOT_MAJORITY", "freeCount / totalAdded > 0 AND <= 0.5"],
        ["All Busy", "ALL_BUSY", "freeCount == 0 (0% free)"],
    ],
    col_widths=[1.4*inch, 1.8*inch, 3.4*inch]
)
story.append(tier_def_table)
story.append(spacer(8))
story.append(note(
    "In production, tiers are computed by the backend and returned in the API response. "
    "The front-end must NOT independently derive tiers. The prototype computes them client-side "
    "for demonstration purposes only."
))
story.append(PageBreak())


# ======================================================================
# SECTION 11: State Management
# ======================================================================
story.append(h1("11. State Management Architecture"))

story.append(h2("11.1 Production Architecture"))
story.append(body(
    "In production, the front-end should use SWR (stale-while-revalidate) for data fetching and caching. "
    "Server state comes from the API endpoints; client state is minimal."
))
story.append(bullet("<b>Board data:</b> fetched via GET /api/boards/{boardId}, cached by SWR"))
story.append(bullet("<b>Participant data:</b> included in board response, plus specific participant data from join/reclaim"))
story.append(bullet("<b>Group aggregation:</b> fetched via GET /api/boards/{boardId}/group-availability"))
story.append(bullet("<b>Availability edits:</b> optimistic updates via SWR mutate, backed by PUT endpoint"))
story.append(bullet("<b>Session:</b> participantId stored in localStorage key '{boardId}:participantId'"))

story.append(h2("11.2 Prototype Architecture"))
story.append(body(
    "The prototype uses a React Context provider (PrototypeProvider) that holds all state in memory "
    "and provides mock data for 4 scenarios. No API calls are made."
))

story.append(h3("11.2.1 Context Shape"))
story.append(code(
    "interface PrototypeContextType {<br/>"
    "&nbsp;&nbsp;board: Board;<br/>"
    "&nbsp;&nbsp;participants: Participant[];<br/>"
    "&nbsp;&nbsp;currentParticipantId: string;<br/>"
    "&nbsp;&nbsp;weekendFridays: string[];<br/>"
    "&nbsp;&nbsp;scenarioName: ScenarioName;<br/>"
    "&nbsp;&nbsp;setScenario: (name: ScenarioName) =&gt; void;<br/>"
    "&nbsp;&nbsp;toggleBusyWeekend: (fridayIso: string) =&gt; void;<br/>"
    "&nbsp;&nbsp;addParticipant: (name: string) =&gt; void;<br/>"
    "&nbsp;&nbsp;isBoardFull: boolean;<br/>"
    "&nbsp;&nbsp;currentParticipant: Participant | undefined;<br/>"
    "&nbsp;&nbsp;saveStatus: 'idle' | 'saving' | 'saved';<br/>"
    "}"
))

story.append(h3("11.2.2 Key Operations"))
story.append(bullet("<b>toggleBusyWeekend:</b> Flips a Friday ISO date in/out of the current participant's busyWeekendFridays. Simulates autosave (800ms delay, then 'Saved' for 3s)."))
story.append(bullet("<b>addParticipant:</b> Adds a new participant to the scenario, assigns a random claim code, sets as current."))
story.append(bullet("<b>setScenario:</b> Replaces all state with a predefined scenario's data."))
story.append(PageBreak())


# ======================================================================
# SECTION 12: Interactions
# ======================================================================
story.append(h1("12. Interaction Behaviors & Micro-interactions"))

story.append(h2("12.1 Calendar Tap/Click"))
story.append(bullet("Target: any Fri/Sat/Sun cell in the planning window"))
story.append(bullet("Action: toggle the entire Fri-Sun block between free and busy"))
story.append(bullet("Visual feedback: instant color change (green tint &harr; coral fill)"))
story.append(bullet("Side effect: triggers 800ms debounced autosave"))

story.append(h2("12.2 Copy to Clipboard"))
story.append(bullet("Target: copy button in ShareLinkCard"))
story.append(bullet("Action: writes share URL to clipboard via navigator.clipboard"))
story.append(bullet("Visual feedback: icon changes from Copy to Check (green) for 2 seconds"))

story.append(h2("12.3 Weekend List Remove"))
story.append(bullet("Target: X button on a busy weekend row in WeekendListPersonal"))
story.append(bullet("Action: removes that Friday from busyWeekendFridays (same as toggling on calendar)"))
story.append(bullet("Visual feedback: row disappears, calendar updates"))

story.append(h2("12.4 Expandable Weekend Rows"))
story.append(bullet("Target: Mixed-tier rows in WeekendListGroup"))
story.append(bullet("Trigger: click/tap anywhere on the row"))
story.append(bullet("Visual feedback: ChevronRight rotates to ChevronDown, content slides in below"))
story.append(bullet("Expanded content: Free names (green label) + Busy names (grey label)"))

story.append(h2("12.5 Month Navigation"))
story.append(bullet("Target: left/right chevron buttons above calendar"))
story.append(bullet("Action: shifts the displayed month by 1"))
story.append(bullet("Disabled at boundary months (start/end of planning window)"))

story.append(h2("12.6 Autosave Flow (Production)"))
story.append(bullet("800ms debounce after last change"))
story.append(bullet("During save: SaveIndicator shows 'Saving...' with spinner"))
story.append(bullet("On success: shows 'Saved' with checkmark for 3 seconds"))
story.append(bullet("On failure: persistent banner with retry"))
story.append(PageBreak())


# ======================================================================
# SECTION 13: Accessibility
# ======================================================================
story.append(h1("13. Accessibility Requirements"))
story.append(bullet("All interactive elements are keyboard-focusable and operable"))
story.append(bullet("Calendar day buttons have type='button' to prevent form submission"))
story.append(bullet("Month navigation buttons have aria-label ('Previous month', 'Next month')"))
story.append(bullet("Copy button has aria-label='Copy link'"))
story.append(bullet("Remove buttons have aria-label='Remove {weekend range}'"))
story.append(bullet("Form inputs have associated Label elements via htmlFor/id"))
story.append(bullet("Form inputs use aria-invalid when validation fails"))
story.append(bullet("SaveIndicator uses aria-live='polite' for screen reader announcements"))
story.append(bullet("Semantic HTML: main, header, nav, form, button elements used correctly"))
story.append(bullet("Navigation bar uses aria-label='Screen navigation'"))
story.append(bullet("Color is never the sole indicator -- tier labels accompany colors everywhere"))
story.append(PageBreak())


# ======================================================================
# SECTION 14: Responsive Behavior
# ======================================================================
story.append(h1("14. Responsive Behavior"))
story.append(body(
    "The app is designed mobile-first with a max-width content area. No breakpoint-specific layouts are needed "
    "for MVP -- the single-column layout works from 320px to desktop widths."
))
story.append(bullet("<b>Content area:</b> max-w-md (448px), centered via mx-auto"))
story.append(bullet("<b>Minimum supported width:</b> 320px"))
story.append(bullet("<b>Calendar grid:</b> 7 equal columns, day cells use aspect-square for consistent sizing"))
story.append(bullet("<b>Bottom nav:</b> fixed bottom, full-width, items justified evenly"))
story.append(bullet("<b>Cards:</b> full-width within content area, no side margins"))
story.append(bullet("<b>Viewport meta:</b> width=device-width, initial-scale=1, maximum-scale=1, user-scalable=false"))
story.append(bullet("<b>Theme color:</b> #f5f0e8 (warm off-white, matches background)"))
story.append(PageBreak())


# ======================================================================
# SECTION 15: Edge Cases
# ======================================================================
story.append(h1("15. Edge Cases & Empty States"))

story.append(h2("15.1 Empty States Summary"))
empty_table = make_table(
    ["Component / Screen", "Condition", "Display"],
    [
        ["ParticipantList", "0 participants", "Users icon + 'No participants yet'"],
        ["TierSummaryBar", "hasAggregation == false", "'No availability added yet' centered in muted box"],
        ["WeekendListPersonal", "0 busy weekends", "'No busy weekends selected' + helper text"],
        ["WeekendListGroup", "hasAggregation == false", "'No availability added yet' + helper text"],
        ["GroupCalendar", "No aggregation", "All weekends in neutral muted color (no tier colors)"],
        ["My Availability", "No current participant", "Calendar still renders; no busy selections shown"],
        ["Claim Code Input", "Empty submission", "'Please enter your claim code'"],
    ],
    col_widths=[1.8*inch, 1.6*inch, 3.2*inch]
)
story.append(empty_table)
story.append(spacer(12))

story.append(h2("15.2 Boundary Conditions"))
story.append(bullet("<b>Cross-month weekends:</b> A Friday in March with Sunday in April is handled -- date range formatting adapts (e.g. 'Mar 28 - Apr 1')"))
story.append(bullet("<b>1-month window:</b> Calendar starts and ends on the same month, nav buttons both disabled"))
story.append(bullet("<b>12-month window:</b> Up to ~52 weekends in the ranked list; no virtualization needed at this scale"))
story.append(bullet("<b>Board at exactly 5 participants:</b> Join form replaced by Board Full + reclaim UI"))
story.append(bullet("<b>Duplicate display name:</b> Blocked with inline error, user directed to reclaim"))
story.append(bullet("<b>All 5 participants busy on same weekend:</b> Weekend renders as ALL_BUSY tier, grey color"))
story.append(bullet("<b>All weekends free for everyone:</b> All weekends render EVERYONE_FREE, green color, no expandable rows"))
story.append(PageBreak())


# ======================================================================
# SECTION 16: Prototype Scenarios
# ======================================================================
story.append(h1("16. Prototype Scenario Matrix"))
story.append(body(
    "The prototype includes a floating Scenario Switcher (gear icon, bottom-right) that swaps all state "
    "between 4 predefined scenarios. This allows reviewers to see every edge case without manual setup."
))

scenario_table = make_table(
    ["Scenario", "Participants", "Availability", "Demonstrates"],
    [
        ["Empty", "0 / 5", "None", "All empty states, no aggregation, neutral calendars"],
        ["Partial (3/5)", "3 / 5 joined (2 with avail, 1 pending)", "2 have busy weekends selected", "Mixed aggregation, pending counts, expandable rows, tier colors"],
        ["Full (5/5)", "5 / 5 joined, all ADDED_AVAILABILITY", "Various busy patterns", "All 4 tier types visible, full aggregation, ranked list"],
        ["Board Full", "5 / 5 (new user not joined)", "Same as Full", "Board Full join-blocked state, claim code reclaim flow"],
    ],
    col_widths=[1*inch, 1.8*inch, 1.5*inch, 2.3*inch]
)
story.append(scenario_table)
story.append(spacer(12))

story.append(h2("16.1 Mock Data Generation"))
story.append(bullet("Board: 'Summer Hangouts', 3-month window from current month, timezone from browser"))
story.append(bullet("Weekends: dynamically computed from the board's date range using date-fns"))
story.append(bullet("Participant names: Alex (you), Jordan, Sam, Taylor, Casey"))
story.append(bullet("Claim codes: drawn from fixed word list (mountain, sunset, ocean, etc.)"))
story.append(bullet("Busy selections: deterministic indices into the weekend array for reproducible scenarios"))
story.append(spacer(24))
story.append(hr())
story.append(spacer(8))
story.append(Paragraph(
    "<b>End of Document</b><br/>"
    "This specification is standalone and sufficient for any AI coding agent to build the complete "
    "front-end of the Weekend Availability Board. Backend API integration, database setup, and "
    "QA test suites are defined in separate companion documents.",
    ParagraphStyle("Closing", parent=styles["Body"], alignment=TA_CENTER, textColor=HexColor("#6b6050"))
))

# ---------- Build PDF ----------
doc.build(story)
print(f"PDF generated at: {pdf_path}")
