"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer, ArrowLeft } from "lucide-react"
import Link from "next/link"

/* ── tiny inline helpers ─────────────────────────────── */
function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return <section id={id} className="flex flex-col gap-3 print:break-inside-avoid">{children}</section>
}
function H1({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold tracking-tight text-foreground pt-4 border-b border-border pb-2">{children}</h2>
}
function H2({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-foreground pt-2">{children}</h3>
}
function H3({ children }: { children: React.ReactNode }) {
  return <h4 className="text-sm font-semibold text-foreground/80 pt-1">{children}</h4>
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-foreground/80">{children}</p>
}
function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-1.5 pl-5 list-disc marker:text-foreground/30">{children}</ul>
}
function Li({ children }: { children: React.ReactNode }) {
  return <li className="text-sm leading-relaxed text-foreground/80">{children}</li>
}
function SubUl({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-1 pl-5 list-[circle] marker:text-foreground/20 mt-1">{children}</ul>
}
function Code({ children }: { children: React.ReactNode }) {
  return <pre className="text-xs font-mono bg-muted/60 border border-border/50 rounded-lg p-3 overflow-x-auto whitespace-pre leading-relaxed text-foreground/80">{children}</pre>
}
function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-muted/60 px-1.5 py-0.5 rounded text-foreground/80">{children}</code>
}
function Note({ children }: { children: React.ReactNode }) {
  return <div className="text-xs italic text-muted-foreground bg-muted/40 border border-border/30 rounded-lg px-3 py-2">{children}</div>
}
function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="size-4 rounded-sm border border-border/50 shrink-0" style={{ background: color }} />
      <span className="text-xs text-foreground/70">{label}</span>
    </div>
  )
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-3 py-2 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-card" : "bg-muted/30"}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-foreground/80 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════ */

