"use client";
import { useState } from "react";

const TRACKS = [
  {
    id: "tracker",
    label: "Job Tracker",
    emoji: "📋",
    color: "#00D084",
    milestones: [
      { week: 1, duration: 1, phase: "Design + Setup", detail: "Wireframe, stack decision, Vercel deploy" },
      { week: 2, duration: 2, phase: "Build MVP", detail: "Core UI, kanban board, localStorage" },
      { week: 3, duration: 1, phase: "Polish + Monetize", detail: "CSV export, stats, Gumroad page" },
      { week: 4, duration: 1, phase: "Launch 🚀", detail: "LinkedIn, Reddit, Product Hunt" },
      { week: 6, duration: 3, phase: "v2: Cloud Sync", detail: "Supabase backend, paid tier" },
      { week: 10, duration: 3, phase: "Scale", detail: "Blog post → YouTube video → referrals" },
    ],
  },
  {
    id: "vigil",
    label: "Vigil SDK",
    emoji: "🔭",
    color: "#7B61FF",
    milestones: [
      { week: 1, duration: 1, phase: "Monorepo Setup", detail: "pnpm workspaces, TS, ESLint, Changesets" },
      { week: 2, duration: 2, phase: "packages/core", detail: "Error capture, Web Vitals, fetch monkey-patch" },
      { week: 4, duration: 1, phase: "packages/react", detail: "ErrorBoundary, hooks, types" },
      { week: 5, duration: 2, phase: "apps/collector", detail: "Express + SQLite ingest server" },
      { week: 7, duration: 2, phase: "Dashboard", detail: "React UI: charts, filters, vitals" },
      { week: 9, duration: 2, phase: "Polish + Publish", detail: "npm publish, ARCHITECTURE.md, blog post" },
      { week: 11, duration: 2, phase: "Resume Ready ✓", detail: "Pin on GitHub, add to resume, dev.to article" },
    ],
  },
  {
    id: "youtube",
    label: "Pro Coder Baba",
    emoji: "🎥",
    color: "#FF6B35",
    milestones: [
      { week: 1, duration: 1, phase: "Niche Lock-in", detail: "Channel audit, new description, trailer script" },
      { week: 2, duration: 1, phase: "Content System", detail: "Calendar, Notion template, batch record" },
      { week: 3, duration: 4, phase: "First 10 Videos", detail: "1/week — job tracker, microfrontend, ML School story" },
      { week: 7, duration: 5, phase: "Distribution Push", detail: "LinkedIn articles, Shorts, Reddit, collabs" },
      { week: 12, duration: 1, phase: "Monetize", detail: "Paid resources, Gumroad, review calls" },
    ],
  },
  {
    id: "freelance",
    label: "Freelancing",
    emoji: "💼",
    color: "#F7B731",
    milestones: [
      { week: 1, duration: 1, phase: "Position", detail: "LinkedIn headline, niche copy, portfolio page" },
      { week: 2, duration: 2, phase: "Build Pipeline", detail: "20 leads, 5 DMs/day, Slack communities" },
      { week: 4, duration: 2, phase: "First Client", detail: "Free audit call → proposal → ₹15–25k project" },
      { week: 6, duration: 3, phase: "Deliver + Retain", detail: "Over-deliver, get testimonial, pitch retainer" },
      { week: 9, duration: 4, phase: "Scale to ₹1L/month", detail: "2 retainers + 1 project, raise rates" },
    ],
  },
];

const WEEKS = 12;
const WEEK_LABELS = Array.from({ length: WEEKS }, (_, i) => {
  const d = new Date(2026, 3, 19 + i * 7);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
});

const MONTH_MARKERS = [
  { label: "Month 1", startWeek: 1, endWeek: 4 },
  { label: "Month 2", startWeek: 5, endWeek: 8 },
  { label: "Month 3", startWeek: 9, endWeek: 12 },
];

