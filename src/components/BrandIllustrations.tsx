import React from 'react';
import {
  Globe,
  CheckCircle2,
  Building2,
  UserCheck,
  TrendingUp,
  Palette,
  Share2,
  BarChart3,
  Layers,
  ShieldCheck,
} from 'lucide-react';

/**
 * Unified Brand Illustration System for REHMAN GWS – Global Work Solutions.
 * All illustrations share the exact logo color language:
 * - Obsidian / Deep Navy: #050811, #0A1020
 * - Electric Brand Blue: #0A66FF
 * - Sky Cyan Accent: #38BDF8
 * - Subtle Brand Gold: #F59E0B
 * - Crisp White: #F8FAFC
 */

/* ============================================================================
   1. HERO & GLOBAL NETWORK ILLUSTRATION
   ============================================================================ */
export const GlobalNetworkIllustration: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#0A1226] via-[#070C1A] to-[#050811] shadow-[0_28px_70px_-15px_rgba(0,0,0,0.9)] p-5 sm:p-7">
      {/* Subtle Ambient Brand Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#0A66FF]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl"
      />

      {/* Top Executive Status Header inside Illustration */}
      <div className="relative z-10 flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0A66FF] animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300">
            REHMAN GWS · GLOBAL OPERATIONS NETWORK
          </span>
        </div>
        <span className="font-mono text-[11px] text-amber-400 font-semibold">
          5 ACTIVE DIVISIONS
        </span>
      </div>

      {/* Main Vector 3D-Depth Globe & World Connection Canvas */}
      <div className="relative aspect-[4/3] w-full rounded-xl bg-[#050811]/90 border border-white/10 overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 540 390"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Animated Global Business Network Illustration"
          className="w-full h-full"
        >
          <defs>
            <radialGradient id="globeCoreGrad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#0A66FF" stopOpacity="0.32" />
              <stop offset="55%" stopColor="#0A1020" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#050811" stopOpacity="0.98" />
            </radialGradient>
            <linearGradient id="ringBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#0A66FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {/* Subtle World Coordinate Grid Lines */}
          <line x1="0" y1="95" x2="540" y2="95" stroke="rgba(255,255,255,0.03)" />
          <line x1="0" y1="195" x2="540" y2="195" stroke="rgba(255,255,255,0.04)" />
          <line x1="0" y1="295" x2="540" y2="295" stroke="rgba(255,255,255,0.03)" />
          <line x1="135" y1="0" x2="135" y2="390" stroke="rgba(255,255,255,0.03)" />
          <line x1="270" y1="0" x2="270" y2="390" stroke="rgba(255,255,255,0.04)" />
          <line x1="405" y1="0" x2="405" y2="390" stroke="rgba(255,255,255,0.03)" />

          {/* Outer Slowly Rotating Orbital Ring */}
          <g className="animate-spin-slow" style={{ transformOrigin: '270px 195px' }}>
            <circle
              cx="270"
              cy="195"
              r="152"
              stroke="url(#ringBlueGrad)"
              strokeWidth="1.2"
              strokeDasharray="8 6"
            />
            <circle cx="270" cy="43" r="4" fill="#38BDF8" />
            <circle cx="270" cy="347" r="4" fill="#F59E0B" />
          </g>

          {/* 3D Sphere Core & Meridian Wireframe */}
          <circle
            cx="270"
            cy="195"
            r="128"
            fill="url(#globeCoreGrad)"
            stroke="rgba(10, 102, 255, 0.45)"
            strokeWidth="1.5"
          />
          <ellipse
            cx="270"
            cy="195"
            rx="82"
            ry="128"
            stroke="rgba(56, 189, 248, 0.24)"
            strokeWidth="1.1"
          />
          <ellipse
            cx="270"
            cy="195"
            rx="38"
            ry="128"
            stroke="rgba(10, 102, 255, 0.22)"
            strokeWidth="1"
          />
          <ellipse
            cx="270"
            cy="195"
            rx="128"
            ry="58"
            stroke="rgba(56, 189, 248, 0.24)"
            strokeWidth="1.1"
          />
          <ellipse
            cx="270"
            cy="195"
            rx="128"
            ry="24"
            stroke="rgba(10, 102, 255, 0.2)"
            strokeWidth="1"
          />

          {/* Abstract World Continent Dot Clusters */}
          <g fill="rgba(248,250,252,0.28)">
            <circle cx="210" cy="145" r="2" />
            <circle cx="222" cy="140" r="2.2" />
            <circle cx="232" cy="148" r="2" />
            <circle cx="275" cy="170" r="2.4" />
            <circle cx="288" cy="165" r="2" />
            <circle cx="298" cy="174" r="2.2" />
            <circle cx="330" cy="155" r="2" />
            <circle cx="342" cy="162" r="2.5" />
            <circle cx="355" cy="152" r="2" />
            <circle cx="250" cy="215" r="2" />
            <circle cx="264" cy="222" r="2.2" />
          </g>

          {/* Animated Global Business Connection Arcs */}
          <path
            d="M165 145 Q 270 65 375 145"
            stroke="#38BDF8"
            strokeWidth="1.8"
            className="animate-network-line"
          />
          <path
            d="M165 145 Q 225 205 282 182"
            stroke="#0A66FF"
            strokeWidth="1.8"
            className="animate-network-line"
          />
          <path
            d="M282 182 Q 332 162 375 145"
            stroke="#F59E0B"
            strokeWidth="1.8"
            className="animate-network-line"
          />
          <path
            d="M185 245 Q 282 195 362 232"
            stroke="#38BDF8"
            strokeWidth="1.5"
            className="animate-network-line"
          />

          {/* Pulsing Global Hub Nodes */}
          <g className="animate-network-pulse">
            <circle cx="165" cy="145" r="6" fill="#38BDF8" />
            <circle cx="165" cy="145" r="14" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="1.2" />
          </g>
          <g className="animate-network-pulse">
            <circle cx="282" cy="182" r="7" fill="#F59E0B" />
            <circle cx="282" cy="182" r="16" stroke="#F59E0B" strokeOpacity="0.5" strokeWidth="1.4" />
          </g>
          <g className="animate-network-pulse">
            <circle cx="375" cy="145" r="6" fill="#0A66FF" />
            <circle cx="375" cy="145" r="14" stroke="#0A66FF" strokeOpacity="0.45" strokeWidth="1.2" />
          </g>
          <g className="animate-network-pulse">
            <circle cx="185" cy="245" r="5" fill="#0A66FF" />
          </g>
          <g className="animate-network-pulse">
            <circle cx="362" cy="232" r="5" fill="#38BDF8" />
          </g>

          {/* Clean Regional Hub Labels */}
          <text x="115" y="125" fill="#E2E8F0" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            UK · EUROPE
          </text>
          <text x="242" y="210" fill="#FBBF24" fontSize="10.5" fontFamily="JetBrains Mono" fontWeight="600">
            GCC · MIDDLE EAST
          </text>
          <text x="348" y="125" fill="#38BDF8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            SOUTH ASIA
          </text>
        </svg>

        {/* Subtle Floating UI Card 1: Top-Left Creative & Brand Studio */}
        <div className="hidden sm:flex animate-float-slow absolute top-3.5 left-3.5 items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0A1020]/90 backdrop-blur-md border border-white/15 shadow-lg">
          <div className="w-7 h-7 rounded-lg bg-[#0A66FF]/20 border border-[#0A66FF]/40 flex items-center justify-center text-[#38BDF8]">
            <Palette className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-white leading-tight">Brand & Design Studio</div>
            <div className="text-[10px] text-slate-400">36 Creative Capabilities</div>
          </div>
        </div>

        {/* Subtle Floating UI Card 2: Bottom-Right Global Talent & Growth */}
        <div className="hidden sm:flex animate-float-delayed absolute bottom-3.5 right-3.5 items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0A1020]/90 backdrop-blur-md border border-amber-400/30 shadow-lg">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-white leading-tight">Verified Staffing & Growth</div>
            <div className="text-[10px] text-amber-300">5 International Sectors</div>
          </div>
        </div>
      </div>

      {/* Bottom Capabilities Bar */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#38BDF8]" />
          <span className="font-semibold text-white">International Service Architecture</span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Design · Staffing · Social · Marketing · Advisory
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. GRAPHIC DESIGN STUDIO ILLUSTRATION (ANIMATED FRAMES & VECTOR CANVAS)
   ============================================================================ */
export const GraphicDesignIllustration: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#0A1226] via-[#070C1A] to-[#050811] p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#38BDF8]" />
          <span className="font-mono text-xs font-semibold text-white">
            BRAND IDENTITY & VECTOR DESIGN SYSTEM
          </span>
        </div>
        <span className="font-mono text-[11px] text-amber-400">36 DESIGN SCOPES</span>
      </div>

      <div className="relative aspect-[16/10] w-full rounded-xl bg-[#050811] border border-white/10 overflow-hidden p-4 flex items-center justify-center">
        <svg viewBox="0 0 480 280" fill="none" className="w-full h-full">
          {/* Vector Grid Background */}
          <rect width="480" height="280" fill="#050811" />
          <line x1="0" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.04)" />
          <line x1="0" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.04)" />
          <line x1="0" y1="210" x2="480" y2="210" stroke="rgba(255,255,255,0.04)" />
          <line x1="120" y1="0" x2="120" y2="280" stroke="rgba(255,255,255,0.04)" />
          <line x1="240" y1="0" x2="240" y2="280" stroke="rgba(255,255,255,0.04)" />
          <line x1="360" y1="0" x2="360" y2="280" stroke="rgba(255,255,255,0.04)" />

          {/* Golden Ratio Construction Circles */}
          <circle
            cx="240"
            cy="140"
            r="84"
            stroke="rgba(10, 102, 255, 0.35)"
            strokeWidth="1.2"
            strokeDasharray="5 5"
          />
          <circle
            cx="240"
            cy="140"
            r="52"
            stroke="rgba(245, 158, 11, 0.35)"
            strokeWidth="1.2"
          />

          {/* Animated Bézier Curve & Control Handles */}
          <path
            d="M110 195 C 175 65, 305 65, 370 195"
            stroke="#38BDF8"
            strokeWidth="2.2"
            className="animate-network-line"
          />
          <line x1="110" y1="195" x2="175" y2="65" stroke="#F59E0B" strokeWidth="1" />
          <line x1="370" y1="195" x2="305" y2="65" stroke="#F59E0B" strokeWidth="1" />
          <rect x="105" y="190" width="10" height="10" fill="#0A66FF" stroke="#F8FAFC" strokeWidth="1.5" />
          <rect x="365" y="190" width="10" height="10" fill="#0A66FF" stroke="#F8FAFC" strokeWidth="1.5" />
          <circle cx="175" cy="65" r="5" fill="#F59E0B" />
          <circle cx="305" cy="65" r="5" fill="#F59E0B" />

          {/* Center Brand Emblem Construction Frame */}
          <rect
            x="198"
            y="98"
            width="84"
            height="84"
            rx="16"
            fill="rgba(10, 16, 32, 0.9)"
            stroke="#0A66FF"
            strokeWidth="1.6"
          />
          <text
            x="240"
            y="148"
            textAnchor="middle"
            fill="#F8FAFC"
            fontSize="24"
            fontWeight="800"
            fontFamily="Manrope, sans-serif"
          >
            Aa
          </text>
        </svg>

        {/* Floating Design Layer Card Left */}
        <div className="animate-float-slow absolute top-3 left-3 px-3 py-2 rounded-lg bg-[#0A1020]/95 border border-white/15 text-[11px] text-slate-200 shadow-md">
          <div className="font-bold text-[#38BDF8]">Logo & Brand System</div>
          <div className="text-[10px] text-slate-400">Vector Precision · Print & UI</div>
        </div>

        {/* Floating Swatch Palette Right */}
        <div className="animate-float-delayed absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0A1020]/95 border border-white/15 shadow-md">
          <span className="w-3.5 h-3.5 rounded-full bg-[#050811] border border-white/30" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#0A66FF]" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#38BDF8]" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B]" />
          <span className="text-[10px] font-mono text-slate-300 ml-1">BRAND PALETTE</span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. RECRUITMENT & STAFFING PIPELINE ILLUSTRATION
      Visual Concept: Business → REHMAN GWS → Qualified Candidate
   ============================================================================ */