export default function SpecPage() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-4 mr-1.5" />
              Prototype
            </Button>
          </Link>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="size-4 mr-1.5" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Document body */}
      <main ref={ref} className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6 print:px-0 print:py-0">

        {/* ─── TITLE ─── */}
        <header className="flex flex-col gap-2 pb-4 border-b border-border">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Weekend Availability Board</h1>
          <p className="text-base text-foreground/60">Front-End UX/UI Specification</p>
          <p className="text-sm text-foreground/50 leading-relaxed">
            Standalone front-end specification for AI coding agents. Covers all screens, components,
            interactions, state management, styling, and data contracts. Excludes backend API implementation,
            database setup, and QA test suites.
          </p>
          <div className="flex flex-col gap-0.5 text-xs text-foreground/50 pt-2">
            <span><strong className="text-foreground/70">Version:</strong> 1.1 (updated)</span>
            <span><strong className="text-foreground/70">Date:</strong> February 23, 2026</span>
            <span><strong className="text-foreground/70">Source:</strong> Weekend Availability Board MVP Spec v4 (with Addenda A-D) + UX iteration feedback</span>
            <span><strong className="text-foreground/70">Scope:</strong> Front-end only: screens, components, interactions, styling, data shapes</span>
            <span><strong className="text-foreground/70">Out of Scope:</strong> Backend API, database schema, QA test suites</span>
            <span><strong className="text-foreground/70">Target Stack:</strong> Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui</span>
            <span><strong className="text-foreground/70">Font:</strong> Geist (sans), Geist Mono (mono)</span>
          </div>
        </header>

        {/* ─── TOC ─── */}
        <Section>
          <H1>Table of Contents</H1>
          <nav>
            <ol className="flex flex-col gap-1 pl-5 list-decimal marker:text-foreground/30 text-sm text-foreground/70">
              <li><a href="#s1" className="hover:text-foreground underline underline-offset-2">Product Overview &amp; Scope Boundary</a></li>
              <li><a href="#s2" className="hover:text-foreground underline underline-offset-2">Design System: Color Tokens, Typography &amp; Spacing</a></li>
              <li><a href="#s3" className="hover:text-foreground underline underline-offset-2">Route Map, Navigation &amp; Access Gating</a></li>
              <li><a href="#s4" className="hover:text-foreground underline underline-offset-2">Screen 1: Create Board</a></li>
              <li><a href="#s5" className="hover:text-foreground underline underline-offset-2">Screen 2: Creator Join (Share)</a></li>
              <li><a href="#s6" className="hover:text-foreground underline underline-offset-2">Screen 3: Participant Join</a></li>
              <li><a href="#s7" className="hover:text-foreground underline underline-offset-2">Screen 4: My Availability</a></li>
              <li><a href="#s8" className="hover:text-foreground underline underline-offset-2">Screen 5: Group Availability</a></li>
              <li><a href="#s9" className="hover:text-foreground underline underline-offset-2">Shared Components Reference</a></li>
              <li><a href="#s10" className="hover:text-foreground underline underline-offset-2">Data Types &amp; Shapes (Front-End Contract)</a></li>
              <li><a href="#s11" className="hover:text-foreground underline underline-offset-2">State Management Architecture</a></li>
              <li><a href="#s12" className="hover:text-foreground underline underline-offset-2">Interaction Behaviors &amp; Micro-interactions</a></li>
              <li><a href="#s13" className="hover:text-foreground underline underline-offset-2">Accessibility Requirements</a></li>
              <li><a href="#s14" className="hover:text-foreground underline underline-offset-2">Responsive Behavior</a></li>
              <li><a href="#s15" className="hover:text-foreground underline underline-offset-2">Edge Cases &amp; Empty States</a></li>
              <li><a href="#s16" className="hover:text-foreground underline underline-offset-2">Prototype Scenario Matrix</a></li>
            </ol>
          </nav>
        </Section>

        {/* ═══ SECTION 1 ═══ */}
        <Section id="s1">
          <H1>1. Product Overview &amp; Scope Boundary</H1>
          <P>
            The Weekend Availability Board (WAB) helps a small, private group of 1-5 people find the best
            weekends to get together. The creator specifies the number of participants (1-5) when creating the board. Each participant marks which weekends they are <strong>busy</strong> (exceptions-first
            model -- all weekends default to free). The app then aggregates everyone&apos;s availability into a
            color-coded, tier-ranked view showing which weekends have the most people free.
          </P>
          <P>The app does <strong>not</strong> schedule events. It only identifies optimal weekends.</P>

          <H2>1.1 Front-End Scope</H2>
          <Ul>
            <Li>5 screens: Create Board, Creator Join (Share), Participant Join, My Availability, Group Availability</Li>
            <Li>Two distinct user flows: <strong>Creator</strong> (Create &rarr; Share &rarr; My Avail. &rarr; Group) and <strong>Participant</strong> (Join &rarr; My Avail. &rarr; Group)</Li>
            <Li>Role-based navigation with access gating per flow</Li>
            <Li>Reusable component library for calendar, lists, tier badges, and navigation</Li>
            <Li>Client-side state management wired to API data shapes</Li>
            <Li>Autosave with debounce, retry, and failure UI</Li>
            <Li>Responsive mobile-first layout (max-width 448px content area)</Li>
          </Ul>

          <H2>1.2 Explicitly Out of Scope for This Document</H2>
          <Ul>
            <Li>Backend API implementation (endpoints are referenced by contract shape only)</Li>
            <Li>Database schema, migrations, or storage layer</Li>
            <Li>QA test suites, E2E tests, or unit test files</Li>
            <Li>Authentication, email, push notifications, calendar integrations</Li>
            <Li>Dark mode (light mode only for MVP)</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 2 ═══ */}
        <Section id="s2">
          <H1>2. Design System: Color Tokens, Typography &amp; Spacing</H1>

          <H2>2.1 Color Palette</H2>
          <P>
            The app uses a warm, approachable palette with oklch color values defined as CSS custom properties.
            All colors are referenced via Tailwind CSS design tokens -- never hardcoded hex/rgb values.
          </P>
          <DataTable
            headers={["Token Name", "oklch Value", "Usage"]}
            rows={[
              ["--background", "oklch(0.98 0.003 80)", "Page background, warm off-white"],
              ["--foreground", "oklch(0.18 0.02 50)", "Primary text, dark warm brown"],
              ["--card", "oklch(0.995 0.001 80)", "Card/surface background"],
              ["--primary", "oklch(0.30 0.04 50)", "Primary buttons, dark brown"],
              ["--primary-foreground", "oklch(0.98 0.003 80)", "Text on primary buttons"],
              ["--muted", "oklch(0.94 0.005 80)", "Muted backgrounds"],
              ["--muted-foreground", "oklch(0.50 0.01 50)", "Secondary text"],
              ["--border", "oklch(0.90 0.008 80)", "Card/input borders, warm beige"],
              ["--destructive", "oklch(0.577 0.245 27.325)", "Error text/icons"],
            ]}
          />

          <H3>2.1.1 Tier Color Tokens</H3>
          <P>
            These are the core visual identity of the app. They are used on calendar day cells, tier badge pills,
            summary bar chips, and weekend list row accents.
          </P>
          <div className="grid grid-cols-2 gap-3">
            <ColorSwatch color="oklch(0.65 0.17 150)" label="Everyone Free -- vivid green" />
            <ColorSwatch color="oklch(0.20 0.06 150)" label="Everyone Free fg -- dark green" />
            <ColorSwatch color="oklch(0.72 0.08 145)" label="Majority Free -- soft sage" />
            <ColorSwatch color="oklch(0.22 0.04 145)" label="Majority Free fg -- dark sage" />
            <ColorSwatch color="oklch(0.78 0.06 80)" label="Mixed -- warm amber" />
            <ColorSwatch color="oklch(0.30 0.03 60)" label="Mixed fg -- dark amber" />
            <ColorSwatch color="oklch(0.70 0.01 0)" label="All Busy -- neutral grey" />
            <ColorSwatch color="oklch(0.30 0.01 0)" label="All Busy fg -- dark grey" />
            <ColorSwatch color="oklch(0.70 0.14 25)" label="Busy Personal -- coral/salmon" />
            <ColorSwatch color="oklch(0.98 0.003 80)" label="Busy Personal fg -- white on coral" />
          </div>
          <DataTable
            headers={["Tier", "Token", "oklch Value"]}
            rows={[
              ["Everyone Free", "--tier-everyone-free", "oklch(0.65 0.17 150)"],
              ["Everyone Free (fg)", "--tier-everyone-free-foreground", "oklch(0.20 0.06 150)"],
              ["Majority Free", "--tier-majority-free", "oklch(0.72 0.08 145)"],
              ["Majority Free (fg)", "--tier-majority-free-foreground", "oklch(0.22 0.04 145)"],
              ["Mixed", "--tier-mixed", "oklch(0.78 0.06 80)"],
              ["Mixed (fg)", "--tier-mixed-foreground", "oklch(0.30 0.03 60)"],
              ["All Busy", "--tier-all-busy", "oklch(0.70 0.01 0)"],
              ["All Busy (fg)", "--tier-all-busy-foreground", "oklch(0.30 0.01 0)"],
              ["Busy (Personal)", "--tier-busy-personal", "oklch(0.70 0.14 25)"],
              ["Busy (Personal fg)", "--tier-busy-personal-foreground", "oklch(0.98 0.003 80)"],
            ]}
          />

          <H2>2.2 Typography</H2>
          <Ul>
            <Li><strong>Font families:</strong> Geist (sans-serif, primary), Geist Mono (monospace, claim codes)</Li>
            <Li><strong>Tailwind classes:</strong> <InlineCode>font-sans</InlineCode>, <InlineCode>font-mono</InlineCode></Li>
            <Li><strong>Heading scale:</strong> 2xl (24px) for page titles, base (16px) for card titles, sm (14px) for section labels</Li>
            <Li><strong>Body text:</strong> sm (14px) primary content, xs (12px) secondary/helper text, [10px] for navigation labels</Li>
            <Li><strong>Line height:</strong> relaxed (1.5) for body, tight for headings</Li>
          </Ul>

          <H2>2.3 Spacing &amp; Layout</H2>
          <Ul>
            <Li><strong>Border radius:</strong> 0.75rem (--radius), used via Tailwind <InlineCode>rounded-lg</InlineCode></Li>
            <Li><strong>Content max-width:</strong> <InlineCode>max-w-md</InlineCode> (28rem / 448px), centered with <InlineCode>mx-auto</InlineCode></Li>
            <Li><strong>Page padding:</strong> px-4 (16px horizontal), py-6 (24px vertical)</Li>
            <Li><strong>Card padding:</strong> Uses shadcn Card defaults (p-6 on CardContent)</Li>
            <Li><strong>Spacing between sections:</strong> gap-3 (12px) on Join page, gap-5 (20px) on other pages</Li>
            <Li><strong>Bottom padding for nav:</strong> pb-20 (80px) on all pages to clear fixed bottom nav</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 3 ═══ */}
        <Section id="s3">
          <H1>3. Route Map, Navigation &amp; Access Gating</H1>

          <H2>3.1 Canonical Routes</H2>
          <DataTable
            headers={["Route", "Page", "Description"]}
            rows={[
              ["/", "Create Board", "Entry point. Form to name a board, set participant count, and select planning window."],
              ["/boards/{boardId}/creator-join", "Creator Join (Share)", "Post-creation landing. Share link + board overview + claim code."],
              ["/boards/{boardId}/participant-join", "Participant Join", "Join form (or Board Full + reclaim). Accessed via share link."],
              ["/boards/{boardId}/my-availability", "My Availability", "Personal calendar to mark busy weekends. Autosave."],
              ["/boards/{boardId}/group-availability", "Group Availability", "Tier-colored group calendar + ranked weekend list."],
            ]}
          />

          <H2>3.2 Two Distinct User Flows</H2>
          <P>The app has two separate navigation paths depending on the user&apos;s role. The bottom navigation bar shows different links for each.</P>

          <H3>3.2.1 Creator Flow</H3>
          <Ul>
            <Li><strong>Nav links:</strong> Create (Home icon) &rarr; Share (Share2 icon) &rarr; My Avail. (CalendarCheck icon) &rarr; Group (Users icon)</Li>
            <Li><strong>Create Board submit</strong> &rarr; redirect to <InlineCode>{"/boards/{boardId}/creator-join"}</InlineCode></Li>
            <Li><strong>{"Creator Join: 'Add My Availability'"}</strong> &rarr; navigates to <InlineCode>/my-availability</InlineCode></Li>
            <Li><strong>My Availability &harr; Group View:</strong> AvailabilityTabs segmented control at top of both pages</Li>
          </Ul>

          <H3>3.2.2 Participant Flow</H3>
          <Ul>
            <Li><strong>Nav links:</strong> Join (UserPlus icon) &rarr; My Avail. (CalendarCheck icon) &rarr; Group (Users icon)</Li>
            <Li><strong>{"Participant Join: 'Join Board' submit"}</strong> &rarr; redirect to <InlineCode>/my-availability</InlineCode></Li>
            <Li><strong>Reclaim (claim code valid)</strong> &rarr; ADDED_AVAILABILITY state goes to <InlineCode>/group-availability</InlineCode>; otherwise <InlineCode>/my-availability</InlineCode></Li>
            <Li><strong>My Availability &harr; Group View:</strong> Same AvailabilityTabs as creator flow</Li>
          </Ul>

          <H2>3.3 Access Gating (BoardGate Component)</H2>
          <P>The <InlineCode>BoardGate</InlineCode> component wraps pages that require prior context. It checks the user&apos;s state and shows a friendly prompt if preconditions are not met.</P>
          <DataTable
            headers={["Role", "Condition", "Gate Behavior"]}
            rows={[
              ["Creator", "Board not yet created", "Shows 'No board yet' card with link to Create page"],
              ["Participant", "Not joined and not reclaimed", "Shows 'Join the board first' card with link to Join page"],
              ["Participant", "Already joined or recognized as existing participant", "Passes through -- no gate shown"],
              ["Either", "All preconditions met", "Renders child page content normally"],
            ]}
          />
          <Note>A participant who has previously joined the board (their participantId exists in the participant list) bypasses the gate automatically. The gate only blocks unknown visitors who have never joined or authenticated via claim code.</Note>

          <H2>3.4 Bottom Navigation Bar</H2>
          <Ul>
            <Li>Fixed position: bottom-0, z-40, bg-card with border-t</Li>
            <Li>Role-aware: shows 4 links for creator, 3 links for participant</Li>
            <Li>Active state: text-foreground; Inactive: text-muted-foreground</Li>
            <Li>Icon size: 16px (size-4). Label: 10px font, max-width 56px truncated</Li>
            <Li>Waits for client hydration before rendering to prevent role flash</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 4 ═══ */}
        <Section id="s4">
          <H1>4. Screen 1: Create Board</H1>
          <P>The entry point of the application. A centered card form for naming the board, setting participant count, and selecting the planning window.</P>

          <H2>4.1 Layout</H2>
          <Ul>
            <Li>Centered vertically and horizontally: <InlineCode>min-h-screen flex flex-col items-center justify-center</InlineCode></Li>
            <Li>Max width: max-w-md (448px)</Li>
            <Li>Header section above card: app icon (CalendarDays in a 48px rounded square), title, subtitle</Li>
          </Ul>

          <H2>4.2 Form Fields</H2>
          <DataTable
            headers={["Field", "Type", "Placeholder", "Validation", "Helper Text"]}
            rows={[
              ["Board Name", "Text input", "e.g. Summer Hangouts", "Required, non-empty", "None"],
              ["Participants", "Select dropdown (1-5)", "Select number", "Required", "'How many people will be coordinating (1-5).'"],
              ["Planning Window", "Select dropdown", "Select duration", "Required (default: 3)", "'Full calendar months from today.'"],
            ]}
          />

          <H3>4.2.1 Participants Options</H3>
          <Ul>
            <Li>Values: 1, 2, 3, 4, 5 (whole numbers only)</Li>
            <Li>No default -- user must actively select</Li>
            <Li>Sets the <InlineCode>participantCap</InlineCode> on the created board</Li>
          </Ul>

          <H3>4.2.2 Planning Window Options</H3>
          <Ul>
            <Li>Next 1 month</Li>
            <Li>Next 3 months (default)</Li>
            <Li>Next 6 months</Li>
            <Li>Next 12 months</Li>
          </Ul>

          <H2>4.3 Card Title</H2>
          <P>The card title reads <strong>{'"Create a Group Board"'}</strong>.</P>

          <H2>4.4 Submit Button</H2>
          <Ul>
            <Li>{"Label: 'Create Board'"}</Li>
            <Li>{"Full width, size='lg' (large), primary variant"}</Li>
            <Li>{"On click: validate all 3 fields, then POST /api/boards, then redirect to /boards/{boardId}/creator-join"}</Li>
          </Ul>

          <H2>4.5 Error States</H2>
          <Ul>
            <Li>{"Empty board name: inline red text 'Board name is required' below the input"}</Li>
            <Li>{"No participants selected: inline red text 'Number of participants is required'"}</Li>
            <Li>API error: display error message below form</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 5 ═══ */}
        <Section id="s5">
          <H1>5. Screen 2: Creator Join (Share)</H1>
          <P>Displayed immediately after board creation. Shows the share link, board overview, the creator&apos;s claim code, and a CTA to add availability.</P>

          <H2>5.1 Layout</H2>
          <Ul>
            <Li>{"Vertical stack: BoardHeader \u2192 ShareLinkCard \u2192 Board Overview Card \u2192 Claim Code Card \u2192 CTA Button"}</Li>
            <Li>Max-width: max-w-md, px-4, py-6</Li>
            <Li>Wrapped in <InlineCode>BoardGate</InlineCode> -- shows gate if board not yet created</Li>
          </Ul>

          <H2>5.2 Components Used</H2>

          <H3>5.2.1 BoardHeader</H3>
          <Ul>
            <Li>Board name as h1 (text-2xl font-semibold) -- shows the name entered by the creator on the Create page</Li>
            <Li>Date range with CalendarDays icon + timezone with Globe icon</Li>
            <Li>Metadata line: text-sm text-muted-foreground, flex-wrap with gap-x-4</Li>
          </Ul>

          <H3>5.2.2 ShareLinkCard</H3>
          <Ul>
            <Li>Card with border-dashed style</Li>
            <Li>{"Header: Link icon + 'Share this link with your group' (text-sm font-medium)"}</Li>
            <Li>URL display: truncated, monospace, bg-muted, rounded, select-all</Li>
            <Li>Copy button: outline variant, icon-only, toggles Check icon for 2 seconds on success</Li>
            <Li>URL format: <InlineCode>{"{origin}/boards/{boardId}/participant-join?joinToken={joinToken}"}</InlineCode></Li>
          </Ul>

          <H3>5.2.3 Board Overview Card</H3>
          <Ul>
            <Li>{"Card with title 'Board Overview'"}</Li>
            <Li>Contains: TierSummaryBar + ParticipantList</Li>
          </Ul>

          <H3>5.2.4 Claim Code Card</H3>
          <Ul>
            <Li>{"Muted/dashed card showing KeyRound icon + 'Your claim code' label + the code in font-mono font-semibold"}</Li>
            <Li>Only shown when a current participant exists</Li>
          </Ul>

          <H3>5.2.5 CTA Button</H3>
          <Ul>
            <Li>{"Link styled as Button, size='lg', full width"}</Li>
            <Li>{"Label: 'Add My Availability' with CalendarPlus icon"}</Li>
            <Li>{"Navigates to /boards/{boardId}/my-availability"}</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 6 ═══ */}
        <Section id="s6">
          <H1>6. Screen 3: Participant Join</H1>
          <P>Accessed via the shared link. The board overview is shown first, followed by either a join form (when open spots exist) or a Board Full state with claim code reclaim.</P>

          <H2>6.1 Layout</H2>
          <Ul>
            <Li>{"Vertical stack: BoardHeader \u2192 Board Overview Card \u2192 Join Card (or Board Full Card)"}</Li>
            <Li><strong>Board Overview card appears above the Join card</strong> -- so newcomers see who&apos;s on the board before deciding to join</Li>
            <Li>Spacing: gap-3 (12px) for tighter card stacking</Li>
            <Li>Does NOT show the shareable URL (unlike Creator Join)</Li>
          </Ul>

          <H2>6.2 Board Overview Card</H2>
          <Ul>
            <Li>Same as Creator Join: TierSummaryBar + ParticipantList</Li>
            <Li>Shown in BOTH the join and board-full states</Li>
          </Ul>

          <H2>6.3 Join Form (Board Not Full)</H2>
          <Ul>
            <Li>{"Card title: 'Join this Board'"}</Li>
            <Li>{"Description: 'Enter your name to join. You'll be able to mark your busy weekends next.'"}</Li>
            <Li>{"Field: Display Name text input, placeholder 'e.g. Alex'"}</Li>
            <Li>{"Submit button: 'Join Board', full width, primary variant"}</Li>
            <Li>Validation: name required, name must not be taken (case-insensitive)</Li>
            <Li>{"On success: POST /api/boards/{boardId}/participants, store participantId, redirect to /my-availability"}</Li>
          </Ul>

          <H3>6.3.1 Previously Joined? (Reclaim within Join Form)</H3>
          <P>Below the Join button, a secondary <InlineCode>ghost</InlineCode> button labeled <strong>{'"Previously Joined?"'}</strong> allows returning users to reclaim their spot without the board being full.</P>
          <Ul>
            <Li>Button: variant=ghost, size=sm, text-muted-foreground, full width</Li>
            <Li>Separated from the join form by a <InlineCode>border-t</InlineCode> divider with mt-4 pt-4</Li>
            <Li>On click: toggles open a claim code section below</Li>
            <Li>{"Expanded section: helper text 'Enter the claim code you were given when you first joined.' + ClaimCodeInput component"}</Li>
            <Li>On valid code: same routing as board-full reclaim (ADDED_AVAILABILITY &rarr; group, otherwise &rarr; my-availability)</Li>
            <Li>{"On invalid code: inline error 'Invalid claim code. Please try again.'"}</Li>
          </Ul>

          <H2>6.4 Board Full State</H2>
          <Ul>
            <Li>{"Card title: AlertCircle icon + 'Board is Full'"}</Li>
            <Li>{"Description: 'This board already has {cap} participants. If you were already part of this board, use your claim code below.'"}</Li>
            <Li>ClaimCodeInput component replaces the join form</Li>
            <Li>{"On valid code: route based on participant state"}</Li>
            <Li>{"On invalid code: inline error 'Invalid claim code. Please try again.'"}</Li>
          </Ul>

          <H2>6.5 Error States</H2>
          <Ul>
            <Li>{"Empty name: 'Display name is required'"}</Li>
            <Li>{"Name taken: 'That name is already taken. Use your claim code to reclaim.'"}</Li>
            <Li>{"Invalid claim code: 'Invalid claim code. Please try again.'"}</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 7 ═══ */}
        <Section id="s7">
          <H1>7. Screen 4: My Availability</H1>
          <P>The personal availability editor. Users tap weekend days (Fri/Sat/Sun) on a custom calendar to toggle them as busy. Below the calendar is a chronological list of busy weekends.</P>
          <P>This page is wrapped in <InlineCode>BoardGate</InlineCode> -- creators must have created a board, participants must have joined or reclaimed.</P>

          <H2>7.1 Layout</H2>
          <Ul>
            <Li>{"Vertical stack: BoardHeader \u2192 AvailabilityTabs \u2192 Instructions + SaveIndicator \u2192 Calendar Card \u2192 WeekendListPersonal \u2192 User Info Footer"}</Li>
          </Ul>

          <H2>7.2 AvailabilityTabs</H2>
          <P>A segmented control that switches between &quot;My Availability&quot; and &quot;Group View&quot;. This is a shared component also used on the Group Availability page.</P>
          <Ul>
            <Li>Container: rounded-lg bg-muted p-1 gap-1, flex row</Li>
            <Li>Active tab: bg-card text-foreground shadow-sm</Li>
            <Li>Inactive tab: text-muted-foreground hover:text-foreground</Li>
            <Li>{"Tab labels: 'My Availability' | 'Group View'"}</Li>
          </Ul>

          <H2>7.3 Instructions Line</H2>
          <Ul>
            <Li>{"Body text: 'Tap weekend days to mark them as busy. Everything else stays free.'"}</Li>
            <Li>SaveIndicator floated to the right</Li>
          </Ul>

          <H2>7.4 PersonalCalendar</H2>
          <P>A fully custom calendar (not using react-day-picker) that renders a month grid with navigable month-by-month controls. Weekend days (Fri/Sat/Sun) are interactive buttons.</P>

          <H3>7.4.1 Month Navigation</H3>
          <Ul>
            <Li>Left/right chevron buttons at top</Li>
            <Li>{"Month name + year centered between them (e.g. 'February 2026')"}</Li>
            <Li>{"Navigation bounded by the board's dateRangeStart and dateRangeEnd"}</Li>
            <Li>Disabled when at boundary month</Li>
          </Ul>

          <H3>7.4.2 Day Grid</H3>
          <Ul>
            <Li>7-column grid (Sun-Sat), weekday labels at top</Li>
            <Li><strong>Weekday cells (Mon-Thu):</strong> non-interactive, text-muted-foreground/30, very faded</Li>
            <Li><strong>Out-of-month cells:</strong> non-interactive, text-muted-foreground/20</Li>
            <Li><strong>Weekend cells (Fri/Sat/Sun) -- Free state:</strong> bg-tier-everyone-free/15, interactive button</Li>
            <Li><strong>Weekend cells (Fri/Sat/Sun) -- Busy state:</strong> bg-tier-busy-personal text-tier-busy-personal-foreground (coral fill, white text)</Li>
            <Li><strong>Fri-Sun block shaping:</strong> Friday gets rounded-l-lg, Sunday gets rounded-r-lg, creating a visual 3-day block</Li>
            <Li><strong>Tap behavior:</strong> Tapping any day in a Fri-Sun block toggles the entire block&apos;s busy state</Li>
          </Ul>

          <H3>7.4.3 Calendar Aspect Ratio</H3>
          <Ul>
            <Li>Each day cell: aspect-square (1:1), filling the column width</Li>
            <Li>Text: text-sm font-medium, centered</Li>
          </Ul>

          <H2>7.5 WeekendListPersonal</H2>
          <Ul>
            <Li>{"Header: 'Busy Weekends ({count})' in xs uppercase tracking-wider"}</Li>
            <Li>{"Each row: weekend range (e.g. 'Feb 21 - 23'), with X remove button"}</Li>
            <Li>Row background: bg-tier-busy-personal/10 (subtle coral)</Li>
            <Li>Remove button: ghost variant, icon-only, X icon (size 14px)</Li>
            <Li>List order: chronological (sorted by Friday date)</Li>
            <Li><strong>Empty state:</strong> {"centered text 'No busy weekends selected' with sub-text 'Tap weekends on the calendar to mark them as busy'"}</Li>
          </Ul>

          <H2>7.6 SaveIndicator</H2>
          <Ul>
            <Li>Appears inline in the instructions row</Li>
            <Li><strong>Idle:</strong> opacity-0 (invisible)</Li>
            <Li><strong>Saving:</strong> {"Loader2 spinning icon + 'Saving...' in muted text"}</Li>
            <Li><strong>Saved:</strong> {"Check icon (green) + 'Saved' in green text, fades after 3 seconds"}</Li>
            <Li>{"Uses aria-live='polite' for screen reader announcements"}</Li>
          </Ul>

          <H2>7.7 User Info Footer</H2>
          <Ul>
            <Li>{"Text: 'Logged in as {name} \u00B7 Claim code: {code}'"}</Li>
            <Li>Centered, xs text, muted color</Li>
          </Ul>

          <H2>7.8 Autosave Behavior (Implementation Notes for Wiring)</H2>
          <Ul>
            <Li>Trigger: 800ms debounce after any toggle</Li>
            <Li>Payload: full replacement of busyWeekendFridays array</Li>
            <Li>{"On failure: persistent banner 'Not saved. Retrying...' with 'Retry now' button"}</Li>
            <Li>Auto-retry: every 5 seconds, cap at 30 seconds (6 attempts)</Li>
            <Li>After retry cap: clear session, redirect to /participant-join</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 8 ═══ */}
        <Section id="s8">
          <H1>8. Screen 5: Group Availability</H1>
          <P>The aggregated group view. Shows a tier-colored calendar where each weekend is colored by its availability tier, plus a ranked list of all weekends sorted by best-to-worst availability.</P>
          <P>This page is wrapped in <InlineCode>BoardGate</InlineCode> -- same gating rules as My Availability.</P>

          <H2>8.1 Layout</H2>
          <Ul>
            <Li>{"Vertical stack: BoardHeader \u2192 AvailabilityTabs (active='group') \u2192 TierSummaryBar \u2192 Group Calendar Card \u2192 Ranked Weekend List"}</Li>
          </Ul>

          <H2>8.2 TierSummaryBar</H2>
          <P>A row of color-coded pill chips showing the count of weekends in each tier.</P>
          <Ul>
            <Li>{"4 chips: {count} Everyone Free | {count} Majority Free | {count} Mixed | {count} All Busy"}</Li>
            <Li>Each chip: rounded-full px-3 py-1, text-xs font-medium, background + foreground from TIER_CONFIG</Li>
            <Li>{"Below chips: '{n} participant(s) pending availability' if pendingCount > 0 (singular/plural aware)"}</Li>
            <Li><strong>No aggregation state:</strong> {"'No availability added yet' in centered muted text"}</Li>
          </Ul>

          <H2>8.3 GroupCalendar</H2>
          <P>Same CalendarShell as PersonalCalendar but with read-only, tier-colored weekend cells.</P>
          <Ul>
            <Li>Weekend cells are NOT interactive (no toggle behavior)</Li>
            <Li>Each Fri-Sat-Sun block is colored by its tier:
              <SubUl>
                <Li><strong>EVERYONE_FREE:</strong> bg-tier-everyone-free/20 (translucent green)</Li>
                <Li><strong>MAJORITY_FREE:</strong> bg-tier-majority-free/20 (translucent sage)</Li>
                <Li><strong>MIXED_NOT_MAJORITY:</strong> bg-tier-mixed/20 (translucent warm amber)</Li>
                <Li><strong>ALL_BUSY:</strong> bg-tier-all-busy/20 (translucent grey)</Li>
              </SubUl>
            </Li>
            <Li>No aggregation: all weekends show bg-muted/50 (neutral)</Li>
            <Li>Same Fri-Sun block rounding as PersonalCalendar</Li>
          </Ul>

          <H2>8.4 Ranked Weekend List</H2>
          <H3>8.4.1 Section Header</H3>
          <Ul>
            <Li>{"Title: 'Ranked Weekends' (or 'Weekends' if no aggregation)"}</Li>
            <Li>{"Sub-text: 'Sorted by availability. Tap mixed weekends to see who\\'s free.' (or empty state message)"}</Li>
          </Ul>

          <H3>8.4.2 Weekend Row Component</H3>
          <P>Each row has a left-side tier color bar, the weekend date range, and a one-line summary.</P>
          <Ul>
            <Li>Container: rounded-lg, overflow-hidden, border border-border/50</Li>
            <Li>Left accent: w-1.5 self-stretch rounded-full in tier background color</Li>
            <Li>{"Date: text-sm font-medium (e.g. 'Feb 21 - 23')"}</Li>
            <Li>Summary text (text-xs text-muted-foreground):
              <SubUl>
                <Li>{"busyCount == 0: 'Everyone Free'"}</Li>
                <Li>{"freeCount == 0: 'All Busy'"}</Li>
                <Li>{"Mixed: '{freeCount} Free \u00B7 {busyCount} Busy'"}</Li>
                <Li>{"Append '\u00B7 {pendingCount} Pending' if pendingCount > 0"}</Li>
              </SubUl>
            </Li>
          </Ul>

          <H3>8.4.3 Expandable Rows (Mixed Tiers Only)</H3>
          <Ul>
            <Li>{"Rows with tier MAJORITY_FREE or MIXED_NOT_MAJORITY are expandable (if both freeCount > 0 and busyCount > 0)"}</Li>
            <Li>Expand indicator: ChevronRight (collapsed) / ChevronDown (expanded)</Li>
            <Li>Expanded content: border-t separator, then two sub-rows:
              <SubUl>
                <Li><strong>Free:</strong> green pill label + comma-separated names</Li>
                <Li><strong>Busy:</strong> grey pill label + comma-separated names</Li>
              </SubUl>
            </Li>
            <Li>Non-expandable rows: cursor-default, no chevron</Li>
          </Ul>

          <H3>8.4.4 Sort Order</H3>
          <Ul>
            <Li>{"Primary: tier priority (Everyone Free \u2192 Majority Free \u2192 Mixed \u2192 All Busy)"}</Li>
            <Li>Secondary: chronological by Friday date within each tier</Li>
          </Ul>

          <H2>8.5 Empty State (No Aggregation)</H2>
          <Ul>
            <Li>{"TierSummaryBar shows: 'No availability added yet'"}</Li>
            <Li>Calendar shows all weekends in neutral muted color</Li>
            <Li>{"Weekend list shows: 'No availability added yet' + 'Weekend dates will appear once participants add their availability'"}</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 9 ═══ */}
        <Section id="s9">
          <H1>9. Shared Components Reference</H1>
          <P>
            All custom WAB components live in <InlineCode>components/wab/</InlineCode>. They build on top of
            shadcn/ui primitives (Card, Button, Input, Select, Label, Badge).
          </P>
          <DataTable
            headers={["Component", "File", "Props / Key Details"]}
            rows={[
              ["BoardHeader", "board-header.tsx", "Reads board from context. Shows name (user-entered), date range, timezone."],
              ["TierBadge", "tier-badge.tsx", "Props: tier (TierType). Renders colored pill with tier label."],
              ["TierSummaryBar", "tier-summary-bar.tsx", "Props: summary, hasAggregation, pendingCount. Shows 4 tier chips + pending text (singular/plural)."],
              ["ShareLinkCard", "share-link-card.tsx", "Reads board from context. Copy-to-clipboard share URL."],
              ["ParticipantList", "participant-list.tsx", "Reads participants from context. Shows count/cap, names, '{n} participant(s) pending availability'."],
              ["SaveIndicator", "save-indicator.tsx", "Reads saveStatus from context. Idle/Saving/Saved states."],
              ["PersonalCalendar", "weekend-calendar.tsx", "Props: dateRange, busyFridays, weekendFridays, onToggle. Interactive."],
              ["GroupCalendar", "weekend-calendar.tsx", "Props: dateRange, weekends (WeekendRow[]), hasAggregation. Read-only."],
              ["WeekendListPersonal", "weekend-list-personal.tsx", "Props: busyFridays, onRemove. Chronological busy list."],
              ["WeekendListGroup", "weekend-list-group.tsx", "Props: weekends (WeekendRow[]), hasAggregation. Ranked, expandable."],
              ["ClaimCodeInput", "claim-code-input.tsx", "Props: onReclaim callback. Text input + submit."],
              ["AvailabilityTabs", "screen-nav.tsx", "Props: activeTab ('my' | 'group'). Segmented control."],
              ["ScreenNav", "screen-nav.tsx", "Fixed bottom nav. Role-aware (creator 4 links, participant 3 links). Waits for hydration."],
              ["BoardGate", "board-gate.tsx", "Wraps pages. Creator gate: boardCreated required. Participant gate: participantJoined required (auto-passes if already in participant list)."],
              ["ScenarioSwitcher", "scenario-switcher.tsx", "Floating FAB. Prototype-only. Role toggle (creator/participant) + scenario switcher."],
            ]}
          />
        </Section>

        {/* ═══ SECTION 10 ═══ */}
        <Section id="s10">
          <H1>10. Data Types &amp; Shapes (Front-End Contract)</H1>
          <P>These TypeScript types define the data shapes the front-end expects. In production, they map directly to the API response shapes defined in the MVP spec (Addendum B).</P>

          <H2>10.1 Board</H2>
          <Code>{`interface Board {
  boardId: string;          // UUID
  boardName: string;        // User-entered on Create page
  timezone: string;         // IANA timezone
  durationMonths: 1 | 3 | 6 | 12;
  dateRangeStart: string;   // ISO YYYY-MM-DD
  dateRangeEnd: string;     // ISO YYYY-MM-DD
  participantCap: number;   // 1-5, set by creator on Create page
  joinToken: string;        // opaque, for share URL
  createdAt: string;        // ISO datetime UTC
}`}</Code>

          <H2>10.2 Participant</H2>
          <Code>{`type ParticipantState =
  | 'JOINED_NOT_INITIATED'
  | 'INITIATED_ZERO_BUSY'
  | 'ADDED_AVAILABILITY';

interface Participant {
  participantId: string;    // UUID
  boardId: string;          // FK
  displayName: string;
  claimCode: string;        // single word, case-insensitive
  state: ParticipantState;
  busyWeekendFridays: string[];  // array of Friday ISO dates
  joinedAt: string;
  lastUpdatedAt: string;
}`}</Code>

          <H2>10.3 WeekendRow (Aggregation Output)</H2>
          <Code>{`type TierType =
  | 'EVERYONE_FREE'
  | 'MAJORITY_FREE'
  | 'MIXED_NOT_MAJORITY'
  | 'ALL_BUSY';

interface WeekendRow {
  friday: string;      // ISO YYYY-MM-DD (Friday anchor)
  tier: TierType;
  freeCount: number;
  busyCount: number;
  pendingCount: number;
  freeNames: string[];  // only present for Mixed tiers
  busyNames: string[];  // only present for Mixed tiers
}`}</Code>

          <H2>10.4 AggregationSummary</H2>
          <Code>{`interface AggregationSummary {
  everyoneFreeCount: number;
  majorityFreeCount: number;
  mixedNotMajorityCount: number;
  allBusyCount: number;
  totalConsideredParticipants: number;
}`}</Code>

          <H2>10.5 Tier Definitions</H2>
          <DataTable
            headers={["Tier", "Enum Value", "Condition (among ADDED_AVAILABILITY participants)"]}
            rows={[
              ["Everyone Free", "EVERYONE_FREE", "busyCount == 0 (100% free)"],
              ["Majority Free", "MAJORITY_FREE", "freeCount / totalAdded > 0.5 (>50% free, not 100%)"],
              ["Mixed Not Majority", "MIXED_NOT_MAJORITY", "freeCount / totalAdded > 0 AND <= 0.5"],
              ["All Busy", "ALL_BUSY", "freeCount == 0 (0% free)"],
            ]}
          />
          <Note>In production, tiers are computed by the backend and returned in the API response. The front-end must NOT independently derive tiers. The prototype computes them client-side for demonstration purposes only.</Note>
        </Section>

        {/* ═══ SECTION 11 ═══ */}
        <Section id="s11">
          <H1>11. State Management Architecture</H1>

          <H2>11.1 Production Architecture</H2>
          <P>In production, the front-end should use SWR (stale-while-revalidate) for data fetching and caching. Server state comes from the API endpoints; client state is minimal.</P>
          <Ul>
            <Li><strong>Board data:</strong> {"fetched via GET /api/boards/{boardId}, cached by SWR"}</Li>
            <Li><strong>Participant data:</strong> included in board response, plus specific participant data from join/reclaim</Li>
            <Li><strong>Group aggregation:</strong> {"fetched via GET /api/boards/{boardId}/group-availability"}</Li>
            <Li><strong>Availability edits:</strong> optimistic updates via SWR mutate, backed by PUT endpoint</Li>
            <Li><strong>Session:</strong> participant identity stored in HTTP-only cookie (set on join or reclaim). Claim code acts as lightweight auth token.</Li>
          </Ul>

          <H2>11.2 Prototype Architecture</H2>
          <P>The prototype uses a React Context provider (PrototypeProvider) that holds all state in memory with sessionStorage persistence for prototype controls (role, scenario). No API calls are made.</P>

          <H3>11.2.1 Context Shape</H3>
          <Code>{`interface PrototypeContextType {
  board: Board;
  participants: Participant[];
  currentParticipantId: string;
  weekendFridays: string[];
  scenarioName: ScenarioName;       // 'empty' | 'partial' | 'full' | 'board-full'
  viewRole: ViewRole;               // 'creator' | 'participant'
  setScenario: (name: ScenarioName) => void;
  setViewRole: (role: ViewRole) => void;
  toggleBusyWeekend: (fridayIso: string) => void;
  addParticipant: (name: string) => void;
  updateBoardName: (name: string) => void;
  boardCreated: boolean;            // gate flag for creator flow
  markBoardCreated: () => void;
  participantJoined: boolean;       // gate flag for participant flow
  markParticipantJoined: () => void;
  isBoardFull: boolean;
  currentParticipant: Participant | undefined;
  saveStatus: 'idle' | 'saving' | 'saved';
  hydrated: boolean;                // true after sessionStorage restore
}`}</Code>

          <H3>11.2.2 Key Operations</H3>
          <Ul>
            <Li><strong>toggleBusyWeekend:</strong> {"Flips a Friday ISO date in/out of the current participant's busyWeekendFridays. Simulates autosave (800ms delay, then 'Saved' for 3s)."}</Li>
            <Li><strong>addParticipant:</strong> Adds a new participant to the scenario, assigns a deterministic claim code, sets as current.</Li>
            <Li><strong>updateBoardName:</strong> Updates the board name (called from Create page on submit).</Li>
            <Li><strong>markBoardCreated:</strong> Sets boardCreated flag to true (called from Create page on submit).</Li>
            <Li><strong>markParticipantJoined:</strong> Sets participantJoined flag to true + persists to sessionStorage (called from Join page on join or reclaim).</Li>
            <Li><strong>setScenario:</strong> {"Replaces all state with a predefined scenario's data. Resets gate flags appropriately (auto-detects if current participant is already in the list)."}</Li>
            <Li><strong>setViewRole:</strong> Switches between creator and participant view. Persisted to sessionStorage so it survives page navigations.</Li>
          </Ul>

          <H3>11.2.3 SessionStorage Persistence (Prototype Only)</H3>
          <Ul>
            <Li><InlineCode>wab-view-role</InlineCode>: persists selected role across page navigations</Li>
            <Li><InlineCode>wab-scenario</InlineCode>: persists selected scenario across page navigations</Li>
            <Li><InlineCode>wab-participant-joined</InlineCode>: persists participant gate state across page navigations</Li>
            <Li>All are restored on mount via useEffect to avoid hydration mismatches</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 12 ═══ */}
        <Section id="s12">
          <H1>12. Interaction Behaviors &amp; Micro-interactions</H1>

          <H2>12.1 Calendar Tap/Click</H2>
          <Ul>
            <Li>Target: any Fri/Sat/Sun cell in the planning window</Li>
            <Li>Action: toggle the entire Fri-Sun block between free and busy</Li>
            <Li>{"Visual feedback: instant color change (green tint \u2194 coral fill)"}</Li>
            <Li>Side effect: triggers 800ms debounced autosave</Li>
          </Ul>

          <H2>12.2 Copy to Clipboard</H2>
          <Ul>
            <Li>Target: copy button in ShareLinkCard</Li>
            <Li>Action: writes share URL to clipboard via navigator.clipboard</Li>
            <Li>Visual feedback: icon changes from Copy to Check (green) for 2 seconds</Li>
          </Ul>

          <H2>12.3 Weekend List Remove</H2>
          <Ul>
            <Li>Target: X button on a busy weekend row in WeekendListPersonal</Li>
            <Li>Action: removes that Friday from busyWeekendFridays (same as toggling on calendar)</Li>
            <Li>Visual feedback: row disappears, calendar updates</Li>
          </Ul>

          <H2>12.4 Expandable Weekend Rows</H2>
          <Ul>
            <Li>Target: Mixed-tier rows in WeekendListGroup</Li>
            <Li>Trigger: click/tap anywhere on the row</Li>
            <Li>Visual feedback: ChevronRight rotates to ChevronDown, content slides in below</Li>
            <Li>Expanded content: Free names (green label) + Busy names (grey label)</Li>
          </Ul>

          <H2>12.5 Month Navigation</H2>
          <Ul>
            <Li>Target: left/right chevron buttons above calendar</Li>
            <Li>Action: shifts the displayed month by 1</Li>
            <Li>Disabled at boundary months (start/end of planning window)</Li>
          </Ul>

          <H2>12.6 Autosave Flow (Production)</H2>
          <Ul>
            <Li>800ms debounce after last change</Li>
            <Li>{"During save: SaveIndicator shows 'Saving...' with spinner"}</Li>
            <Li>{"On success: shows 'Saved' with checkmark for 3 seconds"}</Li>
            <Li>On failure: persistent banner with retry</Li>
          </Ul>

          <H2>12.7 Previously Joined Toggle</H2>
          <Ul>
            <Li>Target: ghost button on Participant Join page</Li>
            <Li>Action: toggles visibility of ClaimCodeInput section below the join form</Li>
            <Li>Clicking again hides the section</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 13 ═══ */}
        <Section id="s13">
          <H1>13. Accessibility Requirements</H1>
          <Ul>
            <Li>All interactive elements are keyboard-focusable and operable</Li>
            <Li>{"Calendar day buttons have type='button' to prevent form submission"}</Li>
            <Li>{"Month navigation buttons have aria-label ('Previous month', 'Next month')"}</Li>
            <Li>{"Copy button has aria-label='Copy link'"}</Li>
            <Li>{"Remove buttons have aria-label='Remove {weekend range}'"}</Li>
            <Li>Form inputs have associated Label elements via htmlFor/id</Li>
            <Li>Form inputs use aria-invalid when validation fails</Li>
            <Li>{"SaveIndicator uses aria-live='polite' for screen reader announcements"}</Li>
            <Li>Semantic HTML: main, header, nav, form, button elements used correctly</Li>
            <Li>{"Navigation bar uses aria-label='Screen navigation'"}</Li>
            <Li>Color is never the sole indicator -- tier labels accompany colors everywhere</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 14 ═══ */}
        <Section id="s14">
          <H1>14. Responsive Behavior</H1>
          <P>The app is designed mobile-first with a max-width content area. No breakpoint-specific layouts are needed for MVP -- the single-column layout works from 320px to desktop widths.</P>
          <Ul>
            <Li><strong>Content area:</strong> max-w-md (448px), centered via mx-auto</Li>
            <Li><strong>Minimum supported width:</strong> 320px</Li>
            <Li><strong>Calendar grid:</strong> 7 equal columns, day cells use aspect-square for consistent sizing</Li>
            <Li><strong>Bottom nav:</strong> fixed bottom, full-width, items justified evenly</Li>
            <Li><strong>Cards:</strong> full-width within content area, no side margins</Li>
            <Li><strong>Viewport meta:</strong> width=device-width, initial-scale=1, maximum-scale=1, user-scalable=false</Li>
            <Li><strong>Theme color:</strong> #f5f0e8 (warm off-white, matches background)</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 15 ═══ */}
        <Section id="s15">
          <H1>15. Edge Cases &amp; Empty States</H1>

          <H2>15.1 Empty States Summary</H2>
          <DataTable
            headers={["Component / Screen", "Condition", "Display"]}
            rows={[
              ["ParticipantList", "0 participants", "Users icon + 'No participants yet'"],
              ["TierSummaryBar", "hasAggregation == false", "'No availability added yet' centered in muted box"],
              ["WeekendListPersonal", "0 busy weekends", "'No busy weekends selected' + helper text"],
              ["WeekendListGroup", "hasAggregation == false", "'No availability added yet' + helper text"],
              ["GroupCalendar", "No aggregation", "All weekends in neutral muted color (no tier colors)"],
              ["My Availability", "No current participant", "Calendar still renders; no busy selections shown"],
              ["Claim Code Input", "Empty submission", "'Please enter your claim code'"],
              ["BoardGate (Creator)", "Board not yet created", "'No board yet' card with link to Create page"],
              ["BoardGate (Participant)", "Not joined or reclaimed", "'Join the board first' card with link to Join page"],
            ]}
          />

          <H2>15.2 Boundary Conditions</H2>
          <Ul>
            <Li><strong>Cross-month weekends:</strong> {"A Friday in March with Sunday in April is handled -- date range formatting adapts (e.g. 'Mar 28 - Apr 1')"}</Li>
            <Li><strong>1-month window:</strong> Calendar starts and ends on the same month, nav buttons both disabled</Li>
            <Li><strong>12-month window:</strong> Up to ~52 weekends in the ranked list; no virtualization needed at this scale</Li>
            <Li><strong>Board at participant cap:</strong> Join form replaced by Board Full + reclaim UI. Cap is now user-defined (1-5) not fixed at 5.</Li>
            <Li><strong>Duplicate display name:</strong> Blocked with inline error, user directed to reclaim</Li>
            <Li><strong>All participants busy on same weekend:</strong> Weekend renders as ALL_BUSY tier, grey color</Li>
            <Li><strong>All weekends free for everyone:</strong> All weekends render EVERYONE_FREE, green color, no expandable rows</Li>
            <Li><strong>Returning participant:</strong> If a participant&apos;s ID is already in the board&apos;s participant list, they bypass the join gate automatically and go straight to My Availability or Group.</Li>
          </Ul>
        </Section>

        {/* ═══ SECTION 16 ═══ */}
        <Section id="s16">
          <H1>16. Prototype Scenario Matrix</H1>
          <P>The prototype includes a floating Scenario Switcher (gear icon, bottom-right) with two controls: a <strong>role toggle</strong> (Creator / Participant) and a <strong>scenario selector</strong> (4 predefined data states).</P>

          <H2>16.1 Role Toggle</H2>
          <Ul>
            <Li>Segmented control: Creator | Participant</Li>
            <Li>Changes the bottom navigation links and access gating behavior</Li>
            <Li>Persisted in sessionStorage to survive page navigations</Li>
          </Ul>

          <H2>16.2 Scenario Definitions</H2>
          <DataTable
            headers={["Scenario", "Participants", "Availability", "Demonstrates"]}
            rows={[
              ["Empty", "0 / 5", "None", "All empty states, no aggregation, neutral calendars, board gate (creator: no board yet)"],
              ["Partial (3/5)", "3 / 5 joined (2 with avail, 1 pending)", "2 have busy weekends selected", "Mixed aggregation, pending counts, expandable rows, tier colors"],
              ["Full (5/5)", "5 / 5 joined, all ADDED_AVAILABILITY", "Various busy patterns", "All 4 tier types visible, full aggregation, ranked list"],
              ["Board Full", "5 / 5 (new user not joined)", "Same as Full", "Board Full join-blocked state, claim code reclaim flow"],
            ]}
          />

          <H2>16.3 Mock Data Generation</H2>
          <Ul>
            <Li>{"Board: 'Summer Hangouts' (default, overridden by user input on Create page), 3-month window, deterministic date range"}</Li>
            <Li>{"Weekends: computed from the board's date range using date-fns"}</Li>
            <Li>Participant names: Alex (you), Jordan, Sam, Taylor, Casey</Li>
            <Li>Claim codes: drawn from fixed word list (mountain, sunset, ocean, etc.)</Li>
            <Li>Busy selections: deterministic indices into the weekend array for reproducible scenarios</Li>
            <Li>All IDs, timestamps, and dates are static constants to prevent server/client hydration mismatches</Li>
          </Ul>
        </Section>

        {/* ─── END ─── */}
        <div className="border-t border-border pt-6 pb-12 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>End of Document</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-lg mx-auto">
            This specification is standalone and sufficient for any AI coding agent to build the complete
            front-end of the Weekend Availability Board. Backend API integration, database setup, and
            QA test suites are defined in separate companion documents.
          </p>
        </div>
      </main>
    </div>
  )
}