const KEY_DATES = [
  { week: 4, label: "First $$$ 💰", color: "#00D084" },
  { week: 9, label: "Vigil on npm 📦", color: "#7B61FF" },
  { week: 12, label: "₹1L target 🎯", color: "#F7B731" },
];

type TrackId = "tracker" | "vigil" | "youtube" | "freelance";
type Track = {
  id: TrackId;
  label: string;
  emoji: string;
  color: string;
  milestones: {
    week: number;
    duration: number;
    phase: string;
    detail: string;
  }[];
};


export default function Roadmap() {
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const TRACKS: Track[] = [ ... ];
  const [activeTrack, setActiveTrack] = useState<TrackId | null>(null);  


  const CELL = 72;
  const ROW_HEIGHT = 68;
  const LABEL_W = 130;

  const totalW = LABEL_W + WEEKS * CELL;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070e",
      fontFamily: "'DM Mono', 'Fira Code', monospace",
      color: "#e0e0f0",
      padding: "0 0 80px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { height: 4px; width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }
        .bar { transition: filter 0.2s, opacity 0.2s; cursor: pointer; }
        .bar:hover { filter: brightness(1.2); }
        .track-label { transition: color 0.2s; }
        .legend-item { transition: opacity 0.15s; cursor: pointer; }
        .legend-item:hover { opacity: 0.8; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #fff 40%, #aaa 50%, #fff 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "48px 40px 36px",
        background: "linear-gradient(180deg, #0c0c18 0%, #07070e 100%)",
        borderBottom: "1px solid #11112a",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Grid bg decoration */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(#ffffff04 1px, transparent 1px), linear-gradient(90deg, #ffffff04 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}/>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.35em", color: "#333", marginBottom: 14, textTransform: "uppercase" }}>
            Apr 2026 → Jul 2026 · 12-Week Sprint
          </div>
          <h1 className="shimmer-text" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}>
            Execution Roadmap
          </h1>
          <p style={{ color: "#3a3a5a", margin: "14px 0 0", fontSize: 13, maxWidth: 500 }}>
            All 4 tracks. 12 weeks. Parallel execution — built around your full-time Razorpay role.
          </p>

          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
            {TRACKS.map(t => (
              <div
                key={t.id}
                className="legend-item animate-in"
                onClick={() => setActiveTrack(activeTrack === t.id ? null : t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  opacity: activeTrack && activeTrack !== t.id ? 0.3 : 1,
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: 2, background: t.color }} />
                <span style={{ fontSize: 12, color: "#888" }}>{t.emoji} {t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Gantt */}
      <div style={{ overflowX: "auto", padding: "0 40px" }}>
        <div style={{ minWidth: totalW + 40, maxWidth: 1100, margin: "0 auto" }}>

          {/* Month banners */}
          <div style={{ display: "flex", marginLeft: LABEL_W, marginTop: 32, marginBottom: 4 }}>
            {MONTH_MARKERS.map((m, i) => (
              <div key={i} style={{
                width: (m.endWeek - m.startWeek + 1) * CELL,
                background: i % 2 === 0 ? "#0e0e20" : "#0a0a18",
                border: "1px solid #13132a",
                borderRadius: 6,
                textAlign: "center",
                padding: "6px 0",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "#333",
                textTransform: "uppercase",
                marginRight: 2,
              }}>{m.label}</div>
            ))}
          </div>

          {/* Week headers */}
          <div style={{ display: "flex", marginLeft: LABEL_W }}>
            {WEEK_LABELS.map((w, i) => (
              <div key={i} style={{
                width: CELL,
                textAlign: "center",
                fontSize: 10,
                color: "#2a2a4a",
                padding: "4px 0 10px",
                borderLeft: "1px solid #11112a",
                letterSpacing: "0.03em",
              }}>
                W{i + 1}
                <div style={{ fontSize: 9, color: "#1e1e3a", marginTop: 2 }}>{w}</div>
              </div>
            ))}
          </div>

          {/* Tracks */}
          {TRACKS.map((track, ti) => {
            const dimmed = activeTrack && activeTrack !== track.id;
            return (
              <div
                key={track.id}
                className="animate-in"
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: ROW_HEIGHT,
                  borderTop: "1px solid #0e0e1e",
                  opacity: dimmed ? 0.15 : 1,
                  transition: "opacity 0.3s",
                  animationDelay: `${ti * 0.08}s`,
                }}
              >
                {/* Track Label */}
                <div className="track-label" style={{
                  width: LABEL_W,
                  flexShrink: 0,
                  paddingRight: 16,
                  textAlign: "right",
                }}>
                  <div style={{ fontSize: 13, color: track.color, fontWeight: 500 }}>
                    {track.emoji}
                  </div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2, lineHeight: 1.3 }}>
                    {track.label}
                  </div>
                </div>

                {/* Timeline Row */}
                <div style={{
                  position: "relative",
                  flex: 1,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}>
                  {/* Grid lines */}
                  {Array.from({ length: WEEKS }).map((_, wi) => (
                    <div key={wi} style={{
                      position: "absolute",
                      left: wi * CELL,
                      top: 0,
                      bottom: 0,
                      width: 1,
                      background: "#0e0e1e",
                    }} />
                  ))}

                  {/* Milestone bars */}
                  {track.milestones.map((m, mi) => {
                    const left = (m.week - 1) * CELL + 4;
                    const width = m.duration * CELL - 8;
                    const key = `${track.id}-${mi}`;
                    const isHovered = hovered === key;

                    return (
                      <div
                        key={mi}
                        className="bar"
                        onMouseEnter={(e) => {
                          setHovered(key);
                          setTooltip({ x: e.clientX, y: e.clientY, track, m });
                        }}
                        onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                        style={{
                          position: "absolute",
                          left,
                          width,
                          height: 34,
                          borderRadius: 6,
                          background: isHovered
                            ? track.color
                            : `${track.color}28`,
                          border: `1.5px solid ${track.color}${isHovered ? "ff" : "50"}`,
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: 8,
                          overflow: "hidden",
                          boxShadow: isHovered ? `0 0 20px ${track.color}40` : "none",
                        }}
                      >
                        <span style={{
                          fontSize: 10.5,
                          fontWeight: 500,
                          color: isHovered ? "#000" : track.color,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          letterSpacing: "0.02em",
                        }}>
                          {m.phase}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Key Dates Row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            marginTop: 12,
            borderTop: "1px dashed #1a1a2e",
            paddingTop: 12,
          }}>
            <div style={{ width: LABEL_W, textAlign: "right", paddingRight: 16 }}>
              <div style={{ fontSize: 10, color: "#2a2a4a", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Key dates
              </div>
            </div>
            <div style={{ position: "relative", flex: 1, height: 40 }}>
              {KEY_DATES.map((kd, i) => (
                <div key={i} style={{
                  position: "absolute",
                  left: (kd.week - 1) * CELL + CELL / 2,
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}>
                  <div className="pulse" style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: kd.color,
                    boxShadow: `0 0 10px ${kd.color}`,
                  }} />
                  <div style={{
                    fontSize: 10,
                    color: kd.color,
                    whiteSpace: "nowrap",
                    letterSpacing: "0.02em",
                  }}>
                    {kd.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today marker */}
          <div style={{ position: "relative", marginLeft: LABEL_W }}>
            <div style={{
              position: "absolute",
              left: 0,
              top: -TRACKS.length * ROW_HEIGHT - 60,
              width: 2,
              height: TRACKS.length * ROW_HEIGHT + 60,
              background: "rgba(255,255,255,0.1)",
              pointerEvents: "none",
            }}>
              <div style={{
                position: "absolute",
                top: 0,
                left: -20,
                fontSize: 10,
                color: "#444",
                whiteSpace: "nowrap",
                letterSpacing: "0.1em",
              }}>TODAY</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div style={{ maxWidth: 1100, margin: "48px auto 0", padding: "0 40px" }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.25em", color: "#333",
          textTransform: "uppercase", marginBottom: 20,
        }}>
          Weekly Time Budget
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[
            { day: "Mon – Fri", label: "Razorpay (Full-time)", hours: "8–9 hrs", color: "#1e1e3a", note: "Your primary income" },
            { day: "Mon/Wed/Fri", label: "Vigil SDK or Job Tracker", hours: "1–1.5 hrs", color: "#7B61FF22", note: "After work, focused build" },
            { day: "Saturday", label: "Pro Coder Baba", hours: "3–4 hrs", color: "#FF6B3522", note: "Batch record 1–2 videos" },
            { day: "Sunday", label: "Freelancing outreach + planning", hours: "2–3 hrs", color: "#F7B73122", note: "DMs, proposals, strategy" },
          ].map((slot, i) => (
            <div key={i} className="animate-in" style={{
              background: "#0f0f1a",
              border: `1px solid ${slot.color === "#1e1e3a" ? "#1a1a2e" : slot.color}`,
              borderRadius: 10,
              padding: "18px 20px",
              animationDelay: `${i * 0.1}s`,
            }}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                {slot.day}
              </div>
              <div style={{ fontSize: 14, color: "#ccc", marginBottom: 6, fontWeight: 500 }}>{slot.label}</div>
              <div style={{ fontSize: 20, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff" }}>
                {slot.hours}
              </div>
              <div style={{ fontSize: 11, color: "#333", marginTop: 6 }}>{slot.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Month Outcomes */}
      <div style={{ maxWidth: 1100, margin: "40px auto 0", padding: "0 40px" }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.25em", color: "#333",
          textTransform: "uppercase", marginBottom: 20,
        }}>
          If You Execute — 12-Week Outcomes
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { icon: "📋", outcome: "Job Tracker live + first sales", metric: "₹5,000–15,000 earned", color: "#00D084" },
            { icon: "🔭", outcome: "Vigil SDK on npm", metric: "Resume transformed", color: "#7B61FF" },
            { icon: "🎥", outcome: "10 videos published", metric: "Distribution building", color: "#FF6B35" },
            { icon: "💼", outcome: "2 freelance clients", metric: "₹40,000–60,000 earned", color: "#F7B731" },
          ].map((o, i) => (
            <div key={i} className="animate-in" style={{
              background: `${o.color}08`,
              border: `1px solid ${o.color}30`,
              borderLeft: `3px solid ${o.color}`,
              borderRadius: 10,
              padding: "18px 20px",
              animationDelay: `${i * 0.1 + 0.3}s`,
            }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{o.icon}</div>
              <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.5, marginBottom: 8 }}>{o.outcome}</div>
              <div style={{ fontSize: 14, color: o.color, fontWeight: 600 }}>{o.metric}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "fixed",
          left: tooltip.x + 16,
          top: tooltip.y - 16,
          background: "#13132a",
          border: `1px solid ${tooltip.track.color}50`,
          borderRadius: 10,
          padding: "12px 16px",
          zIndex: 1000,
          pointerEvents: "none",
          maxWidth: 260,
          boxShadow: `0 8px 32px ${tooltip.track.color}20`,
        }}>
          <div style={{ fontSize: 11, color: tooltip.track.color, marginBottom: 4, letterSpacing: "0.1em" }}>
            {tooltip.track.emoji} {tooltip.track.label} · W{tooltip.m.week}
          </div>
          <div style={{ fontSize: 14, color: "#fff", fontWeight: 500, marginBottom: 6 }}>
            {tooltip.m.phase}
          </div>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
            {tooltip.m.detail}
          </div>
          <div style={{ fontSize: 10, color: "#444", marginTop: 8 }}>
            Duration: {tooltip.m.duration} week{tooltip.m.duration > 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}