export const RecruitmentFlowIllustration: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#0A1226] via-[#070C1A] to-[#050811] p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
            End-to-End Workforce Placement Architecture
          </span>
        </div>
        <span className="font-mono text-xs text-[#38BDF8]">
          Business → REHMAN GWS → Qualified Candidate
        </span>
      </div>

      {/* 3-Stage Animated Connection Flow */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Animated SVG Connection Pipe Behind Nodes (Desktop) */}
        <svg
          viewBox="0 0 800 90"
          fill="none"
          aria-hidden="true"
          className="hidden md:block absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-20 pointer-events-none z-0"
        >
          <line
            x1="140"
            y1="45"
            x2="660"
            y2="45"
            stroke="rgba(10, 102, 255, 0.25)"
            strokeWidth="3"
          />
          <line
            x1="140"
            y1="45"
            x2="400"
            y2="45"
            stroke="#38BDF8"
            strokeWidth="2.5"
            className="animate-network-line"
          />
          <line
            x1="400"
            y1="45"
            x2="660"
            y2="45"
            stroke="#F59E0B"
            strokeWidth="2.5"
            className="animate-network-line"
          />
        </svg>

        {/* Node 1: Business / Employer */}
        <div className="relative z-10 animate-float-slow bg-[#0A1020] border border-white/15 rounded-xl p-5 space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#0A66FF]/20 border border-[#0A66FF]/40 flex items-center justify-center text-[#38BDF8]">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-mono text-[11px] text-slate-400">STEP 01</span>
          </div>
          <div className="font-display text-base font-bold text-white">
            1. Business Requirement
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Employers submit role specifications, skill requirements, headcount, and location via our Staffing Portal.
          </p>
        </div>

        {/* Node 2: REHMAN GWS Screening & Matching Core */}
        <div className="relative z-10 bg-gradient-to-b from-[#0E1934] to-[#081022] border-2 border-[#0A66FF] rounded-xl p-5 space-y-2.5 shadow-[0_0_35px_-5px_rgba(10,102,255,0.45)]">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#0A66FF] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 font-mono text-[10px] font-bold text-amber-300">
              REHMAN GWS CORE
            </span>
          </div>
          <div className="font-display text-base font-bold text-white">
            2. REHMAN GWS Screening
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Our recruitment specialists screen CVs, verify experience across 5 sectors, and shortlist top talent.
          </p>
        </div>

        {/* Node 3: Qualified Candidate Placement */}
        <div className="relative z-10 animate-float-delayed bg-[#0A1020] border border-amber-400/35 rounded-xl p-5 space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="font-mono text-[11px] text-amber-400">STEP 03</span>
          </div>
          <div className="font-display text-base font-bold text-white">
            3. Qualified Candidate
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Shortlisted candidates are connected directly with your business for interview and onboarding.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. SOCIAL MEDIA MANAGEMENT ILLUSTRATION
   ============================================================================ */
