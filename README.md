# MeetMind AI

> **"Never walk into a meeting without the context you need."**

**MeetMind AI** is an AI-powered meeting preparation and relationship-memory agent built for founders, executives, and relationship managers. It captures critical information from previous meetings, emails, and interactions with contacts, transforming relationship history into instant, actionable pre-meeting dossiers.

---

## 🚀 Key Features

1. **Dashboard (`/`)**
   - **Executive Greeting**: *"Good morning 👋 — Here’s what you need to know before your meetings today."*
   - **Summary Cards**: Real-time counters for *Today's Meetings*, *Upcoming Meetings*, *Open Commitments*, and *Contacts in Graph*.
   - **Today's Meetings**: Cards featuring time, contact name, company, meeting type, purpose, and 1-click **"Prepare Me"** CTA.
   - **Recent Activity Feed**: Real-time audit log of extracted memories, meeting debriefs, and fulfilled promises.
   - **Open Commitments Preview**: Fast checkboxes with celebratory confetti for completing action items.

2. **Meeting Preparation Dossier ("Prepare Me")**
   - **The 30-Second Executive Primer**: The high-stakes core context and key objectives.
   - **Relationship Memory Context**: Personal icebreakers (e.g., marathon PRs, coffee preferences), working styles (no-deck preferences, async-first), and past agreed decisions.
   - **Commitments & Deliverables Checklist**: Mutual accountability tracking (*What you promised* vs. *What they owe you*).
   - **Talking Points & Strategic Questions**: Interactive talking points checklist and probing questions.
   - **MeetMind Live Co-pilot Assistant**: Embedded conversational agent with instant prompt chips to query relationship context on the fly.

3. **Relationship Dossiers & Contacts**
   - Searchable, filterable directory with Warmth Score indicators (e.g. 92% Warmth).
   - Filter by status: *Strategic Champion*, *Key Partner*, *Executive Sponsor*, *Warm Collaborator*, *Prospect*.
   - Detailed dossier view for each contact:
     - Bio & strategic context
     - Behavioral profiles: Communication style & decision-making patterns
     - Categorized memories: Personal, Preference, Decision, Strategic
     - Open commitments tracker with direct inline creation
     - Past meeting history archive

4. **Calendar & Meetings**
   - Complete schedule view with filter tabs (*Today*, *Upcoming*, *All Meetings*).
   - Attendee avatars, conference platform links, and direct briefing shortcuts.
   - Quick "Add Meeting" modal with immediate AI preparation synthesis.

5. **Relationship Memory Bank**
   - Centralized memory bank querying facts, personal tidbits, and agreed decisions across all stakeholders.
   - Tag filtering, pin-to-top functionality, and deletion.
   - "Capture Memory" modal with automatic category classification.

6. **Command Palette (`⌘K` / `Ctrl+K`)**
   - Keyboard-driven universal search across contacts, meetings, memories, and actions.

7. **Settings & Agent Configuration**
   - Calendar integrations (Google Calendar, Microsoft 365, Slack Connect).
   - Notification lead times (10m, 15m, 30m, 1h).
   - Briefing depth (Concise 30-sec read vs. Comprehensive dossier).
   - Enterprise data privacy and JSON export of your relationship graph.

8. **Design System & Aesthetics**
   - Professional, minimal B2B SaaS aesthetic (inspired by Linear, Attio, and Notion).
   - Dark mode & Light mode with seamless switching.
   - Fluid typography with Google Fonts (*Inter* and *Plus Jakarta Sans*).

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations / Micro-interactions**: Custom keyframes & Canvas Confetti
- **Tooling**: Vite 8

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