export const SocialMediaIllustration: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#0A1226] via-[#070C1A] to-[#050811] p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#38BDF8]" />
          <span className="font-mono text-xs font-semibold text-white">
            MULTI-PLATFORM CONTENT & ACCOUNT ENGINE
          </span>
        </div>
        <span className="font-mono text-[11px] text-amber-400">24/7 STEWARDSHIP</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="animate-float-slow p-4 rounded-xl bg-[#050811] border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Monthly Content Calendar</span>
            <span className="font-mono text-[11px] text-emerald-400">ACTIVE</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
              <div
                key={slot}
                className={`h-8 rounded-md border flex items-center justify-center font-mono text-[10px] ${
                  slot % 3 === 0
                    ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                    : 'bg-[#0A66FF]/15 border-[#0A66FF]/40 text-[#38BDF8]'
                }`}
              >
                D0{slot}
              </div>
            ))}
          </div>
          <div className="text-[11px] text-slate-400">
            Scheduled Posts · Reels · Carousels · Community Care
          </div>
        </div>

        <div className="animate-float-delayed p-4 rounded-xl bg-[#050811] border border-white/10 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Audience Engagement</span>
            <span className="font-mono text-xs font-bold text-[#38BDF8]">+184%</span>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-[#0A66FF] h-full w-4/5 rounded-full" />
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-3/5 rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>FB · IG · TikTok · LinkedIn · YT</span>
            <span className="text-amber-400 font-mono">VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   5. SOCIAL MEDIA MARKETING & GROWTH CHARTS ILLUSTRATION
   ============================================================================ */
export const MarketingGrowthIllustration: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#0A1226] via-[#070C1A] to-[#050811] p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-xs font-semibold text-white">
            PERFORMANCE CAMPAIGNS & LEAD GENERATION
          </span>
        </div>
        <span className="font-mono text-[11px] text-emerald-400">ROI ANALYTICS</span>
      </div>

      <div className="relative aspect-[16/9] w-full rounded-xl bg-[#050811] border border-white/10 p-4 flex flex-col justify-between">
        <svg viewBox="0 0 460 190" fill="none" className="w-full h-full">
          <line x1="20" y1="160" x2="440" y2="160" stroke="rgba(255,255,255,0.1)" />
          <line x1="20" y1="110" x2="440" y2="110" stroke="rgba(255,255,255,0.05)" />
          <line x1="20" y1="60" x2="440" y2="60" stroke="rgba(255,255,255,0.05)" />

          {/* Bar Chart Columns */}
          <rect x="45" y="120" width="28" height="40" rx="4" fill="rgba(10, 102, 255, 0.35)" />
          <rect x="105" y="102" width="28" height="58" rx="4" fill="rgba(10, 102, 255, 0.5)" />
          <rect x="165" y="84" width="28" height="76" rx="4" fill="rgba(10, 102, 255, 0.65)" />
          <rect x="225" y="68" width="28" height="92" rx="4" fill="rgba(10, 102, 255, 0.8)" />
          <rect x="285" y="48" width="28" height="112" rx="4" fill="#0A66FF" />
          <rect x="345" y="28" width="28" height="132" rx="4" fill="#F59E0B" />

          {/* Animated Growth Trend Curve */}
          <path
            d="M59 115 L 119 96 L 179 76 L 239 58 L 299 40 L 359 20"
            stroke="#38BDF8"
            strokeWidth="2.5"
            className="animate-network-line"
          />
          <circle cx="359" cy="20" r="5" fill="#F59E0B" />
        </svg>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
          <span className="text-slate-300 font-medium">
            Meta Ads · Lead Funnels · Audience Targeting
          </span>
          <span className="font-mono text-amber-400 font-semibold">
            Conversion-Driven Strategy
          </span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   6. BUSINESS SOLUTIONS WORKFLOW ILLUSTRATION
   ============================================================================ */
export const BusinessSolutionsIllustration: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#0A1226] via-[#070C1A] to-[#050811] p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#38BDF8]" />
          <span className="font-mono text-xs font-semibold text-white">
            CORPORATE INFRASTRUCTURE & GROWTH MODULES
          </span>
        </div>
        <span className="font-mono text-[11px] text-amber-400">12 SOLUTIONS</span>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <div className="animate-float-slow p-3.5 rounded-xl bg-[#050811] border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-[#38BDF8]">MODULE 01</div>
          <div className="text-xs font-bold text-white">Business Branding</div>
          <div className="text-[11px] text-slate-400">Identity & Profiles</div>
        </div>
        <div className="animate-float-delayed p-3.5 rounded-xl bg-[#050811] border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-amber-400">MODULE 02</div>
          <div className="text-xs font-bold text-white">Google Business Setup</div>
          <div className="text-[11px] text-slate-400">Search & Maps Presence</div>
        </div>
        <div className="animate-float-delayed p-3.5 rounded-xl bg-[#050811] border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-[#38BDF8]">MODULE 03</div>
          <div className="text-xs font-bold text-white">Market Research</div>
          <div className="text-[11px] text-slate-400">Competitor Intelligence</div>
        </div>
        <div className="animate-float-slow p-3.5 rounded-xl bg-[#050811] border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-amber-400">MODULE 04</div>
          <div className="text-xs font-bold text-white">Client Outreach</div>
          <div className="text-[11px] text-slate-400">Lead & B2B Support</div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   7. COMPACT ANIMATED HEADER FOR THE 5 SERVICE CARDS
   ============================================================================ */
export const ServiceCardMiniIllustration: React.FC<{
  type: 'design' | 'recruitment' | 'social' | 'marketing' | 'business';
}> = ({ type }) => {
  return (
    <div className="relative h-28 w-full rounded-xl bg-[#050811] border border-white/10 overflow-hidden flex items-center justify-center p-3 group-hover:border-[#0A66FF]/40 transition-colors">
      <svg viewBox="0 0 260 90" fill="none" className="w-full h-full">
        <line x1="0" y1="45" x2="260" y2="45" stroke="rgba(255,255,255,0.04)" />
        <line x1="130" y1="0" x2="130" y2="90" stroke="rgba(255,255,255,0.04)" />

        {type === 'design' && (
          <>
            <circle cx="130" cy="45" r="30" stroke="#0A66FF" strokeWidth="1.4" strokeDasharray="4 4" />
            <path d="M55 70 Q 130 15 205 70" stroke="#38BDF8" strokeWidth="2" className="animate-network-line" />
            <circle cx="130" cy="42" r="5" fill="#F59E0B" />
            <rect x="48" y="65" width="8" height="8" fill="#0A66FF" />
            <rect x="202" y="65" width="8" height="8" fill="#0A66FF" />
          </>
        )}

        {type === 'recruitment' && (
          <>
            <line x1="50" y1="45" x2="210" y2="45" stroke="#38BDF8" strokeWidth="2" className="animate-network-line" />
            <circle cx="55" cy="45" r="14" fill="#0A1020" stroke="#0A66FF" strokeWidth="1.6" />
            <circle cx="130" cy="45" r="18" fill="#0A66FF" fillOpacity="0.25" stroke="#38BDF8" strokeWidth="1.8" />
            <circle cx="205" cy="45" r="14" fill="#0A1020" stroke="#F59E0B" strokeWidth="1.6" />
            <circle cx="130" cy="45" r="5" fill="#F59E0B" className="animate-network-pulse" />
          </>
        )}

        {type === 'social' && (
          <>
            <rect x="40" y="22" width="52" height="46" rx="8" fill="#0A1020" stroke="#0A66FF" strokeWidth="1.4" />
            <rect x="104" y="16" width="52" height="58" rx="8" fill="#0A1020" stroke="#38BDF8" strokeWidth="1.6" />
            <rect x="168" y="22" width="52" height="46" rx="8" fill="#0A1020" stroke="#F59E0B" strokeWidth="1.4" />
            <circle cx="130" cy="45" r="6" fill="#38BDF8" className="animate-network-pulse" />
          </>
        )}

        {type === 'marketing' && (
          <>
            <rect x="55" y="52" width="18" height="24" rx="3" fill="rgba(10,102,255,0.4)" />
            <rect x="90" y="40" width="18" height="36" rx="3" fill="rgba(10,102,255,0.65)" />
            <rect x="125" y="28" width="18" height="48" rx="3" fill="#0A66FF" />
            <rect x="160" y="16" width="18" height="60" rx="3" fill="#F59E0B" />
            <path d="M64 48 L 99 35 L 134 24 L 169 12" stroke="#38BDF8" strokeWidth="2" className="animate-network-line" />
          </>
        )}

        {type === 'business' && (
          <>
            <path d="M65 45 L 130 22 L 195 45 L 130 68 Z" stroke="#0A66FF" strokeWidth="1.6" fill="rgba(10,102,255,0.12)" />
            <circle cx="65" cy="45" r="5" fill="#38BDF8" />
            <circle cx="130" cy="22" r="5" fill="#F59E0B" />
            <circle cx="195" cy="45" r="5" fill="#38BDF8" />
            <circle cx="130" cy="68" r="5" fill="#0A66FF" />
          </>
        )}
      </svg>
    </div>
  );
};
