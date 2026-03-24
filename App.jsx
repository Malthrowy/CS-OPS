import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";

// ─── i18n TRANSLATIONS ────────────────────────────────────────────────────────
const T = {
  en: {
    appName: "CS Operations", appSub: "Management System",
    selectRole: "Select Your Role", yourName: "Your Name",
    selectName: "Select your name", agentNameLabel: "Select Your Name",
    agentHint: "View only — password required on first login",
    password: "Password", signIn: "Sign In", signInAs: "Sign In as",
    enterAs: "Enter as",
    setPassword: "Set Your Personal Password", firstLogin: "First time login",
    newPassword: "New Password (min. 4 characters)", confirmPassword: "Confirm Password",
    setAndSignIn: "Set Password & Sign In",
    incorrectPassword: "Incorrect password. Please try again.",
    selectYourName: "Please select your name.",
    personalPassword: "Personal password", viewOnly: "View Only",
    autoSaved: "Auto-saved", saved: "Saved",
    signOut: "Sign Out", history: "History",
    readOnlyMode: "View Only Mode",
    readOnlyDesc: "You can browse data but cannot make changes.",
    schedule: "Schedule", attendance: "Attendance", queue: "Queue",
    dailyTasks: "Daily Tasks", liveFloor: "Live Floor", breakPage: "Break",
    heatMap: "Heat Map", auditLog: "Audit Log", notes: "Notes",
    shifts: "Shifts", performance: "Performance", reports: "Reports",
    ownerAnalytics: "Owner Analytics",
    today: "TODAY", employee: "Employee", role: "Role",
    theme: "Theme", language: "Language",
    dailyTipTitle: "Daily Tip",
    tips: [
      "Start each shift with a quick team check-in to align priorities.",
      "Document escalations immediately — details fade fast.",
      "A proactive break schedule reduces errors by up to 30%.",
      "Clear queue data = better staffing decisions tomorrow.",
      "Recognition boosts productivity — acknowledge good work daily."
    ]
  },
};

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  cyber: {
    name: "⚡ Cyber Command",
    bg: "#020818", surface: "#060F2A", card: "#0A1628",
    cardBorder: "#0E2040", header: "#010610",
    text: "#E0F2FF", textSub: "#60A5FA", textMuted: "#3B82F6",
    primary: "#00D4FF", primaryHover: "#00B8E0",
    success: "#00FF88", warning: "#FFB800", danger: "#FF3366",
    accent: "#7C3AED", accentGold: "#FFD700",
    input: "#020818", inputBorder: "#0E2040", inputText: "#E0F2FF",
    isDark: true,
    glow: "0 0 20px #00D4FF40, 0 0 40px #00D4FF20",
    gradient: "linear-gradient(135deg,#020818 0%,#060F2A 50%,#020818 100%)"
  },
  enterprise: {
    name: "🏢 Modern Enterprise",
    bg: "#F8FAFF", surface: "#EEF2FF", card: "#FFFFFF",
    cardBorder: "#C7D2FE", header: "#1E3A8A",
    text: "#0F172A", textSub: "#334155", textMuted: "#64748B",
    primary: "#1D4ED8", primaryHover: "#1E40AF",
    success: "#059669", warning: "#D97706", danger: "#DC2626",
    accent: "#7C3AED", accentGold: "#B45309",
    input: "#FFFFFF", inputBorder: "#C7D2FE", inputText: "#0F172A",
    isDark: false,
    glow: "0 4px 20px rgba(29,78,216,0.15)",
    gradient: "linear-gradient(135deg,#F8FAFF 0%,#EEF2FF 100%)"
  },
  dark: {
    name: "🌑 Dark Pro",
    bg: "#0D1117", surface: "#161B22", card: "#1C2333",
    cardBorder: "#30363D", header: "#090D15",
    text: "#E6EDF3", textSub: "#8B949E", textMuted: "#6E7681",
    primary: "#58A6FF", primaryHover: "#388BFD",
    success: "#3FB950", warning: "#D29922", danger: "#F85149",
    accent: "#BC8CFF", accentGold: "#E3B341",
    input: "#0D1117", inputBorder: "#30363D", inputText: "#E6EDF3",
    isDark: true,
    glow: "0 0 12px #58A6FF30",
    gradient: "linear-gradient(135deg,#0D1117 0%,#161B22 100%)"
  },
  navy: {
    name: "⚓ Navy & Gold",
    bg: "#0B1A2E", surface: "#112240", card: "#172A46",
    cardBorder: "#1E3A5F", header: "#071222",
    text: "#CDD9E5", textSub: "#7EB4E2", textMuted: "#5899C8",
    primary: "#E3B341", primaryHover: "#C69B2A",
    success: "#3FB950", warning: "#E3B341", danger: "#F85149",
    accent: "#E3B341", accentGold: "#E3B341",
    input: "#0B1A2E", inputBorder: "#1E3A5F", inputText: "#CDD9E5",
    isDark: true,
    glow: "0 0 12px #E3B34130",
    gradient: "linear-gradient(135deg,#0B1A2E 0%,#112240 100%)"
  },
  light: {
    name: "☀️ Clean Light",
    bg: "#F3F6FA", surface: "#E8EDF5", card: "#FFFFFF",
    cardBorder: "#D0D7DE", header: "#0F2744",
    text: "#1C2128", textSub: "#424A53", textMuted: "#6E7781",
    primary: "#0969DA", primaryHover: "#0550AE",
    success: "#1A7F37", warning: "#9A6700", danger: "#CF222E",
    accent: "#8250DF", accentGold: "#9A6700",
    input: "#FFFFFF", inputBorder: "#D0D7DE", inputText: "#1C2128",
    isDark: false,
    glow: "0 4px 12px rgba(9,105,218,0.12)",
    gradient: "linear-gradient(135deg,#F3F6FA 0%,#E8EDF5 100%)"
  },
  purple: {
    name: "🌌 Midnight Purple",
    bg: "#0E0B1A", surface: "#16112B", card: "#1E1838",
    cardBorder: "#2D2455", header: "#080614",
    text: "#DDD8F0", textSub: "#A89BD4", textMuted: "#7B6EA8",
    primary: "#A78BFA", primaryHover: "#8B5CF6",
    success: "#4ADE80", warning: "#FBBF24", danger: "#F87171",
    accent: "#F472B6", accentGold: "#FBBF24",
    input: "#0E0B1A", inputBorder: "#2D2455", inputText: "#DDD8F0",
    isDark: true,
    glow: "0 0 12px #A78BFA30",
    gradient: "linear-gradient(135deg,#0E0B1A 0%,#16112B 100%)"
  },
  carbonRed: {
    name: "🔴 Carbon Red",
    bg: "#0D0A0A", surface: "#1A1212", card: "#201515",
    cardBorder: "#2D1515", header: "#080606",
    text: "#FFE8E8", textSub: "#FF9090", textMuted: "#CC5555",
    primary: "#FF3B3B", primaryHover: "#E02020",
    success: "#22C55E", warning: "#F59E0B", danger: "#FF1744",
    accent: "#FF6B6B", accentGold: "#FFD700",
    input: "#0D0A0A", inputBorder: "#2D1515", inputText: "#FFE8E8",
    isDark: true,
    glow: "0 0 20px #FF3B3B40, 0 0 40px #FF3B3B15",
    gradient: "linear-gradient(135deg,#0D0A0A 0%,#1A1212 50%,#0D0A0A 100%)"
  },
  matrix: {
    name: "🟢 Matrix Terminal",
    bg: "#050F05", surface: "#0A1A0A", card: "#0D200D",
    cardBorder: "#0D2B0D", header: "#030803",
    text: "#00FF41", textSub: "#00CC33", textMuted: "#008822",
    primary: "#00FF41", primaryHover: "#00CC33",
    success: "#00FF41", warning: "#FFFF00", danger: "#FF0000",
    accent: "#00FFCC", accentGold: "#FFFF00",
    input: "#050F05", inputBorder: "#0D2B0D", inputText: "#00FF41",
    isDark: true,
    glow: "0 0 20px #00FF4140, 0 0 40px #00FF4115",
    gradient: "linear-gradient(135deg,#050F05 0%,#0A1A0A 50%,#050F05 100%)"
  },
  desert: {
    name: "🌅 Desert Dawn",
    bg: "#1A1208", surface: "#2D1F0E", card: "#3A2810",
    cardBorder: "#4A3520", header: "#100C05",
    text: "#F5E6C8", textSub: "#D4B896", textMuted: "#A08060",
    primary: "#D4A843", primaryHover: "#B8902E",
    success: "#4CAF50", warning: "#FF8C42", danger: "#E53935",
    accent: "#FF8C42", accentGold: "#D4A843",
    input: "#1A1208", inputBorder: "#4A3520", inputText: "#F5E6C8",
    isDark: true,
    glow: "0 0 20px #D4A84340, 0 0 40px #D4A84315",
    gradient: "linear-gradient(135deg,#1A1208 0%,#2D1F0E 50%,#1A1208 100%)"
  },
  arctic: {
    name: "🔵 Arctic Blue",
    bg: "#F0F4FF", surface: "#E8EEFF", card: "#FFFFFF",
    cardBorder: "#DBEAFE", header: "#1E3A8A",
    text: "#0F1B35", textSub: "#1E3A8A", textMuted: "#4A6FA5",
    primary: "#2563EB", primaryHover: "#1D4ED8",
    success: "#059669", warning: "#D97706", danger: "#DC2626",
    accent: "#7C3AED", accentGold: "#B45309",
    input: "#FFFFFF", inputBorder: "#BFDBFE", inputText: "#0F1B35",
    isDark: false,
    glow: "0 4px 20px rgba(37,99,235,0.2)",
    gradient: "linear-gradient(135deg,#F0F4FF 0%,#E8EEFF 100%)"
  },
  sakura: {
    name: "🌸 Sakura Pro",
    bg: "#0F0A12", surface: "#1A1020", card: "#221530",
    cardBorder: "#2D1D35", header: "#080510",
    text: "#FFE8F0", textSub: "#FF9EC0", textMuted: "#CC6688",
    primary: "#FF6B9D", primaryHover: "#E0507A",
    success: "#A8FF78", warning: "#FFE66D", danger: "#FF4B6E",
    accent: "#B983FF", accentGold: "#FFE66D",
    input: "#0F0A12", inputBorder: "#2D1D35", inputText: "#FFE8F0",
    isDark: true,
    glow: "0 0 20px #FF6B9D40, 0 0 40px #FF6B9D15",
    gradient: "linear-gradient(135deg,#0F0A12 0%,#1A1020 50%,#0F0A12 100%)"
  },
  executiveGold: {
    name: "🏆 Executive Gold",
    bg: "#0A0800", surface: "#12100A", card: "#1C180A",
    cardBorder: "#2A2210", header: "#060500",
    text: "#FFF8E0", textSub: "#FFD700", textMuted: "#AA8800",
    primary: "#FFD700", primaryHover: "#CCAA00",
    success: "#50FA7B", warning: "#FFB86C", danger: "#FF5555",
    accent: "#BD93F9", accentGold: "#FFD700",
    input: "#0A0800", inputBorder: "#2A2210", inputText: "#FFF8E0",
    isDark: true,
    glow: "0 0 20px #FFD70050, 0 0 40px #FFD70020",
    gradient: "linear-gradient(135deg,#0A0800 0%,#12100A 50%,#0A0800 100%)"
  },
  ocean: {
    name: "🌊 Deep Ocean",
    bg: "#020B18", surface: "#051525", card: "#071E35",
    cardBorder: "#0A2540", header: "#010810",
    text: "#C8E8FF", textSub: "#5BB8FF", textMuted: "#2A80C0",
    primary: "#00B4D8", primaryHover: "#0096B5",
    success: "#06D6A0", warning: "#FFB703", danger: "#EF233C",
    accent: "#4895EF", accentGold: "#FFB703",
    input: "#020B18", inputBorder: "#0A2540", inputText: "#C8E8FF",
    isDark: true,
    glow: "0 0 20px #00B4D840, 0 0 40px #00B4D815",
    gradient: "linear-gradient(135deg,#020B18 0%,#051525 50%,#020B18 100%)"
  },
  volcanic: {
    name: "🔥 Volcanic Dark",
    bg: "#0D0500", surface: "#1A0C05", card: "#221005",
    cardBorder: "#2D1A08", header: "#080300",
    text: "#FFE8D0", textSub: "#FF9A60", textMuted: "#CC6030",
    primary: "#FF6B2B", primaryHover: "#E05018",
    success: "#22D3EE", warning: "#FBBF24", danger: "#FF1744",
    accent: "#FF9A60", accentGold: "#FBBF24",
    input: "#0D0500", inputBorder: "#2D1A08", inputText: "#FFE8D0",
    isDark: true,
    glow: "0 0 20px #FF6B2B40, 0 0 40px #FF6B2B15",
    gradient: "linear-gradient(135deg,#0D0500 0%,#1A0C05 50%,#0D0500 100%)"
  },
  mono: {
    name: "⚪ Monochrome Elite",
    bg: "#080808", surface: "#111111", card: "#181818",
    cardBorder: "#222222", header: "#040404",
    text: "#FFFFFF", textSub: "#AAAAAA", textMuted: "#666666",
    primary: "#FFFFFF", primaryHover: "#CCCCCC",
    success: "#AAAAAA", warning: "#888888", danger: "#FFFFFF",
    accent: "#CCCCCC", accentGold: "#FFFFFF",
    input: "#080808", inputBorder: "#222222", inputText: "#FFFFFF",
    isDark: true,
    glow: "0 0 20px rgba(255,255,255,0.1)",
    gradient: "linear-gradient(135deg,#080808 0%,#111111 50%,#080808 100%)"
  },
  grandLine: {
    name: "⚓ Grand Line",
    bg: "#020C1B", surface: "#041628", card: "#062040",
    cardBorder: "#0A3060", header: "#010A14",
    text: "#E8F4FD", textSub: "#7EB8D4", textMuted: "#4A7A95",
    primary: "#F02D2D", primaryHover: "#C42020",
    success: "#FFD700", warning: "#FF8C00", danger: "#FF1744",
    accent: "#4FC3F7", accentGold: "#FFD700",
    input: "#020C1B", inputBorder: "#0A3060", inputText: "#E8F4FD",
    isDark: true,
    glow: "0 0 20px #F02D2D40, 0 0 40px #FFD70020",
    gradient: "linear-gradient(135deg,#020C1B 0%,#041628 50%,#020C1B 100%)",
    isGrandLine: true
  }
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const TASK_LIST = [
  "TGA","Social Group","180 All","180 KSA","180 KWT","180 BAH","180 QAT","180 UAE",
  "SoMe KSA","SoMe KWT","SoMe UAE","SoMe BAH","SoMe QAT",
  "OB KSA","T2 KWT","T2 QAT","T2 BAH","T2 UAE",
  "Failed Refund Sheet","KMART","Training","Other"
];
const TASK_LIST_ASSIGN = ["KFOOD","KEEMRT"];
// Team assignment - supervisors only
const SUPERVISOR_ROLES = new Set(["Team Lead","Shift Leader","SME"]);
const TASK_COLORS = ["#10B981","#3B82F6","#6366F1","#0EA5E9","#F59E0B","#10B981","#EF4444","#8B5CF6","#EC4899","#14B8A6","#F97316","#06B6D4","#84CC16","#A855F7","#E11D48"];
const STATUS_OPTIONS = ["Present","Absent","Late","Early Leave","Annual Leave","Sick Leave","Work From Home","On Training","Business Trip","Day Off"];
// Statuses that count as "present" (employee is available/working)
const PRESENT_STATUSES = new Set(["Present","Late","Early Leave","Work From Home","On Training","Business Trip"]);
// Statuses that count as "absent" 
const ABSENT_STATUSES  = new Set(["Absent"]);
// Statuses that are planned leave (not counted as absent)
const LEAVE_STATUSES   = new Set(["Annual Leave","Sick Leave","Day Off"]);
function isPresent(status)  { return PRESENT_STATUSES.has(status); }
function isAbsent(status)   { return ABSENT_STATUSES.has(status); }
function isOnLeave(status)  { return LEAVE_STATUSES.has(status); }
function statusColor(status) {
  const map = {
    "Present":"#10B981","Late":"#F59E0B","Early Leave":"#8B5CF6",
    "Absent":"#EF4444","Annual Leave":"#0EA5E9","Sick Leave":"#EC4899",
    "Work From Home":"#6366F1","On Training":"#14B8A6","Business Trip":"#F97316",
    "Day Off":"#64748B"
  };
  return map[status] || "#64748B";
}
function statusIcon(status) {
  const map = {
    "Present":"✅","Late":"🟡","Early Leave":"🟣","Absent":"❌",
    "Annual Leave":"🏖️","Sick Leave":"🏥","Work From Home":"🏠",
    "On Training":"📚","Business Trip":"✈️","Day Off":"🔘"
  };
  return map[status] || "⚪";
}
const ALL_PAGES = ["Home","Messages","Schedule","Attendance","Queue","Daily Tasks","Live Floor","Break","Heat Map","Audit Log","Notes","Shifts","Performance","Reports","Owner Analytics","Leaderboard","Attendance History","KPI Dashboard","Surveys","Gamification","Shift Handover","TT Tracker"];
const PAGES = ALL_PAGES.filter(p => p !== "Owner Analytics"); // Home + Leaderboard visible to all roles
// TT Tracker visible to non-agent supervisors
const AGENT_PAGES = ["Home","Messages","Schedule","Live Floor","Break","Performance","Queue","Leaderboard","Surveys","Gamification"];

// ─── 10 OPERATIONAL HUBS ──────────────────────────────────────────────────────
const HUBS = [
  {
    id: "home",
    icon: "🏠",
    label: "Home",
    pages: ["Home"],
    roles: ["Team Lead","Shift Leader","SME","Agent"],
    color: "#64748B",
    desc: "Dashboard overview"
  },
  {
    id: "control-tower",
    icon: "🗼",
    label: "Control Tower",
    pages: ["Live Floor","Queue","Heat Map","TT Tracker"],
    roles: ["Team Lead","Shift Leader","SME"],
    color: "#00D4FF",
    desc: "Live ops, queue & heatmap"
  },
  {
    id: "workforce",
    icon: "👥",
    label: "Workforce Hub",
    pages: ["Schedule","Shifts","Attendance","Attendance History"],
    roles: ["Team Lead","Shift Leader","SME"],
    color: "#3B82F6",
    desc: "Schedule, shifts & attendance"
  },
  {
    id: "performance-lab",
    icon: "⚡",
    label: "Performance Lab",
    pages: ["Performance","KPI Dashboard","Leaderboard","Gamification"],
    roles: ["Team Lead","Shift Leader","SME","Agent"],
    color: "#10B981",
    desc: "KPIs, scores & achievements"
  },
  {
    id: "communication",
    icon: "💬",
    label: "Comm Hub",
    pages: ["Messages","Notes","Surveys"],
    roles: ["Team Lead","Shift Leader","SME","Agent"],
    color: "#8B5CF6",
    desc: "Messages, notes & surveys"
  },
  {
    id: "quality",
    icon: "🔍",
    label: "Quality & Audit",
    pages: ["Audit Log"],
    roles: ["Team Lead","Shift Leader"],
    color: "#F59E0B",
    desc: "Audit trail & quality"
  },
  {
    id: "reporting",
    icon: "📊",
    label: "Reports",
    pages: ["Reports"],
    roles: ["Team Lead","Shift Leader","SME"],
    color: "#EC4899",
    desc: "Analytics & reports"
  },
  {
    id: "tasks-ops",
    icon: "📌",
    label: "Tasks & Ops",
    pages: ["Daily Tasks","Shift Handover"],
    roles: ["Team Lead","Shift Leader","SME"],
    color: "#F97316",
    desc: "Tasks & handover"
  },
  {
    id: "break-station",
    icon: "☕",
    label: "Break Station",
    pages: ["Break"],
    roles: ["Team Lead","Shift Leader","SME","Agent"],
    color: "#14B8A6",
    desc: "Break scheduling"
  },
  {
    id: "owner-console",
    icon: "👑",
    label: "Master Console",
    pages: ["Owner Analytics"],
    ownerOnly: true,
    color: "#FFD700",
    desc: "Owner controls"
  },
];

// Role-specific welcome messages
const ROLE_WELCOME = {
  "owner": "Master Console Active. All Nodes Linked. Full Stealth Engaged. 👁️",
  "Team Lead": "Welcome back, Commander. Your strategy suite is ready. 🎯",
  "Shift Leader": "Field control active. Your team is counting on you. 🛡️",
  "SME": "Knowledge Lab initialized. Excellence mode engaged. 🧠",
  "Agent": "Pilot seat ready. Focus on your mission today. ✈️",
};

// Arabic onboarding & daily messages
const MSG_ONBOARDING = "يا هلا والله ومسهلا.. حيّ هالطّلة! ✨ أخيراً نوّر النظام بوجودكم.. تراكم جيتوا ومكانكم خالي، والسيستم كان يتحراكم ويتحرى لمستكم الرهيبة. خذوا لكم لفه وتعرفوا على المكان، وحطوا في بالكم إننا فريق واحد وعلى قلب واحد. البدايات اللي تجمّل تبدأ من هنا! 🚀";
const MSG_DAILY = "يا حيّ الله من جانا.. نورتونا من جديد! 😅 السيستم كان ضايق صدره بدونكم.. تذكروا إن كل شغلة تخلصونها اليوم هي خطوة لنجاحكم الكبير. سمّوا بالله وانطلقوا.. أنتم قدها! ✨";

// Arabic status messages
const STATUS_ARABIC_MSGS = {
  "Break":    "استراحة محارب! تهنوا بوقتكم وارجعوا لنا مصحصحين. 🍫",
  "Meeting":  "اجتماع مثمر يا رب.. لا تنسون تسجلون الزين من الملاحظات! 📝",
  "Training": ".. استمتعوا بتطوير مهاراتكم! 🚀",
};

// Presence Status options for employees
const PRESENCE_STATUSES = ["Online","Break","Meeting","Training","Offline"];
const PRESENCE_ICONS = { "Online":"🟢","Break":"☕","Meeting":"📝","Training":"🚀","Offline":"⚫" };
// ─── ROLE CONFIG ──────────────────────────────────────────────────────────────
const ROLE_CAN_EDIT = {
  "Team Lead":    true,
  "Shift Leader": true,
  "SME":          true,
  "Agent":        false,
};
const ROLE_COLORS = {
  "Team Lead":    "#3B82F6",
  "Shift Leader": "#8B5CF6",
  "SME":          "#10B981",
  "Agent":        "#64748B",
};
const ROLE_ICONS = { "Team Lead":"👑", "Shift Leader":"🛡️", "SME":"🧠", "Agent":"👤" };
const ROLE_DESC_EN = {
  "Team Lead":    "Full access · Password required",
  "Shift Leader": "Full access · Password required",
  "SME":          "Full access · Password required",
  "Agent":        "View only · Password on first login",
};



// Super Admin — protected by name AND role
const SUPER_ADMIN = "Mohammed Nasser Althurwi";
const OWNER_ROLE = "owner";
function isOwnerUser(session) {
  if (!session) return false;
  return session.name === SUPER_ADMIN || session.role === OWNER_ROLE;
}

// ── STEALTH MASK: Owner appears as SME to everyone else ──────────────────────
// Call this when displaying employee role to OTHER users (not the owner themselves)
function getDisplayRole(emp, viewerSession) {
  // If viewer IS the owner, show true role
  if (isOwnerUser(viewerSession)) return emp.role;
  // If employee IS the owner, mask as SME
  if (emp.name === SUPER_ADMIN) return "SME";
  return emp.role;
}
function getDisplayRoleIcon(emp, viewerSession) {
  const r = getDisplayRole(emp, viewerSession);
  return ROLE_ICONS[r] || "👤";
}
// Check if first-time login (no password set yet)
function isFirstLogin(name) {
  try {
    const store = JSON.parse(localStorage.getItem("csops_passwords") || "{}");
    return !store[name];
  } catch { return false; }
}
// Get last login date for daily message detection
function getLastLoginDate(name) {
  try { return localStorage.getItem("csops_lastLogin_" + name) || ""; } catch { return ""; }
}
function setLastLoginDate(name) {
  try { localStorage.setItem("csops_lastLogin_" + name, new Date().toISOString().slice(0,10)); } catch {}
}

// ─── THEME CONTEXT (global) ───────────────────────────────────────────────────
let _theme = THEMES.dark;
let _lang = "en";
function setGlobalTheme(th) { _theme = th; }
function setGlobalLang(l) { _lang = l; }
function _tr(key) { return T[_lang]?.[key] || T.en[key] || key; }

// ─── STYLE HELPERS (theme-aware) ─────────────────────────────────────────────
function I(extra={}) { return ({
  background: _theme.input, border: `1px solid ${_theme.inputBorder}`,
  borderRadius:6, padding:"8px 12px", fontSize:13, color: _theme.inputText,
  outline:"none", width:"100%", boxSizing:"border-box", ...extra
}); }
function CRD(extra={}) { return ({
  background: _theme.card, borderRadius:14, padding:"16px 20px",
  boxShadow: _theme.isDark
    ? "0 4px 20px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)"
    : "0 2px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  border: `1px solid ${_theme.cardBorder}`,
  transition: "box-shadow 0.2s ease",
  ...extra
}); }
function SBR(extra={}) { return ({
  background: _theme.surface, borderRadius:10, padding:"12px 16px",
  marginBottom:14, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap",
  border: `1px solid ${_theme.cardBorder}`, ...extra
}); }
function PBT(color="#2563EB", extra={}) { return ({
  background: `linear-gradient(135deg, ${color}, ${color}DD)`,
  color:"#fff", border:"none", borderRadius:10,
  padding:"9px 18px", fontSize:13, cursor:"pointer", fontWeight:700,
  transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
  boxShadow: `0 2px 8px ${color}40`,
  letterSpacing:"0.01em", ...extra
}); }
const LBL = { fontSize:12, fontWeight:600, marginBottom:4, display:"block", color:"#8B949E" };

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
const DEFAULT_SHIFTS = [
  { id:"s1", label:"08:00-17:00", start:"08:00", end:"17:00", color:"#0EA5E9" },
  { id:"s2", label:"10:00-19:00", start:"10:00", end:"19:00", color:"#10B981" },
  { id:"s3", label:"11:00-20:00", start:"11:00", end:"20:00", color:"#F59E0B" },
  { id:"s4", label:"13:00-22:00", start:"13:00", end:"22:00", color:"#6366F1" },
  { id:"s5", label:"14:00-23:00", start:"14:00", end:"23:00", color:"#EF4444" },
  { id:"s6", label:"17:00-02:00", start:"17:00", end:"02:00", color:"#EC4899" },
  { id:"s7", label:"19:00-04:00", start:"19:00", end:"04:00", color:"#06B6D4" },
  { id:"s8", label:"23:00-08:00", start:"23:00", end:"08:00", color:"#8B5CF6" },
];

const DEFAULT_EMPLOYEES = [
  { id:"e1", name:"Ahmed Mohammed Ali", tasks:[], role:"Team Lead", gender:"M" },
  { id:"e2", name:"Mohammed Almutairi", tasks:[], role:"Shift Leader", gender:"M" },
  { id:"e3", name:"Manar Alturaiki", tasks:[], role:"Shift Leader", gender:"F" },
  { id:"e4", name:"Abdulaziz Alrusayni", tasks:[], role:"Shift Leader", gender:"M" },
  { id:"e5", name:"Yazeed Saad", tasks:[], role:"Shift Leader", gender:"M" },
  { id:"e6", name:"Sultan Ahmed", tasks:[], role:"Shift Leader", gender:"M" },
  { id:"e7", name:"Amar Saleh", tasks:[], role:"SME", gender:"M" },
  { id:"e8", name:"Amer Alanzi", tasks:[], role:"SME", gender:"M" },
  { id:"e9", name:"abdulelah fawaz alanazi", tasks:[], role:"SME", gender:"M" },
  { id:"e10", name:"Abdulrahman Alghamdi", tasks:[], role:"SME", gender:"M" },
  { id:"e11", name:"Emad Alzahrani", tasks:[], role:"SME", gender:"M" },
  { id:"e12", name:"Mohammed Nasser Althurwi", tasks:[], role:"SME", gender:"M" },
  { id:"e13", name:"Ghazi Alruways", tasks:[], role:"Agent", gender:"M" },
  { id:"e14", name:"Mohammed Alharthi", tasks:[], role:"Agent", gender:"M" },
  { id:"e15", name:"Shaima Alyami", tasks:[], role:"Agent", gender:"F" },
  { id:"e16", name:"Raed abdullah Allehaidan", tasks:[], role:"Agent", gender:"M" },
  { id:"e17", name:"Ali mohammed Khuzaee", tasks:[], role:"Agent", gender:"M" },
  { id:"e18", name:"Ali Haqawi", tasks:[], role:"Agent", gender:"M" },
  { id:"e19", name:"Nejoud Aljheimi", tasks:[], role:"Agent", gender:"F" },
  { id:"e20", name:"Abdullah Alzain", tasks:[], role:"Agent", gender:"M" },
  { id:"e21", name:"Abdulaziz Muqbil", tasks:[], role:"Agent", gender:"M" },
  { id:"e22", name:"Fahad Sager", tasks:[], role:"Agent", gender:"M" },
  { id:"e23", name:"Rayan Almaziad", tasks:[], role:"Agent", gender:"M" },
  { id:"e24", name:"Abdulmajeed Mohammed", tasks:[], role:"Agent", gender:"M" },
  { id:"e25", name:"Saad Aldahus", tasks:[], role:"Agent", gender:"M" },
  { id:"e26", name:"Khalid Alkhaldi", tasks:[], role:"Agent", gender:"M" },
  { id:"e27", name:"Talal Sagga", tasks:[], role:"Agent", gender:"M" },
  { id:"e28", name:"Rashed Aljaloud", tasks:[], role:"Agent", gender:"M" },
  { id:"e29", name:"Abdulkarem Alansari", tasks:[], role:"Agent", gender:"M" },
  { id:"e30", name:"Mohannad Alamri", tasks:[], role:"Agent", gender:"M" },
  { id:"e31", name:"Ahmed Awaji", tasks:[], role:"Agent", gender:"M" },
  { id:"e32", name:"Abdulelah Saud", tasks:[], role:"Agent", gender:"M" },
  { id:"e33", name:"Khalid Saeed", tasks:[], role:"Agent", gender:"M" },
  { id:"e34", name:"Nourah Alowayyid", tasks:[], role:"Agent", gender:"F" },
  { id:"e35", name:"Lujain Metwalli", tasks:[], role:"Agent", gender:"F" },
  { id:"e36", name:"Nasser Alhowimel", tasks:[], role:"Agent", gender:"M" },
  { id:"e37", name:"Majed Mohammed", tasks:[], role:"Agent", gender:"M" },
  { id:"e38", name:"Ahmed Alshehri", tasks:[], role:"Agent", gender:"M" },
  { id:"e39", name:"Faris Rashed", tasks:[], role:"Agent", gender:"M" },
  { id:"e40", name:"Abdullah Alharbi", tasks:[], role:"Agent", gender:"M" },
  { id:"e41", name:"Yousef Alrsheedi", tasks:[], role:"Agent", gender:"M" },
  { id:"e42", name:"Khaled Almarhom", tasks:[], role:"Agent", gender:"M" },
  { id:"e43", name:"Faez Almindah", tasks:[], role:"Agent", gender:"M" },
  { id:"e44", name:"Mohammed Jaseem", tasks:[], role:"Agent", gender:"M" },
  { id:"e45", name:"Mohammed Alnakhli", tasks:[], role:"Agent", gender:"M" },
  { id:"e46", name:"Saud Ali", tasks:[], role:"Agent", gender:"M" },
  { id:"e47", name:"Mohammed Alsahli", tasks:[], role:"Agent", gender:"M" },
  { id:"e48", name:"Yasir Seif", tasks:[], role:"Agent", gender:"M" },
  { id:"e49", name:"Sultan Alhamoudi", tasks:[], role:"Agent", gender:"M" },
  { id:"e50", name:"Mohammed Alobaid", tasks:[], role:"Agent", gender:"M" },
  { id:"e51", name:"Ramiz Ghashem", tasks:[], role:"Agent", gender:"M" },
  { id:"e52", name:"Khalid Mnsour", tasks:[], role:"Agent", gender:"M" },
  { id:"e53", name:"Khalid Mutlaq", tasks:[], role:"Agent", gender:"M" },
  { id:"e54", name:"Ali Harfash", tasks:[], role:"Agent", gender:"M" },
  { id:"e55", name:"Talal Alfaraj", tasks:[], role:"Agent", gender:"M" },
  { id:"e56", name:"Bader Alotaibi", tasks:[], role:"Agent", gender:"M" },
  { id:"e57", name:"Bandar Almalki", tasks:[], role:"Agent", gender:"M" },
  { id:"e58", name:"Ahmad Alharbi", tasks:[], role:"Agent", gender:"M" },
  { id:"e59", name:"Mohammed Alshehri", tasks:[], role:"Agent", gender:"M" },
  { id:"e60", name:"Abdulelah Alshehri", tasks:[], role:"Agent", gender:"M" },
  { id:"e61", name:"Saud Alzahrani", tasks:[], role:"Agent", gender:"M" },
  { id:"e62", name:"Faisal Saraan", tasks:[], role:"Agent", gender:"M" },
  { id:"e63", name:"Manal Aldosry", tasks:[], role:"Agent", gender:"F" },
  { id:"e64", name:"Hajer Alshreif", tasks:[], role:"Agent", gender:"F" },
  { id:"e65", name:"Mohammed Alabdullah", tasks:[], role:"Agent", gender:"M" },
  { id:"e66", name:"Abdulaziz Alsukait", tasks:[], role:"Agent", gender:"M" },
  { id:"e67", name:"Abdulkareem Mokhtar", tasks:[], role:"Agent", gender:"M" },
  { id:"e68", name:"Saad Alsaiqer", tasks:[], role:"Agent", gender:"M" },
  { id:"e69", name:"Yasser Alghamdi", tasks:[], role:"Agent", gender:"M" },
  { id:"e70", name:"Nasser Saad", tasks:[], role:"Agent", gender:"M" },
  { id:"e71", name:"Tariq Alhalmani", tasks:[], role:"Agent", gender:"M" },
  { id:"e72", name:"Saad Altukhayfi", tasks:[], role:"Agent", gender:"M" },
  { id:"e73", name:"Abdulaziz Massad Alanazi", tasks:[], role:"Agent", gender:"M" },
  { id:"e74", name:"Raneem Albaqami", tasks:[], role:"Agent", gender:"F" },
  { id:"e75", name:"Sarah Almihbash", tasks:[], role:"Agent", gender:"F" },
  { id:"e76", name:"Ahmed Khalid", tasks:[], role:"Agent", gender:"M" },
  { id:"e77", name:"Muath Ahmed", tasks:[], role:"Agent", gender:"M" },
  { id:"e78", name:"Mohamed Aljhani", tasks:[], role:"Agent", gender:"M" },
  { id:"e79", name:"Ziyad Ahmed", tasks:[], role:"Agent", gender:"M" },
  { id:"e80", name:"Faisal Alowis", tasks:[], role:"Agent", gender:"M" },
  { id:"e81", name:"Abdulaziz Alghamdi", tasks:[], role:"Agent", gender:"M" },
  { id:"e82", name:"Salma Aldossarie", tasks:[], role:"Agent", gender:"F" },
  { id:"e83", name:"Faisal Abdulrhman", tasks:[], role:"Agent", gender:"M" },
  { id:"e84", name:"Bader Alnaafisah", tasks:[], role:"Agent", gender:"M" },
  { id:"e85", name:"Faisal Baothman", tasks:[], role:"Agent", gender:"M" }
];

function buildDefaultSchedule(employees) {
  const sched = {};
  employees.forEach(emp => {
    sched[emp.id] = { Sunday:"OFF", Monday:"s7", Tuesday:"s7", Wednesday:"s7", Thursday:"s7", Friday:"OFF", Saturday:"OFF" };
  });
  return sched;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function toMin(t) { const [h,m] = t.split(":").map(Number); return h*60+m; }
function calcLateMin(shiftStart, checkIn) {
  let diff = toMin(checkIn) - toMin(shiftStart);
  if (diff > 720) diff -= 1440;
  if (diff < -720) diff += 1440;
  return diff;
}
function fmt(n) { return n>=0 ? `+${n}m` : `${n}m`; }
function pad(n) { return String(n).padStart(2,"0"); }
function todayStr() {
  // Always use Asia/Riyadh timezone
  return new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Riyadh"});
}
function monthDates(y,m) {
  const days=[];
  const d = new Date(y,m,1);
  while(d.getMonth()===m){ days.push(new Date(d).toISOString().slice(0,10)); d.setDate(d.getDate()+1); }
  return days;
}
function taskColor(t) { const i=TASK_LIST.indexOf(t); return TASK_COLORS[i%TASK_COLORS.length]; }

// ─── TASK PICKER — Edit Employee: dropdown KFOOD / KEEMRT only ────────────────
function TaskPicker({ selected=[], onChange }) {
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:8 }}>
        {TASK_LIST_ASSIGN.map(t => {
          const on = selected.includes(t);
          const c  = taskColor(t);
          return (
            <button key={t} onClick={()=>onChange(on ? selected.filter(x=>x!==t) : [...selected,t])}
              style={{ border:`2px solid ${c}`, borderRadius:8, padding:"8px 20px",
                fontSize:13, cursor:"pointer", fontWeight:700, flex:1,
                background: on ? c : "transparent", color: on ? "#fff" : c,
                transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              {on ? "✓" : "+"} {t}
            </button>
          );
        })}
      </div>
      <div style={{ fontSize:11, color:_theme.textMuted, marginTop:4 }}>
        Available tasks: KFOOD · KEEMRT
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, width=480 }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:5000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:_theme.card, borderRadius:12, width:"100%", maxWidth:width, maxHeight:"90vh", overflow:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.4)", border:`1px solid ${_theme.cardBorder}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:`1px solid ${_theme.cardBorder}`, position:"sticky", top:0, background:_theme.card, zIndex:1 }}>
          <span style={{ fontWeight:700, fontSize:16, color:_theme.text }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:_theme.textMuted }}>×</button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── SCHEDULE PAGE ────────────────────────────────────────────────────────────
function SchedulePage({ employees, setEmployees, schedule, setSchedule, shifts, canEdit, notes, setNotes, session }) {
  const [showAdd, setShowAdd]       = useState(false);
  const [editEmp, setEditEmp]       = useState(null);
  const [newEmp, setNewEmp]         = useState({ name:"", tasks:[], role:"Agent", gender:"M" });
  const [showImport, setShowImport] = useState(false);
  const [importPreview, setImportPreview] = useState([]);
  const [importErrors, setImportErrors]   = useState([]);
  const [showSwap, setShowSwap]     = useState(false);
  const [swapEmp1, setSwapEmp1]     = useState("");
  const [swapEmp2, setSwapEmp2]     = useState("");
  const [swapDay,  setSwapDay]      = useState(DAYS[new Date().getDay()]);
  const [swapDone, setSwapDone]     = useState("");
  // Day filter: {dayName: Set of shiftIds} -- null means show all
  const [dayFilters, setDayFilters] = useState({}); // { "Sunday": ["s1","s2"], ... }
  const [filterPopup, setFilterPopup] = useState(null); // dayName currently showing popup
  const fileRef = useRef();
  const today = new Date().getDay();

  // ── New Schedule enhancements ─────────────────────────────────────────────
  const [searchEmp, setSearchEmp]       = useState("");
  const [groupByShift, setGroupByShift] = useState(false);
  const [viewMode, setViewMode]         = useState("week"); // "week" | "day"
  const [viewDay, setViewDay]           = useState(DAYS[new Date().getDay()]);
  const [quickShift, setQuickShift]     = useState(""); // shiftId filter
  const [showRoles, setShowRoles]       = useState(true);
  const [showCopyWeek, setShowCopyWeek] = useState(false);
  const [copyFromWeek, setCopyFromWeek] = useState("");
  const [copyToWeek, setCopyToWeek]     = useState("");
  const [copyDone, setCopyDone]         = useState("");
  // Drag & Drop order — stored as array of employee IDs
  const [empOrder, setEmpOrder] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("csops_empOrder")||"null");
      if (saved) return saved;
      // Default order from employee list (matches Excel sheet order)
      return null; // will use DEFAULT_EMPLOYEES order
    } catch { return null; }
  });
  const dragItem  = useRef(null);
  const dragOver  = useRef(null);

  // Ordered employees list
  const orderedEmps = useMemo(() => {
    if (!empOrder) return employees;
    const ordered = empOrder
      .map(id => employees.find(e => e.id === id))
      .filter(Boolean);
    // Append any new employees not yet in order
    const remaining = employees.filter(e => !empOrder.includes(e.id));
    return [...ordered, ...remaining];
  }, [employees, empOrder]);

  // Save order
  function saveOrder(newOrder) {
    const ids = newOrder.map(e => e.id);
    setEmpOrder(ids);
    try { localStorage.setItem("csops_empOrder", JSON.stringify(ids)); } catch {}
    // Also persist in employees array order via setEmployees
    setEmployees(newOrder);
  }

  // Drag handlers
  function onDragStart(e, idx) {
    dragItem.current = idx;
    e.dataTransfer.effectAllowed = "move";
  }
  function onDragEnter(idx) { dragOver.current = idx; }
  function onDragEnd() {
    if (dragItem.current === null || dragOver.current === null ||
        dragItem.current === dragOver.current) { dragItem.current = dragOver.current = null; return; }
    const list = [...filteredEmps];
    const dragged = list.splice(dragItem.current, 1)[0];
    list.splice(dragOver.current, 0, dragged);
    // Rebuild full order: replace filtered positions, keep unfiltered in place
    const newFull = [...orderedEmps];
    const filteredIds = filteredEmps.map(e=>e.id);
    let fi = 0;
    for (let i=0; i<newFull.length; i++) {
      if (filteredIds.includes(newFull[i].id)) {
        newFull[i] = list[fi++];
      }
    }
    saveOrder(newFull);
    dragItem.current = dragOver.current = null;
  }

  // Copy Week function
  function doCopyWeek() {
    if (!copyFromWeek || !copyToWeek) { setCopyDone("❌ Select both weeks"); return; }
    const fromStart = new Date(copyFromWeek);
    const toStart   = new Date(copyToWeek);
    // For each employee, copy their week pattern
    const newSched = { ...schedule };
    employees.forEach(emp => {
      const empSched = { ...(schedule[emp.id]||{}) };
      DAYS.forEach((dayName, di) => {
        const fromDate = new Date(fromStart); fromDate.setDate(fromStart.getDate() + di);
        const toDate   = new Date(toStart);   toDate.setDate(toStart.getDate() + di);
        const fromKey  = fromDate.toLocaleDateString("en-US",{weekday:"long"});
        const toKey    = toDate.toLocaleDateString("en-US",{weekday:"long"});
        empSched[toKey] = empSched[fromKey] || "OFF";
      });
      newSched[emp.id] = empSched;
    });
    setSchedule(newSched);
    setCopyDone(`✅ Schedule copied from week ${copyFromWeek} to ${copyToWeek}`);
    setTimeout(() => { setCopyDone(""); setShowCopyWeek(false); }, 3000);
  }

  function doSwap() {
    if (!swapEmp1 || !swapEmp2 || swapEmp1===swapEmp2) {
      alert("Please select two different employees."); return;
    }
    const s1 = (schedule[swapEmp1]||{})[swapDay] || "OFF";
    const s2 = (schedule[swapEmp2]||{})[swapDay] || "OFF";
    setSchedule(prev => ({
      ...prev,
      [swapEmp1]: { ...(prev[swapEmp1]||{}), [swapDay]: s2 },
      [swapEmp2]: { ...(prev[swapEmp2]||{}), [swapDay]: s1 },
    }));
    const e1 = employees.find(e=>e.id===swapEmp1);
    const e2 = employees.find(e=>e.id===swapEmp2);
    const sh1 = shifts.find(s=>s.id===s1);
    const sh2 = shifts.find(s=>s.id===s2);
    setSwapDone(
      `✅ Swap done for ${swapDay}:\n` +
      `${e1?.name}: ${sh1?.label||"Day Off"} ↔ ${sh2?.label||"Day Off"}\n` +
      `${e2?.name}: ${sh2?.label||"Day Off"} ↔ ${sh1?.label||"Day Off"}`
    );
  }

  // ── Helpers ──
  function addEmployee() {
    if (!newEmp.name.trim()) return;
    const id = "e"+Date.now();
    setEmployees(prev => [...prev, { id, ...newEmp }]);
    setSchedule(prev => ({ ...prev, [id]: { Sunday:"OFF", Monday:"OFF", Tuesday:"OFF", Wednesday:"OFF", Thursday:"OFF", Friday:"OFF", Saturday:"OFF" } }));
    setNewEmp({ name:"", tasks:[], role:"Agent" });
    setShowAdd(false);
  }
  function updateEmployee() {
    setEmployees(prev => prev.map(e => e.id===editEmp.id ? editEmp : e));
    setEditEmp(null);
  }
  function setShift(empId, day, val) {
    setSchedule(prev => ({ ...prev, [empId]: { ...prev[empId], [day]: val } }));
  }

  // ── Resolve cell → shift id ──────────────────────────────────────────────────
  // Accepts: time ranges, shift labels, WO, Leave, PH, OFF, blank, numbers
  function resolveShiftId(raw) {
    if (raw === null || raw === undefined || raw === "") return "OFF";
    const v = String(raw).trim();
    if (!v) return "OFF";

    // ── OFF variants ──
    if (/^(off|wo|w\.o\.?|ph|public.?holiday|holiday|day.?off|leave|annual|إجازة|اجازة|يوم.?إجازة|عطلة|-)$/i.test(v))
      return "OFF";

    // ── Exact label match e.g. "08:00-17:00" ──
    const byLabel = shifts.find(s => s.label.toLowerCase() === v.toLowerCase());
    if (byLabel) return byLabel.id;

    // ── Time range e.g. "08:00-17:00" or "8:00-17:00" ──
    const rangeMatch = v.match(/^(\d{1,2}:\d{2})\s*[-\u2013\u2014]\s*(\d{1,2}:\d{2})$/);
    if (rangeMatch) {
      const norm = ts => ts.replace(/^(\d):/, "0$1:");
      const start = norm(rangeMatch[1]);
      const end   = norm(rangeMatch[2]);
      const exact = shifts.find(s => s.start === start && s.end === end);
      if (exact) return exact.id;
      const byStart = shifts.find(s => s.start === start);
      if (byStart) return byStart.id;
      // Closest by start
      const startMin = toMin(start);
      let closest = shifts[0], minDiff = Infinity;
      shifts.forEach(s => { const diff=Math.abs(toMin(s.start)-startMin); if(diff<minDiff){minDiff=diff;closest=s;} });
      return closest.id;
    }

    // ── Single time "08:00" → match start ──
    const timeMatch = v.match(/^(\d{1,2}:\d{2})$/);
    if (timeMatch) {
      const norm = ts => ts.replace(/^(\d):/, "0$1:");
      const s = shifts.find(sh => sh.start === norm(timeMatch[1]));
      if (s) return s.id;
    }

    // ── Number only → try as hour "8" → "08:00" ──
    if (/^\d{1,2}$/.test(v)) {
      const h = parseInt(v);
      const hStr = pad(h)+":00";
      const s = shifts.find(sh => sh.start === hStr);
      if (s) return s.id;
    }

    // ── Legacy "Shift N" names ──
    if (/^shift\s*\d+$/i.test(v)) {
      const byOld = shifts.find(s => s.label.toLowerCase() === v.toLowerCase());
      if (byOld) return byOld.id;
    }

    return "OFF";
  }

  // ── Parse Excel file -- handles ANY structure ──────────────────────────────────
  function handleFile(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    // Handle CSV separately
    if (file.name.toLowerCase().endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const text = ev.target.result;
          const rows = text.split("\n").map(r =>
            r.split(",").map(c => c.replace(/^"|"$/g,"").trim())
          ).filter(r => r.some(c=>c));
          if (rows.length < 2) { alert("CSV is empty."); return; }
          parseScheduleRows(rows);
        } catch(err) { alert("Error reading CSV:\n"+err.message); }
      };
      reader.readAsText(file, "UTF-8");
      return;
    }

    // Excel
    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        const XLSX = await waitForXLSX();
        const wb   = XLSX.read(ev.target.result, { type:"array", cellDates:false });
        const ws   = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:"", raw:true });
        if (!rows.length) { alert("File is empty."); return; }
        parseScheduleRows(rows);
      } catch(err) {
        console.error("Excel import error:", err);
        alert("Error reading file:\n" + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function parseScheduleRows(rows) {
        // ── Day name aliases (Arabic + English) ──────────────────────────────
        const DAY_MAP = {
          sunday:["sunday","sun","ahad","الأحد","احد","اح"],
          monday:["monday","mon","ithnain","الاثنين","اثنين","اث"],
          tuesday:["tuesday","tue","thulatha","الثلاثاء","ثلاثاء","ثل"],
          wednesday:["wednesday","wed","arbia","الأربعاء","اربعاء","ار"],
          thursday:["thursday","thu","khamis","الخميس","خميس","خم"],
          friday:["friday","fri","jumua","الجمعة","جمعة","جم"],
          saturday:["saturday","sat","sabt","السبت","سبت","سب"],
        };
        const DAY_KEYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

        function matchDay(cell) {
          const c = String(cell).trim().toLowerCase().replace(/\s+/g,"");
          for (const [key, aliases] of Object.entries(DAY_MAP)) {
            if (aliases.some(a => c.includes(a.toLowerCase()))) return key.charAt(0).toUpperCase()+key.slice(1);
          }
          // Try date → day-of-week
          if (/\d/.test(c)) {
            try {
              // Excel serial number
              const serial = Number(cell);
              if (!isNaN(serial) && serial > 40000 && serial < 60000) {
                const jsDate = new Date(Math.round((serial - 25569) * 86400 * 1000));
                return DAYS[jsDate.getDay()];
              }
              // Date string e.g. "3/17/2026", "17-03-2026"
              const d = new Date(String(cell));
              if (!isNaN(d)) return DAYS[d.getDay()];
            } catch {}
          }
          return null;
        }

        function isNameHeader(cell) {
          return /name|employee|staff/i.test(String(cell).trim());
        }

        function isNumOrEmpty(cell) {
          const s = String(cell).trim();
          return !s || /^\d+$/.test(s);
        }

        // ── Find the header row (contains day names or "Name") ──────────────
        let headerRowIdx = -1;
        let colMap = {}; // colIdx → DayName
        let nameCol = 0;

        for (let ri = 0; ri < Math.min(10, rows.length); ri++) {
          const row = rows[ri];
          const tmpMap = {};
          let dayCount = 0;
          let hasName = false;

          row.forEach((cell, ci) => {
            const d = matchDay(cell);
            if (d) { tmpMap[ci] = d; dayCount++; }
            if (isNameHeader(cell)) { hasName = true; nameCol = ci; }
          });

          if (dayCount >= 3) {
            // Good header row -- has enough day columns
            colMap = tmpMap;
            headerRowIdx = ri;
            // Also check same row for name col
            if (!hasName) {
              // Name col is probably col 0 or first non-day col
              for (let ci = 0; ci < row.length; ci++) {
                if (!colMap[ci]) { nameCol = ci; break; }
              }
            }
            break;
          }

          if (hasName && dayCount >= 1) {
            colMap = tmpMap;
            headerRowIdx = ri;
            break;
          }
        }

        // ── If still no day columns, try each row looking for time ranges ───
        if (Object.keys(colMap).length === 0) {
          // Maybe the file has NO day header -- just name + shift values
          // In this case try row 0 as header
          headerRowIdx = 0;
          nameCol = 0;
          // We'll map columns by position: col0=name, rest=days in order
          DAY_KEYS.forEach((day, i) => { colMap[i+1] = day; });
        }

        const dataStart = headerRowIdx + 1;

        // ── Parse employee rows ──────────────────────────────────────────────
        const preview = [];
        const warnings = [];

        for (let ri = dataStart; ri < rows.length; ri++) {
          const row = rows[ri];
          const rawName = String(row[nameCol] || "").trim();
          if (!rawName || isNumOrEmpty(rawName) || isNameHeader(rawName)) continue;
          // Skip rows that look like sub-headers (all day names)
          if (row.filter(c => matchDay(c)).length >= 5) continue;

          const days = {
            Sunday:"OFF", Monday:"OFF", Tuesday:"OFF",
            Wednesday:"OFF", Thursday:"OFF", Friday:"OFF", Saturday:"OFF"
          };

          Object.entries(colMap).forEach(([ci, dayName]) => {
            const raw = String(row[Number(ci)] ?? "").trim();
            if (!raw) return;
            const sid = resolveShiftId(raw);
            days[dayName] = sid;
            if (raw && sid === "OFF") {
              const skip = /^(off|wo|w\.o|ph|holiday|day.?off|leave|annual|إجازة|اجازة|يوم|عطلة|休|-)$/i;
              if (!skip.test(raw)) warnings.push(`"${rawName}" · ${dayName}: "${raw}" → OFF`);
            }
          });

          preview.push({ name:rawName, role:"Agent", tasks:[], days });
        }

        if (preview.length === 0) {
          alert(
            "⚠️ No data found.\n\n" +
            "Please ensure the file contains:\n" +
            "• A row with day names (Sunday, Monday...)\n" +
            "• A column with employee names\n" +
            "• Shift values: time like 08:00-17:00 or OFF"
          );
          return;
        }

        setImportPreview(preview);
        setImportErrors(warnings);
        setShowImport(true);
  }

  // ── Confirm import: update existing employees or add new ones ──
  function confirmImport() {
    // Batch ALL schedule changes into one single setState call
    const newScheduleEntries = {};
    const newEmployees = [];

    importPreview.forEach(row => {
      const existing = employees.find(e => e.name.toLowerCase().trim() === row.name.toLowerCase().trim());
      if (existing) {
        // Update schedule for existing employee
        newScheduleEntries[existing.id] = {
          Sunday:"OFF", Monday:"OFF", Tuesday:"OFF",
          Wednesday:"OFF", Thursday:"OFF", Friday:"OFF", Saturday:"OFF",
          ...row.days
        };
      } else {
        // New employee — create with unique id
        const id = "e" + Date.now() + Math.floor(Math.random()*10000);
        newEmployees.push({ id, name:row.name, role:row.role||"Agent", tasks:row.tasks||[], gender:"M" });
        newScheduleEntries[id] = {
          Sunday:"OFF", Monday:"OFF", Tuesday:"OFF",
          Wednesday:"OFF", Thursday:"OFF", Friday:"OFF", Saturday:"OFF",
          ...row.days
        };
      }
    });

    // Apply all schedule changes at once
    setSchedule(prev => ({ ...prev, ...newScheduleEntries }));

    // Add new employees if any
    if (newEmployees.length > 0) {
      setEmployees(prev => [...prev, ...newEmployees]);
    }

    setShowImport(false);
    setImportPreview([]);
    setImportErrors([]);

    // Confirm to user
    const updated = importPreview.filter(r => employees.find(e => e.name.toLowerCase().trim()===r.name.toLowerCase().trim())).length;
    const added   = newEmployees.length;
    alert(`✅ Import complete!\n${updated} employees updated · ${added} new employees added`);
  }

  // ── Download template with two-row header ──
  async function downloadTemplate() {
    let XLSX;
    try { XLSX = await waitForXLSX(); } catch(e) { alert(e.message); return; }
    const row1 = ["Name", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const examples = employees.slice(0,5).map(emp => {
      const row = [emp.name];
      DAYS.forEach(day => {
        const sid = (schedule[emp.id]||{})[day]||"OFF";
        const sh  = shifts.find(s=>s.id===sid);
        row.push(sh ? sh.label : "OFF");
      });
      return row;
    });
    // Add blank rows for remaining employees
    employees.slice(5).forEach(emp => {
      examples.push([emp.name, ...DAYS.map(day => {
        const sid = (schedule[emp.id]||{})[day]||"OFF";
        const sh  = shifts.find(s=>s.id===sid);
        return sh ? sh.label : "OFF";
      })]);
    });
    const ws = XLSX.utils.aoa_to_sheet([row1, ...examples]);
    ws["!cols"] = [{ wch:28 }, ...Array(7).fill({ wch:14 })];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schedule");
    XLSX.writeFile(wb, "schedule-template.xlsx");
  }

  async function downloadCSV() {
    const rows = [["Name","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]];
    employees.forEach(emp => {
      const row = [emp.name];
      DAYS.forEach(day => {
        const sid = (schedule[emp.id]||{})[day]||"OFF";
        const sh  = shifts.find(s=>s.id===sid);
        row.push(sh ? sh.label : "OFF");
      });
      rows.push(row);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "schedule.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  // Filtered + ordered employee list
  const filteredEmps = useMemo(() => {
    let list = orderedEmps;
    // Agent sees ONLY their own row
    if (session?.role === "Agent") {
      return list.filter(e => e.name === session?.name);
    }
    if (searchEmp.trim()) {
      const q = searchEmp.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q));
    }
    if (quickShift) {
      const todayName = DAYS[new Date().getDay()];
      list = list.filter(e => (schedule[e.id]||{})[todayName] === quickShift);
    }
    return list;
  }, [orderedEmps, searchEmp, quickShift, schedule, session]);

  // Grouped by today's shift
  const groupedEmps = useMemo(() => {
    if (!groupByShift) return null;
    const todayName = DAYS[new Date().getDay()];
    const groups = {};
    filteredEmps.forEach(e => {
      const sid = (schedule[e.id]||{})[todayName] || "OFF";
      if (!groups[sid]) groups[sid] = [];
      groups[sid].push(e);
    });
    return groups;
  }, [filteredEmps, groupByShift, schedule]);

  // Today's KPI strip
  const todayKPIs = useMemo(() => {
    const todayName = DAYS[new Date().getDay()];
    const counts = {};
    employees.forEach(e => {
      const sid = (schedule[e.id]||{})[todayName] || "OFF";
      counts[sid] = (counts[sid]||0) + 1;
    });
    return counts;
  }, [employees, schedule]);

  // Week preview
  const weekCards = DAYS.map((day, di) => {
    const groups = {};
    employees.forEach(emp => {
      const sid = (schedule[emp.id]||{})[day];
      if (!sid || sid==="OFF") return;
      if (!groups[sid]) groups[sid]=[];
      groups[sid].push(emp.name);
    });
    return { day, di, groups };
  });

  // Final employee list to render (grouped or flat)
  const renderList = groupByShift ? null : filteredEmps;

  return (
    <div>
      {/* ── Main Toolbar ── */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:10, alignItems:"center" }}>
        <span style={{ fontWeight:800, fontSize:15, color:_theme.text }}>📅 Weekly Schedule</span>
        <input value={searchEmp} onChange={e=>setSearchEmp(e.target.value)}
          style={{ ...I({width:180}) }} placeholder="🔍 Search employee..."/>
        <div style={{ display:"flex", gap:0 }}>
          {[["week","📅 Weekly"],["day","📋 Daily"]].map(([k,l])=>(
            <button key={k} onClick={()=>setViewMode(k)}
              style={{ background:viewMode===k?_theme.primary:"transparent",
                color:viewMode===k?"#fff":_theme.textSub,
                border:`1px solid ${_theme.primary}`, padding:"6px 12px",
                borderRadius:k==="week"?"7px 0 0 7px":"0 7px 7px 0",
                fontSize:12, cursor:"pointer", fontWeight:700 }}>{l}</button>
          ))}
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:6, flexWrap:"wrap" }}>
          {canEdit && <button style={PBT("#2563EB",{fontSize:12})} onClick={()=>setShowAdd(true)}>+ employees</button>}
          <button style={PBT("#475569",{fontSize:12})} onClick={()=>fileRef.current.click()}>📥 Import</button>
          <button style={PBT("#10B981",{fontSize:12})} onClick={downloadCSV}>⬇️ CSV</button>
          {canEdit && <button style={PBT("#8B5CF6",{fontSize:12})} onClick={()=>{ setShowSwap(true); setSwapDone(""); }}>🔄 Swap</button>}
          {canEdit && <button style={PBT("#F59E0B",{fontSize:12})} onClick={()=>setShowCopyWeek(true)}>📋 Copy Week</button>}
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={handleFile}/>
      </div>

      {/* ── Quick Shift Filter + View Options ── */}
      <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>Quick Shift:</span>
        <button onClick={()=>setQuickShift("")}
          style={{ border:`1.5px solid ${!quickShift?_theme.primary:"#CBD5E1"}`,
            borderRadius:20, padding:"3px 12px", fontSize:11, cursor:"pointer",
            background:!quickShift?_theme.primary+"22":"transparent",
            color:!quickShift?_theme.primary:_theme.textMuted, fontWeight:700 }}>All</button>
        {shifts.map(sh=>(
          <button key={sh.id} onClick={()=>setQuickShift(quickShift===sh.id?"":sh.id)}
            style={{ border:`1.5px solid ${quickShift===sh.id?sh.color:"#CBD5E1"}`,
              borderRadius:20, padding:"3px 12px", fontSize:11, cursor:"pointer",
              background:quickShift===sh.id?sh.color+"22":"transparent",
              color:quickShift===sh.id?sh.color:_theme.textMuted, fontWeight:700 }}>
            {sh.label} ({employees.filter(e=>(schedule[e.id]||{})[DAYS[new Date().getDay()]]===sh.id).length})
          </button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          <button onClick={()=>setGroupByShift(g=>!g)}
            style={{ border:`1.5px solid ${groupByShift?_theme.accent:"#CBD5E1"}`,
              borderRadius:20, padding:"3px 12px", fontSize:11, cursor:"pointer",
              background:groupByShift?_theme.accent+"22":"transparent",
              color:groupByShift?_theme.accent:_theme.textMuted, fontWeight:700 }}>
            {groupByShift?"✅ Grouped":"⊞ Group by Shift"}
          </button>
          <button onClick={()=>setShowRoles(r=>!r)}
            style={{ border:"1.5px solid #CBD5E1", borderRadius:20, padding:"3px 12px",
              fontSize:11, cursor:"pointer", color:_theme.textMuted, fontWeight:700 }}>
            🏷️ {showRoles?"Hide Roles":"Show Roles"}
          </button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ ...CRD({padding:"8px 14px"}), display:"flex", gap:10, alignItems:"center",
          flex:1, flexWrap:"wrap" }}>
          <span style={{ fontSize:11, color:_theme.textMuted, fontWeight:700 }}>
            👥 Total: {employees.length}
          </span>
          {shifts.map(sh=>(
            <span key={sh.id} style={{ background:sh.color+"22", color:sh.color,
              border:`1px solid ${sh.color}40`, borderRadius:20, padding:"2px 10px",
              fontSize:11, fontWeight:700 }}>
              {sh.label}: {todayKPIs[sh.id]||0}
            </span>
          ))}
          <span style={{ background:"#94A3B822", color:"#94A3B8",
            border:"1px solid #CBD5E1", borderRadius:20, padding:"2px 10px",
            fontSize:11, fontWeight:700 }}>
            OFF: {employees.length - shifts.reduce((s,sh)=>s+(todayKPIs[sh.id]||0),0)}
          </span>
          {searchEmp && (
            <span style={{ color:_theme.primary, fontSize:11, fontWeight:700 }}>
              🔍 {filteredEmps.length} results
            </span>
          )}
        </div>
      </div>

      {/* ── Copy Week Modal ── */}
      {showCopyWeek && (
        <div style={{ ...CRD(), marginBottom:16, border:`2px solid #F59E0B` }}>
          <div style={{ fontWeight:700, color:_theme.text, marginBottom:10 }}>📋 Copy Full Week Schedule</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div>
              <label style={LBL}>From (week start)</label>
              <input type="date" value={copyFromWeek} onChange={e=>setCopyFromWeek(e.target.value)} style={I()}/>
            </div>
            <div>
              <label style={LBL}>To (week start)</label>
              <input type="date" value={copyToWeek} onChange={e=>setCopyToWeek(e.target.value)} style={I()}/>
            </div>
          </div>
          {copyDone && (
            <div style={{ fontSize:12, color:copyDone.startsWith("✅")?"#10B981":"#EF4444",
              fontWeight:600, marginBottom:8 }}>{copyDone}</div>
          )}
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={doCopyWeek} style={PBT("#F59E0B",{flex:1})}>📋 Copy Schedule</button>
            <button onClick={()=>setShowCopyWeek(false)}
              style={PBT("#94A3B8",{padding:"8px 16px"})}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Day View ── */}
      {viewMode==="day" && (
        <div style={{ ...CRD(), marginBottom:20 }}>
          <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
            {DAYS.map(d=>(
              <button key={d} onClick={()=>setViewDay(d)}
                style={{ border:`2px solid ${viewDay===d?_theme.primary:"#CBD5E1"}`,
                  borderRadius:20, padding:"5px 14px", fontSize:12, cursor:"pointer", fontWeight:700,
                  background:viewDay===d?_theme.primary:"transparent",
                  color:viewDay===d?"#fff":_theme.textSub }}>{d.slice(0,3)}</button>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8 }}>
            {(() => {
              const dayGroups = {};
              filteredEmps.forEach(e => {
                const sid=(schedule[e.id]||{})[viewDay]||"OFF";
                if (!dayGroups[sid]) dayGroups[sid]=[];
                dayGroups[sid].push(e);
              });
              return Object.entries(dayGroups).map(([sid, emps])=>{
                const sh=shifts.find(s=>s.id===sid);
                return (
                  <div key={sid} style={{ ...CRD({padding:"10px 12px"}),
                    borderTop:`3px solid ${sh?sh.color:"#94A3B8"}` }}>
                    <div style={{ fontWeight:800, fontSize:12,
                      color:sh?sh.color:"#94A3B8", marginBottom:8 }}>
                      {sh?sh.label:"OFF / Leave"} ({emps.length})
                    </div>
                    {emps.map(e=>(
                      <div key={e.id} style={{ fontSize:12, color:_theme.text,
                        padding:"3px 0", borderBottom:`1px solid ${_theme.cardBorder}20`,
                        display:"flex", alignItems:"center", gap:6 }}>
                        {showRoles && (
                          <span style={{ fontSize:9, fontWeight:800, padding:"1px 4px",
                            borderRadius:4, background:(ROLE_COLORS[e.role]||"#64748B")+"22",
                            color:ROLE_COLORS[e.role]||"#64748B",
                            border:`1px solid ${(ROLE_COLORS[e.role]||"#64748B")}40` }}>
                            {ROLE_ICONS[e.role]||"👤"}
                          </span>
                        )}
                        {e.name}
                      </div>
                    ))}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* ── Week View (Table) ── */}
      {viewMode==="week" && (
      <div style={{ ...CRD(), overflowX:"auto", marginBottom:20 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
              {canEdit && <th style={{ width:24, borderBottom:`2px solid ${_theme.cardBorder}` }}/>}
              <th style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:_theme.text,
                borderBottom:`2px solid ${_theme.cardBorder}`, minWidth:180,
                position:"sticky", left:0, background:_theme.isDark?"#0D1117":"#F8FAFC",
                zIndex:2 }}>Employee</th>
              {DAYS.map((day, di) => {
                const now2   = new Date();
                const diff   = di - now2.getDay();
                const d2     = new Date(now2); d2.setDate(now2.getDate()+diff);
                const dateStr = d2.getDate()+"/"+(d2.getMonth()+1);
                const activeFilters = dayFilters[day]||[];
                const hasFilter = activeFilters.length > 0;
                return (
                  <th key={day} style={{ padding:"8px 6px", textAlign:"center", fontWeight:700,
                    color: di===today?_theme.primary:_theme.text,
                    borderBottom:`2px solid ${_theme.cardBorder}`,
                    background: di===today?_theme.primary+"18":"transparent", minWidth:110, position:"relative" }}>
                    {/* Day name + date */}
                    <div>{day.slice(0,3)}</div>
                    <div style={{ fontSize:10, color:di===today?_theme.primary:_theme.textMuted, fontWeight:600 }}>{dateStr}</div>
                    {di===today && <div style={{ fontSize:9, color:_theme.primary, fontWeight:700 }}>TODAY</div>}
                    {/* Filter button */}
                    <button onClick={()=>setFilterPopup(filterPopup===day?null:day)}
                      title="Filter by shift"
                      style={{ background: hasFilter?"#2563EB":"rgba(100,116,139,0.1)",
                        border:"none", borderRadius:4, cursor:"pointer", fontSize:9,
                        padding:"2px 5px", marginTop:3, color:hasFilter?"#fff":"#64748B",
                        fontWeight:700, display:"block", margin:"3px auto 0" }}>
                      {hasFilter ? `🔽 ${activeFilters.length}` : "🔽"}
                    </button>
                    {/* Filter dropdown popup */}
                    {filterPopup===day && (
                      <div style={{ position:"absolute", top:"100%", left:"50%", transform:"translateX(-50%)",
                        background:"#fff", border:"1px solid #E2E8F0", borderRadius:10,
                        boxShadow:"0 8px 24px rgba(0,0,0,0.15)", zIndex:200, padding:10,
                        minWidth:160, textAlign:"left" }}>
                        <div style={{ fontSize:11, fontWeight:700, color:_theme.text, marginBottom:6 }}>
                          Filter -- {day}
                        </div>
                        {/* Clear */}
                        <button onClick={()=>{ setDayFilters(p=>({...p,[day]:[]})); }}
                          style={{ ...PBT("#94A3B8",{ fontSize:10, padding:"3px 8px", width:"100%", marginBottom:6 }) }}>
                          ✕ Show All
                        </button>
                        {/* Shift options */}
                        {shifts.map(s => {
                          const sel = activeFilters.includes(s.id);
                          return (
                            <div key={s.id} onClick={()=>{
                              setDayFilters(p=>{
                                const cur = p[day]||[];
                                return {...p, [day]: sel ? cur.filter(x=>x!==s.id) : [...cur,s.id]};
                              });
                            }} style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 6px",
                              borderRadius:6, cursor:"pointer", marginBottom:2,
                              background:sel?s.color+"18":"transparent",
                              border:sel?`1px solid ${s.color}40`:"1px solid transparent" }}>
                              <div style={{ width:10, height:10, borderRadius:3, background:s.color, flexShrink:0 }}/>
                              <span style={{ fontSize:11, fontWeight:sel?700:400, color:sel?s.color:_theme.textSub }}>
                                {s.label}
                              </span>
                              {sel && <span style={{ marginLeft:"auto", fontSize:10, color:s.color }}>✓</span>}
                            </div>
                          );
                        })}
                        {/* Day Off option */}
                        {[["OFF","🔘 Day Off","#64748B"],["LEAVE","🏖️ Leave","#F59E0B"],["PH","🎌 Public Holiday","#8B5CF6"]].map(([v,l,c])=>{
                          const sel=activeFilters.includes(v);
                          return (
                            <div key={v} onClick={()=>{
                              setDayFilters(p=>{
                                const cur=p[day]||[];
                                return {...p,[day]:sel?cur.filter(x=>x!==v):[...cur,v]};
                              });
                            }} style={{ display:"flex",alignItems:"center",gap:6,padding:"4px 6px",
                              borderRadius:6,cursor:"pointer",marginBottom:2,
                              background:sel?c+"18":"transparent",
                              border:sel?`1px solid ${c}40`:"1px solid transparent"}}>
                              <span style={{fontSize:11,fontWeight:sel?700:400,color:sel?c:"#475569"}}>{l}</span>
                              {sel&&<span style={{marginLeft:"auto",fontSize:10,color:c}}>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </th>
                );
              })}
              <th style={{ padding:"10px 8px", borderBottom:`2px solid ${_theme.cardBorder}` }}></th>
            </tr>
          </thead>
          <tbody>
            {/* Flat or grouped rendering */}
            {(groupByShift ? Object.entries(groupedEmps||{}) : [[null, renderList||[]]]).flatMap(([sid, empList], gi) => {
              const sh = sid ? shifts.find(s=>s.id===sid) : null;
              const rows = [];
              // Group header
              if (groupByShift) {
                rows.push(
                  <tr key={"grp-"+gi}>
                    <td colSpan={DAYS.length+3} style={{ padding:"6px 12px",
                      background:sh?sh.color+"18":_theme.surface,
                      borderTop:`2px solid ${sh?sh.color:"#94A3B8"}`,
                      fontWeight:800, fontSize:12,
                      color:sh?sh.color:_theme.textMuted }}>
                      {sh?sh.label:"OFF / Leave"} — {empList.length} employees
                    </td>
                  </tr>
                );
              }
              empList.forEach((emp, ri) => {
                const passesFilter = DAYS.every(day => {
                  const f = dayFilters[day]||[];
                  if (f.length===0) return true;
                  return f.includes((schedule[emp.id]||{})[day]||"OFF");
                });
                if (!passesFilter) return;
                const globalIdx = orderedEmps.findIndex(e=>e.id===emp.id);
                rows.push(
                <tr key={emp.id}
                  draggable={canEdit}
                  onDragStart={e=>canEdit&&onDragStart(e,ri)}
                  onDragEnter={()=>canEdit&&onDragEnter(ri)}
                  onDragEnd={()=>canEdit&&onDragEnd()}
                  onDragOver={e=>e.preventDefault()}
                  style={{ background: ri%2===0?_theme.card:_theme.surface,
                    cursor:canEdit?"grab":"default",
                    opacity: dragItem.current===ri?0.5:1,
                    transition:"opacity 0.1s" }}>
                  {/* Drag handle */}
                  {canEdit && (
                    <td style={{ padding:"4px 6px", color:_theme.textMuted, fontSize:16,
                      cursor:"grab", userSelect:"none", textAlign:"center" }}>⠿</td>
                  )}
                  {/* Sticky name cell */}
                  <td style={{ padding:"8px 12px", fontWeight:600, color:_theme.text,
                    position:"sticky", left:0, background:ri%2===0?_theme.card:_theme.surface,
                    zIndex:1, boxShadow:"2px 0 4px rgba(0,0,0,0.05)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      {showRoles && (
                        <span style={{ fontSize:10, fontWeight:800, padding:"1px 5px", borderRadius:4,
                          background:(ROLE_COLORS[emp.role]||"#64748B")+"22",
                          color:ROLE_COLORS[emp.role]||"#64748B",
                          border:`1px solid ${(ROLE_COLORS[emp.role]||"#64748B")}40`,
                          whiteSpace:"nowrap" }}>
                          {ROLE_ICONS[emp.role]||"👤"} {emp.role.slice(0,3)}
                        </span>
                      )}
                      <span>{emp.name}</span>
                      <span style={{ fontSize:9, fontWeight:800, padding:"1px 5px", borderRadius:4,
                        background:emp.gender==="F"?"#FCE7F3":"#EFF6FF",
                        color:emp.gender==="F"?"#BE185D":"#1D4ED8",
                        border:emp.gender==="F"?"1px solid #F9A8D4":"1px solid #BFDBFE" }}>
                        {emp.gender||"M"}
                      </span>
                    </div>
                  </td>
                {DAYS.map((day,di) => {
                  const val = (schedule[emp.id]||{})[day]||"OFF";
                  const sh  = shifts.find(s=>s.id===val);
                  const activeF = dayFilters[day]||[];
                  const dimmed  = activeF.length>0 && !activeF.includes(val);
                  return (
                    <td key={day} style={{ padding:"6px", textAlign:"center",
                      background: di===today?_theme.primary+"18":"transparent",
                      opacity: dimmed ? 0.25 : 1 }}>
                      <select value={val} onChange={e=>setShift(emp.id,day,e.target.value)}
                        style={{ ...I(), padding:"4px 6px", fontSize:11,
                          border:`2px solid ${val==="LEAVE"?"#F59E0B":val==="PH"?"#8B5CF6":sh?sh.color:"#CBD5E1"}`,
                          background:val==="LEAVE"?"#FEF3C7":val==="PH"?"#F3E8FF":sh?sh.color+"18":"#fff",
                          color:val==="LEAVE"?"#92400E":val==="PH"?"#6D28D9":sh?sh.color:_theme.textMuted,
                          fontWeight:600, cursor:"pointer" }}>
                        <option value="OFF">🔘 Day Off</option>
                        <option value="LEAVE">🏖️ Leave</option>
                        <option value="PH">🎌 PH</option>
                        {shifts.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </td>
                  );
                })}
                <td style={{ padding:"6px", textAlign:"center" }}>
                  <button onClick={()=>setEditEmp({...emp})}
                    style={{ background:"none", border:"1px solid #CBD5E1", borderRadius:6,
                      padding:"4px 8px", cursor:"pointer", fontSize:14 }}>✏️</button>
                </td>
                </tr>
                );
              });
              return rows;
            })}
          </tbody>
        </table>
      </div>
      )} {/* end week view */}

      {/* ── Smart Shift Swap Panel ── */}
      <ShiftSwapPanel
        employees={employees}
        schedule={schedule}
        setSchedule={setSchedule}
        shifts={shifts}
        notes={typeof notes !== "undefined" ? notes : []}
        setNotes={typeof setNotes !== "undefined" ? setNotes : (v=>v)}
        session={typeof session !== "undefined" ? session : null}
        canEdit={canEdit}
      />

      {/* Close filter popup when clicking outside */}
      {filterPopup && (
        <div style={{ position:"fixed", inset:0, zIndex:199 }}
          onClick={()=>setFilterPopup(null)}/>
      )}

      {/* Week Preview Cards */}
      <div style={{ marginBottom:8, fontWeight:700, fontSize:14, color:_theme.text }}>📋 Week Preview</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:10 }}>
        {weekCards.map(({day,di,groups}) => (
          <div key={day} style={{ ...CRD({ padding:12 }), border: di===today ? `2px solid ${_theme.primary}` : `1px solid ${_theme.cardBorder}` }}>
            <div style={{ fontWeight:700, fontSize:12, color: di===today?_theme.primary:_theme.textSub, marginBottom:8 }}>{day.slice(0,3)}</div>
            {Object.keys(groups).length===0
              ? <div style={{ fontSize:11, color:_theme.textMuted }}>All Off</div>
              : Object.entries(groups).map(([sid,names]) => {
                  if (sid==="LEAVE") return (
                    <div key="LEAVE" style={{ marginBottom:6 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"#92400E", marginBottom:2 }}>🏖️ Leave</div>
                      {names.map(n=><div key={n} style={{ fontSize:11, color:"#92400E", padding:"1px 0" }}>• {n.split(" ")[0]}</div>)}
                    </div>
                  );
                  if (sid==="PH") return (
                    <div key="PH" style={{ marginBottom:6 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"#6D28D9", marginBottom:2 }}>🎌 Public Holiday</div>
                      {names.map(n=><div key={n} style={{ fontSize:11, color:"#6D28D9", padding:"1px 0" }}>• {n.split(" ")[0]}</div>)}
                    </div>
                  );
                  const sh = shifts.find(s=>s.id===sid);
                  return (
                    <div key={sid} style={{ marginBottom:6 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:sh?.color||"#888", marginBottom:2 }}>{sh?.label} {sh?.start}</div>
                      {names.map(n => <div key={n} style={{ fontSize:11, color:_theme.textSub, padding:"1px 0" }}>• {n.split(" ")[0]}</div>)}
                    </div>
                  );
                })
            }
          </div>
        ))}
      </div>

      {/* Swap Shift Modal */}
      {showSwap && (
        <Modal title="🔄 Swap Shifts" onClose={()=>setShowSwap(false)} width={480}>
          <div style={{ background:"#F3E8FF", border:"1px solid #C4B5FD", borderRadius:8,
            padding:"10px 14px", marginBottom:14, fontSize:12, color:"#5B21B6" }}>
            Select two employees and the day to swap shifts.
          </div>

          <label style={LBL}>Day</label>
          <select value={swapDay} onChange={e=>{ setSwapDay(e.target.value); setSwapDone(""); }}
            style={{ ...I(), marginBottom:12 }}>
            {DAYS.map(d => <option key={d}>{d}</option>)}
          </select>

          <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:10, alignItems:"end", marginBottom:14 }}>
            <div>
              <label style={LBL}>Employee 1</label>
              <select value={swapEmp1} onChange={e=>{ setSwapEmp1(e.target.value); setSwapDone(""); }}
                style={I()}>
                <option value="">-- Select --</option>
                {employees.map(e => {
                  const sid = (schedule[e.id]||{})[swapDay];
                  const sh = shifts.find(s=>s.id===sid);
                  return (
                    <option key={e.id} value={e.id}>
                      {e.name} ({sh?.label||"Day Off"})
                    </option>
                  );
                })}
              </select>
            </div>
            <div style={{ paddingBottom:8, fontSize:22, textAlign:"center", color:"#8B5CF6" }}>⇄</div>
            <div>
              <label style={LBL}>Employee 2</label>
              <select value={swapEmp2} onChange={e=>{ setSwapEmp2(e.target.value); setSwapDone(""); }}
                style={I()}>
                <option value="">-- Select --</option>
                {employees.filter(e=>e.id!==swapEmp1).map(e => {
                  const sid = (schedule[e.id]||{})[swapDay];
                  const sh = shifts.find(s=>s.id===sid);
                  return (
                    <option key={e.id} value={e.id}>
                      {e.name} ({sh?.label||"Day Off"})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Preview */}
          {swapEmp1 && swapEmp2 && (() => {
            const e1 = employees.find(e=>e.id===swapEmp1);
            const e2 = employees.find(e=>e.id===swapEmp2);
            const s1 = shifts.find(s=>s.id===(schedule[swapEmp1]||{})[swapDay]);
            const s2 = shifts.find(s=>s.id===(schedule[swapEmp2]||{})[swapDay]);
            return (
              <div style={{ background:_theme.isDark?"#0D1117":"#F8FAFC", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12 }}>
                <div style={{ fontWeight:700, color:_theme.text, marginBottom:6 }}>Swap Preview {swapDay}</div>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                  <div style={{ background: s1?.color+"20"||"#F1F5F9", border:`1px solid ${s1?.color||"#CBD5E1"}`,
                    borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700, color:s1?.color||"#64748B" }}>
                    {e1?.name.split(" ")[0]}: {s1?.label||"Day Off"}
                  </div>
                  <span style={{ fontSize:16, color:"#8B5CF6" }}>⇄</span>
                  <div style={{ background: s2?.color+"20"||"#F1F5F9", border:`1px solid ${s2?.color||"#CBD5E1"}`,
                    borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700, color:s2?.color||"#64748B" }}>
                    {e2?.name.split(" ")[0]}: {s2?.label||"Day Off"}
                  </div>
                </div>
              </div>
            );
          })()}

          {swapDone && (
            <div style={{ background:"#F0FDF4", border:"1px solid #86EFAC", borderRadius:8,
              padding:"10px 14px", marginBottom:12, fontSize:12, color:"#166534",
              fontWeight:600, whiteSpace:"pre-line" }}>{swapDone}</div>
          )}

          <div style={{ display:"flex", gap:8 }}>
            <button style={PBT("#8B5CF6",{flex:1, padding:"10px"})} onClick={doSwap}
              disabled={!swapEmp1||!swapEmp2}>
              🔄 Confirm Swap
            </button>
            <button style={PBT("#94A3B8",{flex:"none", padding:"10px 16px"})}
              onClick={()=>setShowSwap(false)}>Close</button>
          </div>
        </Modal>
      )}

      {/* Add Employee Modal */}
      {showAdd && (
        <Modal title="Add Employee" onClose={()=>setShowAdd(false)}>
          <label style={LBL}>Name</label>
          <input style={{ ...I(), marginBottom:12 }} value={newEmp.name} onChange={e=>setNewEmp(p=>({...p,name:e.target.value}))} placeholder="Full name"/>
          <label style={LBL}>Role</label>
          <select style={{ ...I(), marginBottom:12 }} value={newEmp.role} onChange={e=>setNewEmp(p=>({...p,role:e.target.value}))}>
            {["Agent","Shift Leader","Team Lead","SME","Other"].map(r=><option key={r}>{r}</option>)}
          </select>
          <label style={LBL}>Gender</label>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            {[["M","Male 👨"],["F","Female 👩"]].map(([v,l])=>(
              <button key={v} onClick={()=>setNewEmp(p=>({...p,gender:v}))}
                style={{ flex:1, border:`2px solid ${newEmp.gender===v?(v==="F"?"#BE185D":"#1D4ED8"):"#CBD5E1"}`,
                  borderRadius:8, padding:"8px", cursor:"pointer", fontWeight:700, fontSize:13,
                  background: newEmp.gender===v?(v==="F"?"#FCE7F3":"#EFF6FF"):"#fff",
                  color: newEmp.gender===v?(v==="F"?"#BE185D":"#1D4ED8"):"#64748B" }}>{l}</button>
            ))}
          </div>
          <label style={LBL}>Tasks</label>
          <div style={{ marginBottom:16 }}><TaskPicker selected={newEmp.tasks} onChange={tasks=>setNewEmp(p=>({...p,tasks}))}/></div>
          <button style={PBT("#2563EB",{width:"100%"})} onClick={addEmployee}>Add Employee</button>
        </Modal>
      )}

      {/* Edit Employee Modal */}
      {editEmp && (
        <Modal title="Edit Employee" onClose={()=>setEditEmp(null)}>
          <label style={LBL}>Name</label>
          <input style={{ ...I(), marginBottom:12 }} value={editEmp.name} onChange={e=>setEditEmp(p=>({...p,name:e.target.value}))}/>
          <label style={LBL}>Role</label>
          <select style={{ ...I(), marginBottom:12 }} value={editEmp.role} onChange={e=>setEditEmp(p=>({...p,role:e.target.value}))}>
            {["Agent","Shift Leader","Team Lead","SME","Other"].map(r=><option key={r}>{r}</option>)}
          </select>
          <label style={LBL}>Gender</label>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            {[["M","Male 👨"],["F","Female 👩"]].map(([v,l])=>(
              <button key={v} onClick={()=>setEditEmp(p=>({...p,gender:v}))}
                style={{ flex:1, border:`2px solid ${editEmp.gender===v?(v==="F"?"#BE185D":"#1D4ED8"):"#CBD5E1"}`,
                  borderRadius:8, padding:"8px", cursor:"pointer", fontWeight:700, fontSize:13,
                  background: editEmp.gender===v?(v==="F"?"#FCE7F3":"#EFF6FF"):"#fff",
                  color: editEmp.gender===v?(v==="F"?"#BE185D":"#1D4ED8"):"#64748B" }}>{l}</button>
            ))}
          </div>
          <label style={LBL}>Assignment</label>
              <div style={{ marginBottom:16 }}>
                <div style={{ display:"flex", gap:8 }}>
                  {["KFOOD","KEEMRT"].map(t => {
                    const sel = (editEmp.tasks||[]).includes(t);
                    const color = t==="KFOOD" ? "#3FB950" : "#58A6FF";
                    return (
                      <button key={t} onClick={()=>{
                        const cur = editEmp.tasks||[];
                        const next = sel ? cur.filter(x=>x!==t) : [...cur,t];
                        setEditEmp(p=>({...p,tasks:next}));
                      }} style={{ flex:1, border:`2px solid ${sel?color:_theme.cardBorder}`,
                        borderRadius:10, padding:"10px", cursor:"pointer", fontWeight:700,
                        fontSize:14, background:sel?color+"18":_theme.surface,
                        color:sel?color:_theme.textSub, transition:"all 0.15s" }}>
                        {sel ? "✓ " : ""}{t}
                      </button>
                    );
                  })}
                </div>
              </div>
          <button style={PBT("#2563EB",{width:"100%"})} onClick={updateEmployee}>Save Changes</button>
        </Modal>
      )}

      {/* Import Preview Modal */}
      {showImport && (
        <Modal title={`📥 Import Preview -- ${importPreview.length} employees`} onClose={()=>setShowImport(false)} width={820}>
          {/* Format guide */}
          <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#1D4ED8" }}>
            <strong>Accepted values per cell:</strong> &nbsp;
            {shifts.map(s=><span key={s.id} style={{ marginRight:8 }}><strong>{s.label}</strong> · <code>{s.start}-{s.end}</code> · <code>{s.start}</code> · <code>{s.id.replace("s","")}</code></span>)}
            &nbsp;· <code>OFF</code> · (empty)
          </div>

          {/* Warnings */}
          {importErrors.length>0 && (
            <div style={{ background:"#FEF9C3", border:"1px solid #F59E0B", borderRadius:8, padding:"8px 14px", marginBottom:12, fontSize:12, color:"#92400E" }}>
              ⚠️ {importErrors.length} warning(s): {importErrors.slice(0,3).join(" · ")}{importErrors.length>3?` ... +${importErrors.length-3} more`:""}
            </div>
          )}

          {/* Preview table */}
          <div style={{ overflowX:"auto", maxHeight:380, overflowY:"auto", marginBottom:14 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC", position:"sticky", top:0 }}>
                  <th style={{ padding:"8px 10px", textAlign:"left", fontWeight:700, color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}`, minWidth:160 }}>Name</th>
                  <th style={{ padding:"8px 6px", fontWeight:700, color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}` }}>Role</th>
                  {DAYS.map(d=>(
                    <th key={d} style={{ padding:"8px 6px", textAlign:"center", fontWeight:700, color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}`, minWidth:80 }}>{d.slice(0,3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importPreview.map((row,i)=>{
                  const existing = employees.find(e=>e.name.toLowerCase()===row.name.toLowerCase());
                  return (
                    <tr key={i} style={{ background: existing ? "#F0FDF4" : i%2===0?"#fff":"#F8FAFC" }}>
                      <td style={{ padding:"6px 10px", fontWeight:600, color:_theme.text }}>
                        {row.name}
                        {existing && <span style={{ marginLeft:6, fontSize:10, background:"#10B981", color:"#fff", borderRadius:8, padding:"1px 6px" }}>update</span>}
                        {!existing && <span style={{ marginLeft:6, fontSize:10, background:"#2563EB", color:"#fff", borderRadius:8, padding:"1px 6px" }}>new</span>}
                      </td>
                      <td style={{ padding:"6px", color:_theme.textSub, textAlign:"center" }}>{row.role}</td>
                      {DAYS.map(d=>{
                        const sid = row.days[d];
                        const sh = shifts.find(s=>s.id===sid);
                        return (
                          <td key={d} style={{ padding:"4px", textAlign:"center" }}>
                            {sh
                              ? <span style={{ background:sh.color+"20", color:sh.color, border:`1px solid ${sh.color}50`,
                                  borderRadius:6, padding:"2px 6px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
                                  {sh.label}<br/><span style={{fontSize:10}}>{sh.start}</span>
                                </span>
                              : <span style={{ color:_theme.textMuted, fontSize:11 }}>OFF</span>
                            }
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <button style={PBT("#10B981",{flex:1,padding:"10px"})} onClick={confirmImport}>
              ✅ Confirm Import ({importPreview.filter(r=>employees.find(e=>e.name.toLowerCase()===r.name.toLowerCase())).length} updates · {importPreview.filter(r=>!employees.find(e=>e.name.toLowerCase()===r.name.toLowerCase())).length} new)
            </button>
            <button style={PBT("#EF4444",{flex:"none",padding:"10px 20px"})} onClick={()=>setShowImport(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ATTENDANCE PAGE ──────────────────────────────────────────────────────────
function AttendancePage({ employees, schedule, setSchedule, shifts, attendance, setAttendance, notes, setNotes, session, myShiftFilter }) {
  const noop = ()=>{}; // fallback if setSchedule not passed
  const [date, setDate] = useState(todayStr());

  // myShiftFilter: only show employees on my shift
  const _attMyEmp   = employees.find(e => e.name === session?.name);
  const _attMyShift = _attMyEmp ? (schedule[_attMyEmp.id]||{})[DAYS[new Date().getDay()]] : null;

  // ── Auto-detect active shift based on current time ──
  function detectActiveShift() {
    if (!shifts.length) return "";
    const now = new Date();
    const nowMin = now.getHours()*60 + now.getMinutes();
    // Find which shift is currently active (handles midnight-crossing)
    for (const sh of shifts) {
      const start = toMin(sh.start);
      const end   = toMin(sh.end);
      if (end > start) {
        // Normal shift e.g. 08:00-16:00
        if (nowMin >= start && nowMin < end) return sh.id;
      } else {
        // Midnight-crossing shift e.g. 20:00-04:00
        if (nowMin >= start || nowMin < end) return sh.id;
      }
    }
    // No exact match → pick the shift whose start is closest before now
    let closest = shifts[0];
    let minDiff = Infinity;
    for (const sh of shifts) {
      let diff = nowMin - toMin(sh.start);
      if (diff < 0) diff += 1440;
      if (diff < minDiff) { minDiff = diff; closest = sh; }
    }
    return closest.id;
  }

  const [activeShift, setActiveShift] = useState(() => detectActiveShift());
  const [autoShift, setAutoShift] = useState(true); // track if user manually overrode

  // Re-detect when date changes back to today
  function handleDateChange(d) {
    setDate(d);
    if (d === todayStr()) {
      setActiveShift(detectActiveShift());
      setAutoShift(true);
    }
  }

  function handleShiftClick(id) {
    setActiveShift(id);
    setAutoShift(false);
  }

  const dayName = DAYS[new Date(date+"T12:00:00").getDay()];
  const activeShiftObj = shifts.find(s=>s.id===activeShift);

  const shiftEmployees = useMemo(() => {
    return employees.filter(emp => (schedule[emp.id]||{})[dayName] === activeShift);
  }, [employees, schedule, activeShift, dayName]);

  function getAtt(empId) {
    return ((attendance[date]||{})[empId]) || { status:"Present", checkIn:"", checkOut:"", lateMin:0, earlyMin:0, note:"", workDuration:"" };
  }

  // Calculate work duration in minutes between checkIn and checkOut (handles midnight crossing)
  function calcWorkDuration(checkIn, checkOut) {
    if (!checkIn || !checkOut) return null;
    let diff = toMin(checkOut) - toMin(checkIn);
    if (diff < 0) diff += 1440; // midnight crossing
    return diff;
  }
  function fmtDuration(mins) {
    if (mins === null || mins === undefined) return "--";
    const h = Math.floor(mins/60), m = mins%60;
    return `${h}h ${pad(m)}m`;
  }

  function setAtt(empId, field, val) {
    setAttendance(prev => {
      const dayData = { ...(prev[date]||{}) };
      const empData = { ...getAtt(empId), [field]: val };

      // Auto-calc late from checkIn
      if (field==="checkIn" && val) {
        const sh = shifts.find(s=>s.id===activeShift);
        if (sh) {
          const late = calcLateMin(sh.start, val);
          empData.lateMin = Math.max(0, late);
          if (late >= 7) empData.status = "Late";
          else if (empData.status==="Late") empData.status = "Present";
        }
      }

      // Auto-calc work duration whenever checkIn or checkOut changes
      const ci = field==="checkIn"  ? val : empData.checkIn;
      const co = field==="checkOut" ? val : empData.checkOut;
      const dur = calcWorkDuration(ci, co);
      empData.workDuration = dur !== null ? dur : "";

      // Auto-calc Early Leave: if status=Early Leave and both times set
      if ((empData.status==="Early Leave" || field==="status") && ci && co) {
        empData.earlyMin = dur !== null ? dur : empData.earlyMin;
      }

      dayData[empId] = empData;
      return { ...prev, [date]: dayData };
    });
  }

  function bulkSet(status) {
    setAttendance(prev => {
      const dayData = { ...(prev[date]||{}) };
      shiftEmployees.forEach(emp => { dayData[emp.id] = { ...getAtt(emp.id), status }; });
      return { ...prev, [date]: dayData };
    });
  }

  // KPIs across all shifts for the day
  const allDayEmps = employees.filter(emp => { const v=(schedule[emp.id]||{})[dayName]; return v && v!=="OFF" && v!=="LEAVE" && v!=="PH"; });
  const allAtt = allDayEmps.map(e => getAtt(e.id));
  const kpis = {
    working:   allDayEmps.length,
    present:   allAtt.filter(a=>isPresent(a.status)).length,
    absent:    allAtt.filter(a=>isAbsent(a.status)).length,
    late:      allAtt.filter(a=>a.status==="Late").length,
    early:     allAtt.filter(a=>a.status==="Early Leave").length,
    totalLate: allAtt.reduce((s,a)=>s+(a.lateMin||0),0)
  };

  // Self Check-In pending notifications
  const selfCheckIns = (Array.isArray(notes)?notes:[])
    .filter(n => n.tag === "Self Check-In")
    .map(n => { try { return {...JSON.parse(n.text), noteId: n.id, ts: n.ts}; } catch { return null; } })
    .filter(Boolean)
    .filter(n => n.status === "pending" && n.date === date)
    .sort((a,b) => b.ts.localeCompare(a.ts));

  function confirmSelfCheckIn(item) {
    // Set attendance to Present with the recorded time
    setAttendance(prev => {
      const dayData = { ...(prev[date]||{}) };
      dayData[item.empId] = { ...getAtt(item.empId), status:"Present", checkIn: item.checkInTime, note:"Auto check-in confirmed" };
      return { ...prev, [date]: dayData };
    });
    // Mark note as confirmed
    setNotes(prev => (Array.isArray(prev)?prev:[]).map(n =>
      n.id === item.noteId ? {...n, text: JSON.stringify({...item, status:"confirmed"})} : n
    ));
    showToast(`✅ ${item.empName} check-in confirmed at ${item.checkInTime}`, "success");
  }

  function dismissSelfCheckIn(noteId) {
    setNotes(prev => (Array.isArray(prev)?prev:[]).filter(n => n.id !== noteId));
  }

  const isSupervisor = session?.role === "Team Lead" || session?.role === "Shift Leader" || session?.role === "SME" || session?.name === SUPER_ADMIN;

  return (
    <div>
      {/* ── Self Check-In Notifications (supervisors only) ── */}
      {isSupervisor && selfCheckIns.length > 0 && (
        <div style={{ background:"rgba(16,185,129,0.08)", border:"2px solid rgba(16,185,129,0.35)",
          borderRadius:14, padding:"14px 18px", marginBottom:16 }}>
          <div style={{ fontWeight:800, fontSize:13, color:"#10B981", marginBottom:10,
            display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:16 }}>✅</span>
            Auto Check-In Requests — {selfCheckIns.length} pending verification
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {selfCheckIns.map(item => (
              <div key={item.noteId} style={{ background:"rgba(16,185,129,0.06)",
                border:"1px solid rgba(16,185,129,0.25)", borderRadius:10,
                padding:"10px 14px", display:"flex", alignItems:"center",
                gap:10, flexWrap:"wrap" }}>
                <span style={{ fontSize:20 }}>{ROLE_ICONS[item.empRole]||"👤"}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:_theme.text }}>{item.empName}</div>
                  <div style={{ fontSize:11, color:_theme.textMuted }}>
                    {item.empRole} · Requested check-in at <strong style={{color:"#10B981"}}>{item.checkInTime}</strong>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={()=>confirmSelfCheckIn(item)}
                    style={{ background:"#10B981", color:"#fff", border:"none",
                      borderRadius:8, padding:"7px 16px", fontSize:12,
                      cursor:"pointer", fontWeight:700,
                      boxShadow:"0 2px 8px rgba(16,185,129,0.3)" }}>
                    ✅ Confirm
                  </button>
                  <button onClick={()=>dismissSelfCheckIn(item.noteId)}
                    style={{ background:"rgba(239,68,68,0.1)", color:"#EF4444",
                      border:"1px solid rgba(239,68,68,0.3)",
                      borderRadius:8, padding:"7px 14px", fontSize:12,
                      cursor:"pointer", fontWeight:700 }}>
                    ✕ Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>📋 Attendance Log</span>
        <input type="date" value={date} onChange={e=>handleDateChange(e.target.value)} style={{ ...I(), width:150 }}/>
        <span style={{ fontSize:12, color:_theme.textMuted }}>Auto-calc late · 🔴 = ≥7 min late</span>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:16 }}>
        {[["Working",kpis.working,"#2563EB"],["Present",kpis.present,"#10B981"],
          ["Absent",kpis.absent,"#EF4444"],["Late",kpis.late,"#F59E0B"],
          ["Early Leave",kpis.early,"#8B5CF6"],["Late Time",kpis.totalLate+"m","#EC4899"]].map(([l,v,c])=>(
          <div key={l} style={{ ...CRD({ padding:"12px 16px" }), borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:24, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Shift Tabs -- active one highlighted automatically */}
      <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap", alignItems:"center" }}>
        {shifts.map(sh => {
          const isActive = activeShift===sh.id;
          const empCount = employees.filter(emp=>(schedule[emp.id]||{})[dayName]===sh.id).length;
          return (
            <button key={sh.id} onClick={()=>handleShiftClick(sh.id)}
              style={{ border:`2px solid ${sh.color}`, borderRadius:20, padding:"5px 14px",
                fontSize:12, cursor:"pointer", fontWeight:600, position:"relative",
                background: isActive ? sh.color : "transparent",
                color: isActive ? "#fff" : sh.color, transition:"all 0.15s" }}>
              {sh.label} {sh.start}
              {empCount>0 && (
                <span style={{ marginLeft:6, background: isActive?"rgba(255,255,255,0.3)":sh.color+"25",
                  borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:700 }}>
                  {empCount}
                </span>
              )}
            </button>
          );
        })}
        {/* Auto-detect indicator */}
        {autoShift && date===todayStr() && (
          <span style={{ fontSize:11, color:"#10B981", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
            🟢 Auto-detected: <strong>{activeShiftObj?.label} ({activeShiftObj?.start}-{activeShiftObj?.end})</strong>
          </span>
        )}
      </div>

      {/* Active shift info bar */}
      {activeShiftObj && (
        <div style={{ background: activeShiftObj.color+"15", border:`1.5px solid ${activeShiftObj.color}40`,
          borderRadius:8, padding:"8px 16px", marginBottom:12,
          display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <span style={{ fontWeight:700, color:activeShiftObj.color, fontSize:13 }}>
            ⏰ {activeShiftObj.label} · {activeShiftObj.start} - {activeShiftObj.end}
          </span>
          <span style={{ fontSize:12, color:_theme.textSub }}>
            {shiftEmployees.length} employees scheduled on <strong>{dayName}</strong>
          </span>
          <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
            <button style={PBT("#10B981",{padding:"5px 12px",fontSize:12})} onClick={()=>bulkSet("Present")}>✅ All Present</button>
            <button style={PBT("#EF4444",{padding:"5px 12px",fontSize:12})} onClick={()=>bulkSet("Absent")}>🔴 All Absent</button>
          <button style={PBT("#3B82F6",{padding:"5px 12px",fontSize:12})} onClick={()=>{
            const now=new Date(); const hh=pad(now.getHours()), mm=pad(now.getMinutes());
            if (!window.confirm(`Check in ${shiftEmployees.length} employees now (${hh}:${mm})?`)) return;
            shiftEmployees.forEach(emp=>{
              setAtt(emp.id,"status","Present");
              setAtt(emp.id,"checkIn",`${hh}:${mm}`);
            });
          }}>⚡ Bulk Check-in Now</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ ...CRD(), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
              {["#","Employee","Status","Check-in","Check-out","Late","Work Duration","Early Leave","Notes"].map(h=>(
                <th key={h} style={{ padding:"10px 8px", textAlign:"left", fontWeight:700,
                  color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}`, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shiftEmployees.map((emp,ri) => {
              const att = getAtt(emp.id);
              const isLate = att.lateMin >= 7;
              const isSlightLate = att.lateMin > 0 && att.lateMin < 7;
              const dur = att.workDuration !== "" && att.workDuration !== undefined ? att.workDuration : calcWorkDuration(att.checkIn, att.checkOut);
              const isEarlyLeave = att.status === "Early Leave";
              const isOnLeaveStatus = isOnLeave(att.status);
              const isWFH = att.status === "Work From Home";
              const isTraining = att.status === "On Training";
              const isBizTrip = att.status === "Business Trip";
              return (
                <tr key={emp.id} style={{
                  background: isLate ? "#FEF9C3" : isOnLeaveStatus ? "#EFF6FF" : isWFH ? "#F5F3FF" : ri%2===0?_theme.card:_theme.surface,
                  borderLeft: isLate ? "3px solid #F59E0B" : isEarlyLeave ? "3px solid #8B5CF6" : isOnLeaveStatus ? "3px solid #0EA5E9" : isWFH ? "3px solid #6366F1" : isBizTrip ? "3px solid #F97316" : "3px solid transparent"
                }}>
                  <td style={{ padding:"8px", color:_theme.textMuted, fontWeight:600 }}>{ri+1}</td>
                  <td style={{ padding:"8px", fontWeight:600, color:_theme.text }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      {emp.name}
                      {isLate && <span style={{ fontSize:10, fontWeight:800, background:"#FEF3C7",
                        color:"#B45309", border:"1px solid #FCD34D",
                        borderRadius:20, padding:"1px 7px" }}>Late {att.lateMin}m</span>}
                    </div>
                    <div style={{ fontSize:11, color:_theme.textMuted }}>{emp.role}</div>
                  </td>
                  <td style={{ padding:"8px" }}>
                    <select value={att.status} onChange={e=>setAtt(emp.id,"status",e.target.value)}
                      style={{ ...I({ width:120, border:`1.5px solid ${
                        att.status==="Present"?"#10B981":isAbsent(att.status)?"#EF4444":
                        att.status==="Late"?"#F59E0B":
                        att.status==="Annual Leave"?"#0EA5E9":
                        att.status==="Sick Leave"?"#EC4899":
                        att.status==="Work From Home"?"#6366F1":
                        att.status==="On Training"?"#14B8A6":
                        att.status==="Business Trip"?"#F97316":"#8B5CF6"}` }) }}>
                      {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:"8px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <input type="time" value={att.checkIn||""} onChange={e=>setAtt(emp.id,"checkIn",e.target.value)}
                        style={{ ...I({ width:110, border: isLate?"2px solid #EF4444":
                          isSlightLate?"2px solid #F59E0B":"1px solid #CBD5E1" })}}/>
                      {isLate && <span>🔴</span>}
                      {isSlightLate && <span>🟡</span>}
                    </div>
                    {(isLate||isSlightLate) && att.lateMin>0 &&
                      <div style={{ fontSize:11, color:isLate?"#EF4444":"#F59E0B", fontWeight:700 }}>
                        {isLate?"🔴 ":""}{att.lateMin}m
                      </div>}
                  </td>
                  <td style={{ padding:"8px" }}>
                    <input type="time" value={att.checkOut||""} onChange={e=>setAtt(emp.id,"checkOut",e.target.value)}
                      style={{ ...I({ width:110, border: isEarlyLeave&&att.checkOut?"2px solid #8B5CF6":"1px solid #CBD5E1" })}}/>
                  </td>
                  <td style={{ padding:"8px", color:att.lateMin>=7?"#EF4444":"#94A3B8", fontWeight:600 }}>
                    {att.lateMin>0 ? att.lateMin+"m" : "--"}
                  </td>
                  <td style={{ padding:"8px" }}>
                    <div style={{ fontWeight:700, color: dur!==null&&dur<(activeShiftObj?toMin(activeShiftObj.end)-toMin(activeShiftObj.start):480)?"#F59E0B":"#10B981", fontSize:13 }}>
                      {dur !== null ? fmtDuration(dur) : "--"}
                    </div>
                    {dur !== null && <div style={{ fontSize:10, color:_theme.textMuted }}>{dur} min</div>}
                  </td>
                  <td style={{ padding:"8px" }}>
                    {isEarlyLeave && dur !== null
                      ? <div style={{ fontWeight:700, color:"#8B5CF6", fontSize:13 }}>{fmtDuration(dur)}<div style={{fontSize:10,color:_theme.textMuted}}>from check-in</div></div>
                      : <span style={{ color:_theme.textMuted }}>--</span>
                    }
                  </td>
                  <td style={{ padding:"8px" }}>
                    <input value={att.note||""} onChange={e=>setAtt(emp.id,"note",e.target.value)}
                      style={{ ...I({ width:140 })}} placeholder="Note..."/>
                  </td>
                </tr>
              );
            })}
            {shiftEmployees.length===0 && (
              <tr><td colSpan={9} style={{ padding:32, textAlign:"center", color:_theme.textMuted }}>
                No employees scheduled for <strong>{activeShiftObj?.label}</strong> on <strong>{dayName}</strong>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* ── Leave Requests Panel ── */}
      <LeaveRequestsPanel
        session={typeof session !== "undefined" ? session : null}
        employees={employees}
        schedule={schedule}
        setSchedule={setSchedule||noop}
        notes={typeof notes !== "undefined" ? notes : []}
        setNotes={typeof setNotes !== "undefined" ? setNotes : (v=>v)}
        canEdit={true}
      />
    </div>
  );
}

// ─── PERFORMANCE PAGE ─────────────────────────────────────────────────────────
function PerformancePage({ employees, schedule, shifts, performance, setPerformance, myShiftFilter, session }) {
  const [date, setDate] = useState(todayStr());
  const [showQuality, setShowQuality] = useState(false);
  const [dailyTarget, setDailyTarget] = useState(() => {
    return Number(localStorage.getItem("csops_perf_target")||"25");
  });
  const [showTargetEdit, setShowTargetEdit] = useState(false);
  const ESC_WARN_PCT = 20;
  const dayName = DAYS[new Date(date+"T12:00:00").getDay()];
  const isAgentView = session?.role === "Agent";

  const dayEmps = employees.filter(emp => {
    // Agent sees ONLY their own data
    if (isAgentView) return emp.name === session?.name;
    const v=(schedule[emp.id]||{})[dayName];
    if (!v || v==="OFF" || v==="LEAVE" || v==="PH") return false;
    return true;
  });

  function getPerf(empId) {
    return ((performance[date]||{})[empId]) || { closed:0, reopened:0, escalations:0, quality:"" };
  }
  function setPerf(empId, field, val) {
    setPerformance(prev => {
      const d = { ...(prev[date]||{}) };
      d[empId] = { ...getPerf(empId), [field]: val };
      return { ...prev, [date]: d };
    });
  }

  const sorted = [...dayEmps].sort((a,b) => (getPerf(b.id).closed||0) - (getPerf(a.id).closed||0));
  const totalClosed = dayEmps.reduce((s,e)=>s+(getPerf(e.id).closed||0),0);
  const totalEsc = dayEmps.reduce((s,e)=>s+(getPerf(e.id).escalations||0),0);
  const medals = ["🥇","🥈","🥉"];

  // Chart data: last 7 days totals
  const last7 = Array.from({length:7},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-6+i);
    const dk = d.toISOString().slice(0,10);
    return employees.reduce((s,e)=>s+((performance[dk]||{})[e.id]?.closed||0),0);
  });
  const last7Esc = Array.from({length:7},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-6+i);
    const dk = d.toISOString().slice(0,10);
    return employees.reduce((s,e)=>s+((performance[dk]||{})[e.id]?.escalations||0),0);
  });

  function getShiftLabel(empId) {
    const sid = (schedule[empId]||{})[dayName];
    if (!sid||sid==="OFF") return "--";
    return shifts.find(s=>s.id===sid)?.label||"--";
  }

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>⚡ Performance Tracker</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
        <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, cursor:"pointer", color:_theme.textSub }}>
          <input type="checkbox" checked={showQuality} onChange={e=>setShowQuality(e.target.checked)}/> Show Quality %
        </label>
      </div>

      {/* Daily Target Bar */}
      <div style={{ ...CRD({padding:"10px 16px"}), marginBottom:10, display:"flex",
        alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <span style={{ fontSize:12, fontWeight:700, color:_theme.text }}>🎯 Daily Target:</span>
        {showTargetEdit ? (
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <input type="number" min="1" max="500" defaultValue={dailyTarget}
              style={{ ...I({width:80}) }}
              onBlur={e=>{ const v=Number(e.target.value)||25;
                setDailyTarget(v); localStorage.setItem("csops_perf_target",String(v));
                setShowTargetEdit(false); }}
              autoFocus/>
          </div>
        ) : (
          <span style={{ fontWeight:800, fontSize:16, color:_theme.primary, cursor:"pointer" }}
            onClick={()=>setShowTargetEdit(true)}>{dailyTarget} cases ✏️</span>
        )}
        <div style={{ flex:1, background:_theme.surface, borderRadius:20, height:12,
          overflow:"hidden", minWidth:120 }}>
          <div style={{ height:"100%", borderRadius:20, transition:"width 0.5s",
            width:`${Math.min(100,Math.round((totalClosed/dailyTarget)*100))}%`,
            background: totalClosed>=dailyTarget?"#10B981":totalClosed>=dailyTarget*0.8?"#F59E0B":"#3B82F6" }}/>
        </div>
        <span style={{ fontSize:12, fontWeight:700,
          color:totalClosed>=dailyTarget?"#10B981":_theme.textSub }}>
          {totalClosed}/{dailyTarget} ({Math.round((totalClosed/dailyTarget)*100)}%)
          {totalClosed>=dailyTarget?" 🎉":""}
        </span>
      </div>

      {/* KPI Cards + Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10, marginBottom:16 }}>
        <div style={{ ...CRD({padding:"12px 16px"}), borderTop:"3px solid #10B981" }}>
          <div style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>Today Closed</div>
          <div style={{ fontSize:28, fontWeight:800, color:"#10B981" }}>{totalClosed}</div>
        </div>
        <div style={{ ...CRD({padding:"12px 16px"}), borderTop:"3px solid #F59E0B" }}>
          <div style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>Today Escalations</div>
          <div style={{ fontSize:28, fontWeight:800, color:"#F59E0B" }}>{totalEsc}</div>
        </div>
        <div style={{ ...CRD({padding:"12px 16px"}), borderTop:"3px solid #3B82F6" }}>
          <div style={{ fontSize:11, color:_theme.textMuted, fontWeight:600, marginBottom:6 }}>7-Day Closed</div>
          <SparkBar values={last7} color="#3B82F6" height={44} width={140}/>
        </div>
        <div style={{ ...CRD({padding:"12px 16px"}), borderTop:"3px solid #F59E0B" }}>
          <div style={{ fontSize:11, color:_theme.textMuted, fontWeight:600, marginBottom:6 }}>7-Day Escalations</div>
          <SparkLine values={last7Esc} color="#F59E0B" height={44} width={140}/>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...CRD(), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
              {["Rank","Employee","Tasks","Shift","Closed","Escalations",...(showQuality?["Quality %"]:[])]
                .map(h=><th key={h} style={{ padding:"10px 8px", textAlign:"left", fontWeight:700, color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}`, whiteSpace:"nowrap" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {sorted.map((emp,ri) => {
              const p = getPerf(emp.id);
              return (
                <tr key={emp.id} style={{ background: ri%2===0?_theme.card:_theme.surface }}>
                  <td style={{ padding:"8px", fontSize:18, textAlign:"center" }}>{medals[ri]||ri+1}</td>
                  <td style={{ padding:"8px", fontWeight:600 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                      <span>{emp.name}</span>
                      {(() => {
                        const p = getPerf(emp.id);
                        const escPct = p.closed > 0 ? Math.round((p.escalations/p.closed)*100) : 0;
                        return escPct >= ESC_WARN_PCT && p.escalations > 0 ? (
                          <span style={{ fontSize:10, fontWeight:800, background:"#FEF2F2",
                            color:"#EF4444", border:"1px solid #FCA5A5",
                            borderRadius:20, padding:"1px 7px" }}>⚠️ Esc {escPct}%</span>
                        ) : null;
                      })()}
                    </div>
                  </td>
                  <td style={{ padding:"8px" }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                      {emp.tasks.map(t=><span key={t} style={{ background:taskColor(t), color:"#fff", borderRadius:10, padding:"2px 6px", fontSize:10, fontWeight:600 }}>{t}</span>)}
                    </div>
                  </td>
                  <td style={{ padding:"8px", color:_theme.textSub }}>{getShiftLabel(emp.id)}</td>
                  <td style={{ padding:"8px" }}>
                    <input type="number" min="0" value={p.closed||""} onChange={e=>setPerf(emp.id,"closed",Number(e.target.value))}
                      style={{ ...I({ width:70, border: p.closed>0?"2px solid #10B981":"1px solid #CBD5E1" })}} placeholder="0"/>
                  </td>
                  <td style={{ padding:"8px" }}>
                    <input type="number" min="0" value={p.escalations||""} onChange={e=>setPerf(emp.id,"escalations",Number(e.target.value))}
                      style={{ ...I({ width:70, border: p.escalations>0?"2px solid #F59E0B":"1px solid #CBD5E1" })}} placeholder="0"/>
                  </td>
                  {showQuality && (
                    <td style={{ padding:"8px" }}>
                      <input type="number" min="0" max="100" value={p.quality||""} onChange={e=>setPerf(emp.id,"quality",Number(e.target.value))}
                        style={{ ...I({ width:70 })}} placeholder="0-100"/>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── HEAT MAP PAGE -- reads data from Queue ────────────────────────────────────
function HeatMapPage({ queueLog, alertThresholdCritical, alertThresholdWarning }) {
  const [date, setDate]       = useState(todayStr());
  const [threshold, setThreshold] = useState(300); // custom threshold for live alert
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [tick, setTick]         = useState(0);

  // Auto-refresh every 2 minutes when on today's date
  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => setTick(p=>p+1), 2*60*1000);
    return () => clearInterval(t);
  }, [autoRefresh]);

  // Collect all queue entries for this date across all shifts
  // Build hourly map from baseTime and updTime entries
  const hourlyData = useMemo(() => {
    const map = {}; // "HH:00" → total cases
    Object.entries(queueLog).forEach(([key, data]) => {
      if (!key.startsWith(date+"_")) return;
      // Use baseTime or updTime as the hour marker
      const times = [data.baseTime, data.updTime].filter(Boolean);
      times.forEach(t => {
        const hr = t.slice(0,2)+":00";
        // Sum all queue fields as inflow indicator
        const fields = ["tga","ob","oslo","some","kwtT2","qatT2","bahT2","uaeT2",
                        "someKwt","someQat","someBah","someUae"];
        const total = fields.reduce((s,f)=>s+Number(data[f+"Curr"]||0),0);
        map[hr] = (map[hr]||0) + total;
      });
      // Also push calculated snapshot using updTime
      if (data.updTime && data.calcSnapshot) {
        const hr = data.updTime.slice(0,2)+":00";
        map[hr] = (map[hr]||0) + (data.calcSnapshot||0);
      }
    });
    return map;
  }, [queueLog, date]);

  const hours = Array.from({length:24}, (_,i) => pad(i)+":00");
  const counts = hours.map(h => hourlyData[h]||0);
  const maxCount = Math.max(...counts, 1);
  const total = counts.reduce((a,b)=>a+b,0);
  const peakHour = hours[counts.indexOf(Math.max(...counts))];
  const sortedByCount = [...hours].sort((a,b) => (hourlyData[a]||0)-(hourlyData[b]||0));
  const breakWindows = sortedByCount.slice(0,3);

  function cellBg(count) {
    if (!count) return "#F1F5F9";
    const pct = count/maxCount;
    if (pct>0.8) return "#FEE2E2";
    if (pct>0.5) return "#FEF9C3";
    if (pct>0.2) return "#DCFCE7";
    return "#F0FDF4";
  }
  function cellBorder(count) {
    if (!count) return "#E2E8F0";
    const pct = count/maxCount;
    if (pct>0.8) return "#EF4444";
    if (pct>0.5) return "#F59E0B";
    if (pct>0.2) return "#10B981";
    return "#86EFAC";
  }

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>🌡️ Live Heat Map</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <label style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>Alert at:</label>
          <input type="number" value={threshold} onChange={e=>setThreshold(Number(e.target.value))}
            style={{ ...I({width:70}) }} min="50" max="2000"/>
          <button onClick={()=>setAutoRefresh(a=>!a)}
            style={{ border:`1.5px solid ${autoRefresh?"#10B981":"#CBD5E1"}`,
              borderRadius:20, padding:"3px 10px", fontSize:11, cursor:"pointer",
              background:autoRefresh?"#F0FDF4":"transparent",
              color:autoRefresh?"#10B981":_theme.textMuted, fontWeight:700 }}>
            {autoRefresh?"🔄 Live ON":"🔄 Live OFF"}
          </button>
        </div>
      </div>

      {/* Live threshold alert */}
      {total > threshold && date === todayStr() && (
        <div style={{ background:"#FEF2F2", border:"2px solid #EF4444",
          borderRadius:10, padding:"10px 16px", marginBottom:14,
          display:"flex", alignItems:"center", gap:10,
          animation:"pulse 1s infinite" }}>
          <span style={{ fontSize:20 }}>🚨</span>
          <div>
            <div style={{ fontWeight:800, color:"#EF4444", fontSize:13 }}>
              Live Alert — Queue Load Exceeds Threshold
            </div>
            <div style={{ fontSize:12, color:"#991B1B" }}>
              Current load: <strong>{total}</strong> cases · Threshold: <strong>{threshold}</strong> ·
              Peak hour: <strong>{peakHour}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        <div style={{ ...CRD(), borderTop:"3px solid #EF4444" }}>
          <div style={LBL}>Peak Hour</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#EF4444" }}>{total>0 ? peakHour : "--"}</div>
          <div style={{ fontSize:12, color:_theme.textMuted }}>{total>0 ? (hourlyData[peakHour]||0)+" cases" : "No data yet"}</div>
        </div>
        <div style={{ ...CRD(), borderTop:"3px solid #2563EB" }}>
          <div style={LBL}>Total Queue Load</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#2563EB" }}>{total}</div>
          <div style={{ fontSize:12, color:_theme.textMuted }}>across all recorded hours</div>
        </div>
        <div style={{ ...CRD(), borderTop:"3px solid #10B981" }}>
          <div style={LBL}>Recommended Breaks</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#10B981" }}>{breakWindows.filter(h=>(hourlyData[h]||0)===0).slice(0,3).join(", ")||"--"}</div>
          <div style={{ fontSize:12, color:_theme.textMuted }}>lowest activity windows</div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ ...CRD(), padding:16 }}>
        {total === 0 && (
          <div style={{ textAlign:"center", padding:"24px 0", color:_theme.textMuted, fontSize:13 }}>
            📭 No data yet -- enter Queue data and click <strong>Calculate</strong> to populate this chart.
          </div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
          {hours.map(h => {
            const count = hourlyData[h]||0;
            return (
              <div key={h} style={{ background:cellBg(count), border:`1.5px solid ${cellBorder(count)}`, borderRadius:8, padding:"10px 8px", textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:700, color:_theme.textMuted, marginBottom:4 }}>{h}</div>
                <div style={{ fontWeight:800, fontSize:18, color: count>0 ? cellBorder(count) : "#CBD5E1" }}>{count||0}</div>
                {count>0 && <div style={{ fontSize:10, color:_theme.textMuted }}>{Math.round(count/maxCount*100)}%</div>}
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:16, marginTop:16, flexWrap:"wrap" }}>
          {[["#FEE2E2","#EF4444",">80% peak"],["#FEF9C3","#F59E0B",">50% peak"],["#DCFCE7","#10B981",">20% peak"],["#F1F5F9","#94A3B8","No data"]].map(([bg,border,label])=>(
            <div key={label} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:16, height:16, background:bg, border:`1.5px solid ${border}`, borderRadius:3 }}/>
              <span style={{ fontSize:12, color:_theme.textMuted }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── QUEUE PAGE ───────────────────────────────────────────────────────────────
function QueuePage({ shifts, queueLog, setQueueLog, setHeatmap, canEdit, session }) {
  const todayKey = todayStr();

  // ── Auto-detect current shift from system clock ──────────────────────────────
  function detectShiftNow() {
    if (!shifts.length) return "";
    const nowMin = new Date().getHours()*60 + new Date().getMinutes();
    for (const sh of shifts) {
      const st=toMin(sh.start), en=toMin(sh.end);
      if (en>st){ if(nowMin>=st&&nowMin<en) return sh.id; }
      else       { if(nowMin>=st||nowMin<en) return sh.id; }
    }
    let best=shifts[0], minD=Infinity;
    shifts.forEach(sh=>{ let d=nowMin-toMin(sh.start); if(d<0)d+=1440; if(d<minD){minD=d;best=sh;} });
    return best.id;
  }

  // Auto baseline = shift start time; auto update = right now
  function autoBase(sid) {
    const sh = shifts.find(s=>s.id===sid);
    return sh ? sh.start : pad(new Date().getHours())+":"+pad(new Date().getMinutes());
  }
  function autoNow() { return pad(new Date().getHours())+":"+pad(new Date().getMinutes()); }

  // ── Default mode: auto shift + auto times ────────────────────────────────────
  const [autoShiftId]   = useState(() => detectShiftNow());
  const [calcDone, setCalcDone] = useState(false);

  // ── Sidebar: shift-specific mode ─────────────────────────────────────────────
  const [sbMode,     setSbMode]     = useState("single");   // "single"|"multi"
  const [sbSelected, setSbSelected] = useState([]);         // selected shift ids
  const [sbApplied,  setSbApplied]  = useState(false);      // true when user pressed Calculate
  const [sbShifts,   setSbShifts]   = useState([]);         // applied shifts snapshot

  // Active data key — uses sidebar shifts when applied, else auto-detected shift
  const activeShiftId = sbApplied && sbShifts.length ? sbShifts[0] : autoShiftId;
  const key = `${todayKey}_${activeShiftId}`;
  const data = queueLog[key] || {};

  // Resolved times: prefer stored, fall back to auto
  const baseTimeVal = data.baseTime !== undefined ? data.baseTime : autoBase(activeShiftId);
  const updTimeVal  = data.updTime  !== undefined ? data.updTime  : autoNow();

  // Write auto-values to store on first access so editing works immediately
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (!seeded && !data.baseTime && !data.updTime) {
      setQueueLog(prev => ({
        ...prev,
        [key]: {
          ...(prev[key]||{}),
          baseTime: autoBase(activeShiftId),
          updTime:  autoNow(),
        }
      }));
      setSeeded(true);
    }
  }, [key, seeded]);

  function setQ(field, val) {
    setQueueLog(prev => ({ ...prev, [key]: { ...(prev[key]||{}), [field]: val } }));
    setCalcDone(false);
  }

  // ── Queue field definitions ──────────────────────────────────────────────────
  const KSA_FIELDS = [
    { key:"tga",  label:"TGA",  color:"#6366F1", flag:"🇸🇦" },
    { key:"ob",   label:"OB",   color:"#0EA5E9", flag:"🇸🇦" },
    { key:"oslo", label:"OSLO", color:"#8B5CF6", flag:"🇸🇦" },
    { key:"some", label:"SOME", color:"#EC4899", flag:"🇸🇦" },
  ];
  const GCC_FIELDS = [
    { key:"kwtT2",   label:"KWT T2 Cases",   color:"#10B981", flag:"🇰🇼" },
    { key:"qatT2",   label:"QAT T2 Cases",   color:"#F59E0B", flag:"🇶🇦" },
    { key:"bahT2",   label:"BAH T2 Cases",   color:"#EF4444", flag:"🇧🇭" },
    { key:"uaeT2",   label:"UAE T2 Cases",   color:"#06B6D4", flag:"🇦🇪" },
    { key:"someKwt", label:"SOME KWT Cases", color:"#14B8A6", flag:"🇰🇼" },
    { key:"someQat", label:"SOME QAT Cases", color:"#F97316", flag:"🇶🇦" },
    { key:"someBah", label:"SOME BAH Cases", color:"#A855F7", flag:"🇧🇭" },
    { key:"someUae", label:"SOME UAE Cases", color:"#84CC16", flag:"🇦🇪" },
  ];
  const QUEUE_FIELDS = [...KSA_FIELDS, ...GCC_FIELDS];

  // ── Calcs — when multi-shift applied, combine all selected shifts ─────────────
  const calcs = useMemo(() => {
    if (sbApplied && sbShifts.length > 1) {
      // Combine data from all selected shifts
      return QUEUE_FIELDS.map(f => {
        let base=0, inflow=0, curr=0;
        sbShifts.forEach(sid => {
          const d2 = queueLog[`${todayKey}_${sid}`] || {};
          base   += Number(d2[f.key+"Base"]  ||0);
          inflow += Number(d2[f.key+"Inflow"]||0);
          curr   += Number(d2[f.key+"Curr"]  ||0);
        });
        const resolved = base+inflow-curr;
        return { ...f, base, inflow, curr, resolved, change: curr-base };
      });
    }
    // Default: single key
    return QUEUE_FIELDS.map(f => {
      const base    = Number(data[f.key+"Base"]  ||0);
      const inflow  = Number(data[f.key+"Inflow"]||0);
      const curr    = Number(data[f.key+"Curr"]  ||0);
      return { ...f, base, inflow, curr, resolved:base+inflow-curr, change:curr-base };
    });
  }, [data, sbApplied, sbShifts, queueLog, todayKey]);

  const totalBase     = calcs.reduce((s,c)=>s+c.base,0);
  const totalCurr     = calcs.reduce((s,c)=>s+c.curr,0);
  const totalResolved = calcs.reduce((s,c)=>s+c.resolved,0);
  const totalInflow   = calcs.reduce((s,c)=>s+c.inflow,0);

  const status      = totalCurr>400?"🚨 CRITICAL":totalCurr>200?"⚠️ WARNING":"✅ NORMAL";
  const statusColor = status.includes("CRITICAL")?"#EF4444":status.includes("WARNING")?"#F59E0B":"#10B981";

  function timeDiff() {
    const bt = baseTimeVal, ut = updTimeVal;
    if (!bt||!ut) return null;
    const d = toMin(ut)-toMin(bt);
    const dd = d<0?d+1440:d;
    return `${Math.floor(dd/60)}h ${dd%60}m`;
  }

  function calculate() {
    const ut = updTimeVal;
    if (!ut) return;
    const hr = ut.slice(0,2)+":00";
    setHeatmap(prev=>({ ...prev, [todayKey]:{ ...(prev[todayKey]||{}), [hr]:totalCurr } }));
    setQueueLog(prev=>({ ...prev, [key]:{ ...(prev[key]||{}), calcSnapshot:totalCurr, calcTime:ut } }));
    setCalcDone(true);
  }

  // Sidebar helpers
  function toggleSbShift(sid) {
    if (sbMode==="single") { setSbSelected([sid]); }
    else { setSbSelected(prev=>prev.includes(sid)?prev.filter(x=>x!==sid):[...prev,sid]); }
  }
  function applyShifts() {
    if (!sbSelected.length) return;
    setSbShifts(sbSelected);
    setSbApplied(true);
    setCalcDone(false);
  }
  function resetToAuto() {
    setSbApplied(false); setSbShifts([]); setSbSelected([]); setCalcDone(false);
  }

  const currentShift = shifts.find(s=>s.id===activeShiftId);

  // ── Input border helper for numeric fields ────────────────────────────────────
  function inflowBorder(val) {
    return Number(val||0)>0?`2px solid ${_theme.primary}`:`1px solid ${_theme.inputBorder}`;
  }
  function currBorder(val) {
    const n=Number(val||0);
    return n>200?`2px solid #EF4444`:n>100?`2px solid #F59E0B`:`1px solid ${_theme.inputBorder}`;
  }

  return (
    <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>

      {/* ══════════════════════ SIDEBAR ══════════════════════════════════════ */}
      <div style={{ width:230, flexShrink:0, display:"flex", flexDirection:"column", gap:12 }}>

        {/* Active context info */}
        <div style={{ ...CRD({ padding:"14px 16px" }),
          borderLeft:`3px solid ${currentShift?.color||_theme.primary}` }}>
          <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:700,
            letterSpacing:"0.05em", marginBottom:8 }}>ACTIVE DATA SOURCE</div>
          {sbApplied && sbShifts.length ? (
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:_theme.primary, marginBottom:4 }}>
                {sbShifts.length>1?`📊 ${sbShifts.length} Shifts Combined`:"📊 Single Shift (Manual)"}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:3, marginBottom:10 }}>
                {sbShifts.map(sid=>{
                  const sh=shifts.find(s=>s.id===sid);
                  return sh ? (
                    <div key={sid} style={{ fontSize:11, color:sh.color, fontWeight:600,
                      background:sh.color+"15", borderRadius:5, padding:"2px 7px" }}>
                      ⏰ {sh.label}
                    </div>
                  ) : null;
                })}
              </div>
              <button onClick={resetToAuto}
                style={{ background:"none", border:`1px solid ${_theme.cardBorder}`,
                  color:_theme.textMuted, borderRadius:6, padding:"4px 10px",
                  fontSize:11, cursor:"pointer", width:"100%" }}>
                ↩ Reset to Auto
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:_theme.success, marginBottom:4 }}>
                🟢 Auto — Current Time
              </div>
              {currentShift && (
                <div style={{ fontSize:11, color:currentShift.color, fontWeight:600,
                  background:currentShift.color+"15", borderRadius:5, padding:"2px 7px",
                  marginBottom:4, display:"inline-block" }}>
                  ⏰ {currentShift.label}
                </div>
              )}
              <div style={{ fontSize:10, color:_theme.textMuted, marginTop:4 }}>
                Shift auto-detected from system clock
              </div>
            </div>
          )}
        </div>

        {/* ── Calculate Queue for Specific Shift(s) ── */}
        <div style={{ ...CRD({ padding:"14px 16px" }),
          border:`1.5px solid ${_theme.primary}30` }}>
          <div style={{ fontSize:11, fontWeight:800, color:_theme.primary,
            marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
            🎯 Calculate Queue for Specific Shift(s)
          </div>

          {/* Mode toggle */}
          <div style={{ display:"flex", gap:4, marginBottom:10 }}>
            {[["single","Single"],["multi","Multiple"]].map(([m,l])=>(
              <button key={m} onClick={()=>{ setSbMode(m); setSbSelected([]); }}
                style={{ flex:1, border:`1.5px solid ${sbMode===m?_theme.primary:_theme.cardBorder}`,
                  borderRadius:6, padding:"4px 6px", fontSize:11, cursor:"pointer", fontWeight:700,
                  background: sbMode===m?_theme.primary+"22":"transparent",
                  color: sbMode===m?_theme.primary:_theme.textMuted }}>
                {l}
              </button>
            ))}
          </div>

          {/* Shift list */}
          <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:10,
            maxHeight:200, overflowY:"auto" }}>
            {shifts.map(sh => {
              const sel = sbSelected.includes(sh.id);
              return (
                <div key={sh.id} onClick={()=>toggleSbShift(sh.id)}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
                    borderRadius:7, cursor:"pointer", userSelect:"none",
                    border:`1.5px solid ${sel?sh.color:_theme.cardBorder}`,
                    background: sel?sh.color+"18":_theme.surface,
                    transition:"all 0.12s" }}>
                  <div style={{ width:10, height:10, borderRadius:3,
                    background:sh.color, flexShrink:0 }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11, fontWeight:700,
                      color:sel?sh.color:_theme.text, whiteSpace:"nowrap",
                      overflow:"hidden", textOverflow:"ellipsis" }}>{sh.label}</div>
                    <div style={{ fontSize:9, color:_theme.textMuted }}>{sh.start} – {sh.end}</div>
                  </div>
                  {sel && <span style={{ fontSize:12, color:sh.color, fontWeight:800 }}>✓</span>}
                </div>
              );
            })}
          </div>

          {sbSelected.length > 0 && (
            <div style={{ fontSize:11, color:_theme.textMuted, marginBottom:8, textAlign:"center" }}>
              {sbSelected.length} shift{sbSelected.length>1?"s":""} selected
            </div>
          )}

          <button onClick={applyShifts} disabled={!sbSelected.length}
            style={{ width:"100%", background:sbSelected.length?_theme.primary:"#374151",
              color:"#fff", border:"none", borderRadius:7, padding:"9px",
              fontSize:12, cursor:sbSelected.length?"pointer":"default",
              fontWeight:700, opacity:sbSelected.length?1:0.5,
              transition:"all 0.15s" }}>
            ⚡ Calculate / Apply
          </button>
        </div>

        {/* Today info */}
        <div style={{ ...CRD({ padding:"12px 14px" }) }}>
          <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:700,
            letterSpacing:"0.05em", marginBottom:6 }}>TODAY</div>
          <div style={{ fontSize:12, fontWeight:700, color:_theme.text }}>
            {new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",timeZone:"Asia/Riyadh"})}
          </div>
          <div style={{ fontSize:11, color:_theme.primary, fontWeight:600, marginTop:2 }}>
            🕐 {autoNow()}
          </div>
        </div>

      </div>
      {/* ═══════════════════════ END SIDEBAR ═══════════════════════════════════ */}

      {/* ══════════════════════ MAIN CONTENT ═════════════════════════════════ */}
      <div style={{ flex:1, minWidth:0 }}>

        {/* ── Top bar: Title + Status badge only ─────────────────────────────── */}
        <div style={{ ...SBR({ marginBottom:14 }), alignItems:"center" }}>
          <span style={{ fontWeight:800, fontSize:16, color:_theme.text }}>📊 Queue Data</span>
          {sbApplied && sbShifts.length>1 && (
            <span style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>
              Combined: {sbShifts.map(sid=>shifts.find(s=>s.id===sid)?.label).join(" + ")}
            </span>
          )}
          <div style={{ marginLeft:"auto", fontWeight:700, fontSize:13,
            color:statusColor, background:statusColor+"18",
            borderRadius:6, padding:"6px 14px",
            border:`1px solid ${statusColor}40` }}>
            {status}
          </div>
        </div>

        {/* ── Time bar: Baseline + Update + Duration + Calculate ──────────────────── */}
        <div style={{ ...CRD({ padding:"12px 16px" }), marginBottom:16,
          display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:13, color:_theme.textMuted, whiteSpace:"nowrap" }}>⏱ Baseline</span>
            <input type="time" value={baseTimeVal}
              onChange={e=>setQ("baseTime",e.target.value)}
              style={{ ...I({ width:115 })}}/>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:13, color:_theme.textMuted, whiteSpace:"nowrap" }}>🔄 Update</span>
            <input type="time" value={updTimeVal}
              onChange={e=>setQ("updTime",e.target.value)}
              style={{ ...I({ width:115 })}}/>
          </div>
          {timeDiff() && (
            <div style={{ fontSize:13, color:_theme.textSub, fontWeight:600 }}>
              ⏳ <strong>{timeDiff()}</strong>
            </div>
          )}
          <button onClick={calculate}
            style={{ ...PBT(calcDone?"#10B981":_theme.primary,
              { padding:"8px 22px", fontSize:13, marginLeft:"auto",
                boxShadow:calcDone?"none":`0 0 0 3px ${_theme.primary}30`,
                transition:"all 0.2s" }) }}>
            {calcDone ? "✅ Saved to Heat Map" : "🧮 Calculate"}
          </button>
        </div>

        {/* ── Summary KPIs ────────────────────────────────────────────────────── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
          {[
            ["Total Baseline", totalBase,     "#6B7280"],
            ["New Inflow",     totalInflow,   _theme.primary],
            ["Current Live",   totalCurr,     "#EF4444"],
            ["Resolved",       totalResolved, "#10B981"],
          ].map(([l,v,c])=>(
            <div key={l} style={{ ...CRD({ padding:"12px 16px" }), borderTop:`3px solid ${c}` }}>
              <div style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>{l}</div>
              <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
            </div>
          ))}
        </div>

        {/* ── Queue Tables ─────────────────────────────────────────────────────── */}
        {[
          { title:"🇸🇦 KSA Queue", fields:KSA_FIELDS, accent:"#6366F1" },
          { title:"🌍 GCC Queue",  fields:GCC_FIELDS,  accent:"#10B981" },
        ].map(({ title, fields, accent }) => {
          const groupCalcs  = calcs.filter(c=>fields.some(f=>f.key===c.key));
          const gTotal      = groupCalcs.reduce((s,c)=>s+c.curr,0);
          const gResolved   = groupCalcs.reduce((s,c)=>s+c.resolved,0);
          // In multi-shift mode, data writes go to first selected shift
          const isMulti = sbApplied && sbShifts.length > 1;
          return (
            <div key={title} style={{ ...CRD(), overflowX:"auto", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center",
                justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ fontWeight:800, color:accent, fontSize:15 }}>{title}</div>
                <div style={{ display:"flex", gap:14, fontSize:12, color:_theme.textMuted }}>
                  <span>Current: <strong style={{color:"#EF4444"}}>{gTotal}</strong></span>
                  <span>Resolved: <strong style={{color:"#10B981"}}>{gResolved>0?"+":""}{gResolved}</strong></span>
                </div>
              </div>
              {isMulti && (
                <div style={{ fontSize:11, color:_theme.textMuted, background:_theme.surface,
                  borderRadius:6, padding:"5px 10px", marginBottom:8 }}>
                  ℹ️ Combined view — edit individual shifts to update values
                </div>
              )}
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
                    {["Queue","","Baseline","New Inflow","Current","Resolved","Trend"].map(h=>(
                      <th key={h} style={{ padding:"8px 10px", textAlign:"left",
                        fontWeight:700, color:_theme.text,
                        borderBottom:`2px solid ${accent}40`, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupCalcs.map((c,ri)=>(
                    <tr key={c.key} style={{ background:ri%2===0?_theme.card:_theme.surface }}>
                      <td style={{ padding:"8px 10px", fontWeight:700, color:c.color }}>{c.label}</td>
                      <td style={{ padding:"8px 6px", fontSize:16 }}>{c.flag}</td>
                      <td style={{ padding:"8px 10px" }}>
                        <input type="number" min="0" disabled={isMulti}
                          value={isMulti?c.base:(data[c.key+"Base"]||"")}
                          onChange={e=>setQ(c.key+"Base",e.target.value)}
                          style={{ ...I({ width:72, opacity:isMulti?.7:1 })}} placeholder="0"/>
                      </td>
                      <td style={{ padding:"8px 10px" }}>
                        <input type="number" min="0" disabled={isMulti}
                          value={isMulti?c.inflow:(data[c.key+"Inflow"]||"")}
                          onChange={e=>setQ(c.key+"Inflow",e.target.value)}
                          style={{ ...I({ width:72, border:isMulti?`1px solid ${_theme.inputBorder}`:inflowBorder(data[c.key+"Inflow"]),
                            opacity:isMulti?.7:1 })}} placeholder="0"/>
                      </td>
                      <td style={{ padding:"8px 10px" }}>
                        <input type="number" min="0" disabled={isMulti}
                          value={isMulti?c.curr:(data[c.key+"Curr"]||"")}
                          onChange={e=>setQ(c.key+"Curr",e.target.value)}
                          style={{ ...I({ width:72, border:isMulti?`1px solid ${_theme.inputBorder}`:currBorder(data[c.key+"Curr"]),
                            opacity:isMulti?.7:1 })}} placeholder="0"/>
                      </td>
                      <td style={{ padding:"8px 10px", fontWeight:700,
                        color:c.resolved>0?"#10B981":c.resolved<0?"#EF4444":_theme.textMuted }}>
                        {c.resolved>0?"+":""}{c.resolved}
                      </td>
                      <td style={{ padding:"8px 10px", fontSize:16 }}>
                        {c.change>0?"📈":c.change<0?"📉":"➡️"}
                        <span style={{ fontSize:11, color:_theme.textMuted, marginLeft:4 }}>
                          {c.change>0?"+":""}{c.change||0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        {/* ── Comparison panel ────────────────────────────────────────────────── */}
        {(baseTimeVal && updTimeVal) && (
          <div style={{ ...CRD(), marginBottom:16 }}>
            <div style={{ fontWeight:700, color:_theme.text, marginBottom:12, fontSize:14 }}>
              📊 Comparison: {baseTimeVal} → {updTimeVal}
              {timeDiff() && <span style={{ color:_theme.textMuted, fontWeight:400, marginLeft:8 }}>({timeDiff()})</span>}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:8 }}>
              {calcs.filter(c=>c.base>0||c.curr>0).map(c=>(
                <div key={c.key} style={{ background:c.color+"12",
                  border:`1.5px solid ${c.color}30`, borderRadius:8,
                  padding:"10px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:c.color,
                    marginBottom:4 }}>{c.flag} {c.label}</div>
                  <div style={{ display:"flex", justifyContent:"center",
                    alignItems:"center", gap:6, fontSize:13 }}>
                    <span style={{ color:_theme.textMuted }}>{c.base}</span>
                    <span style={{ color:_theme.textMuted }}>→</span>
                    <span style={{ fontWeight:800, fontSize:16,
                      color:c.curr>c.base?"#EF4444":c.curr<c.base?"#10B981":_theme.textSub }}>
                      {c.curr}
                    </span>
                  </div>
                  <div style={{ fontSize:11, marginTop:4, fontWeight:600,
                    color:c.resolved>0?"#10B981":c.resolved<0?"#EF4444":_theme.textMuted }}>
                    {c.resolved>0?"+":""}{c.resolved}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SME Insights ─────────────────────────────────────────────────────── */}
        <div style={CRD()}>
          <label style={{ ...LBL, color:_theme.text }}>💡 SME Insights (Problem → Action → Result)</label>
          <textarea value={data.insight||""} onChange={e=>setQ("insight",e.target.value)} rows={3}
            style={{ ...I(), resize:"vertical" }} placeholder="Problem → Action → Result"/>
        </div>

      </div>
      {/* ═══════════════════════ END MAIN CONTENT ═══════════════════════════════ */}

    </div>
  );
}


// ─── NOTES PAGE ───────────────────────────────────────────────────────────────
function NotesPage({ notes, setNotes, session }) {
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState(() => { const n=new Date(); return pad(n.getHours())+":"+pad(n.getMinutes()); });
  const [text, setText] = useState("");
  const [tag, setTag]     = useState("General");
  const [recording, setRecording] = useState(false);
  const [recMsg, setRecMsg]       = useState("");
  const TAGS = ["General","Staffing Issue","Queue Alert","System Issue","Performance Note","Exceptional Event","Other"];

  // ── Voice Notes via Web Speech API ──────────────────────────────────────────
  function startVoiceNote() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setRecMsg("⚠️ Your browser does not support voice recognition"); setTimeout(()=>setRecMsg(""),3000); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart  = () => setRecording(true);
    rec.onend    = () => setRecording(false);
    rec.onerror  = (e) => { setRecording(false); setRecMsg("Recording error: "+e.error); setTimeout(()=>setRecMsg(""),3000); };
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r=>r[0].transcript).join(" ");
      setText(prev => prev ? prev+" "+transcript : transcript);
      setRecMsg("✅ Recognized: "+transcript.slice(0,40));
      setTimeout(()=>setRecMsg(""),3000);
    };
    rec.start();
  }
  const TAG_COLORS = {"General":"#64748B","Staffing Issue":"#EF4444","Queue Alert":"#F59E0B","System Issue":"#8B5CF6","Performance Note":"#2563EB","Exceptional Event":"#EC4899","Other":"#10B981"};

  const [filterTag,  setFilterTag]  = useState("All");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo,   setFilterTo]   = useState("");

  const allNotes = useMemo(()=>{
    let list = Array.isArray(notes) ? [...notes] : [];
    // Hide private Direct Messages and targeted Manager Messages from Notes page
    // Only show general notes, not personal messages
    list = list.filter(n => {
      if (n.tag === "Direct Message") return false; // Use Messages page
      if (n.tag === "Dark Note") return false;        // Owner-only, never shown
      if (n.tag === "UserStatus") return false;       // System presence tag
      if (n.tag === "TT Ticket") return false;        // Use TT Tracker page
      if (n.tag === "Self Check-In") return false;    // System check-in
      if (n.tag === "Password Reset Request") return false; // System reset
      if (n.tag === "Manager Message") return !n.target || n.target === "all"; // Only show broadcast messages
      if (n.tag === "Short Break Request") return false;
      if (n.tag === "Swap Request") return false;
      if (n.tag === "Break Swap Request") return false;
      if (n.tag === "Survey") return false;
      if (n.tag === "Survey Response") return false;
      return true;
    });
    if (filterTag !== "All") list = list.filter(n=>n.tag===filterTag);
    if (filterFrom) list = list.filter(n=>n.date>=filterFrom);
    if (filterTo)   list = list.filter(n=>n.date<=filterTo);
    return list.sort((a,b)=>b.ts.localeCompare(a.ts));
  }, [notes, filterTag, filterFrom, filterTo]);

  function addNote() {
    if (!text.trim()) return;
    const entry = { id:"n"+Date.now(), ts:`${date}T${time}:00`, date, time, tag, text };
    setNotes(prev => [entry, ...(Array.isArray(prev)?prev:[])].slice(0,500));
    setText(""); setTime(pad(new Date().getHours())+":"+pad(new Date().getMinutes()));
  }
  function deleteNote(id) { setNotes(prev=>(prev||[]).filter(n=>n.id!==id)); }

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>📝 Notes & Exceptional Events</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
      </div>
      {/* Filter bar */}
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>Filter:</span>
        <select value={filterTag} onChange={e=>setFilterTag(e.target.value)}
          style={{ ...I({width:160}) }}>
          <option value="All">All Types</option>
          {TAGS.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <input type="date" value={filterFrom} onChange={e=>setFilterFrom(e.target.value)}
          style={{ ...I({width:140}) }} placeholder="From date"/>
        <input type="date" value={filterTo} onChange={e=>setFilterTo(e.target.value)}
          style={{ ...I({width:140}) }} placeholder="To date"/>
        {(filterTag!=="All"||filterFrom||filterTo) && (
          <button onClick={()=>{setFilterTag("All");setFilterFrom("");setFilterTo("");}}
            style={{ ...PBT("#94A3B8",{padding:"5px 10px",fontSize:11}) }}>✕ Clear</button>
        )}
        <span style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>
          {allNotes.length} notes
        </span>
      </div>
      <div style={{ ...CRD(), marginBottom:16 }}>
        <div style={{ fontWeight:700, color:_theme.text, marginBottom:12 }}>Add Note</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:10, marginBottom:10 }}>
          <div><label style={LBL}>Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={I()}/></div>
          <div><label style={LBL}>Time</label><input type="time" value={time} onChange={e=>setTime(e.target.value)} style={I()}/></div>
          <div><label style={LBL}>Tag</label>
            <select value={tag} onChange={e=>setTag(e.target.value)} style={{ ...I(), border:`2px solid ${TAG_COLORS[tag]}` }}>
              {TAGS.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={3}
          style={{ ...I(), resize:"vertical", marginBottom:10 }}
          placeholder="Describe the exceptional circumstance, issue, or note that affected operations today..."/>
        {recMsg && <div style={{ fontSize:12, color:recording?"#EF4444":"#10B981",
          fontWeight:600, marginBottom:6 }}>{recMsg}</div>}
        <div style={{ display:"flex", gap:8 }}>
          <button style={PBT("#2563EB",{padding:"8px 20px",flex:1})} onClick={addNote}>+ Save Note</button>
          {"SpeechRecognition" in window || "webkitSpeechRecognition" in window ? (
            <button onClick={startVoiceNote}
              style={{ background:recording?"#EF4444":"#6366F1", color:"#fff", border:"none",
                borderRadius:8, padding:"8px 16px", fontSize:13, cursor:"pointer", fontWeight:600,
                display:"flex", alignItems:"center", gap:5 }}>
              {recording ? "⏹ Recording..." : "🎙️ Voice Note"}
            </button>
          ) : null}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {allNotes.length===0 && <div style={{ ...CRD(), textAlign:"center", padding:32, color:_theme.textMuted }}>📭 No notes yet</div>}
        {allNotes.map(n=>(
          <div key={n.id} style={{ ...CRD(), borderLeft:`4px solid ${TAG_COLORS[n.tag]||"#64748B"}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ background:TAG_COLORS[n.tag]+"20", color:TAG_COLORS[n.tag], border:`1px solid ${TAG_COLORS[n.tag]}40`,
                borderRadius:6, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{n.tag}</span>
              <span style={{ fontSize:12, color:_theme.textMuted }}>📅 {n.date} · 🕐 {n.time}</span>
              <button onClick={()=>deleteNote(n.id)} style={{ marginLeft:"auto", background:"none", border:"1px solid #FCA5A5",
                color:"#EF4444", borderRadius:4, padding:"2px 8px", cursor:"pointer", fontSize:11 }}>✕</button>
            </div>
            <div style={{ fontSize:13, color:_theme.text, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{n.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BREAK DURATION HELPER ────────────────────────────────────────────────────
function getDefaultBreakDuration(dateStr) {
  const cutoff = new Date("2026-03-20");
  const d = dateStr ? new Date(dateStr+"T00:00:00") : new Date();
  return d >= cutoff ? 60 : 30;
}

// ─── BREAK PAGE ─────────────────────────────────────────────────────────────────
function BreakPage({ employees, schedule, shifts, breakSchedule, setBreakSchedule, canEdit, addAudit, session, notes, setNotes, myShiftFilter }) {
  const [date, setDate]     = useState(todayStr());
  // If myShiftFilter is on, auto-select my shift
  const _myShiftEmp = session ? employees.find(e=>e.name===session.name) : null;
  const _myShiftDayName = DAYS[new Date().getDay()];
  const _myShiftId = _myShiftEmp ? (schedule[_myShiftEmp.id]||{})[_myShiftDayName] : null;
  const [shiftId, setShiftId] = useState(() => {
    // myShiftFilter unified via parent employee list
    return shifts[0]?.id||"";
  });
  const isOwner = session && isOwnerUser(session);

  const dayName = DAYS[new Date(date+"T12:00:00").getDay()];
  const key = `${date}_${shiftId}`;
  const sh  = shifts.find(s => s.id === shiftId);

  // Shift length in minutes
  const shiftLenMin = useMemo(() => {
    if (!sh) return 480;
    let l = toMin(sh.end) - toMin(sh.start);
    if (l <= 0) l += 1440;
    return l;
  }, [sh]);
  const shiftLenHours = (shiftLenMin / 60).toFixed(1);

  // Employees on this shift
  const shiftEmps = useMemo(() =>
    employees.filter(emp => (schedule[emp.id]||{})[dayName] === shiftId),
    [employees, schedule, shiftId, dayName]
  );

  // Entry: { offsetHours, offsetMins, durationMin, overMin }
  function getEntry(empId) {
    const def = getDefaultBreakDuration(date);
    return ((breakSchedule[key]||{})[empId]) || {
      offsetHours: 0, offsetMins: 0, durationMin: def, overMin: 0
    };
  }

  function setEntry(empId, field, val) {
    if (!canEdit) return;
    setBreakSchedule(prev => ({
      ...prev,
      [key]: {
        ...(prev[key]||{}),
        [empId]: { ...getEntry(empId), [field]: val }
      }
    }));
    if (addAudit) addAudit("Break Updated", employees.find(e=>e.id===empId)?.name||empId,
      `${field}=${val} | date=${date}`);
  }

  // Calculate actual break start time from offset + shift start
  function calcBreakStart(empId) {
    if (!sh) return "";
    const entry = getEntry(empId);
    const totalOffsetMin = (Number(entry.offsetHours)||0)*60 + (Number(entry.offsetMins)||0);
    const shiftStartMin  = toMin(sh.start);
    const breakStartMin  = (shiftStartMin + totalOffsetMin) % 1440;
    return pad(Math.floor(breakStartMin/60)) + ":" + pad(breakStartMin%60);
  }

  function calcBreakEnd(empId) {
    const startStr = calcBreakStart(empId);
    if (!startStr) return "";
    const entry = getEntry(empId);
    const endMin = (toMin(startStr) + Number(entry.durationMin)) % 1440;
    return pad(Math.floor(endMin/60)) + ":" + pad(endMin%60);
  }

  // Validation: offset must not exceed shift length
  function isOverShift(empId) {
    const entry = getEntry(empId);
    const totalOffset = (Number(entry.offsetHours)||0)*60 + (Number(entry.offsetMins)||0);
    return totalOffset >= shiftLenMin;
  }

  // Live status
  function getLiveStatus(empId) {
    const startStr = calcBreakStart(empId);
    const entry    = getEntry(empId);
    if (!startStr || (!entry.offsetHours && !entry.offsetMins)) return { status:"pending" };
    const now     = new Date();
    const nowMin  = now.getHours()*60 + now.getMinutes();
    const bStart  = toMin(startStr);
    const dur     = Number(entry.durationMin) || 60;
    const bEnd    = (bStart + dur) % 1440;
    let onBreak   = bEnd > bStart ? nowMin>=bStart && nowMin<bEnd : nowMin>=bStart||nowMin<bEnd;
    if (onBreak) {
      const elapsed = nowMin >= bStart ? nowMin - bStart : nowMin + 1440 - bStart;
      return { status:"on_break", elapsed, over: Math.max(0, elapsed - dur) };
    }
    let finished = bEnd > bStart ? nowMin >= bEnd : nowMin>=bEnd && nowMin<bStart;
    if (finished) return { status:"finished" };
    return { status:"pending" };
  }

  // Summary counts
  const statuses   = shiftEmps.map(e => getLiveStatus(e.id));
  const onBreakCnt = statuses.filter(s => s.status==="on_break").length;
  const finishCnt  = statuses.filter(s => s.status==="finished").length;
  const pendingCnt = statuses.filter(s => s.status==="pending").length;
  const overCnt    = statuses.filter(s => s.status==="on_break" && s.over>0).length;

  const defaultDur = getDefaultBreakDuration(date);

  const [bTab, setBTab] = useState("schedule");

  return (
    <div>
      {/* Break Page Tab Bar */}
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {[
          ["schedule","☕ Break Schedule"],
          ["swap",    "🔄 Swap Requests"],
          ["request", canEdit?"📥 Break Requests":"☕ Request Break"],
        ].map(([k,l])=>(
          <button key={k} onClick={()=>setBTab(k)}
            style={{ border:`2px solid ${bTab===k?_theme.primary:"#CBD5E1"}`,
              borderRadius:20, padding:"6px 16px", fontSize:12,
              cursor:"pointer", fontWeight:700,
              background:bTab===k?_theme.primary:"transparent",
              color:bTab===k?"#fff":_theme.textSub,
              display:"flex", alignItems:"center", gap:6 }}>
            {l}
            {k==="swap" && (() => {
              const cnt=(Array.isArray(notes)?notes:[]).filter(n=>{
                if(n.tag!=="Break Swap Request") return false;
                try{const d=JSON.parse(n.text||"{}");
                  return d.status==="pending_b"||d.status==="pending_supervisor";}catch{return false;}
              }).length;
              return cnt>0?<span style={{background:"#EF4444",color:"#fff",borderRadius:"50%",
                width:16,height:16,fontSize:9,fontWeight:800,
                display:"flex",alignItems:"center",justifyContent:"center"}}>{cnt}</span>:null;
            })()}
            {k==="request" && !canEdit && (() => {
              const mine=(Array.isArray(notes)?notes:[]).find(n=>{
                if(n.tag!=="Short Break Request") return false;
                try{const d=JSON.parse(n.text||"{}");
                  return d.empName===session?.name&&d.status==="pending";}catch{return false;}
              });
              return mine?<span style={{background:"#F59E0B",color:"#fff",borderRadius:"50%",
                width:16,height:16,fontSize:9,fontWeight:800,
                display:"flex",alignItems:"center",justifyContent:"center"}}>!</span>:null;
            })()}
          </button>
        ))}
      </div>

      {/* Schedule Tab */}
      {bTab==="schedule" && <div>
      {/* Toolbar */}
      <div style={SBR()}>
        <span style={{ fontWeight:800, fontSize:15, color:_theme.text }}>☕ Break Schedule</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          style={{ ...I(), width:150 }}/>
        <select value={shiftId} onChange={e=>setShiftId(e.target.value)}
          style={{ ...I(), width:170 }}>
          {shifts.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <div style={{ background:_theme.surface, border:`1px solid ${_theme.cardBorder}`,
          borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700,
          color:_theme.textSub }}>
          ⏱ Default: {defaultDur}m
        </div>
        {!canEdit && (
          <div style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)",
            borderRadius:8, padding:"5px 12px", fontSize:12, color:"#F59E0B", fontWeight:600 }}>
            👁️ View Only
          </div>
        )}
      </div>

      {/* Shift info */}
      {sh && (
        <div style={{ background:sh.color+"18", border:`1.5px solid ${sh.color}40`,
          borderRadius:10, padding:"10px 18px", marginBottom:14,
          display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <span style={{ fontWeight:800, color:sh.color, fontSize:14 }}>⏰ {sh.label}</span>
          <span style={{ fontSize:12, color:_theme.textSub }}>
            {shiftEmps.length} employees · Shift length: <strong>{shiftLenHours}h ({shiftLenMin}m)</strong>
          </span>
          <span style={{ fontSize:12, color:_theme.textMuted }}>{dayName} · {date}</span>
        </div>
      )}

      {/* Live summary KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        {[["☕ On Break",onBreakCnt,"#F59E0B"],["✅ Finished",finishCnt,"#3FB950"],
          ["⏳ Pending",pendingCnt,"#8B949E"],["⚠️ Overtime",overCnt,"#F85149"]].map(([l,v,c])=>(
          <div key={l} style={{ ...CRD({ padding:"12px 16px" }), borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Info for viewers only */}
      {!canEdit && (
        <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)",
          borderRadius:8, padding:"10px 16px", marginBottom:14, fontSize:12, color:_theme.textSub }}>
          👁️ View only — editing requires supervisor access.
        </div>
      )}

      {/* Break table */}
      <div style={{ ...CRD(), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:_theme.tableHead }}>
              {["#","Employee","Shift Start",
                canEdit ? "Offset from Shift Start" : "Break Offset",
                "Duration",
                "Break Start","Break End","Status"].map(h => (
                <th key={h} style={{ padding:"10px 10px", textAlign:"left", fontWeight:700,
                  color:_theme.text, borderBottom:`2px solid ${_theme.tableBorder}`,
                  whiteSpace:"nowrap", fontSize:12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shiftEmps.map((emp, ri) => {
              const entry   = getEntry(emp.id);
              const bStart  = calcBreakStart(emp.id);
              const bEnd    = calcBreakEnd(emp.id);
              const ls      = getLiveStatus(emp.id);
              const overShift = isOverShift(emp.id);
              const statusColor = ls.status==="on_break" ? (ls.over>0?"#F85149":"#F59E0B")
                                : ls.status==="finished" ? "#3FB950" : "#8B949E";
              const statusLabel = ls.status==="on_break"
                ? (ls.over>0 ? `⚠️ +${ls.over}m OVER` : `☕ ${ls.elapsed}m`)
                : ls.status==="finished" ? "✅ Done" : "⏳ Pending";

              return (
                <tr key={emp.id} style={{
                  background: ri%2===0 ? _theme.tableRow : _theme.tableRowAlt,
                  opacity: overShift ? 0.7 : 1
                }}>
                  <td style={{ padding:"8px 10px", color:_theme.textMuted, fontWeight:600 }}>{ri+1}</td>
                  <td style={{ padding:"8px 10px", fontWeight:700, color:_theme.text }}>
                    {emp.name}
                    <span style={{ marginLeft:6, fontSize:9, fontWeight:800, padding:"1px 5px",
                      borderRadius:4,
                      background:emp.gender==="F"?"#FCE7F3":"#EFF6FF",
                      color:emp.gender==="F"?"#BE185D":"#1D4ED8" }}>
                      {emp.gender||"M"}
                    </span>
                    <div style={{ fontSize:11, color:_theme.textMuted }}>{emp.role}</div>
                  </td>
                  <td style={{ padding:"8px 10px", color:_theme.textSub, fontWeight:600 }}>
                    {sh?.start || "--"}
                  </td>

                  {/* Offset input — only owner can edit */}
                  <td style={{ padding:"8px 10px" }}>
                    {canEdit ? (
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                          {/* Hours */}
                          <div style={{ display:"flex", alignItems:"center", gap:2 }}>
                            <button onClick={()=>setEntry(emp.id,"offsetHours",Math.max(0,Number(entry.offsetHours||0)-1))}
                              style={{ background:_theme.surface, border:`1px solid ${_theme.cardBorder}`,
                                color:_theme.text, borderRadius:6, width:24, height:24,
                                cursor:"pointer", fontSize:14, fontWeight:700, display:"flex",
                                alignItems:"center", justifyContent:"center" }}>−</button>
                            <input type="number" min="0" max="23"
                              value={entry.offsetHours||0}
                              onChange={e=>setEntry(emp.id,"offsetHours",Math.max(0,Number(e.target.value)))}
                              style={{ ...I({ width:46, textAlign:"center", padding:"4px 6px" })}}/>
                            <button onClick={()=>setEntry(emp.id,"offsetHours",Math.min(23,Number(entry.offsetHours||0)+1))}
                              style={{ background:_theme.surface, border:`1px solid ${_theme.cardBorder}`,
                                color:_theme.text, borderRadius:6, width:24, height:24,
                                cursor:"pointer", fontSize:14, fontWeight:700, display:"flex",
                                alignItems:"center", justifyContent:"center" }}>+</button>
                            <span style={{ fontSize:11, color:_theme.textMuted }}>h</span>
                          </div>
                          {/* Minutes */}
                          <div style={{ display:"flex", alignItems:"center", gap:2 }}>
                            <button onClick={()=>setEntry(emp.id,"offsetMins",Math.max(0,Number(entry.offsetMins||0)-5))}
                              style={{ background:_theme.surface, border:`1px solid ${_theme.cardBorder}`,
                                color:_theme.text, borderRadius:6, width:24, height:24,
                                cursor:"pointer", fontSize:14, fontWeight:700, display:"flex",
                                alignItems:"center", justifyContent:"center" }}>−</button>
                            <input type="number" min="0" max="59"
                              value={entry.offsetMins||0}
                              onChange={e=>setEntry(emp.id,"offsetMins",Math.max(0,Number(e.target.value)))}
                              style={{ ...I({ width:46, textAlign:"center", padding:"4px 6px" })}}/>
                            <button onClick={()=>setEntry(emp.id,"offsetMins",Math.min(55,Number(entry.offsetMins||0)+5))}
                              style={{ background:_theme.surface, border:`1px solid ${_theme.cardBorder}`,
                                color:_theme.text, borderRadius:6, width:24, height:24,
                                cursor:"pointer", fontSize:14, fontWeight:700, display:"flex",
                                alignItems:"center", justifyContent:"center" }}>+</button>
                            <span style={{ fontSize:11, color:_theme.textMuted }}>m</span>
                          </div>
                        </div>
                        {overShift && (
                          <div style={{ fontSize:10, color:"#F85149", fontWeight:700 }}>
                            ⚠️ Exceeds shift ({shiftLenHours}h)
                          </div>
                        )}
                        <div style={{ fontSize:10, color:_theme.textMuted }}>
                          = after {(Number(entry.offsetHours||0)*60+Number(entry.offsetMins||0))}m from {sh?.start}
                        </div>
                      </div>
                    ) : (
                      <div style={{ color:_theme.textSub, fontWeight:600 }}>
                        +{entry.offsetHours||0}h {entry.offsetMins||0}m
                      </div>
                    )}
                  </td>

                  {/* Duration */}
                  <td style={{ padding:"8px 10px" }}>
                    {canEdit ? (
                      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                        {[30,45,60,90].map(d => {
                          const isDef = d === defaultDur;
                          const isSel = entry.durationMin === d;
                          return (
                            <button key={d} onClick={()=>setEntry(emp.id,"durationMin",d)}
                              style={{ border:`1.5px solid ${isSel?"#58A6FF":isDef?"#3FB950":_theme.cardBorder}`,
                                borderRadius:6, padding:"3px 8px", fontSize:11, cursor:"pointer",
                                background:isSel?"#58A6FF18":isDef?"#3FB95018":_theme.surface,
                                color:isSel?"#58A6FF":isDef?"#3FB950":_theme.textSub, fontWeight:700 }}>
                              {d}m{isDef&&!isSel?" ★":""}
                            </button>
                          );
                        })}
                        <input type="number" min="10" max="120" value={entry.durationMin||defaultDur}
                          onChange={e=>setEntry(emp.id,"durationMin",Number(e.target.value))}
                          style={{ ...I({ width:55, padding:"3px 6px" })}} placeholder="min"/>
                      </div>
                    ) : (
                      <span style={{ fontWeight:600, color:_theme.textSub }}>{entry.durationMin||defaultDur}m</span>
                    )}
                  </td>

                  {/* Break Start / End */}
                  <td style={{ padding:"8px 10px", fontWeight:700,
                    color: bStart ? _theme.primary : _theme.textMuted }}>
                    {bStart || "—"}
                  </td>
                  <td style={{ padding:"8px 10px", fontWeight:700, color:_theme.textSub }}>
                    {bEnd || "—"}
                  </td>

                  {/* Status */}
                  <td style={{ padding:"8px 10px" }}>
                    <span style={{ background:statusColor+"18", color:statusColor,
                      border:`1px solid ${statusColor}40`, borderRadius:20,
                      padding:"3px 10px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
                      {statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
            {shiftEmps.length === 0 && (
              <tr><td colSpan={8} style={{ padding:32, textAlign:"center", color:_theme.textMuted }}>
                No employees scheduled for this shift on {dayName}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Owner-only: Bulk set offset */}
      {canEdit && shiftEmps.length > 0 && (
        <div style={{ ...CRD({ padding:"14px 18px" }), marginTop:14 }}>
          <div style={{ fontWeight:700, color:_theme.text, marginBottom:10, fontSize:13 }}>
            ⚡ Bulk Set Offset — apply same offset to all employees in this shift
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
            {[1,2,3,4,5,6].map(h => (
              <button key={h} onClick={() => {
                const updates = {};
                shiftEmps.forEach(emp => {
                  updates[emp.id] = { ...getEntry(emp.id), offsetHours: h, offsetMins: 0 };
                });
                setBreakSchedule(prev => ({ ...prev, [key]: { ...(prev[key]||{}), ...updates } }));
                if (addAudit) addAudit("Break Bulk Set", `Shift ${shiftId}`, `All employees: +${h}h offset`);
              }}
                style={{ background:_theme.surface, border:`1.5px solid ${_theme.cardBorder}`,
                  borderRadius:8, padding:"7px 16px", fontSize:13, cursor:"pointer",
                  color:_theme.text, fontWeight:700, transition:"all 0.15s" }}>
                +{h}h
              </button>
            ))}
            <span style={{ fontSize:12, color:_theme.textMuted }}>
              from shift start ({sh?.start})
            </span>
          </div>
        </div>
      )}

      </div>} {/* end schedule tab */}

      {/* Swap Tab */}
      {bTab==="swap" && (
      <BreakSwapPanel
        employees={employees}
        schedule={schedule}
        shifts={shifts}
        breakSchedule={breakSchedule}
        setBreakSchedule={setBreakSchedule}
        notes={typeof notes !== "undefined" ? notes : []}
        setNotes={typeof setNotes !== "undefined" ? setNotes : (v=>v)}
        session={session}
        canEdit={canEdit}
      />

      )} {/* end swap tab */}

      {/* Request Tab */}
      {bTab==="request" && (canEdit ? (
        <div style={{ marginTop:16 }}>
          <div style={{ fontWeight:800, fontSize:14, color:_theme.text, marginBottom:12 }}>
            ☕ Short Break Requests
          </div>
          <SupervisorBreakDashboard
            employees={employees}
            notes={typeof notes !== "undefined" ? notes : []}
            setNotes={typeof setNotes !== "undefined" ? setNotes : (v=>v)}
            session={session}
            breakSchedule={breakSchedule}
            shifts={shifts}
            schedule={schedule}
            queueLog={typeof queueLog !== "undefined" ? queueLog : {}}
          />
        </div>
      ) : (
        <div style={{ marginTop:16 }}>
          <div style={{ fontWeight:800, fontSize:14, color:_theme.text, marginBottom:12 }}>
            ☕ My Break Request
          </div>
          <ShortBreakRequestForm
            session={session}
            employees={employees}
            notes={typeof notes !== "undefined" ? notes : []}
            setNotes={typeof setNotes !== "undefined" ? setNotes : (v=>v)}
            breakSchedule={breakSchedule}
            shifts={shifts}
            schedule={schedule}
          />
        </div>
      ))} {/* end request tab */}
    </div>
  );
}

// ─── LIVE FLOOR PAGE ──────────────────────────────────────────────────────────
function LiveFloorPage({ employees, schedule, shifts, attendance, setAttendance, breakSchedule, setBreakSchedule, queueLog, canEdit, session }) {
  const [now, setNow] = useState(new Date());
  const [shortBreaks, setShortBreaks] = useState({});
  const [showShortModal, setShowShortModal] = useState(null);
  const [shortStart, setShortStart]   = useState("");
  const [shortDur, setShortDur]       = useState(15);

  const isAgentView = session?.role === "Agent";

  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),60000); return()=>clearInterval(t); },[]);

  const nowMin  = now.getHours()*60 + now.getMinutes();
  const todayD  = now.toISOString().slice(0,10);
  const dayName = DAYS[now.getDay()];

  const workingNow = employees.filter(emp => {
    // Agent sees only themselves
    if (isAgentView && emp.name !== session?.name) return false;
    const sid = (schedule[emp.id]||{})[dayName];
    if (!sid||sid==="OFF"||sid==="LEAVE"||sid==="PH") return false;
    const sh = shifts.find(s=>s.id===sid);
    if (!sh) return false;
    const st=toMin(sh.start), en=toMin(sh.end);
    if (en>st) return nowMin>=st && nowMin<en;
    return nowMin>=st || nowMin<en;
  });

  // Get scheduled break from BreakPage — entry stores {offsetHours, offsetMins, durationMin}
  function getScheduledBreak(emp) {
    const sid = (schedule[emp.id]||{})[dayName];
    if (!sid) return null;
    const sh = shifts.find(s=>s.id===sid);
    if (!sh) return null;
    const key = `${todayD}_${sid}`;
    const entry = ((breakSchedule[key]||{})[emp.id]);
    if (!entry || !entry.durationMin) return null;
    // Compute break start from shift start + offset
    const totalOffsetMin = (Number(entry.offsetHours)||0)*60 + (Number(entry.offsetMins)||0);
    if (totalOffsetMin === 0) return null; // not scheduled yet
    const shiftStartMin = toMin(sh.start);
    const breakStartMin = (shiftStartMin + totalOffsetMin) % 1440;
    const startStr = pad(Math.floor(breakStartMin/60)) + ":" + pad(breakStartMin%60);
    return { start: startStr, durationMin: entry.durationMin };
  }

  // Short Breaks (formerly Extra Break)
  function getShortBreaks(empId) { return shortBreaks[empId]||[]; }

  function addShortBreak(empId) {
    if (!canEdit) { setShowShortModal(null); return; } // double-lock
    if (!shortStart) return;
    setShortBreaks(prev=>({
      ...prev,
      [empId]: [...(prev[empId]||[]), { start:shortStart, durationMin:Number(shortDur) }]
    }));
    setShortStart(""); setShortDur(15); setShowShortModal(null);
  }

  // Per-employee status -- fully automatic from breakSchedule
  function getEmpStatus(emp) {
    const entry = getScheduledBreak(emp);
    if (!entry) return { status:"Online", elapsed:0, over:0, isOvertime:false };

    const bStart = toMin(entry.start);
    const dur    = Number(entry.durationMin);
    const bEnd   = (bStart + dur) % 1440;

    // Is break scheduled but not started yet?
    const minsUntil = bStart > nowMin ? bStart - nowMin : (bStart + 1440 - nowMin);
    if (minsUntil > 0 && minsUntil <= 1440) {
      const beforeBreak = (() => {
        if (bEnd > bStart) return nowMin < bStart;
        return nowMin < bStart && nowMin >= bEnd;
      })();
      if (beforeBreak) {
        return { status:"Break Soon", elapsed:0, over:0, isOvertime:false,
          bStart:entry.start, bEnd:pad(Math.floor(bEnd/60))+":"+pad(bEnd%60), dur,
          minsUntil: bStart - nowMin > 0 ? bStart - nowMin : bStart + 1440 - nowMin };
      }
    }

    // Is currently on break?
    let onBreak = false;
    if (bEnd > bStart) onBreak = nowMin >= bStart && nowMin < bEnd;
    else onBreak = nowMin >= bStart || nowMin < bEnd;

    if (onBreak) {
      const elapsed = nowMin >= bStart ? nowMin-bStart : nowMin+1440-bStart;
      const over    = Math.max(0, elapsed - dur);
      return { status:"Break", elapsed, over, isOvertime:over>0,
        bStart:entry.start, bEnd:pad(Math.floor(bEnd/60))+":"+pad(bEnd%60), dur };
    }

    // Break is finished
    return { status:"Online", elapsed:0, over:0, isOvertime:false,
      breakDone:true, bStart:entry.start, bEnd:pad(Math.floor(bEnd/60))+":"+pad(bEnd%60) };
  }

  function totalShortMin(empId) {
    return getShortBreaks(empId).reduce((s,b)=>s+b.durationMin,0);
  }

  // Record overtime manually in breakSchedule
  function recordOvertime(emp, overMin) {
    const sid = (schedule[emp.id]||{})[dayName];
    if (!sid) return;
    const key = `${todayD}_${sid}`;
    setBreakSchedule(prev=>({
      ...prev,
      [key]: { ...(prev[key]||{}), [emp.id]: { ...((prev[key]||{})[emp.id]||{}), overMin:Number(overMin) } }
    }));
  }

  // ── Queue-based Staffing Sufficient (100% accurate from Queue page data) ──────
  // Find the latest queue snapshot for today across all shifts
  const todayQueueData = useMemo(() => {
    const entries = Object.entries(queueLog || {})
      .filter(([k]) => k.startsWith(todayD))
      .map(([, v]) => v);
    if (!entries.length) return null;
    // Pick the one with the latest updTime
    return entries.reduce((best, e) => {
      if (!best) return e;
      if ((e.updTime||"00:00") > (best.updTime||"00:00")) return e;
      return best;
    }, null);
  }, [queueLog, todayD]);

  // Total current queue load from Queue page
  const QUEUE_KEYS = ["tga","ob","oslo","some","kwtT2","qatT2","bahT2","uaeT2","someKwt","someQat","someBah","someUae"];
  const totalQueueNow = todayQueueData
    ? QUEUE_KEYS.reduce((s,k) => s + Number(todayQueueData[k+"Curr"]||0), 0)
    : null;
  const totalQueueBase = todayQueueData
    ? QUEUE_KEYS.reduce((s,k) => s + Number(todayQueueData[k+"Base"]||0), 0)
    : null;

  const onlineCount  = workingNow.filter(e=>{ const s=getEmpStatus(e).status; return s==="Online"||s==="Break Soon"||s==="Break Done"; }).length;
  const breakCount   = workingNow.filter(e=>getEmpStatus(e).status==="Break").length;
  const total        = workingNow.length;

  // ── Staffing Sufficient: uses Queue data when available, else headcount ratio ──
  let pressure;
  if (totalQueueNow !== null && total > 0) {
    // Cases per available agent — queue-driven assessment
    const agentsAvail = Math.max(1, onlineCount);
    const caseLoad    = totalQueueNow / agentsAvail;
    const queueTrend  = totalQueueBase !== null ? totalQueueNow - totalQueueBase : 0;

    if (caseLoad <= 10 && queueTrend <= 0) {
      pressure = { label:"✅ Staffing Sufficient", color:"#10B981", bg:"rgba(16,185,129,0.08)",
        sub:`${agentsAvail} agents · ${totalQueueNow} cases · ${caseLoad.toFixed(1)} per agent — Queue Stable`, pct:100 };
    } else if (caseLoad <= 20 || (caseLoad <= 30 && queueTrend <= 50)) {
      pressure = { label:"⚠️ Staffing Low — Monitor Queue", color:"#F59E0B", bg:"rgba(245,158,11,0.08)",
        sub:`${agentsAvail} agents · ${totalQueueNow} cases · ${caseLoad.toFixed(1)} per agent — ${queueTrend>0?"Queue Growing":"Stable"}`, pct:Math.round((10/caseLoad)*100) };
    } else {
      pressure = { label:"🚨 Critical Shortage — Immediate Action Required", color:"#EF4444", bg:"rgba(239,68,68,0.08)",
        sub:`${agentsAvail} agents · ${totalQueueNow} cases · ${caseLoad.toFixed(1)} per agent — Queue Critical`, pct:Math.round((10/caseLoad)*100) };
    }
  } else {
    // Fallback to headcount ratio when no queue data
    const ratio = total > 0 ? onlineCount/total : 1;
    if (ratio >= 0.8) {
      pressure = { label:"✅ Staffing Sufficient", color:"#10B981", bg:"rgba(16,185,129,0.08)",
        sub:`${onlineCount} of ${total} agents available`, pct:Math.round(ratio*100) };
    } else if (ratio >= 0.6) {
      pressure = { label:"⚠️ Staffing Low — Monitor", color:"#F59E0B", bg:"rgba(245,158,11,0.08)",
        sub:`${onlineCount} of ${total} agents available`, pct:Math.round(ratio*100) };
    } else {
      pressure = { label:"🚨 Critical Shortage — Immediate Action Required", color:"#EF4444", bg:"rgba(239,68,68,0.08)",
        sub:`${onlineCount} of ${total} agents available`, pct:Math.round(ratio*100) };
    }
  }

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>🏢 Live Floor Monitor</span>
        <span style={{ fontSize:13, color:_theme.textMuted }}>🕐 {pad(now.getHours())}:{pad(now.getMinutes())} · {dayName}</span>
        <div style={{ marginLeft:"auto", display:"flex", gap:10 }}>
          <span style={{ background:"#10B981"+"20", color:"#10B981", borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:13 }}>🟢 Online: {onlineCount}</span>
          <span style={{ background:"#F59E0B"+"20", color:"#F59E0B", borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:13 }}>☕ Break: {breakCount}</span>
          <span style={{ background:"#64748B"+"20", color:_theme.textMuted, borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:13 }}>👥 Total: {total}</span>
        </div>
      </div>

      {/* Pressure Indicator */}
      <div style={{ background:pressure.bg, border:`2px solid ${pressure.color}40`, borderRadius:12,
        padding:"18px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ fontSize:36 }}>{pressure.pct>=80?"✅":pressure.pct>=50?"⚠️":"🚨"}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:18, color:pressure.color }}>{pressure.label}</div>
          <div style={{ fontSize:13, color:_theme.textSub, marginTop:4 }}>{pressure.sub}</div>
          {totalQueueNow !== null && (
            <div style={{ marginTop:6, display:"flex", gap:12, flexWrap:"wrap" }}>
              <span style={{ fontSize:11, background:"rgba(239,68,68,0.1)", color:"#EF4444",
                border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, padding:"2px 10px", fontWeight:700 }}>
                📊 Queue Total: {totalQueueNow} cases
              </span>
              {totalQueueBase !== null && (
                <span style={{ fontSize:11, background: totalQueueNow>totalQueueBase?"rgba(239,68,68,0.1)":"rgba(16,185,129,0.1)",
                  color: totalQueueNow>totalQueueBase?"#EF4444":"#10B981",
                  border:`1px solid ${totalQueueNow>totalQueueBase?"rgba(239,68,68,0.2)":"rgba(16,185,129,0.2)"}`,
                  borderRadius:10, padding:"2px 10px", fontWeight:700 }}>
                  {totalQueueNow>totalQueueBase?`📈 +${totalQueueNow-totalQueueBase} from baseline`:`📉 -${totalQueueBase-totalQueueNow} from baseline`}
                </span>
              )}
              <span style={{ fontSize:11, color:_theme.textMuted }}>
                🕐 Queue snapshot: {todayQueueData?.updTime || "—"}
              </span>
            </div>
          )}
        </div>
        <div style={{ textAlign:"center", minWidth:64 }}>
          <div style={{ fontSize:32, fontWeight:800, color:pressure.color }}>
            {Math.min(100,Math.max(0,pressure.pct))}%
          </div>
          <div style={{ fontSize:11, color:_theme.textMuted }}>
            {totalQueueNow !== null ? "Staffing Score" : "Available"}
          </div>
        </div>
      </div>

      {/* No break schedule notice */}
      {workingNow.length > 0 && workingNow.every(e=>!getScheduledBreak(e)) && (
        <div style={{ background:"#FEF9C3", border:"1px solid #F59E0B", borderRadius:8,
          padding:"10px 16px", marginBottom:16, fontSize:13, color:"#92400E", display:"flex", gap:10, alignItems:"center" }}>
          ⚠️ No break schedule found for today. Go to the <strong>Break</strong> page to schedule breaks -- they will appear here automatically.
        </div>
      )}

      {/* Employee Cards */}
      {workingNow.length===0 && (
        <div style={{ ...CRD(), textAlign:"center", padding:40, color:_theme.textMuted }}>
          No employees scheduled for this shift right now.
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:12 }}>
        {workingNow.map(emp => {
          const es          = getEmpStatus(emp);
          const sid         = (schedule[emp.id]||{})[dayName];
          const sh          = shifts.find(s=>s.id===sid);
          const shortTotal  = totalShortMin(emp.id);
          const statusColor = es.status==="Break"    ? (es.isOvertime?"#EF4444":"#F59E0B")
                            : es.status==="Break Soon"? "#6366F1" : "#10B981";
          const borderColor = es.isOvertime ? "#EF4444" : statusColor;

          // Get overtime from breakSchedule if recorded
          const bsEntry = getScheduledBreak(emp);
          const recordedOver = bsEntry?.overMin||0;

          return (
            <div key={emp.id} style={{ ...CRD({ padding:16 }),
              border:`2px solid ${borderColor}40`, borderLeft:`4px solid ${borderColor}` }}>

              {/* Header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:14, color:_theme.text, display:"flex", alignItems:"center", gap:6 }}>
                    {emp.name}
                    <span style={{ fontSize:9, fontWeight:800, padding:"1px 5px", borderRadius:4,
                      background:emp.gender==="F"?"#FCE7F3":"#EFF6FF",
                      color:emp.gender==="F"?"#BE185D":"#1D4ED8",
                      border:emp.gender==="F"?"1px solid #F9A8D4":"1px solid #BFDBFE" }}>
                      {emp.gender||"M"}
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:ROLE_COLORS[emp.role]||"#64748B", fontWeight:600 }}>{emp.role}</div>
                  {sh && <div style={{ fontSize:11, color:sh.color, marginTop:2 }}>⏰ {sh.label}</div>}
                </div>
                <div style={{ textAlign:"right" }}>
                  <span style={{ background:statusColor+"20", color:statusColor, borderRadius:20,
                    padding:"3px 10px", fontSize:12, fontWeight:700,
                    border:es.isOvertime?"2px solid #EF4444":"none" }}>
                    {es.status==="Break"     ? "☕ Break"
                     :es.status==="Break Soon"? "🔜 Break Soon"
                     :es.breakDone          ? "✅ Break Done"
                     :"🟢 Online"}
                  </span>
                </div>
              </div>

              {/* Scheduled break info */}
              {bsEntry && (
                <div style={{ background: es.status==="Break"?(es.isOvertime?"#FEF2F2":"#FEF9C3")
                  :es.status==="Break Soon"?"#EEF2FF":"#F0FDF4",
                  borderRadius:8, padding:"8px 12px", marginBottom:10, fontSize:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700,
                    color:statusColor, marginBottom:4 }}>
                    <span>📋 Scheduled: {bsEntry.start} → {(() => {
                      const e=(toMin(bsEntry.start)+Number(bsEntry.durationMin))%1440;
                      return pad(Math.floor(e/60))+":"+pad(e%60);
                    })()} ({bsEntry.durationMin}m)</span>
                  </div>
                  {es.status==="Break" && (
                    <>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11,
                        color:_theme.textMuted, marginBottom:4 }}>
                        <span>Elapsed: {es.elapsed}m</span>
                        {es.isOvertime && <span style={{ color:"#EF4444", fontWeight:700 }}>⚠️ +{es.over}m OVER</span>}
                      </div>
                      <div style={{ background:"#E2E8F0", borderRadius:10, height:8, overflow:"hidden" }}>
                        <div style={{ width:Math.min(100,Math.round((es.elapsed/bsEntry.durationMin)*100))+"%",
                          height:"100%", background:es.isOvertime?"#EF4444":"#F59E0B",
                          borderRadius:10, transition:"width 1s" }}/>
                      </div>
                    </>
                  )}
                  {es.status==="Break Soon" && (
                    <div style={{ fontSize:11, color:"#6366F1", fontWeight:600 }}>
                      ⏱ Starts in {es.minsUntil}m
                    </div>
                  )}
                  {es.breakDone && !es.isOvertime && (
                    <div style={{ fontSize:11, color:"#10B981", fontWeight:600 }}>Break completed ✅</div>
                  )}
                </div>
              )}

              {/* Overtime input -- shown when on break and over time */}
              {es.status==="Break" && es.isOvertime && (
                <div style={{ marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:12, color:"#EF4444", fontWeight:600 }}>Record overtime:</span>
                  <input type="number" min="0" max="120"
                    value={recordedOver||es.over||""}
                    onChange={e=>recordOvertime(emp, e.target.value)}
                    style={{ ...I({ width:65, border:"2px solid #EF4444" })}} placeholder="min"/>
                  <span style={{ fontSize:11, color:"#EF4444" }}>min</span>
                </div>
              )}
              {recordedOver>0 && es.status!=="Break" && (
                <div style={{ fontSize:11, color:"#EF4444", fontWeight:600, marginBottom:8 }}>
                  ⚠️ Overtime recorded: +{recordedOver}m
                </div>
              )}

              {/* Short Breaks */}
              {shortTotal > 0 && (
                <div style={{ fontSize:11, color:"#8B5CF6", fontWeight:600, marginBottom:8 }}>
                  ⚡ Short Breaks: {shortTotal}m total
                  {getShortBreaks(emp.id).map((sb,i)=>(
                    <span key={i} style={{ marginLeft:6, color:_theme.textMuted }}>[{sb.start} +{sb.durationMin}m]</span>
                  ))}
                </div>
              )}

              {/* Actions — canEdit required for Short Break */}
              {canEdit && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <button onClick={()=>{ setShowShortModal(emp.id); setShortStart(pad(now.getHours())+":"+pad(now.getMinutes())); setShortDur(15); }}
                    style={PBT("#8B5CF6",{padding:"5px 12px",fontSize:11})}>⚡ Short Break</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Short Break Modal */}
      {showShortModal && canEdit && (
        <Modal title={`⚡ Short Break -- ${employees.find(e=>e.id===showShortModal)?.name}`}
          onClose={()=>setShowShortModal(null)} width={380}>
          <label style={LBL}>Start Time</label>
          <input type="time" value={shortStart} onChange={e=>setShortStart(e.target.value)} style={{ ...I(), marginBottom:12 }}/>
          <label style={LBL}>Duration (min)</label>
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            {[5,10,15,20,30].map(d=>(
              <button key={d} onClick={()=>setShortDur(d)}
                style={{ border:`2px solid ${shortDur===d?"#8B5CF6":"#CBD5E1"}`, borderRadius:8,
                  padding:"6px 14px", fontSize:13, cursor:"pointer", fontWeight:700,
                  background:shortDur===d?"#F3E8FF":"#fff", color:shortDur===d?"#6D28D9":"#64748B" }}>{d}m</button>
            ))}
            <input type="number" min="1" max="120" value={shortDur}
              onChange={e=>setShortDur(Number(e.target.value))}
              style={{ ...I({ width:80 })}} placeholder="Custom"/>
          </div>
          <button style={PBT("#8B5CF6",{width:"100%",padding:"10px"})}
            onClick={()=>addShortBreak(showShortModal)}>⚡ Add Short Break</button>
        </Modal>
      )}
    </div>
  );
}
// ─── DAILY TASKS PAGE (merged Roster + Tasks) ─────────────────────────────────
function DailyTasksPage({ employees, setEmployees, schedule, setSchedule, shifts, auditLog, setAuditLog, session }) {
  const [tab, setTab] = useState("tasks"); // "tasks" | "roster"
  // Forward to existing components
  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[["tasks","📋 Task Assignments"],["roster","👥 Employee Roster"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{ border:`2px solid #2563EB`, borderRadius:20, padding:"6px 16px", fontSize:13, cursor:"pointer", fontWeight:600,
              background:tab===k?"#2563EB":"transparent", color:tab===k?"#fff":"#2563EB" }}>{l}</button>
        ))}
      </div>
      {tab==="tasks"
        ? <TaskAssignmentsPage employees={employees} setEmployees={setEmployees} auditLog={auditLog} setAuditLog={setAuditLog} session={session}/>
        : <RosterPage employees={employees} setEmployees={setEmployees} schedule={schedule} setSchedule={setSchedule} shifts={shifts}/>
      }
    </div>
  );
}

// ─── ROSTER PAGE ──────────────────────────────────────────────────────────────
function RosterPage({ employees, setEmployees, schedule, setSchedule, shifts }) {
  const [date, setDate] = useState(todayStr());
  const [activeShift, setActiveShift] = useState(shifts[0]?.id||"");
  const [showAdd, setShowAdd] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [newEmp, setNewEmp] = useState({ name:"", tasks:[], role:"Agent", gender:"M" });

  const dayName = DAYS[new Date(date+"T12:00:00").getDay()];

  // Employees scheduled for this shift on this day
  const shiftEmployees = useMemo(() =>
    employees.filter(emp => (schedule[emp.id]||{})[dayName] === activeShift),
    [employees, schedule, activeShift, dayName]
  );

  // KPI counts for this shift view
  const roleGroups = {};
  shiftEmployees.forEach(e => { roleGroups[e.role] = (roleGroups[e.role]||0)+1; });

  function addEmployee() {
    if (!newEmp.name.trim()) return;
    const id = "e"+Date.now();
    const finalRole = newEmp.role==="Other" ? (newEmp.customRole||"Other") : newEmp.role;
    const defaultSched = { Sunday:"OFF", Monday:"OFF", Tuesday:"OFF", Wednesday:"OFF", Thursday:"OFF", Friday:"OFF", Saturday:"OFF" };
    defaultSched[dayName] = activeShift;
    setEmployees(prev => [...prev, { id, name:newEmp.name, role:finalRole, tasks:newEmp.tasks, gender:newEmp.gender||"M" }]);
    setSchedule(prev => ({ ...prev, [id]: defaultSched }));
    setNewEmp({ name:"", tasks:[], role:"Agent", gender:"M", customRole:"" });
    setShowAdd(false);
  }

  function saveEdit() {
    const finalRole = editEmp.role==="Other" ? (editEmp.customRole||"Other") : editEmp.role;
    setEmployees(prev => prev.map(e => e.id===editEmp.id ? {...editEmp, role:finalRole} : e));
    setEditEmp(null);
  }

  // Remove from this shift only (set to OFF for this day), does NOT delete employee
  function removeFromShift(empId) {
    if (!window.confirm("Remove this employee from this shift? (They won't be deleted, just unscheduled for this day)")) return;
    setSchedule(prev => ({ ...prev, [empId]: { ...(prev[empId]||{}), [dayName]:"OFF" } }));
  }

  // Permanently delete employee
  function deleteEmp(id) {
    if (!window.confirm("Permanently delete this employee from the system?")) return;
    setEmployees(prev => prev.filter(e => e.id!==id));
    setSchedule(prev => { const n={...prev}; delete n[id]; return n; });
  }

  const sh = shifts.find(s=>s.id===activeShift);

  return (
    <div>
      {/* Toolbar */}
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>👥 Daily Roster</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
        <span style={{ fontSize:12, color:_theme.textMuted, fontWeight:600 }}>{dayName}</span>
        <button style={PBT("#2563EB")} onClick={()=>setShowAdd(true)}>+ Add Employee</button>
      </div>

      {/* Shift Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {shifts.map(s => (
          <button key={s.id} onClick={()=>setActiveShift(s.id)}
            style={{ border:`2px solid ${s.color}`, borderRadius:20, padding:"5px 14px", fontSize:12, cursor:"pointer", fontWeight:600,
              background: activeShift===s.id ? s.color : "transparent", color: activeShift===s.id ? "#fff" : s.color, transition:"all 0.15s" }}>
            {s.label} · {s.start}
          </button>
        ))}
      </div>

      {/* Shift header + KPI strip */}
      {sh && (
        <div style={{ background: sh.color+"18", border:`1.5px solid ${sh.color}40`, borderRadius:10, padding:"12px 18px", marginBottom:14, display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
          <div style={{ fontWeight:800, color:sh.color, fontSize:15 }}>⏰ {sh.label} &nbsp; {sh.start} - {sh.end}</div>
          <div style={{ fontWeight:700, fontSize:13, color:_theme.text }}>{shiftEmployees.length} scheduled</div>
          {Object.entries(roleGroups).map(([role,count]) => (
            <span key={role} style={{ fontSize:12, background:"#fff", border:`1px solid ${sh.color}60`, borderRadius:10, padding:"3px 10px", color:_theme.textSub, fontWeight:600 }}>
              {role}: {count}
            </span>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={{ ...CRD(), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
              {["#","Name","Role","Tasks","Actions"].map(h=>(
                <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shiftEmployees.map((emp, ri) => (
              <tr key={emp.id} style={{ background: ri%2===0?_theme.card:_theme.surface }}>
                <td style={{ padding:"10px 12px", color:_theme.textMuted, fontWeight:600 }}>{ri+1}</td>
                <td style={{ padding:"10px 12px", fontWeight:700, color:_theme.text }}>{emp.name}</td>
                <td style={{ padding:"10px 12px" }}>
                  <span style={{ background:"#F1F5F9", borderRadius:6, padding:"3px 9px", fontSize:12, color:_theme.textSub, fontWeight:600 }}>{emp.role}</span>
                </td>
                <td style={{ padding:"10px 12px" }}>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {emp.tasks.map(t=>(
                      <span key={t} style={{ background:taskColor(t), color:"#fff", borderRadius:10, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{t}</span>
                    ))}
                  </div>
                </td>
                <td style={{ padding:"10px 12px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={()=>setEditEmp({...emp})}
                      style={{ background:"none", border:"1px solid #CBD5E1", borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:13 }} title="Edit">✏️</button>
                    <button onClick={()=>removeFromShift(emp.id)}
                      style={{ background:"none", border:"1px solid #FCD34D", borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:13, color:"#92400E" }} title="Remove from shift">📅✕</button>
                    <button onClick={()=>deleteEmp(emp.id)}
                      style={{ background:"none", border:"1px solid #FCA5A5", borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:13, color:"#EF4444" }} title="Delete employee">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {shiftEmployees.length===0 && (
              <tr>
                <td colSpan={5} style={{ padding:32, textAlign:"center", color:_theme.textMuted }}>
                  No employees scheduled for <strong>{sh?.label}</strong> on <strong>{dayName}</strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ marginTop:10, display:"flex", gap:16, fontSize:11, color:_theme.textMuted }}>
        <span>✏️ Edit info</span>
        <span>📅✕ Remove from this shift only</span>
        <span>🗑️ Delete permanently</span>
      </div>

      {/* Add Modal -- assigns to current shift+day automatically */}
      {showAdd && (
        <Modal title={`Add Employee to ${sh?.label||""} · ${dayName}`} onClose={()=>setShowAdd(false)}>
          <div style={{ background:"#EFF6FF", borderRadius:6, padding:"8px 12px", marginBottom:14, fontSize:12, color:"#1D4ED8" }}>
            Employee will be assigned to shift <strong>{sh?.label} ({sh?.start}-{sh?.end})</strong> on <strong>{dayName}</strong>
          </div>
          <label style={LBL}>Name</label>
          <input style={{ ...I(), marginBottom:12 }} value={newEmp.name} onChange={e=>setNewEmp(p=>({...p,name:e.target.value}))} placeholder="Full name" autoFocus/>
          <label style={LBL}>Role</label>
          <select style={{ ...I(), marginBottom: newEmp.role==="Other"?6:12 }} value={newEmp.role} onChange={e=>setNewEmp(p=>({...p,role:e.target.value,customRole:""}))}>
            {["Agent","Shift Leader","Team Lead","SME","Other"].map(r=><option key={r}>{r}</option>)}
          </select>
          {newEmp.role==="Other" && (
            <input style={{ ...I(), marginBottom:12 }} value={newEmp.customRole||""} onChange={e=>setNewEmp(p=>({...p,customRole:e.target.value}))} placeholder="Enter custom role title..."/>
          )}
          <label style={LBL}>Tasks</label>
          <div style={{ marginBottom:16 }}><TaskPicker selected={newEmp.tasks} onChange={tasks=>setNewEmp(p=>({...p,tasks}))}/></div>
          <button style={PBT("#2563EB",{width:"100%"})} onClick={addEmployee}>+ Add & Assign to Shift</button>
        </Modal>
      )}

      {/* Edit Modal */}
      {editEmp && (
        <Modal title="Edit Employee" onClose={()=>setEditEmp(null)}>
          <label style={LBL}>Name</label>
          <input style={{ ...I(), marginBottom:12 }} value={editEmp.name} onChange={e=>setEditEmp(p=>({...p,name:e.target.value}))}/>
          <label style={LBL}>Role</label>
          <select style={{ ...I(), marginBottom: editEmp.role==="Other"?6:12 }} value={editEmp.role} onChange={e=>setEditEmp(p=>({...p,role:e.target.value,customRole:""}))}>
            {["Agent","Shift Leader","Team Lead","SME","Other"].map(r=><option key={r}>{r}</option>)}
          </select>
          {editEmp.role==="Other" && (
            <input style={{ ...I(), marginBottom:12 }} value={editEmp.customRole||""} onChange={e=>setEditEmp(p=>({...p,customRole:e.target.value}))} placeholder="Enter custom role title..."/>
          )}
          <label style={LBL}>Tasks</label>
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", gap:8 }}>
              {["KFOOD","KEEMRT"].map(t => {
                const sel = (editEmp.tasks||[]).includes(t);
                const color = t==="KFOOD" ? "#3FB950" : "#58A6FF";
                return (
                  <button key={t} onClick={()=>{
                    const cur = editEmp.tasks||[];
                    const next = sel ? cur.filter(x=>x!==t) : [...cur,t];
                    setEditEmp(p=>({...p,tasks:next}));
                  }} style={{ flex:1, border:`2px solid ${sel?color:_theme.cardBorder}`,
                    borderRadius:10, padding:"10px", cursor:"pointer", fontWeight:700,
                    fontSize:14, background:sel?color+"18":_theme.surface,
                    color:sel?color:_theme.textSub, transition:"all 0.15s" }}>
                    {sel ? "✓ " : ""}{t}
                  </button>
                );
              })}
            </div>
          </div>
          <button style={PBT("#2563EB",{width:"100%"})} onClick={saveEdit}>Save Changes</button>
        </Modal>
      )}
    </div>
  );
}

// ─── SHIFTS CONFIG PAGE ───────────────────────────────────────────────────────
function ShiftsPage({ shifts, setShifts }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newShift, setNewShift] = useState({ label:"New Shift", start:"09:00", end:"17:00", color:"#6366F1" });

  function saveEdit() {
    setShifts(prev=>prev.map(s=>s.id===editId?{...s,...editData}:s));
    setEditId(null);
  }
  function addShift() {
    setShifts(prev=>[...prev,{id:"s"+Date.now(),...newShift}]);
    setShowAdd(false);
  }
  function deleteShift(id) {
    if (!window.confirm("Delete this shift?")) return;
    setShifts(prev=>prev.filter(s=>s.id!==id));
  }

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>⏰ Shift Configuration</span>
        <button style={PBT("#2563EB")} onClick={()=>setShowAdd(true)}>+ Add Shift</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
        {shifts.map(sh=>(
          <div key={sh.id} style={{ ...CRD({ padding:0 }), overflow:"hidden" }}>
            <div style={{ background:sh.color, padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>{sh.label}</div>
                <div style={{ color:"rgba(255,255,255,0.85)", fontSize:13 }}>{sh.start} - {sh.end}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={()=>{setEditId(sh.id);setEditData({...sh});}}
                  style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>✏️</button>
                <button onClick={()=>deleteShift(sh.id)}
                  style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>✕</button>
              </div>
            </div>
            {editId===sh.id && (
              <div style={{ padding:16 }}>
                <label style={LBL}>Label</label>
                <input style={{ ...I(), marginBottom:8 }} value={editData.label||""} onChange={e=>setEditData(p=>({...p,label:e.target.value}))}/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                  <div><label style={LBL}>Start</label><input type="time" style={I()} value={editData.start||""} onChange={e=>setEditData(p=>({...p,start:e.target.value}))}/></div>
                  <div><label style={LBL}>End</label><input type="time" style={I()} value={editData.end||""} onChange={e=>setEditData(p=>({...p,end:e.target.value}))}/></div>
                </div>
                <label style={LBL}>Color</label>
                <input type="color" style={{ ...I(), height:36, padding:2, marginBottom:10 }} value={editData.color||"#2563EB"} onChange={e=>setEditData(p=>({...p,color:e.target.value}))}/>
                <div style={{ display:"flex", gap:8 }}>
                  <button style={PBT("#10B981",{flex:1})} onClick={saveEdit}>Save</button>
                  <button style={PBT("#94A3B8",{flex:1})} onClick={()=>setEditId(null)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title="Add New Shift" onClose={()=>setShowAdd(false)}>
          <label style={LBL}>Label</label>
          <input style={{ ...I(), marginBottom:12 }} value={newShift.label} onChange={e=>setNewShift(p=>({...p,label:e.target.value}))}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <div><label style={LBL}>Start</label><input type="time" style={I()} value={newShift.start} onChange={e=>setNewShift(p=>({...p,start:e.target.value}))}/></div>
            <div><label style={LBL}>End</label><input type="time" style={I()} value={newShift.end} onChange={e=>setNewShift(p=>({...p,end:e.target.value}))}/></div>
          </div>
          <label style={LBL}>Color</label>
          <input type="color" style={{ ...I(), height:40, marginBottom:16, padding:4 }} value={newShift.color} onChange={e=>setNewShift(p=>({...p,color:e.target.value}))}/>
          <button style={PBT("#2563EB",{width:"100%"})} onClick={addShift}>Add Shift</button>
        </Modal>
      )}
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function ReportsPage({ employees, schedule, shifts, attendance, performance, heatmap, kg, queueLog, session, canEdit, myShiftFilter=false }) {
  const [reportType, setReportType]   = useState("ops");
  const [date, setDate]               = useState(todayStr());
  const [month, setMonth]             = useState(new Date().toISOString().slice(0,7));
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [copied, setCopied]           = useState(false);

  // ── PDF / Print export ───────────────────────────────────────────────────────
  function printReport() {
    const content = reportType==="scorecard" ? buildScorecard() :
                    reportType==="monthly"   ? buildMonthlyReport() : buildOpsReport();
    const title   = reportType==="scorecard" ? "Scorecard Report" :
                    reportType==="monthly"   ? "Monthly Report"   : "Operations Report";
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) { alert("Allow popups in your browser to open the print window."); return; }
    win.document.write(`<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>CS Operations — ${title}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: "Segoe UI", Arial, sans-serif; font-size: 13px;
           color: #111; background: #fff; padding: 32px; line-height: 1.6; }
    h1 { font-size: 20px; font-weight: 800; color: #0F2744; margin-bottom: 4px; }
    .meta { color: #6B7280; font-size: 11px; margin-bottom: 24px;
            border-bottom: 2px solid #E5E7EB; padding-bottom: 12px; }
    pre { white-space: pre-wrap; word-wrap: break-word; font-family: "Courier New", monospace;
          font-size: 12px; line-height: 1.7; }
    @media print {
      body { padding: 16px; }
      @page { margin: 1.5cm; size: A4; }
    }
  </style>
</head>
<body>
  <h1>🎯 CS Operations — ${title}</h1>
  <div class="meta">Generated: ${new Date().toLocaleString("en-GB",{timeZone:"Asia/Riyadh",hour12:false})}</div>
  <pre>${content.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre>
  <script>
    window.onload = function() {
      window.print();
      setTimeout(()=>window.close(), 1000);
    };
  </script>
</body>
</html>`);
    win.document.close();
  }

  // ── Ops Report state ────────────────────────────────────────────────────────
  const [opsBaseTime,   setOpsBaseTime]   = useState("17:00");
  const [opsUpdTime,    setOpsUpdTime]    = useState("20:00");
  const [opsStatus,     setOpsStatus]     = useState("🔴 CRITICAL BUT HIGHLY ACTIVE");
  const [opsStatusNote, setOpsStatusNote] = useState("Managing aggressive inflow vs. high resolution rate");
  const [opsNarrative,  setOpsNarrative]  = useState("");
  const [opsExecNote,   setOpsExecNote]   = useState("");

  // KSA queues
  const [ksaOBBase,    setKsaOBBase]    = useState("");
  const [ksaOBIn,      setKsaOBIn]      = useState("");
  const [ksaOBCurr,    setKsaOBCurr]    = useState("");
  const [ksaSomeBase,  setKsaSomeBase]  = useState("");
  const [ksaSomeIn,    setKsaSomeIn]    = useState("");
  const [ksaSomeCurr,  setKsaSomeCurr]  = useState("");
  const [ksaOsloBase,  setKsaOsloBase]  = useState("");
  const [ksaOsloIn,    setKsaOsloIn]    = useState("");
  const [ksaOsloCurr,  setKsaOsloCurr]  = useState("");

  // GCC queues
  const [gccT2Base,    setGccT2Base]    = useState("");
  const [gccT2In,      setGccT2In]      = useState("");
  const [gccT2Curr,    setGccT2Curr]    = useState("");
  const [gccSomeBase,  setGccSomeBase]  = useState("");
  const [gccSomeIn,    setGccSomeIn]    = useState("");
  const [gccSomeCurr,  setGccSomeCurr]  = useState("");

  // Workforce allocation rows
  const [allocRows, setAllocRows] = useState([
    { team:"KSA Outbound (OT) Core Team", agents:"" },
    { team:"KSA Critical & Complex Cases", agents:"" },
    { team:"GCC Regional Coverage", agents:"" },
    { team:"Specialized Channels", agents:"" },
  ]);

  function updateAllocRow(i, field, val) {
    setAllocRows(prev => prev.map((r,ri) => ri===i ? {...r,[field]:val} : r));
  }
  function addAllocRow() { setAllocRows(prev=>[...prev,{team:"",agents:""}]); }
  function removeAllocRow(i) { setAllocRows(prev=>prev.filter((_,ri)=>ri!==i)); }

  // helpers
  function n(v) { return Number(v)||0; }
  function resolved(base,inflow,curr) { return n(base)+n(inflow)-n(curr); }
  function net(base,curr) { return n(curr)-n(base); }
  function netStr(v) { return v>0?`Net Increase of ${v} cases`:v<0?`Net Decrease of ${Math.abs(v)} cases`:"No Change"; }

  // Duration label
  function durationLabel() {
    if (!opsBaseTime||!opsUpdTime) return "";
    let d = toMin(opsUpdTime)-toMin(opsBaseTime);
    if(d<0) d+=1440;
    const h=Math.floor(d/60), m=d%60;
    return h>0 ? `${h} hour${h>1?"s":""}${m>0?` ${m} min`:""}` : `${m} min`;
  }

  // Toggle shift in filter
  function toggleShift(sid) {
    setSelectedShifts(prev => prev.includes(sid) ? prev.filter(x=>x!==sid) : [...prev, sid]);
  }

  // Filter employees by selected shifts for a given day
  function getShiftEmps(dayName) {
    return employees.filter(emp => {
      const v = (schedule[emp.id]||{})[dayName];
      if (!v || v==="OFF" || v==="LEAVE" || v==="PH") return false;
      if (selectedShifts.length === 0) return true;
      return selectedShifts.includes(v);
    });
  }

  function getMonthStats(y, m) {
    const dates = monthDates(y, m);
    const stats = {};
    employees.forEach(emp => {
      stats[emp.id] = {
        abs:0, lateCount:0, lateMin:0, earlyCount:0,
        closed:0, escalations:0, workDays:0,
        totalWorkMin:0,       // actual minutes worked (checkIn→checkOut)
        breakViolationMin:0,  // minutes over scheduled break
        extraBreakMin:0,      // extra unscheduled break minutes
      };
    });
    dates.forEach(d => {
      const dayName = DAYS[new Date(d+"T12:00:00").getDay()];
      employees.forEach(emp => {
        const v = (schedule[emp.id]||{})[dayName];
        if (!v || v==="OFF" || v==="LEAVE" || v==="PH") return;
        if (selectedShifts.length > 0 && !selectedShifts.includes(v)) return;
        const att  = ((attendance[d]||{})[emp.id]) || { status:"Present" };
        const perf = ((performance[d]||{})[emp.id]) || {};
        const s = stats[emp.id];
        s.workDays++;
        if (isAbsent(att.status)) s.abs++;
        if (att.status==="Late" || (att.lateMin||0)>=7) { s.lateCount++; s.lateMin += att.lateMin||0; }
        if (att.status==="Early Leave") s.earlyCount++;
        s.closed       += perf.closed||0;
        s.escalations  += perf.escalations||0;
        if (att.workDuration) s.totalWorkMin += Number(att.workDuration)||0;
      });
    });
    return stats;
  }

  // New scorecard: Attendance 40% · Work Hours 35% · Punctuality 25%
  function getScorecard(stats) {
    return employees.map(emp => {
      const s = stats[emp.id];
      if (!s || s.workDays === 0) return null;
      const attRate    = Math.round(((s.workDays - s.abs) / s.workDays) * 100);
      const avgWorkH   = s.workDays > 0 ? Math.round(s.totalWorkMin / s.workDays) : 0; // avg minutes per day
      // Assume 8h (480min) shift standard; score = (avgWorkH/480)*100 capped 100
      const workScore  = Math.min(100, Math.round(avgWorkH / 480 * 100));
      const punctScore = s.lateCount > 0 ? Math.max(0, 100 - s.lateCount * 10) : 100;
      const score      = Math.round(attRate * 0.40 + workScore * 0.35 + punctScore * 0.25);
      const avgWorkHFmt = `${Math.floor(avgWorkH/60)}h ${avgWorkH%60}m`;
      return { emp, s, attRate, workScore, punctScore, score, avgWorkHFmt };
    }).filter(Boolean);
  }

  function buildOpsReport() {
    const dayName = DAYS[new Date(date+"T12:00:00").getDay()];
    // myShiftFilter: show only my shift's employees
  const myShiftId = null; // unified via myShiftOnly in parent
  const dayEmps = employees.filter(emp => {
    const v=(schedule[emp.id]||{})[dayName];
    if (!v || v==="OFF" || v==="LEAVE" || v==="PH") return false;
    return true;
  });
    const attMap  = attendance[date]||{};
    const present = dayEmps.filter(e=>isPresent(attMap[e.id]?.status||"Present")).length;
    const absent  = dayEmps.filter(e=>attMap[e.id]?.status==="Absent");
    const late    = dayEmps.filter(e=>attMap[e.id]?.status==="Late");
    const totalClosed = dayEmps.reduce((s,e)=>s+((performance[date]||{})[e.id]?.closed||0),0);
    const dur = durationLabel();

    const ksaOBRes   = resolved(ksaOBBase, ksaOBIn, ksaOBCurr);
    const ksaSomeRes = resolved(ksaSomeBase, ksaSomeIn, ksaSomeCurr);
    const ksaOsloRes = resolved(ksaOsloBase, ksaOsloIn, ksaOsloCurr);
    const gccT2Res   = resolved(gccT2Base, gccT2In, gccT2Curr);
    const gccSomeRes = resolved(gccSomeBase, gccSomeIn, gccSomeCurr);

    const ksaOBNet   = net(ksaOBBase, ksaOBCurr);
    const ksaSomeNet = net(ksaSomeBase, ksaSomeCurr);
    const ksaOsloNet = net(ksaOsloBase, ksaOsloCurr);
    const gccT2Net   = net(gccT2Base, gccT2Curr);
    const gccSomeNet = net(gccSomeBase, gccSomeCurr);

    const ksaCritical = n(ksaOBCurr)>400 || n(ksaOsloCurr)>10;
    const gccStatus   = gccT2Net<=0 ? "🟢 GCC Queue [STABLE & IMPROVING]" : "🟡 GCC Queue [MONITOR]";

    return `Date: ${new Date(date+"T12:00:00").toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Riyadh"})}
Time of Update: ${opsUpdTime} (Comparative Analysis: ${opsBaseTime} vs ${opsUpdTime})
Subject: Operations Performance, Productivity Analysis & Shift Allocation
Overall Operations Status: ${opsStatus}${opsStatusNote ? ` (${opsStatusNote})` : ""}

${"═".repeat(65)}
1. Productivity & Deep Dive Analysis (${opsBaseTime} - ${opsUpdTime})
${"═".repeat(65)}
${dur ? `Over the past ${dur}, the operations floor experienced the following:` : ""}
${opsNarrative ? `\n${opsNarrative}\n` : ""}
${n(ksaOBBase)>0 ? `• ${ksaOBNet>0?"🔴":"🟢"} KSA Queue - Outbound (Productivity Breakdown):
  Baseline Volume (${opsBaseTime}): ${ksaOBBase} cases
  New Incoming Cases (${opsBaseTime} - ${opsUpdTime}): +${ksaOBIn} cases${n(ksaOBIn)>150?" (Aggressive Inflow)":n(ksaOBIn)>80?" (High Inflow)":""}
  Total Potential Workload: ${n(ksaOBBase)+n(ksaOBIn)} cases
  Current Backlog (${opsUpdTime}): ${ksaOBCurr} cases
  ✅ Actual Cases Resolved/Closed: ${ksaOBRes} Cases
` : ""}${n(gccT2Base)>0 ? `• ${gccT2Net<=0?"🟢":"🟡"} GCC Queue - Tier 2 (Productivity Breakdown):
  Baseline Volume (${opsBaseTime}): ${gccT2Base} cases
  New Incoming Cases (${opsBaseTime} - ${opsUpdTime}): +${gccT2In} cases
  Total Potential Workload: ${n(gccT2Base)+n(gccT2In)} cases
  Current Backlog (${opsUpdTime}): ${gccT2Curr} cases
  ✅ Actual Cases Resolved/Closed: ${gccT2Res} Cases${gccT2Net<0?" (Successfully reducing the net backlog)":""}
` : ""}
📊 Total Cases Closed (All Queues): ${totalClosed > 0 ? totalClosed : ksaOBRes+ksaSomeRes+ksaOsloRes+gccT2Res+gccSomeRes} cases

${"═".repeat(65)}
2. Live Metrics & Queue Status (Net Variance)
${"═".repeat(65)}
${n(ksaOBCurr)+n(ksaSomeCurr)+n(ksaOsloCurr)>0 ? `${ksaCritical?"🔴":"🟡"} KSA Queue [${ksaCritical?"CRITICAL":"MONITOR"}]
${n(ksaOBCurr)>0?`• Outbound: ${ksaOBCurr} (${netStr(ksaOBNet)})`:""}
${n(ksaSomeCurr)>0?`• "Some" Cases: ${ksaSomeCurr} (${netStr(ksaSomeNet)})`:""}
${n(ksaOsloCurr)>0?`• OSLO: ${ksaOsloCurr} (${netStr(ksaOsloNet)})`:""}
` : ""}${n(gccT2Curr)+n(gccSomeCurr)>0 ? `${gccStatus}
${n(gccT2Curr)>0?`• Tier 2: ${gccT2Curr} (${netStr(gccT2Net)})`:""}
${n(gccSomeCurr)>0?`• "Some" Cases: ${gccSomeCurr} (${netStr(gccSomeNet)})`:""}
` : ""}
${"═".repeat(65)}
3. Attendance
${"═".repeat(65)}
Scheduled: ${dayEmps.length} | Present: ${present} | Absent: ${absent.length} | Late: ${late.length}
${absent.length>0?`Absent: ${absent.map(e=>e.name).join(", ")}`:""}
${late.length>0?`Late: ${late.map(e=>`${e.name} (${attMap[e.id]?.lateMin||0}m)`).join(", ")}`:""}

${"═".repeat(65)}
4. Strategic Workforce Allocation (Starting ${opsUpdTime} Shift)
${"═".repeat(65)}
${allocRows.filter(r=>r.team&&r.agents).map(r=>`• ${r.team}:\n${r.agents.split("\n").map(a=>a.trim()).filter(Boolean).map(a=>`  - ${a}`).join("\n")}`).join("\n\n")}
${opsExecNote ? `\nExecutive Note: ${opsExecNote}` : ""}

${"═".repeat(65)}
Generated: ${new Date().toLocaleString("en-GB",{timeZone:"Asia/Riyadh",hour12:false})}`;
  }

  function buildMonthlyReport() {
    const [y,m] = month.split("-").map(Number);
    const stats    = getMonthStats(y, m-1);
    const scorecard = getScorecard(stats).sort((a,b)=>b.score-a.score);
    const monthStr  = new Date(y,m-1,1).toLocaleString("default",{month:"long",year:"numeric"});
    const shiftLabel = selectedShifts.length>0
      ? shifts.filter(s=>selectedShifts.includes(s.id)).map(s=>s.label).join(", ")
      : "All Shifts";
    const totalClosed   = Object.values(stats).reduce((s,v)=>s+v.closed,0);
    const totalAbsences = Object.values(stats).reduce((s,v)=>s+v.abs,0);
    const totalLateMin  = Object.values(stats).reduce((s,v)=>s+v.lateMin,0);
    const top3   = scorecard.slice(0,3);
    const bottom = scorecard.filter(s=>s.score<60);

    return `📅 MONTHLY OPERATIONS REPORT -- ${monthStr} [${shiftLabel}]
${"=".repeat(60)}

📊 EXECUTIVE SUMMARY
─────────────────────
Total Closed: ${totalClosed}
Total Absences: ${totalAbsences}
Total Late Time: ${totalLateMin} minutes

🏆 TOP PERFORMERS
──────────────────
${top3.map((s,i)=>`${["🥇","🥈","🥉"][i]} ${s.emp.name} -- Score: ${s.score} | Att: ${s.attRate}% | Avg Work: ${s.avgWorkHFmt}`).join("\n")}

⚠️ NEEDS ATTENTION
────────────────────
${bottom.length>0 ? bottom.map(s=>`• ${s.emp.name} -- Score: ${s.score} | Abs: ${s.s.abs} | Late: ${s.s.lateCount}x`).join("\n") : "All employees performing well"}

📋 FULL ATTENDANCE AUDIT
─────────────────────────
${employees.map(e=>{const s=stats[e.id]; return `${e.name}: WorkDays=${s.workDays} | Abs=${s.abs} | Late=${s.lateCount}x (${s.lateMin}m) | AvgWork=${s.workDays>0?Math.floor(s.totalWorkMin/s.workDays/60)+"h":"--"}`;}).join("\n")}

🎯 BALANCED SCORECARD
──────────────────────
${scorecard.map(s=>`${s.emp.name}: Att=${s.attRate}% | WorkScore=${s.workScore} | Punct=${s.punctScore} | SCORE=${s.score}/100 ${s.score>=80?"🟢":s.score>=60?"🟡":"🔴"}`).join("\n")}

Generated: ${new Date().toLocaleString("en-GB",{timeZone:"Asia/Riyadh",hour12:false})}`;
  }

  function getReportText() {
    if (reportType==="ops")     return buildOpsReport();
    if (reportType==="monthly") return buildMonthlyReport();
    return "";
  }

  function copyReport() {
    navigator.clipboard.writeText(getReportText()).then(()=>{
      setCopied(true); setTimeout(()=>setCopied(false),2000);
    });
  }

  function shareWhatsApp() {
    const text = getReportText();
    if (!text) { alert("No report to share. Select a report type first."); return; }
    const encoded = encodeURIComponent(text.slice(0,1800)); // WhatsApp limit
    window.open("https://wa.me/?text="+encoded, "_blank");
  }

  const [y,m] = month.split("-").map(Number);
  const mStats    = getMonthStats(y, m-1);
  const scoreData = getScorecard(mStats).sort((a,b)=>b.score-a.score);

  return (
    <div>
      {/* AI Report Assistant */}
      <AIReportAssistant
        employees={employees}
        schedule={schedule}
        attendance={attendance}
        performance={performance}
        queueLog={queueLog}
        shifts={shifts}
      />

      <div style={SBR({ flexWrap:"wrap" })}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>📑 Reports</span>
        <div style={{ display:"flex", gap:6 }}>
          {[["ops","📊 Ops Report"],["monthly","📅 Monthly"],["scorecard","🎯 Scorecard"],["trend","📈 Trends"]].map(([k,l])=>(
            <button key={k} onClick={()=>setReportType(k)}
              style={{ border:`2px solid #2563EB`, borderRadius:20, padding:"5px 14px", fontSize:12, cursor:"pointer", fontWeight:600,
                background:reportType===k?"#2563EB":"transparent", color:reportType===k?"#fff":"#2563EB" }}>{l}</button>
          ))}
        </div>
        {reportType==="ops"     && <input type="date"  value={date}  onChange={e=>setDate(e.target.value)}  style={{ ...I(), width:150 }}/>}
        {(reportType==="monthly"||reportType==="scorecard"||reportType==="trend") && <input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{ ...I(), width:150 }}/>}
        {reportType!=="scorecard" && (
          <button style={PBT(copied?"#10B981":"#2563EB")} onClick={copyReport}>{copied?"✅ Copied!":"📋 Copy Report"}</button>
        )}
        <button onClick={printReport}
          style={{ background:"#7C3AED", color:"#fff", border:"none", borderRadius:8,
            padding:"8px 14px", fontSize:13, cursor:"pointer", fontWeight:600,
            display:"flex", alignItems:"center", gap:5 }}>
          🖨️ PDF / Print
        </button>
        {(reportType==="ops"||reportType==="monthly") && (
          <button onClick={shareWhatsApp}
            style={{ background:"#25D366", color:"#fff", border:"none", borderRadius:8,
              padding:"8px 14px", fontSize:13, cursor:"pointer", fontWeight:600,
              display:"flex", alignItems:"center", gap:5 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.934 1.395 5.61L0 24l6.555-1.371A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.385l-.36-.214-3.732.98.997-3.648-.235-.374A9.818 9.818 0 1112 21.818z"/>
            </svg>
            WhatsApp
          </button>
        )}
      </div>

      {/* ── TREND REPORT ── */}
      {reportType==="trend" && (() => {
        const [ty, tm] = month.split("-").map(Number);
        // Compare current month vs previous 3 months
        const months = Array.from({length:4},(_,i)=>{
          const d = new Date(ty, tm-1-i, 1);
          return { y:d.getFullYear(), m:d.getMonth(), label:d.toLocaleDateString("en-US",{month:"short",year:"numeric"}) };
        }).reverse();

        const monthData = months.map(({y,m,label})=>{
          const stats = getMonthStats(y,m);
          const totClosed = Object.values(stats).reduce((s,st)=>s+st.closed,0);
          const totEsc    = Object.values(stats).reduce((s,st)=>s+st.escalations,0);
          const totAbs    = Object.values(stats).reduce((s,st)=>s+st.abs,0);
          const totLate   = Object.values(stats).reduce((s,st)=>s+st.lateCount,0);
          const workDays  = monthDates(y,m).length;
          return {label,totClosed,totEsc,totAbs,totLate,workDays};
        });

        const maxClosed = Math.max(...monthData.map(d=>d.totClosed),1);
        const curr = monthData[monthData.length-1];
        const prev = monthData[monthData.length-2];
        const delta = (v,p) => {
          if (!p) return null;
          const d = v-p;
          const pct = p > 0 ? Math.round((d/p)*100) : 0;
          return { d, pct, up: d > 0 };
        };

        return (
          <div>
            {/* Trend summary cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10, marginBottom:20 }}>
              {[
                { label:"Total Closed", cur:curr.totClosed, dlt:delta(curr.totClosed,prev?.totClosed), color:"#10B981" },
                { label:"Escalations",       cur:curr.totEsc,    dlt:delta(curr.totEsc,prev?.totEsc),    color:"#F59E0B" },
                { label:"Absences",        cur:curr.totAbs,    dlt:delta(curr.totAbs,prev?.totAbs),    color:"#EF4444" },
                { label:"Late Arrivals",       cur:curr.totLate,   dlt:delta(curr.totLate,prev?.totLate),  color:"#8B5CF6" },
              ].map(({label,cur,dlt,color})=>(
                <div key={label} style={{ ...CRD({padding:"14px 16px"}), borderTop:`3px solid ${color}` }}>
                  <div style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>{label}</div>
                  <div style={{ fontSize:26, fontWeight:800, color, marginTop:4 }}>{cur}</div>
                  {dlt && (
                    <div style={{ fontSize:11, fontWeight:700, marginTop:4,
                      color: color==="EF4444"||color==="#EF4444"||color==="#8B5CF6"
                        ? (dlt.up?"#EF4444":"#10B981")
                        : (dlt.up?"#10B981":"#EF4444") }}>
                      {dlt.up?"▲":"▼"} {Math.abs(dlt.pct)}% vs last month
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bar chart comparison */}
            <div style={{ ...CRD(), marginBottom:14 }}>
              <div style={{ fontWeight:700, color:_theme.text, marginBottom:14, fontSize:13 }}>
                📈 Closure Comparison — Last 4 months
              </div>
              <div style={{ display:"flex", gap:12, alignItems:"flex-end", height:120 }}>
                {monthData.map((d,i)=>{
                  const h = Math.round((d.totClosed/maxClosed)*100);
                  const isLast = i===monthData.length-1;
                  return (
                    <div key={d.label} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <div style={{ fontSize:11, fontWeight:800, color:isLast?"#10B981":_theme.textSub }}>{d.totClosed}</div>
                      <div style={{ width:"100%", height:Math.max(h,4), background:isLast?"#10B981":"#10B98150",
                        borderRadius:"4px 4px 0 0", transition:"height 0.3s",
                        border:isLast?"2px solid #10B981":"none" }}/>
                      <div style={{ fontSize:10, color:_theme.textMuted, textAlign:"center" }}>{d.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed table */}
            <div style={{ ...CRD({padding:0}), overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
                    {["Month","Closed","Escalations","Absences","Late Arrivals"].map(h=>(
                      <th key={h} style={{ padding:"10px 12px", textAlign:"right", fontWeight:700,
                        color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthData.map((d,ri)=>{
                    const isLast = ri===monthData.length-1;
                    return (
                      <tr key={d.label} style={{ background: isLast?_theme.primary+"10":ri%2===0?_theme.card:_theme.surface }}>
                        <td style={{ padding:"9px 12px", fontWeight:isLast?800:600, color:isLast?_theme.primary:_theme.text }}>{d.label}</td>
                        <td style={{ padding:"9px 12px", color:"#10B981", fontWeight:700 }}>{d.totClosed}</td>
                        <td style={{ padding:"9px 12px", color:d.totEsc>0?"#F59E0B":_theme.textMuted, fontWeight:600 }}>{d.totEsc||"—"}</td>
                        <td style={{ padding:"9px 12px", color:d.totAbs>0?"#EF4444":_theme.textMuted, fontWeight:600 }}>{d.totAbs||"—"}</td>
                        <td style={{ padding:"9px 12px", color:d.totLate>0?"#8B5CF6":_theme.textMuted, fontWeight:600 }}>{d.totLate||"—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* ── OPS REPORT BUILDER ── */}
      {reportType==="ops" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

          {/* Left: Header + Queue Data */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

            {/* Report Header */}
            <div style={CRD()}>
              <div style={{ fontWeight:700, color:_theme.text, marginBottom:12, fontSize:14 }}>📋 Report Header</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                <div><label style={LBL}>Baseline Time</label>
                  <input type="time" value={opsBaseTime} onChange={e=>setOpsBaseTime(e.target.value)} style={I()}/></div>
                <div><label style={LBL}>Update Time</label>
                  <input type="time" value={opsUpdTime} onChange={e=>setOpsUpdTime(e.target.value)} style={I()}/></div>
              </div>
              <label style={LBL}>Overall Status</label>
              <select value={opsStatus} onChange={e=>setOpsStatus(e.target.value)} style={{ ...I(), marginBottom:8 }}>
                <option>🔴 CRITICAL BUT HIGHLY ACTIVE</option>
                <option>🔴 CRITICAL</option>
                <option>🟡 WARNING -- MONITOR CLOSELY</option>
                <option>🟢 STABLE</option>
                <option>🟢 STABLE & IMPROVING</option>
              </select>
              <label style={LBL}>Status Note (bracket)</label>
              <input value={opsStatusNote} onChange={e=>setOpsStatusNote(e.target.value)} style={{ ...I(), marginBottom:8 }} placeholder="e.g. Managing aggressive inflow..."/>
              <label style={LBL}>Narrative / Context (optional)</label>
              <textarea value={opsNarrative} onChange={e=>setOpsNarrative(e.target.value)} rows={2}
                style={{ ...I(), resize:"vertical" }} placeholder="Over the past X hours, the operations floor..."/>
            </div>

            {/* KSA Queue */}
            <div style={CRD()}>
              <div style={{ fontWeight:700, color:"#2563EB", marginBottom:12, fontSize:14 }}>🇸🇦 KSA Queue Data</div>
              {[
                ["Outbound (OB)", ksaOBBase, setKsaOBBase, ksaOBIn, setKsaOBIn, ksaOBCurr, setKsaOBCurr],
                ['"Some" Cases',  ksaSomeBase, setKsaSomeBase, ksaSomeIn, setKsaSomeIn, ksaSomeCurr, setKsaSomeCurr],
                ["OSLO",          ksaOsloBase, setKsaOsloBase, ksaOsloIn, setKsaOsloIn, ksaOsloCurr, setKsaOsloCurr],
              ].map(([label, base, setBase, inflow, setInflow, curr, setCurr]) => (
                <div key={label} style={{ marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:_theme.textSub, marginBottom:4 }}>{label}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:6, alignItems:"center" }}>
                    <div><label style={{ ...LBL, fontSize:10 }}>Baseline</label>
                      <input type="number" min="0" value={base} onChange={e=>setBase(e.target.value)} style={I()} placeholder="0"/></div>
                    <div><label style={{ ...LBL, fontSize:10 }}>Inflow +</label>
                      <input type="number" min="0" value={inflow} onChange={e=>setInflow(e.target.value)} style={I()} placeholder="0"/></div>
                    <div><label style={{ ...LBL, fontSize:10 }}>Current</label>
                      <input type="number" min="0" value={curr} onChange={e=>setCurr(e.target.value)} style={I()} placeholder="0"/></div>
                    <div style={{ paddingTop:18, fontWeight:800, fontSize:13,
                      color: resolved(base,inflow,curr)>0?"#10B981":"#EF4444" }}>
                      {n(base)||n(inflow)||n(curr) ? `✅ ${resolved(base,inflow,curr)}` : "--"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* GCC Queue */}
            <div style={CRD()}>
              <div style={{ fontWeight:700, color:"#10B981", marginBottom:12, fontSize:14 }}>🌍 GCC Queue Data</div>
              {[
                ["Tier 2",        gccT2Base, setGccT2Base, gccT2In, setGccT2In, gccT2Curr, setGccT2Curr],
                ['"Some" Cases',  gccSomeBase, setGccSomeBase, gccSomeIn, setGccSomeIn, gccSomeCurr, setGccSomeCurr],
              ].map(([label, base, setBase, inflow, setInflow, curr, setCurr]) => (
                <div key={label} style={{ marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:_theme.textSub, marginBottom:4 }}>{label}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:6, alignItems:"center" }}>
                    <div><label style={{ ...LBL, fontSize:10 }}>Baseline</label>
                      <input type="number" min="0" value={base} onChange={e=>setBase(e.target.value)} style={I()} placeholder="0"/></div>
                    <div><label style={{ ...LBL, fontSize:10 }}>Inflow +</label>
                      <input type="number" min="0" value={inflow} onChange={e=>setInflow(e.target.value)} style={I()} placeholder="0"/></div>
                    <div><label style={{ ...LBL, fontSize:10 }}>Current</label>
                      <input type="number" min="0" value={curr} onChange={e=>setCurr(e.target.value)} style={I()} placeholder="0"/></div>
                    <div style={{ paddingTop:18, fontWeight:800, fontSize:13,
                      color: resolved(base,inflow,curr)>0?"#10B981":"#EF4444" }}>
                      {n(base)||n(inflow)||n(curr) ? `✅ ${resolved(base,inflow,curr)}` : "--"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Workforce Allocation + Executive Note */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={CRD()}>
              <div style={{ fontWeight:700, color:_theme.text, marginBottom:12, fontSize:14 }}>👥 Workforce Allocation</div>
              <div style={{ fontSize:12, color:_theme.textMuted, marginBottom:10 }}>
                Enter team name and employees (one per line)
              </div>
              {allocRows.map((row, i) => (
                <div key={i} style={{ marginBottom:12, background:_theme.isDark?"#0D1117":"#F8FAFC", borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                    <input value={row.team} onChange={e=>updateAllocRow(i,"team",e.target.value)}
                      style={{ ...I({ flex:1 })}} placeholder="Team / Task name"/>
                    <button onClick={()=>removeAllocRow(i)}
                      style={{ background:"none", border:"1px solid #FCA5A5", color:"#EF4444",
                        borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:12, flexShrink:0 }}>✕</button>
                  </div>
                  <textarea value={row.agents} onChange={e=>updateAllocRow(i,"agents",e.target.value)}
                    rows={3} style={{ ...I(), resize:"vertical", fontSize:12 }}
                    placeholder={"Employee name (+task)\nEmployee name\nEmployee name"}/>
                </div>
              ))}
              <button onClick={addAllocRow} style={PBT("#10B981",{width:"100%",padding:"7px",fontSize:12})}>+ Add Team</button>
            </div>

            <div style={CRD()}>
              <div style={{ fontWeight:700, color:_theme.text, marginBottom:8, fontSize:14 }}>📝 Executive Note</div>
              <textarea value={opsExecNote} onChange={e=>setOpsExecNote(e.target.value)} rows={4}
                style={{ ...I(), resize:"vertical" }}
                placeholder="The primary focus for the shift will be..."/>
            </div>

            {/* Live preview summary */}
            <div style={{ ...CRD(), background:"#0F172A", color:"#E2E8F0" }}>
              <div style={{ fontWeight:700, fontSize:12, color:_theme.textMuted, marginBottom:8 }}>📊 Quick Summary</div>
              <div style={{ fontSize:12, lineHeight:1.8 }}>
                {n(ksaOBBase)>0 && <div>🔴 OB: {ksaOBBase} → {ksaOBCurr} | <span style={{color:"#10B981"}}>✅ {resolved(ksaOBBase,ksaOBIn,ksaOBCurr)} resolved</span></div>}
                {n(ksaSomeBase)>0 && <div>🔴 SOME: {ksaSomeBase} → {ksaSomeCurr} | <span style={{color:"#10B981"}}>✅ {resolved(ksaSomeBase,ksaSomeIn,ksaSomeCurr)} resolved</span></div>}
                {n(ksaOsloBase)>0 && <div>🔴 OSLO: {ksaOsloBase} → {ksaOsloCurr} | <span style={{color:"#10B981"}}>✅ {resolved(ksaOsloBase,ksaOsloIn,ksaOsloCurr)} resolved</span></div>}
                {n(gccT2Base)>0 && <div>🟢 GCC T2: {gccT2Base} → {gccT2Curr} | <span style={{color:"#10B981"}}>✅ {resolved(gccT2Base,gccT2In,gccT2Curr)} resolved</span></div>}
                {n(gccSomeBase)>0 && <div>🟢 GCC SOME: {gccSomeBase} → {gccSomeCurr} | <span style={{color:"#10B981"}}>✅ {resolved(gccSomeBase,gccSomeIn,gccSomeCurr)} resolved</span></div>}
                <div style={{marginTop:8, color:"#F59E0B", fontWeight:700}}>
                  Total Resolved: {resolved(ksaOBBase,ksaOBIn,ksaOBCurr)+resolved(ksaSomeBase,ksaSomeIn,ksaSomeCurr)+resolved(ksaOsloBase,ksaOsloIn,ksaOsloCurr)+resolved(gccT2Base,gccT2In,gccT2Curr)+resolved(gccSomeBase,gccSomeIn,gccSomeCurr)} cases
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly shift filter */}
      {(reportType==="monthly"||reportType==="scorecard") && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14, alignItems:"center" }}>
          <span style={{ fontSize:12, color:_theme.textMuted, fontWeight:600 }}>Filter by Shift:</span>
          <button onClick={()=>setSelectedShifts([])}
            style={{ border:`2px solid ${selectedShifts.length===0?"#0F2744":"#CBD5E1"}`, borderRadius:20,
              padding:"3px 12px", fontSize:11, cursor:"pointer", fontWeight:600,
              background: selectedShifts.length===0?"#0F2744":"transparent",
              color: selectedShifts.length===0?"#fff":"#64748B" }}>All</button>
          {shifts.map(s=>(
            <button key={s.id} onClick={()=>toggleShift(s.id)}
              style={{ border:`2px solid ${selectedShifts.includes(s.id)?s.color:"#CBD5E1"}`, borderRadius:20,
                padding:"3px 12px", fontSize:11, cursor:"pointer", fontWeight:600,
                background: selectedShifts.includes(s.id)?s.color+"18":"transparent",
                color: selectedShifts.includes(s.id)?s.color:_theme.textMuted }}>
              {s.label} {s.start}
            </button>
          ))}
        </div>
      )}

      {/* Scorecard Visual Table */}
      {reportType==="scorecard" && (
        <div>
          <div style={{ ...CRD(), overflowX:"auto", marginBottom:16 }}>
            <div style={{ fontWeight:700, color:_theme.text, marginBottom:4 }}>🎯 Balanced Scorecard</div>
            <div style={{ fontSize:12, color:_theme.textMuted, marginBottom:12 }}>
              Weights: Attendance 40% · Work Hours 35% · Punctuality 25%
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
                  {["Rank","Employee","Attendance %","Avg Work Hours","Punctuality","Score"].map(h=>(
                    <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoreData.map((s,ri) => {
                  const scoreColor = s.score>=80?"#10B981":s.score>=60?"#F59E0B":"#EF4444";
                  return (
                    <tr key={s.emp.id} style={{ background: ri%2===0?_theme.card:_theme.surface }}>
                      <td style={{ padding:"10px 12px", fontSize:16, textAlign:"center" }}>{["🥇","🥈","🥉"][ri]||ri+1}</td>
                      <td style={{ padding:"10px 12px", fontWeight:700 }}>
                        {s.emp.name}
                        <div style={{ fontSize:11, color:_theme.textMuted }}>{s.emp.role}</div>
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ background:"#E2E8F0", borderRadius:10, height:8, width:80, overflow:"hidden" }}>
                            <div style={{ width:s.attRate+"%", height:"100%", background:s.attRate>=80?"#10B981":"#F59E0B", borderRadius:10 }}/>
                          </div>
                          <span style={{ fontWeight:600 }}>{s.attRate}%</span>
                        </div>
                        <div style={{ fontSize:11, color:_theme.textMuted }}>Abs: {s.s.abs} · Late: {s.s.lateCount}x</div>
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ fontWeight:700, color: s.workScore>=80?"#10B981":s.workScore>=60?"#F59E0B":"#EF4444" }}>
                          {s.avgWorkHFmt}
                        </div>
                        <div style={{ fontSize:11, color:_theme.textMuted }}>Score: {s.workScore}</div>
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ fontWeight:700, color: s.punctScore>=90?"#10B981":s.punctScore>=70?"#F59E0B":"#EF4444" }}>
                          {s.punctScore}/100
                        </div>
                        <div style={{ fontSize:11, color:_theme.textMuted }}>Late {s.s.lateCount}x · {s.s.lateMin}m total</div>
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <DonutChart value={s.score} max={100} color={scoreColor} size={52}/>
                          <span style={{ background:scoreColor+"20", color:scoreColor, border:`1.5px solid ${scoreColor}`,
                            borderRadius:20, padding:"4px 14px", fontWeight:800, fontSize:15 }}>{s.score}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {scoreData.length===0 && (
                  <tr><td colSpan={6} style={{ padding:24, textAlign:"center", color:_theme.textMuted }}>No data for selected period/shifts</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Strategy Guide */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
            {[
              { icon:"📅", title:"Daily Report",    desc:"Staffing, attendance, performance, queue status, heat map, SME notes." },
              { icon:"📆", title:"Weekly Report",   desc:"Trend analysis, attendance summary, top performers, recurring issues." },
              { icon:"📊", title:"Monthly Report",  desc:"Executive summary, full audit, balanced scorecard, top performers." },
              { icon:"🎯", title:"Quarterly Report", desc:"Strategic review, team development, process improvements." }
            ].map(c=>(
              <div key={c.title} style={{ ...CRD(), borderTop:"3px solid #2563EB" }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{c.icon}</div>
                <div style={{ fontWeight:700, color:_theme.text, marginBottom:6 }}>{c.title}</div>
                <div style={{ fontSize:12, color:_theme.textMuted }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"linear-gradient(135deg,#FEF3C7,#FDE68A)", border:"2px solid #F59E0B",
            borderRadius:10, padding:"14px 20px", display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:24 }}>✨</span>
            <div>
              <div style={{ fontWeight:800, color:"#92400E", fontSize:14 }}>The Golden Formula</div>
              <div style={{ fontWeight:700, color:"#78350F", fontSize:16 }}>Problem → Action → Result</div>
            </div>
          </div>
        </div>
      )}

      {/* Report Text Preview */}
      {(reportType==="ops"||reportType==="monthly") && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:700, color:_theme.text }}>📄 Report Preview</span>
            <button style={PBT(copied?"#10B981":"#2563EB",{padding:"6px 16px",fontSize:12})}
              onClick={copyReport}>{copied?"✅ Copied!":"📋 Copy Report"}</button>
          </div>
          <div style={{ fontFamily:"monospace", fontSize:12, whiteSpace:"pre-wrap", lineHeight:1.7,
            maxHeight:500, overflow:"auto", background:"#0F172A", borderRadius:10, padding:20, color:"#E2E8F0" }}>
            {getReportText()}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── TASK ASSIGNMENTS PAGE ────────────────────────────────────────────────────
function TaskAssignmentsPage({ employees, setEmployees, auditLog, setAuditLog, session }) {
  const [search, setSearch] = useState("");
  const [filterTask, setFilterTask] = useState("");
  const [editEmp, setEditEmp] = useState(null);
  const [origTasks, setOrigTasks] = useState([]);

  const filtered = employees.filter(e => {
    const ms = e.name.toLowerCase().includes(search.toLowerCase());
    const mt = !filterTask || (e.tasks||[]).includes(filterTask);
    return ms && mt;
  });

  function openEdit(emp) {
    setEditEmp({...emp, tasks:[...(emp.tasks||[])]});
    setOrigTasks([...(emp.tasks||[])]);
  }

  function saveTaskEdit() {
    // Log the change
    const added   = editEmp.tasks.filter(t => !origTasks.includes(t));
    const removed = origTasks.filter(t => !editEmp.tasks.includes(t));
    if (added.length || removed.length) {
      const entry = {
        id: "al"+Date.now(),
        ts: new Date().toISOString(),
        by: session?.name || "Unknown",
        role: session?.role || "",
        action: "Task Assignment",
        target: editEmp.name,
        detail: [
          added.length   ? `Added: ${added.join(", ")}`   : "",
          removed.length ? `Removed: ${removed.join(", ")}` : "",
        ].filter(Boolean).join(" · "),
      };
      setAuditLog(prev => [entry, ...(prev||[])].slice(0, 500));
    }
    setEmployees(prev => prev.map(e => e.id===editEmp.id ? {...e, tasks:editEmp.tasks} : e));
    setEditEmp(null);
  }

  const taskCounts = {};
  TASK_LIST.forEach(t => { taskCounts[t] = employees.filter(e=>(e.tasks||[]).includes(t)).length; });

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>📋 Task Assignments</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} style={{ ...I(), width:200 }} placeholder="🔍 Search employee..."/>
        <select value={filterTask} onChange={e=>setFilterTask(e.target.value)} style={{ ...I(), width:180 }}>
          <option value="">All Tasks</option>
          {TASK_LIST.map(t=><option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Task summary chips */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
        {TASK_LIST.map(t=>(
          <div key={t} onClick={()=>setFilterTask(filterTask===t?"":t)}
            style={{ background: filterTask===t ? taskColor(t) : taskColor(t)+"18",
              border:`1.5px solid ${taskColor(t)}50`, borderRadius:20, padding:"4px 12px",
              cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all 0.15s" }}>
            <span style={{ fontSize:12, fontWeight:700, color: filterTask===t?"#fff":taskColor(t) }}>{t}</span>
            <span style={{ fontSize:11, fontWeight:800, color: filterTask===t?"rgba(255,255,255,0.8)":taskColor(t),
              background: filterTask===t?"rgba(255,255,255,0.2)":taskColor(t)+"30",
              borderRadius:10, padding:"1px 7px" }}>{taskCounts[t]}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...CRD(), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
              {["#","Employee","Role","Assigned Tasks","Assigned By","Actions"].map(h=>(
                <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, ri) => {
              // Find last audit entry for this employee's tasks
              const lastEdit = (auditLog||[]).find(a => a.target===emp.name && a.action==="Task Assignment");
              return (
                <tr key={emp.id} style={{ background: ri%2===0?_theme.card:_theme.surface }}>
                  <td style={{ padding:"10px 12px", color:_theme.textMuted, fontWeight:600 }}>{ri+1}</td>
                  <td style={{ padding:"10px 12px", fontWeight:700, color:_theme.text }}>
                    {emp.name}
                    <div style={{ fontSize:11, color:_theme.textMuted }}>{emp.role}</div>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <span style={{ background:ROLE_COLORS[emp.role]||"#64748B", color:"#fff",
                      borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{emp.role}</span>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    {(emp.tasks||[]).length === 0
                      ? <span style={{ color:_theme.textMuted, fontSize:12 }}>No tasks assigned</span>
                      : <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          {(emp.tasks||[]).map(t=>(
                            <span key={t} style={{ background:taskColor(t), color:"#fff",
                              borderRadius:10, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{t}</span>
                          ))}
                        </div>
                    }
                  </td>
                  <td style={{ padding:"10px 12px", fontSize:12, color:_theme.textMuted }}>
                    {lastEdit
                      ? <div>
                          <div style={{ fontWeight:600, color:_theme.text }}>{lastEdit.by}</div>
                          <div style={{ fontSize:11, color:_theme.textMuted }}>
                            {new Date(lastEdit.ts).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"Asia/Riyadh"})} {new Date(lastEdit.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}
                          </div>
                        </div>
                      : <span style={{ color:"#CBD5E1" }}>--</span>
                    }
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <button onClick={()=>openEdit(emp)}
                      style={{ ...PBT("#2563EB",{ padding:"5px 12px", fontSize:12 }) }}>✏️ Edit Tasks</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editEmp && (
        <Modal title={`Edit Tasks — ${editEmp.name}`} onClose={()=>setEditEmp(null)} width={620}>
          <div style={{ marginBottom:12, fontSize:12, color:_theme.textMuted }}>
            Select all tasks assigned to <strong>{editEmp.name}</strong>. Select "Other" to enter a custom task.
          </div>

          {/* Team assignment — supervisors only */}
          {SUPERVISOR_ROLES.has(session?.role) && (
            <div style={{ marginBottom:14, padding:"10px 14px",
              background:_theme.surface, borderRadius:8, border:`1px solid ${_theme.cardBorder}` }}>
              <div style={{ fontSize:11, fontWeight:700, color:_theme.textMuted, marginBottom:8 }}>
                🏷️ Team Assignment (Supervisors Only)
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {["KFOOD","KEEMRT"].map(t => {
                  const sel = (editEmp.tasks||[]).includes(t);
                  const color = t==="KFOOD" ? "#3FB950" : "#58A6FF";
                  return (
                    <button key={t} onClick={()=>{
                      const cur = editEmp.tasks||[];
                      const next = sel ? cur.filter(x=>x!==t) : [...cur,t];
                      setEditEmp(p=>({...p,tasks:next}));
                    }} style={{ flex:1, border:`2px solid ${sel?color:_theme.cardBorder}`,
                      borderRadius:10, padding:"9px", cursor:"pointer", fontWeight:700,
                      fontSize:13, background:sel?color+"18":_theme.surface,
                      color:sel?color:_theme.textSub }}>
                      {sel ? "✓ " : ""}{t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full 22 task list */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:_theme.textMuted, marginBottom:8 }}>
              📋 Task Assignment
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:6 }}>
              {TASK_LIST.map(t => {
                const sel = (editEmp.tasks||[]).includes(t);
                const color = taskColor(t);
                return (
                  <button key={t} onClick={()=>{
                    const cur = editEmp.tasks||[];
                    const next = sel ? cur.filter(x=>x!==t) : [...cur,t];
                    setEditEmp(p=>({...p,tasks:next}));
                  }} style={{ border:`2px solid ${sel?color:_theme.cardBorder}`,
                    borderRadius:8, padding:"7px 10px", cursor:"pointer", fontWeight:sel?700:500,
                    fontSize:12, background:sel?color+"18":_theme.surface,
                    color:sel?color:_theme.textSub, textAlign:"left",
                    display:"flex", alignItems:"center", gap:6 }}>
                    {sel ? "✓" : "+"} {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other mandatory field */}
          {(editEmp.tasks||[]).includes("Other") && (
            <div style={{ marginBottom:14, padding:"10px 14px",
              background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.3)",
              borderRadius:8 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"#F59E0B", display:"block", marginBottom:6 }}>
                ⚠️ "Other" selected — please describe the task (required)
              </label>
              <input
                value={editEmp.otherTaskDetail||""}
                onChange={e=>setEditEmp(p=>({...p, otherTaskDetail:e.target.value}))}
                style={{ ...I({width:"100%"}) }}
                placeholder="Describe the task assigned..."
              />
            </div>
          )}

          <div style={{ marginTop:16, display:"flex", gap:8 }}>
            <button style={PBT("#2563EB",{flex:1,padding:"10px"})} onClick={()=>{
              if ((editEmp.tasks||[]).includes("Other") && !editEmp.otherTaskDetail?.trim()) {
                alert('⚠️ Please describe the "Other" task before saving.');
                return;
              }
              saveTaskEdit();
            }}>💾 Save & Log Changes</button>
            <button style={PBT("#94A3B8",{flex:"none",padding:"10px 16px"})} onClick={()=>setEditEmp(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── AUDIT LOG PAGE ───────────────────────────────────────────────────────────
function AuditLogPage({ auditLog, session }) {
  const [filterUser, setFilterUser]       = useState("");
  const [filterAction, setFilterAction]   = useState("");
  const [filterDate, setFilterDate]       = useState("");
  const [hidePageViews, setHidePageViews] = useState(true);
  const [showHistoryFor, setShowHistoryFor] = useState(null);

  const isSuperAdminSession = session?.name === "Mohammed Nasser Althurwi";
  const canViewHistory = session?.role === "Team Lead" ||
                         session?.role === "Shift Leader" ||
                         isSuperAdminSession;

  const logs    = Array.isArray(auditLog) ? auditLog : [];
  const users   = [...new Set(logs.map(l=>l.by))].filter(Boolean).sort();
  const actions = [...new Set(logs.map(l=>l.action))].filter(Boolean).sort();

  const filtered = logs.filter(l => {
    const mu = !filterUser   || l.by === filterUser;
    const ma = !filterAction || l.action === filterAction;
    const md = !filterDate   || l.ts?.startsWith(filterDate);
    const mp = !hidePageViews || l.action !== "Page View";
    return mu && ma && md && mp;
  });

  // Group edits by target+action for history view
  const editHistory = logs.filter(l =>
    l.action !== "Page View" && l.action !== "Sign In" && l.action !== "Sign Out"
  );

  // Summary: count edits per user
  const userEditCounts = {};
  editHistory.forEach(l => { userEditCounts[l.by] = (userEditCounts[l.by]||0)+1; });

  function actionColor(action) {
    if (!action) return "#64748B";
    if (action==="Sign In")    return "#10B981";
    if (action==="Sign Out")   return "#EF4444";
    if (action==="Page View")  return "#CBD5E1";
    if (action==="Task Assignment") return "#8B5CF6";
    if (action.includes("Schedule"))  return "#2563EB";
    if (action.includes("Attendance")) return "#0EA5E9";
    if (action.includes("Performance")) return "#F59E0B";
    if (action.includes("Queue"))      return "#6366F1";
    if (action.includes("Shift"))      return "#EC4899";
    if (action.includes("Employee")||action.includes("Roster")) return "#14B8A6";
    if (action.includes("Heat"))       return "#EF4444";
    if (action.includes("Add"))        return "#10B981";
    if (action.includes("Edit")||action.includes("Update")) return "#2563EB";
    if (action.includes("Delete"))     return "#EF4444";
    return "#64748B";
  }

  // ── Last Activity per User ───────────────────────────────────────────────────
  // For each user, find their most recent log entry (ignoring Page View)
  const lastActivity = useMemo(() => {
    const map = {};
    logs.forEach(l => {
      if (!l.by) return;
      if (!map[l.by] || l.ts > map[l.by].ts) map[l.by] = l;
    });
    return Object.values(map).sort((a,b) => b.ts.localeCompare(a.ts));
  }, [logs]);

  // ── "Recent" = active within last 60 min ────────────────────────────────────
  function minsAgo(ts) {
    return Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  }
  function timeAgoLabel(ts) {
    const m = minsAgo(ts);
    if (m < 1)  return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m/60);
    if (h < 24) return `${h}h ago`;
    return new Date(ts).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"Asia/Riyadh"});
  }
  function statusDot(ts) {
    const m = minsAgo(ts);
    if (m < 15)  return { color:"#10B981", label:"Active"  };
    if (m < 60)  return { color:"#F59E0B", label:"Recent"  };
    return           { color:"#CBD5E1", label:"Inactive" };
  }

  // Last page visited per user (from Page View entries)
  const lastPage = useMemo(() => {
    const map = {};
    logs.filter(l=>l.action==="Page View").forEach(l=>{
      if (!map[l.by] || l.ts > map[l.by].ts) map[l.by] = l;
    });
    return map;
  }, [logs]);

  const canSeeLiveView = session?.role !== "Agent" || isSuperAdminSession;
  const [activityFilter, setActivityFilter] = useState("All");

  return (
    <div>

      {/* ── Data History & Edit Tracking (Team Lead / Shift Leader / Mohammed Nasser Althurwi only) ── */}
      {canViewHistory && (
        <div style={{ ...CRD(), marginBottom:20, border:"2px solid #6366F130" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            <span style={{ fontSize:16 }}>🔒</span>
            <span style={{ fontWeight:800, fontSize:14, color:_theme.text }}>Data Edit History</span>
            <span style={{ fontSize:12, color:_theme.textMuted }}>— All data changes are logged</span>
          </div>

          {/* Edit counts per user */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8, marginBottom:14 }}>
            {Object.entries(userEditCounts).sort((a,b)=>b[1]-a[1]).map(([user, count]) => {
              const lastEntry = editHistory.filter(l=>l.by===user).sort((a,b)=>b.ts.localeCompare(a.ts))[0];
              const roleColor2 = ROLE_COLORS[lastEntry?.role]||"#64748B";
              return (
                <div key={user} style={{ background:_theme.isDark?"#0D1117":"#F8FAFC", borderRadius:8, padding:"10px 12px",
                  border:`1.5px solid ${roleColor2}30`, cursor:"pointer" }}
                  onClick={()=>{ setFilterUser(user); setShowHistoryFor(user); }}>
                  <div style={{ fontWeight:700, fontSize:13, color:_theme.text }}>{user}</div>
                  <div style={{ fontSize:11, color:roleColor2, fontWeight:600, marginTop:2 }}>
                    {ROLE_ICONS[lastEntry?.role]||"👤"} {lastEntry?.role}
                  </div>
                  <div style={{ fontSize:12, color:"#6366F1", fontWeight:700, marginTop:4 }}>
                    {count} edit{count!==1?"s":""}
                  </div>
                  {lastEntry && (
                    <div style={{ fontSize:10, color:_theme.textMuted, marginTop:2 }}>
                      Last: {new Date(lastEntry.ts).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"Asia/Riyadh"})} {new Date(lastEntry.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}
                    </div>
                  )}
                </div>
              );
            })}
            {Object.keys(userEditCounts).length === 0 && (
              <div style={{ color:_theme.textMuted, fontSize:13, padding:8 }}>No changes recorded yet.</div>
            )}
          </div>

          {/* Detailed edit log for selected user */}
          {showHistoryFor && (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <span style={{ fontWeight:700, fontSize:13, color:"#6366F1" }}>
                  📋 Changes for {showHistoryFor}
                </span>
                <button onClick={()=>{ setShowHistoryFor(null); setFilterUser(""); }}
                  style={{ background:"none", border:"1px solid #CBD5E1", borderRadius:6,
                    padding:"2px 8px", fontSize:12, cursor:"pointer", color:_theme.textMuted }}>✕ Close</button>
              </div>
              <div style={{ maxHeight:260, overflowY:"auto" }}>
                {editHistory.filter(l=>l.by===showHistoryFor).map((log,i) => (
                  <div key={log.id||i} style={{ display:"flex", gap:12, padding:"8px 0",
                    borderBottom:"1px solid #F1F5F9", alignItems:"flex-start" }}>
                    <div style={{ fontSize:10, color:_theme.textMuted, whiteSpace:"nowrap", paddingTop:2, minWidth:110 }}>
                      {new Date(log.ts).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"Asia/Riyadh"})}
                      {" "}{new Date(log.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}
                    </div>
                    <div style={{ flex:1 }}>
                      <span style={{ background:"#6366F118", color:"#6366F1", border:"1px solid #6366F130",
                        borderRadius:4, padding:"1px 6px", fontSize:11, fontWeight:600, marginRight:6 }}>
                        {log.action}
                      </span>
                      {log.target && <span style={{ fontSize:12, color:_theme.text, fontWeight:600 }}>{log.target}</span>}
                      {log.detail && <div style={{ fontSize:11, color:_theme.textMuted, marginTop:2 }}>{log.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Live Activity Panel (Team Lead / Shift Leader / SME only) ── */}
      {canSeeLiveView && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontWeight:700, fontSize:14, color:_theme.text, marginBottom:10, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            👥 User Activity Overview
            <span style={{ fontSize:11, fontWeight:400, color:_theme.textMuted }}>-- based on last recorded action per user</span>
            <select value={activityFilter} onChange={e=>setActivityFilter(e.target.value)}
              style={{ ...I({ width:140, marginBottom:0 }) }}>
              <option value="All">All Users</option>
              <option value="Online">🟢 Online (≤15m)</option>
              <option value="Offline">⚫ Offline (&gt;15m)</option>
            </select>
          </div>
          {lastActivity.length === 0 ? (
            <div style={{ ...CRD({ padding:"20px", textAlign:"center" }), color:_theme.textMuted, fontSize:13 }}>
              No activity recorded yet. Data will populate as users sign in and make changes.
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10 }}>
              {lastActivity
                .filter(l => {
                  if (activityFilter==="All") return true;
                  const m = minsAgo(l.ts);
                  if (activityFilter==="Online") return m<=15;
                  return m>15;
                }).map(l => {
                const dot = statusDot(l.ts);
                const pg  = lastPage[l.by];
                return (
                  <div key={l.by} style={{ ...CRD({ padding:"14px 16px" }),
                    borderLeft:`4px solid ${dot.color}`, position:"relative" }}>
                    {/* Status dot */}
                    <div style={{ position:"absolute", top:12, right:12, display:"flex", alignItems:"center", gap:4 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:dot.color,
                        boxShadow: dot.color==="10B981" ? `0 0 0 3px ${dot.color}30` : "none" }}/>
                      <span style={{ fontSize:10, color:dot.color, fontWeight:700 }}>{dot.label}</span>
                    </div>
                    {/* Name + role */}
                    <div style={{ fontWeight:800, fontSize:14, color:_theme.text, marginBottom:2, paddingRight:60 }}>{l.by}</div>
                    <div style={{ fontSize:11, color: ROLE_COLORS[l.role]||"#64748B", fontWeight:600, marginBottom:8 }}>
                      {ROLE_ICONS[l.role]||"👤"} {l.role}
                    </div>
                    {/* Last action */}
                    <div style={{ fontSize:12, color:_theme.textSub, marginBottom:4 }}>
                      <span style={{ background:actionColor(l.action)+"18", color:actionColor(l.action),
                        border:`1px solid ${actionColor(l.action)}30`, borderRadius:4,
                        padding:"1px 6px", fontSize:11, fontWeight:600, marginRight:4 }}>{l.action}</span>
                    </div>
                    {/* Current/last page */}
                    {pg && (
                      <div style={{ fontSize:11, color:_theme.textMuted, marginBottom:4 }}>
                        📄 Last page: <strong style={{color:"#2563EB"}}>{pg.target}</strong>
                      </div>
                    )}
                    {/* Time */}
                    <div style={{ fontSize:11, color:_theme.textMuted, marginTop:4, display:"flex", alignItems:"center", gap:4 }}>
                      🕐 {timeAgoLabel(l.ts)}
                      <span style={{ color:"#E2E8F0" }}>·</span>
                      <span>{new Date(l.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Filters ── */}
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>🔍 Audit Log & History</span>
        <select value={filterUser} onChange={e=>setFilterUser(e.target.value)} style={{ ...I(), width:180 }}>
          <option value="">All Users</option>
          {users.map(u=><option key={u}>{u}</option>)}
        </select>
        <select value={filterAction} onChange={e=>setFilterAction(e.target.value)} style={{ ...I(), width:180 }}>
          <option value="">All Actions</option>
          {actions.map(a=><option key={a}>{a}</option>)}
        </select>
        <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{ ...I(), width:150 }}/>
        {(filterUser||filterAction||filterDate) && (
          <button onClick={()=>{setFilterUser("");setFilterAction("");setFilterDate("");}}
            style={PBT("#94A3B8",{padding:"6px 12px",fontSize:12})}>✕ Clear</button>
        )}
        <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:_theme.textMuted, cursor:"pointer" }}>
          <input type="checkbox" checked={hidePageViews} onChange={e=>setHidePageViews(e.target.checked)}/>
          Hide Page Views
        </label>
        <span style={{ fontSize:12, color:_theme.textMuted, marginLeft:"auto" }}>{filtered.length} records</span>
        <button onClick={()=>{
          const rows = [["Timestamp","User","Role","Action","Target","Detail"]];
          filtered.forEach(l=>rows.push([
            new Date(l.ts).toLocaleString("en-GB",{timeZone:"Asia/Riyadh",hour12:false}),
            l.by||"", l.role||"", l.action||"", l.target||"", l.detail||""
          ]));
          const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,"''")}"`)
            .join(",")).join("\n");
          const blob = new Blob(["﻿"+csv],{type:"text/csv;charset=utf-8;"});
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href=url; a.download=`audit-${todayStr()}.csv`; a.click();
          URL.revokeObjectURL(url);
        }} style={PBT("#10B981",{fontSize:12,padding:"6px 14px"})}>⬇️ CSV</button>
      </div>

      {/* ── Log Timeline ── */}
      {filtered.length === 0 ? (
        <div style={{ ...CRD(), textAlign:"center", padding:"48px 20px", color:_theme.textMuted }}>
          <div style={{ fontSize:32, marginBottom:12 }}>📭</div>
          <div style={{ fontWeight:600, fontSize:14 }}>No records match your filters</div>
          <div style={{ fontSize:12, marginTop:6 }}>Activity appears here as users make changes</div>
        </div>
      ) : (
        <div style={CRD()}>
          {filtered.map((log, i) => {
            const dt = new Date(log.ts);
            return (
              <div key={log.id||i} style={{ display:"flex", gap:14, padding:"10px 0",
                borderBottom: i<filtered.length-1?"1px solid #F8FAFC":"none", alignItems:"flex-start" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, flexShrink:0, paddingTop:4 }}>
                  <div style={{ width:9, height:9, borderRadius:"50%", background:actionColor(log.action) }}/>
                  {i<filtered.length-1 && <div style={{ width:2, flex:1, minHeight:16, background:"#F1F5F9" }}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:2 }}>
                    <span style={{ background:actionColor(log.action)+"18", color:actionColor(log.action),
                      border:`1px solid ${actionColor(log.action)}40`, borderRadius:6,
                      padding:"2px 8px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{log.action}</span>
                    <span style={{ fontWeight:700, fontSize:13, color:_theme.text }}>{log.by}</span>
                    <span style={{ fontSize:11, color: ROLE_COLORS[log.role]||"#94A3B8", fontWeight:600 }}>{ROLE_ICONS[log.role]||""} {log.role}</span>
                    <span style={{ marginLeft:"auto", fontSize:11, color:_theme.textMuted, whiteSpace:"nowrap" }}>
                      {dt.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",timeZone:"Asia/Riyadh"})} · {dt.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}
                    </span>
                  </div>
                  {log.target && log.action!=="Page View" && (
                    <div style={{ fontSize:12, color:_theme.textSub }}>👤 <strong>{log.target}</strong></div>
                  )}
                  {log.detail && <div style={{ fontSize:12, color:_theme.textMuted, marginTop:1 }}>{log.detail}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}





// ─── OWNER EMPLOYEE MANAGER ──────────────────────────────────────────────────
// Full employee management panel exclusive to Owner (Super Admin)
function OwnerEmployeeManager({ employees, setEmployees, session, notes, setNotes }) {
  const [tab, setTab] = useState("roles"); // "roles" | "add" | "pages"
  const [search, setSearch] = useState("");
  const [addForm, setAddForm] = useState({ name:"", role:"Agent", gender:"M", tasks:[] });
  const [addDone, setAddDone] = useState("");
  const [expandedEmp, setExpandedEmp] = useState(null); // emp id with pages expanded

  const ALL_MANAGEABLE = ["Schedule","Attendance","Queue","Daily Tasks","Live Floor",
    "Break","Heat Map","Audit Log","Notes","Shifts","Performance","Reports","Leaderboard"];

  const PAGE_ICONS_MAP = {
    "Home":"🏠","Messages":"💬","Schedule":"📅","Attendance":"📋","Queue":"📊","Daily Tasks":"📌",
    "Live Floor":"🏢","Break":"☕","Heat Map":"🌡️","Audit Log":"🔍",
    "Notes":"📝","Shifts":"⏰","Performance":"⚡","Reports":"📑","Leaderboard":"🏆"
  };

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  function updateEmp(id, patch) {
    // Use functional update so the FULL updated array goes through the saving wrapper
    setEmployees(prev => {
      const updated = prev.map(e => e.id===id ? {...e, ...patch} : e);
      return updated;
    });
  }

  function deleteEmployee(emp) {
    if (emp.name === session?.name) { alert("You cannot delete your own account."); return; }
    if (!window.confirm(`⚠️ Delete employee "${emp.name}" permanently?\nThis will remove them from all records.`)) return;
    setEmployees(prev => prev.filter(e => e.id !== emp.id));
  }

  function addEmployee() {
    if (!addForm.name.trim()) { setAddDone("❌ Name is required"); return; }
    const id = "e" + Date.now();
    setEmployees(prev => [...prev, {
      id, name:addForm.name.trim(), role:addForm.role,
      gender:addForm.gender, tasks:addForm.tasks,
      isAdmin:false, hiddenPages:[]
    }]);
    setAddDone(`✅ Successfully added "${addForm.name.trim()}"`);
    setAddForm({ name:"", role:"Agent", gender:"M", tasks:[] });
    setTimeout(() => setAddDone(""), 3000);
  }

  function togglePage(emp, page) {
    const hidden = emp.hiddenPages || [];
    const next = hidden.includes(page) ? hidden.filter(p=>p!==page) : [...hidden, page];
    updateEmp(emp.id, { hiddenPages: next });
  }

  function toggleAdmin(emp) {
    if (emp.name === session?.name) { alert("You cannot edit your own permissions."); return; }
    const next = !emp.isAdmin;
    if (!window.confirm(`${next?"Grant":"Remove"} Admin access for "${emp.name}"?`)) return;
    updateEmp(emp.id, { isAdmin: next });
  }

  const tabs = [
    { k:"roles", icon:"🔑", label:"Roles & Permissions" },
    { k:"pages", icon:"🗂️", label:"Page Access Control" },
    { k:"add",   icon:"➕", label:"Add Employees" },
    { k:"dark",  icon:"🔒", label:"Dark Notes" },
  ];

  // Dark Notes helpers
  const [darkNoteTarget, setDarkNoteTarget] = useState("");
  const [darkNoteText, setDarkNoteText] = useState("");
  const [darkNoteSaved, setDarkNoteSaved] = useState(false);

  function getDarkNote(empName) {
    const n = (Array.isArray(notes)?notes:[]).find(n => n.tag==="Dark Note" && n.target===empName);
    if (!n) return "";
    try { return atob(n.text||""); } catch { return n.text||""; }
  }
  function saveDarkNote(empName, text) {
    const existing = (Array.isArray(notes)?notes:[]).filter(n => !(n.tag==="Dark Note" && n.target===empName));
    const entry = {
      id: "dn"+Date.now(),
      ts: new Date().toISOString(),
      date: new Date().toISOString().slice(0,10),
      time: "00:00",
      tag: "Dark Note",
      text: btoa(unescape(encodeURIComponent(text))),
      from: session?.name||"",
      target: empName,
      msgType: "dark_note",
    };
    if (setNotes) setNotes([entry, ...existing]);
    setDarkNoteSaved(true);
    setTimeout(()=>setDarkNoteSaved(false), 2500);
  }

  return (
    <div style={{ background:_theme.card, border:`1.5px solid ${_theme.primary}30`,
      borderRadius:12, padding:"16px 20px", marginBottom:20 }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <span style={{ fontSize:18 }}>👑</span>
        <span style={{ fontWeight:800, fontSize:15, color:_theme.text }}>Employee & Permissions Management</span>
        <span style={{ fontSize:12, color:_theme.textMuted }}>— Owner only</span>
        <span style={{ background:"#EF444420", color:"#EF4444", border:"1px solid #EF444440",
          borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
          👑 Owner Only
        </span>
        <div style={{ marginLeft:"auto" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            style={{ background:_theme.input, border:`1px solid ${_theme.inputBorder}`,
              borderRadius:8, padding:"6px 12px", fontSize:12, color:_theme.inputText,
              outline:"none", width:200 }}
            placeholder="🔍 Search employees..."/>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {tabs.filter(t => t.k !== "dark" || session?.name === SUPER_ADMIN).map(({k,icon,label}) => (
          <button key={k} onClick={()=>setTab(k)}
            style={{ border:`2px solid ${tab===k?_theme.primary:"#CBD5E1"}`,
              borderRadius:20, padding:"6px 16px", fontSize:12, cursor:"pointer", fontWeight:700,
              background:tab===k?_theme.primary:"transparent",
              color:tab===k?"#fff":_theme.textMuted, transition:"all 0.15s" }}>
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Roles & Permissions ── */}
      {tab==="roles" && (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
                {["Employee","Gender","Current Role","Change Role","Admin","Tasks","Delete"].map(h=>(
                  <th key={h} style={{ padding:"10px 10px", textAlign:"right", fontWeight:700,
                    color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp,ri) => {
                const isSelf = emp.name === session?.name;
                return (
                  <tr key={emp.id} style={{ background:ri%2===0?_theme.card:_theme.surface,
                    opacity: isSelf ? 0.75 : 1 }}>

                    {/* Name */}
                    <td style={{ padding:"8px 10px", fontWeight:700, color:_theme.text, minWidth:160 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        {emp.isAdmin && <span title="Admin" style={{ fontSize:12 }}>⚡</span>}
                        {emp.name}
                        {isSelf && <span style={{ fontSize:10, color:_theme.textMuted }}>(You)</span>}
                      </div>
                      <div style={{ fontSize:10, color:_theme.textMuted }}>{emp.id}</div>
                    </td>

                    {/* Gender */}
                    <td style={{ padding:"8px 10px", textAlign:"center" }}>
                      <div style={{ display:"flex", gap:4 }}>
                        {["M","F"].map(g => (
                          <button key={g} onClick={()=>!isSelf&&updateEmp(emp.id,{gender:g})}
                            disabled={isSelf}
                            style={{ border:`1.5px solid ${emp.gender===g?(g==="F"?"#BE185D":"#1D4ED8"):"#CBD5E1"}`,
                              borderRadius:5, padding:"2px 7px", fontSize:10, cursor:isSelf?"default":"pointer",
                              background:emp.gender===g?(g==="F"?"#FCE7F3":"#EFF6FF"):"transparent",
                              color:emp.gender===g?(g==="F"?"#BE185D":"#1D4ED8"):"#94A3B8",
                              fontWeight:700, opacity:isSelf?0.5:1 }}>
                            {g==="M"?"👨 M":"👩 F"}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Current role badge */}
                    <td style={{ padding:"8px 10px", whiteSpace:"nowrap" }}>
                      <span style={{ background:(ROLE_COLORS[emp.role]||"#64748B")+"22",
                        color:ROLE_COLORS[emp.role]||"#64748B",
                        border:`1px solid ${(ROLE_COLORS[emp.role]||"#64748B")}40`,
                        borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700 }}>
                        {ROLE_ICONS[emp.role]||"👤"} {emp.role}
                      </span>
                    </td>

                    {/* Role buttons */}
                    <td style={{ padding:"8px 10px" }}>
                      <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                        {Object.keys(ROLE_CAN_EDIT).map(role => (
                          <button key={role}
                            onClick={()=>{
                              if (isSelf) { alert("You cannot change your own role."); return; }
                              if (!window.confirm(`Change role for "${emp.name}" to "${role}"?`)) return;
                              updateEmp(emp.id, { role });
                            }}
                            style={{ border:`1.5px solid ${emp.role===role?(ROLE_COLORS[role]||"#64748B"):"#CBD5E1"}`,
                              borderRadius:5, padding:"2px 8px", fontSize:10, cursor:"pointer", fontWeight:700,
                              background:emp.role===role?(ROLE_COLORS[role]||"#64748B")+"22":"transparent",
                              color:emp.role===role?(ROLE_COLORS[role]||"#64748B"):"#94A3B8", transition:"all 0.1s" }}>
                            {role}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Admin toggle */}
                    <td style={{ padding:"8px 10px", textAlign:"center" }}>
                      <button onClick={()=>toggleAdmin(emp)}
                        title={emp.isAdmin?"Remove Admin":"Grant Admin"}
                        style={{ border:`2px solid ${emp.isAdmin?"#F59E0B":"#CBD5E1"}`,
                          borderRadius:8, padding:"4px 10px", fontSize:11, cursor:"pointer",
                          fontWeight:800,
                          background:emp.isAdmin?"#FEF3C7":"transparent",
                          color:emp.isAdmin?"#B45309":"#94A3B8", transition:"all 0.15s",
                          opacity:isSelf?0.4:1 }}>
                        {emp.isAdmin ? "⚡ Admin" : "+ Admin"}
                      </button>
                    </td>

                    {/* Tasks */}
                    <td style={{ padding:"8px 10px" }}>
                      <div style={{ display:"flex", gap:3 }}>
                        {["KFOOD","KEEMRT"].map(task => {
                          const has = (emp.tasks||[]).includes(task);
                          const color = task==="KFOOD"?"#10B981":"#3B82F6";
                          return (
                            <button key={task}
                              onClick={()=>{
                                const cur = emp.tasks||[];
                                updateEmp(emp.id, { tasks: has ? cur.filter(t=>t!==task) : [...cur,task] });
                              }}
                              style={{ border:`1.5px solid ${has?color:"#CBD5E1"}`,
                                borderRadius:5, padding:"2px 7px", fontSize:10, cursor:"pointer",
                                fontWeight:700, background:has?color+"22":"transparent",
                                color:has?color:"#94A3B8", transition:"all 0.1s" }}>
                              {has?"✓":"+"}  {task}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* Delete */}
                    <td style={{ padding:"8px 10px", textAlign:"center" }}>
                      <button onClick={()=>deleteEmployee(emp)}
                        disabled={isSelf}
                        title="Delete employee permanently"
                        style={{ background:isSelf?"transparent":"#FEF2F2",
                          border:`1px solid ${isSelf?"#CBD5E1":"#FCA5A5"}`,
                          color:isSelf?"#CBD5E1":"#EF4444", borderRadius:6,
                          padding:"4px 10px", cursor:isSelf?"default":"pointer",
                          fontSize:12, fontWeight:700 }}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0 && (
                <tr><td colSpan={7} style={{ padding:24, textAlign:"center", color:_theme.textMuted }}>
                  No search results
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB: Page Visibility Control ── */}
      {tab==="pages" && (
        <div>
          <div style={{ fontSize:12, color:_theme.textMuted, marginBottom:12, padding:"8px 12px",
            background:_theme.surface, borderRadius:8, border:`1px solid ${_theme.cardBorder}` }}>
            💡 Click an employee name to toggle their page visibility.
            Owner always sees all pages regardless of this setting.
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {filtered.map(emp => {
              const hidden = emp.hiddenPages || [];
              const isExpanded = expandedEmp === emp.id;
              const isSelf = emp.name === session?.name;
              return (
                <div key={emp.id} style={{ background:_theme.surface, borderRadius:10,
                  border:`1px solid ${_theme.cardBorder}`, overflow:"hidden" }}>
                  {/* Row header */}
                  <div onClick={()=>setExpandedEmp(isExpanded?null:emp.id)}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
                      cursor:"pointer", userSelect:"none" }}>
                    <span style={{ fontSize:14 }}>{isExpanded?"▼":"▶"}</span>
                    <span style={{ fontWeight:700, fontSize:13, color:_theme.text }}>{emp.name}</span>
                    <span style={{ fontSize:11, color:ROLE_COLORS[emp.role]||"#64748B", fontWeight:600 }}>
                      {ROLE_ICONS[emp.role]} {emp.role}
                    </span>
                    {hidden.length > 0 && (
                      <span style={{ background:"#FEF2F2", color:"#EF4444", border:"1px solid #FCA5A5",
                        borderRadius:20, padding:"1px 8px", fontSize:10, fontWeight:700, marginLeft:"auto" }}>
                        {hidden.length} pages hidden
                      </span>
                    )}
                    {hidden.length === 0 && (
                      <span style={{ background:"#F0FDF4", color:"#10B981", border:"1px solid #86EFAC",
                        borderRadius:20, padding:"1px 8px", fontSize:10, fontWeight:700, marginLeft:"auto" }}>
                        ✅ All pages visible
                      </span>
                    )}
                  </div>
                  {/* Expanded pages grid */}
                  {isExpanded && (
                    <div style={{ padding:"10px 14px", borderTop:`1px solid ${_theme.cardBorder}` }}>
                      {isSelf && (
                        <div style={{ fontSize:12, color:"#F59E0B", marginBottom:8 }}>
                          ⚠️ Cannot edit your own pages as Owner
                        </div>
                      )}
                      <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                        <button onClick={()=>!isSelf&&updateEmp(emp.id,{hiddenPages:[]})}
                          disabled={isSelf}
                          style={{ border:"1.5px solid #10B981", borderRadius:8, padding:"4px 12px",
                            fontSize:11, cursor:isSelf?"default":"pointer", fontWeight:700,
                            background:"#F0FDF4", color:"#10B981", opacity:isSelf?0.5:1 }}>
                          ✅ Show All
                        </button>
                        <button onClick={()=>!isSelf&&updateEmp(emp.id,{hiddenPages:[...ALL_MANAGEABLE]})}
                          disabled={isSelf}
                          style={{ border:"1.5px solid #EF4444", borderRadius:8, padding:"4px 12px",
                            fontSize:11, cursor:isSelf?"default":"pointer", fontWeight:700,
                            background:"#FEF2F2", color:"#EF4444", opacity:isSelf?0.5:1 }}>
                          🚫 Hide All
                        </button>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:6 }}>
                        {ALL_MANAGEABLE.map(page => {
                          const isHidden = hidden.includes(page);
                          return (
                            <button key={page}
                              onClick={()=>!isSelf&&togglePage(emp, page)}
                              disabled={isSelf}
                              style={{ display:"flex", alignItems:"center", gap:6,
                                border:`1.5px solid ${isHidden?"#EF4444":"#10B981"}`,
                                borderRadius:8, padding:"6px 10px",
                                cursor:isSelf?"default":"pointer",
                                background:isHidden?"#FEF2F2":"#F0FDF4",
                                opacity:isSelf?0.5:1, transition:"all 0.15s" }}>
                              <span style={{ fontSize:14 }}>{PAGE_ICONS_MAP[page]||"📄"}</span>
                              <span style={{ fontSize:11, fontWeight:700,
                                color:isHidden?"#EF4444":"#10B981", textAlign:"left" }}>{page}</span>
                              <span style={{ marginLeft:"auto", fontSize:14 }}>
                                {isHidden ? "🔒" : "✅"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: Add Employee ── */}
      {tab==="add" && (
        <div style={{ maxWidth:500 }}>
          <div style={{ fontSize:12, color:_theme.textMuted, marginBottom:16, padding:"8px 12px",
            background:_theme.surface, borderRadius:8, border:`1px solid ${_theme.cardBorder}` }}>
            ➕ Add new employee to the system — appears immediately in all pages.
          </div>

          {addDone && (
            <div style={{ background: addDone.startsWith("✅")?"#F0FDF4":"#FEF2F2",
              border:`1px solid ${addDone.startsWith("✅")?"#86EFAC":"#FCA5A5"}`,
              borderRadius:8, padding:"10px 14px", marginBottom:14,
              fontSize:13, color:addDone.startsWith("✅")?"#166534":"#EF4444", fontWeight:600 }}>
              {addDone}
            </div>
          )}

          <div style={{ display:"grid", gap:12 }}>
            {/* Name */}
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:_theme.textSub, display:"block", marginBottom:5 }}>
                Full Name *
              </label>
              <input value={addForm.name} onChange={e=>setAddForm(p=>({...p,name:e.target.value}))}
                placeholder="Enter full name..."
                style={{ background:_theme.input, border:`1px solid ${_theme.inputBorder}`,
                  borderRadius:8, padding:"9px 12px", fontSize:13, color:_theme.inputText,
                  outline:"none", width:"100%" }}/>
            </div>

            {/* Role */}
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:_theme.textSub, display:"block", marginBottom:5 }}>
                Role
              </label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {Object.keys(ROLE_CAN_EDIT).map(role => (
                  <button key={role} onClick={()=>setAddForm(p=>({...p,role}))}
                    style={{ border:`2px solid ${addForm.role===role?(ROLE_COLORS[role]||"#64748B"):"#CBD5E1"}`,
                      borderRadius:8, padding:"8px 10px", cursor:"pointer",
                      background:addForm.role===role?(ROLE_COLORS[role]||"#64748B")+"18":"transparent",
                      display:"flex", alignItems:"center", gap:6, transition:"all 0.15s" }}>
                    <span style={{ fontSize:16 }}>{ROLE_ICONS[role]||"👤"}</span>
                    <span style={{ fontSize:12, fontWeight:700,
                      color:addForm.role===role?(ROLE_COLORS[role]||"#64748B"):_theme.textSub }}>
                      {role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:_theme.textSub, display:"block", marginBottom:5 }}>
                Gender
              </label>
              <div style={{ display:"flex", gap:8 }}>
                {[["M","👨 Male","#1D4ED8","#EFF6FF"],["F","👩 Female","#BE185D","#FCE7F3"]].map(([v,l,c,bg])=>(
                  <button key={v} onClick={()=>setAddForm(p=>({...p,gender:v}))}
                    style={{ flex:1, border:`2px solid ${addForm.gender===v?c:"#CBD5E1"}`,
                      borderRadius:8, padding:"9px", cursor:"pointer",
                      background:addForm.gender===v?bg:"transparent",
                      color:addForm.gender===v?c:_theme.textSub, fontWeight:700, fontSize:13 }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:_theme.textSub, display:"block", marginBottom:5 }}>
                Tasks (optional)
              </label>
              <div style={{ display:"flex", gap:8 }}>
                {["KFOOD","KEEMRT"].map(task => {
                  const has = addForm.tasks.includes(task);
                  const color = task==="KFOOD"?"#10B981":"#3B82F6";
                  return (
                    <button key={task}
                      onClick={()=>setAddForm(p=>({...p,tasks:has?p.tasks.filter(t=>t!==task):[...p.tasks,task]}))}
                      style={{ flex:1, border:`2px solid ${has?color:"#CBD5E1"}`,
                        borderRadius:8, padding:"9px", cursor:"pointer", fontWeight:700,
                        background:has?color+"18":"transparent", color:has?color:_theme.textSub, fontSize:13 }}>
                      {has?"✓ ":""}{task}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button onClick={addEmployee}
              style={{ background:_theme.primary, color:"#fff", border:"none", borderRadius:10,
                padding:"12px", fontSize:14, cursor:"pointer", fontWeight:700,
                boxShadow:`0 4px 14px ${_theme.primary}40`, marginTop:4 }}>
              ➕ Add Employee
            </button>
          </div>
        </div>
      )}

      {/* ── TAB: Dark Notes (Owner Eyes Only) ── */}
      {tab==="dark" && (
        <div>
          <div style={{ fontSize:12, color:"rgba(239,68,68,0.8)", marginBottom:14, padding:"10px 14px",
            background:"rgba(239,68,68,0.08)", borderRadius:8, border:"1px solid rgba(239,68,68,0.25)",
            display:"flex", alignItems:"center", gap:8 }}>
            <span>🔒</span>
            <span><strong>Dark Notes</strong> — Encrypted. Visible only to you. Never shown to employees or in audit logs.</span>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:700, color:_theme.textSub, display:"block", marginBottom:6 }}>
              Select Employee
            </label>
            <select value={darkNoteTarget} onChange={e=>{
              setDarkNoteTarget(e.target.value);
              setDarkNoteText(e.target.value ? getDarkNote(e.target.value) : "");
            }}
              style={{ ...I({width:"100%"}) }}>
              <option value="">— Select employee —</option>
              {employees.map(e=><option key={e.id} value={e.name}>{e.name} ({e.role})</option>)}
            </select>
          </div>
          {darkNoteTarget && (
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:"#EF4444", display:"block", marginBottom:6 }}>
                🔒 Private Note for {darkNoteTarget}
              </label>
              <textarea
                value={darkNoteText} onChange={e=>setDarkNoteText(e.target.value)}
                rows={6} style={{ ...I({width:"100%",resize:"vertical",marginBottom:10}),
                  fontFamily:"monospace", fontSize:13 }}
                placeholder="Write your private note here... (encrypted, owner eyes only)"/>
              {darkNoteSaved && (
                <div style={{ color:"#10B981", fontSize:12, marginBottom:8, fontWeight:700 }}>
                  ✅ Dark note saved securely
                </div>
              )}
              <button onClick={()=>saveDarkNote(darkNoteTarget, darkNoteText)}
                style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.4)",
                  color:"#EF4444", borderRadius:8, padding:"9px 20px",
                  cursor:"pointer", fontWeight:800, fontSize:13 }}>
                🔒 Save Dark Note
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── OWNER ANALYTICS PAGE ────────────────────────────────────────────────────
function OwnerAnalyticsPage({ auditLog, session, employees, setEmployees, schedule, shifts, attendance, performance, queueLog, alertThresholdCritical, alertThresholdWarning, saveAlertThresholds, notes, setNotes, onShadowMode, onToggleFreeze, onSystemFrozen, onTogglePresentation, onPresentationMode }) {
  const [filterUser, setFilterUser]       = useState("");
  const [filterAction, setFilterAction]   = useState("");
  const [filterDate, setFilterDate]       = useState("");
  const [hidePageViews, setHidePageViews] = useState(true);
  const [showHistoryFor, setShowHistoryFor] = useState(null);
  const [activityFilter, setActivityFilter] = useState("All");
  const [editCritical, setEditCritical]   = useState(alertThresholdCritical);
  const [editWarning,  setEditWarning]    = useState(alertThresholdWarning);
  const [shadowSearch, setShadowSearch]   = useState("");
  const [showShadowPanel, setShowShadowPanel] = useState(false);

  // ── Manager Messages state ───────────────────────────────────────────────────
  const [msgText, setMsgText]     = useState("");
  const [msgTarget, setMsgTarget] = useState("all"); // "all" or employee name
  const [msgType, setMsgType]     = useState("shoutout"); // "shoutout"|"motivation"|"reminder"
  const [msgSaved, setMsgSaved]   = useState(false);

  // Manager messages — only show messages for me, sent by me, or sent to all
  const managerMessages = useMemo(() =>
    (Array.isArray(notes) ? notes : [])
      .filter(n => {
        if (n.tag !== "Manager Message") return false;
        const isAll     = !n.target || n.target === "all";
        const isForMe   = n.target === session?.name;
        const fromMe    = n.from === session?.name;
        // Supervisors can see all messages they sent; agents only see theirs
        return isAll || isForMe || fromMe;
      })
      .sort((a,b) => b.ts.localeCompare(a.ts))
  , [notes, session]);

  function sendManagerMessage() {
    if (!msgText.trim()) return;
    const now = new Date();
    const entry = {
      id:   "mm"+Date.now(),
      ts:   now.toISOString(),
      date: now.toISOString().slice(0,10),
      time: pad(now.getHours())+":"+pad(now.getMinutes()),
      tag:  "Manager Message",
      text: msgText.trim(),
      from: session?.name || "Supervisor",
      target: msgTarget,
      msgType,
    };
    setNotes(prev => [entry, ...(Array.isArray(prev)?prev:[])].slice(0, 500));
    setMsgText("");
    setMsgSaved(true);
    setTimeout(() => setMsgSaved(false), 2500);
  }

  function deleteMessage(id) {
    setNotes(prev => (Array.isArray(prev)?prev:[]).filter(n => n.id !== id));
  }

  const logs    = Array.isArray(auditLog) ? auditLog : [];
  const users   = [...new Set(logs.map(l=>l.by))].filter(Boolean).sort();
  const actions = [...new Set(logs.map(l=>l.action))].filter(Boolean).sort();

  const filtered = logs.filter(l => {
    const mu = !filterUser   || l.by === filterUser;
    const ma = !filterAction || l.action === filterAction;
    const md = !filterDate   || l.ts?.startsWith(filterDate);
    const mp = !hidePageViews || l.action !== "Page View";
    return mu && ma && md && mp;
  });

  const editHistory = logs.filter(l =>
    l.action !== "Page View" && l.action !== "Sign In" && l.action !== "Sign Out"
  );

  const userEditCounts = {};
  editHistory.forEach(l => { userEditCounts[l.by] = (userEditCounts[l.by]||0)+1; });

  function actionColor(action) {
    if (!action) return "#64748B";
    if (action==="Sign In")    return "#10B981";
    if (action==="Sign Out")   return "#EF4444";
    if (action==="Page View")  return "#CBD5E1";
    if (action==="Task Assignment") return "#8B5CF6";
    if (action.includes("Schedule"))  return "#2563EB";
    if (action.includes("Attendance")) return "#0EA5E9";
    if (action.includes("Performance")) return "#F59E0B";
    if (action.includes("Queue"))      return "#6366F1";
    if (action.includes("Shift"))      return "#EC4899";
    if (action.includes("Employee")||action.includes("Roster")) return "#14B8A6";
    if (action.includes("Heat"))       return "#EF4444";
    if (action.includes("Add"))        return "#10B981";
    if (action.includes("Edit")||action.includes("Update")) return "#2563EB";
    if (action.includes("Delete"))     return "#EF4444";
    return "#64748B";
  }

  const lastActivity = useMemo(() => {
    const map = {};
    logs.forEach(l => {
      if (!l.by) return;
      if (!map[l.by] || l.ts > map[l.by].ts) map[l.by] = l;
    });
    return Object.values(map).sort((a,b) => b.ts.localeCompare(a.ts));
  }, [logs]);

  function minsAgo(ts) {
    return Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  }
  function timeAgoLabel(ts) {
    const m = minsAgo(ts);
    if (m < 1)  return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m/60);
    if (h < 24) return `${h}h ago`;
    return new Date(ts).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"Asia/Riyadh"});
  }
  function statusDot(ts) {
    const m = minsAgo(ts);
    if (m < 15)  return { color:"#10B981", label:"Active"  };
    if (m < 60)  return { color:"#F59E0B", label:"Recent"  };
    return           { color:"#6B7280", label:"Offline" };
  }

  const lastPage = useMemo(() => {
    const map = {};
    logs.filter(l=>l.action==="Page View").forEach(l=>{
      if (!map[l.by] || l.ts > map[l.by].ts) map[l.by] = l;
    });
    return map;
  }, [logs]);

  // ── Quick KPIs ──────────────────────────────────────────────────────────────
  const todayKey = new Date().toISOString().slice(0,10);
  const todayDayName = DAYS[new Date().getDay()];
  const totalEmployees = employees.length;
  const todayScheduled = employees.filter(e => {
    const v = (schedule[e.id]||{})[todayDayName];
    return v && v !== "OFF";
  }).length;
  const todayAttendance = attendance[todayKey] || {};
  const presentToday = Object.values(todayAttendance).filter(a => isPresent(a.status)).length;
  const absentToday  = Object.values(todayAttendance).filter(a => isAbsent(a.status)).length;

  const signInsToday = logs.filter(l => l.ts?.startsWith(todayKey) && l.action === "Sign In").length;
  const editsToday   = logs.filter(l => l.ts?.startsWith(todayKey) && l.action !== "Page View" && l.action !== "Sign In" && l.action !== "Sign Out").length;

  const activeNow = lastActivity.filter(l => minsAgo(l.ts) <= 15).length;

  const shadowEmployees = employees.filter(e =>
    !shadowSearch || e.name.toLowerCase().includes(shadowSearch.toLowerCase()) || e.role.toLowerCase().includes(shadowSearch.toLowerCase())
  );

  return (
    <div>
      {/* ── Owner Control Strip ── */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {/* System Freeze */}
        <button onClick={()=>{
          const next = !onSystemFrozen;
          onToggleFreeze && onToggleFreeze(next);
          try { if(next) localStorage.setItem("csops_frozen","1"); else localStorage.removeItem("csops_frozen"); } catch {}
          showToast(next ? "🧊 System FROZEN — all edits blocked" : "✅ System UNFROZEN — edits restored", next?"error":"success", 4000);
        }}
          style={{ background: onSystemFrozen ? "rgba(220,38,38,0.2)" : "rgba(59,130,246,0.1)",
            border: `2px solid ${onSystemFrozen ? "#DC2626" : "#3B82F6"}`,
            color: onSystemFrozen ? "#EF4444" : "#60A5FA",
            borderRadius:10, padding:"8px 18px", cursor:"pointer", fontWeight:800, fontSize:13,
            display:"flex", alignItems:"center", gap:8 }}>
          {onSystemFrozen ? "🔓 Unfreeze System" : "🧊 Freeze System"}
        </button>

        {/* Presentation Mode */}
        <button onClick={()=> onTogglePresentation && onTogglePresentation()}
          style={{ background: onPresentationMode ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.08)",
            border: `2px solid ${onPresentationMode ? "#8B5CF6" : "#6D28D9"}`,
            color: onPresentationMode ? "#A78BFA" : "#7C3AED",
            borderRadius:10, padding:"8px 18px", cursor:"pointer", fontWeight:800, fontSize:13,
            display:"flex", alignItems:"center", gap:8 }}>
          🎭 {onPresentationMode ? "Exit Presentation" : "Presentation Mode"}
        </button>
      </div>

      {/* ── 👁️ GOLDEN EYE — Shadow Mode Panel ── */}
      <div style={{ background:"linear-gradient(135deg,rgba(180,120,0,0.15),rgba(255,215,0,0.08),rgba(180,120,0,0.15))",
        border:"2px solid rgba(255,215,0,0.4)", borderRadius:16, padding:"18px 20px", marginBottom:20,
        boxShadow:"0 0 30px rgba(255,215,0,0.1)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:28, filter:"drop-shadow(0 0 8px #FFD700)" }}>👁️</div>
            <div>
              <div style={{ fontWeight:900, fontSize:16, color:"#FFD700", letterSpacing:0.5 }}>
                GOLDEN EYE — Shadow Mode
              </div>
              <div style={{ fontSize:12, color:"rgba(255,215,0,0.65)", marginTop:2 }}>
                Enter any account instantly · Full edit access · Logged as "System Auto-Update"
              </div>
            </div>
          </div>
          <button onClick={()=>setShowShadowPanel(p=>!p)}
            style={{ background: showShadowPanel ? "rgba(255,215,0,0.25)" : "rgba(255,215,0,0.1)",
              border:"1.5px solid rgba(255,215,0,0.5)", color:"#FFD700",
              borderRadius:10, padding:"8px 20px", cursor:"pointer", fontWeight:800, fontSize:13 }}>
            {showShadowPanel ? "▲ Close Panel" : "▼ Activate Shadow Mode"}
          </button>
        </div>

        {showShadowPanel && (
          <div style={{ marginTop:16 }}>
            <input
              placeholder="🔍 Search employee by name or role..."
              value={shadowSearch} onChange={e=>setShadowSearch(e.target.value)}
              style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,215,0,0.3)",
                borderRadius:8, padding:"9px 14px", fontSize:13, color:"#FFD700",
                width:"100%", boxSizing:"border-box", outline:"none", marginBottom:12,
                placeholder:"rgba(255,215,0,0.4)" }}
            />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
              {shadowEmployees.map(emp => (
                <button key={emp.id}
                  onClick={()=>{
                    if (onShadowMode) onShadowMode({ role:emp.role, name:emp.name, accessedByOwner:true });
                  }}
                  style={{ background:"rgba(0,0,0,0.35)", border:"1px solid rgba(255,215,0,0.2)",
                    borderRadius:10, padding:"10px 14px", cursor:"pointer", textAlign:"left",
                    display:"flex", alignItems:"center", gap:10, transition:"all 0.15s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,215,0,0.15)"; e.currentTarget.style.borderColor="rgba(255,215,0,0.5)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background="rgba(0,0,0,0.35)"; e.currentTarget.style.borderColor="rgba(255,215,0,0.2)"; }}>
                  <span style={{ fontSize:20 }}>{ROLE_ICONS[emp.role]||"👤"}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#FFD700" }}>{emp.name.split(" ").slice(0,2).join(" ")}</div>
                    <div style={{ fontSize:10, color:"rgba(255,215,0,0.55)" }}>{emp.role}</div>
                  </div>
                  <span style={{ marginLeft:"auto", fontSize:10, color:"rgba(255,215,0,0.4)", fontWeight:700 }}>ENTER →</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Owner KPI Strip ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10, marginBottom:20 }}>
        {[
          { label:"Total Staff",     value:totalEmployees, color:"#3B82F6",  icon:"👥" },
          { label:"Scheduled Today", value:todayScheduled, color:"#8B5CF6",  icon:"📅" },
          { label:"Present Today",   value:presentToday,   color:"#10B981",  icon:"✅" },
          { label:"Absent Today",    value:absentToday,    color:"#EF4444",  icon:"❌" },
          { label:"Active Now",      value:activeNow,      color:"#10B981",  icon:"🟢" },
          { label:"Sign-ins Today",  value:signInsToday,   color:"#0EA5E9",  icon:"🔑" },
          { label:"Edits Today",     value:editsToday,     color:"#F59E0B",  icon:"✏️" },
        ].map(k => (
          <div key={k.label} style={{ background:_theme.card, border:`1px solid ${_theme.cardBorder}`,
            borderRadius:12, padding:"14px 16px", borderTop:`3px solid ${k.color}` }}>
            <div style={{ fontSize:11, color:_theme.textMuted, fontWeight:600, marginBottom:4 }}>{k.icon} {k.label}</div>
            <div style={{ fontSize:28, fontWeight:800, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* ── Backup & Restore Strip ── */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        <button
          onClick={()=>{
            const backup = {
              version: "cs-ops-v1",
              exported: new Date().toISOString(),
              employees, shifts, schedule, attendance, performance,
              heatmap, queueLog, notes, auditLog,
            };
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type:"application/json" });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a");
            a.href     = url;
            a.download = `cs-ops-backup-${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={{ background:"#10B981", color:"#fff", border:"none", borderRadius:8,
            padding:"9px 18px", fontSize:13, cursor:"pointer", fontWeight:700,
            display:"flex", alignItems:"center", gap:6 }}>
          💾 Export Backup
        </button>
        <div style={{ fontSize:11, color:_theme.textMuted }}>
          Exports all data as a single JSON file — keep as a daily backup.
        </div>
      </div>

      {/* ── Alert Threshold Settings ── */}
      <div style={{ background:_theme.card, border:`1.5px solid #EF444430`,
        borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
          <span style={{ fontSize:16 }}>🔔</span>
          <span style={{ fontWeight:800, fontSize:14, color:_theme.text }}>Alert Threshold Settings</span>
          <span style={{ fontSize:12, color:_theme.textMuted }}>— Customize alert limits</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:12, alignItems:"flex-end" }}>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"#EF4444", display:"block", marginBottom:6 }}>
              🚨 CRITICAL Threshold (default: 400 cases)
            </label>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <button onClick={()=>setEditCritical(v=>Math.max(editWarning+10, v-10))}
                style={{ background:_theme.surface, border:`1px solid ${_theme.cardBorder}`, color:_theme.text,
                  borderRadius:"6px 0 0 6px", padding:"7px 11px", cursor:"pointer", fontWeight:700, fontSize:14 }}>−</button>
              <input type="number" min={editWarning+1} value={editCritical}
                onChange={e=>setEditCritical(Math.max(editWarning+1, Number(e.target.value)))}
                style={{ ...I({ width:80, borderRadius:0, textAlign:"center", fontWeight:700,
                  border:`2px solid #EF4444`, color:"#EF4444" })}}/>
              <button onClick={()=>setEditCritical(v=>v+10)}
                style={{ background:_theme.surface, border:`1px solid ${_theme.cardBorder}`, color:_theme.text,
                  borderRadius:"0 6px 6px 0", padding:"7px 11px", cursor:"pointer", fontWeight:700, fontSize:14 }}>+</button>
            </div>
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"#F59E0B", display:"block", marginBottom:6 }}>
              ⚠️ WARNING Threshold (default: 200 cases)
            </label>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <button onClick={()=>setEditWarning(v=>Math.max(10, v-10))}
                style={{ background:_theme.surface, border:`1px solid ${_theme.cardBorder}`, color:_theme.text,
                  borderRadius:"6px 0 0 6px", padding:"7px 11px", cursor:"pointer", fontWeight:700, fontSize:14 }}>−</button>
              <input type="number" min={10} max={editCritical-1} value={editWarning}
                onChange={e=>setEditWarning(Math.min(editCritical-1, Math.max(10, Number(e.target.value))))}
                style={{ ...I({ width:80, borderRadius:0, textAlign:"center", fontWeight:700,
                  border:`2px solid #F59E0B`, color:"#F59E0B" })}}/>
              <button onClick={()=>setEditWarning(v=>Math.min(editCritical-1, v+10))}
                style={{ background:_theme.surface, border:`1px solid ${_theme.cardBorder}`, color:_theme.text,
                  borderRadius:"0 6px 6px 0", padding:"7px 11px", cursor:"pointer", fontWeight:700, fontSize:14 }}>+</button>
            </div>
          </div>
          <button
            onClick={()=>saveAlertThresholds(editCritical, editWarning)}
            style={{ background:_theme.primary, color:"#fff", border:"none", borderRadius:8,
              padding:"9px 20px", fontSize:13, cursor:"pointer", fontWeight:700, whiteSpace:"nowrap" }}>
            💾 Save Thresholds
          </button>
        </div>
        <div style={{ marginTop:10, fontSize:11, color:_theme.textMuted }}>
          Current: Critical at <strong style={{color:"#EF4444"}}>{alertThresholdCritical}</strong> cases ·
          Warning at <strong style={{color:"#F59E0B"}}>{alertThresholdWarning}</strong> cases
        </div>
      </div>


      {/* ══════════ EMPLOYEE MANAGEMENT ══════════ */}
      <OwnerEmployeeManager employees={employees} setEmployees={setEmployees} session={session} notes={notes} setNotes={setNotes}/>


      {/* ── Weekly Team Review ── */}
      <div style={{ background:_theme.card, border:`1.5px solid ${_theme.primary}20`,
        borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
          <span style={{ fontSize:16 }}>📊</span>
          <span style={{ fontWeight:800, fontSize:14, color:_theme.text }}>Weekly Team Review</span>
          <span style={{ fontSize:12, color:_theme.textMuted }}>— Last 7 days</span>
        </div>
        {(() => {
          const last7days = Array.from({length:7},(_,i)=>{
            const d=new Date(); d.setDate(d.getDate()-6+i);
            return { date:d.toISOString().slice(0,10), label:d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",timeZone:"Asia/Riyadh"}) };
          });
          const weekStats = last7days.map(({date,label})=>{
            const attMap  = attendance[date]||{};
            const perfMap = performance[date]||{};
            const dayName = DAYS[new Date(date+"T12:00:00").getDay()];
            const scheduled = employees.filter(e=>{const v=(schedule[e.id]||{})[dayName];return v&&v!=="OFF";});
            const present   = Object.values(attMap).filter(a=>isPresent(a.status)).length;
            const absent    = Object.values(attMap).filter(a=>isAbsent(a.status)).length;
            const closed    = Object.values(perfMap).reduce((s,p)=>s+(p.closed||0),0);
            const esc       = Object.values(perfMap).reduce((s,p)=>s+(p.escalations||0),0);
            return {label,date,scheduled:scheduled.length,present,absent,closed,esc};
          });
          const totalClosed7 = weekStats.reduce((s,d)=>s+d.closed,0);
          const totalEsc7    = weekStats.reduce((s,d)=>s+d.esc,0);
          const avgPresent   = weekStats.length > 0 ? Math.round(weekStats.reduce((s,d)=>s+d.present,0)/weekStats.length) : 0;
          return (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
                <div style={{ ...CRD({padding:"10px 12px"}), borderTop:"3px solid #10B981" }}>
                  <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:600 }}>Total Closed 7 days</div>
                  <div style={{ fontSize:24, fontWeight:800, color:"#10B981" }}>{totalClosed7}</div>
                  <SparkBar values={weekStats.map(d=>d.closed)} color="#10B981" height={32} width={100}/>
                </div>
                <div style={{ ...CRD({padding:"10px 12px"}), borderTop:"3px solid #F59E0B" }}>
                  <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:600 }}>Total Escalations 7 days</div>
                  <div style={{ fontSize:24, fontWeight:800, color:"#F59E0B" }}>{totalEsc7}</div>
                  <SparkLine values={weekStats.map(d=>d.esc)} color="#F59E0B" height={32} width={100}/>
                </div>
                <div style={{ ...CRD({padding:"10px 12px"}), borderTop:"3px solid #3B82F6" }}>
                  <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:600 }}>Avg Daily Attendance</div>
                  <div style={{ fontSize:24, fontWeight:800, color:"#3B82F6" }}>{avgPresent}</div>
                  <SparkBar values={weekStats.map(d=>d.present)} color="#3B82F6" height={32} width={100}/>
                </div>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
                      {["Day","Scheduled","Present","Absent","Closed","Esc"].map(h=>(
                        <th key={h} style={{ padding:"8px 10px", textAlign:"right", fontWeight:700,
                          color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weekStats.map((d,ri)=>(
                      <tr key={d.date} style={{ background:ri%2===0?_theme.card:_theme.surface }}>
                        <td style={{ padding:"7px 10px", fontWeight:600, color:_theme.text }}>{d.label}</td>
                        <td style={{ padding:"7px 10px", color:_theme.textSub }}>{d.scheduled}</td>
                        <td style={{ padding:"7px 10px", color:"#10B981", fontWeight:600 }}>{d.present}</td>
                        <td style={{ padding:"7px 10px", color:d.absent>0?"#EF4444":_theme.textMuted, fontWeight:600 }}>{d.absent||"—"}</td>
                        <td style={{ padding:"7px 10px", color:"#3B82F6", fontWeight:700 }}>{d.closed||"—"}</td>
                        <td style={{ padding:"7px 10px", color:d.esc>0?"#F59E0B":_theme.textMuted, fontWeight:600 }}>{d.esc||"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </div>
      {/* ── Manager Messages Panel ── */}
      <div style={{ background:_theme.card, border:`1.5px solid ${_theme.accent}30`,
        borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
          <span style={{ fontSize:16 }}>💬</span>
          <span style={{ fontWeight:800, fontSize:14, color:_theme.text }}>Team Messages</span>
          <span style={{ fontSize:12, color:_theme.textMuted }}>— Shown on employee leaderboard</span>
          {managerMessages.length > 0 && (
            <span style={{ background:_theme.accent+"22", color:_theme.accent,
              border:`1px solid ${_theme.accent}40`, borderRadius:20,
              padding:"2px 10px", fontSize:11, fontWeight:700 }}>
              {managerMessages.length} messages
            </span>
          )}
        </div>

        {/* Compose area */}
        <div style={{ background:_theme.surface, borderRadius:10,
          padding:"14px 16px", marginBottom:14, border:`1px solid ${_theme.cardBorder}` }}>

          {/* Message type + target row */}
          <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
            {/* Type buttons */}
            <div style={{ display:"flex", gap:6 }}>
              {[
                { k:"shoutout",    icon:"🌟", label:"Recognition" },
                { k:"motivation",  icon:"🚀", label:"Motivation" },
                { k:"reminder",    icon:"📌", label:"Reminder" },
              ].map(({k,icon,label}) => (
                <button key={k} onClick={()=>setMsgType(k)}
                  style={{ border:`1.5px solid ${msgType===k?_theme.accent:_theme.cardBorder}`,
                    borderRadius:8, padding:"5px 12px", fontSize:12, cursor:"pointer",
                    fontWeight:700, background:msgType===k?_theme.accent+"22":"transparent",
                    color:msgType===k?_theme.accent:_theme.textMuted, transition:"all 0.12s" }}>
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* Target selector */}
            <select value={msgTarget} onChange={e=>setMsgTarget(e.target.value)}
              style={{ ...I({ width:180, marginBottom:0, fontSize:12 }) }}>
              <option value="all">👥 Entire Team</option>
              {employees.filter(e=>e.role!=="Agent"||true).map(e=>(
                <option key={e.id} value={e.name}>{e.name}</option>
              ))}
            </select>
          </div>

          {/* Text input */}
          <textarea
            value={msgText}
            onChange={e=>setMsgText(e.target.value)}
            rows={3}
            placeholder={
              msgType==="shoutout"   ? "Write a recognition message..." :
              msgType==="motivation" ? "Write a motivational message..." :
                                      "Write a reminder..."
            }
            style={{ ...I(), resize:"vertical", marginBottom:10, fontSize:13 }}
            onKeyDown={e=>{ if(e.ctrlKey&&e.key==="Enter") sendManagerMessage(); }}
          />

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:11, color:_theme.textMuted }}>
              Ctrl+Enter to send
            </span>
            <button onClick={sendManagerMessage} disabled={!msgText.trim()}
              style={{ background: msgSaved?"#10B981":msgText.trim()?_theme.accent:"#374151",
                color:"#fff", border:"none", borderRadius:8, padding:"9px 24px",
                fontSize:13, cursor:msgText.trim()?"pointer":"default",
                fontWeight:700, transition:"all 0.2s",
                opacity: msgText.trim()?1:0.5 }}>
              {msgSaved ? "✅ Sent!" : "📤 Send"}
            </button>
          </div>
        </div>

        {/* Previous messages list */}
        {managerMessages.length > 0 ? (
          <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:320, overflowY:"auto" }}>
            {managerMessages.slice(0,10).map(m => {
              const typeConfig = {
                shoutout:   { icon:"🌟", color:"#F59E0B", label:"Recognition" },
                motivation: { icon:"🚀", color:_theme.primary, label:"Motivation" },
                reminder:   { icon:"📌", color:"#8B5CF6", label:"Reminder" },
              }[m.msgType||"shoutout"] || { icon:"💬", color:_theme.accent, label:"Message" };

              return (
                <div key={m.id} style={{ background:_theme.surface,
                  border:`1px solid ${typeConfig.color}30`,
                  borderLeft:`3px solid ${typeConfig.color}`,
                  borderRadius:8, padding:"10px 14px",
                  display:"flex", gap:12, alignItems:"flex-start" }}>
                  <span style={{ fontSize:20, flexShrink:0, marginTop:2 }}>{typeConfig.icon}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8,
                      marginBottom:5, flexWrap:"wrap" }}>
                      <span style={{ fontSize:11, fontWeight:700,
                        background:typeConfig.color+"22", color:typeConfig.color,
                        borderRadius:6, padding:"1px 8px" }}>{typeConfig.label}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:_theme.text }}>
                        {m.from || "Supervisor"}
                      </span>
                      <span style={{ fontSize:11, color:_theme.textMuted }}>→</span>
                      <span style={{ fontSize:11, color:typeConfig.color, fontWeight:600 }}>
                        {m.target==="all"?"👥 Entire Team":m.target}
                      </span>
                      <span style={{ fontSize:10, color:_theme.textMuted, marginLeft:"auto" }}>
                        {m.date} · {m.time}
                      </span>
                    </div>
                    <div style={{ fontSize:13, color:_theme.text, lineHeight:1.6,
                      whiteSpace:"pre-wrap" }}>{m.text}</div>
                  </div>
                  <button onClick={()=>deleteMessage(m.id)}
                    style={{ background:"none", border:`1px solid ${_theme.danger}40`,
                      color:_theme.danger, borderRadius:5, padding:"2px 7px",
                      cursor:"pointer", fontSize:11, flexShrink:0 }}>✕</button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"20px", color:_theme.textMuted, fontSize:13 }}>
            <div style={{ fontSize:28, marginBottom:6 }}>💬</div>
            No messages sent yet — start motivating your team!
          </div>
        )}
      </div>

      {/* ── Data Edit History ── */}
      <div style={{ background:_theme.card, borderRadius:12, padding:"16px 20px",
        border:`2px solid #6366F130`, marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
          <span style={{ fontSize:16 }}>🔒</span>
          <span style={{ fontWeight:800, fontSize:14, color:_theme.text }}>Data Change Log</span>
          <span style={{ fontSize:12, color:_theme.textMuted }}>— All changes logged · Cannot be deleted</span>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8, marginBottom:14 }}>
          {Object.entries(userEditCounts).sort((a,b)=>b[1]-a[1]).map(([user, count]) => {
            const lastEntry = editHistory.filter(l=>l.by===user).sort((a,b)=>b.ts.localeCompare(a.ts))[0];
            const roleColor2 = ROLE_COLORS[lastEntry?.role]||"#64748B";
            return (
              <div key={user} style={{ background:_theme.surface, borderRadius:8, padding:"10px 12px",
                border:`1.5px solid ${roleColor2}30`, cursor:"pointer" }}
                onClick={()=>{ setFilterUser(user); setShowHistoryFor(user); }}>
                <div style={{ fontWeight:700, fontSize:13, color:_theme.text }}>{user}</div>
                <div style={{ fontSize:11, color:roleColor2, fontWeight:600, marginTop:2 }}>
                  {ROLE_ICONS[lastEntry?.role]||"👤"} {lastEntry?.role}
                </div>
                <div style={{ fontSize:12, color:"#6366F1", fontWeight:700, marginTop:4 }}>
                  {count} changes
                </div>
                {lastEntry && (
                  <div style={{ fontSize:10, color:_theme.textMuted, marginTop:2 }}>
                    Last edit: {new Date(lastEntry.ts).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"Asia/Riyadh"})} {new Date(lastEntry.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}
                  </div>
                )}
              </div>
            );
          })}
          {Object.keys(userEditCounts).length === 0 && (
            <div style={{ color:_theme.textMuted, fontSize:13, padding:8 }}>No changes recorded yet.</div>
          )}
        </div>

        {showHistoryFor && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <span style={{ fontWeight:700, fontSize:13, color:"#6366F1" }}>
                📋 Changes for {showHistoryFor}
              </span>
              <button onClick={()=>{ setShowHistoryFor(null); setFilterUser(""); }}
                style={{ background:"none", border:`1px solid ${_theme.cardBorder}`, borderRadius:6,
                  padding:"2px 8px", fontSize:12, cursor:"pointer", color:_theme.textMuted }}>✕ Close</button>
            </div>
            <div style={{ maxHeight:260, overflowY:"auto" }}>
              {editHistory.filter(l=>l.by===showHistoryFor).map((log,i) => (
                <div key={log.id||i} style={{ display:"flex", gap:12, padding:"8px 0",
                  borderBottom:`1px solid ${_theme.cardBorder}`, alignItems:"flex-start" }}>
                  <div style={{ fontSize:10, color:_theme.textMuted, whiteSpace:"nowrap", paddingTop:2, minWidth:120 }}>
                    {new Date(log.ts).toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"Asia/Riyadh"})}
                    {" "}{new Date(log.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}
                  </div>
                  <div style={{ flex:1 }}>
                    <span style={{ background:"#6366F118", color:"#6366F1", border:"1px solid #6366F130",
                      borderRadius:4, padding:"1px 6px", fontSize:11, fontWeight:600, marginRight:6 }}>
                      {log.action}
                    </span>
                    {log.target && <span style={{ fontSize:12, color:_theme.text, fontWeight:600 }}>{log.target}</span>}
                    {log.detail && <div style={{ fontSize:11, color:_theme.textMuted, marginTop:2 }}>{log.detail}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Live Activity Panel ── */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontWeight:700, fontSize:14, color:_theme.text, marginBottom:10,
          display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          👥 Live User Activity
          <span style={{ fontSize:11, fontWeight:400, color:_theme.textMuted }}>— Based on last recorded action</span>
          <select value={activityFilter} onChange={e=>setActivityFilter(e.target.value)}
            style={{ background:_theme.input, border:`1px solid ${_theme.inputBorder}`,
              borderRadius:6, padding:"5px 9px", fontSize:11, color:_theme.inputText,
              outline:"none", cursor:"pointer", marginLeft:"auto" }}>
            <option value="All">All Users</option>
            <option value="Online">🟢 Active (≤15 min)</option>
            <option value="Offline">⚫ Inactive</option>
          </select>
        </div>
        {lastActivity.length === 0 ? (
          <div style={{ background:_theme.card, border:`1px solid ${_theme.cardBorder}`,
            borderRadius:12, padding:"32px 20px", textAlign:"center", color:_theme.textMuted, fontSize:13 }}>
            <div style={{ fontSize:32, marginBottom:10 }}>📭</div>
            <div style={{ fontWeight:600 }}>No activity recorded yet</div>
            <div style={{ fontSize:12, marginTop:6 }}>Data appears once team members sign in</div>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10 }}>
            {lastActivity.filter(l => {
              if (activityFilter==="All") return true;
              const m = minsAgo(l.ts);
              if (activityFilter==="Online") return m<=15;
              return m>15;
            }).map(l => {
              const dot = statusDot(l.ts);
              const pg  = lastPage[l.by];
              return (
                <div key={l.by} style={{ background:_theme.card, border:`1px solid ${_theme.cardBorder}`,
                  borderRadius:12, padding:"14px 16px",
                  borderLeft:`4px solid ${dot.color}`, position:"relative" }}>
                  <div style={{ position:"absolute", top:12, right:12, display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:dot.color,
                      animation: dot.color==="#10B981" ? "pulse 2s infinite" : "none" }}/>
                    <span style={{ fontSize:10, color:dot.color, fontWeight:700 }}>{dot.label}</span>
                  </div>
                  <div style={{ fontWeight:800, fontSize:14, color:_theme.text, marginBottom:2, paddingRight:64 }}>{l.by}</div>
                  <div style={{ fontSize:11, color: ROLE_COLORS[l.role]||_theme.textMuted, fontWeight:600, marginBottom:8 }}>
                    {ROLE_ICONS[l.role]||"👤"} {l.role}
                  </div>
                  <div style={{ fontSize:12, color:_theme.textSub, marginBottom:4 }}>
                    <span style={{ background:actionColor(l.action)+"22", color:actionColor(l.action),
                      border:`1px solid ${actionColor(l.action)}40`, borderRadius:4,
                      padding:"1px 6px", fontSize:11, fontWeight:600 }}>{l.action}</span>
                  </div>
                  {pg && (
                    <div style={{ fontSize:11, color:_theme.textMuted, marginBottom:4 }}>
                      📄 Last page: <strong style={{color:_theme.primary}}>{pg.target}</strong>
                    </div>
                  )}
                  <div style={{ fontSize:11, color:_theme.textMuted, marginTop:4, display:"flex", alignItems:"center", gap:4 }}>
                    🕐 {timeAgoLabel(l.ts)}
                    <span>·</span>
                    <span>{new Date(l.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Full Audit Log ── */}
      <div style={{ background:_theme.surface, borderRadius:10, padding:"12px 16px",
        marginBottom:14, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap",
        border:`1px solid ${_theme.cardBorder}` }}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>🔍 Full Audit Log</span>
        <select value={filterUser} onChange={e=>setFilterUser(e.target.value)}
          style={{ background:_theme.input, border:`1px solid ${_theme.inputBorder}`, borderRadius:6,
            padding:"7px 11px", fontSize:13, color:_theme.inputText, outline:"none", width:180 }}>
          <option value="">All Users</option>
          {users.map(u=><option key={u}>{u}</option>)}
        </select>
        <select value={filterAction} onChange={e=>setFilterAction(e.target.value)}
          style={{ background:_theme.input, border:`1px solid ${_theme.inputBorder}`, borderRadius:6,
            padding:"7px 11px", fontSize:13, color:_theme.inputText, outline:"none", width:180 }}>
          <option value="">All Actions</option>
          {actions.map(a=><option key={a}>{a}</option>)}
        </select>
        <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)}
          style={{ background:_theme.input, border:`1px solid ${_theme.inputBorder}`, borderRadius:6,
            padding:"7px 11px", fontSize:13, color:_theme.inputText, outline:"none", width:150 }}/>
        {(filterUser||filterAction||filterDate) && (
          <button onClick={()=>{setFilterUser("");setFilterAction("");setFilterDate("");}}
            style={{ background:"#94A3B8", color:"#fff", border:"none", borderRadius:8,
              padding:"7px 12px", fontSize:12, cursor:"pointer", fontWeight:600 }}>✕ Clear</button>
        )}
        <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:_theme.textMuted, cursor:"pointer" }}>
          <input type="checkbox" checked={hidePageViews} onChange={e=>setHidePageViews(e.target.checked)}/>
          Hide page views
        </label>
        <span style={{ fontSize:12, color:_theme.textMuted, marginLeft:"auto" }}>{filtered.length} records</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background:_theme.card, border:`1px solid ${_theme.cardBorder}`,
          borderRadius:12, textAlign:"center", padding:"48px 20px", color:_theme.textMuted }}>
          <div style={{ fontSize:32, marginBottom:12 }}>📭</div>
          <div style={{ fontWeight:600, fontSize:14 }}>No records match the filter</div>
          <div style={{ fontSize:12, marginTop:6 }}>Activity appears once users make changes</div>
        </div>
      ) : (
        <div style={{ background:_theme.card, border:`1px solid ${_theme.cardBorder}`,
          borderRadius:12, padding:"16px 20px" }}>
          {filtered.map((log, i) => {
            const dt = new Date(log.ts);
            return (
              <div key={log.id||i} style={{ display:"flex", gap:14, padding:"10px 0",
                borderBottom: i<filtered.length-1?`1px solid ${_theme.cardBorder}`:"none", alignItems:"flex-start" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, flexShrink:0, paddingTop:4 }}>
                  <div style={{ width:9, height:9, borderRadius:"50%", background:actionColor(log.action) }}/>
                  {i<filtered.length-1 && <div style={{ width:2, flex:1, minHeight:16, background:_theme.cardBorder }}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:2 }}>
                    <span style={{ background:actionColor(log.action)+"22", color:actionColor(log.action),
                      border:`1px solid ${actionColor(log.action)}40`, borderRadius:6,
                      padding:"2px 8px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{log.action}</span>
                    <span style={{ fontWeight:700, fontSize:13, color:_theme.text }}>{log.by}</span>
                    <span style={{ fontSize:11, color: ROLE_COLORS[log.role]||_theme.textMuted, fontWeight:600 }}>{ROLE_ICONS[log.role]||""} {log.role}</span>
                    <span style={{ marginLeft:"auto", fontSize:11, color:_theme.textMuted, whiteSpace:"nowrap" }}>
                      {dt.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",timeZone:"Asia/Riyadh"})} · {dt.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}
                    </span>
                  </div>
                  {log.target && log.action!=="Page View" && (
                    <div style={{ fontSize:12, color:_theme.textSub }}>👤 <strong>{log.target}</strong></div>
                  )}
                  {log.detail && <div style={{ fontSize:12, color:_theme.textMuted, marginTop:1 }}>{log.detail}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ─── CRITICAL ALERT POPUP ─────────────────────────────────────────────────────
function CriticalAlertPopup({ onDismiss, alerts }) {
  if (!alerts || !alerts.length) return null;
  return (
      <div style={{ background:_theme.card, borderRadius:16, maxWidth:460, width:"100%",
        border:"2px solid #EF4444", boxShadow:"0 0 40px rgba(239,68,68,0.4)",
        overflow:"hidden" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#7F1D1D,#991B1B)",
          padding:"20px 24px", display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ fontSize:36, animation:"pulse 1s infinite" }}>🚨</div>
          <div>
            <div style={{ color:"#FEF2F2", fontWeight:800, fontSize:18, letterSpacing:-0.3 }}>
              Critical Alert
            </div>
            <div style={{ color:"#FCA5A5", fontSize:12, marginTop:2 }}>
              Requires immediate supervisor action
            </div>
          </div>
          <div style={{ marginLeft:"auto", background:"rgba(255,255,255,0.15)",
            borderRadius:8, padding:"2px 8px", fontSize:11, color:"#FEF2F2", fontWeight:700 }}>
            {new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}
          </div>
        </div>
        {/* Alerts list */}
        <div style={{ padding:"16px 20px", maxHeight:280, overflowY:"auto" }}>
          {alerts.map((a,i) => (
            <div key={i} style={{ display:"flex", gap:12, padding:"10px 0",
              borderBottom: i<alerts.length-1?`1px solid ${_theme.cardBorder}`:"none" }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{a.icon||"⚠️"}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:_theme.text }}>{a.title}</div>
                <div style={{ fontSize:12, color:_theme.textSub, marginTop:3 }}>{a.detail}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Action buttons */}
        <div style={{ padding:"14px 20px", display:"flex", gap:10,
          borderTop:`1px solid ${_theme.cardBorder}` }}>
          <button onClick={onDismiss}
            style={{ flex:1, background:"#EF4444", color:"#fff", border:"none",
              borderRadius:8, padding:"11px", fontSize:14, cursor:"pointer",
              fontWeight:700 }}>
            ✓ Acknowledged
          </button>
          <button onClick={onDismiss}
            style={{ background:_theme.surface, color:_theme.textMuted,
              border:`1px solid ${_theme.cardBorder}`, borderRadius:8,
              padding:"11px 16px", fontSize:13, cursor:"pointer" }}>
            Dismiss
          </button>
        </div>
      </div>
  );
}


// ─── LEADERBOARD PAGE (Agent view) ────────────────────────────────────────────
function LeaderboardPage({ employees, schedule, performance, session, notes, setNotes, canEdit }) {
  const [tick, setTick]       = useState(0);
  const [lbPeriod, setLbPeriod] = useState("today");
  useEffect(() => {
    const t = setInterval(() => setTick(p => p+1), 60000);
    return () => clearInterval(t);
  }, []);

  const isAgentView = session?.role === "Agent";
  const todayKey = todayStr();
  const dayName  = DAYS[new Date().getDay()];

  const todayEmps = employees.filter(e => {
    const v = (schedule[e.id]||{})[dayName];
    return v && v !== "OFF";
  });

  const periodDates = lbPeriod==="today" ? [todayKey] :
    lbPeriod==="week" ? Array.from({length:7},(_,i)=>{
      const d=new Date(); d.setDate(d.getDate()-6+i); return d.toISOString().slice(0,10);
    }) :
    Array.from({length:new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()},(_,i)=>{
      const d=new Date(); d.setDate(1+i); return d.toISOString().slice(0,10);
    });

  const sorted = [...todayEmps]
    .map(e => {
      const closed = periodDates.reduce((s,dk)=>s+((performance[dk]||{})[e.id]?.closed||0),0);
      const esc    = periodDates.reduce((s,dk)=>s+((performance[dk]||{})[e.id]?.escalations||0),0);
      return { ...e, perf: { closed, escalations: esc } };
    })
    .sort((a,b) => (b.perf.closed||0) - (a.perf.closed||0));

  const totalClosed = sorted.reduce((s,e)=>s+(e.perf.closed||0),0);
  const myData      = sorted.find(e=>e.name===session?.name);
  const myRank      = myData ? sorted.indexOf(myData)+1 : null;
  const medals      = ["🥇","🥈","🥉"];

  // Agent sees only their own card + manager messages for them
  const displaySorted = isAgentView ? sorted.filter(e=>e.name===session?.name) : sorted;

  // Manager messages — show all + ones targeting this employee
  const allNotes = Array.isArray(notes) ? notes : [];
  // Manager messages filter:
  // - "all" messages → visible to everyone
  // - targeted messages → visible ONLY to the target person (or sender/supervisors)
  const managerMessages = allNotes
    .filter(n => {
      if (n.tag !== "Manager Message") return false;
      const isAll      = !n.target || n.target === "all";
      const isForMe    = n.target === session?.name;
      const isSentByMe = n.from === session?.name;
      return isAll || isForMe || isSentByMe;
    })
    .sort((a,b) => b.ts.localeCompare(a.ts))
    .slice(0, 10);

  const typeConfig = (t) => ({
    shoutout:   { icon:"🌟", color:"#F59E0B", label:"Recognition" },
    motivation: { icon:"🚀", color:_theme.primary, label:"Motivation" },
    reminder:   { icon:"📌", color:"#8B5CF6", label:"Reminder" },
  }[t||"shoutout"] || { icon:"💬", color:_theme.accent, label:"Message" });

  return (
    <div>
      {/* Header banner */}
      <div style={{ background:`linear-gradient(135deg,${_theme.primary}22,${_theme.accent}22)`,
        border:`1.5px solid ${_theme.primary}30`, borderRadius:16,
        padding:"24px 28px", marginBottom:20, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🏆</div>
        <div style={{ fontWeight:800, fontSize:22, color:_theme.text, marginBottom:4 }}>
          Today's Leaderboard
        </div>
        <div style={{ fontSize:13, color:_theme.textMuted }}>
          {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",timeZone:"Asia/Riyadh"})}
          &nbsp;·&nbsp; {todayEmps.length} employees scheduled · {totalClosed} cases closed
        </div>
        {/* Period tabs */}
        <div style={{ display:"flex", gap:6, marginTop:12, justifyContent:"center" }}>
          {[["today","📅 Today"],["week","📈 Week"],["month","🗓️ Month"]].map(([k,l])=>(
            <button key={k} onClick={()=>setLbPeriod(k)}
              style={{ border:`2px solid ${lbPeriod===k?_theme.primary:"#CBD5E1"}`,
                borderRadius:20, padding:"5px 16px", fontSize:12, cursor:"pointer", fontWeight:700,
                background:lbPeriod===k?_theme.primary:"transparent",
                color:lbPeriod===k?"#fff":_theme.textSub }}>
              {l}
            </button>
          ))}
        </div>
        {myRank && (
          <div style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:8,
            background:`${_theme.primary}22`, border:`1px solid ${_theme.primary}40`,
            borderRadius:20, padding:"6px 18px" }}>
            <span style={{ fontSize:18 }}>{medals[myRank-1]||"🎯"}</span>
            <span style={{ fontSize:13, fontWeight:700, color:_theme.primary }}>
              Your Rank Today: #{myRank}
            </span>
            {myData?.perf?.closed > 0 && (
              <span style={{ fontSize:12, color:_theme.textMuted }}>
                · {myData.perf.closed} cases closed
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Manager Messages — shown to employees ── */}
      {managerMessages.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
          {managerMessages.map(m => {
            const cfg = typeConfig(m.msgType);
            const isPersonal = m.target === session?.name;
            return (
              <div key={m.id} style={{
                background: isPersonal
                  ? `linear-gradient(135deg,${cfg.color}18,${_theme.card})`
                  : _theme.card,
                border:`1.5px solid ${cfg.color}${isPersonal?"60":"30"}`,
                borderRadius:12, padding:"14px 18px",
                display:"flex", gap:12, alignItems:"flex-start",
                boxShadow: isPersonal?`0 4px 16px ${cfg.color}20`:"none",
                animation: isPersonal?"fadeIn 0.4s ease":"none"
              }}>
                <div style={{ fontSize:28, flexShrink:0 }}>{cfg.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8,
                    marginBottom:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:700,
                      background:cfg.color+"22", color:cfg.color,
                      borderRadius:20, padding:"2px 10px" }}>{cfg.label}</span>
                    {isPersonal && (
                      <span style={{ fontSize:11, fontWeight:700,
                        background:_theme.primary+"22", color:_theme.primary,
                        borderRadius:20, padding:"2px 10px" }}>🎯 Personal</span>
                    )}
                    <span style={{ fontSize:11, color:_theme.textMuted, fontWeight:600 }}>
                      From: {m.from||"Management"}
                    </span>
                    <span style={{ fontSize:10, color:_theme.textMuted, marginLeft:"auto" }}>
                      {m.time}
                    </span>
                  </div>
                  <div style={{ fontSize:14, color:_theme.text,
                    fontWeight: isPersonal?600:400,
                    lineHeight:1.7, whiteSpace:"pre-wrap" }}>
                    {m.text}
                  </div>
                </div>
                {/* Delete button — only for sender or canEdit */}
                {(canEdit || m.from === session?.name) && setNotes && (
                  <button
                    onClick={()=>{
                      if (!window.confirm("Delete this message?")) return;
                      setNotes(prev=>(Array.isArray(prev)?prev:[]).filter(n=>n.id!==m.id));
                    }}
                    title="Delete message"
                    style={{ background:"none", border:"none", color:"#94A3B8",
                      cursor:"pointer", fontSize:16, padding:"4px", flexShrink:0,
                      alignSelf:"flex-start" }}>🗑️</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Leave Requests (submit for agents, view status) ── */}
      <LeaveRequestsPanel
        session={session}
        employees={employees}
        schedule={schedule}
        setSchedule={()=>{}}
        notes={notes}
        setNotes={canEdit ? ()=>{} : ()=>{}}
        canEdit={false}
      />

      {/* ── GRAND LINE: Wanted Poster Mode ── */}
      {_theme.isGrandLine && displaySorted.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:22, fontWeight:900, color:"#F02D2D",
              textShadow:"0 0 15px rgba(240,45,45,0.6)", letterSpacing:2 }}>
              ⚓ GRAND LINE BOUNTY BOARD ⚓
            </div>
            <div style={{ fontSize:11, color:"#4A7A95", marginTop:4 }}>
              Marine HQ · Most Wanted Pirates
            </div>
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
            {displaySorted.slice(0,6).map((e,ri) => {
              const bounty = (e.perf.closed||0)*1000 + (ri===0?50000:ri===1?20000:ri===2?10000:0);
              const isMe = e.name===session?.name;
              const rank = ri+1;
              return (
                <div key={e.id} style={{
                  width:150, background:"linear-gradient(180deg,#D4A843,#C8952A,#A07020)",
                  borderRadius:8, padding:"12px 10px", textAlign:"center",
                  boxShadow: isMe
                    ? "0 0 20px rgba(240,45,45,0.6), 0 4px 16px rgba(0,0,0,0.6)"
                    : "0 4px 16px rgba(0,0,0,0.5)",
                  border: isMe ? "3px solid #F02D2D" : "2px solid #8B6520",
                  position:"relative", transform:ri===0?"scale(1.08)":"scale(1)",
                  transition:"transform 0.2s"
                }}>
                  {/* WANTED header */}
                  <div style={{ fontSize:9, fontWeight:900, color:"#3D1A00", letterSpacing:4,
                    marginBottom:4, textTransform:"uppercase" }}>⚓ WANTED ⚓</div>
                  {/* Avatar placeholder */}
                  <div style={{ width:70, height:70, borderRadius:4, margin:"0 auto 8px",
                    background:"linear-gradient(135deg,#8B6520,#5A3A0A)",
                    border:"2px solid #5A3A0A", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:32 }}>
                    {ROLE_ICONS[e.role]||"🏴‍☠️"}
                  </div>
                  {/* Name */}
                  <div style={{ fontSize:11, fontWeight:900, color:"#1A0800",
                    marginBottom:4, lineHeight:1.2 }}>
                    {e.name.split(" ").slice(0,2).join(" ")}
                  </div>
                  {/* Rank */}
                  <div style={{ fontSize:9, color:"#3D1A00", marginBottom:6 }}>
                    {["🥇","🥈","🥉"][ri]||`#${rank}`} · {e.role}
                  </div>
                  {/* BOUNTY */}
                  <div style={{ background:"rgba(0,0,0,0.25)", borderRadius:4,
                    padding:"4px 6px", marginBottom:6 }}>
                    <div style={{ fontSize:8, color:"#D4A843", fontWeight:700, letterSpacing:1 }}>BOUNTY</div>
                    <div style={{ fontSize:14, fontWeight:900, color:"#FFD700",
                      textShadow:"0 0 8px rgba(255,215,0,0.5)" }}>
                      {bounty.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize:7, color:"#3D1A00", fontWeight:700, letterSpacing:1 }}>
                    DEAD OR ALIVE
                  </div>
                  {/* Red stamp for #1 */}
                  {rank===1 && (
                    <div style={{ position:"absolute", top:8, right:8, fontSize:22,
                      transform:"rotate(15deg)", filter:"drop-shadow(0 0 4px rgba(240,45,45,0.8))" }}>
                      🔴
                    </div>
                  )}
                  {isMe && (
                    <div style={{ position:"absolute", bottom:-8, left:"50%", transform:"translateX(-50%)",
                      background:"#F02D2D", color:"#fff", borderRadius:20, padding:"2px 10px",
                      fontSize:9, fontWeight:900, whiteSpace:"nowrap" }}>
                      ← YOU
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top 3 podium — normal themes */}
      {!_theme.isGrandLine && displaySorted.slice(0,3).some(e=>e.perf.closed>0) && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr 1fr",
          gap:10, marginBottom:20, alignItems:"flex-end" }}>
          {[displaySorted[1], displaySorted[0], displaySorted[2]].map((e,pi) => {
            if (!e) return <div key={pi}/>;
            const isMe = e.name === session?.name;
            const podiumH = [100, 130, 80][pi];
            const podiumC = ["#9CA3AF","#F59E0B","#CD7F32"][pi];
            const rank    = [2,1,3][pi];
            return (
              <div key={e.id} style={{ textAlign:"center" }}>
                <div style={{ fontSize:isMe?18:14, fontWeight:700,
                  color: isMe?_theme.primary:_theme.text, marginBottom:4 }}>
                  {medals[rank-1]} {e.name.split(" ")[0]}
                  {isMe && <span style={{ fontSize:11, color:_theme.primary }}> (You)</span>}
                </div>
                <div style={{ fontSize:11, color:_theme.textMuted, marginBottom:6 }}>
                  {e.perf.closed} cases
                </div>
                <div style={{ height:podiumH, background:`linear-gradient(180deg,${podiumC},${podiumC}88)`,
                  borderRadius:"8px 8px 0 0", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:28,
                  border:`2px solid ${isMe?_theme.primary:podiumC}`,
                  boxShadow: isMe?`0 0 16px ${_theme.primary}40`:"none" }}>
                  {medals[rank-1]}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full ranking table */}
      <div style={CRD()}>
        <div style={{ fontWeight:700, fontSize:14, color:_theme.text, marginBottom:14 }}>
          📋 Full Ranking Today
        </div>
        {displaySorted.map((e, ri) => {
          const isMe    = e.name === session?.name;
          const maxClosed = displaySorted[0]?.perf?.closed||1;
          const pct     = maxClosed > 0 ? Math.round((e.perf.closed||0)/maxClosed*100) : 0;
          return (
            <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12,
              padding:"10px 0", borderBottom: ri<displaySorted.length-1?`1px solid ${_theme.cardBorder}`:"none",
              background: isMe?`${_theme.primary}08`:"transparent",
              borderRadius: isMe?8:0, paddingLeft: isMe?10:0, paddingRight: isMe?10:0 }}>
              <div style={{ fontSize:18, minWidth:30, textAlign:"center" }}>
                {medals[ri]||<span style={{fontSize:12,color:_theme.textMuted}}>#{ri+1}</span>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, flexWrap:"wrap" }}>
                  <span style={{ fontWeight: isMe?800:600, fontSize:13,
                    color: isMe?_theme.primary:_theme.text }}>
                    {e.name}
                    {isMe && <span style={{ marginLeft:6, fontSize:10,
                      background:_theme.primary+"22", color:_theme.primary,
                      borderRadius:8, padding:"1px 6px" }}>You</span>}
                  </span>
                  <span style={{ fontSize:11, color:ROLE_COLORS[e.role]||_theme.textMuted,
                    fontWeight:600 }}>{e.role}</span>
                </div>
                {(() => {
                  const autoBadges = detectBadges(e.id, performance, {}, employees, []);
                  const manualBadges = (Array.isArray(notes)?notes:[])
                    .filter(n=>n.tag==="Badge Award")
                    .map(n=>{try{const d=JSON.parse(n.text||"{}");return d.empId===e.id?d.badgeId:null;}catch{return null;}})
                    .filter(Boolean);
                  const all=[...new Set([...autoBadges,...manualBadges])];
                  return all.length>0?<BadgesDisplay badgeIds={all} size="small"/>:null;
                })()}
                <div style={{ background:_theme.surface, borderRadius:20, height:6,
                  overflow:"hidden", maxWidth:200 }}>
                  <div style={{ width:`${pct}%`, height:"100%",
                    background: isMe?_theme.primary:"#10B981",
                    borderRadius:20, transition:"width 0.5s" }}/>
                </div>
              </div>
              <div style={{ textAlign:"right", minWidth:60 }}>
                <div style={{ fontSize:18, fontWeight:800,
                  color: e.perf.closed>0?(isMe?_theme.primary:"#10B981"):_theme.textMuted }}>
                  {e.perf.closed||0}
                </div>
                <div style={{ fontSize:10, color:_theme.textMuted }}>Cases</div>
              </div>
            </div>
          );
        })}
        {sorted.every(e=>!e.perf.closed) && (
          <div style={{ textAlign:"center", padding:"32px 20px", color:_theme.textMuted }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🎯</div>
            <div style={{ fontWeight:600 }}>No closed cases recorded today</div>
            <div style={{ fontSize:12, marginTop:4 }}>Results appear once entered by supervisor</div>
          </div>
        )}
      </div>
    </div>
  );
}
// Deferred XLSX load to avoid TDZ issues during module initialization
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    if (!window.XLSX) {
      const _s = document.createElement("script");
      _s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      _s.async = true;
      document.head.appendChild(_s);
    }
  });
}

// Helper: wait for XLSX to be ready (max 5 seconds)
function waitForXLSX() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) { resolve(window.XLSX); return; }
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (window.XLSX) { clearInterval(t); resolve(window.XLSX); }
      else if (tries > 50) { clearInterval(t); reject(new Error("SheetJS failed to load. Please refresh and try again.")); }
    }, 100);
  });
}

// ═══════════════════════════════════════════════════════════
// ─── PUSH NOTIFICATIONS ──────────────────────────────────────────────────────
// Uses browser Notification API + Service Worker showNotification
// No VAPID/server needed — works when app is open or in background (PWA)

async function askPushPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied")  return "denied";
  const result = await Notification.requestPermission();
  return result;
}

function sendPushNotification(title, body, tag = "cs-ops-alert") {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  // Try via Service Worker first (works when app is in background)
  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(title, {
        body,
        tag,           // prevents duplicate notifications with same tag
        icon:  "/icon-192.png",
        badge: "/icon-192.png",
        vibrate: [200, 100, 200],
        requireInteraction: true,  // stays until user taps
        data: { url: "/" },
        actions: [
          { action: "view", title: "Open App" },
          { action: "dismiss", title: "Dismiss" },
        ]
      });
    }).catch(() => {
      // Fallback: direct Notification (only works when app is open)
      new Notification(title, { body, icon: "/icon-192.png", tag });
    });
  } else {
    new Notification(title, { body, icon: "/icon-192.png", tag });
  }
}


// ─── ALERT SOUND SYSTEM (Web Audio API, zero dependencies) ───────────────────
function playAlertSound(type = "critical") {
  if (localStorage.getItem("csops_mute") === "1") return; // muted
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === "critical") {
      // Urgent triple beep — descending tone
      [0, 0.25, 0.5].forEach((t, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880 - i * 110;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.4, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.18);
        osc.start(now + t);
        osc.stop(now + t + 0.2);
      });
    } else {
      // Gentle double ping — warning
      [0, 0.3].forEach(t => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 660;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.25, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.22);
        osc.start(now + t);
        osc.stop(now + t + 0.25);
      });
    }
    setTimeout(() => ctx.close(), 2000);
  } catch {}
}

// Play a subtle "ding" for new messages / info
function playSoftDing() {
  if (localStorage.getItem("csops_mute") === "1") return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 784; // G5
    osc.type = "sine";
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.start(now); osc.stop(now + 0.45);
    setTimeout(() => ctx.close(), 1000);
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════
// SUPABASE - FULL REALTIME (supabase-js v2 from CDN)
// All reads/writes go through the official SDK.
// Realtime subscriptions are set up separately in the App component.
// ═══════════════════════════════════════════════════════════════════════════
const SUPABASE_URL  = "https://ohbgpdsuaointhidnmps.supabase.co";
const SUPABASE_KEY  = "sb_publishable_0CLCyh1yv2I6RcHkSRs1EQ_D3ucGkhH";

// ── Singleton client ─────────────────────────────────────────────────────────
let _supabase = null;

/** Returns the Supabase client. Loads the SDK from CDN if not yet loaded. */
function getDB() {
  if (_supabase) return Promise.resolve(_supabase);
  return new Promise(resolve => {
    // Already loading?
    if (document.getElementById("sb-sdk")) {
      const t = setInterval(() => { if (_supabase) { clearInterval(t); resolve(_supabase); } }, 40);
      return;
    }
    const s   = document.createElement("script");
    s.id      = "sb-sdk";
    s.src     = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
    s.onload  = () => {
      _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        realtime: {
          params: { eventsPerSecond: 20 },
        },
        db: { schema: "public" },
      });
      resolve(_supabase);
    };
    s.onerror = () => resolve(null); // graceful offline fallback
    document.head.appendChild(s);
  });
}

// ── Legacy REST shim  (keeps all existing sb.from() calls working unchanged) ─
// When SDK is ready it uses it; otherwise falls back to raw fetch.
const sb = {
  async from(table) {
    const db = await getDB();
    if (db) {
      // ── SDK path ──────────────────────────────────────────────────────────
      return {
        async select(cols = "*", filterStr = "") {
          let q = db.from(table).select(cols);
          if (filterStr) {
            filterStr.split("&").forEach(f => {
              if      (f.startsWith("order="))    { const [col, dir] = f.slice(6).split("."); q = q.order(col, { ascending: dir === "asc" }); }
              else if (f.startsWith("limit="))    { q = q.limit(Number(f.slice(6))); }
              else if (f.startsWith("date=gte.")) { q = q.gte("date", f.slice(9)); }
            });
          }
          const { data, error } = await q;
          if (error) console.warn("sb.select error", table, error.message);
          return data || [];
        },
        async upsert(rows) {
          const arr = Array.isArray(rows) ? rows : [rows];
          // Per-table primary key (onConflict must match the actual PK)
          const PK = {
            schedule:       "emp_id",
            heatmap:        "date",
            user_passwords: "name",
          };
          const conflictCol = PK[table] || "id";
          const { data, error } = await db.from(table).upsert(arr, { onConflict: conflictCol });
          if (error) console.warn("sb.upsert error", table, conflictCol, error.message);
          return data;
        },
        async insert(rows) {
          const arr = Array.isArray(rows) ? rows : [rows];
          const { data, error } = await db.from(table).insert(arr);
          if (error) console.warn("sb.insert error", table, error.message);
          return data;
        },
        async delete(filterStr) {
          // filterStr format: "col=eq.value"
          const eqMatch = filterStr.match(/^(\w+)=eq\.(.+)$/);
          if (eqMatch) {
            const { error } = await db.from(table).delete().eq(eqMatch[1], eqMatch[2]);
            if (error) console.warn("sb.delete error", table, error.message);
          }
          return true;
        },
      };
    }
    // ── Offline REST fallback (no SDK) ────────────────────────────────────────
    const base = `${SUPABASE_URL}/rest/v1/${table}`;
    const hdrs = { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`,
                   "Content-Type": "application/json", "Prefer": "return=representation" };
    return {
      async select(cols = "*", filterStr = "") {
        const url = `${base}?select=${cols}${filterStr ? "&" + filterStr : ""}`;
        const r   = await fetch(url, { headers: hdrs });
        return r.ok ? r.json() : [];
      },
      async upsert(rows) {
        const r = await fetch(base, { method: "POST",
          headers: { ...hdrs, "Prefer": "resolution=merge-duplicates,return=representation" },
          body: JSON.stringify(Array.isArray(rows) ? rows : [rows]) });
        return r.ok ? r.json() : null;
      },
      async insert(rows) {
        const r = await fetch(base, { method: "POST", headers: hdrs,
          body: JSON.stringify(Array.isArray(rows) ? rows : [rows]) });
        return r.ok ? r.json() : null;
      },
      async delete(filterStr) {
        const r = await fetch(`${base}?${filterStr}`, { method: "DELETE", headers: hdrs });
        return r.ok;
      },
    };
  }
};

// (useSupabaseState removed — state is managed directly in App with Realtime subscriptions)

// ─── PASSWORD SYSTEM (Supabase-backed) ───────────────────────────────────────
const RESET_ADMINS = ["Team Lead", "Shift Leader", "SME", "Mohammed Nasser Althurwi"];
function canResetPasswords(role, name) {
  return RESET_ADMINS.includes(role) || RESET_ADMINS.includes(name);
}

// Local cache for passwords (also stored in Supabase user_passwords table)
// ─── PASSWORD SYSTEM — SHA-256 hashed (Web Crypto API, no library needed) ─────
// Passwords are NEVER stored in plain text — only SHA-256 hashes.
// Comparison: hash(input) === stored_hash  (one-way, irreversible)
// ─────────────────────────────────────────────────────────────────────────────

async function hashPassword(pw) {
  // SHA-256 via built-in Web Crypto API
  const encoded = new TextEncoder().encode(pw);
  const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, "0")).join("");
}

function getPwStore() {
  try { return JSON.parse(localStorage.getItem("csops_passwords")||"{}"); } catch { return {}; }
}
function setPwStore(obj) {
  try { localStorage.setItem("csops_passwords", JSON.stringify(obj)); } catch {}
}

// Returns the stored hash (or null if no password set)
function getUserPw(name) { return getPwStore()[name] || null; }

// Stores a hashed password
async function setUserPw(name, pw) {
  const hash = await hashPassword(pw);
  const s = getPwStore(); s[name] = hash; setPwStore(s);
  try {
    const t = await sb.from("user_passwords");
    // Store only the hash — never the plain password
    await t.upsert({ name, password: hash, updated_at: new Date().toISOString() });
  } catch {}
}

async function resetUserPw(name) {
  const s = getPwStore(); delete s[name]; setPwStore(s);
  try {
    const t = await sb.from("user_passwords");
    await t.delete(`name=eq.${encodeURIComponent(name)}`);
  } catch {}
}

// Load password HASHES from Supabase — waits for SDK to be ready
// Deferred until after full module initialization to avoid TDZ errors
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    getDB().then(async () => {
      try {
        const t = await sb.from("user_passwords");
        const rows = await t.select();
        if (Array.isArray(rows) && rows.length > 0) {
          const obj = {};
          rows.forEach(r => { obj[r.name] = r.password; }); // hashes only
          setPwStore(obj);
        }
      } catch {}
    });
  });
}


// ─── DAILY TIPS ───────────────────────────────────────────────────────────────
const DAILY_TIPS_EN = [
  "💡 Start each shift with a quick team check-in to align priorities.",
  "📊 Document escalations immediately — details fade fast.",
  "☕ A proactive break schedule reduces errors by up to 30%.",
  "🎯 Clear queue data = better staffing decisions tomorrow.",
  "⭐ Recognition boosts productivity — acknowledge good work daily.",
  "🔄 Review yesterday's performance before today's planning.",
  "📱 Keep the team informed — communication prevents most issues.",
];


// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────

// ─── EMPLOYEE ATTENDANCE HISTORY PAGE ────────────────────────────────────────
function AttendanceHistoryPage({ employees, schedule, shifts, attendance }) {
  const [selectedEmp, setSelectedEmp] = useState("");
  const [month, setMonth]             = useState(new Date().toISOString().slice(0,7));
  const [search, setSearch]           = useState("");

  const [y, m] = month.split("-").map(Number);
  const dates  = monthDates(y, m-1);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const emp = employees.find(e => e.id === selectedEmp);

  // Stats for selected employee
  const stats = useMemo(() => {
    if (!emp) return null;
    let present=0, absent=0, late=0, earlyLeave=0, dayOff=0, totalLateMin=0, totalWorkMin=0, workDays=0;
    dates.forEach(d => {
      const dayName = DAYS[new Date(d+"T12:00:00").getDay()];
      const sid     = (schedule[emp.id]||{})[dayName];
      if (!sid || sid==="OFF" || sid==="LEAVE" || sid==="PH") { dayOff++; return; }
      workDays++;
      const att = ((attendance[d]||{})[emp.id]) || { status:"Present" };
      if      (isPresent(att.status))      present++;
      else if (isAbsent(att.status))       absent++;
      // Late already counted in isPresent
      else if (att.status==="Early Leave") earlyLeave++;
      totalLateMin  += att.lateMin||0;
      totalWorkMin  += Number(att.workDuration)||0;
    });
    const attRate = workDays > 0 ? Math.round(((workDays-absent)/workDays)*100) : 0;
    const avgWork = workDays > 0 ? Math.round(totalWorkMin/workDays) : 0;
    return { present, absent, late, earlyLeave, dayOff, totalLateMin, workDays, attRate, avgWork };
  }, [emp, dates, schedule, attendance]);

  function statusColor(s) {
    if (s==="Present")     return "#10B981";
    if (s==="Absent")      return "#EF4444";
    if (s==="Late")        return "#F59E0B";
    if (s==="Early Leave") return "#8B5CF6";
    return "#94A3B8";
  }
  function statusIcon(s) {
    if (s==="Present")     return "✅";
    if (s==="Absent")      return "❌";
    if (s==="Late")        return "⏰";
    if (s==="Early Leave") return "🔆";
    return "—";
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>📆 Individual Attendance History</span>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          style={{ ...I({width:200}) }} placeholder="🔍 Search employee..."/>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)}
          style={{ ...I({width:160}) }}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:14, alignItems:"start" }}>
        {/* Employee list */}
        <div style={{ ...CRD({padding:0}), overflow:"hidden", maxHeight:"80vh", overflowY:"auto" }}>
          <div style={{ padding:"10px 14px", fontWeight:700, fontSize:12,
            color:_theme.textMuted, borderBottom:`1px solid ${_theme.cardBorder}` }}>
            {filtered.length} employees
          </div>
          {filtered.map(e => (
            <div key={e.id} onClick={()=>setSelectedEmp(e.id)}
              style={{ padding:"10px 14px", cursor:"pointer",
                background: selectedEmp===e.id ? _theme.primary+"22" : "transparent",
                borderBottom:`1px solid ${_theme.cardBorder}20`,
                borderRight: selectedEmp===e.id ? `3px solid ${_theme.primary}` : "3px solid transparent",
                transition:"all 0.1s" }}>
              <div style={{ fontWeight:600, fontSize:13, color:_theme.text }}>{e.name}</div>
              <div style={{ fontSize:11, color:ROLE_COLORS[e.role]||_theme.textMuted }}>{e.role}</div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {!emp ? (
          <div style={{ ...CRD(), textAlign:"center", padding:"60px 20px", color:_theme.textMuted }}>
            <div style={{ fontSize:40, marginBottom:12 }}>👤</div>
            <div style={{ fontWeight:600 }}>Select an employee to view attendance history</div>
          </div>
        ) : (
          <div>
            {/* Employee header */}
            <div style={{ ...CRD({padding:"14px 18px"}), marginBottom:12,
              borderRight:`4px solid ${ROLE_COLORS[emp.role]||"#64748B"}` }}>
              <div style={{ fontWeight:800, fontSize:16, color:_theme.text }}>{emp.name}</div>
              <div style={{ fontSize:12, color:ROLE_COLORS[emp.role]||_theme.textMuted, fontWeight:600 }}>
                {ROLE_ICONS[emp.role]} {emp.role}
              </div>
            </div>

            {/* KPI strip */}
            {stats && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:8, marginBottom:14 }}>
                {[
                  ["Work Days",  stats.workDays,                        "#3B82F6"],
                  ["Present",        stats.present,                         "#10B981"],
                  ["Absent",        stats.absent,                          "#EF4444"],
                  ["Late",        stats.late,                            "#F59E0B"],
                  ["Early Leave", stats.earlyLeave,                     "#8B5CF6"],
                  ["Attendance Rate", stats.attRate+"%",                     "#0EA5E9"],
                  ["Total Late", stats.totalLateMin+"m",            "#EC4899"],
                  ["Avg Work", Math.floor(stats.avgWork/60)+"h "+stats.avgWork%60+"m", "#14B8A6"],
                ].map(([l,v,c])=>(
                  <div key={l} style={{ ...CRD({padding:"10px 12px"}), borderTop:`3px solid ${c}` }}>
                    <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:600, marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:20, fontWeight:800, color:c }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Monthly calendar grid */}
            <div style={{ ...CRD({padding:0}), overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
                    {["Date","Day","Shift","Status","In","Out","Late","Duration","Note"].map(h=>(
                      <th key={h} style={{ padding:"9px 8px", textAlign:"right", fontWeight:700,
                        color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}`, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dates.map((d,ri) => {
                    const dayName = DAYS[new Date(d+"T12:00:00").getDay()];
                    const sid     = (schedule[emp.id]||{})[dayName];
                    const sh      = shifts.find(s=>s.id===sid);
                    const isOff   = !sid || sid==="OFF";
                    const isWknd  = dayName==="Friday" || dayName==="Saturday";
                    const att     = ((attendance[d]||{})[emp.id]) || null;
                    const status  = att?.status || (isOff?"Day Off":"Present");
                    const today   = d === todayStr();
                    return (
                      <tr key={d} style={{
                        background: today ? _theme.primary+"18" :
                                    isOff ? _theme.surface :
                                    ri%2===0 ? _theme.card : _theme.surface,
                        opacity: isOff ? 0.6 : 1
                      }}>
                        <td style={{ padding:"7px 8px", fontWeight: today?700:400,
                          color: today?_theme.primary:_theme.text }}>{d.slice(5)}</td>
                        <td style={{ padding:"7px 8px", color:isWknd?"#EF4444":_theme.textSub, fontWeight:600 }}>
                          {dayName.slice(0,3)}
                        </td>
                        <td style={{ padding:"7px 8px" }}>
                          {sh ? <span style={{ background:sh.color+"22", color:sh.color,
                            border:`1px solid ${sh.color}40`, borderRadius:5, padding:"1px 7px",
                            fontSize:10, fontWeight:700 }}>{sh.label}</span>
                          : <span style={{ color:_theme.textMuted, fontSize:11 }}>—</span>}
                        </td>
                        <td style={{ padding:"7px 8px" }}>
                          <span style={{ color:statusColor(status), fontWeight:700, fontSize:12 }}>
                            {statusIcon(status)} {status}
                          </span>
                        </td>
                        <td style={{ padding:"7px 8px", color:_theme.textSub, fontSize:11 }}>{att?.checkIn||"—"}</td>
                        <td style={{ padding:"7px 8px", color:_theme.textSub, fontSize:11 }}>{att?.checkOut||"—"}</td>
                        <td style={{ padding:"7px 8px", color:(att?.lateMin||0)>=7?"#EF4444":"#94A3B8",
                          fontWeight:600, fontSize:11 }}>
                          {att?.lateMin > 0 ? att.lateMin+"m" : "—"}
                        </td>
                        <td style={{ padding:"7px 8px", fontSize:11,
                          color: att?.workDuration ? "#10B981" : _theme.textMuted }}>
                          {att?.workDuration
                            ? Math.floor(att.workDuration/60)+"h "+att.workDuration%60+"m"
                            : "—"}
                        </td>
                        <td style={{ padding:"7px 8px", color:_theme.textMuted, fontSize:11,
                          maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {att?.note||"—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LEAVE REQUEST SYSTEM ────────────────────────────────────────────────────
// Employees submit requests, supervisors approve/reject from Attendance page
function LeaveRequestsPanel({ session, employees, schedule, setSchedule, notes, setNotes, canEdit }) {
  const [showForm, setShowForm]   = useState(false);
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate]     = useState(todayStr());
  const [reason, setReason]       = useState("");
  const [saved, setSaved]         = useState("");

  // Who can submit leave requests: Team Lead + Shift Leader + Owner only
  // Agent and SME cannot submit leave requests
  const myRole = session?.role;
  const canSubmitLeave = myRole === "Team Lead" || myRole === "Shift Leader" ||
                         (session && isOwnerUser(session));

  // Leave requests stored as notes with tag "Leave Request"
  const allRequests = (Array.isArray(notes)?notes:[])
    .filter(n => n.tag === "Leave Request")
    .sort((a,b) => b.ts.localeCompare(a.ts));

  // Supervisors see all; others see only their own
  const myName = session?.name;
  const visibleRequests = canEdit
    ? allRequests
    : allRequests.filter(r => r.from === myName);

  // If user cannot submit and has no requests to show — hide panel entirely
  if (!canSubmitLeave && !canEdit && visibleRequests.length === 0) return null;

  const pending  = visibleRequests.filter(r => r.leaveStatus === "pending");
  const approved = visibleRequests.filter(r => r.leaveStatus === "approved");
  const rejected = visibleRequests.filter(r => r.leaveStatus === "rejected");

  // Only canSubmitLeave users can submit
  function submitRequest() {
    if (!canSubmitLeave) return;
    if (!startDate || !endDate || !reason.trim()) { setSaved("❌ Enter date and reason"); return; }
    if (endDate < startDate) { setSaved("❌ End date before start date"); return; }
    const req = {
      id: "lr"+Date.now(), ts: new Date().toISOString(),
      date: startDate, time: pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag: "Leave Request", text: reason.trim(),
      from: myName, target: "all",
      leaveStatus: "pending",
      leaveStart: startDate, leaveEnd: endDate,
      msgType: "leave",
    };
    setNotes(prev => [req, ...(Array.isArray(prev)?prev:[])]);
    setSaved("✅ Request sent — awaiting approval");
    setReason(""); setShowForm(false);
    setTimeout(() => setSaved(""), 3000);
  }

  function approveRequest(req) {
    // Mark approved
    setNotes(prev => (Array.isArray(prev)?prev:[]).map(n =>
      n.id===req.id ? {...n, leaveStatus:"approved", approvedBy:myName} : n
    ));
    // Apply LEAVE to schedule for each day in range
    const emp = employees.find(e => e.name === req.from);
    if (!emp) return;
    const d = new Date(req.leaveStart+"T12:00:00");
    const end = new Date(req.leaveEnd+"T12:00:00");
    const updates = { ...(schedule[emp.id]||{}) };
    while (d <= end) {
      const dayName = DAYS[d.getDay()];
      updates[dayName] = "LEAVE";
      d.setDate(d.getDate()+1);
    }
    setSchedule(prev => ({ ...prev, [emp.id]: updates }));
  }

  function rejectRequest(req) {
    setNotes(prev => (Array.isArray(prev)?prev:[]).map(n =>
      n.id===req.id ? {...n, leaveStatus:"rejected", rejectedBy:myName} : n
    ));
  }

  function deleteRequest(id) {
    setNotes(prev => (Array.isArray(prev)?prev:[]).filter(n => n.id!==id));
  }

  function statusBadge(status) {
    const map = {
      pending:  { bg:"#FEF3C7", color:"#B45309", label:"Pending ⏳" },
      approved: { bg:"#F0FDF4", color:"#166534", label:"Approved ✅" },
      rejected: { bg:"#FEF2F2", color:"#991B1B", label:"Rejected ❌" },
    };
    const cfg = map[status] || map.pending;
    return (
      <span style={{ background:cfg.bg, color:cfg.color,
        borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
        {cfg.label}
      </span>
    );
  }

  return (
    <div style={{ ...CRD(), marginTop:16 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        <span style={{ fontSize:16 }}>🏖️</span>
        <span style={{ fontWeight:800, fontSize:14, color:_theme.text }}>Leave Requests</span>
        {pending.length > 0 && (
          <span style={{ background:"#FEF3C7", color:"#B45309", border:"1px solid #FCD34D",
            borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
            {pending.length} pending
          </span>
        )}
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          {canSubmitLeave && (
            <button onClick={()=>setShowForm(s=>!s)}
              style={{ ...PBT("#10B981",{padding:"6px 14px",fontSize:12}) }}>
              {showForm ? "✕ Close" : "+ New Leave Request"}
            </button>
          )}
        </div>
      </div>

      {/* Request form (employees only) */}
      {showForm && !canEdit && (
        <div style={{ background:_theme.surface, borderRadius:10, padding:"14px 16px",
          marginBottom:14, border:`1px solid ${_theme.cardBorder}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div>
              <label style={{ ...LBL }}>From</label>
              <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={I()}/>
            </div>
            <div>
              <label style={{ ...LBL }}>To</label>
              <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={I()}/>
            </div>
          </div>
          <label style={{ ...LBL }}>Leave Reason</label>
          <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={2}
            style={{ ...I({resize:"vertical",marginBottom:10}) }}
            placeholder="State leave reason..."/>
          <button onClick={submitRequest} style={{ ...PBT("#10B981",{width:"100%"}) }}>
            📤 Submit
          </button>
          {saved && <div style={{ marginTop:8, fontSize:12, color:saved.startsWith("✅")?"#10B981":"#EF4444",
            fontWeight:600 }}>{saved}</div>}
        </div>
      )}

      {/* Pending requests (supervisors see approve/reject) */}
      {pending.length > 0 && (
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#B45309", marginBottom:8 }}>⏳ Pending ({pending.length})</div>
          {pending.map(r => (
            <div key={r.id} style={{ background:"#FEF3C720", border:"1px solid #FCD34D",
              borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:10, flexWrap:"wrap" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:_theme.text }}>
                    {r.from} {statusBadge(r.leaveStatus)}
                  </div>
                  <div style={{ fontSize:11, color:_theme.textMuted, marginTop:3 }}>
                    📅 {r.leaveStart} → {r.leaveEnd}
                    {r.leaveStart !== r.leaveEnd && ` (${Math.ceil((new Date(r.leaveEnd)-new Date(r.leaveStart))/(864e5))+1} days)`}
                  </div>
                  <div style={{ fontSize:12, color:_theme.text, marginTop:5 }}>{r.text}</div>
                </div>
                {canEdit && (
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <button onClick={()=>approveRequest(r)}
                      style={{ ...PBT("#10B981",{padding:"5px 12px",fontSize:12}) }}>✅ Approve</button>
                    <button onClick={()=>rejectRequest(r)}
                      style={{ ...PBT("#EF4444",{padding:"5px 12px",fontSize:12}) }}>❌ Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {[...approved, ...rejected].length > 0 && (
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:_theme.textMuted, marginBottom:8 }}>History</div>
          {[...approved, ...rejected].slice(0,10).map(r => (
            <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10,
              padding:"8px 12px", borderBottom:`1px solid ${_theme.cardBorder}20`,
              borderRadius:8, marginBottom:4,
              background: r.leaveStatus==="approved"?"#F0FDF408":"#FEF2F208" }}>
              <div style={{ flex:1 }}>
                <span style={{ fontWeight:600, fontSize:12, color:_theme.text }}>{r.from}</span>
                <span style={{ fontSize:11, color:_theme.textMuted, marginRight:6 }}>
                  {" "}· {r.leaveStart} → {r.leaveEnd}
                </span>
                {statusBadge(r.leaveStatus)}
              </div>
              {canEdit && (
                <button onClick={()=>deleteRequest(r.id)}
                  style={{ background:"none", border:`1px solid ${_theme.cardBorder}`,
                    color:_theme.textMuted, borderRadius:5, padding:"2px 7px",
                    cursor:"pointer", fontSize:11 }}>✕</button>
              )}
            </div>
          ))}
        </div>
      )}

      {visibleRequests.length === 0 && (
        <div style={{ textAlign:"center", padding:"24px", color:_theme.textMuted, fontSize:13 }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🏖️</div>
          No leave requests {canEdit ? "" : "— click + to request leave"}
        </div>
      )}
    </div>
  );
}

// ─── CHART HELPERS (SVG, zero dependencies) ───────────────────────────────────
function SparkBar({ values, color="#3B82F6", height=40, width=120 }) {
  if (!values || values.length === 0) return null;
  const max   = Math.max(...values, 1);
  const bw    = Math.floor(width / values.length) - 2;
  const bwMin = Math.max(bw, 3);
  return (
    <svg width={width} height={height} style={{ display:"block" }}>
      {values.map((v, i) => {
        const bh = Math.round((v / max) * (height - 4)) || 1;
        const x  = i * (bwMin + 2);
        const y  = height - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bwMin} height={bh}
              fill={color} rx={2} opacity={0.85}/>
            {bh > 12 && (
              <text x={x + bwMin/2} y={y + bh - 3}
                textAnchor="middle" fontSize={9} fill="#fff" fontWeight="bold">
                {v}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function SparkLine({ values, color="#10B981", height=36, width=120 }) {
  if (!values || values.length < 2) return null;
  const max  = Math.max(...values, 1);
  const step = width / (values.length - 1);
  const pts  = values.map((v,i) => `${Math.round(i*step)},${Math.round(height - (v/max)*(height-4) - 2)}`).join(" ");
  const last = values[values.length-1];
  const lx   = Math.round((values.length-1)*step);
  const ly   = Math.round(height - (last/max)*(height-4) - 2);
  return (
    <svg width={width} height={height} style={{ display:"block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round"/>
      <circle cx={lx} cy={ly} r={3} fill={color}/>
      <text x={lx+5} y={ly+4} fontSize={10} fill={color} fontWeight="bold">{last}</text>
    </svg>
  );
}

function DonutChart({ value, max=100, color="#3B82F6", size=64, label="" }) {
  const pct  = Math.min(100, Math.max(0, Math.round((value/max)*100)));
  const r    = (size-8)/2;
  const circ = 2 * Math.PI * r;
  const dash = (pct/100) * circ;
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color+"30"} strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex",
        flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:13, fontWeight:800, color }}>{pct}%</span>
        {label && <span style={{ fontSize:9, color:"#94A3B8" }}>{label}</span>}
      </div>
    </div>
  );
}

// ─── KPI DASHBOARD PAGE ───────────────────────────────────────────────────────
// Supervisors set personal KPI targets; system tracks progress automatically
function KPIDashboardPage({ employees, schedule, attendance, performance, session }) {
  const todayKey = todayStr();
  const [targets, setTargets] = useState(() => {
    try { return JSON.parse(localStorage.getItem("csops_kpi_targets")||"{}"); } catch { return {}; }
  });
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft]       = useState({});

  // Default KPI targets
  const DEFAULT_TARGETS = {
    dailyClosed:    50,
    maxEscRate:     5,   // % max escalation rate
    minAttRate:     90,  // % min attendance
    maxAvgLate:     10,  // minutes avg lateness
    maxAbsent:      3,   // count
  };
  const T = { ...DEFAULT_TARGETS, ...targets };

  // Today's actuals
  const dayName    = DAYS[new Date().getDay()];
  const todayEmps  = employees.filter(e=>{ const v=(schedule[e.id]||{})[dayName]; return v&&v!=="OFF"; });
  const todayAtt   = attendance[todayKey] || {};
  const todayPerf  = performance[todayKey] || {};

  const totalClosed   = Object.values(todayPerf).reduce((s,p)=>s+(p.closed||0),0);
  const totalEsc      = Object.values(todayPerf).reduce((s,p)=>s+(p.escalations||0),0);
  const presentCount  = Object.values(todayAtt).filter(a=>isPresent(a.status)).length;
  const absentCount   = Object.values(todayAtt).filter(a=>isAbsent(a.status)).length;
  const lateArr       = Object.values(todayAtt).filter(a=>a.lateMin>0);
  const avgLate       = lateArr.length > 0 ? Math.round(lateArr.reduce((s,a)=>s+(a.lateMin||0),0)/lateArr.length) : 0;
  const attRate       = todayEmps.length > 0 ? Math.round((presentCount/todayEmps.length)*100) : 100;
  const escRate       = totalClosed > 0 ? Math.round((totalEsc/totalClosed)*100) : 0;

  function saveTargets() {
    setTargets(draft);
    localStorage.setItem("csops_kpi_targets", JSON.stringify(draft));
    setEditMode(false);
  }

  function openEdit() {
    setDraft({...T});
    setEditMode(true);
  }

  const kpis = [
    {
      id:"dailyClosed", label:"Daily Closed Cases", icon:"✅",
      actual:totalClosed, target:T.dailyClosed, unit:"cases",
      color:"#10B981", higherBetter:true,
    },
    {
      id:"maxEscRate", label:"Escalation Rate", icon:"⚠️",
      actual:escRate, target:T.maxEscRate, unit:"%",
      color:"#F59E0B", higherBetter:false,
    },
    {
      id:"minAttRate", label:"Attendance Rate", icon:"👥",
      actual:attRate, target:T.minAttRate, unit:"%",
      color:"#3B82F6", higherBetter:true,
    },
    {
      id:"maxAvgLate", label:"Avg Late", icon:"⏰",
      actual:avgLate, target:T.maxAvgLate, unit:"min",
      color:"#8B5CF6", higherBetter:false,
    },
    {
      id:"maxAbsent", label:"Daily Absences", icon:"❌",
      actual:absentCount, target:T.maxAbsent, unit:"employees",
      color:"#EF4444", higherBetter:false,
    },
  ];

  function getStatus(kpi) {
    if (kpi.higherBetter) return kpi.actual >= kpi.target ? "achieved" : kpi.actual >= kpi.target*0.8 ? "close" : "behind";
    else return kpi.actual <= kpi.target ? "achieved" : kpi.actual <= kpi.target*1.2 ? "close" : "behind";
  }

  const statusConfig = {
    achieved: { color:"#10B981", bg:"#F0FDF4", label:"✅ Achieved",   ring:"#10B981" },
    close:    { color:"#F59E0B", bg:"#FEF9C3", label:"⚡ Close",    ring:"#F59E0B" },
    behind:   { color:"#EF4444", bg:"#FEF2F2", label:"❌ Behind",   ring:"#EF4444" },
  };

  const achieved = kpis.filter(k=>getStatus(k)==="achieved").length;

  return (
    <div>
      {/* Header */}
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:_theme.text }}>🎯 KPI Dashboard</span>
        <span style={{ fontSize:12, color:_theme.textMuted }}>
          {new Date().toLocaleDateString("ar-SA",{weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Riyadh"})}
        </span>
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ background:"#F0FDF4", color:"#10B981", border:"1px solid #86EFAC",
            borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700 }}>
            {achieved}/{kpis.length} achieved
          </span>
          <button onClick={openEdit}
            style={{ ...PBT("#6366F1",{padding:"6px 14px",fontSize:12}) }}>
            ⚙️ Edit Targets
          </button>
        </div>
      </div>

      {/* Edit targets modal */}
      {editMode && (
        <div style={{ ...CRD(), marginBottom:16, border:`2px solid #6366F1` }}>
          <div style={{ fontWeight:700, color:_theme.text, marginBottom:12 }}>⚙️ Edit KPI Targets</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12, marginBottom:14 }}>
            {kpis.map(k=>(
              <div key={k.id}>
                <label style={{ fontSize:11, fontWeight:700, color:_theme.textSub, display:"block", marginBottom:4 }}>
                  {k.icon} {k.label} (target)
                </label>
                <input type="number" min="0" value={draft[k.id]||""}
                  onChange={e=>setDraft(p=>({...p,[k.id]:Number(e.target.value)}))}
                  style={{ ...I({width:"100%"}) }} placeholder={String(T[k.id])}/>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={saveTargets} style={{ ...PBT("#10B981",{flex:1}) }}>💾 Save Targets</button>
            <button onClick={()=>setEditMode(false)} style={{ ...PBT("#94A3B8",{padding:"8px 16px"}) }}>Cancel</button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14, marginBottom:20 }}>
        {kpis.map(kpi=>{
          const status = getStatus(kpi);
          const cfg    = statusConfig[status];
          const pct    = kpi.higherBetter
            ? Math.min(100, Math.round((kpi.actual/kpi.target)*100))
            : Math.min(100, Math.round((kpi.target/Math.max(kpi.actual,1))*100));
          return (
            <div key={kpi.id} style={{ ...CRD({padding:"16px 18px"}),
              borderTop:`4px solid ${cfg.ring}`,
              background: cfg.bg }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:"#6B7280", marginBottom:4 }}>{kpi.icon} {kpi.label}</div>
                  <div style={{ fontSize:32, fontWeight:900, color:cfg.color, lineHeight:1 }}>
                    {kpi.actual}<span style={{ fontSize:13, fontWeight:600, marginRight:3 }}>{kpi.unit}</span>
                  </div>
                  <div style={{ fontSize:11, color:"#6B7280", marginTop:4 }}>
                    Target: {kpi.target} {kpi.unit}
                  </div>
                </div>
                <DonutChart value={pct} max={100} color={cfg.ring} size={60}/>
              </div>
              <div style={{ background:"#E5E7EB", borderRadius:10, height:6, overflow:"hidden" }}>
                <div style={{ width:`${pct}%`, height:"100%", background:cfg.ring,
                  borderRadius:10, transition:"width 0.5s" }}/>
              </div>
              <div style={{ marginTop:6, fontSize:12, fontWeight:700, color:cfg.color }}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Top performers today */}
      <div style={{ ...CRD() }}>
        <div style={{ fontWeight:700, color:_theme.text, marginBottom:12, fontSize:13 }}>
          ⚡ Top Performer Today
        </div>
        {(() => {
          const ranked = todayEmps
            .map(e=>({ ...e, closed:(performance[todayKey]||{})[e.id]?.closed||0 }))
            .filter(e=>e.closed>0)
            .sort((a,b)=>b.closed-a.closed)
            .slice(0,5);
          if (ranked.length===0) return (
            <div style={{ color:_theme.textMuted, textAlign:"center", padding:"16px", fontSize:13 }}>
              No performance data yet
            </div>
          );
          return ranked.map((e,i)=>(
            <div key={e.id} style={{ display:"flex", alignItems:"center", gap:10,
              padding:"8px 0", borderBottom:`1px solid ${_theme.cardBorder}20` }}>
              <span style={{ fontSize:20 }}>{"🥇🥈🥉🏅🏅"[i]}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, color:_theme.text }}>{e.name}</div>
                <div style={{ fontSize:11, color:ROLE_COLORS[e.role]||_theme.textMuted }}>{e.role}</div>
              </div>
              <div style={{ fontWeight:800, fontSize:16, color:"#10B981" }}>{e.closed} cases</div>
              <SparkBar values={[e.closed]} color="#10B981" height={28} width={40}/>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}
// ─── ERROR BOUNDARY ──────────────────────────────────────────────────────────
// Catches render errors in any page and shows a recovery screen
// Must be a class component (React requirement for error boundaries)
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error:null, info:null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { this.setState({ info }); console.error("CS-Ops Error:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding:32, textAlign:"center", maxWidth:500, margin:"40px auto" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>⚠️</div>
          <div style={{ fontWeight:800, fontSize:18, color:"#EF4444", marginBottom:8 }}>
            An unexpected error occurred
          </div>
          <div style={{ fontSize:13, color:"#6B7280", marginBottom:8, fontFamily:"monospace",
            background:"#FEF2F2", border:"1px solid #FCA5A5", borderRadius:8,
            padding:"10px 14px", textAlign:"left", whiteSpace:"pre-wrap", wordBreak:"break-all" }}>
            {this.state.error?.message || "Unknown error"}
          </div>
          <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:20 }}>
            This page encountered a problem. You can go back or reload.
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>this.setState({error:null,info:null})}
              style={{ background:"#2563EB", color:"#fff", border:"none", borderRadius:8,
                padding:"10px 20px", fontSize:13, cursor:"pointer", fontWeight:700 }}>
              🔄 Try Again
            </button>
            <button onClick={()=>window.location.reload()}
              style={{ background:"#6B7280", color:"#fff", border:"none", borderRadius:8,
                padding:"10px 20px", fontSize:13, cursor:"pointer", fontWeight:700 }}>
              ↺ Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


// ─── SURVEYS & POLLS SYSTEM ──────────────────────────────────────────────────
// Survey & Polls System
// Data stored in notes table with tag="Survey"

// ── Survey Builder (for supervisors) ─────────────────────────────────────────────
function SurveyBuilderModal({ employees, session, setNotes, onClose }) {
  const [title, setTitle]           = useState("");
  const [type, setType]             = useState("poll"); // poll | quiz | shift_review | peer | blocker
  const [questions, setQuestions]   = useState([{ text:"", options:["","","",""], correct:null }]);
  const [targetRole, setTargetRole] = useState("all");
  const [saved, setSaved]           = useState("");

  const TYPE_CONFIG = {
    poll:         { icon:"📊", label:"Poll",     desc:"Quick single-question poll", multiQ:false },
    quiz:         { icon:"📝", label:"Knowledge Quiz",    desc:"Multiple questions with correct answers", multiQ:true },
    shift_review: { icon:"⭐", label:"Shift Review",  desc:"Rate the shift experience", multiQ:false },
    peer:         { icon:"🤝", label:"Peer Recognition",   desc:"Employee picks a standout colleague", multiQ:false },
    blocker:      { icon:"🚧", label:"Blocker Diagnosis",   desc:"What slowed your work?", multiQ:false },
  };

  // Default questions per type
  function applyTemplate(t) {
    setType(t);
    if (t==="shift_review") {
      setTitle("Shift Review — " + new Date().toLocaleDateString("en-GB",{weekday:"long",timeZone:"Asia/Riyadh"}));
      setQuestions([
        { text:"How was the workload this shift?", options:["Light 🟢","Moderate 🟡","Heavy 🔴","Very Heavy ⛔"], correct:null },
        { text:"How was team collaboration today?", options:["Excellent ⭐⭐⭐⭐⭐","Very Good ⭐⭐⭐⭐","Good ⭐⭐⭐","Needs Improvement ⭐⭐"], correct:null },
        { text:"Did you face any challenge needing follow-up?", options:["No, all good","Yes — technical issue","Yes — high workload","Yes — I'll note it"], correct:null },
      ]);
    } else if (t==="blocker") {
      setTitle("What slowed your work this week?");
      setQuestions([{ text:"Select the main blocker", options:["Technical issue 💻","Lack of info 📋","High workload 📈","Communication difficulty 💬","None — all good ✅"], correct:null }]);
    } else if (t==="peer") {
      setTitle("Star of the Week — Peer Recognition");
      setQuestions([{ text:"Who impressed you most this week?", options:[], correct:null, isPeer:true }]);
    } else if (t==="poll") {
      setTitle(""); setQuestions([{ text:"", options:["","",""], correct:null }]);
    } else if (t==="quiz") {
      setTitle(""); setQuestions([{ text:"", options:["","","",""], correct:0 }]);
    }
  }

  function addQuestion() {
    setQuestions(p=>[...p,{ text:"", options:["","","",""], correct:type==="quiz"?0:null }]);
  }
  function removeQuestion(i) { setQuestions(p=>p.filter((_,j)=>j!==i)); }
  function updateQ(i, field, val) { setQuestions(p=>p.map((q,j)=>j===i?{...q,[field]:val}:q)); }
  function updateOpt(qi, oi, val) {
    setQuestions(p=>p.map((q,j)=>j===qi?{...q,options:q.options.map((o,k)=>k===oi?val:o)}:q));
  }
  function addOption(qi) {
    setQuestions(p=>p.map((q,j)=>j===qi?{...q,options:[...q.options,""]}:q));
  }
  function removeOption(qi, oi) {
    setQuestions(p=>p.map((q,j)=>j===qi?{...q,options:q.options.filter((_,k)=>k!==oi)}:q));
  }

  function saveSurvey() {
    if (!title.trim()) { setSaved("❌ Title required"); return; }
    if (!questions[0]?.text?.trim()) { setSaved("❌ Enter first question"); return; }
    const survey = {
      id: "sv"+Date.now(),
      ts: new Date().toISOString(),
      date: todayStr(),
      time: pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag: "Survey",
      text: JSON.stringify({ title, type, questions, targetRole, status:"active", createdBy:session?.name }),
      from: session?.name||"",
      target: targetRole,
      msgType: "survey",
    };
    setNotes(prev=>[survey,...(Array.isArray(prev)?prev:[])]);
    setSaved("✅ Survey created and sent!");
    setTimeout(()=>{ setSaved(""); onClose(); }, 1500);
  }

  const cfg = TYPE_CONFIG[type];

  return (
    <Modal title={`${cfg.icon} Create ${cfg.label}`} onClose={onClose} width={620}>
      {/* Type selector */}
      <div style={{ marginBottom:14 }}>
        <label style={LBL}>Survey Type</label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
          {Object.entries(TYPE_CONFIG).map(([k,v])=>(
            <button key={k} onClick={()=>applyTemplate(k)}
              style={{ border:`2px solid ${type===k?_theme.primary:"#CBD5E1"}`,
                borderRadius:8, padding:"8px 6px", cursor:"pointer",
                background:type===k?_theme.primary+"18":"transparent",
                textAlign:"center" }}>
              <div style={{ fontSize:18 }}>{v.icon}</div>
              <div style={{ fontSize:11, fontWeight:700,
                color:type===k?_theme.primary:_theme.text }}>{v.label}</div>
              <div style={{ fontSize:10, color:_theme.textMuted, marginTop:2 }}>{v.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom:12 }}>
        <label style={LBL}>Survey Title</label>
        <input value={title} onChange={e=>setTitle(e.target.value)}
          style={{ ...I({width:"100%"}) }} placeholder="e.g. How was today's shift?"/>
      </div>

      {/* Target audience */}
      <div style={{ marginBottom:14 }}>
        <label style={LBL}>Target Audience</label>
        <select value={targetRole} onChange={e=>setTargetRole(e.target.value)}
          style={{ ...I({width:"100%"}) }}>
          <option value="all">Everyone</option>
          <option value="Agent">Agents only</option>
          <option value="Team Lead">Team Leads only</option>
          <option value="Shift Leader">Shift Leaders only</option>
          <option value="SME">SMEs only</option>
        </select>
      </div>

      {/* Questions */}
      <div style={{ marginBottom:14 }}>
        <label style={LBL}>Questions</label>
        {questions.map((q,qi)=>(
          <div key={qi} style={{ background:_theme.surface, borderRadius:10,
            padding:"12px 14px", marginBottom:10, border:`1px solid ${_theme.cardBorder}` }}>
            <div style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
              <span style={{ fontSize:12, fontWeight:700, color:_theme.primary,
                background:_theme.primary+"18", borderRadius:20,
                padding:"2px 8px", flexShrink:0 }}>Q{qi+1}</span>
              <input value={q.text} onChange={e=>updateQ(qi,"text",e.target.value)}
                style={{ ...I({flex:1}) }} placeholder="Question text..."/>
              {questions.length > 1 && (
                <button onClick={()=>removeQuestion(qi)}
                  style={{ background:"#FEF2F2", border:"1px solid #FCA5A5",
                    color:"#EF4444", borderRadius:6, padding:"4px 8px",
                    cursor:"pointer", fontSize:12, flexShrink:0 }}>✕</button>
              )}
            </div>
            {!q.isPeer && (
              <div>
                {q.options.map((opt,oi)=>(
                  <div key={oi} style={{ display:"flex", gap:6, marginBottom:5, alignItems:"center" }}>
                    {type==="quiz" && (
                      <button onClick={()=>updateQ(qi,"correct",oi)}
                        title="Correct answer"
                        style={{ width:22, height:22, borderRadius:"50%", flexShrink:0,
                          border:`2px solid ${q.correct===oi?"#10B981":"#CBD5E1"}`,
                          background:q.correct===oi?"#10B981":"transparent",
                          cursor:"pointer" }}/>
                    )}
                    <input value={opt} onChange={e=>updateOpt(qi,oi,e.target.value)}
                      style={{ ...I({flex:1}) }} placeholder={`Option ${oi+1}`}/>
                    {q.options.length > 2 && (
                      <button onClick={()=>removeOption(qi,oi)}
                        style={{ background:"none", border:"none", color:"#94A3B8",
                          cursor:"pointer", fontSize:16 }}>✕</button>
                    )}
                  </div>
                ))}
                {q.options.length < 6 && (
                  <button onClick={()=>addOption(qi)}
                    style={{ fontSize:11, color:_theme.primary, background:"none",
                      border:"none", cursor:"pointer", fontWeight:600 }}>+ Add option</button>
                )}
                {type==="quiz" && (
                  <div style={{ fontSize:10, color:"#10B981", marginTop:4 }}>
                    ✅ Correct answer: Option {(q.correct||0)+1}
                  </div>
                )}
              </div>
            )}
            {q.isPeer && (
              <div style={{ fontSize:11, color:_theme.textMuted, fontStyle:"italic" }}>
                ⚡ List auto-generated from scheduled employees today
              </div>
            )}
          </div>
        ))}
        {TYPE_CONFIG[type].multiQ && questions.length < 10 && (
          <button onClick={addQuestion}
            style={{ ...PBT("#6366F1",{fontSize:12,padding:"6px 14px"}) }}>
            + Add Question
          </button>
        )}
      </div>

      {saved && (
        <div style={{ padding:"10px 14px", borderRadius:8, marginBottom:12,
          background:saved.startsWith("✅")?"#F0FDF4":"#FEF2F2",
          color:saved.startsWith("✅")?"#166534":"#EF4444",
          fontWeight:600, fontSize:13 }}>{saved}</div>
      )}

      <button onClick={saveSurvey} style={{ ...PBT(_theme.primary,{width:"100%",padding:"12px"}) }}>
        🚀 Launch Survey
      </button>
    </Modal>
  );
}

// ── Survey Answer Card (for employees) ───────────────────────────────────────────
function SurveyAnswerCard({ survey, session, employees, notes, setNotes }) {
  let data = {};
  try { data = JSON.parse(survey.text||"{}"); } catch {}

  const { title, type, questions=[], createdBy } = data;
  const [answers, setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState("");

  // Check if already answered
  const alreadyAnswered = (Array.isArray(notes)?notes:[]).some(n =>
    n.tag==="Survey Response" && n.target===survey.id && n.from===session?.name
  );

  // For peer type — get today's employees
  const todayName = DAYS[new Date().getDay()];
  const peerOptions = employees
    .filter(e => e.name !== session?.name && (data.targetRole==="all" || e.role===data.targetRole))
    .map(e => e.name);

  function submit() {
    if (Object.keys(answers).length < questions.length) {
      setError("❌ Please answer all questions"); return;
    }
    const response = {
      id: "sr"+Date.now(),
      ts: new Date().toISOString(),
      date: todayStr(),
      time: pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag: "Survey Response",
      text: JSON.stringify({ surveyId:survey.id, answers, empName:session?.name }),
      from: session?.name||"",
      target: survey.id,
      msgType: "survey_response",
    };
    setNotes(prev=>[response,...(Array.isArray(prev)?prev:[])]);
    setSubmitted(true);
    setError("");
  }

  if (alreadyAnswered || submitted) {
    return (
      <div style={{ ...CRD({padding:"16px 18px"}), marginBottom:12,
        border:`1.5px solid #10B981`, background:"#F0FDF4" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:20 }}>✅</span>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:"#166534" }}>{title}</div>
            <div style={{ fontSize:11, color:"#4ADE80" }}>Response submitted — Thank you!</div>
          </div>
        </div>
      </div>
    );
  }

  const TYPE_ICONS = { poll:"📊", quiz:"📝", shift_review:"⭐", peer:"🤝", blocker:"🚧" };

  return (
    <div style={{ ...CRD({padding:"16px 18px"}), marginBottom:12,
      border:`1.5px solid ${_theme.primary}40`,
      boxShadow:`0 2px 12px ${_theme.primary}15` }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ fontSize:20 }}>{TYPE_ICONS[type]||"📋"}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:14, color:_theme.text }}>{title}</div>
          <div style={{ fontSize:11, color:_theme.textMuted }}>
            From {createdBy} · {new Date(survey.ts).toLocaleString("ar-SA",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}
          </div>
        </div>
        <span style={{ background:_theme.primary+"22", color:_theme.primary,
          border:`1px solid ${_theme.primary}40`, borderRadius:20,
          padding:"2px 10px", fontSize:10, fontWeight:700 }}>New 🔴</span>
      </div>

      {/* Questions */}
      {questions.map((q, qi) => {
        const opts = q.isPeer ? peerOptions : q.options.filter(Boolean);
        return (
          <div key={qi} style={{ marginBottom:12 }}>
            <div style={{ fontSize:13, fontWeight:700, color:_theme.text, marginBottom:8 }}>
              {questions.length > 1 && <span style={{ color:_theme.primary }}>{qi+1}. </span>}
              {q.text}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {opts.map((opt, oi) => {
                const selected = answers[qi] === oi;
                return (
                  <button key={oi} onClick={()=>setAnswers(p=>({...p,[qi]:oi}))}
                    style={{ display:"flex", alignItems:"center", gap:10,
                      border:`2px solid ${selected?_theme.primary:"#E2E8F0"}`,
                      borderRadius:10, padding:"10px 14px", cursor:"pointer",
                      background:selected?_theme.primary+"18":_theme.surface,
                      textAlign:"right", transition:"all 0.12s" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0,
                      border:`2px solid ${selected?_theme.primary:"#CBD5E1"}`,
                      background:selected?_theme.primary:"transparent",
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {selected && <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }}/>}
                    </div>
                    <span style={{ fontSize:13, fontWeight:selected?700:400,
                      color:selected?_theme.primary:_theme.text }}>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {error && <div style={{ color:"#EF4444", fontSize:12, fontWeight:600, marginBottom:8 }}>{error}</div>}

      <button onClick={submit}
        style={{ ...PBT(_theme.primary,{width:"100%",padding:"11px",fontSize:13})}}>
        📤 Submit Answer
      </button>
    </div>
  );
}

// ── Survey Results Panel (for supervisors) ────────────────────────────────────────
function SurveyResultsPanel({ survey, notes, employees, session, setNotes }) {
  let data = {};
  try { data = JSON.parse(survey.text||"{}"); } catch {}
  const { title, type, questions=[], targetRole, status, createdBy } = data;
  const [showDetails, setShowDetails] = useState(false);

  // Gather responses
  const responses = (Array.isArray(notes)?notes:[])
    .filter(n => n.tag==="Survey Response" && n.target===survey.id);

  const TYPE_ICONS = { poll:"📊", quiz:"📝", shift_review:"⭐", peer:"🤝", blocker:"🚧" };
  const TYPE_LABELS = { poll:"Poll", quiz:"Knowledge Quiz",
    shift_review:"Shift Review", peer:"Peer Recognition", blocker:"Blocker Diagnosis" };

  // Calculate results per question
  function getResults(qi) {
    const q = questions[qi];
    if (!q) return {};
    const counts = {};
    const opts = q.isPeer ? employees.filter(e=>e.name!==session?.name).map(e=>e.name) : q.options.filter(Boolean);
    opts.forEach((_,i) => { counts[i]=0; });
    responses.forEach(r => {
      try {
        const rd = JSON.parse(r.text||"{}");
        const ans = rd.answers?.[qi];
        if (ans !== undefined && ans !== null) counts[ans] = (counts[ans]||0)+1;
      } catch {}
    });
    return { counts, opts, total: responses.length };
  }

  function closeSurvey() {
    if (!window.confirm("Close this survey? Employees cannot respond after closing.")) return;
    setNotes(prev=>(Array.isArray(prev)?prev:[]).map(n=>{
      if (n.id !== survey.id) return n;
      try {
        const d = JSON.parse(n.text||"{}");
        return { ...n, text: JSON.stringify({...d, status:"closed"}) };
      } catch { return n; }
    }));
  }

  function deleteSurvey() {
    if (!window.confirm("Delete this survey and all responses?")) return;
    const ids = new Set([survey.id, ...responses.map(r=>r.id)]);
    setNotes(prev=>(Array.isArray(prev)?prev:[]).filter(n=>!ids.has(n.id)));
  }

  const isClosed = status === "closed";
  const pct = responses.length > 0 ? responses.length : 0;

  return (
    <div style={{ ...CRD({padding:"14px 16px"}), marginBottom:12,
      border:`1.5px solid ${isClosed?"#94A3B8":_theme.accent}40`,
      opacity: isClosed ? 0.8 : 1 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, flexWrap:"wrap" }}>
        <span style={{ fontSize:18 }}>{TYPE_ICONS[type]||"📋"}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:13, color:_theme.text }}>{title}</div>
          <div style={{ fontSize:11, color:_theme.textMuted }}>
            {TYPE_LABELS[type]} · {new Date(survey.ts).toLocaleDateString("ar-SA",{timeZone:"Asia/Riyadh"})}
            · To: {targetRole==="all"?"Everyone":targetRole}
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ background:responses.length>0?"#F0FDF4":"#F8FAFC",
            color:responses.length>0?"#10B981":"#94A3B8",
            border:`1px solid ${responses.length>0?"#86EFAC":"#E2E8F0"}`,
            borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
            {responses.length} responses
          </span>
          <span style={{ background:isClosed?"#F1F5F9":"#FEF9C3",
            color:isClosed?"#64748B":"#B45309",
            borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
            {isClosed?"🔒 Closed":"🟢 Active"}
          </span>
          <button onClick={()=>setShowDetails(s=>!s)}
            style={{ ...PBT("#6366F1",{fontSize:11,padding:"4px 10px"}) }}>
            {showDetails?"▲ Hide":"▼ Results"}
          </button>
          {!isClosed && createdBy===session?.name && (
            <button onClick={closeSurvey}
              style={{ ...PBT("#F59E0B",{fontSize:11,padding:"4px 10px"}) }}>🔒 Close</button>
          )}
          {createdBy===session?.name && (
            <button onClick={deleteSurvey}
              style={{ ...PBT("#EF4444",{fontSize:11,padding:"4px 10px"}) }}>🗑️</button>
          )}
        </div>
      </div>

      {/* Results */}
      {showDetails && (
        <div style={{ borderTop:`1px solid ${_theme.cardBorder}`, paddingTop:12 }}>
          {responses.length === 0 ? (
            <div style={{ textAlign:"center", color:_theme.textMuted, fontSize:12, padding:"16px" }}>
              No responses yet
            </div>
          ) : (
            <div>
              {questions.map((q, qi) => {
                const { counts, opts, total } = getResults(qi);
                const max = Math.max(...Object.values(counts), 1);
                return (
                  <div key={qi} style={{ marginBottom:14 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:_theme.text, marginBottom:8 }}>
                      {questions.length > 1 && <span style={{ color:_theme.primary }}>{qi+1}. </span>}
                      {q.text}
                    </div>
                    {opts.map((opt, oi) => {
                      const cnt  = counts[oi]||0;
                      const pct  = total > 0 ? Math.round((cnt/total)*100) : 0;
                      const isWinner = cnt === max && cnt > 0;
                      const isCorrect = type==="quiz" && q.correct===oi;
                      return (
                        <div key={oi} style={{ marginBottom:6 }}>
                          <div style={{ display:"flex", justifyContent:"space-between",
                            alignItems:"center", marginBottom:3 }}>
                            <span style={{ fontSize:12, fontWeight:isWinner?700:400,
                              color:isCorrect?"#10B981":isWinner?_theme.primary:_theme.text }}>
                              {isCorrect&&"✅ "}{opt}
                            </span>
                            <span style={{ fontSize:11, fontWeight:700,
                              color:isWinner?_theme.primary:_theme.textMuted }}>
                              {cnt} ({pct}%)
                            </span>
                          </div>
                          <div style={{ background:_theme.surface, borderRadius:20,
                            height:8, overflow:"hidden" }}>
                            <div style={{ height:"100%", borderRadius:20,
                              width:`${pct}%`, transition:"width 0.5s",
                              background:isCorrect?"#10B981":isWinner?_theme.primary:"#94A3B8" }}/>
                          </div>
                        </div>
                      );
                    })}
                    {type==="quiz" && (
                      <div style={{ fontSize:11, color:"#10B981", marginTop:6, fontWeight:600 }}>
                        Correct rate: {Math.round((counts[q.correct]||0)/total*100)}%
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Respondents list */}
              <div style={{ marginTop:10, borderTop:`1px solid ${_theme.cardBorder}`, paddingTop:8 }}>
                <div style={{ fontSize:11, color:_theme.textMuted, fontWeight:600, marginBottom:6 }}>
                  Participants ({responses.length}):
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {responses.map(r=>(
                    <span key={r.id} style={{ background:_theme.surface,
                      border:`1px solid ${_theme.cardBorder}`,
                      borderRadius:20, padding:"2px 8px", fontSize:10,
                      color:_theme.textSub }}>{r.from}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Surveys Page ──────────────────────────────────────────────────────────
function SurveysPage({ employees, notes, setNotes, session, canEdit }) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [tab, setTab]                 = useState(canEdit ? "manage" : "answer");

  const allSurveys = (Array.isArray(notes)?notes:[])
    .filter(n => n.tag==="Survey")
    .sort((a,b) => b.ts.localeCompare(a.ts));

  // Filter surveys visible to this user by targetRole
  const mySurveys = allSurveys.filter(sv => {
    try {
      const d = JSON.parse(sv.text||"{}");
      return d.targetRole==="all" || d.targetRole===session?.role || canEdit;
    } catch { return true; }
  });

  const activeSurveys = mySurveys.filter(sv => {
    try { return JSON.parse(sv.text||"{}").status !== "closed"; } catch { return true; }
  });
  const closedSurveys = mySurveys.filter(sv => {
    try { return JSON.parse(sv.text||"{}").status === "closed"; } catch { return false; }
  });

  // Unanswered for current user
  const unanswered = activeSurveys.filter(sv => {
    return !(Array.isArray(notes)?notes:[]).some(
      n => n.tag==="Survey Response" && n.target===sv.id && n.from===session?.name
    );
  });

  const tabs = canEdit
    ? [["manage","📊 Manage & Results"],["answer","📝 Answer"]]
    : [["answer","📝 Surveys"]];

  return (
    <div>
      {/* Header */}
      <div style={SBR()}>
        <span style={{ fontWeight:800, fontSize:15, color:_theme.text }}>📋 Surveys & Quizzes</span>
        {unanswered.length > 0 && (
          <span style={{ background:"#EF444418", color:"#EF4444",
            border:"1px solid #FCA5A5", borderRadius:20,
            padding:"3px 12px", fontSize:12, fontWeight:700 }}>
            🔴 {unanswered.length} surveys pending
          </span>
        )}
        {canEdit && (
          <button onClick={()=>setShowBuilder(true)}
            style={{ ...PBT(_theme.primary,{fontSize:12}) }}>
            ➕ Create Survey
          </button>
        )}
      </div>

      {/* Tabs */}
      {canEdit && (
        <div style={{ display:"flex", gap:6, marginBottom:14 }}>
          {tabs.map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)}
              style={{ border:`2px solid ${tab===k?_theme.primary:"#CBD5E1"}`,
                borderRadius:20, padding:"5px 16px", fontSize:12,
                cursor:"pointer", fontWeight:700,
                background:tab===k?_theme.primary:"transparent",
                color:tab===k?"#fff":_theme.textSub }}>{l}</button>
          ))}
        </div>
      )}

      {/* ── Manage Tab (supervisors) ── */}
      {tab==="manage" && canEdit && (
        <div>
          {/* Active */}
          <div style={{ fontWeight:700, color:_theme.text, fontSize:13, marginBottom:10 }}>
            🟢 Active Surveys ({activeSurveys.length})
          </div>
          {activeSurveys.length===0 && (
            <div style={{ ...CRD({padding:"32px 20px"}), textAlign:"center",
              color:_theme.textMuted, marginBottom:16 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📋</div>
              No active surveys yet
            </div>
          )}
          {activeSurveys.map(sv=>(
            <SurveyResultsPanel key={sv.id} survey={sv} notes={notes}
              employees={employees} session={session} setNotes={setNotes}/>
          ))}
          {/* Closed */}
          {closedSurveys.length > 0 && (
            <div>
              <div style={{ fontWeight:700, color:_theme.textMuted, fontSize:12, marginBottom:8, marginTop:16 }}>
                🔒 Closed ({closedSurveys.length})
              </div>
              {closedSurveys.map(sv=>(
                <SurveyResultsPanel key={sv.id} survey={sv} notes={notes}
                  employees={employees} session={session} setNotes={setNotes}/>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Answer Tab (all users) ── */}
      {(tab==="answer" || !canEdit) && (
        <div>
          {unanswered.length === 0 && activeSurveys.length === 0 && (
            <div style={{ ...CRD({padding:"48px 20px"}), textAlign:"center",
              color:_theme.textMuted }}>
              <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>
                No surveys currently
              </div>
              <div style={{ fontSize:13 }}>New surveys appear here once launched</div>
            </div>
          )}
          {unanswered.length > 0 && (
            <div>
              <div style={{ fontWeight:700, color:"#EF4444", fontSize:13, marginBottom:10 }}>
                ⏳ Awaiting response ({unanswered.length})
              </div>
              {unanswered.map(sv=>(
                <SurveyAnswerCard key={sv.id} survey={sv} session={session}
                  employees={employees} notes={notes} setNotes={setNotes}/>
              ))}
            </div>
          )}
          {activeSurveys.filter(sv=>!unanswered.includes(sv)).length > 0 && (
            <div style={{ marginTop:16 }}>
              <div style={{ fontWeight:700, color:"#10B981", fontSize:13, marginBottom:10 }}>
                ✅ Answered ({activeSurveys.length - unanswered.length})
              </div>
              {activeSurveys.filter(sv=>!unanswered.includes(sv)).map(sv=>(
                <SurveyAnswerCard key={sv.id} survey={sv} session={session}
                  employees={employees} notes={notes} setNotes={setNotes}/>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Builder Modal */}
      {showBuilder && (
        <SurveyBuilderModal employees={employees} session={session}
          setNotes={setNotes} onClose={()=>setShowBuilder(false)}/>
      )}
    </div>
  );
}

// ─── GAMIFICATION — BADGES & POINTS SYSTEM ───────────────────────────────────

const BADGES = [
  { id:"quality_champion",  icon:"🏆", name:"Quality Champion",   desc:"Quality score ≥ 90% for 5+ days",      color:"#F59E0B", rarity:"gold"   },
  { id:"shift_savior",      icon:"🦸", name:"Shift Savior",        desc:"Closed 50+ cases in a single shift",   color:"#3B82F6", rarity:"blue"   },
  { id:"fastest_response",  icon:"⚡", name:"Fastest Response",    desc:"0 escalations for 7 consecutive days", color:"#10B981", rarity:"green"  },
  { id:"attendance_star",   icon:"⭐", name:"Attendance Star",     desc:"Perfect attendance for a full month",  color:"#8B5CF6", rarity:"purple" },
  { id:"top_closer",        icon:"🎯", name:"Top Closer",          desc:"#1 in closed cases for the week",      color:"#EF4444", rarity:"red"    },
  { id:"team_player",       icon:"🤝", name:"Team Player",         desc:"Highest peer recognition votes",       color:"#EC4899", rarity:"pink"   },
  { id:"consistency_king",  icon:"👑", name:"Consistency King",    desc:"Above-average performance for 30 days",color:"#F59E0B", rarity:"gold"   },
  { id:"zero_escalation",   icon:"🛡️", name:"Zero Escalation",    desc:"Zero escalations for 14 days",         color:"#10B981", rarity:"green"  },
  { id:"early_bird",        icon:"🌅", name:"Early Bird",          desc:"On-time arrival for 20 consecutive days",color:"#0EA5E9",rarity:"blue"  },
  { id:"century_club",      icon:"💯", name:"Century Club",        desc:"100+ cases closed in a single week",   color:"#6366F1", rarity:"purple" },
];

const RARITY_COLORS = {
  gold:   { bg:"#FEF9C3", border:"#F59E0B", text:"#92400E" },
  blue:   { bg:"#EFF6FF", border:"#3B82F6", text:"#1E40AF" },
  green:  { bg:"#F0FDF4", border:"#10B981", text:"#065F46" },
  purple: { bg:"#F5F3FF", border:"#8B5CF6", text:"#4C1D95" },
  red:    { bg:"#FEF2F2", border:"#EF4444", text:"#991B1B" },
  pink:   { bg:"#FDF2F8", border:"#EC4899", text:"#831843" },
};

// Calculate points for an employee from performance data
function calcEmployeePoints(empId, performance, attendance) {
  let pts = 0;
  const perfDates = Object.keys(performance||{});
  perfDates.forEach(date => {
    const p = (performance[date]||{})[empId];
    if (!p) return;
    pts += (p.closed||0) * 10;                          // 10 pts per closed case
    pts += (p.quality||0) >= 90 ? 50 : (p.quality||0) >= 75 ? 20 : 0; // quality bonus
    pts -= (p.escalations||0) * 5;                      // -5 per escalation
  });
  const attDates = Object.keys(attendance||{});
  attDates.forEach(date => {
    const a = (attendance[date]||{})[empId];
    if (!a) return;
    if (a.status === "Present") pts += 5;               // 5 pts presence
    if (a.lateMin === 0 && a.status === "Present") pts += 3; // bonus on-time
    if (isAbsent(a.status)) pts -= 10;               // -10 absent
  });
  return Math.max(0, pts);
}

// Auto-detect earned badges
function detectBadges(empId, performance, attendance, employees, notes) {
  const earned = [];
  const perfDates = Object.keys(performance||{}).sort();
  const allPerf   = perfDates.map(d => (performance[d]||{})[empId]).filter(Boolean);
  const allAtt    = Object.values(attendance||{}).map(d => d[empId]).filter(Boolean);

  // Quality Champion: quality ≥ 90 for 5+ days
  const highQualDays = allPerf.filter(p => (p.quality||0) >= 90).length;
  if (highQualDays >= 5) earned.push("quality_champion");

  // Shift Savior: 50+ cases in a single day
  if (allPerf.some(p => (p.closed||0) >= 50)) earned.push("shift_savior");

  // Zero Escalation: 0 escalations for 14 consecutive days
  let zeroStreak = 0, maxZero = 0;
  allPerf.forEach(p => { if ((p.escalations||0) === 0) { zeroStreak++; maxZero = Math.max(maxZero, zeroStreak); } else zeroStreak = 0; });
  if (maxZero >= 14) earned.push("zero_escalation");
  if (maxZero >= 7)  earned.push("fastest_response");

  // Attendance Star: present every working day in a month (≥20 present)
  const presentDays = allAtt.filter(a => isPresent(a.status)).length;
  const absentDays  = allAtt.filter(a => isAbsent(a.status)).length;
  if (presentDays >= 20 && absentDays === 0) earned.push("attendance_star");

  // Early Bird: 20 consecutive on-time arrivals
  let onTimeStreak = 0, maxOnTime = 0;
  allAtt.forEach(a => { if (a.status==="Present" && a.lateMin===0) { onTimeStreak++; maxOnTime=Math.max(maxOnTime,onTimeStreak); } else onTimeStreak=0; });
  if (maxOnTime >= 20) earned.push("early_bird");

  // Century Club: 100+ cases in a week
  for (let i = 0; i <= perfDates.length - 7; i++) {
    const weekTotal = perfDates.slice(i, i+7).reduce((s,d)=>s+((performance[d]||{})[empId]?.closed||0),0);
    if (weekTotal >= 100) { earned.push("century_club"); break; }
  }

  // Consistency King: above-average for 30 days
  if (allPerf.length >= 30) {
    const avg = allPerf.reduce((s,p)=>s+(p.closed||0),0) / allPerf.length;
    const aboveAvg = allPerf.filter(p=>(p.closed||0) >= avg).length;
    if (aboveAvg >= 25) earned.push("consistency_king");
  }

  return [...new Set(earned)];
}

// ── Badges Display Component ───────────────────────────────────────────────────
function BadgesDisplay({ badgeIds, size="normal" }) {
  if (!badgeIds || badgeIds.length === 0) return null;
  const sm = size === "small";
  return (
    <div style={{ display:"flex", gap:sm?3:5, flexWrap:"wrap" }}>
      {badgeIds.map(bid => {
        const b = BADGES.find(x=>x.id===bid);
        if (!b) return null;
        const rc = RARITY_COLORS[b.rarity];
        return (
          <div key={bid} title={`${b.name}: ${b.desc}`}
            style={{ display:"flex", alignItems:"center", gap:sm?2:4,
              background:rc.bg, border:`1px solid ${rc.border}`,
              borderRadius:sm?4:6, padding:sm?"1px 5px":"3px 8px",
              fontSize:sm?10:11, fontWeight:700, color:rc.text,
              cursor:"default" }}>
            <span style={{ fontSize:sm?11:13 }}>{b.icon}</span>
            {!sm && <span>{b.name}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ── Gamification Page ──────────────────────────────────────────────────────────
function GamificationPage({ employees, performance, attendance, schedule, notes, setNotes, session, canEdit }) {
  const [tab, setTab]           = useState("leaderboard"); // leaderboard | badges | award
  const [awardEmp, setAwardEmp] = useState("");
  const [awardBadge, setAwardBadge] = useState("");
  const [awardNote, setAwardNote]   = useState("");
  const [awardDone, setAwardDone]   = useState("");
  const [search, setSearch]     = useState("");

  const todayKey = todayStr();

  // Manual badge awards stored in notes (tag: "Badge Award")
  const manualAwards = (Array.isArray(notes)?notes:[])
    .filter(n => n.tag === "Badge Award");

  // Build per-employee data
  const empData = useMemo(() => {
    return employees.map(emp => {
      const pts     = calcEmployeePoints(emp.id, performance, attendance);
      const autoBadges = detectBadges(emp.id, performance, attendance, employees, notes);
      const manualBadges = manualAwards
        .filter(n => { try { return JSON.parse(n.text||"{}").empId === emp.id; } catch { return false; } })
        .map(n => { try { return JSON.parse(n.text||"{}").badgeId; } catch { return null; } })
        .filter(Boolean);
      const allBadges = [...new Set([...autoBadges, ...manualBadges])];
      // Today's perf
      const todayPerf = (performance[todayKey]||{})[emp.id] || { closed:0, escalations:0 };
      return { ...emp, pts, badges:allBadges, todayPerf };
    }).sort((a,b) => b.pts - a.pts);
  }, [employees, performance, attendance, notes, manualAwards]);

  const filtered = empData.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  function awardBadgeManually() {
    if (!awardEmp || !awardBadge) { setAwardDone("❌ Select employee and badge"); return; }
    const badge = BADGES.find(b=>b.id===awardBadge);
    const emp   = employees.find(e=>e.id===awardEmp);
    const award = {
      id: "ba"+Date.now(),
      ts: new Date().toISOString(),
      date: todayStr(),
      time: pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag: "Badge Award",
      text: JSON.stringify({ empId:awardEmp, badgeId:awardBadge, note:awardNote, awardedBy:session?.name }),
      from: session?.name||"",
      target: awardEmp,
      msgType: "badge",
    };
    setNotes(prev=>[award,...(Array.isArray(prev)?prev:[])]);
    setAwardDone(`✅ "${badge?.name}" awarded to ${emp?.name}!`);
    setAwardEmp(""); setAwardBadge(""); setAwardNote("");
    setTimeout(()=>setAwardDone(""),4000);
  }

  const topEmp = empData[0];
  const maxPts = topEmp?.pts || 1;

  return (
    <div>
      {/* Header */}
      <div style={SBR()}>
        <span style={{ fontWeight:800, fontSize:15, color:_theme.text }}>🏅 Gamification — Badges & Points</span>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          style={{ ...I({width:180}) }} placeholder="🔍 Search employee..."/>
        <div style={{ display:"flex", gap:6 }}>
          {[["leaderboard","🏆 Leaderboard"],["badges","🎖️ All Badges"],canEdit?["award","🎁 Award Badge"]:null]
            .filter(Boolean).map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)}
              style={{ border:`2px solid ${tab===k?_theme.primary:"#CBD5E1"}`,
                borderRadius:20, padding:"5px 14px", fontSize:12, cursor:"pointer",
                fontWeight:700, background:tab===k?_theme.primary:"transparent",
                color:tab===k?"#fff":_theme.textSub }}>{l}</button>
          ))}
        </div>
      </div>

      {/* ── Leaderboard Tab ── */}
      {tab==="leaderboard" && (
        <div>
          {/* Top 3 podium */}
          {empData.slice(0,3).some(e=>e.pts>0) && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr 1fr", gap:10, marginBottom:20, alignItems:"flex-end" }}>
              {[empData[1], empData[0], empData[2]].map((e,pi) => {
                if (!e) return <div key={pi}/>;
                const podiumH = [100, 130, 85][pi];
                const medals  = ["🥈","🥇","🥉"];
                const colors  = ["#94A3B8","#F59E0B","#CD7F32"];
                return (
                  <div key={e.id} style={{ ...CRD({padding:"14px 10px"}), textAlign:"center",
                    borderTop:`4px solid ${colors[pi]}`,
                    background:`linear-gradient(180deg,${colors[pi]}15,${_theme.card})` }}>
                    <div style={{ fontSize:28, marginBottom:4 }}>{medals[pi]}</div>
                    <div style={{ fontWeight:800, fontSize:13, color:_theme.text, marginBottom:4 }}>{e.name}</div>
                    <BadgesDisplay badgeIds={e.badges} size="small"/>
                    <div style={{ fontSize:22, fontWeight:900, color:colors[pi], marginTop:6 }}>
                      {e.pts.toLocaleString("en-GB",{timeZone:"Asia/Riyadh",hour12:false})}
                      <span style={{ fontSize:11, fontWeight:600, color:_theme.textMuted }}> pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full ranking table */}
          <div style={{ ...CRD({padding:0}), overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
                  {["Rank","Employee","Role","Badges","Total Points","Today's Cases","Bar"].map(h=>(
                    <th key={h} style={{ padding:"10px 10px", textAlign:"left", fontWeight:700,
                      color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}`,
                      whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e,ri) => {
                  const pct = maxPts > 0 ? (e.pts/maxPts)*100 : 0;
                  const isMe = e.name === session?.name;
                  return (
                    <tr key={e.id} style={{
                      background: isMe ? _theme.primary+"12" : ri%2===0?_theme.card:_theme.surface,
                      borderLeft: isMe?`3px solid ${_theme.primary}`:"3px solid transparent"
                    }}>
                      <td style={{ padding:"8px 10px", fontWeight:800, fontSize:14,
                        color:ri===0?"#F59E0B":ri===1?"#94A3B8":ri===2?"#CD7F32":_theme.textMuted }}>
                        {ri===0?"🥇":ri===1?"🥈":ri===2?"🥉":`#${ri+1}`}
                      </td>
                      <td style={{ padding:"8px 10px", fontWeight:600, color:_theme.text }}>
                        {e.name}
                        {isMe && <span style={{ fontSize:10, color:_theme.primary,
                          background:_theme.primary+"18", borderRadius:10,
                          padding:"1px 6px", marginLeft:5 }}>You</span>}
                      </td>
                      <td style={{ padding:"8px 10px" }}>
                        <span style={{ fontSize:10, fontWeight:700,
                          color:ROLE_COLORS[e.role]||"#64748B",
                          background:(ROLE_COLORS[e.role]||"#64748B")+"18",
                          borderRadius:4, padding:"1px 5px" }}>
                          {ROLE_ICONS[e.role]} {e.role}
                        </span>
                      </td>
                      <td style={{ padding:"8px 10px" }}>
                        <BadgesDisplay badgeIds={e.badges} size="small"/>
                        {e.badges.length===0 && <span style={{ fontSize:11, color:_theme.textMuted }}>—</span>}
                      </td>
                      <td style={{ padding:"8px 10px", fontWeight:800,
                        color: e.pts>=500?"#F59E0B":e.pts>=200?"#3B82F6":_theme.text,
                        fontSize:14 }}>
                        {e.pts.toLocaleString("en-GB",{timeZone:"Asia/Riyadh",hour12:false})}
                      </td>
                      <td style={{ padding:"8px 10px", color:"#10B981", fontWeight:700 }}>
                        {e.todayPerf.closed||0}
                      </td>
                      <td style={{ padding:"8px 20px 8px 10px", minWidth:120 }}>
                        <div style={{ background:_theme.surface, borderRadius:20, height:8, overflow:"hidden" }}>
                          <div style={{ height:"100%", borderRadius:20,
                            width:`${pct}%`, transition:"width 0.5s",
                            background: pct>80?"#F59E0B":pct>50?"#3B82F6":"#10B981" }}/>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Points key */}
          <div style={{ ...CRD({padding:"10px 14px"}), marginTop:10, fontSize:11,
            color:_theme.textMuted, display:"flex", gap:16, flexWrap:"wrap" }}>
            <span style={{ fontWeight:700, color:_theme.text }}>Points Key:</span>
            <span>✅ Closed case = <strong>+10pts</strong></span>
            <span>🎯 Quality ≥90% = <strong>+50pts</strong></span>
            <span>🎯 Quality ≥75% = <strong>+20pts</strong></span>
            <span>📅 Present = <strong>+5pts</strong></span>
            <span>⏰ On-time = <strong>+3pts</strong></span>
            <span>⚠️ Escalation = <strong>−5pts</strong></span>
            <span>❌ Absent = <strong>−10pts</strong></span>
          </div>
        </div>
      )}

      {/* ── All Badges Tab ── */}
      {tab==="badges" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
          {BADGES.map(b => {
            const rc = RARITY_COLORS[b.rarity];
            const holders = empData.filter(e=>e.badges.includes(b.id));
            return (
              <div key={b.id} style={{ ...CRD({padding:"14px 16px"}),
                border:`2px solid ${rc.border}`, background:rc.bg }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:28 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontWeight:800, fontSize:13, color:rc.text }}>{b.name}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:rc.border,
                      textTransform:"uppercase" }}>{b.rarity}</div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:_theme.textSub, marginBottom:8 }}>{b.desc}</div>
                {holders.length > 0 ? (
                  <div>
                    <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:600, marginBottom:4 }}>
                      Earned by ({holders.length}):
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                      {holders.map(e=>(
                        <span key={e.id} style={{ fontSize:10, background:rc.border+"22",
                          color:rc.text, borderRadius:10, padding:"1px 6px",
                          fontWeight:600 }}>{e.name}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize:11, color:_theme.textMuted, fontStyle:"italic" }}>
                    Not yet earned by anyone
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Award Badge Tab (supervisors only) ── */}
      {tab==="award" && canEdit && (
        <div style={{ maxWidth:500 }}>
          <div style={{ ...CRD({padding:"16px 18px"}), marginBottom:16,
            background:"rgba(99,102,241,0.05)", border:"1px solid #6366F140" }}>
            <div style={{ fontWeight:700, fontSize:13, color:_theme.text, marginBottom:14 }}>
              🎁 Manually Award a Badge
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={LBL}>Select Employee</label>
              <select value={awardEmp} onChange={e=>setAwardEmp(e.target.value)} style={{ ...I({width:"100%"}) }}>
                <option value="">— Choose employee —</option>
                {employees.map(e=><option key={e.id} value={e.id}>{e.name} ({e.role})</option>)}
              </select>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={LBL}>Select Badge</label>
              <select value={awardBadge} onChange={e=>setAwardBadge(e.target.value)} style={{ ...I({width:"100%"}) }}>
                <option value="">— Choose badge —</option>
                {BADGES.map(b=><option key={b.id} value={b.id}>{b.icon} {b.name}</option>)}
              </select>
            </div>
            {awardBadge && (
              <div style={{ ...CRD({padding:"10px 12px"}), marginBottom:12,
                border:`1px solid ${RARITY_COLORS[BADGES.find(b=>b.id===awardBadge)?.rarity||"blue"].border}` }}>
                <div style={{ fontSize:11, color:_theme.textMuted }}>
                  {BADGES.find(b=>b.id===awardBadge)?.desc}
                </div>
              </div>
            )}
            <div style={{ marginBottom:12 }}>
              <label style={LBL}>Note (optional)</label>
              <input value={awardNote} onChange={e=>setAwardNote(e.target.value)}
                style={{ ...I({width:"100%"}) }} placeholder="Why are you awarding this badge?"/>
            </div>
            {awardDone && (
              <div style={{ padding:"10px 12px", borderRadius:8, marginBottom:10,
                background:awardDone.startsWith("✅")?"#F0FDF4":"#FEF2F2",
                color:awardDone.startsWith("✅")?"#166534":"#EF4444",
                fontWeight:600, fontSize:13 }}>{awardDone}</div>
            )}
            <button onClick={awardBadgeManually}
              style={{ ...PBT("#6366F1",{width:"100%",padding:"11px"}) }}>
              🎁 Award Badge
            </button>
          </div>
          <div style={{ ...CRD({padding:"12px 14px"}), fontSize:11, color:_theme.textMuted }}>
            <div style={{ fontWeight:700, color:_theme.text, marginBottom:6 }}>Auto-awarded badges:</div>
            Some badges are automatically detected from performance data.
            Manual awards let you recognize exceptional moments that numbers don't capture.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI REPORT ASSISTANT ─────────────────────────────────────────────────────
// Uses Anthropic claude-sonnet-4-20250514 to generate professional reports
// from current operations data

function AIReportAssistant({ employees, schedule, attendance, performance, queueLog, shifts }) {
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState("");
  const [reportType, setReportType] = useState("daily_ops");
  const [bullets, setBullets]   = useState("");
  const [error, setError]       = useState("");
  const [copied, setCopied]     = useState(false);

  const REPORT_TYPES = [
    { k:"daily_ops",    icon:"📊", label:"Daily Ops Report",      desc:"Full operations summary for today" },
    { k:"shift_handover",icon:"🔄",label:"Shift Handover",        desc:"End-of-shift handover briefing" },
    { k:"performance",  icon:"⚡", label:"Performance Summary",   desc:"Team performance analysis" },
    { k:"incident",     icon:"🚨", label:"Incident Report",       desc:"Escalation / incident documentation" },
    { k:"weekly_recap", icon:"📅", label:"Weekly Recap",          desc:"Weekly team performance recap" },
  ];

  // Build context from current data
  function buildContext() {
    const todayKey  = todayStr();
    const dayName   = DAYS[new Date().getDay()];
    const todayEmps = employees.filter(e => {
      const v = (schedule[e.id]||{})[dayName];
      return v && v !== "OFF";
    });
    const todayAtt  = attendance[todayKey] || {};
    const todayPerf = performance[todayKey] || {};

    const present  = Object.values(todayAtt).filter(a=>isPresent(a.status)).length;
    const absent   = Object.values(todayAtt).filter(a=>isAbsent(a.status)).length;
    const late     = Object.values(todayAtt).filter(a=>a.lateMin>=7).length;
    const closed   = Object.values(todayPerf).reduce((s,p)=>s+(p.closed||0),0);
    const escalations = Object.values(todayPerf).reduce((s,p)=>s+(p.escalations||0),0);
    const escRate  = closed > 0 ? ((escalations/closed)*100).toFixed(1) : 0;

    // Queue data
    const QUEUE_KEYS = ["tga","ob","oslo","some","kwtT2","qatT2","bahT2","uaeT2"];
    const todayQueueEntries = Object.entries(queueLog||{})
      .filter(([k])=>k.startsWith(todayKey)).map(([,v])=>v);
    const latestQueue = todayQueueEntries.length > 0
      ? todayQueueEntries.reduce((best,e)=>(e.updTime||"")>(best.updTime||"")?e:best, todayQueueEntries[0])
      : null;
    const totalQueue = latestQueue
      ? QUEUE_KEYS.reduce((s,k)=>s+Number(latestQueue[k+"Curr"]||0),0)
      : 0;

    // Top performers
    const topPerformers = todayEmps
      .map(e=>({ name:e.name, closed:(todayPerf[e.id]?.closed||0) }))
      .filter(e=>e.closed>0)
      .sort((a,b)=>b.closed-a.closed)
      .slice(0,3)
      .map(e=>`${e.name} (${e.closed} cases)`).join(", ");

    return {
      date: new Date().toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Riyadh"}),
      time: new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"}),
      scheduled: todayEmps.length,
      present, absent, late,
      closed, escalations, escRate,
      totalQueue,
      topPerformers: topPerformers || "No data yet",
      shifts: shifts.map(s=>s.label).join(", "),
    };
  }

  async function generateReport() {
    setLoading(true); setError(""); setResult("");
    try {
      const ctx = buildContext();
      const typeLabel = REPORT_TYPES.find(t=>t.k===reportType)?.label || reportType;

      const systemPrompt = `You are a professional Customer Service Operations Manager. 
Write concise, formal, data-driven operational reports.
Use clear English. Structure with sections. Be specific with numbers.
Do not add fictional data — only use the data provided.`;

      const dataBlock = `
DATE: ${ctx.date} at ${ctx.time}
TEAM: ${ctx.scheduled} scheduled | ${ctx.present} present | ${ctx.absent} absent | ${ctx.late} late arrivals
CASES: ${ctx.closed} closed | ${ctx.escalations} escalations | ${ctx.escRate}% escalation rate
QUEUE: ${ctx.totalQueue} active cases
TOP PERFORMERS: ${ctx.topPerformers}
ACTIVE SHIFTS: ${ctx.shifts}
${bullets.trim() ? `
ADDITIONAL NOTES FROM MANAGER:
${bullets}` : ""}`;

      const userPrompt = reportType === "daily_ops" ? `Write a Daily Operations Report using this data:
${dataBlock}` :
        reportType === "shift_handover" ? `Write a professional Shift Handover briefing using this data:
${dataBlock}` :
        reportType === "performance" ? `Write a Team Performance Summary using this data:
${dataBlock}` :
        reportType === "incident" ? `Write a formal Incident/Escalation Report. The manager notes: "${bullets||"High escalation rate observed"}"
Context:
${dataBlock}` :
        `Write a Weekly Performance Recap. Use the following as today's snapshot:
${dataBlock}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role:"user", content: userPrompt }],
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = (data.content||[]).map(c=>c.text||"").join("").trim();
      setResult(text);
    } catch(e) {
      setError("Failed to generate report: " + e.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ ...CRD({padding:"16px 18px"}), marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        <span style={{ fontSize:18 }}>🤖</span>
        <span style={{ fontWeight:800, fontSize:14, color:_theme.text }}>AI Report Assistant</span>
        <span style={{ fontSize:11, color:_theme.textMuted }}>
          — Generates professional reports from live data
        </span>
        <span style={{ fontSize:10, background:"#FEF3C7", color:"#92400E",
          border:"1px solid #FCD34D", borderRadius:20, padding:"2px 8px", fontWeight:700 }}>
          ⚠️ Requires Anthropic API access
        </span>
      </div>

      {/* Report type selector */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:6, marginBottom:14 }}>
        {REPORT_TYPES.map(t=>(
          <button key={t.k} onClick={()=>setReportType(t.k)}
            style={{ border:`2px solid ${reportType===t.k?_theme.primary:"#CBD5E1"}`,
              borderRadius:8, padding:"8px 10px", cursor:"pointer", textAlign:"left",
              background:reportType===t.k?_theme.primary+"18":"transparent" }}>
            <div style={{ fontSize:15, marginBottom:2 }}>{t.icon}</div>
            <div style={{ fontSize:11, fontWeight:700,
              color:reportType===t.k?_theme.primary:_theme.text }}>{t.label}</div>
            <div style={{ fontSize:10, color:_theme.textMuted }}>{t.desc}</div>
          </button>
        ))}
      </div>

      {/* Optional notes */}
      <div style={{ marginBottom:12 }}>
        <label style={LBL}>Key points / notes to include (optional)</label>
        <textarea value={bullets} onChange={e=>setBullets(e.target.value)} rows={2}
          style={{ ...I({resize:"vertical",width:"100%"}) }}
          placeholder="e.g. System outage at 14:00, staffing issue resolved at 15:30..."/>
      </div>

      <button onClick={generateReport} disabled={loading}
        style={{ ...PBT(_theme.primary,{padding:"10px 24px",marginBottom:14,
          opacity:loading?0.7:1 }) }}>
        {loading ? "⏳ Generating..." : "🤖 Generate Report"}
      </button>

      {error && (
        <div style={{ padding:"10px 14px", borderRadius:8, marginBottom:12,
          background:"#FEF2F2", color:"#EF4444", fontSize:12, fontWeight:600 }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:12, fontWeight:700, color:_theme.text }}>Generated Report:</span>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={()=>{
                navigator.clipboard.writeText(result);
                setCopied(true); setTimeout(()=>setCopied(false),2000);
              }} style={{ ...PBT(copied?"#10B981":"#6366F1",{fontSize:11,padding:"5px 12px"}) }}>
                {copied?"✅ Copied!":"📋 Copy"}
              </button>
              <button onClick={()=>{
                const win=window.open("","_blank","width=700,height=600");
                win.document.write(`<html><body style="font-family:Arial;padding:32px;white-space:pre-wrap">${result}</body></html>`);
                win.document.close(); win.print();
              }} style={{ ...PBT("#7C3AED",{fontSize:11,padding:"5px 12px"}) }}>🖨️ Print</button>
            </div>
          </div>
          <div style={{ background:_theme.surface, border:`1px solid ${_theme.cardBorder}`,
            borderRadius:10, padding:"14px 16px", fontSize:13, color:_theme.text,
            lineHeight:1.8, whiteSpace:"pre-wrap", maxHeight:400, overflowY:"auto",
            fontFamily:"'Courier New', monospace" }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SMART SHIFT SWAP SYSTEM ─────────────────────────────────────────────────
// Employees request swaps, supervisors approve/reject
// Approved swaps auto-update schedule in Supabase

function ShiftSwapPanel({ employees, schedule, setSchedule, shifts, notes, setNotes, session, canEdit }) {
  const [showForm, setShowForm]     = useState(false);
  const [swapDay, setSwapDay]       = useState(DAYS[new Date().getDay()]);
  const [withEmp, setWithEmp]       = useState("");
  const [reason, setReason]         = useState("");
  const [saved, setSaved]           = useState("");

  const myName = session?.name;
  const myId   = employees.find(e=>e.name===myName)?.id;

  // Swap requests stored as notes with tag "Swap Request"
  const allRequests = (Array.isArray(notes)?notes:[])
    .filter(n=>n.tag==="Swap Request")
    .sort((a,b)=>b.ts.localeCompare(a.ts));

  // What I see: my own + all if canEdit
  const visibleReqs = canEdit ? allRequests : allRequests.filter(r=>{
    try { const d=JSON.parse(r.text||"{}"); return d.fromId===myId||d.toId===myId; } catch { return false; }
  });

  const pending  = visibleReqs.filter(r=>{ try{return JSON.parse(r.text||"{}").status==="pending";}catch{return false;} });
  const history  = visibleReqs.filter(r=>{ try{const d=JSON.parse(r.text||"{}");return d.status!=="pending";}catch{return false;} });

  // Get my shift for a day
  function getMyShift(day) {
    if (!myId) return null;
    const sid = (schedule[myId]||{})[day];
    return shifts.find(s=>s.id===sid);
  }

  // Get target shift for a day
  function getTargetShift(empId, day) {
    const sid = (schedule[empId]||{})[day];
    return shifts.find(s=>s.id===sid);
  }

  function submitSwapRequest() {
    if (!withEmp || !swapDay) { setSaved("❌ Select employee and day"); return; }
    const toEmp = employees.find(e=>e.id===withEmp);
    if (!toEmp) return;
    const myShift  = getMyShift(swapDay);
    const hisShift = getTargetShift(withEmp, swapDay);
    if (!myShift || !hisShift) { setSaved("❌ One of you is off that day"); return; }
    if (myShift.id === hisShift.id) { setSaved("❌ You both have the same shift"); return; }

    const req = {
      id: "sw"+Date.now(),
      ts: new Date().toISOString(),
      date: todayStr(),
      time: pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag: "Swap Request",
      text: JSON.stringify({
        fromId:myId, fromName:myName,
        toId:withEmp, toName:toEmp.name,
        day:swapDay,
        fromShiftId:myShift.id, fromShiftLabel:myShift.label,
        toShiftId:hisShift.id, toShiftLabel:hisShift.label,
        reason, status:"pending"
      }),
      from: myName||"",
      target: toEmp.name,
      msgType: "swap_request",
    };
    setNotes(prev=>[req,...(Array.isArray(prev)?prev:[])]);
    setSaved(`✅ Swap request sent to ${toEmp.name} for ${swapDay}`);
    setReason(""); setWithEmp(""); setShowForm(false);
    setTimeout(()=>setSaved(""),4000);
  }

  function approveSwap(req) {
    try {
      const d = JSON.parse(req.text||"{}");
      if (!window.confirm(`Approve swap on ${d.day}?
${d.fromName}: ${d.fromShiftLabel} ↔ ${d.toShiftLabel}
${d.toName}: ${d.toShiftLabel} ↔ ${d.fromShiftLabel}`)) return;
      // Apply to schedule
      setSchedule(prev=>({
        ...prev,
        [d.fromId]: { ...(prev[d.fromId]||{}), [d.day]: d.toShiftId },
        [d.toId]:   { ...(prev[d.toId]||{}),   [d.day]: d.fromShiftId },
      }));
      // Mark approved
      setNotes(prev=>(Array.isArray(prev)?prev:[]).map(n=>
        n.id===req.id ? {...n, text:JSON.stringify({...d, status:"approved", approvedBy:myName})} : n
      ));
    } catch {}
  }

  function rejectSwap(req) {
    try {
      const d = JSON.parse(req.text||"{}");
      if (!window.confirm(`Reject this swap request from ${d.fromName}?`)) return;
      setNotes(prev=>(Array.isArray(prev)?prev:[]).map(n=>
        n.id===req.id ? {...n, text:JSON.stringify({...d, status:"rejected", rejectedBy:myName})} : n
      ));
    } catch {}
  }

  function deleteSwap(id) {
    setNotes(prev=>(Array.isArray(prev)?prev:[]).filter(n=>n.id!==id));
  }

  function statusBadge(status) {
    const map = {
      pending:  { bg:"#FEF9C3", color:"#B45309", label:"⏳ Pending" },
      approved: { bg:"#F0FDF4", color:"#166534", label:"✅ Approved" },
      rejected: { bg:"#FEF2F2", color:"#991B1B", label:"❌ Rejected" },
    };
    const c = map[status]||map.pending;
    return <span style={{ background:c.bg, color:c.color, borderRadius:20,
      padding:"2px 10px", fontSize:10, fontWeight:700 }}>{c.label}</span>;
  }

  return (
    <div style={{ ...CRD({padding:"14px 18px"}), marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        <span style={{ fontSize:16 }}>🔄</span>
        <span style={{ fontWeight:800, fontSize:14, color:_theme.text }}>Smart Shift Swap</span>
        {pending.length > 0 && (
          <span style={{ background:"#FEF3C7", color:"#B45309",
            border:"1px solid #FCD34D", borderRadius:20,
            padding:"2px 10px", fontSize:11, fontWeight:700 }}>
            {pending.length} pending
          </span>
        )}
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          {!canEdit && (
            <button onClick={()=>setShowForm(s=>!s)}
              style={{ ...PBT("#3B82F6",{fontSize:12,padding:"6px 14px"}) }}>
              {showForm?"✕ Cancel":"🔄 Request Swap"}
            </button>
          )}
        </div>
      </div>

      {/* Request form for employees */}
      {showForm && !canEdit && (
        <div style={{ background:_theme.surface, borderRadius:10, padding:"14px 16px",
          marginBottom:14, border:`1px solid ${_theme.cardBorder}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div>
              <label style={LBL}>Swap Day</label>
              <select value={swapDay} onChange={e=>setSwapDay(e.target.value)} style={{ ...I({width:"100%"}) }}>
                {DAYS.map(d=>{
                  const myS = getMyShift(d);
                  return <option key={d} value={d}>{d} {myS?`(${myS.label})`:"(Off)"}</option>;
                })}
              </select>
            </div>
            <div>
              <label style={LBL}>Swap With</label>
              <select value={withEmp} onChange={e=>setWithEmp(e.target.value)} style={{ ...I({width:"100%"}) }}>
                <option value="">— Select colleague —</option>
                {employees.filter(e=>e.id!==myId&&e.name!==myName).map(e=>{
                  const sh = getTargetShift(e.id, swapDay);
                  return <option key={e.id} value={e.id}>{e.name} {sh?`(${sh.label})`:"(Off)"}</option>;
                })}
              </select>
            </div>
          </div>
          {withEmp && swapDay && (() => {
            const myS  = getMyShift(swapDay);
            const hisS = getTargetShift(withEmp, swapDay);
            const him  = employees.find(e=>e.id===withEmp);
            if (!myS||!hisS) return <div style={{ fontSize:12,color:"#EF4444",marginBottom:8 }}>One party is off that day</div>;
            return (
              <div style={{ background:_theme.primary+"12", border:`1px solid ${_theme.primary}30`,
                borderRadius:8, padding:"8px 12px", marginBottom:10, fontSize:12 }}>
                <strong>{myName}</strong>: {myS.label} ↔ {hisS.label} :<strong>{him?.name}</strong>
              </div>
            );
          })()}
          <label style={LBL}>Reason (optional)</label>
          <input value={reason} onChange={e=>setReason(e.target.value)}
            style={{ ...I({width:"100%",marginBottom:10}) }} placeholder="Why are you requesting this swap?"/>
          <button onClick={submitSwapRequest}
            style={{ ...PBT("#3B82F6",{width:"100%"}) }}>📤 Submit Swap Request</button>
          {saved && <div style={{ marginTop:8,fontSize:12,
            color:saved.startsWith("✅")?"#10B981":"#EF4444",fontWeight:600 }}>{saved}</div>}
        </div>
      )}

      {/* Pending requests */}
      {pending.length > 0 && (
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#B45309", marginBottom:8 }}>
            ⏳ Pending Requests ({pending.length})
          </div>
          {pending.map(req => {
            let d = {};
            try { d = JSON.parse(req.text||"{}"); } catch {}
            return (
              <div key={req.id} style={{ background:"#FFFBEB", border:"1px solid #FCD34D",
                borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:_theme.text }}>
                      {d.fromName} → {d.toName}
                    </div>
                    <div style={{ fontSize:11, color:_theme.textMuted, marginTop:3 }}>
                      📅 {d.day} · {d.fromShiftLabel} ↔ {d.toShiftLabel}
                    </div>
                    {d.reason && <div style={{ fontSize:12, color:_theme.textSub, marginTop:4 }}>
                      "{d.reason}"
                    </div>}
                  </div>
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    {canEdit && <>
                      <button onClick={()=>approveSwap(req)}
                        style={{ ...PBT("#10B981",{fontSize:12,padding:"5px 12px"}) }}>✅ Approve</button>
                      <button onClick={()=>rejectSwap(req)}
                        style={{ ...PBT("#EF4444",{fontSize:12,padding:"5px 12px"}) }}>❌ Reject</button>
                    </>}
                    {(canEdit || d.fromId===myId) && (
                      <button onClick={()=>deleteSwap(req.id)}
                        style={{ background:"none", border:`1px solid ${_theme.cardBorder}`,
                          color:_theme.textMuted, borderRadius:6, padding:"5px 8px",
                          cursor:"pointer", fontSize:12 }}>✕</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:_theme.textMuted, marginBottom:8 }}>
            History ({history.length})
          </div>
          {history.slice(0,5).map(req=>{
            let d={};
            try{d=JSON.parse(req.text||"{}");}catch{}
            return (
              <div key={req.id} style={{ display:"flex", alignItems:"center", gap:8,
                padding:"8px 0", borderBottom:`1px solid ${_theme.cardBorder}20` }}>
                <div style={{ flex:1, fontSize:12 }}>
                  <span style={{ fontWeight:600 }}>{d.fromName}</span> ↔{" "}
                  <span style={{ fontWeight:600 }}>{d.toName}</span>
                  <span style={{ color:_theme.textMuted }}> · {d.day} · {d.fromShiftLabel}↔{d.toShiftLabel}</span>
                </div>
                {statusBadge(d.status)}
                {canEdit && (
                  <button onClick={()=>deleteSwap(req.id)}
                    style={{ background:"none", border:"none", color:_theme.textMuted,
                      cursor:"pointer", fontSize:14 }}>✕</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {visibleReqs.length===0 && (
        <div style={{ textAlign:"center", padding:"20px", color:_theme.textMuted, fontSize:13 }}>
          <div style={{ fontSize:32, marginBottom:6 }}>🔄</div>
          No swap requests — {canEdit?"employees can request swaps from this panel":"click 'Request Swap' to get started"}
        </div>
      )}
    </div>
  );
}

// ─── BREAK SWAP REQUEST SYSTEM ───────────────────────────────────────────────
// Three-stage approval: A requests → B approves → Supervisor final approval
// Stored in notes (tag: "Break Swap Request") — uses existing Realtime channel
//
// Status flow:
//   pending_b        → B must respond
//   rejected_b       → B rejected — done
//   pending_supervisor → B approved — supervisor must respond
//   rejected_supervisor → Supervisor rejected — done
//   approved         → Swap applied to breakSchedule
//   cancelled        → A cancelled before final approval

function BreakSwapPanel({ employees, schedule, shifts, breakSchedule, setBreakSchedule,
                          notes, setNotes, session, canEdit }) {
  const [showForm, setShowForm] = useState(false);
  const [selDate, setSelDate]   = useState(todayStr());
  const [withEmp, setWithEmp]   = useState("");
  const [reason, setReason]     = useState("");
  const [msg, setMsg]           = useState("");

  const myName = session?.name;
  const myId   = employees.find(e => e.name === myName)?.id;
  const myRole = session?.role;

  const isSupervisor = canEdit; // Team Lead / Shift Leader / SME

  // All break swap requests
  const allSwaps = (Array.isArray(notes) ? notes : [])
    .filter(n => n.tag === "Break Swap Request")
    .sort((a, b) => b.ts.localeCompare(a.ts));

  // What this user sees
  const mySwaps = allSwaps.filter(r => {
    try {
      const d = JSON.parse(r.text || "{}");
      if (isSupervisor) return true;           // supervisors see all
      return d.fromId === myId || d.toId === myId; // employees see theirs
    } catch { return false; }
  });

  const pendingMyAction = mySwaps.filter(r => {
    try {
      const d = JSON.parse(r.text || "{}");
      if (d.status === "pending_b" && d.toId === myId) return true;
      if (d.status === "pending_supervisor" && isSupervisor) return true;
      return false;
    } catch { return false; }
  });

  // Get break info for an employee on a date
  function getBreakInfo(empId, date) {
    const dayName = DAYS[new Date(date + "T12:00:00").getDay()];
    const sid     = (schedule[empId] || {})[dayName];
    if (!sid || sid === "OFF" || sid === "LEAVE") return null;
    const sh      = shifts.find(s => s.id === sid);
    if (!sh) return null;
    // Find break schedule key — try each shift
    const key   = `${date}_${sid}`;
    const entry = (breakSchedule[key] || {})[empId];
    if (!entry) return { sh, key, empId, date, hasBreak: false };
    const shiftStartMin  = toMin(sh.start);
    const totalOffsetMin = (Number(entry.offsetHours) || 0) * 60 + (Number(entry.offsetMins) || 0);
    const breakStartMin  = (shiftStartMin + totalOffsetMin) % 1440;
    const breakStart     = pad(Math.floor(breakStartMin / 60)) + ":" + pad(breakStartMin % 60);
    const breakEndMin    = (breakStartMin + Number(entry.durationMin)) % 1440;
    const breakEnd       = pad(Math.floor(breakEndMin / 60)) + ":" + pad(breakEndMin % 60);
    return {
      sh, key, empId, date, hasBreak: true,
      offsetHours: entry.offsetHours || 0,
      offsetMins:  entry.offsetMins  || 0,
      durationMin: entry.durationMin,
      breakStart, breakEnd,
      display: `${breakStart} – ${breakEnd} (${entry.durationMin}m)`
    };
  }

  const myBreak     = myId ? getBreakInfo(myId, selDate) : null;
  const targetBreak = withEmp ? getBreakInfo(withEmp, selDate) : null;
  const canRequest  = myBreak?.hasBreak && targetBreak?.hasBreak &&
                      myBreak.sh.id === targetBreak.sh.id; // same shift required

  function submitRequest() {
    if (!canRequest) { setMsg("❌ Cannot swap — check both employees are on the same shift with breaks scheduled"); return; }
    // Check no pending request already exists
    const hasPending = allSwaps.some(r => {
      try {
        const d = JSON.parse(r.text || "{}");
        return (d.fromId === myId || d.toId === myId) &&
               (d.status === "pending_b" || d.status === "pending_supervisor");
      } catch { return false; }
    });
    if (hasPending) { setMsg("❌ You already have a pending swap request"); return; }

    const toEmp = employees.find(e => e.id === withEmp);
    const req   = {
      id:      "bsr" + Date.now(),
      ts:      new Date().toISOString(),
      date:    todayStr(),
      time:    pad(new Date().getHours()) + ":" + pad(new Date().getMinutes()),
      tag:     "Break Swap Request",
      text:    JSON.stringify({
        fromId:      myId,   fromName: myName,
        toId:        withEmp, toName:  toEmp?.name,
        swapDate:    selDate,
        shiftId:     myBreak.sh.id,
        shiftLabel:  myBreak.sh.label,
        // A's break offset
        fromOffsetH: myBreak.offsetHours,    fromOffsetM: myBreak.offsetMins,
        fromDur:     myBreak.durationMin,    fromDisplay: myBreak.display,
        // B's break offset
        toOffsetH:   targetBreak.offsetHours, toOffsetM:  targetBreak.offsetMins,
        toDur:       targetBreak.durationMin, toDisplay:  targetBreak.display,
        reason,
        status: "pending_b",
        history: [{ action:"requested", by:myName, ts:new Date().toISOString() }]
      }),
      from:    myName || "",
      target:  toEmp?.name || "",
      msgType: "break_swap",
    };
    setNotes(prev => [req, ...(Array.isArray(prev) ? prev : [])]);
    setMsg(`✅ Break swap request sent to ${toEmp?.name}. Waiting for their approval.`);
    setReason(""); setWithEmp(""); setShowForm(false);
    setTimeout(() => setMsg(""), 5000);
  }

  function updateStatus(reqId, newStatus, extraData = {}) {
    setNotes(prev => (Array.isArray(prev) ? prev : []).map(n => {
      if (n.id !== reqId) return n;
      try {
        const d = JSON.parse(n.text || "{}");
        const histEntry = { action: newStatus, by: myName, ts: new Date().toISOString() };
        return {
          ...n,
          text: JSON.stringify({ ...d, ...extraData, status: newStatus,
            history: [...(d.history || []), histEntry] })
        };
      } catch { return n; }
    }));
  }

  function approveAsB(req) {
    try {
      const d = JSON.parse(req.text || "{}");
      if (!window.confirm(
        `Approve break swap request from ${d.fromName}?

` +
        `Your break (${d.toDisplay}) ↔ Their break (${d.fromDisplay})
` +
        `Date: ${d.swapDate}

This will go to a supervisor for final approval.`
      )) return;
      updateStatus(req.id, "pending_supervisor");
    } catch {}
  }

  function rejectAsB(req) {
    try {
      const d = JSON.parse(req.text || "{}");
      if (!window.confirm(`Reject break swap request from ${d.fromName}?`)) return;
      updateStatus(req.id, "rejected_b");
    } catch {}
  }

  function approveFinal(req) {
    try {
      const d = JSON.parse(req.text || "{}");
      if (!window.confirm(
        `Final approval: swap breaks between ${d.fromName} and ${d.toName}?

` +
        `${d.fromName}: ${d.fromDisplay} → ${d.toDisplay}
` +
        `${d.toName}: ${d.toDisplay} → ${d.fromDisplay}

` +
        `Date: ${d.swapDate} · Shift: ${d.shiftLabel}`
      )) return;

      // Apply the swap to breakSchedule
      const bsKey = `${d.swapDate}_${d.shiftId}`;
      setBreakSchedule(prev => {
        const cur = { ...(prev[bsKey] || {}) };
        // A gets B's offset, B gets A's offset
        cur[d.fromId] = { ...(cur[d.fromId] || {}),
          offsetHours: d.toOffsetH,  offsetMins: d.toOffsetM,  durationMin: d.toDur };
        cur[d.toId]   = { ...(cur[d.toId]   || {}),
          offsetHours: d.fromOffsetH, offsetMins: d.fromOffsetM, durationMin: d.fromDur };
        return { ...prev, [bsKey]: cur };
      });
      updateStatus(req.id, "approved", { approvedBy: myName });
    } catch {}
  }

  function rejectFinal(req) {
    try {
      const d = JSON.parse(req.text || "{}");
      if (!window.confirm(`Reject this break swap request from ${d.fromName} and ${d.toName}?`)) return;
      updateStatus(req.id, "rejected_supervisor", { rejectedBy: myName });
    } catch {}
  }

  function cancelRequest(req) {
    try {
      const d = JSON.parse(req.text || "{}");
      if (!window.confirm("Cancel your break swap request?")) return;
      updateStatus(req.id, "cancelled");
    } catch {}
  }

  function deleteRequest(id) {
    setNotes(prev => (Array.isArray(prev) ? prev : []).filter(n => n.id !== id));
  }

  function statusBadge(status) {
    const map = {
      pending_b:           { bg:"#FEF3C7", color:"#B45309",  label:"⏳ Waiting for colleague" },
      pending_supervisor:  { bg:"#EFF6FF", color:"#1E40AF",  label:"⏳ Waiting for supervisor" },
      approved:            { bg:"#F0FDF4", color:"#166534",  label:"✅ Approved — Swapped!" },
      rejected_b:          { bg:"#FEF2F2", color:"#991B1B",  label:"❌ Declined by colleague" },
      rejected_supervisor: { bg:"#FEF2F2", color:"#991B1B",  label:"❌ Declined by supervisor" },
      cancelled:           { bg:"#F1F5F9", color:"#64748B",  label:"🚫 Cancelled" },
    };
    const c = map[status] || { bg:"#F1F5F9", color:"#64748B", label:status };
    return (
      <span style={{ background:c.bg, color:c.color, borderRadius:20,
        padding:"2px 10px", fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>
        {c.label}
      </span>
    );
  }

  const activeRequests  = mySwaps.filter(r => {
    try { const s=JSON.parse(r.text||"{}").status; return s==="pending_b"||s==="pending_supervisor"; } catch{return false;}
  });
  const closedRequests  = mySwaps.filter(r => {
    try { const s=JSON.parse(r.text||"{}").status; return s==="approved"||s==="rejected_b"||s==="rejected_supervisor"||s==="cancelled"; } catch{return false;}
  });

  return (
    <div style={{ ...CRD({padding:"14px 18px"}), marginBottom:20 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        <span style={{ fontSize:16 }}>☕</span>
        <span style={{ fontWeight:800, fontSize:14, color:_theme.text }}>Break Swap Requests</span>
        <span style={{ fontSize:11, color:_theme.textMuted }}>
          — 3-stage approval: You → Colleague → Supervisor
        </span>
        {pendingMyAction.length > 0 && (
          <span style={{ background:"#FEF3C7", color:"#B45309",
            border:"1px solid #FCD34D", borderRadius:20,
            padding:"2px 10px", fontSize:11, fontWeight:700 }}>
            {pendingMyAction.length} action required
          </span>
        )}
        <div style={{ marginLeft:"auto" }}>
          {!isSupervisor && (
            <button onClick={() => setShowForm(s => !s)}
              style={{ ...PBT("#8B5CF6", {fontSize:12, padding:"6px 14px"}) }}>
              {showForm ? "✕ Cancel" : "☕ Request Break Swap"}
            </button>
          )}
        </div>
      </div>

      {/* Request Form */}
      {showForm && !isSupervisor && (
        <div style={{ background:_theme.surface, borderRadius:10,
          padding:"14px 16px", marginBottom:14,
          border:`1px solid ${_theme.cardBorder}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div>
              <label style={LBL}>Swap Date</label>
              <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)}
                style={I()}/>
            </div>
            <div>
              <label style={LBL}>Swap With</label>
              <select value={withEmp} onChange={e=>setWithEmp(e.target.value)}
                style={{ ...I({width:"100%"}) }}>
                <option value="">— Select colleague —</option>
                {employees.filter(e=>e.id!==myId).map(e=>{
                  const bi = getBreakInfo(e.id, selDate);
                  return (
                    <option key={e.id} value={e.id}>
                      {e.name} {bi?.hasBreak ? `(Break: ${bi.display})` : "(No break scheduled)"}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Preview */}
          {myBreak && withEmp && (
            <div style={{ ...CRD({padding:"12px 14px"}), marginBottom:10,
              border:`1.5px solid ${canRequest?_theme.primary:"#EF4444"}40` }}>
              {!myBreak.hasBreak && (
                <div style={{ color:"#EF4444", fontSize:12, fontWeight:600 }}>
                  ⚠️ You don't have a break scheduled on {selDate}
                </div>
              )}
              {myBreak.hasBreak && !targetBreak?.hasBreak && (
                <div style={{ color:"#EF4444", fontSize:12, fontWeight:600 }}>
                  ⚠️ Colleague doesn't have a break scheduled on {selDate}
                </div>
              )}
              {myBreak.hasBreak && targetBreak?.hasBreak && myBreak.sh.id !== targetBreak.sh.id && (
                <div style={{ color:"#EF4444", fontSize:12, fontWeight:600 }}>
                  ⚠️ You are on different shifts — cannot swap breaks
                </div>
              )}
              {canRequest && (
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:_theme.textMuted, marginBottom:8 }}>
                    Preview after swap:
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <div style={{ background:_theme.primary+"12", borderRadius:8,
                      padding:"8px 12px", border:`1px solid ${_theme.primary}30` }}>
                      <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:600 }}>You ({myName})</div>
                      <div style={{ fontSize:11, color:_theme.textMuted }}>
                        Current: <span style={{ textDecoration:"line-through" }}>{myBreak.display}</span>
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:_theme.primary }}>
                        → {targetBreak.display}
                      </div>
                    </div>
                    <div style={{ background:"#8B5CF620", borderRadius:8,
                      padding:"8px 12px", border:"1px solid #8B5CF630" }}>
                      <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:600 }}>
                        {employees.find(e=>e.id===withEmp)?.name}
                      </div>
                      <div style={{ fontSize:11, color:_theme.textMuted }}>
                        Current: <span style={{ textDecoration:"line-through" }}>{targetBreak.display}</span>
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#8B5CF6" }}>
                        → {myBreak.display}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <label style={LBL}>Reason (optional)</label>
          <input value={reason} onChange={e=>setReason(e.target.value)}
            style={{ ...I({width:"100%", marginBottom:10}) }}
            placeholder="e.g. Doctor appointment, personal errand..."/>

          {msg && (
            <div style={{ padding:"8px 12px", borderRadius:8, marginBottom:10,
              background:msg.startsWith("✅")?"#F0FDF4":"#FEF2F2",
              color:msg.startsWith("✅")?"#166534":"#EF4444",
              fontSize:12, fontWeight:600 }}>{msg}</div>
          )}

          <button onClick={submitRequest} disabled={!canRequest}
            style={{ ...PBT("#8B5CF6",{width:"100%", padding:"11px",
              opacity:canRequest?1:0.5}) }}>
            📤 Submit Break Swap Request
          </button>
        </div>
      )}

      {msg && !showForm && (
        <div style={{ padding:"8px 12px", borderRadius:8, marginBottom:12,
          background:msg.startsWith("✅")?"#F0FDF4":"#FEF2F2",
          color:msg.startsWith("✅")?"#166534":"#EF4444",
          fontSize:12, fontWeight:600 }}>{msg}</div>
      )}

      {/* ── Active Requests ── */}
      {activeRequests.length > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:700, color:_theme.text, marginBottom:8 }}>
            Active Requests ({activeRequests.length})
          </div>
          {activeRequests.map(req => {
            let d = {};
            try { d = JSON.parse(req.text || "{}"); } catch {}
            const isRequester = d.fromId === myId;
            const isTarget    = d.toId === myId;
            const needsMyB    = d.status === "pending_b" && isTarget;
            const needsSuperv = d.status === "pending_supervisor" && isSupervisor;
            return (
              <div key={req.id} style={{
                background: needsMyB||needsSuperv ? "#FFFBEB" : _theme.surface,
                border:`1.5px solid ${needsMyB||needsSuperv?"#FCD34D":_theme.cardBorder}`,
                borderRadius:10, padding:"12px 14px", marginBottom:8
              }}>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    {/* Header */}
                    <div style={{ display:"flex", alignItems:"center", gap:8,
                      marginBottom:6, flexWrap:"wrap" }}>
                      <span style={{ fontWeight:700, fontSize:13, color:_theme.text }}>
                        {d.fromName} → {d.toName}
                      </span>
                      {statusBadge(d.status)}
                    </div>
                    {/* Break details */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                      gap:6, marginBottom:6 }}>
                      <div style={{ fontSize:11, color:_theme.textMuted }}>
                        📅 {d.swapDate} · ⏰ {d.shiftLabel}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                      <div style={{ fontSize:11, background:"#EFF6FF",
                        border:"1px solid #BFDBFE", borderRadius:6, padding:"3px 8px" }}>
                        <strong>{d.fromName}:</strong> {d.fromDisplay} → {d.toDisplay}
                      </div>
                      <div style={{ fontSize:11, background:"#F5F3FF",
                        border:"1px solid #DDD6FE", borderRadius:6, padding:"3px 8px" }}>
                        <strong>{d.toName}:</strong> {d.toDisplay} → {d.fromDisplay}
                      </div>
                    </div>
                    {d.reason && (
                      <div style={{ fontSize:11, color:_theme.textSub, marginTop:4, fontStyle:"italic" }}>
                        "{d.reason}"
                      </div>
                    )}
                    {/* Approval progress */}
                    <div style={{ display:"flex", gap:6, marginTop:8, alignItems:"center" }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"#10B981" }}>✅ Requested</div>
                      <div style={{ fontSize:10, color:_theme.textMuted }}>→</div>
                      <div style={{ fontSize:10, fontWeight:700,
                        color:d.status==="pending_b"?"#F59E0B":
                              d.status==="rejected_b"?"#EF4444":"#10B981" }}>
                        {d.status==="pending_b"?"⏳":d.status==="rejected_b"?"❌":"✅"} Colleague
                      </div>
                      <div style={{ fontSize:10, color:_theme.textMuted }}>→</div>
                      <div style={{ fontSize:10, fontWeight:700,
                        color:d.status==="pending_supervisor"?"#F59E0B":"#94A3B8" }}>
                        {d.status==="pending_supervisor"?"⏳":"⬜"} Supervisor
                      </div>
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                    {/* B approves/rejects */}
                    {needsMyB && (
                      <>
                        <button onClick={()=>approveAsB(req)}
                          style={{ ...PBT("#10B981",{fontSize:12,padding:"6px 12px"}) }}>
                          ✅ Approve
                        </button>
                        <button onClick={()=>rejectAsB(req)}
                          style={{ ...PBT("#EF4444",{fontSize:12,padding:"6px 12px"}) }}>
                          ❌ Decline
                        </button>
                      </>
                    )}
                    {/* Supervisor final */}
                    {needsSuperv && (
                      <>
                        <button onClick={()=>approveFinal(req)}
                          style={{ ...PBT("#10B981",{fontSize:12,padding:"6px 12px"}) }}>
                          ✅ Final Approve
                        </button>
                        <button onClick={()=>rejectFinal(req)}
                          style={{ ...PBT("#EF4444",{fontSize:12,padding:"6px 12px"}) }}>
                          ❌ Reject
                        </button>
                      </>
                    )}
                    {/* Cancel — requester only, before final approval */}
                    {isRequester && (d.status==="pending_b"||d.status==="pending_supervisor") && (
                      <button onClick={()=>cancelRequest(req)}
                        style={{ ...PBT("#94A3B8",{fontSize:11,padding:"5px 10px"}) }}>
                        🚫 Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── History ── */}
      {closedRequests.length > 0 && (
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:_theme.textMuted, marginBottom:8 }}>
            History ({closedRequests.length})
          </div>
          {closedRequests.slice(0,6).map(req => {
            let d = {};
            try { d = JSON.parse(req.text || "{}"); } catch {}
            return (
              <div key={req.id} style={{ display:"flex", alignItems:"center", gap:8,
                padding:"8px 0", borderBottom:`1px solid ${_theme.cardBorder}20`,
                flexWrap:"wrap" }}>
                <div style={{ flex:1, fontSize:12 }}>
                  <span style={{ fontWeight:600 }}>{d.fromName}</span>
                  <span style={{ color:_theme.textMuted }}> ↔ </span>
                  <span style={{ fontWeight:600 }}>{d.toName}</span>
                  <span style={{ color:_theme.textMuted }}> · {d.swapDate}</span>
                </div>
                {statusBadge(d.status)}
                {isSupervisor && (
                  <button onClick={()=>deleteRequest(req.id)}
                    style={{ background:"none", border:"none",
                      color:_theme.textMuted, cursor:"pointer", fontSize:14 }}>✕</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {mySwaps.length === 0 && (
        <div style={{ textAlign:"center", padding:"24px 20px",
          color:_theme.textMuted, fontSize:13 }}>
          <div style={{ fontSize:32, marginBottom:8 }}>☕</div>
          {isSupervisor
            ? "No break swap requests — employees can request from this panel"
            : "No break swap requests — click 'Request Break Swap' to get started"}
        </div>
      )}
    </div>
  );
}


// ─── LIVE TEAM STATUS BOARD ───────────────────────────────────────────────────
function LiveTeamStatusBoard({ employees, allStatuses, theme }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [teamFilter, setTeamFilter] = useState("All");

  const liveEmployees = employees.map(e => ({
    ...e,
    currentStatus: allStatuses[e.name]?.status || "Offline",
  })).filter(e => {
    if (statusFilter !== "All" && e.currentStatus !== statusFilter) return false;
    if (teamFilter !== "All" && !(e.tasks||[]).includes(teamFilter)) return false;
    return true;
  });

  const th = theme || _theme;

  return (
    <div style={{...CRD({padding:"14px 18px"}),marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:13,color:th.text,marginBottom:12,
        display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        📡 Live Team Status
        <span style={{fontSize:10,color:th.success,fontWeight:600,
          background:th.success+"20",borderRadius:10,padding:"2px 8px",
          animation:"pulse 2s infinite"}}>● LIVE</span>
        <div style={{marginLeft:"auto",display:"flex",gap:6,flexWrap:"wrap"}}>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
            style={{background:th.input,border:`1px solid ${th.inputBorder}`,borderRadius:6,
              padding:"4px 10px",fontSize:11,color:th.inputText,outline:"none"}}>
            <option value="All">All Status</option>
            {PRESENCE_STATUSES.map(s=><option key={s} value={s}>{PRESENCE_ICONS[s]} {s}</option>)}
          </select>
          <select value={teamFilter} onChange={e=>setTeamFilter(e.target.value)}
            style={{background:th.input,border:`1px solid ${th.inputBorder}`,borderRadius:6,
              padding:"4px 10px",fontSize:11,color:th.inputText,outline:"none"}}>
            <option value="All">All Teams</option>
            <option value="KFOOD">KFOOD</option>
            <option value="KEEMRT">KEEMRT</option>
          </select>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:8}}>
        {liveEmployees.slice(0,24).map(emp => {
          const st = emp.currentStatus;
          const stColor = st==="Online"?"#00FF88":st==="Break"?"#FFB800":st==="Meeting"?"#60A5FA":st==="Training"?"#A78BFA":"#6B7280";
          return (
            <div key={emp.id} style={{background:th.surface,
              border:`1px solid ${stColor}30`,borderRadius:10,padding:"10px 12px",
              display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:stColor,
                boxShadow:`0 0 6px ${stColor}`,flexShrink:0,
                animation:st==="Online"?"pulse 2s infinite":"none"}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:700,color:th.text,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {emp.name.split(" ").slice(0,2).join(" ")}
                </div>
                <div style={{fontSize:10,color:stColor,fontWeight:600}}>{PRESENCE_ICONS[st]||""} {st}</div>
              </div>
            </div>
          );
        })}
        {liveEmployees.length === 0 && (
          <div style={{color:th.textMuted,fontSize:12,padding:"16px",gridColumn:"1/-1",textAlign:"center"}}>
            No employees match the filter
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOME DASHBOARD — Personal per role ──────────────────────────────────────
function HomeDashboard({ session, employees, schedule, attendance, performance,
                         queueLog, notes, setNotes, breakSchedule, shifts, auditLog,
                         canEdit, isSuperAdmin, onNavigate }) {
  const todayKey  = todayStr();
  const dayName   = DAYS[new Date().getDay()];
  const now       = new Date();
  const timeStr   = now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"});
  const dateStr   = now.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",timeZone:"Asia/Riyadh"});

  const myId      = employees.find(e=>e.name===session?.name)?.id;
  const myRole    = session?.role;

  // ── Presence Status ────────────────────────────────────────────────────────
  const [myStatus, setMyStatus] = useState(() => {
    try { return localStorage.getItem("csops_status_"+session?.name) || "Online"; } catch { return "Online"; }
  });

  function changeStatus(newStatus) {
    setMyStatus(newStatus);
    try { localStorage.setItem("csops_status_"+session?.name, newStatus); } catch {}
    // Save to notes for realtime sync
    const entry = {
      id: "st"+Date.now(),
      ts: new Date().toISOString(),
      date: todayStr(),
      time: pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag: "UserStatus",
      text: JSON.stringify({ status: newStatus, empName: session?.name, empRole: session?.role }),
      from: session?.name||"",
      target: "all",
      msgType: "user_status",
    };
    if (setNotes) setNotes(prev => {
      const filtered = (Array.isArray(prev)?prev:[]).filter(n => !(n.tag==="UserStatus"&&n.from===session?.name));
      return [entry, ...filtered];
    });
    // Show Arabic message
    const arabicMsg = STATUS_ARABIC_MSGS[newStatus];
    if (arabicMsg) showToast(arabicMsg, "info", 4000);
  }

  // Get all users current status for admin view
  const allStatuses = useMemo(() => {
    const map = {};
    (Array.isArray(notes)?notes:[])
      .filter(n => n.tag === "UserStatus")
      .forEach(n => {
        try {
          const d = JSON.parse(n.text||"{}");
          if (!map[d.empName] || n.ts > map[d.empName].ts) {
            map[d.empName] = { status: d.status, ts: n.ts, role: d.empRole };
          }
        } catch {}
      });
    return map;
  }, [notes]);

  // ── Shared computed values ─────────────────────────────────────────────────
  const todayEmps = employees.filter(e=>{
    const v=(schedule[e.id]||{})[dayName]; return v&&v!=="OFF"&&v!=="LEAVE"&&v!=="PH";
  });
  const todayAtt  = attendance[todayKey]||{};
  const todayPerf = performance[todayKey]||{};
  const presentCnt= Object.values(todayAtt).filter(a=>isPresent(a.status)).length;
  const absentCnt = Object.values(todayAtt).filter(a=>isAbsent(a.status)).length;
  const lateCnt   = Object.values(todayAtt).filter(a=>(a.lateMin||0)>=7).length;
  const totalClosed= Object.values(todayPerf).reduce((s,p)=>s+(p.closed||0),0);
  const totalEsc  = Object.values(todayPerf).reduce((s,p)=>s+(p.escalations||0),0);

  // Queue
  const QKEYS     = ["tga","ob","oslo","some","kwtT2","qatT2","bahT2","uaeT2","someKwt","someQat","someBah","someUae"];
  const todayQEntries = Object.entries(queueLog||{}).filter(([k])=>k.startsWith(todayKey)).map(([,v])=>v);
  const latestQ   = todayQEntries.length>0
    ? todayQEntries.reduce((b,e)=>(e.updTime||"")>(b.updTime||"")?e:b, todayQEntries[0])
    : null;
  const totalQueue= latestQ ? QKEYS.reduce((s,k)=>s+Number(latestQ[k+"Curr"]||0),0) : 0;

  // My shift info (for agent/shift leader)
  const myShiftId = myId ? (schedule[myId]||{})[dayName] : null;
  const myShift   = shifts.find(s=>s.id===myShiftId);

  // My break info
  const myBreakKey = myShiftId ? `${todayKey}_${myShiftId}` : null;
  const myBreakEntry = myBreakKey&&myId ? (breakSchedule[myBreakKey]||{})[myId] : null;
  const myBreakStart = myBreakEntry&&myShift ? (()=>{
    const off = (Number(myBreakEntry.offsetHours)||0)*60+(Number(myBreakEntry.offsetMins)||0);
    const bm  = (toMin(myShift.start)+off)%1440;
    return pad(Math.floor(bm/60))+":"+pad(bm%60);
  })() : null;

  // Unread messages for me
  const myMessages = (Array.isArray(notes)?notes:[]).filter(n=>{
    if(n.tag!=="Manager Message") return false;
    return !n.target||n.target==="all"||n.target===session?.name;
  }).filter(n=>{
    // simple unread: created in last 24h
    return (Date.now()-new Date(n.ts).getTime()) < 24*60*60*1000;
  });

  // Pending swap requests for me
  const myPendingSwaps = (Array.isArray(notes)?notes:[]).filter(n=>{
    if(n.tag!=="Swap Request"&&n.tag!=="Break Swap Request") return false;
    try{
      const d=JSON.parse(n.text||"{}");
      return (d.toId===myId&&d.status==="pending_b")||(d.fromId===myId&&(d.status==="pending_b"||d.status==="pending_supervisor"));
    }catch{return false;}
  });

  // My performance today
  const myPerf    = myId ? todayPerf[myId] : null;
  const myAtt     = myId ? todayAtt[myId]  : null;

  // Recent audit events (last 5 for owner)
  const recentEvents = (Array.isArray(auditLog)?auditLog:[])
    .filter(l=>l.action!=="Page View")
    .slice(0,5);

  // Top performer today
  const topPerf   = Object.entries(todayPerf)
    .map(([id,p])=>({emp:employees.find(e=>e.id===id),closed:p.closed||0}))
    .filter(x=>x.emp&&x.closed>0)
    .sort((a,b)=>b.closed-a.closed)[0];

  // Absent supervisors warning
  const absentSupervisors = employees.filter(e=>{
    if(e.role==="Agent") return false;
    const onToday = (schedule[e.id]||{})[dayName];
    if(!onToday||onToday==="OFF") return false;
    const a = todayAtt[e.id];
    return a?.status==="Absent";
  });

  // My shift colleagues (for shift leader / agent)
  const myShiftColleagues = myShiftId
    ? employees.filter(e=>e.id!==myId&&(schedule[e.id]||{})[dayName]===myShiftId)
    : [];

  // ── Card builder ──────────────────────────────────────────────────────────
  function KPICard({icon,label,value,sub,color,onClick,alert}) {
    return (
      <div onClick={onClick}
        className={_theme.isDark?"glass-card":"glass-card-light"}
        style={{ ...CRD({padding:"16px 18px"}),
          borderTop:`3px solid ${color}`,
          cursor:onClick?"pointer":"default",
          position:"relative",
          background: alert ? color+"18" : undefined }}
        onMouseEnter={e=>{if(onClick){e.currentTarget.style.transform="translateY(-3px)";
          e.currentTarget.style.boxShadow=`0 8px 24px ${color}30`;}}}
        onMouseLeave={e=>{e.currentTarget.style.transform="none";
          e.currentTarget.style.boxShadow="";}}>
        {alert&&(
          <span style={{position:"absolute",top:10,right:10,fontSize:10,
            background:color,color:"#fff",borderRadius:20,padding:"2px 7px",
            fontWeight:800,boxShadow:`0 2px 8px ${color}60`}}>!</span>
        )}
        <div style={{fontSize:11,color:_theme.textMuted,fontWeight:700,
          marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>
          {icon} {label}
        </div>
        <div style={{fontSize:32,fontWeight:900,color,lineHeight:1,
          fontVariantNumeric:"tabular-nums"}}>{value}</div>
        {sub&&<div style={{fontSize:11,color:_theme.textMuted,marginTop:6,
          fontWeight:500}}>{sub}</div>}
      </div>
    );
  }

  function SectionTitle({children}) {
    return <div style={{fontWeight:800,fontSize:13,color:_theme.text,margin:"20px 0 10px"}}>{children}</div>;
  }

  // ── OWNER Dashboard ───────────────────────────────────────────────────────
  if(isSuperAdmin) return (
    <div>
      {/* Owner Master Console Header */}
      <div style={{marginBottom:20, background:"linear-gradient(135deg,rgba(255,215,0,0.1),rgba(255,215,0,0.05))",
        border:"1px solid rgba(255,215,0,0.3)", borderRadius:14, padding:"16px 20px"}}>
        <div style={{fontSize:22,fontWeight:900,color:"#FFD700",
          textShadow:"0 0 20px rgba(255,215,0,0.4)"}}>
          👑 Master Console — {timeStr}
        </div>
        <div style={{fontSize:12,color:"rgba(255,215,0,0.6)",marginTop:4,fontWeight:600}}>
          {dateStr} · Full Stealth Engaged · All Nodes Linked
        </div>
        {/* Live Status Bar */}
        <div style={{display:"flex",gap:12,marginTop:12,flexWrap:"wrap"}}>
          {[
            {label:"Online Now",value:Object.values(allStatuses).filter(s=>s.status==="Online").length,color:"#00FF88"},
            {label:"On Break",value:Object.values(allStatuses).filter(s=>s.status==="Break").length,color:"#FFB800"},
            {label:"In Meeting",value:Object.values(allStatuses).filter(s=>s.status==="Meeting").length,color:"#60A5FA"},
            {label:"Training",value:Object.values(allStatuses).filter(s=>s.status==="Training").length,color:"#A78BFA"},
            {label:"Total Queue",value:totalQueue,color:"#FF3366"},
          ].map(item=>(
            <div key={item.label} style={{background:"rgba(0,0,0,0.3)",borderRadius:8,
              padding:"6px 12px",border:`1px solid ${item.color}30`}}>
              <div style={{fontSize:10,color:item.color,fontWeight:700}}>{item.label}</div>
              <div style={{fontSize:18,fontWeight:900,color:item.color}}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {absentSupervisors.length>0&&(
        <div style={{background:"#FEF2F2",border:"2px solid #EF4444",borderRadius:10,
          padding:"10px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:20}}>⚠️</span>
          <div>
            <div style={{fontWeight:800,color:"#EF4444",fontSize:13}}>Supervisor Absence Alert</div>
            <div style={{fontSize:12,color:"#991B1B"}}>
              {absentSupervisors.map(e=>`${e.name} (${e.role})`).join(" · ")} absent today — ensure coverage
            </div>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:6}}>
        <KPICard icon="👥" label="Present Today" value={presentCnt}
          sub={`${absentCnt} absent · ${lateCnt} late`}
          color="#10B981" onClick={()=>onNavigate("Attendance")}/>
        <KPICard icon="📊" label="Queue Now" value={totalQueue}
          sub={totalQueue>300?"⚠️ High load":totalQueue>150?"Moderate":"Normal"}
          color={totalQueue>300?"#EF4444":totalQueue>150?"#F59E0B":"#10B981"}
          alert={totalQueue>300} onClick={()=>onNavigate("Queue")}/>
        <KPICard icon="✅" label="Cases Closed" value={totalClosed}
          sub={`${totalEsc} escalations`} color="#3B82F6"
          onClick={()=>onNavigate("Performance")}/>
        <KPICard icon="🏆" label="Top Performer" value={topPerf?.emp?.name?.split(" ")[0]||"—"}
          sub={topPerf?`${topPerf.closed} cases`:"No data yet"} color="#F59E0B"
          onClick={()=>onNavigate("Leaderboard")}/>
        <KPICard icon="🏅" label="Surveys Pending" value={
          (Array.isArray(notes)?notes:[]).filter(n=>{
            try{return n.tag==="Survey"&&JSON.parse(n.text||"{}").status!=="closed";}catch{return false;}
          }).length
        } sub="Active surveys" color="#8B5CF6" onClick={()=>onNavigate("Surveys")}/>
        <KPICard icon="📋" label="Scheduled Today" value={todayEmps.length}
          sub={`of ${employees.length} total`} color="#6366F1"
          onClick={()=>onNavigate("Schedule")}/>
      </div>

      <SectionTitle>⚡ Recent Activity</SectionTitle>
      <div style={{...CRD({padding:0}),overflow:"hidden"}}>
        {recentEvents.length===0
          ?<div style={{padding:"16px",color:_theme.textMuted,fontSize:13}}>No recent activity</div>
          :recentEvents.map((e,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"10px 14px",
            borderBottom:i<recentEvents.length-1?`1px solid ${_theme.cardBorder}20`:"none",
            alignItems:"center"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:_theme.primary,flexShrink:0}}/>
            <div style={{flex:1}}>
              <span style={{fontWeight:700,fontSize:12,color:_theme.text}}>{e.by}</span>
              <span style={{fontSize:12,color:_theme.textMuted}}> · {e.action}</span>
              {e.target&&<span style={{fontSize:11,color:_theme.textMuted}}> → {e.target}</span>}
            </div>
            <span style={{fontSize:10,color:_theme.textMuted,flexShrink:0}}>
              {new Date(e.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}
            </span>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap"}}>
        {[["📅 Schedule","Schedule"],["📋 Attendance","Attendance"],
          ["📑 Reports","Reports"],["👁️ Owner Analytics","Owner Analytics"]].map(([l,p])=>(
          <button key={p} onClick={()=>onNavigate(p)}
            style={{...PBT(_theme.primary,{fontSize:12,padding:"8px 16px"})}}>{l}</button>
        ))}
      </div>
    </div>
  );

  // ── TEAM LEAD Dashboard ───────────────────────────────────────────────────
  if(myRole==="Team Lead") return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:20,fontWeight:900,color:_theme.text}}>Team Lead Dashboard 👑</div>
        <div style={{fontSize:13,color:_theme.textMuted}}>{session?.name} · {dateStr} · {timeStr}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10,marginBottom:6}}>
        <KPICard icon="👥" label="Present" value={presentCnt}
          sub={`${absentCnt} absent · ${lateCnt} late`}
          color="#10B981" alert={absentCnt>3} onClick={()=>onNavigate("Attendance")}/>
        <KPICard icon="📊" label="Queue" value={totalQueue}
          sub={totalQueue>300?"Critical!":totalQueue>150?"Warning":"Normal"}
          color={totalQueue>300?"#EF4444":totalQueue>150?"#F59E0B":"#10B981"}
          alert={totalQueue>300} onClick={()=>onNavigate("Queue")}/>
        <KPICard icon="✅" label="Closed Today" value={totalClosed}
          sub={`${totalEsc} escalations · ${totalClosed>0?Math.round(totalEsc/totalClosed*100):0}% rate`}
          color="#3B82F6" onClick={()=>onNavigate("Performance")}/>
        <KPICard icon="☕" label="On Break Now" value={
          (() => {
            const nm=new Date().getHours()*60+new Date().getMinutes();
            return employees.filter(e=>{
              const sid=(schedule[e.id]||{})[dayName];
              if(!sid) return false;
              const bk=`${todayKey}_${sid}`;
              const en=(breakSchedule[bk]||{})[e.id];
              if(!en) return false;
              const sh=shifts.find(s=>s.id===sid);
              if(!sh) return false;
              const off=(Number(en.offsetHours)||0)*60+(Number(en.offsetMins)||0);
              const bs=(toMin(sh.start)+off)%1440;
              const be=(bs+Number(en.durationMin))%1440;
              return nm>=bs&&nm<=be;
            }).length;
          })()
        } sub="employees on break" color="#8B5CF6" onClick={()=>onNavigate("Break")}/>
        <KPICard icon="💬" label="New Messages" value={myMessages.length}
          sub="last 24h" color="#F59E0B" onClick={()=>onNavigate("Leaderboard")}/>
        <KPICard icon="🔄" label="Swap Requests" value={myPendingSwaps.length}
          sub="need action" color="#6366F1" alert={myPendingSwaps.length>0}
          onClick={()=>onNavigate("Schedule")}/>
      </div>

      {absentSupervisors.length>0&&(
        <div style={{background:"#FEF2F2",border:"1.5px solid #EF4444",borderRadius:10,
          padding:"10px 14px",marginBottom:14}}>
          <div style={{fontWeight:700,color:"#EF4444",fontSize:12}}>
            ⚠️ Supervisor absent: {absentSupervisors.map(e=>e.name).join(", ")}
          </div>
        </div>
      )}

      {/* ── My Status Selector ── */}
      <div style={{...CRD({padding:"14px 18px"}), marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13,color:_theme.text,marginBottom:12,
          display:"flex",alignItems:"center",gap:8}}>
          {PRESENCE_ICONS[myStatus]||"🟢"} My Status
          <span style={{fontSize:11,color:_theme.textMuted,fontWeight:400}}>— visible to supervisors in real-time</span>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {PRESENCE_STATUSES.map(s=>(
            <button key={s} onClick={()=>changeStatus(s)}
              style={{border:`2px solid ${myStatus===s?_theme.primary:"#CBD5E1"}`,
                borderRadius:20, padding:"7px 16px", fontSize:12, cursor:"pointer",
                fontWeight:700,
                background:myStatus===s?_theme.primary+"22":"transparent",
                color:myStatus===s?_theme.primary:_theme.textSub,
                display:"flex",alignItems:"center",gap:6,
                boxShadow:myStatus===s?`0 2px 8px ${_theme.primary}30`:"none",
                transition:"all 0.15s"}}>
              {PRESENCE_ICONS[s]} {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Admin: Live Team Status Board ── */}
      {(session?.role==="Team Lead"||session?.role==="Shift Leader"||session?.role==="SME") && (
        <LiveTeamStatusBoard
          employees={employees}
          allStatuses={allStatuses}
          theme={_theme}
        />
      )}

      <SectionTitle>⚡ Performance Snapshot</SectionTitle>
      <div style={{...CRD({padding:0}),overflowX:"auto",marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:_theme.isDark?"#0D1117":"#F8FAFC"}}>
              {["Employee","Status","Closed","Esc Rate","Break"].map(h=>(
                <th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,
                  color:_theme.text,borderBottom:`2px solid ${_theme.cardBorder}`}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {todayEmps.slice(0,8).map((emp,ri)=>{
              const a=todayAtt[emp.id]; const p=todayPerf[emp.id];
              const escR=p?.closed>0?Math.round((p.escalations||0)/p.closed*100):0;
              const sid=(schedule[emp.id]||{})[dayName];
              const bk=`${todayKey}_${sid}`;
              const be=(breakSchedule[bk]||{})[emp.id];
              const sh=shifts.find(s=>s.id===sid);
              let breakStr="—";
              if(be&&sh){
                const off=(Number(be.offsetHours)||0)*60+(Number(be.offsetMins)||0);
                const bm=(toMin(sh.start)+off)%1440;
                breakStr=pad(Math.floor(bm/60))+":"+pad(bm%60);
              }
              return (
                <tr key={emp.id} style={{background:ri%2===0?_theme.card:_theme.surface}}>
                  <td style={{padding:"7px 10px",fontWeight:600,color:_theme.text}}>{emp.name}</td>
                  <td style={{padding:"7px 10px"}}>
                    <span style={{fontSize:10,fontWeight:700,borderRadius:20,padding:"2px 8px",
                      background:a?.status==="Present"?"#F0FDF4":a?.status==="Absent"?"#FEF2F2":a?.status==="Late"?"#FEF9C3":"#F1F5F9",
                      color:a?.status==="Present"?"#166534":a?.status==="Absent"?"#991B1B":a?.status==="Late"?"#B45309":"#64748B"}}>
                      {a?.status||"—"}
                    </span>
                  </td>
                  <td style={{padding:"7px 10px",fontWeight:700,color:"#10B981"}}>{p?.closed||0}</td>
                  <td style={{padding:"7px 10px",fontWeight:700,
                    color:escR>=20?"#EF4444":escR>=10?"#F59E0B":"#10B981"}}>
                    {p?.closed>0?`${escR}%`:"—"}
                  </td>
                  <td style={{padding:"7px 10px",color:_theme.textMuted}}>{breakStr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {todayEmps.length>8&&(
          <div style={{padding:"8px 12px",fontSize:11,color:_theme.textMuted,
            borderTop:`1px solid ${_theme.cardBorder}`}}>
            +{todayEmps.length-8} more — <span style={{color:_theme.primary,cursor:"pointer"}}
              onClick={()=>onNavigate("Performance")}>View all in Performance →</span>
          </div>
        )}
      </div>

      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["📋 Attendance","Attendance"],["⚡ Performance","Performance"],
          ["☕ Break","Break"],["📊 Queue","Queue"],["📑 Reports","Reports"]].map(([l,p])=>(
          <button key={p} onClick={()=>onNavigate(p)}
            style={{...PBT(_theme.primary,{fontSize:12,padding:"7px 14px"})}}>{l}</button>
        ))}
      </div>
    </div>
  );

  // ── SHIFT LEADER Dashboard ────────────────────────────────────────────────
  if(myRole==="Shift Leader") return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:20,fontWeight:900,color:_theme.text}}>Shift Leader Dashboard 🛡️</div>
        <div style={{fontSize:13,color:_theme.textMuted}}>
          {session?.name} · {myShift?myShift.label:"No shift"} · {dateStr}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10,marginBottom:14}}>
        <KPICard icon="👥" label="My Shift Team" value={myShiftColleagues.length+1}
          sub={myShift?.label||"—"} color="#3B82F6" onClick={()=>onNavigate("Schedule")}/>
        <KPICard icon="✅" label="My Shift Closed" value={
          myShiftColleagues.concat(myId?[{id:myId}]:[])
            .reduce((s,e)=>s+(todayPerf[e.id]?.closed||0),0)
        } sub="cases today" color="#10B981" onClick={()=>onNavigate("Performance")}/>
        <KPICard icon="📊" label="Queue Now" value={totalQueue}
          color={totalQueue>300?"#EF4444":totalQueue>150?"#F59E0B":"#10B981"}
          sub={totalQueue>300?"Critical":"Normal"} alert={totalQueue>300}
          onClick={()=>onNavigate("Queue")}/>
        <KPICard icon="🔄" label="Swap Requests" value={myPendingSwaps.length}
          sub="need approval" color="#8B5CF6" alert={myPendingSwaps.length>0}
          onClick={()=>onNavigate("Schedule")}/>
      </div>

      <SectionTitle>👥 My Shift — {myShift?.label||"Today"}</SectionTitle>
      <div style={{...CRD({padding:0}),overflowX:"auto",marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:_theme.isDark?"#0D1117":"#F8FAFC"}}>
              {["Employee","Role","Attendance","Closed","Break Time"].map(h=>(
                <th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,
                  color:_theme.text,borderBottom:`2px solid ${_theme.cardBorder}`}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myShiftColleagues.map((emp,ri)=>{
              const a=todayAtt[emp.id]; const p=todayPerf[emp.id];
              const bk=`${todayKey}_${myShiftId}`;
              const be=(breakSchedule[bk]||{})[emp.id];
              let breakStr="Not set";
              if(be&&myShift){
                const off=(Number(be.offsetHours)||0)*60+(Number(be.offsetMins)||0);
                const bm=(toMin(myShift.start)+off)%1440;
                breakStr=pad(Math.floor(bm/60))+":"+pad(bm%60)+" ("+be.durationMin+"m)";
              }
              return (
                <tr key={emp.id} style={{background:ri%2===0?_theme.card:_theme.surface}}>
                  <td style={{padding:"7px 10px",fontWeight:600,color:_theme.text}}>{emp.name}</td>
                  <td style={{padding:"7px 10px"}}>
                    <span style={{fontSize:10,color:ROLE_COLORS[emp.role]||"#64748B",fontWeight:700}}>
                      {ROLE_ICONS[emp.role]} {emp.role}
                    </span>
                  </td>
                  <td style={{padding:"7px 10px"}}>
                    <span style={{fontSize:10,fontWeight:700,borderRadius:20,padding:"2px 8px",
                      background:a?.status==="Present"?"#F0FDF4":a?.status==="Absent"?"#FEF2F2":"#FEF9C3",
                      color:a?.status==="Present"?"#166534":a?.status==="Absent"?"#991B1B":"#B45309"}}>
                      {a?.status||"Not recorded"}
                    </span>
                  </td>
                  <td style={{padding:"7px 10px",fontWeight:700,color:"#10B981"}}>{p?.closed||0}</td>
                  <td style={{padding:"7px 10px",color:_theme.textMuted,fontSize:11}}>{breakStr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["📋 Attendance","Attendance"],["☕ Break","Break"],
          ["⚡ Performance","Performance"],["📝 Notes","Notes"]].map(([l,p])=>(
          <button key={p} onClick={()=>onNavigate(p)}
            style={{...PBT(_theme.primary,{fontSize:12,padding:"7px 14px"})}}>{l}</button>
        ))}
      </div>
    </div>
  );

  // ── AGENT Dashboard ───────────────────────────────────────────────────────
  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:20,fontWeight:900,color:_theme.text}}>
          Good {now.getHours()<12?"morning":now.getHours()<17?"afternoon":"evening"} {session?.name?.split(" ")[0]} 👋
        </div>
        <div style={{fontSize:13,color:_theme.textMuted}}>{dateStr} · {timeStr}</div>
      </div>

      {/* My shift + break card */}
      <div style={{...CRD({padding:"16px 18px"}),marginBottom:14,
        borderTop:`4px solid ${myShift?myShift.color:_theme.primary}`,
        background:`linear-gradient(135deg,${myShift?myShift.color:_theme.primary}12,${_theme.card})`}}>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:11,color:_theme.textMuted,fontWeight:600}}>Today's Shift</div>
            <div style={{fontSize:22,fontWeight:900,color:myShift?.color||_theme.primary}}>
              {myShift?myShift.label:myShiftId==="OFF"||!myShiftId?"Day Off":"—"}
            </div>
            {myShift&&<div style={{fontSize:11,color:_theme.textMuted}}>{myShift.start} – {myShift.end}</div>}
          </div>
          {myBreakStart&&myBreakEntry&&(
            <div>
              <div style={{fontSize:11,color:_theme.textMuted,fontWeight:600}}>My Break</div>
              <div style={{fontSize:22,fontWeight:900,color:"#8B5CF6"}}>{myBreakStart}</div>
              <div style={{fontSize:11,color:_theme.textMuted}}>{myBreakEntry.durationMin} min</div>
            </div>
          )}
          {myAtt&&(
            <div>
              <div style={{fontSize:11,color:_theme.textMuted,fontWeight:600}}>Attendance</div>
              <div style={{fontSize:16,fontWeight:800,
                color:myAtt.status==="Present"?"#10B981":myAtt.status==="Late"?"#F59E0B":"#EF4444"}}>
                {myAtt.status}
                {myAtt.lateMin>0&&<span style={{fontSize:11}}> (+{myAtt.lateMin}m)</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* My performance today */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
        <KPICard icon="✅" label="Closed Today" value={myPerf?.closed||0}
          sub="cases" color="#10B981" onClick={()=>onNavigate("Performance")}/>
        <KPICard icon="🏆" label="My Ranking" value={
          (() => {
            const sorted=[...Object.entries(todayPerf)]
              .sort((a,b)=>(b[1].closed||0)-(a[1].closed||0));
            const rank=sorted.findIndex(([id])=>id===myId);
            return rank>=0?`#${rank+1}`:"—";
          })()
        } sub={`of ${todayEmps.length}`} color="#F59E0B" onClick={()=>onNavigate("Leaderboard")}/>
        <KPICard icon="💬" label="Messages" value={myMessages.length}
          sub="new today" color="#3B82F6" alert={myMessages.length>0}
          onClick={()=>onNavigate("Leaderboard")}/>
      </div>

      {/* My badges preview */}
      {(()=>{
        const autoBadges=detectBadges(myId,performance,attendance,employees,[]);
        const manualB=(Array.isArray(notes)?notes:[])
          .filter(n=>n.tag==="Badge Award")
          .map(n=>{try{const d=JSON.parse(n.text||"{}");return d.empId===myId?d.badgeId:null;}catch{return null;}})
          .filter(Boolean);
        const all=[...new Set([...autoBadges,...manualB])];
        if(all.length===0) return null;
        return (
          <div style={{...CRD({padding:"12px 14px"}),marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:_theme.text,marginBottom:8}}>🏅 My Badges</div>
            <BadgesDisplay badgeIds={all}/>
          </div>
        );
      })()}

      {/* Pending swap requests */}
      {myPendingSwaps.length>0&&(
        <div style={{background:"#FEF3C7",border:"1.5px solid #FCD34D",borderRadius:10,
          padding:"10px 14px",marginBottom:14,cursor:"pointer"}}
          onClick={()=>onNavigate("Schedule")}>
          <div style={{fontWeight:700,color:"#B45309",fontSize:12}}>
            🔄 You have {myPendingSwaps.length} pending swap request(s) — tap to review
          </div>
        </div>
      )}

      {/* Quick messages */}
      {myMessages.length>0&&(
        <div style={{...CRD({padding:"12px 14px"}),marginBottom:14,
          border:`1.5px solid ${_theme.primary}30`}}>
          <div style={{fontSize:11,fontWeight:700,color:_theme.text,marginBottom:8}}>
            💬 Latest Message
          </div>
          {myMessages.slice(0,1).map(m=>(
            <div key={m.id} style={{fontSize:13,color:_theme.text,lineHeight:1.6}}>
              <span style={{color:_theme.textMuted,fontSize:11}}>from {m.from||"Manager"} · </span>
              {m.text?.slice(0,100)}{(m.text?.length||0)>100?"...":""}
            </div>
          ))}
        </div>
      )}

      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["🏆 Leaderboard","Leaderboard"],["⚡ Performance","Performance"],
          ["📋 Surveys","Surveys"],["🏅 Gamification","Gamification"]].map(([l,p])=>(
          <button key={p} onClick={()=>onNavigate(p)}
            style={{...PBT(_theme.primary,{fontSize:12,padding:"7px 14px"})}}>{l}</button>
        ))}
      </div>
    </div>
  );
}
// ─── INTERNAL DIRECT MESSAGING ───────────────────────────────────────────────
// Person-to-person messaging inside the app
// Stored in notes with tag: "Direct Message"

function DirectMessagesPanel({ employees, notes, setNotes, session, canEdit }) {
  const [tab, setTab]         = useState("inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [toEmp, setToEmp]     = useState("");
  const [msgText, setMsgText] = useState("");
  const [priority, setPriority] = useState("normal"); // normal | urgent
  const [sent, setSent]       = useState("");

  const myName = session?.name;
  const myRole = session?.role;

  const allDMs = (Array.isArray(notes)?notes:[])
    .filter(n=>n.tag==="Direct Message")
    .sort((a,b)=>b.ts.localeCompare(a.ts));

  const inbox   = allDMs.filter(n=>n.target===myName);
  const outbox  = allDMs.filter(n=>n.from===myName);
  const unread  = inbox.filter(n=>{
    try{return !JSON.parse(n.text||"{}").read;}catch{return true;}
  });

  function sendMessage() {
    if(!toEmp||!msgText.trim()){setSent("❌ Select recipient and write a message");return;}
    const dm = {
      id:"dm"+Date.now(),
      ts:new Date().toISOString(),
      date:todayStr(),
      time:pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag:"Direct Message",
      text:JSON.stringify({body:msgText.trim(),priority,read:false,
        senderRole:myRole}),
      from:myName||"",
      target:toEmp,
      msgType:"direct_message",
    };
    setNotes(prev=>[dm,...(Array.isArray(prev)?prev:[])]);
    setSent(`✅ Message sent to ${toEmp}`);
    setMsgText(""); setToEmp(""); setShowCompose(false);
    setTimeout(()=>setSent(""),3000);
    // Play soft ding
    playSoftDing();
  }

  function markRead(id) {
    setNotes(prev=>(Array.isArray(prev)?prev:[]).map(n=>{
      if(n.id!==id) return n;
      try{const d=JSON.parse(n.text||"{}");
        return {...n,text:JSON.stringify({...d,read:true})};}
      catch{return n;}
    }));
  }

  function deleteMsg(id) {
    setNotes(prev=>(Array.isArray(prev)?prev:[]).filter(n=>n.id!==id));
  }

  function priorityBadge(p) {
    if(p==="urgent") return (
      <span style={{background:"#FEF2F2",color:"#EF4444",border:"1px solid #FCA5A5",
        borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:800}}>🔴 URGENT</span>
    );
    return null;
  }

  function MsgCard({msg, isInbox}) {
    let d={body:"",priority:"normal",read:false};
    try{d=JSON.parse(msg.text||"{}");}catch{}
    const isUnread=isInbox&&!d.read;
    return (
      <div style={{background:isUnread?_theme.primary+"10":_theme.surface,
        border:`1.5px solid ${isUnread?_theme.primary+"50":_theme.cardBorder}`,
        borderRadius:10,padding:"12px 14px",marginBottom:8,
        borderLeft:d.priority==="urgent"?"4px solid #EF4444":
          isUnread?`4px solid ${_theme.primary}`:"4px solid transparent"}}>
        <div style={{display:"flex",justifyContent:"space-between",
          alignItems:"flex-start",marginBottom:6,gap:8}}>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontWeight:700,fontSize:12,color:_theme.text}}>
              {isInbox?`From: ${msg.from||"Unknown"}`:
                `To: ${msg.target||"Unknown"}`}
            </span>
            {priorityBadge(d.priority)}
            {isUnread&&<span style={{background:_theme.primary,color:"#fff",
              borderRadius:20,padding:"1px 6px",fontSize:9,fontWeight:800}}>NEW</span>}
          </div>
          <div style={{display:"flex",gap:4,flexShrink:0}}>
            <span style={{fontSize:10,color:_theme.textMuted}}>{msg.time}</span>
            {isInbox&&isUnread&&(
              <button onClick={()=>markRead(msg.id)}
                style={{background:"none",border:"none",color:_theme.primary,
                  cursor:"pointer",fontSize:10,fontWeight:700,padding:"0 4px"}}>
                Mark read
              </button>
            )}
            <button onClick={()=>deleteMsg(msg.id)}
              style={{background:"none",border:"none",color:"#94A3B8",
                cursor:"pointer",fontSize:14,padding:"0 2px"}}>✕</button>
          </div>
        </div>
        <div style={{fontSize:13,color:_theme.text,lineHeight:1.7,
          whiteSpace:"pre-wrap"}}>{d.body}</div>
      </div>
    );
  }

  return (
    <div style={{...CRD({padding:"14px 18px"}),marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"}}>
        <span style={{fontSize:16}}>💬</span>
        <span style={{fontWeight:800,fontSize:14,color:_theme.text}}>Direct Messages</span>
        {unread.length>0&&(
          <span style={{background:"#EF4444",color:"#fff",
            borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>
            {unread.length} unread
          </span>
        )}
        <div style={{marginLeft:"auto"}}>
          <button onClick={()=>setShowCompose(s=>!s)}
            style={{...PBT(_theme.primary,{fontSize:12,padding:"6px 14px"})}}>
            {showCompose?"✕ Cancel":"✉️ New Message"}
          </button>
        </div>
      </div>

      {/* Compose — Hierarchy Messaging Rules */}
      {showCompose&&(
        <div style={{background:_theme.surface,borderRadius:10,padding:"14px 16px",
          marginBottom:14,border:`1px solid ${_theme.cardBorder}`}}>

          {/* Hierarchy info banner */}
          <div style={{background:`${_theme.primary}10`,border:`1px solid ${_theme.primary}25`,
            borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:11,color:_theme.textSub}}>
            {myRole==="Agent"
              ? "📨 You can reply to messages from supervisors. Direct messaging to management is restricted."
              : myRole==="SME" || myRole==="Shift Leader"
              ? "📨 Send to your team members or other supervisors."
              : "📨 Broadcast to all or send directly to any team member."}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,marginBottom:10}}>
            <div>
              <label style={LBL}>Send To</label>
              <select value={toEmp} onChange={e=>setToEmp(e.target.value)}
                style={{...I({width:"100%"})}}>
                <option value="">— Select recipient —</option>
                {/* Hierarchy filtering */}
                {employees
                  .filter(e=>e.name!==myName)
                  .filter(e=>{
                    // Owner/Team Lead: can message anyone
                    if(myRole==="Team Lead") return true;
                    // Shift Leader & SME: can message anyone except owner
                    if(myRole==="Shift Leader"||myRole==="SME") return e.name!==SUPER_ADMIN;
                    // Agent: can ONLY message supervisors (TL, SL, SME) — NO agent-to-agent
                    if(myRole==="Agent") return e.role==="Team Lead"||e.role==="Shift Leader"||e.role==="SME";
                    return true;
                  })
                  .map(e=>(
                    <option key={e.id} value={e.name}>
                      {ROLE_ICONS[e.role]||"👤"} {e.name} ({e.role})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label style={LBL}>Priority</label>
              <select value={priority} onChange={e=>setPriority(e.target.value)}
                style={{...I({width:100})}}>
                <option value="normal">Normal</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>
          <label style={LBL}>Message</label>
          <textarea value={msgText} onChange={e=>setMsgText(e.target.value)}
            rows={3} style={{...I({resize:"vertical",width:"100%",marginBottom:10})}}
            placeholder="Type your message..."/>
          {sent&&<div style={{fontSize:12,fontWeight:600,marginBottom:8,
            color:sent.startsWith("✅")?"#10B981":"#EF4444"}}>{sent}</div>}
          <button onClick={sendMessage}
            style={{...PBT(priority==="urgent"?"#EF4444":_theme.primary,
              {width:"100%",padding:"10px"})}}>
            {priority==="urgent"?"🔴 Send Urgent":"✉️ Send Message"}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {[
          ["inbox",   `📥 Inbox (${inbox.length})`],
          ["unread",  `🔴 Unread (${unread.length})`],
          ["outbox",  `📤 Sent (${outbox.length})`],
        ].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{border:`2px solid ${tab===k?_theme.primary:"#CBD5E1"}`,
              borderRadius:20,padding:"4px 14px",fontSize:12,cursor:"pointer",
              fontWeight:700,background:tab===k?_theme.primary:"transparent",
              color:tab===k?"#fff":_theme.textSub}}>{l}</button>
        ))}
      </div>

      {/* Messages */}
      {tab==="inbox"&&(
        inbox.length===0
          ?<div style={{textAlign:"center",padding:"24px",color:_theme.textMuted,fontSize:13}}>
            <div style={{fontSize:32,marginBottom:6}}>📥</div>
            Your inbox is empty
          </div>
          :inbox.map(m=><MsgCard key={m.id} msg={m} isInbox={true}/>)
      )}
      {tab==="unread"&&(
        unread.length===0
          ?<div style={{textAlign:"center",padding:"24px",color:_theme.textMuted,fontSize:13}}>
            <div style={{fontSize:32,marginBottom:6}}>✅</div>
            No unread messages
          </div>
          :unread.map(m=><MsgCard key={m.id} msg={m} isInbox={true}/>)
      )}
      {tab==="outbox"&&(
        outbox.length===0
          ?<div style={{textAlign:"center",padding:"24px",color:_theme.textMuted,fontSize:13}}>
            <div style={{fontSize:32,marginBottom:6}}>📤</div>
            No sent messages
          </div>
          :outbox.map(m=><MsgCard key={m.id} msg={m} isInbox={false}/>)
      )}
    </div>
  );
}

// ─── DIRECT MESSAGING — Inbox & Send ─────────────────────────────────────────
function DirectMessageModal({ employees, session, notes, setNotes, onClose }) {
  const [tab, setTab]       = useState("inbox"); // inbox | send
  const [toEmp, setToEmp]   = useState("");
  const [msgText, setMsgText] = useState("");
  const [msgType, setMsgType] = useState("shoutout");
  const [sent, setSent]     = useState("");
  const myName = session?.name || "";

  const MSG_TYPES = [
    { k:"shoutout",   icon:"🌟", label:"Recognition" },
    { k:"motivation", icon:"🚀", label:"Motivation"  },
    { k:"reminder",   icon:"📌", label:"Reminder"    },
    { k:"info",       icon:"ℹ️",  label:"Info"        },
    { k:"urgent",     icon:"🚨", label:"Urgent"      },
  ];

  // My inbox
  const inbox = (Array.isArray(notes)?notes:[])
    .filter(n => (n.tag === "Direct Message" || n.tag === "Manager Message") &&
      (n.target === myName || n.target === "all") && n.from !== myName)
    .sort((a,b) => b.ts.localeCompare(a.ts))
    .slice(0, 20);

  // My sent
  const sent_msgs = (Array.isArray(notes)?notes:[])
    .filter(n => (n.tag === "Direct Message" || n.tag === "Manager Message") && n.from === myName)
    .sort((a,b) => b.ts.localeCompare(a.ts))
    .slice(0, 20);

  function sendMessage() {
    if (!toEmp || !msgText.trim()) { setSent("❌ Fill in all fields"); return; }
    const isAll = toEmp === "all";
    const msg = {
      id: "dm"+Date.now(),
      ts: new Date().toISOString(),
      date: todayStr(),
      time: pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag: isAll ? "Manager Message" : "Direct Message",
      text: msgText.trim(),
      from: myName,
      target: toEmp,
      msgType: msgType,
    };
    setNotes(prev => [msg, ...(Array.isArray(prev)?prev:[])]);
    setSent(`✅ Message sent to ${isAll ? "the whole team" : toEmp}`);
    setMsgText(""); setToEmp("");
    setTimeout(() => setSent(""), 3000);
  }

  function deleteMsg(id) {
    setNotes(prev => (Array.isArray(prev)?prev:[]).filter(n => n.id !== id));
  }

  const typeMap = {
    shoutout:   {icon:"🌟", color:"#F59E0B"},
    motivation: {icon:"🚀", color:"#3B82F6"},
    reminder:   {icon:"📌", color:"#8B5CF6"},
    info:       {icon:"ℹ️",  color:"#10B981"},
    urgent:     {icon:"🚨", color:"#EF4444"},
  };

  return (
    <Modal title="💬 Messages" onClose={onClose} width={560}>
      {/* Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[["inbox",`📥 Inbox (${inbox.length})`],["send","✉️ Send"],["sent",`📤 Sent (${sent_msgs.length})`]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{ border:`2px solid ${tab===k?_theme.primary:"#CBD5E1"}`,
              borderRadius:20, padding:"5px 14px", fontSize:12, cursor:"pointer",
              fontWeight:700, background:tab===k?_theme.primary:"transparent",
              color:tab===k?"#fff":_theme.textSub }}>{l}</button>
        ))}
      </div>

      {/* Inbox */}
      {tab==="inbox" && (
        <div style={{ maxHeight:400, overflowY:"auto" }}>
          {inbox.length === 0 ? (
            <div style={{ textAlign:"center", padding:"32px", color:_theme.textMuted }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
              No messages yet
            </div>
          ) : inbox.map(m => {
            const cfg = typeMap[m.msgType] || {icon:"💬", color:"#64748B"};
            return (
              <div key={m.id} style={{ ...CRD({padding:"12px 14px"}), marginBottom:8,
                border:`1.5px solid ${cfg.color}30`,
                display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{cfg.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8,
                    marginBottom:4, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:700, fontSize:12, color:_theme.text }}>
                      {m.from || "Management"}
                    </span>
                    {m.target === "all" && (
                      <span style={{ fontSize:10, background:"#E0E7FF", color:"#3730A3",
                        borderRadius:10, padding:"1px 6px", fontWeight:700 }}>Team</span>
                    )}
                    <span style={{ fontSize:10, color:_theme.textMuted, marginLeft:"auto" }}>
                      {m.date} {m.time}
                    </span>
                  </div>
                  <div style={{ fontSize:13, color:_theme.text, lineHeight:1.6 }}>{m.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Send */}
      {tab==="send" && (
        <div>
          <div style={{ marginBottom:12 }}>
            <label style={LBL}>Send To</label>
            <select value={toEmp} onChange={e=>setToEmp(e.target.value)}
              style={{ ...I({width:"100%"}) }}>
              <option value="">— Select recipient —</option>
              {/* Owner & Team Lead: can broadcast to all */}
              {(session?.role==="Team Lead"||session?.name===SUPER_ADMIN) && (
                <option value="all">📢 Whole Team (Broadcast)</option>
              )}
              {employees
                .filter(e=>e.name!==myName)
                .filter(e=>{
                  const r = session?.role;
                  if(r==="Team Lead"||session?.name===SUPER_ADMIN) return true;
                  if(r==="Shift Leader"||r==="SME") return e.name!==SUPER_ADMIN;
                  // Agent: ONLY supervisors — NO agent-to-agent at all
                  if(r==="Agent") return e.role==="Team Lead"||e.role==="Shift Leader"||e.role==="SME";
                  return true;
                })
                .map(e=>(
                  <option key={e.id} value={e.name}>
                    {ROLE_ICONS[e.role]||"👤"} {e.name} ({e.role})
                  </option>
                ))}
            </select>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={LBL}>Message Type</label>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {MSG_TYPES.map(t=>(
                <button key={t.k} onClick={()=>setMsgType(t.k)}
                  style={{ border:`2px solid ${msgType===t.k?_theme.primary:"#CBD5E1"}`,
                    borderRadius:8, padding:"6px 12px", cursor:"pointer",
                    background:msgType===t.k?_theme.primary+"18":"transparent",
                    fontSize:12, fontWeight:700,
                    color:msgType===t.k?_theme.primary:_theme.textSub }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={LBL}>Message</label>
            <textarea value={msgText} onChange={e=>setMsgText(e.target.value)} rows={3}
              style={{ ...I({width:"100%", resize:"vertical"}) }}
              placeholder="Write your message..."/>
          </div>
          {sent && <div style={{ padding:"8px 12px", borderRadius:8, marginBottom:10,
            background:sent.startsWith("✅")?"#F0FDF4":"#FEF2F2",
            color:sent.startsWith("✅")?"#166534":"#EF4444",
            fontSize:12, fontWeight:600 }}>{sent}</div>}
          <button onClick={sendMessage}
            style={{ ...PBT(_theme.primary,{width:"100%",padding:"11px"}) }}>
            ✉️ Send Message
          </button>
        </div>
      )}

      {/* Sent */}
      {tab==="sent" && (
        <div style={{ maxHeight:400, overflowY:"auto" }}>
          {sent_msgs.length === 0 ? (
            <div style={{ textAlign:"center", padding:"32px", color:_theme.textMuted }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
              No sent messages
            </div>
          ) : sent_msgs.map(m => {
            const cfg = typeMap[m.msgType] || {icon:"💬", color:"#64748B"};
            return (
              <div key={m.id} style={{ ...CRD({padding:"10px 14px"}), marginBottom:8,
                display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{cfg.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, color:_theme.textMuted, marginBottom:3 }}>
                    To: <strong>{m.target==="all"?"Whole Team":m.target}</strong> · {m.date} {m.time}
                  </div>
                  <div style={{ fontSize:12, color:_theme.text }}>{m.text}</div>
                </div>
                <button onClick={()=>deleteMsg(m.id)}
                  style={{ background:"none", border:"none", color:"#94A3B8",
                    cursor:"pointer", fontSize:16, flexShrink:0 }}>✕</button>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

// ─── SKELETON LOADER ─────────────────────────────────────────────────────────
function SkeletonLine({ width="100%", height=14, style={} }) {
  return (
    <div className={_theme.isDark?"skeleton":"skeleton-light"}
      style={{ width, height, margin:"6px 0", ...style }}/>
  );
}
function SkeletonCard({ rows=3 }) {
  return (
    <div style={{ ...CRD({padding:"16px 18px"}), marginBottom:10 }}>
      <SkeletonLine width="60%" height={16}/>
      {Array.from({length:rows}).map((_,i)=>(
        <SkeletonLine key={i} width={i===rows-1?"45%":"100%"} height={12}/>
      ))}
    </div>
  );
}
function SkeletonTable({ rows=5 }) {
  return (
    <div style={{ ...CRD({padding:0}), overflow:"hidden" }}>
      {Array.from({length:rows}).map((_,i)=>(
        <div key={i} style={{ display:"flex", gap:12, padding:"12px 16px",
          borderBottom:`1px solid ${_theme.cardBorder}20` }}>
          <SkeletonLine width={28} height={28} style={{ borderRadius:"50%", flexShrink:0, margin:0 }}/>
          <div style={{ flex:1 }}>
            <SkeletonLine width="55%" height={13} style={{ marginBottom:4 }}/>
            <SkeletonLine width="35%" height={10}/>
          </div>
          <SkeletonLine width={60} height={28} style={{ borderRadius:20, margin:0, flexShrink:0 }}/>
        </div>
      ))}
    </div>
  );
}

// ─── TOAST NOTIFICATION SYSTEM ───────────────────────────────────────────────
let _toastId = 0;
let _setToasts = null;

function ToastContainer() {
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => { _setToasts = setToasts; }, []);

  return (
    <div style={{ position:"fixed", top:16, right:16, zIndex:9999,
      display:"flex", flexDirection:"column", gap:8, pointerEvents:"none" }}>
      {toasts.map(t => (
        <div key={t.id} className="toast-enter"
          style={{ background: t.type==="success"?"#166534":t.type==="error"?"#991B1B":
                   t.type==="warning"?"#92400E":"#1E40AF",
            color:"#fff", borderRadius:12, padding:"12px 16px",
            boxShadow:"0 8px 24px rgba(0,0,0,0.4)",
            border:`1px solid rgba(255,255,255,0.15)`,
            fontSize:13, fontWeight:600, maxWidth:300,
            display:"flex", alignItems:"center", gap:8,
            pointerEvents:"all", backdropFilter:"blur(8px)" }}>
          <span style={{fontSize:16}}>{
            t.type==="success"?"✅":t.type==="error"?"❌":t.type==="warning"?"⚠️":"ℹ️"
          }</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function showToast(message, type="info", duration=3500) {
  if (!_setToasts) return;
  const id = ++_toastId;
  _setToasts(prev => [...prev, { id, message, type }]);
  setTimeout(() => {
    _setToasts(prev => prev.filter(t => t.id !== id));
  }, duration);
}

// ─── SHORT BREAK REQUEST SYSTEM ──────────────────────────────────────────────
// Employee requests a short break → Supervisor approves/rejects with reason
// Stored in notes (tag: "Short Break Request") — Realtime via existing channel
// AI recommendation for supervisor based on current Queue + on-break count

const SHORT_BREAK_TYPES = [
  { id:"prayer",   icon:"🕌", label:"Prayer Break",   maxMin:15 },
  { id:"personal", icon:"🚶", label:"Personal Break",  maxMin:5  },
  { id:"other",    icon:"⏸️", label:"Other",            maxMin:5  },
];

// ── Employee Request Form ─────────────────────────────────────────────────────
function ShortBreakRequestForm({ session, employees, notes, setNotes,
                                  breakSchedule, shifts, schedule }) {
  const [type,      setType]     = useState("prayer");
  const [duration,  setDuration] = useState(5);
  const [note,      setNote]     = useState("");
  const [sending,   setSending]  = useState(false);
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"});
  });

  const myName = session?.name;
  const myId   = employees.find(e=>e.name===myName)?.id;

  // Check if I already have a pending request
  const myPending = (Array.isArray(notes)?notes:[]).find(n=>{
    if(n.tag!=="Short Break Request") return false;
    try{const d=JSON.parse(n.text||"{}");
      return d.empId===myId && (d.status==="pending"||d.status==="approved");
    }catch{return false;}
  });

  function submit() {
    if(myPending){showToast("You already have a pending or active break request","warning");return;}
    const maxMin = SHORT_BREAK_TYPES.find(t=>t.id===type)?.maxMin || 5;
    if(duration > maxMin){showToast(`Max duration for this break type is ${maxMin} minutes`,"warning");return;}
    setSending(true);
    const bt = SHORT_BREAK_TYPES.find(t=>t.id===type);
    const req = {
      id: "sbr"+Date.now(),
      ts: new Date().toISOString(),
      date: todayStr(),
      time: pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag: "Short Break Request",
      text: JSON.stringify({
        empId:myId, empName:myName,
        type, typeLabel:bt?.label, typeIcon:bt?.icon,
        duration, note: note.trim(),
        startTime: startTime,
        status:"pending",
        requestedAt: new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"}),
      }),
      from: myName||"",
      target: "supervisors",
      msgType: "short_break_request",
    };
    setNotes(prev=>[req,...(Array.isArray(prev)?prev:[])]);
    showToast(`Break request sent ⏳ Waiting for supervisor approval`,"info");
    setSending(false);
    setNote("");
  }

  // My request status card
  if(myPending) {
    let d={};
    try{d=JSON.parse(myPending.text||"{}");} catch{}
    const statusColor = d.status==="approved"?"#10B981":d.status==="rejected"?"#EF4444":"#F59E0B";
    const statusLabel = d.status==="approved"?"✅ Approved":d.status==="rejected"?"❌ Rejected":"⏳ Pending...";
    return (
      <div style={{...CRD({padding:"16px 18px"}),
        borderTop:`3px solid ${statusColor}`,
        background: d.status==="approved"?"#F0FDF4":
                    d.status==="rejected"?"#FEF2F2":"#FFFBEB"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <span style={{fontSize:24}}>{d.typeIcon}</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:14,color:_theme.text}}>
              {d.typeLabel} — {d.duration} min
            </div>
            <div style={{fontSize:12,color:_theme.textMuted}}>Requested at {d.requestedAt}</div>
          </div>
          <span style={{fontWeight:800,fontSize:13,color:statusColor,
            background:statusColor+"18",borderRadius:20,padding:"4px 12px",
            border:`1px solid ${statusColor}40`}}>{statusLabel}</span>
        </div>
        {/* Approval progress */}
        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:d.rejectReason?12:0}}>
          <div style={{flex:1,background:_theme.surface,borderRadius:20,height:6,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:20,transition:"width 0.5s",
              width:d.status==="approved"?"100%":d.status==="rejected"?"100%":"50%",
              background:statusColor}}/>
          </div>
          <span style={{fontSize:11,color:statusColor,fontWeight:700}}>
            {d.status==="pending"?"Waiting for approval":
             d.status==="approved"?"Enjoy your break!":"Request declined"}
          </span>
        </div>
        {/* Reject reason */}
        {d.status==="rejected" && d.rejectReason && (
          <div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:10,
            padding:"10px 12px",marginTop:10}}>
            <div style={{fontSize:11,fontWeight:700,color:"#991B1B",marginBottom:4}}>
              Reason from supervisor:
            </div>
            <div style={{fontSize:13,color:"#7F1D1D"}}>{d.rejectReason}</div>
          </div>
        )}
        {/* Cancel if pending */}
        {d.status==="pending" && (
          <button onClick={()=>{
            setNotes(prev=>(Array.isArray(prev)?prev:[]).filter(n=>n.id!==myPending.id));
            showToast("Break request cancelled","info");
          }} style={{...PBT("#94A3B8",{fontSize:11,padding:"6px 12px",marginTop:10})}}>
            Cancel Request
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{...CRD({padding:"16px 18px"})}}>
      <div style={{fontWeight:800,fontSize:14,color:_theme.text,marginBottom:14,
        display:"flex",alignItems:"center",gap:8}}>
        ☕ Request Break
        <span style={{fontSize:11,color:_theme.textMuted,fontWeight:400}}>— Select type below</span>
      </div>

      {/* Type selector */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
        {SHORT_BREAK_TYPES.map(t=>(
          <button key={t.id} onClick={()=>{setType(t.id);setDuration(Math.min(duration,t.maxMin));}}
            style={{border:`2px solid ${type===t.id?_theme.primary:"#CBD5E1"}`,
              borderRadius:12,padding:"10px 8px",cursor:"pointer",textAlign:"center",
              background:type===t.id?_theme.primary+"18":_theme.surface,
              transition:"all 0.15s",
              boxShadow:type===t.id?`0 2px 10px ${_theme.primary}30`:"none"}}>
            <div style={{fontSize:22,marginBottom:4}}>{t.icon}</div>
            <div style={{fontSize:11,fontWeight:700,
              color:type===t.id?_theme.primary:_theme.text}}>{t.label}</div>
            <div style={{fontSize:10,color:_theme.textMuted,marginTop:2}}>
              max {t.maxMin} min
            </div>
          </button>
        ))}
      </div>

      {/* Start Time */}
      <label style={LBL}>⏰ Break Start Time</label>
      <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)}
        style={{...I({width:"100%",marginBottom:12,fontWeight:700,fontSize:14})}}/>

      {/* Duration */}
      <label style={LBL}>Duration (minutes) — max {SHORT_BREAK_TYPES.find(t=>t.id===type)?.maxMin||5} min</label>
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {(type==="prayer" ? [5,10,15] : [5]).map(d=>(
          <button key={d} onClick={()=>setDuration(d)}
            style={{border:`2px solid ${duration===d?_theme.primary:"#CBD5E1"}`,
              borderRadius:20,padding:"6px 16px",fontSize:12,cursor:"pointer",
              fontWeight:700,background:duration===d?_theme.primary+"22":_theme.surface,
              color:duration===d?_theme.primary:_theme.textSub}}>{d}m</button>
        ))}
      </div>

      {/* Note */}
      <label style={LBL}>Note (optional)</label>
      <input value={note} onChange={e=>setNote(e.target.value)}
        style={{...I({width:"100%",marginBottom:14})}}
        placeholder="Any additional info for supervisor..."/>

      <button onClick={submit} disabled={sending}
        style={{...PBT(_theme.primary,{width:"100%",padding:"12px",
          opacity:sending?0.7:1})}}>
        {sending?"Sending...":"📤 Send Break Request"}
      </button>
    </div>
  );
}

// ── Supervisor Break Request Dashboard ────────────────────────────────────────
function SupervisorBreakDashboard({ employees, notes, setNotes, session,
                                     breakSchedule, shifts, schedule, queueLog }) {
  const [rejectId,    setRejectId]    = useState(null);
  const [rejectText,  setRejectText]  = useState("");
  const [aiLoading,   setAiLoading]   = useState({});
  const [aiAdvice,    setAiAdvice]    = useState({});

  const todayKey = todayStr();
  const dayName  = DAYS[new Date().getDay()];
  const now      = new Date();
  const nowMin   = now.getHours()*60 + now.getMinutes();

  // All pending short break requests
  const allReqs = (Array.isArray(notes)?notes:[])
    .filter(n=>n.tag==="Short Break Request")
    .sort((a,b)=>b.ts.localeCompare(a.ts));
  const pending  = allReqs.filter(n=>{try{return JSON.parse(n.text||"{}").status==="pending";}catch{return false;}});
  const history  = allReqs.filter(n=>{try{const s=JSON.parse(n.text||"{}").status;return s!=="pending";}catch{return false;}});

  // Count currently on scheduled break
  const onBreakNow = employees.filter(emp=>{
    const sid=(schedule[emp.id]||{})[dayName];
    if(!sid||sid==="OFF") return false;
    const sh=shifts.find(s=>s.id===sid);
    if(!sh) return false;
    const bk=`${todayKey}_${sid}`;
    const en=(breakSchedule[bk]||{})[emp.id];
    if(!en) return false;
    const off=(Number(en.offsetHours)||0)*60+(Number(en.offsetMins)||0);
    const bs=(toMin(sh.start)+off)%1440;
    const be=(bs+Number(en.durationMin))%1440;
    return nowMin>=bs && nowMin<=be;
  }).length;

  // Queue load
  const QKEYS=["tga","ob","oslo","some","kwtT2","qatT2","bahT2","uaeT2","someKwt","someQat","someBah","someUae"];
  const todayQE=Object.entries(queueLog||{}).filter(([k])=>k.startsWith(todayKey)).map(([,v])=>v);
  const latestQ=todayQE.length>0?todayQE.reduce((b,e)=>(e.updTime||"")>(b.updTime||"")?e:b,todayQE[0]):null;
  const totalQueue=latestQ?QKEYS.reduce((s,k)=>s+Number(latestQ[k+"Curr"]||0),0):0;

  function updateReq(id, update) {
    setNotes(prev=>(Array.isArray(prev)?prev:[]).map(n=>{
      if(n.id!==id) return n;
      try{const d=JSON.parse(n.text||"{}");
        return {...n,text:JSON.stringify({...d,...update})};}
      catch{return n;}
    }));
  }

  function approve(req) {
    let d={};
    try{d=JSON.parse(req.text||"{}");} catch{}
    updateReq(req.id,{status:"approved",approvedBy:session?.name,
      approvedAt:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})});
    showToast(`✅ Break approved for ${d.empName}`,"success");
    playSoftDing();
  }

  function reject(req) {
    if(!rejectText.trim()){showToast("Please enter a rejection reason","error");return;}
    let d={};
    try{d=JSON.parse(req.text||"{}");} catch{}
    updateReq(req.id,{status:"rejected",rejectReason:rejectText.trim(),
      rejectedBy:session?.name});
    showToast(`Break request declined — reason sent to ${d.empName}`,"warning");
    setRejectId(null); setRejectText("");
  }

  async function getAIAdvice(req) {
    const id=req.id;
    setAiLoading(p=>({...p,[id]:true}));
    try{
      let d={};
      try{d=JSON.parse(req.text||"{}");} catch{}
      const prompt=`You are a CS Operations supervisor assistant. Advise briefly (1-2 sentences max) whether to APPROVE or DECLINE a short break request.

Current floor status:
- Queue load: ${totalQueue} cases ${totalQueue>300?"(CRITICAL)":totalQueue>150?"(HIGH)":"(NORMAL)"}
- Employees currently on scheduled break: ${onBreakNow}
- Pending break requests (besides this one): ${pending.length-1}

Break request: ${d.empName} requesting ${d.duration} min ${d.typeLabel}

Respond with: "✅ Recommend APPROVE" or "❌ Recommend DECLINE" followed by one short reason.`;

      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:120,
          messages:[{role:"user",content:prompt}]
        })
      });
      const data=await res.json();
      const text=(data.content||[]).map(c=>c.text||"").join("").trim();
      setAiAdvice(p=>({...p,[id]:text}));
    }catch(e){
      setAiAdvice(p=>({...p,[id]:"AI advice unavailable"}));
    }
    setAiLoading(p=>({...p,[id]:false}));
  }

  return (
    <div>
      {/* Floor Status Strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
        {[
          {label:"On Break Now",value:onBreakNow,color:"#F59E0B"},
          {label:"Queue Load",value:totalQueue,color:totalQueue>300?"#EF4444":totalQueue>150?"#F59E0B":"#10B981"},
          {label:"Pending Requests",value:pending.length,color:pending.length>0?"#8B5CF6":"#94A3B8"},
        ].map(({label,value,color})=>(
          <div key={label} style={{...CRD({padding:"10px 12px"}),borderTop:`3px solid ${color}`,textAlign:"center"}}>
            <div style={{fontSize:11,color:_theme.textMuted,fontWeight:600}}>{label}</div>
            <div style={{fontSize:26,fontWeight:900,color}}>{value}</div>
          </div>
        ))}
      </div>

      {/* Pending Requests */}
      {pending.length===0?(
        <div style={{...CRD({padding:"28px 20px"}),textAlign:"center",color:_theme.textMuted}}>
          <div style={{fontSize:32,marginBottom:8}}>☕</div>
          No pending break requests
        </div>
      ):pending.map(req=>{
        let d={};
        try{d=JSON.parse(req.text||"{}");} catch{}
        const isRejectOpen=rejectId===req.id;
        const advice=aiAdvice[req.id];
        const isApproveAdvised=advice&&advice.includes("APPROVE");
        const isDeclineAdvised=advice&&advice.includes("DECLINE");
        return (
          <div key={req.id} style={{...CRD({padding:"14px 16px"}),marginBottom:10,
            borderLeft:`4px solid ${d.typeIcon==="🕌"?"#8B5CF6":
                                    d.typeIcon==="💊"?"#EF4444":"#F59E0B"}`}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
              <span style={{fontSize:26,flexShrink:0}}>{d.typeIcon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:_theme.text}}>{d.empName}</div>
                <div style={{fontSize:12,color:_theme.textMuted}}>
                  {d.typeLabel} · {d.duration} min · Requested at {d.requestedAt}
                </div>
                {d.note&&<div style={{fontSize:12,color:_theme.textSub,marginTop:4,
                  fontStyle:"italic"}}>"{d.note}"</div>}
                {/* AI Advice */}
                {advice&&(
                  <div style={{marginTop:8,padding:"8px 10px",borderRadius:8,
                    background:isApproveAdvised?"#F0FDF4":isDeclineAdvised?"#FEF2F2":"#EFF6FF",
                    border:`1px solid ${isApproveAdvised?"#86EFAC":isDeclineAdvised?"#FCA5A5":"#BFDBFE"}`,
                    fontSize:12,fontWeight:600,
                    color:isApproveAdvised?"#166534":isDeclineAdvised?"#991B1B":"#1E40AF"}}>
                    🤖 {advice}
                  </div>
                )}
              </div>
              {/* Action buttons */}
              <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                <button onClick={()=>approve(req)}
                  style={{...PBT("#10B981",{fontSize:12,padding:"7px 14px"})}}>
                  ✅ Approve
                </button>
                <button onClick={()=>{setRejectId(isRejectOpen?null:req.id);setRejectText("");}}
                  style={{...PBT("#EF4444",{fontSize:12,padding:"7px 14px"})}}>
                  ❌ Decline
                </button>
                <button onClick={()=>getAIAdvice(req)}
                  disabled={!!aiLoading[req.id]}
                  style={{...PBT("#6366F1",{fontSize:11,padding:"5px 10px",
                    opacity:aiLoading[req.id]?0.7:1})}}>
                  {aiLoading[req.id]?"🤖...":"🤖 AI Advice"}
                </button>
              </div>
            </div>
            {/* Reject reason input */}
            {isRejectOpen&&(
              <div style={{marginTop:10,padding:"12px 14px",background:_theme.surface,
                borderRadius:10,border:"1px solid #FCA5A5"}}>
                <label style={{...LBL,color:"#EF4444"}}>⚠️ Rejection reason (required)</label>
                <textarea value={rejectText} onChange={e=>setRejectText(e.target.value)}
                  rows={2} autoFocus
                  style={{...I({resize:"none",width:"100%",marginBottom:8,
                    border:"1px solid #FCA5A5"})}}
                  placeholder="e.g. Queue is at critical level — please wait 15 minutes"/>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>reject(req)}
                    style={{...PBT("#EF4444",{flex:1,padding:"9px"})}}>
                    Confirm Rejection
                  </button>
                  <button onClick={()=>{setRejectId(null);setRejectText("");}}
                    style={{...PBT("#94A3B8",{padding:"9px 14px"})}}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* History */}
      {history.length>0&&(
        <div style={{marginTop:16}}>
          <div style={{fontSize:12,fontWeight:700,color:_theme.textMuted,marginBottom:8}}>
            History ({history.length})
          </div>
          {history.slice(0,6).map(req=>{
            let d={};
            try{d=JSON.parse(req.text||"{}");} catch{}
            const statusColor=d.status==="approved"?"#10B981":d.status==="rejected"?"#EF4444":"#94A3B8";
            return (
              <div key={req.id} style={{display:"flex",alignItems:"center",gap:8,
                padding:"8px 0",borderBottom:`1px solid ${_theme.cardBorder}20`,flexWrap:"wrap"}}>
                <span style={{fontSize:16}}>{d.typeIcon}</span>
                <div style={{flex:1,fontSize:12}}>
                  <span style={{fontWeight:700}}>{d.empName}</span>
                  <span style={{color:_theme.textMuted}}> · {d.typeLabel} {d.duration}m · {d.requestedAt}</span>
                </div>
                <span style={{background:statusColor+"18",color:statusColor,
                  borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:800}}>
                  {d.status==="approved"?"✅ Approved":d.status==="rejected"?"❌ Declined":"—"}
                </span>
                <button onClick={()=>setNotes(prev=>(Array.isArray(prev)?prev:[]).filter(n=>n.id!==req.id))}
                  style={{background:"none",border:"none",color:_theme.textMuted,cursor:"pointer",fontSize:14}}>✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── QUICK NOTE FAB COMPONENT ────────────────────────────────────────────────
function QuickNoteFAB({ currentName, setNotes, theme }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [tag,  setTag]  = useState("Exceptional Event");
  const QTAGS = ["Exceptional Event","Staffing Issue","Queue Alert","System Issue","General"];

  function save() {
    if (!text.trim()) return;
    const n = {
      id:"qn"+Date.now(), ts:new Date().toISOString(),
      date:todayStr(),
      time:pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag, text:text.trim(), from:currentName, target:"", msgType:"",
    };
    setNotes(prev=>[n,...(Array.isArray(prev)?prev:[])]);
    setText(""); setOpen(false);
    showToast("Note saved ✅","success",2000);
    playSoftDing();
  }

  return (
    <>
      <button onClick={()=>setOpen(o=>!o)} title="Quick Note"
        style={{ position:"fixed", bottom:80, right:16, zIndex:300,
          width:50, height:50, borderRadius:"50%",
          background:`linear-gradient(135deg,${theme.primary},${theme.accent||theme.primary})`,
          color:"#fff", border:"none",
          boxShadow:`0 4px 20px ${theme.primary}60`,
          cursor:"pointer", fontSize:22,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        {open?"✕":"📝"}
      </button>
      {open && (
        <div style={{ position:"fixed", bottom:140, right:16, zIndex:300,
          width:310, background:theme.card, borderRadius:16,
          boxShadow:"0 12px 40px rgba(0,0,0,0.4)",
          border:`1px solid rgba(255,255,255,0.1)`,
          padding:"16px", animation:"scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ fontWeight:800, color:theme.text, marginBottom:10, fontSize:13 }}>
            📝 Quick Note
          </div>
          <select value={tag} onChange={e=>setTag(e.target.value)}
            style={{ ...I({width:"100%",marginBottom:8}) }}>
            {QTAGS.map(t=><option key={t}>{t}</option>)}
          </select>
          <textarea value={text} onChange={e=>setText(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)) save(); }}
            rows={3} autoFocus
            style={{ ...I({resize:"none",width:"100%",marginBottom:10}) }}
            placeholder="Type your note... (Ctrl+Enter to save)"/>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={save}
              style={{ ...PBT(theme.primary,{flex:1,padding:"9px"}) }}>
              💾 Save
            </button>
            <button onClick={()=>{setOpen(false);setText("");}}
              style={{ ...PBT("#94A3B8",{padding:"9px 12px"}) }}>✕</button>
          </div>
        </div>
      )}
    </>
  );
}
// ─── GLOBAL SEARCH ───────────────────────────────────────────────────────────
function GlobalSearch({ employees, notes, auditLog, onNavigate, onClose, session }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q || q.length < 2) return [];
    const out = [];

    // Search employees
    employees.forEach(e => {
      if (e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)) {
        out.push({ type:"employee", icon:"👤", label:e.name, sub:e.role,
          color:ROLE_COLORS[e.role]||"#64748B", action:"Schedule" });
      }
    });

    // Search notes — skip private messages
    (Array.isArray(notes)?notes:[]).forEach(n => {
      // Privacy: only show notes accessible to current user
      const myName = session?.name || "";
      if (n.tag === "Direct Message") { if (n.target !== myName && n.from !== myName) return; }
      else if (n.tag === "Manager Message" && n.target && n.target !== "all") { if (n.target !== myName && n.from !== myName) return; }
      else if (["Short Break Request","Swap Request","Break Swap Request","Survey","Survey Response","Leave Request","Shift Handover","Dark Note","UserStatus","TT Ticket","Self Check-In","Password Reset Request"].includes(n.tag)) return;
      if (n.text?.toLowerCase().includes(q) || n.tag?.toLowerCase().includes(q)) {
        out.push({ type:"note", icon:"📝", label:n.text?.slice(0,60)||"Note",
          sub:`${n.date} · ${n.tag}`, color:"#8B5CF6", action:"Notes" });
      }
    });

    // Search audit log
    (Array.isArray(auditLog)?auditLog:[]).slice(0,200).forEach(l => {
      if (l.by?.toLowerCase().includes(q) || l.action?.toLowerCase().includes(q) ||
          l.detail?.toLowerCase().includes(q)) {
        out.push({ type:"log", icon:"🔍", label:`${l.action} — ${l.by}`,
          sub:new Date(l.ts).toLocaleString("en-GB",{timeZone:"Asia/Riyadh",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:false}),
          color:"#64748B", action:"Audit Log" });
      }
    });

    return out.slice(0, 12);
  }, [q, employees, notes, auditLog]);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
      zIndex:20000, display:"flex", alignItems:"flex-start", justifyContent:"center",
      padding:"80px 16px 16px" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:_theme.card, borderRadius:14, width:"100%", maxWidth:580,
        boxShadow:"0 24px 64px rgba(0,0,0,0.5)", border:`1px solid ${_theme.cardBorder}`,
        overflow:"hidden" }}>
        {/* Search input */}
        <div style={{ display:"flex", alignItems:"center", gap:10,
          padding:"14px 16px", borderBottom:`1px solid ${_theme.cardBorder}` }}>
          <span style={{ fontSize:18 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Escape") onClose(); }}
            placeholder="Search employees, notes, actions... (2+ chars)"
            style={{ flex:1, background:"transparent", border:"none", outline:"none",
              fontSize:15, color:_theme.text, fontFamily:"inherit" }}
          />
          <span style={{ fontSize:11, color:_theme.textMuted, whiteSpace:"nowrap" }}>ESC to close</span>
        </div>

        {/* Results */}
        <div style={{ maxHeight:400, overflowY:"auto" }}>
          {q.length < 2 && (
            <div style={{ padding:"28px 20px", textAlign:"center",
              color:_theme.textMuted, fontSize:13 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
              Type 2+ chars to search employees, notes, and audit log
            </div>
          )}
          {q.length >= 2 && results.length === 0 && (
            <div style={{ padding:"28px 20px", textAlign:"center",
              color:_theme.textMuted, fontSize:13 }}>
              No results for "<strong>{query}</strong>"
            </div>
          )}
          {results.map((r, i) => (
            <div key={i}
              onClick={()=>{ onNavigate(r.action); onClose(); }}
              style={{ display:"flex", alignItems:"center", gap:12,
                padding:"11px 16px", cursor:"pointer", transition:"background 0.1s",
                borderBottom:`1px solid ${_theme.cardBorder}40` }}
              onMouseEnter={e=>e.currentTarget.style.background=_theme.surface}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{ width:34, height:34, borderRadius:8, flexShrink:0,
                background:r.color+"22", border:`1px solid ${r.color}40`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:16 }}>{r.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:13, color:_theme.text,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.label}</div>
                <div style={{ fontSize:11, color:_theme.textMuted, marginTop:1 }}>{r.sub}</div>
              </div>
              <div style={{ fontSize:10, color:r.color, fontWeight:700,
                background:r.color+"18", borderRadius:6, padding:"2px 8px",
                flexShrink:0 }}>{r.type==="employee"?"employee":r.type==="note"?"note":"log"}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div style={{ padding:"8px 16px", fontSize:11, color:_theme.textMuted,
            borderTop:`1px solid ${_theme.cardBorder}`,
            background:_theme.surface }}>
            {results.length} results — click to navigate
          </div>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, employees, lang, setLang, onForgotPassword }) {
  const [selectedRole, setSelectedRole] = useState("Team Lead");
  const [selectedName, setSelectedName] = useState("");
  const [password, setPassword]         = useState("");
  const [newPw1, setNewPw1]             = useState("");
  const [newPw2, setNewPw2]             = useState("");
  const [error, setError]               = useState("");
  const [showPw, setShowPw]             = useState(false);
  const [step, setStep]                 = useState("login");
  const [showForgot, setShowForgot]     = useState(false);
  const [forgotName, setForgotName]     = useState("");
  const [forgotSent, setForgotSent]     = useState(false);

  const isRTL = false;
  const tr = (key) => T.en[key] || key;
  const isAgent = selectedRole === "Agent";
  const roleColor = ROLE_COLORS[selectedRole];
  const roleEmployees = employees.filter(e => e.role === selectedRole);

  function handleNameChange(name) {
    setSelectedName(name); setError(""); setPassword("");
    if (!name) { setStep("login"); return; }
    // Owner's own account — direct bypass
    if (isOwnerUser({ role: selectedRole, name })) {
      setStep("login"); return;
    }
    // All roles: must have password setup
    setStep(getUserPw(name) ? "login" : "setup");
  }

  async function tryLogin() {
    if (!selectedName) { setError(tr("selectYourName")); return; }

    // ── Owner master bypass ──────────────────────────────────────────────────
    // The Owner (Mohammed Nasser Althurwi) can enter ANY account directly
    // without a password. This is the Owner's privilege for support purposes.
    // His own account also bypasses password.
    const activeOwner = isOwnerUser({ role: selectedRole, name: selectedName });
    const ownerSession = JSON.parse(
      (() => { try { return localStorage.getItem("csops_session")||"null"; } catch { return "null"; } })()
    );
    const ownerIsLoggedIn = ownerSession && isOwnerUser(ownerSession);

    if (activeOwner || ownerIsLoggedIn) {
      // Owner accessing his own account — direct bypass
      if (activeOwner) {
        onLogin({ role: selectedRole, name: selectedName });
        return;
      }
      // Owner accessing ANOTHER account — bypass password, enter as that person
      if (ownerIsLoggedIn) {
        onLogin({ role: selectedRole, name: selectedName, accessedByOwner: true });
        return;
      }
    }

    // ── All roles (including Agent) require password ──────────────────────────
    const existing = getUserPw(selectedName);
    if (!existing) { setStep("setup"); return; }
    if (!password) { setError(tr("password") + "..."); return; }

    // Legacy plain-text migration (one-time upgrade to SHA-256)
    const isLegacyPlain = existing.length < 64;
    if (isLegacyPlain) {
      if (password !== existing) { setError(tr("incorrectPassword")); setPassword(""); return; }
      await setUserPw(selectedName, password);
      onLogin({ role: selectedRole, name: selectedName });
      return;
    }

    // Normal: compare SHA-256 hashes
    const inputHash = await hashPassword(password);
    if (inputHash !== existing) { setError(tr("incorrectPassword")); setPassword(""); return; }
    onLogin({ role: selectedRole, name: selectedName });
  }

  async function setupPassword() {
    if (!newPw1 || newPw1.length < 4) { setError("4+ characters required"); return; }
    if (newPw1 !== newPw2) { setError("Passwords do not match"); return; }
    await setUserPw(selectedName, newPw1);
    onLogin({ role:selectedRole, name:selectedName, isFirstLogin: true });
  }

  async function submitForgotPassword() {
    if (!forgotName.trim()) { setError("Please enter your name"); return; }
    const emp = employees.find(e => e.name === forgotName.trim());
    if (!emp) { setError("Name not found in system"); return; }
    // Create reset request note — stored in localStorage for supervisors to see
    const req = {
      id: "prr" + Date.now(),
      ts: new Date().toISOString(),
      date: new Date().toISOString().slice(0,10),
      time: pad(new Date().getHours()) + ":" + pad(new Date().getMinutes()),
      tag: "Password Reset Request",
      text: JSON.stringify({ empName: forgotName.trim(), empRole: emp.role, status: "pending", requestedAt: new Date().toISOString() }),
      from: forgotName.trim(),
      target: "supervisors",
      msgType: "password_reset",
    };
    // Save to localStorage notes (will sync to Supabase when supervisor logs in)
    try {
      const existing = JSON.parse(localStorage.getItem("csops_notes") || "[]");
      existing.unshift(req);
      localStorage.setItem("csops_notes", JSON.stringify(existing));
    } catch {}
    setForgotSent(true);
    setError("");
  }

  const dayTip = (DAILY_TIPS_EN)[new Date().getDay() % DAILY_TIPS_EN.length];

  return (
    <div dir="ltr" style={{
      minHeight:"100dvh",
      background:"linear-gradient(135deg,#0A0F1E 0%,#0F2744 50%,#0A0F1E 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif", padding:16,
      position:"relative", overflow:"hidden"
    }}>
      {/* Background decoration */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-20%", right:"-10%", width:400, height:400,
          borderRadius:"50%", background:"radial-gradient(circle,#3B82F620 0%,transparent 70%)" }}/>
        <div style={{ position:"absolute", bottom:"-10%", left:"-10%", width:300, height:300,
          borderRadius:"50%", background:"radial-gradient(circle,#8B5CF620 0%,transparent 70%)" }}/>
      </div>

      {/* Lang toggle top */}
      <div style={{ position:"absolute", top:20, right:20 }}>
        <button onClick={()=>{}}
          style={{ display:"none" }}>
          🌐 EN
        </button>
      </div>

      <div style={{ width:"100%", maxWidth:460, zIndex:1 }}>
        {/* Header card */}
        <div style={{ background:"linear-gradient(135deg,#060F2A,#0A1628,#111827)",
          border:"1px solid #0E2040", borderRadius:"20px 20px 0 0",
          padding:"36px 32px 28px", textAlign:"center",
          boxShadow:"0 4px 40px rgba(0,212,255,0.12), 0 0 80px rgba(0,212,255,0.04)" }}>
          {/* Cyber glow ring */}
          <div style={{ position:"relative", display:"inline-block", marginBottom:12 }}>
            <div style={{ fontSize:52, position:"relative", zIndex:1 }}>🎯</div>
            <div style={{ position:"absolute", inset:-8, borderRadius:"50%",
              background:"radial-gradient(circle,#00D4FF20 0%,transparent 70%)",
              animation:"pulse 2s infinite" }}/>
          </div>
          <div style={{ color:"#E0F2FF", fontWeight:900, fontSize:26, letterSpacing:-0.5,
            textShadow:"0 0 20px #00D4FF40" }}>
            CS <span style={{ color:"#00D4FF" }}>Operations</span>
          </div>
          <div style={{ color:"#60A5FA", fontSize:13, marginTop:4, fontWeight:600 }}>
            Management System v2.0
          </div>

          {/* Welcome message based on selected role */}
          {selectedName && (
            <div style={{ marginTop:14,
              background: selectedName === SUPER_ADMIN ? "rgba(255,215,0,0.08)" : "rgba(0,212,255,0.08)",
              border:`1px solid ${selectedName === SUPER_ADMIN ? "rgba(255,215,0,0.4)" : "rgba(0,212,255,0.25)"}`,
              borderRadius:10, padding:"10px 14px", fontSize:12,
              color: selectedName === SUPER_ADMIN ? "#FFD700" : "#00D4FF",
              fontWeight:600, textAlign:"left",
              boxShadow: selectedName === SUPER_ADMIN ? "0 0 12px rgba(255,215,0,0.2)" : "none" }}>
              {selectedName === SUPER_ADMIN ? ROLE_WELCOME["owner"] : ROLE_WELCOME[selectedRole] || "Welcome back."}
            </div>
          )}
          {!selectedName && (
            <div style={{ marginTop:14, background:"rgba(0,212,255,0.06)",
              border:"1px solid rgba(0,212,255,0.15)", borderRadius:10,
              padding:"10px 14px", fontSize:12, color:"#60A5FA",
              textAlign:"left" }}>
              💡 {dayTip}
            </div>
          )}

          <div style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:6,
            background:"rgba(0,255,136,0.12)", border:"1px solid rgba(0,255,136,0.25)",
            borderRadius:20, padding:"4px 14px" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#00FF88",
              boxShadow:"0 0 6px #00FF88", animation:"pulse 2s infinite" }}/>
            <span style={{ fontSize:11, color:"#00FF88", fontWeight:700 }}>
              LIVE · Auto-saved · Encrypted
            </span>
          </div>
        </div>

        {/* Form card */}
        <div style={{ background:"linear-gradient(180deg,#0A1628,#060F2A)",
          border:"1px solid #0E2040",
          borderTop:"none", borderRadius:"0 0 20px 20px",
          padding:"24px 28px 28px",
          boxShadow:"0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(0,212,255,0.04)" }}>

          {/* Role picker */}
          <div style={{ marginBottom:16 }}>
            <label style={{ ...LBL, color:"#9CA3AF" }}>{tr("selectRole")}</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {Object.keys(ROLE_CAN_EDIT).map(role => (
                <button key={role} onClick={()=>{ setSelectedRole(role); setSelectedName(""); setError(""); setPassword(""); setStep("login"); }}
                  style={{ border:`2px solid ${selectedRole===role ? ROLE_COLORS[role] : "rgba(14,32,64,0.8)"}`,
                    borderRadius:12, padding:"10px 12px", cursor:"pointer",
                    textAlign:"left", transition:"all 0.18s",
                    background: selectedRole===role ? ROLE_COLORS[role]+"20" : "rgba(6,15,42,0.8)",
                    display:"flex", alignItems:"center", gap:8,
                    boxShadow: selectedRole===role ? `0 0 12px ${ROLE_COLORS[role]}30` : "none" }}>
                  <span style={{ fontSize:18 }}>{ROLE_ICONS[role]}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700,
                      color: selectedRole===role ? ROLE_COLORS[role] : "#94A3B8" }}>{role}</div>
                    <div style={{ fontSize:10, color:"rgba(100,116,139,0.8)" }}>
                      {ROLE_DESC_EN[role]}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Name selector */}
          <div style={{ marginBottom:14 }}>
            <label style={{ ...LBL, color:"#60A5FA" }}>
              {isAgent ? tr("agentNameLabel") : tr("yourName")}
            </label>
            <select value={selectedName} onChange={e=>handleNameChange(e.target.value)}
              style={{ background:"rgba(6,15,42,0.9)", border:`1px solid ${error&&!selectedName?"#FF3366":"rgba(0,212,255,0.25)"}`,
                borderRadius:10, padding:"10px 14px", fontSize:14, color:"#E0F2FF",
                outline:"none", width:"100%", cursor:"pointer",
                boxShadow: selectedName ? "0 0 0 2px rgba(0,212,255,0.1)" : "none" }}>
              <option value="">-- {tr("selectName")} --</option>
              {roleEmployees.map(e=><option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>

          {/* Agent info */}
          {isAgent && !selectedName && (
            <div style={{ background:"rgba(0,212,255,0.06)", border:"1px solid rgba(0,212,255,0.15)",
              borderRadius:8, padding:"10px 14px", marginBottom:14,
              fontSize:12, color:"#60A5FA", textAlign:"left" }}>
              👁️ View access — password required on first login
            </div>
          )}

          {/* Password setup */}
          {selectedName && step==="setup" && (
            <div style={{ background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.2)",
              borderRadius:10, padding:"16px", marginBottom:14 }}>
              <div style={{ fontWeight:700, color:"#00D4FF", fontSize:13, marginBottom:8 }}>
                🔐 {tr("setPassword")}
              </div>
              <div style={{ fontSize:12, color:"#60A5FA", marginBottom:12 }}>
                {tr("firstLogin")} — <strong style={{color:"#00D4FF"}}>{selectedName}</strong>
              </div>
              <label style={{ ...LBL, color:"#60A5FA" }}>{tr("newPassword")}</label>
              <div style={{ position:"relative", marginBottom:10 }}>
                <input type={showPw?"text":"password"} value={newPw1}
                  onChange={e=>{setNewPw1(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&setupPassword()}
                  style={{ background:"rgba(6,15,42,0.9)", border:`1px solid ${error?"#FF3366":"rgba(0,212,255,0.3)"}`,
                    borderRadius:8, padding:"10px 42px 10px 14px", fontSize:14, color:"#E0F2FF",
                    outline:"none", width:"100%", boxSizing:"border-box" }}
                  placeholder="••••••••" autoFocus/>
                <button onClick={()=>setShowPw(p=>!p)}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", cursor:"pointer", fontSize:15, color:"#60A5FA" }}>
                  {showPw?"🙈":"👁️"}
                </button>
              </div>
              <label style={{ ...LBL, color:"#60A5FA" }}>{tr("confirmPassword")}</label>
              <input type={showPw?"text":"password"} value={newPw2}
                onChange={e=>{setNewPw2(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&setupPassword()}
                style={{ background:"rgba(6,15,42,0.9)", border:`1px solid ${error?"#FF3366":"rgba(0,212,255,0.3)"}`,
                  borderRadius:8, padding:"10px 14px", fontSize:14, color:"#E0F2FF",
                  outline:"none", width:"100%", boxSizing:"border-box", marginBottom:10 }}
                placeholder="••••••••"/>
              {error && <div style={{ color:"#FF6B8A", fontSize:12, marginBottom:8 }}>⚠️ {error}</div>}
              <button onClick={setupPassword}
                style={{ background:"linear-gradient(135deg,#0E7490,#00D4FF)", color:"#020818",
                  border:"none", borderRadius:10, padding:"11px", fontSize:14,
                  cursor:"pointer", fontWeight:800, width:"100%",
                  boxShadow:"0 4px 16px rgba(0,212,255,0.3)" }}>
                🔐 {tr("setAndSignIn")}
              </button>
            </div>
          )}

          {/* Password login */}
          {selectedName && step==="login" && (
            <div style={{ marginBottom:16 }}>
              <label style={{ ...LBL, color:"#60A5FA" }}>{tr("password")}</label>
              <div style={{ position:"relative" }}>
                <input type={showPw?"text":"password"} value={password}
                  onChange={e=>{setPassword(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&tryLogin()}
                  style={{ background:"rgba(6,15,42,0.9)", border:`1px solid ${error?"#FF3366":"rgba(0,212,255,0.3)"}`,
                    borderRadius:10, padding:"11px 42px 11px 14px", fontSize:14, color:"#E0F2FF",
                    outline:"none", width:"100%", boxSizing:"border-box",
                    boxShadow: password ? "0 0 0 2px rgba(0,212,255,0.15)" : "none" }}
                  placeholder="••••••••" autoFocus/>
                <button onClick={()=>setShowPw(p=>!p)}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", cursor:"pointer", fontSize:15, color:"#60A5FA" }}>
                  {showPw?"🙈":"👁️"}
                </button>
              </div>
              {error && <div style={{ color:"#FF6B8A", fontSize:12, marginTop:6 }}>⚠️ {error}</div>}
            </div>
          )}

          {error && !selectedName && (
            <div style={{ color:"#FF6B8A", fontSize:12, marginBottom:8 }}>⚠️ {error}</div>
          )}

          {/* Owner direct-access button */}
          {selectedName && isOwnerUser({role:selectedRole, name:selectedName}) && (
            <>
              <div style={{ background:"rgba(255,215,0,0.1)", border:"1px solid rgba(255,215,0,0.35)",
                borderRadius:10, padding:"10px 14px", marginBottom:12,
                fontSize:12, color:"#FFD700", fontWeight:700, textAlign:"center",
                boxShadow:"0 0 12px rgba(255,215,0,0.15)" }}>
                👑 Master Console — Direct access granted
              </div>
              <button onClick={()=>onLogin({role:selectedRole, name:selectedName})}
                style={{ background:"linear-gradient(135deg,#B45309,#FFD700,#B45309)",
                  color:"#1A0A00", border:"none", borderRadius:12, padding:"13px",
                  fontSize:15, cursor:"pointer", fontWeight:900, width:"100%",
                  boxShadow:"0 4px 24px rgba(255,215,0,0.4)", marginBottom:8, letterSpacing:0.5 }}>
                👁️ Enter Master Console
              </button>
            </>
          )}
          {selectedName && !isOwnerUser({role:selectedRole, name:selectedName}) &&
           step==="login" && !getUserPw(selectedName) === false && (
            <div style={{ background:"rgba(255,51,102,0.06)", border:"1px solid rgba(255,51,102,0.2)",
              borderRadius:8, padding:"8px 12px", marginBottom:8,
              fontSize:11, color:"#FF6B8A", textAlign:"center" }}>
              🔒 Password required — contact admin to reset
            </div>
          )}
          {selectedName && !isOwnerUser({role:selectedRole, name:selectedName}) && (step==="login") && (
            <button onClick={tryLogin}
              style={{ background:`linear-gradient(135deg,${roleColor}CC,${roleColor})`,
                color:"#fff", border:"none", borderRadius:12, padding:"13px",
                fontSize:15, cursor:"pointer", fontWeight:800, width:"100%",
                boxShadow:`0 4px 20px ${roleColor}50`, marginBottom:8,
                letterSpacing:0.3 }}>
              {ROLE_ICONS[selectedRole]} {isAgent ? `${tr("enterAs")} ${selectedName.split(" ")[0]}` : `${tr("signInAs")} ${selectedName.split(" ")[0]}`}
            </button>
          )}

          {/* Forgot Password link */}
          {!showForgot && (
            <div style={{ textAlign:"center", marginTop:8 }}>
              <button onClick={()=>{ setShowForgot(true); setError(""); setForgotSent(false); setForgotName(""); }}
                style={{ background:"none", border:"none", color:"rgba(0,212,255,0.5)",
                  fontSize:11, cursor:"pointer", textDecoration:"underline", fontWeight:600 }}>
                🔑 Forgot Password?
              </button>
            </div>
          )}

          {/* Forgot Password Panel */}
          {showForgot && (
            <div style={{ background:"rgba(0,212,255,0.05)", border:"1px solid rgba(0,212,255,0.2)",
              borderRadius:12, padding:"16px", marginTop:8 }}>
              {!forgotSent ? (
                <>
                  <div style={{ fontWeight:700, color:"#00D4FF", fontSize:13, marginBottom:10 }}>
                    🔑 Password Reset Request
                  </div>
                  <div style={{ fontSize:11, color:"rgba(0,212,255,0.6)", marginBottom:12, lineHeight:1.5 }}>
                    Enter your name to send a reset request to your supervisor.
                    <br/>Your password will be cleared after approval.
                  </div>
                  <select value={forgotName} onChange={e=>setForgotName(e.target.value)}
                    style={{ background:"rgba(6,15,42,0.9)", border:"1px solid rgba(0,212,255,0.3)",
                      borderRadius:8, padding:"10px 14px", fontSize:13, color:"#E0F2FF",
                      outline:"none", width:"100%", marginBottom:10 }}>
                    <option value="">— Select your name —</option>
                    {employees.map(e=><option key={e.id} value={e.name}>{e.name} ({e.role})</option>)}
                  </select>
                  {error && <div style={{ color:"#FF6B8A", fontSize:12, marginBottom:8 }}>⚠️ {error}</div>}
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setShowForgot(false)}
                      style={{ flex:1, background:"transparent", border:"1px solid rgba(0,212,255,0.2)",
                        color:"rgba(0,212,255,0.5)", borderRadius:8, padding:"9px", fontSize:12,
                        cursor:"pointer", fontWeight:600 }}>Cancel</button>
                    <button onClick={submitForgotPassword}
                      style={{ flex:2, background:"linear-gradient(135deg,#0E7490,#00D4FF)",
                        color:"#020818", border:"none", borderRadius:8, padding:"9px", fontSize:13,
                        cursor:"pointer", fontWeight:800 }}>Send Reset Request</button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign:"center", padding:"8px 0" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
                  <div style={{ fontWeight:700, color:"#00D4FF", fontSize:13, marginBottom:6 }}>
                    Request Sent Successfully
                  </div>
                  <div style={{ fontSize:11, color:"rgba(0,212,255,0.6)", lineHeight:1.6, marginBottom:12 }}>
                    Your supervisor has been notified.<br/>
                    Once approved, log in to set a new password.
                  </div>
                  <button onClick={()=>{ setShowForgot(false); setForgotSent(false); }}
                    style={{ background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.3)",
                      color:"#00D4FF", borderRadius:8, padding:"8px 20px", fontSize:12,
                      cursor:"pointer", fontWeight:700 }}>Back to Login</button>
                </div>
              )}
            </div>
          )}

          <div style={{ textAlign:"center", fontSize:11, color:"rgba(0,212,255,0.35)", marginTop:10,
            display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <span>🔒</span>
            <span>Secured by Supabase · Auto-saved · CS-OPS v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PASSWORD RESET MODAL (inside app, for admins) ───────────────────────────
function PasswordResetModal({ employees, session, notes, setNotes, onClose }) {
  const [search, setSearch] = useState("");
  const [done, setDone]     = useState("");
  const [tab, setTab]       = useState("manual"); // "manual" | "requests"
  const isOwner = isOwnerUser(session);

  // Pending reset requests from notes
  const pendingResets = (Array.isArray(notes)?notes:[])
    .filter(n => n.tag === "Password Reset Request")
    .map(n => { try { return {...JSON.parse(n.text||"{}"), noteId:n.id, ts:n.ts}; } catch { return null; } })
    .filter(Boolean)
    .filter(n => n.status === "pending")
    .sort((a,b) => b.ts.localeCompare(a.ts));

  async function approveReset(item) {
    if (!window.confirm(`Approve password reset for "${item.empName}"?
Only their password will be cleared. All other data stays intact.`)) return;
    // Clear ONLY the password — nothing else is touched
    await resetUserPw(item.empName);
    // Mark request as approved in notes
    if (setNotes) {
      setNotes(prev => (Array.isArray(prev)?prev:[]).map(n =>
        n.id === item.noteId
          ? {...n, text: JSON.stringify({...item, status:"approved", approvedBy:session?.name, approvedAt:new Date().toISOString()})}
          : n
      ));
    }
    setDone(`✅ Password cleared for "${item.empName}" — they can now set a new one on next login`);
    setTimeout(() => setDone(""), 5000);
  }

  function dismissReset(noteId) {
    if (setNotes) setNotes(prev => (Array.isArray(prev)?prev:[]).filter(n => n.id !== noteId));
  }

  // Who can reset whom:
  // Owner → can reset anyone (all roles)
  // Team Lead / Shift Leader → can reset all except Owner
  const canResetEmp = (emp) => {
    if (isOwner) return emp.name !== session.name; // Owner can reset all except himself
    // Team Lead / Shift Leader can reset all non-owners except themselves
    return emp.name !== session.name && !isOwnerUser({ name: emp.name, role: emp.role });
  };

  const visibleEmps = employees
    .filter(e => canResetEmp(e) && e.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => a.name.localeCompare(b.name));

  async function doReset(emp) {
    const confirm1 = window.confirm(
      `⚠️ Reset password for "${emp.name}"?

Their password will be cleared. They will set a new one on next login.`
    );
    if (!confirm1) return;
    // DELETE the password entirely — do NOT set a new one
    await resetUserPw(emp.name);
    setDone(`✅ Password cleared for "${emp.name}" — they will set a new one on next login`);
    setTimeout(() => setDone(""), 5000);
  }

  return (
    <Modal title="🔑 Reset Password" onClose={onClose} width={560}>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {[["manual","🔑 Manual Reset"],["requests",`📥 Pending Requests${pendingResets.length>0?" ("+pendingResets.length+")":""}`]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{ border:`2px solid ${tab===k?_theme.primary:"#CBD5E1"}`,
              borderRadius:20, padding:"5px 14px", fontSize:12, cursor:"pointer", fontWeight:700,
              background:tab===k?_theme.primary:"transparent",
              color:tab===k?"#fff":_theme.textSub }}>
            {l}
          </button>
        ))}
      </div>

      {done && (
        <div style={{ background:"#F0FDF4", border:"1px solid #86EFAC",
          borderRadius:8, padding:"10px 14px", marginBottom:12,
          fontSize:13, color:"#166534", fontWeight:600 }}>{done}</div>
      )}

      {/* Pending Requests Tab */}
      {tab==="requests" && (
        <div>
          {pendingResets.length===0 ? (
            <div style={{ textAlign:"center", padding:"32px", color:_theme.textMuted }}>
              <div style={{ fontSize:36, marginBottom:8 }}>✅</div>
              No pending reset requests
            </div>
          ) : pendingResets.map(item => (
            <div key={item.noteId} style={{ background:_theme.surface,
              border:`1.5px solid ${_theme.primary}30`, borderRadius:10,
              padding:"12px 14px", marginBottom:8,
              display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
              <span style={{ fontSize:20 }}>{ROLE_ICONS[item.empRole]||"👤"}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, color:_theme.text }}>{item.empName}</div>
                <div style={{ fontSize:11, color:_theme.textMuted }}>
                  {item.empRole} · Requested at {item.ts?.slice(11,16)}
                </div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={()=>approveReset(item)}
                  style={{ background:"#10B981", color:"#fff", border:"none",
                    borderRadius:8, padding:"6px 14px", fontSize:12,
                    cursor:"pointer", fontWeight:700 }}>✅ Approve</button>
                <button onClick={()=>dismissReset(item.noteId)}
                  style={{ background:"rgba(239,68,68,0.1)", color:"#EF4444",
                    border:"1px solid rgba(239,68,68,0.3)",
                    borderRadius:8, padding:"6px 12px", fontSize:12,
                    cursor:"pointer", fontWeight:700 }}>✕ Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Reset Tab */}
      {tab==="manual" && (<>
      {/* Privacy note */}
      <div style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)",
        borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12, color:_theme.textSub }}>
        <div style={{ fontWeight:700, marginBottom:4 }}>🔒 Password Only — Data Protected</div>
        Resets ONLY the password. All attendance, tasks, schedule and data stay intact.
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)}
        style={{ ...I(), marginBottom:12 }} placeholder="🔍 Search name..."/>

      <div style={{ maxHeight:340, overflowY:"auto" }}>
        {visibleEmps.map(emp => {
          const hasPw = !!getUserPw(emp.name);
          return (
            <div key={emp.id} style={{ display:"flex", alignItems:"center", gap:10,
              padding:"10px 0", borderBottom:`1px solid ${_theme.cardBorder}` }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13, color:_theme.text }}>{emp.name}</div>
                <div style={{ fontSize:11, color:ROLE_COLORS[emp.role]||"#64748B" }}>
                  {ROLE_ICONS[emp.role]||"👤"} {emp.role}
                </div>
                <div style={{ fontSize:11, marginTop:2 }}>
                  {hasPw
                    ? <span style={{ color:"#10B981" }}>✅ Has password</span>
                    : <span style={{ color:"#F59E0B" }}>⚠️ No password yet</span>}
                </div>
              </div>
              {hasPw ? (
                <button onClick={()=>doReset(emp)}
                  style={{ ...PBT("#EF4444",{ padding:"7px 14px", fontSize:12 }) }}>
                  🔄 Clear Password
                </button>
              ) : (
                <span style={{ fontSize:11, color:_theme.textMuted,
                  background:_theme.surface, borderRadius:6,
                  padding:"6px 12px", border:`1px solid ${_theme.cardBorder}` }}>
                  None
                </span>
              )}
            </div>
          );
        })}
        {visibleEmps.length === 0 && (
          <div style={{ color:_theme.textMuted, textAlign:"center", padding:24 }}>
            No results
          </div>
        )}
      </div>
      </>)}
    </Modal>
  );
}

function OwnerAccessBanner({ targetName, onExit }) {
  return (
    <>
      {/* Gold border frame around entire screen - Shadow Mode indicator */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:99999,
        boxShadow:"inset 0 0 0 3px #FFD700, inset 0 0 0 5px rgba(255,215,0,0.2)",
        borderRadius:0 }}/>
      {/* Top shadow banner */}
      <div style={{
        background:"linear-gradient(135deg,rgba(180,120,0,0.97),rgba(255,215,0,0.95),rgba(180,120,0,0.97))",
        padding:"8px 20px", textAlign:"center", fontSize:12, zIndex:100001,
        color:"#1A0A00", fontWeight:800, display:"flex", alignItems:"center",
        justifyContent:"center", gap:12, position:"relative",
        boxShadow:"0 2px 20px rgba(255,215,0,0.4)" }}>
        <span style={{ fontSize:16 }}>👁️</span>
        <span>SHADOW MODE ACTIVE — Viewing as: <strong>{targetName}</strong> · Full edit access enabled</span>
        <span style={{ fontSize:16 }}>👁️</span>
        <button onClick={onExit}
          style={{ background:"rgba(0,0,0,0.25)", border:"1px solid rgba(0,0,0,0.4)",
            color:"#1A0A00", borderRadius:6, padding:"3px 14px", cursor:"pointer",
            fontSize:11, fontWeight:900, marginLeft:8 }}>✕ EXIT SHADOW</button>
      </div>
    </>
  );
}

function ReadOnlyBanner({ userName }) {
  return (
    <div style={{ background:"#FEF9C3", border:"1.5px solid #F59E0B", borderRadius:8,
      padding:"10px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
      <span style={{ fontSize:18 }}>👁️</span>
      <div style={{ fontSize:13, color:"#78350F" }}>
        <strong>View Only Mode</strong> -- Logged in as <strong>{userName||"Agent"}</strong>. You can browse all data but cannot make changes.
      </div>
    </div>
  );
}


// ─── TT TRACKER PAGE ──────────────────────────────────────────────────────────
function TTTrackerPage({ employees, notes, setNotes, session, canEdit }) {
  const [caseId,    setCaseId]    = useState("");
  const [ttNum,     setTtNum]     = useState("");
  const [country,   setCountry]   = useState("KSA");
  const [ttDate,    setTtDate]    = useState(todayStr());
  const [status,    setStatus]    = useState("Open");
  const [filterSt,  setFilterSt]  = useState("All");
  const [filterCo,  setFilterCo]  = useState("All");
  const [saved,     setSaved]     = useState("");
  const [tick,      setTick]      = useState(0);

  // Live clock for SLA
  useEffect(() => {
    const t = setInterval(() => setTick(p=>p+1), 60000);
    return () => clearInterval(t);
  }, []);

  const myName = session?.name;
  const isOwner = session?.name === SUPER_ADMIN;
  const isSupervisor = ["Team Lead","Shift Leader","SME"].includes(session?.role) || isOwner;
  const COUNTRIES = ["KSA","KWT","UAE","QAT","BAH","EGY","Other"];
  const STATUSES  = ["Open","In Progress","Escalated","Closed"];

  // Load tickets from notes
  const allTickets = (Array.isArray(notes)?notes:[])
    .filter(n => n.tag === "TT Ticket")
    .map(n => { try { return { ...JSON.parse(n.text||"{}"), noteId:n.id, ts:n.ts }; } catch { return null; } })
    .filter(Boolean)
    .sort((a,b) => b.ts.localeCompare(a.ts));

  // Filter by role
  const myTickets = isOwner || isSupervisor
    ? allTickets
    : allTickets.filter(t => t.createdBy === myName);

  // Apply filters
  const filtered = myTickets.filter(t => {
    if (filterSt !== "All" && t.status !== filterSt) return false;
    if (filterCo !== "All" && t.country !== filterCo) return false;
    return true;
  });

  // SLA check: Open tickets > 72 hours = critical
  function hoursOpen(ticket) {
    if (ticket.status === "Closed") return 0;
    const created = new Date(ticket.createdAt || ticket.ts);
    return Math.floor((Date.now() - created.getTime()) / (1000*60*60));
  }
  function isSLABreach(ticket) {
    return ticket.status === "Open" && hoursOpen(ticket) > 72;
  }
  function isSLAWarning(ticket) {
    const h = hoursOpen(ticket);
    return ticket.status === "Open" && h > 48 && h <= 72;
  }

  function addTicket() {
    if (!caseId.trim() || !ttNum.trim()) { setSaved("❌ Case ID and TT# are required"); setTimeout(()=>setSaved(""),3000); return; }
    const entry = {
      id: "tt"+Date.now(),
      ts: new Date().toISOString(),
      date: todayStr(),
      time: pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag: "TT Ticket",
      text: JSON.stringify({
        caseId: caseId.trim(),
        ttNum: ttNum.trim(),
        country,
        date: ttDate,
        status,
        createdBy: myName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      from: myName||"",
      target: "all",
      msgType: "tt_ticket",
    };
    if (setNotes) setNotes(prev => [entry, ...(Array.isArray(prev)?prev:[])]);
    setCaseId(""); setTtNum(""); setStatus("Open");
    setSaved("✅ Ticket added successfully");
    setTimeout(()=>setSaved(""),3000);
  }

  function updateTicketStatus(noteId, newStatus) {
    if (!setNotes) return;
    setNotes(prev => (Array.isArray(prev)?prev:[]).map(n => {
      if (n.id !== noteId) return n;
      try {
        const d = JSON.parse(n.text||"{}");
        return { ...n, text: JSON.stringify({ ...d, status: newStatus, updatedAt: new Date().toISOString() }) };
      } catch { return n; }
    }));
  }

  function deleteTicket(noteId) {
    if (!canEdit) return;
    if (!window.confirm("Delete this ticket?")) return;
    if (setNotes) setNotes(prev => (Array.isArray(prev)?prev:[]).filter(n => n.id !== noteId));
  }

  const statusColor = s => s==="Open"?"#EF4444":s==="In Progress"?"#F59E0B":s==="Escalated"?"#8B5CF6":s==="Closed"?"#10B981":"#64748B";
  const breachCount = myTickets.filter(isSLABreach).length;
  const warningCount = myTickets.filter(isSLAWarning).length;

  return (
    <div>
      {/* SLA Alert Banner */}
      {breachCount > 0 && (
        <div style={{ background:"rgba(239,68,68,0.12)", border:"2px solid rgba(239,68,68,0.5)",
          borderRadius:12, padding:"12px 18px", marginBottom:16,
          display:"flex", alignItems:"center", gap:10,
          animation:"pulse 1.5s infinite" }}>
          <span style={{ fontSize:20 }}>🚨</span>
          <div>
            <div style={{ fontWeight:800, color:"#EF4444", fontSize:14 }}>
              SLA BREACH — {breachCount} ticket{breachCount>1?"s":""} open over 72 hours!
            </div>
            <div style={{ fontSize:12, color:"#FCA5A5" }}>Immediate action required</div>
          </div>
        </div>
      )}
      {warningCount > 0 && breachCount === 0 && (
        <div style={{ background:"rgba(245,158,11,0.1)", border:"1.5px solid rgba(245,158,11,0.35)",
          borderRadius:10, padding:"10px 16px", marginBottom:14,
          display:"flex", alignItems:"center", gap:8 }}>
          <span>⚠️</span>
          <span style={{ fontWeight:700, color:"#F59E0B", fontSize:13 }}>
            {warningCount} ticket{warningCount>1?"s":""} approaching 72hr SLA limit
          </span>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10, marginBottom:16 }}>
        {[
          { label:"Total", value:myTickets.length, color:"#60A5FA" },
          { label:"Open", value:myTickets.filter(t=>t.status==="Open").length, color:"#EF4444" },
          { label:"In Progress", value:myTickets.filter(t=>t.status==="In Progress").length, color:"#F59E0B" },
          { label:"Escalated", value:myTickets.filter(t=>t.status==="Escalated").length, color:"#8B5CF6" },
          { label:"Closed", value:myTickets.filter(t=>t.status==="Closed").length, color:"#10B981" },
          { label:"SLA Breach", value:breachCount, color:"#FF1744" },
        ].map(k=>(
          <div key={k.label} style={{ ...CRD({padding:"12px 14px"}), borderTop:`3px solid ${k.color}` }}>
            <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:600 }}>{k.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Add Ticket Form */}
      {canEdit && (
        <div style={{ ...CRD({padding:"16px 20px"}), marginBottom:16 }}>
          <div style={{ fontWeight:700, fontSize:13, color:_theme.text, marginBottom:12 }}>➕ Add New Ticket</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr auto", gap:10, alignItems:"flex-end" }}>
            <div>
              <label style={LBL}>Case ID</label>
              <input value={caseId} onChange={e=>setCaseId(e.target.value)}
                style={I()} placeholder="e.g. INC-12345"/>
            </div>
            <div>
              <label style={LBL}>TT#</label>
              <input value={ttNum} onChange={e=>setTtNum(e.target.value)}
                style={I()} placeholder="e.g. TT-789"/>
            </div>
            <div>
              <label style={LBL}>Country</label>
              <select value={country} onChange={e=>setCountry(e.target.value)} style={I()}>
                {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={LBL}>Date</label>
              <input type="date" value={ttDate} onChange={e=>setTtDate(e.target.value)} style={I()}/>
            </div>
            <div>
              <label style={LBL}>Status</label>
              <select value={status} onChange={e=>setStatus(e.target.value)} style={I()}>
                {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {saved && <div style={{ fontSize:12,fontWeight:600,marginTop:8,
            color:saved.startsWith("✅")?"#10B981":"#EF4444" }}>{saved}</div>}
          <button onClick={addTicket}
            style={{ ...PBT(_theme.primary,{marginTop:12,padding:"9px 24px"}) }}>
            ➕ Add Ticket
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{ ...SBR(), marginBottom:12 }}>
        <span style={{ fontSize:12, fontWeight:700, color:_theme.textMuted }}>🔍 Filter:</span>
        <select value={filterSt} onChange={e=>setFilterSt(e.target.value)} style={{ ...I({width:"auto"}) }}>
          <option value="All">All Status</option>
          {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterCo} onChange={e=>setFilterCo(e.target.value)} style={{ ...I({width:"auto"}) }}>
          <option value="All">All Countries</option>
          {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontSize:11, color:_theme.textMuted, marginLeft:"auto" }}>{filtered.length} tickets</span>
      </div>

      {/* Tickets Table */}
      <div style={{ ...CRD({padding:0}), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ background:_theme.isDark?"#0D1117":"#F8FAFC" }}>
              {["Case ID","TT#","Country","Date","Status","Age","Created By","Actions"].map(h=>(
                <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontWeight:700,
                  color:_theme.text, borderBottom:`2px solid ${_theme.cardBorder}`, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 && (
              <tr><td colSpan={8} style={{ textAlign:"center", padding:32, color:_theme.textMuted }}>
                <div style={{ fontSize:32, marginBottom:8 }}>📋</div>
                No tickets found
              </td></tr>
            )}
            {filtered.map((t, ri) => {
              const breach  = isSLABreach(t);
              const warning = isSLAWarning(t);
              const hours   = hoursOpen(t);
              return (
                <tr key={t.noteId} style={{
                  background: breach
                    ? "rgba(239,68,68,0.12)"
                    : warning
                      ? "rgba(245,158,11,0.08)"
                      : ri%2===0 ? _theme.card : _theme.surface,
                  animation: breach ? "pulse 1.5s infinite" : "none",
                  borderLeft: breach ? "4px solid #EF4444" : warning ? "4px solid #F59E0B" : "4px solid transparent"
                }}>
                  <td style={{ padding:"10px 12px", fontWeight:700, color:_theme.text }}>{t.caseId}</td>
                  <td style={{ padding:"10px 12px", color:_theme.primary, fontWeight:600 }}>{t.ttNum}</td>
                  <td style={{ padding:"10px 12px" }}>
                    <span style={{ background:_theme.primary+"18", color:_theme.primary,
                      borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
                      {t.country}
                    </span>
                  </td>
                  <td style={{ padding:"10px 12px", color:_theme.textSub }}>{t.date}</td>
                  <td style={{ padding:"10px 12px" }}>
                    <span style={{ background:statusColor(t.status)+"20", color:statusColor(t.status),
                      borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    {t.status !== "Closed" ? (
                      <span style={{ color: breach?"#EF4444":warning?"#F59E0B":_theme.textMuted,
                        fontWeight: breach||warning ? 700 : 400, fontSize:11 }}>
                        {hours}h {breach?"🚨":warning?"⚠️":""}
                      </span>
                    ) : <span style={{ color:"#10B981", fontSize:11 }}>Closed</span>}
                  </td>
                  <td style={{ padding:"10px 12px", color:_theme.textMuted, fontSize:11 }}>{t.createdBy}</td>
                  <td style={{ padding:"10px 12px" }}>
                    <div style={{ display:"flex", gap:4 }}>
                      {canEdit && STATUSES.filter(s=>s!==t.status).map(s=>(
                        <button key={s} onClick={()=>updateTicketStatus(t.noteId, s)}
                          style={{ background:statusColor(s)+"18", color:statusColor(s),
                            border:`1px solid ${statusColor(s)}40`,
                            borderRadius:6, padding:"3px 8px", fontSize:10,
                            cursor:"pointer", fontWeight:700, whiteSpace:"nowrap" }}>
                          {s}
                        </button>
                      ))}
                      {canEdit && (
                        <button onClick={()=>deleteTicket(t.noteId)}
                          style={{ background:"rgba(239,68,68,0.1)", color:"#EF4444",
                            border:"1px solid rgba(239,68,68,0.3)",
                            borderRadius:6, padding:"3px 8px", fontSize:10,
                            cursor:"pointer", fontWeight:700 }}>✕</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SHIFT HANDOVER PAGE ──────────────────────────────────────────────────────
// Formal shift handover between supervisors
// Stored in notes with tag: "Shift Handover"
function ShiftHandoverPage({ employees, schedule, shifts, attendance, performance, queueLog, notes, setNotes, session, canEdit }) {
  const [tab, setTab]           = useState("new");     // "new" | "history"
  const [selShift, setSelShift] = useState("");
  const [pending, setPending]   = useState("");        // pending cases (free text)
  const [nextNotes, setNextNotes] = useState("");      // notes for next shift
  const [incidents, setIncidents] = useState("");      // incidents / special issues
  const [saved, setSaved]       = useState("");
  const [expandId, setExpandId] = useState(null);

  const todayKey = todayStr();
  const dayName  = DAYS[new Date().getDay()];
  const canCreate = canEdit; // TL + SL + SME

  // ── Auto-build summary from live data ─────────────────────────────────────
  function buildSummary() {
    const shiftEmps = selShift
      ? employees.filter(e => (schedule[e.id]||{})[dayName] === selShift)
      : employees.filter(e => { const v=(schedule[e.id]||{})[dayName]; return v&&v!=="OFF"&&v!=="LEAVE"&&v!=="PH"; });

    const todayAtt  = attendance[todayKey] || {};
    const todayPerf = performance[todayKey] || {};

    // Attendance
    const present  = shiftEmps.filter(e => isPresent((todayAtt[e.id]||{}).status)).length;
    const absent   = shiftEmps.filter(e => isAbsent((todayAtt[e.id]||{}).status)).length;
    const late     = shiftEmps.filter(e => (todayAtt[e.id]||{}).lateMin >= 7).length;

    // Performance
    const closed   = shiftEmps.reduce((s,e) => s+((todayPerf[e.id]||{}).closed||0), 0);
    const escs     = shiftEmps.reduce((s,e) => s+((todayPerf[e.id]||{}).escalations||0), 0);
    const quality  = shiftEmps.filter(e=>(todayPerf[e.id]||{}).quality!=="").map(e=>Number((todayPerf[e.id]||{}).quality)||0);
    const avgQual  = quality.length ? Math.round(quality.reduce((a,b)=>a+b,0)/quality.length) : null;

    // Queue
    const QKEYS = ["tga","ob","oslo","some","kwtT2","qatT2","bahT2","uaeT2","someKwt","someQat","someBah","someUae"];
    const todayEntries = Object.entries(queueLog||{}).filter(([k])=>k.startsWith(todayKey)).map(([,v])=>v);
    const latestQ = todayEntries.length > 0
      ? todayEntries.reduce((b,e)=>(e.updTime||"")>(b.updTime||"")?e:b, todayEntries[0])
      : null;
    const totalQ  = latestQ ? QKEYS.reduce((s,k)=>s+Number(latestQ[k+"Curr"]||0),0) : null;
    const totalQBase = latestQ ? QKEYS.reduce((s,k)=>s+Number(latestQ[k+"Base"]||0),0) : null;

    // Top performer
    const topPerf = shiftEmps
      .map(e=>({name:e.name, closed:(todayPerf[e.id]||{}).closed||0}))
      .filter(e=>e.closed>0)
      .sort((a,b)=>b.closed-a.closed)[0];

    return { present, absent, late, closed, escs, avgQual, totalQ, totalQBase, topPerf, total: shiftEmps.length };
  }

  // ── All handover records ───────────────────────────────────────────────────
  const allHandovers = (Array.isArray(notes)?notes:[])
    .filter(n => n.tag === "Shift Handover")
    .sort((a,b) => b.ts.localeCompare(a.ts));

  function submitHandover() {
    if (!session?.name) return;
    if (!selShift) { setSaved("❌ Please select a shift"); return; }
    const sh = shifts.find(s=>s.id===selShift);
    const summary = buildSummary();
    const data = {
      shiftId: selShift,
      shiftLabel: sh?.label || selShift,
      supervisor: session.name,
      supervisorRole: session.role,
      pending: pending.trim(),
      nextNotes: nextNotes.trim(),
      incidents: incidents.trim(),
      summary,
      signedAt: new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"}),
    };

    const entry = {
      id:   "ho"+Date.now(),
      ts:   new Date().toISOString(),
      date: todayKey,
      time: pad(new Date().getHours())+":"+pad(new Date().getMinutes()),
      tag:  "Shift Handover",
      text: JSON.stringify(data),
      from: session.name,
      target: "supervisors",
      msgType: "handover",
    };

    setNotes(prev => [entry, ...(Array.isArray(prev)?prev:[])]);
    setSaved("✅ Handover submitted successfully!");
    setPending(""); setNextNotes(""); setIncidents("");
    setTimeout(() => { setSaved(""); setTab("history"); }, 2000);
  }

  // ── Render a single handover card ─────────────────────────────────────────
  function HandoverCard({ h }) {
    let d = {};
    try { d = JSON.parse(h.text||"{}"); } catch {}
    const s = d.summary || {};
    const isExpanded = expandId === h.id;
    const escRate = s.closed > 0 ? Math.round((s.escs/s.closed)*100) : 0;

    return (
      <div style={{ ...CRD({padding:0}), marginBottom:12, overflow:"hidden" }}>
        {/* Header */}
        <div
          onClick={() => setExpandId(isExpanded ? null : h.id)}
          style={{ padding:"14px 18px", cursor:"pointer", display:"flex", alignItems:"center", gap:12,
            background: isExpanded ? _theme.primary+"18" : _theme.card,
            borderBottom: isExpanded ? `1px solid ${_theme.cardBorder}` : "none" }}>
          <div style={{ fontSize:28 }}>🔄</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontWeight:800, fontSize:14, color:_theme.text }}>{d.shiftLabel}</span>
              <span style={{ fontSize:11, background:_theme.primary+"22", color:_theme.primary,
                borderRadius:20, padding:"2px 10px", fontWeight:700 }}>{d.supervisorRole}</span>
              {d.incidents && <span style={{ fontSize:11, background:"#FEF2F2", color:"#EF4444",
                borderRadius:20, padding:"2px 8px", fontWeight:700 }}>⚠️ Incident</span>}
            </div>
            <div style={{ fontSize:12, color:_theme.textMuted, marginTop:2 }}>
              By {d.supervisor} · {h.date} at {d.signedAt}
            </div>
          </div>
          {/* Mini KPIs */}
          <div style={{ display:"flex", gap:16, flexShrink:0 }}>
            {[
              {icon:"✅", val:s.closed||0, label:"Closed"},
              {icon:"👥", val:`${s.present||0}/${s.total||0}`, label:"Present"},
              {icon:"🔴", val:s.escs||0, label:"Esc"},
            ].map(({icon,val,label}) => (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:14, fontWeight:800, color:_theme.text }}>{val}</div>
                <div style={{ fontSize:9, color:_theme.textMuted, fontWeight:600 }}>{label}</div>
              </div>
            ))}
          </div>
          <span style={{ color:_theme.textMuted, fontSize:14 }}>{isExpanded?"▲":"▼"}</span>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div style={{ padding:"16px 18px" }}>
            {/* Stats Grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10, marginBottom:16 }}>
              {[
                {icon:"👥", label:"Scheduled",  val:s.total||0,         color:"#3B82F6"},
                {icon:"✅", label:"Present",     val:s.present||0,       color:"#10B981"},
                {icon:"❌", label:"Absent",      val:s.absent||0,        color:"#EF4444"},
                {icon:"⏰", label:"Late",         val:s.late||0,          color:"#F59E0B"},
                {icon:"📦", label:"Cases Closed",val:s.closed||0,        color:"#6366F1"},
                {icon:"🔴", label:"Escalations", val:s.escs||0,          color:"#EF4444"},
                {icon:"📊", label:"Esc Rate",    val:escRate+"%",        color:escRate>15?"#EF4444":"#10B981"},
                {icon:"⭐", label:"Avg Quality",  val:s.avgQual!=null?s.avgQual+"%":"—", color:"#F59E0B"},
                {icon:"📋", label:"Queue End",   val:s.totalQ!=null?s.totalQ:"—", color:"#8B5CF6"},
              ].map(({icon,label,val,color}) => (
                <div key={label} style={{ background:_theme.surface, borderRadius:10, padding:"10px 12px",
                  border:`1px solid ${_theme.cardBorder}`, textAlign:"center" }}>
                  <div style={{ fontSize:18 }}>{icon}</div>
                  <div style={{ fontSize:18, fontWeight:800, color }}>{val}</div>
                  <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:600 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Top Performer */}
            {s.topPerf && (
              <div style={{ background:"#FEF9C3", border:"1px solid #F59E0B", borderRadius:10,
                padding:"10px 14px", marginBottom:12, display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontSize:20 }}>🏆</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:"#92400E" }}>Top Performer</div>
                  <div style={{ fontSize:12, color:"#78350F" }}>{s.topPerf.name} — {s.topPerf.closed} cases</div>
                </div>
              </div>
            )}

            {/* Pending Cases */}
            {d.pending && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:700, fontSize:12, color:"#F59E0B", marginBottom:4 }}>⏳ Pending Cases</div>
                <div style={{ background:_theme.surface, borderRadius:8, padding:"10px 12px",
                  fontSize:13, color:_theme.text, whiteSpace:"pre-wrap", lineHeight:1.6 }}>{d.pending}</div>
              </div>
            )}

            {/* Notes for Next Shift */}
            {d.nextNotes && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:700, fontSize:12, color:_theme.primary, marginBottom:4 }}>📌 Notes for Next Shift</div>
                <div style={{ background:_theme.surface, borderRadius:8, padding:"10px 12px",
                  fontSize:13, color:_theme.text, whiteSpace:"pre-wrap", lineHeight:1.6 }}>{d.nextNotes}</div>
              </div>
            )}

            {/* Incidents */}
            {d.incidents && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:700, fontSize:12, color:"#EF4444", marginBottom:4 }}>⚠️ Incidents / Issues</div>
                <div style={{ background:"#FEF2F2", border:"1px solid #FCA5A5", borderRadius:8, padding:"10px 12px",
                  fontSize:13, color:"#991B1B", whiteSpace:"pre-wrap", lineHeight:1.6 }}>{d.incidents}</div>
              </div>
            )}

            {/* Digital Signature */}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
              background:_theme.surface, borderRadius:8, border:`1px solid ${_theme.cardBorder}` }}>
              <span style={{ fontSize:16 }}>✍️</span>
              <div style={{ fontSize:12 }}>
                <span style={{ color:_theme.textMuted }}>Signed by </span>
                <span style={{ fontWeight:800, color:_theme.text }}>{d.supervisor}</span>
                <span style={{ color:_theme.textMuted }}> ({d.supervisorRole}) at {d.signedAt}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const summary = buildSummary();
  const sh = shifts.find(s=>s.id===selShift);

  return (
    <div>
      {/* Header */}
      <div style={SBR()}>
        <span style={{ fontSize:20 }}>🔄</span>
        <span style={{ fontWeight:800, fontSize:15, color:_theme.text }}>Shift Handover</span>
        <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
          {["new","history"].map(t => (
            <button key={t} onClick={()=>setTab(t)}
              style={{ border:`2px solid ${tab===t?_theme.primary:"#CBD5E1"}`,
                borderRadius:20, padding:"5px 16px", fontSize:12, cursor:"pointer",
                fontWeight:700, background:tab===t?_theme.primary:"transparent",
                color:tab===t?"#fff":_theme.textSub }}>
              {t==="new"?"➕ New Handover":`📋 History (${allHandovers.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── NEW HANDOVER FORM ── */}
      {tab === "new" && (
        <div>
          {!canCreate ? (
            <div style={{ ...CRD(), textAlign:"center", padding:32 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
              <div style={{ fontWeight:700, color:_theme.text }}>Supervisors Only</div>
              <div style={{ fontSize:13, color:_theme.textMuted, marginTop:6 }}>Only Team Leads, Shift Leaders and SMEs can create handovers.</div>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {/* Left: Form */}
              <div>
                <div style={CRD()}>
                  <div style={{ fontWeight:800, fontSize:14, color:_theme.text, marginBottom:14 }}>📝 Handover Form</div>

                  {/* Shift selector */}
                  <label style={LBL}>Shift Being Handed Over</label>
                  <select value={selShift} onChange={e=>setSelShift(e.target.value)} style={{ ...I(), marginBottom:14 }}>
                    <option value="">— Select shift —</option>
                    {shifts.map(s=>(
                      <option key={s.id} value={s.id}>{s.label} ({s.start}–{s.end})</option>
                    ))}
                  </select>

                  {/* Pending cases */}
                  <label style={LBL}>⏳ Pending Cases (cases needing follow-up)</label>
                  <textarea value={pending} onChange={e=>setPending(e.target.value)} rows={3}
                    style={{ ...I({resize:"vertical", width:"100%", marginBottom:14}) }}
                    placeholder="List any open or pending cases that the next shift needs to follow up on..."/>

                  {/* Notes for next shift */}
                  <label style={LBL}>📌 Notes for Next Shift</label>
                  <textarea value={nextNotes} onChange={e=>setNextNotes(e.target.value)} rows={3}
                    style={{ ...I({resize:"vertical", width:"100%", marginBottom:14}) }}
                    placeholder="Important notes, instructions, or alerts for the incoming shift..."/>

                  {/* Incidents */}
                  <label style={LBL}>⚠️ Incidents / Special Issues (optional)</label>
                  <textarea value={incidents} onChange={e=>setIncidents(e.target.value)} rows={3}
                    style={{ ...I({resize:"vertical", width:"100%", marginBottom:14}) }}
                    placeholder="Any incidents, system issues, or unusual events that occurred..."/>

                  {/* Supervisor signature */}
                  <div style={{ background:_theme.surface, borderRadius:8, padding:"10px 14px",
                    border:`1px solid ${_theme.cardBorder}`, marginBottom:14,
                    display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:20 }}>✍️</span>
                    <div>
                      <div style={{ fontSize:12, color:_theme.textMuted }}>Digital Signature</div>
                      <div style={{ fontWeight:800, fontSize:14, color:_theme.text }}>
                        {session?.name} <span style={{ fontSize:11, color:_theme.textMuted, fontWeight:400 }}>({session?.role})</span>
                      </div>
                    </div>
                  </div>

                  {saved && (
                    <div style={{ fontSize:13, fontWeight:700, padding:"8px 12px", borderRadius:8, marginBottom:10,
                      background:saved.startsWith("✅")?"#F0FDF4":"#FEF2F2",
                      color:saved.startsWith("✅")?"#166534":"#991B1B" }}>{saved}</div>
                  )}

                  <button onClick={submitHandover}
                    style={{ ...PBT(_theme.primary,{width:"100%",padding:"12px",fontSize:14}) }}>
                    🔄 Submit Handover
                  </button>
                </div>
              </div>

              {/* Right: Live Auto Summary */}
              <div>
                <div style={CRD()}>
                  <div style={{ fontWeight:800, fontSize:14, color:_theme.text, marginBottom:14 }}>
                    📊 Auto Summary {selShift && sh ? `— ${sh.label}` : "— All Shifts"}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                    {[
                      {icon:"👥", label:"Scheduled",   val:summary.total,      color:"#3B82F6"},
                      {icon:"✅", label:"Present",      val:summary.present,    color:"#10B981"},
                      {icon:"❌", label:"Absent",       val:summary.absent,     color:"#EF4444"},
                      {icon:"⏰", label:"Late",          val:summary.late,       color:"#F59E0B"},
                      {icon:"📦", label:"Closed",       val:summary.closed,     color:"#6366F1"},
                      {icon:"🔴", label:"Escalations",  val:summary.escs,       color:"#EF4444"},
                      {icon:"⭐", label:"Avg Quality",   val:summary.avgQual!=null?summary.avgQual+"%":"—", color:"#F59E0B"},
                      {icon:"📋", label:"Queue Now",    val:summary.totalQ!=null?summary.totalQ:"—", color:"#8B5CF6"},
                    ].map(({icon,label,val,color})=>(
                      <div key={label} style={{ background:_theme.surface, borderRadius:10, padding:"12px",
                        border:`1px solid ${_theme.cardBorder}`, textAlign:"center" }}>
                        <div style={{ fontSize:22 }}>{icon}</div>
                        <div style={{ fontSize:22, fontWeight:800, color, lineHeight:1.2 }}>{val}</div>
                        <div style={{ fontSize:10, color:_theme.textMuted, fontWeight:600, marginTop:2 }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {summary.topPerf && (
                    <div style={{ background:"linear-gradient(135deg,#FEF9C3,#FEF3C7)",
                      border:"1px solid #F59E0B", borderRadius:10, padding:"12px 14px",
                      display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:24 }}>🏆</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:12, color:"#92400E" }}>Top Performer Today</div>
                        <div style={{ fontWeight:800, fontSize:14, color:"#78350F" }}>{summary.topPerf.name}</div>
                        <div style={{ fontSize:12, color:"#92400E" }}>{summary.topPerf.closed} cases closed</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Latest handover from history */}
                {allHandovers.length > 0 && (
                  <div style={{ ...CRD(), marginTop:14 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:_theme.text, marginBottom:10 }}>
                      📋 Latest Handover
                    </div>
                    <HandoverCard h={allHandovers[0]}/>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === "history" && (
        <div>
          {allHandovers.length === 0 ? (
            <div style={{ ...CRD(), textAlign:"center", padding:40 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔄</div>
              <div style={{ fontWeight:700, fontSize:16, color:_theme.text }}>No handovers yet</div>
              <div style={{ fontSize:13, color:_theme.textMuted, marginTop:6 }}>
                Handovers submitted by supervisors will appear here.
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize:12, color:_theme.textMuted, marginBottom:12 }}>
                {allHandovers.length} handover{allHandovers.length!==1?"s":""} recorded
              </div>
              {allHandovers.map(h => <HandoverCard key={h.id} h={h}/>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(() => {
    try { return localStorage.getItem("csops_lastPage") || "Home"; } catch { return "Home"; }
  });
  const [showResetPw, setShowResetPw] = useState(false);
  const [showSearch, setShowSearch]   = useState(false);
  const [myShiftOnly, setMyShiftOnly] = useState(false);
  const [showDM, setShowDM]           = useState(false);
  const [showSelfCheckIn, setShowSelfCheckIn] = useState(false);
  const [systemFrozen, setSystemFrozen]       = useState(() => {
    try { return localStorage.getItem("csops_frozen") === "1"; } catch { return false; }
  });
  const [presentationMode, setPresentationMode] = useState(false);
  const [showDarkNotes, setShowDarkNotes]       = useState(false);
  const [darkNoteEmp, setDarkNoteEmp]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [lastSync, setLastSync]       = useState(null); // timestamp of last successful poll

  // ── Theme + Lang + Zoom ───────────────────────────────────────────────────
  const [themeKey, setThemeKey] = useState(() => {
    try { return localStorage.getItem("csops_theme") || "cyber"; } catch { return "cyber"; }
  });
  const [lang, setLang] = useState(() => {
    return "en";
  });
  const [zoom, setZoom] = useState(() => {
    try { return Number(localStorage.getItem("csops_zoom")) || 100; } catch { return 100; }
  });
  const [showTip, setShowTip] = useState(false);
  const [tipShownThisSession, setTipShownThisSession] = useState(false);

  const theme = THEMES[themeKey] || THEMES.dark;
  setGlobalTheme(theme);
  setGlobalLang(lang);
  const isRTL = false;
  const tr = (key) => T.en[key] || key;

  // ── Session ────────────────────────────────────────────────────────────────
  const [session, _setSession] = useState(() => {
    try {
      const r = localStorage.getItem("csops_session");
      if (!r || r === "null") return null;
      const parsed = JSON.parse(r);
      // Validate session has required fields
      if (!parsed?.name || !parsed?.role) return null;
      return parsed;
    } catch { return null; }
  });
  function setSession(val) {
    _setSession(val);
    try {
      if (val) {
        localStorage.setItem("csops_session", JSON.stringify(val));
      } else {
        localStorage.removeItem("csops_session");
      }
    } catch {}
  }

  // Show daily tip once per session (handles both fresh login AND persistent session)
  // Also log "Session Active" so user appears in Owner Analytics Active Now
  useEffect(() => {
    if (!loading && session && !tipShownThisSession) {
      setTipShownThisSession(true);
      // Log session activity so Owner sees this user as Active Now
      const entry = {
        id: "al"+Date.now()+Math.random(),
        ts: new Date().toISOString(),
        by: session.name, role: session.role,
        action: "Sign In", target: session.name,
        detail: `${session.role} session active`,
      };
      setAuditLog(prev => [entry, ...(Array.isArray(prev)?prev:[])].slice(0, 2000));
      // Small delay so the app renders first, then show tip
      const t = setTimeout(() => setShowTip(true), 600);
      return () => clearTimeout(t);
    }
  }, [loading, session]);

  function changeTheme(key) {
    setThemeKey(key);
    try { localStorage.setItem("csops_theme", key); } catch {}
  }

  // ── Auto dark mode: switch to dark after 18:00, light after 06:00 ──────────
  useEffect(() => {
    function checkAutoTheme() {
      const h = new Date().getHours();
      // Only auto-switch if user hasn't manually set a theme today
      const lastManual = localStorage.getItem("csops_theme_manual_date");
      if (lastManual === todayStr()) return; // user chose manually today
      if (h >= 18 || h < 6) {
        if (themeKey === "light") setThemeKey("dark");
      } else {
        if (themeKey === "dark" && !localStorage.getItem("csops_theme_manual_date")) {
          // Don't auto-switch to light if user is on dark
        }
      }
    }
    checkAutoTheme();
    const t = setInterval(checkAutoTheme, 5*60*1000);
    return () => clearInterval(t);
  }, []);
  function changeLang(l) { /* English only */ }
  function changeZoom(z) {
    const clamped = Math.min(200, Math.max(50, z));
    setZoom(clamped);
    try { localStorage.setItem("csops_zoom", clamped); } catch {}
  }

  // ── Supabase-backed state ─────────────────────────────────────────────────
  const [employees,   setEmployeesRaw]   = useState([]);
  const [shifts,      setShiftsRaw]      = useState([]);
  const [scheduleMap, setScheduleRaw]    = useState({});
  const [attendance,  setAttendanceRaw]  = useState({});
  const [performance, setPerformanceRaw] = useState({});
  const [heatmap,     setHeatmapRaw]     = useState({});
  const [queueLog,    setQueueLogRaw]    = useState({});
  const [breakSchedule, setBreakScheduleRaw] = useState({});
  const [auditLog,    setAuditLogRaw]    = useState([]);
  const [notes,       setNotesRaw]       = useState([]);

  // ── Load ALL data from Supabase on mount ──────────────────────────────────
  // ── Load Supabase SDK immediately on mount (fastest realtime connect) ────────
  useEffect(() => {
    getDB().catch(() => {}); // pre-load SDK
  }, []);

  // Safety timeout: if Supabase takes too long, unblock UI
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 8000); // 8 second max wait
    return () => clearTimeout(timeout);
  }, []);

  // ── Supabase Realtime subscriptions ─────────────────────────────────────────
  // Uses useRef to store channels so cleanup works correctly from useEffect return
  const rtChannelsRef = useRef([]);

  useEffect(() => {
    if (loading) return;
    let cancelled = false;

    // Row mappers
    const mapAudit = r => ({ id:r.id, ts:r.ts, by:r.by_name, role:r.by_role,
      action:r.action, target:r.target||"", detail:r.detail||"" });
    const mapNote  = r => ({ id:r.id, ts:r.ts, date:r.date, time:r.time, tag:r.tag, text:r.text,
      from:r.from||"", target:r.target||"", msgType:r.msg_type||r.msgType||"" });
    const mapAtt   = r => ({ status:r.status, checkIn:r.check_in||"", checkOut:r.check_out||"",
      lateMin:r.late_min||0, earlyMin:r.early_min||0, workDuration:r.work_duration||"", note:r.note||"" });
    const mapPerf  = r => ({ closed:r.closed||0, escalations:r.escalations||0, quality:r.quality||"" });
    const mapEmp   = r => ({ id:r.id, name:r.name, role:r.role, tasks:r.tasks||[],
      gender:r.gender||"M", isAdmin:r.is_admin||false, hiddenPages:r.hidden_pages||[] });
    const mapShift = r => ({ id:r.id, label:r.label, start:r.start_time, end:r.end_time, color:r.color });

    // Helper: safely update localStorage
    const lsSet = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

    getDB().then(client => {
      if (!client || cancelled) return;

      // Dedup helper: skip if we own this change (same session, <2s ago)
      // Prevents echo: save → DB → realtime → setState (redundant)
      const myId = () => (typeof session !== "undefined" && session?.name) || "";
      const recentlySaved = new Set();
      const markSaved  = id => { recentlySaved.add(id); setTimeout(() => recentlySaved.delete(id), 2000); };
      const isMine     = id => recentlySaved.has(id);

      const channels = [

        // ── audit_log ── INSERT only (we only ever insert, never update)
        client.channel("rt-audit_log")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "audit_log" }, payload => {
            const entry = mapAudit(payload.new);
            setAuditLogRaw(prev => {
              const next = [entry, ...(Array.isArray(prev)?prev:[])].slice(0,500);
              lsSet("csops_auditLog", next);
              return next;
            });
          }).subscribe(status => {
            if (status === "SUBSCRIBED") {
              console.log("✓ Supabase Realtime connected");
            } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
              console.warn("⚠ Supabase Realtime issue:", status, "- polling fallback active");
            }
          }),

        // ── notes ── all events
        client.channel("rt-notes")
          .on("postgres_changes", { event: "*", schema: "public", table: "notes" }, payload => {
            setNotesRaw(prev => {
              const arr = Array.isArray(prev) ? prev : [];
              let next;
              if (payload.eventType === "DELETE") {
                next = arr.filter(n => n.id !== payload.old?.id);
              } else {
                const note = mapNote(payload.new);
                const idx  = arr.findIndex(n => n.id === note.id);
                next = idx >= 0 ? arr.map((n,i) => i===idx ? note : n) : [note, ...arr];
                // Soft ding for new manager messages arriving via Realtime
                if (payload.eventType === "INSERT" && payload.new?.tag === "Manager Message") {
                  playSoftDing();
                  const tgt = payload.new?.target;
                  const myN = session?.name || "";
                  if (tgt === "all" || !tgt || tgt === myN) {
                    showToast("📢 New message from supervisor", "info", 5000);
                  }
                }
                // Ding when a Direct Message arrives for me
                if (payload.eventType === "INSERT" && payload.new?.tag === "Direct Message") {
                  // We know our session name from the outer closure
                  if (payload.new?.target === (session?.name || "")) {
                    playAlertSound("warning");
                    showToast("💬 New direct message received","info",4000);
                  }
                }
                // Toast when break request status updated
                if (payload.eventType === "UPDATE" && payload.new?.tag === "Short Break Request") {
                  try {
                    const d = JSON.parse(payload.new?.text||"{}");
                    if (d.status === "approved") showToast("✅ Your break request was approved! Enjoy ☕","success",5000);
                    if (d.status === "rejected") showToast("❌ Break request declined — check reason in Break page","error",6000);
                  } catch {}
                }
              }
              lsSet("csops_notes", next);
              return next;
            });
          }).subscribe(),

        // ── queue_log ──
        client.channel("rt-queue_log")
          .on("postgres_changes", { event: "*", schema: "public", table: "queue_log" }, payload => {
            if (payload.eventType !== "DELETE" && payload.new?.id) {
              const { id, data } = payload.new;
              setQueueLogRaw(prev => {
                const next = { ...(prev||{}), [id]: data||{} };
                lsSet("csops_queueLog", next);
                return next;
              });
            }
          }).subscribe(),

        // ── attendance ──
        client.channel("rt-attendance")
          .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, payload => {
            if (payload.eventType !== "DELETE" && payload.new?.date) {
              const r = payload.new;
              setAttendanceRaw(prev => {
                const next = { ...(prev||{}) };
                next[r.date] = { ...(next[r.date]||{}), [r.emp_id]: mapAtt(r) };
                lsSet("csops_attendance", next);
                return next;
              });
            }
          }).subscribe(),

        // ── performance ──
        client.channel("rt-performance")
          .on("postgres_changes", { event: "*", schema: "public", table: "performance" }, payload => {
            if (payload.eventType !== "DELETE" && payload.new?.date) {
              const r = payload.new;
              setPerformanceRaw(prev => {
                const next = { ...(prev||{}) };
                next[r.date] = { ...(next[r.date]||{}), [r.emp_id]: mapPerf(r) };
                lsSet("csops_performance", next);
                return next;
              });
            }
          }).subscribe(),

        // ── employees ──
        client.channel("rt-employees")
          .on("postgres_changes", { event: "*", schema: "public", table: "employees" }, payload => {
            setEmployeesRaw(prev => {
              const arr = Array.isArray(prev) ? prev : [];
              if (payload.eventType === "DELETE") return arr.filter(e => e.id !== payload.old?.id);
              if (!payload.new?.id) return arr;
              const emp = mapEmp(payload.new);
              const idx = arr.findIndex(e => e.id === emp.id);
              return idx >= 0 ? arr.map((e,i) => i===idx ? emp : e) : [...arr, emp];
            });
          }).subscribe(),

        // ── heatmap ──
        client.channel("rt-heatmap")
          .on("postgres_changes", { event: "*", schema: "public", table: "heatmap" }, payload => {
            if (payload.new?.date) {
              setHeatmapRaw(prev => {
                const next = { ...(prev||{}), [payload.new.date]: payload.new.hours||{} };
                lsSet("csops_heatmap", next);
                return next;
              });
            }
          }).subscribe(),

        // ── schedule ──
        client.channel("rt-schedule")
          .on("postgres_changes", { event: "*", schema: "public", table: "schedule" }, payload => {
            if (payload.new?.emp_id) {
              setScheduleRaw(prev => {
                const next = { ...(prev||{}), [payload.new.emp_id]: payload.new.days||{} };
                lsSet("csops_schedule", next);
                return next;
              });
            }
          }).subscribe(),

        // ── shifts ──
        client.channel("rt-shifts")
          .on("postgres_changes", { event: "*", schema: "public", table: "shifts" }, payload => {
            setShiftsRaw(prev => {
              const arr = Array.isArray(prev) ? prev : [];
              if (payload.eventType === "DELETE") return arr.filter(s => s.id !== payload.old?.id);
              if (!payload.new?.id) return arr;
              const sh  = mapShift(payload.new);
              const idx = arr.findIndex(s => s.id === sh.id);
              return idx >= 0 ? arr.map((s,i) => i===idx ? sh : s) : [...arr, sh];
            });
          }).subscribe(),

        // ── user_passwords ── refresh local cache only
        client.channel("rt-user_passwords")
          .on("postgres_changes", { event: "*", schema: "public", table: "user_passwords" }, payload => {
            if (payload.new?.name) {
              const store = JSON.parse(localStorage.getItem("csops_passwords")||"{}");
              if (payload.eventType === "DELETE") delete store[payload.old?.name];
              else store[payload.new.name] = payload.new.password;
              localStorage.setItem("csops_passwords", JSON.stringify(store));
            }
          }).subscribe(),

        // ── break_schedule ── (stored in Supabase too now)
        client.channel("rt-break_schedule")
          .on("postgres_changes", { event: "*", schema: "public", table: "break_schedule" }, payload => {
            if (payload.new?.key) {
              setBreakScheduleRaw(prev => {
                const next = { ...(prev||{}), [payload.new.key]: payload.new.data||{} };
                lsSet("csops_breakSchedule", next);
                return next;
              });
            }
          }).subscribe(),
      ];

      rtChannelsRef.current = channels;
    });

    // ── Cleanup: runs when component unmounts OR loading changes ──
    return () => {
      cancelled = true;
      getDB().then(client => {
        if (!client) return;
        rtChannelsRef.current.forEach(ch => { try { client.removeChannel(ch); } catch {} });
        rtChannelsRef.current = [];
      });
    };
  }, [loading]);

  // ── Polling fallback: re-fetch key tables every 30s if Realtime misses updates ──
  useEffect(() => {
    if (loading) return;
    let cancelled = false;

    async function pollUpdates() {
      if (cancelled) return;
      try {
        const today = new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Riyadh"});
        const ago90 = new Date(Date.now()-90*864e5).toISOString().slice(0,10);

        // Poll attendance (today only - most critical)
        const attT = await sb.from("attendance");
        const attRows = await attT.select("*", `date=gte.${today}`);
        if (attRows?.length && !cancelled) {
          setAttendanceRaw(prev => {
            const next = { ...(prev||{}) };
            attRows.forEach(r => {
              if (!next[r.date]) next[r.date] = {};
              next[r.date][r.emp_id] = {status:r.status,checkIn:r.check_in||"",checkOut:r.check_out||"",lateMin:r.late_min||0,earlyMin:r.early_min||0,workDuration:r.work_duration||"",note:r.note||""};
            });
            return next;
          });
        }

        // Poll performance (today only)
        const pfT = await sb.from("performance");
        const pfRows = await pfT.select("*", `date=gte.${today}`);
        if (pfRows?.length && !cancelled) {
          setPerformanceRaw(prev => {
            const next = { ...(prev||{}) };
            pfRows.forEach(r => {
              if (!next[r.date]) next[r.date] = {};
              next[r.date][r.emp_id] = {closed:r.closed||0,escalations:r.escalations||0,quality:r.quality||""};
            });
            return next;
          });
        }

        // Poll schedule
        const scT = await sb.from("schedule");
        const scRows = await scT.select();
        if (scRows?.length && !cancelled) {
          setScheduleRaw(prev => {
            const next = { ...(prev||{}) };
            scRows.forEach(r => { next[r.emp_id] = r.days||{}; });
            return next;
          });
        }

        // Poll break_schedule
        const bsT = await sb.from("break_schedule");
        const bsRows = await bsT.select();
        if (bsRows?.length && !cancelled) {
          setBreakScheduleRaw(prev => {
            const next = { ...(prev||{}) };
            bsRows.forEach(r => { next[r.key] = r.data||{}; });
            return next;
          });
        }

        // Poll notes (last 200)
        const ntT = await sb.from("notes");
        const ntRows = await ntT.select("*", "order=ts.desc&limit=200");
        if (ntRows?.length && !cancelled) {
          setNotesRaw(ntRows.map(r => ({
            id:r.id, ts:r.ts, date:r.date, time:r.time,
            tag:r.tag, text:r.text,
            from:r.from||"", target:r.target||"", msgType:r.msg_type||r.msgType||""
          })));
        }

        // Poll employees
        const empT = await sb.from("employees");
        const empRows = await empT.select();
        if (empRows?.length && !cancelled) {
          setEmployeesRaw(empRows.map(r => ({
            id:r.id, name:r.name, role:r.role, tasks:r.tasks||[],
            gender:r.gender||"M", isAdmin:r.is_admin||false, hiddenPages:r.hidden_pages||[]
          })));
        }

        setLastSync(Date.now());
      } catch (e) {
        // Polling failed silently - Supabase may be offline
      }
    }

    const interval = setInterval(pollUpdates, 30000); // every 30 seconds
    return () => { cancelled = true; clearInterval(interval); };
  }, [loading]);

  useEffect(() => {
    (async () => {
      try {
        // Load employees
        const empT = await sb.from("employees");
        const empRows = await empT.select();
        if (empRows?.length) {
          const emps = empRows.map(r => ({ id:r.id, name:r.name, role:r.role, tasks:r.tasks||[], gender:r.gender||"M", isAdmin:r.is_admin||false, hiddenPages:r.hidden_pages||[] }));
          setEmployeesRaw(emps);
          localStorage.setItem("csops_employees", JSON.stringify(emps));
        } else {
          const empT2 = await sb.from("employees");
          await empT2.upsert(DEFAULT_EMPLOYEES.map(e=>({id:e.id,name:e.name,role:e.role,tasks:e.tasks,gender:e.gender||"M"})));
          setEmployeesRaw(DEFAULT_EMPLOYEES);
        }

        // Load shifts
        const shT = await sb.from("shifts");
        const shRows = await shT.select();
        if (shRows?.length) {
          const shs = shRows.map(r=>({id:r.id,label:r.label,start:r.start_time,end:r.end_time,color:r.color}));
          setShiftsRaw(shs);
        } else {
          const shT2 = await sb.from("shifts");
          await shT2.upsert(DEFAULT_SHIFTS.map(s=>({id:s.id,label:s.label,start_time:s.start,end_time:s.end,color:s.color})));
          setShiftsRaw(DEFAULT_SHIFTS);
        }

        // Load schedule
        const scT = await sb.from("schedule");
        const scRows = await scT.select();
        if (scRows?.length) {
          const sc = {};
          scRows.forEach(r=>{ sc[r.emp_id]=r.days||{}; });
          setScheduleRaw(sc);
        } else {
          const def = buildDefaultSchedule(DEFAULT_EMPLOYEES);
          const scT2 = await sb.from("schedule");
          await scT2.upsert(Object.entries(def).map(([emp_id,days])=>({emp_id,days})));
          setScheduleRaw(def);
        }

        // Load attendance (last 90 days)
        const attT = await sb.from("attendance");
        const attRows = await attT.select("*", `date=gte.${new Date(Date.now()-90*864e5).toISOString().slice(0,10)}`);
        if (attRows?.length) {
          const att = {};
          attRows.forEach(r => {
            if (!att[r.date]) att[r.date]={};
            att[r.date][r.emp_id]={status:r.status,checkIn:r.check_in||"",checkOut:r.check_out||"",lateMin:r.late_min||0,earlyMin:r.early_min||0,workDuration:r.work_duration||"",note:r.note||""};
          });
          setAttendanceRaw(att);
        }

        // Load performance (last 90 days)
        const pfT = await sb.from("performance");
        const pfRows = await pfT.select("*", `date=gte.${new Date(Date.now()-90*864e5).toISOString().slice(0,10)}`);
        if (pfRows?.length) {
          const pf = {};
          pfRows.forEach(r => {
            if (!pf[r.date]) pf[r.date]={};
            pf[r.date][r.emp_id]={closed:r.closed||0,escalations:r.escalations||0,quality:r.quality||""};
          });
          setPerformanceRaw(pf);
        }

        // Load heatmap (last 90 days)
        const hmT = await sb.from("heatmap");
        const hmRows = await hmT.select();
        if (hmRows?.length) {
          const hm = {};
          hmRows.forEach(r=>{ hm[r.date]=r.hours||{}; });
          setHeatmapRaw(hm);
        }

        // Load queue_log (last 90 days)
        const qlT = await sb.from("queue_log");
        const qlRows = await qlT.select();
        if (qlRows?.length) {
          const ql = {};
          qlRows.forEach(r=>{ ql[r.id]=r.data||{}; });
          setQueueLogRaw(ql);
        }

        // Load audit_log (last 500)
        const alT = await sb.from("audit_log");
        const alRows = await alT.select("*", "order=ts.desc&limit=500");
        if (alRows?.length) {
          const al = alRows.map(r=>({id:r.id,ts:r.ts,by:r.by_name,role:r.by_role,action:r.action,target:r.target||"",detail:r.detail||""}));
          setAuditLogRaw(al);
        }

        // Load notes (including Manager Message fields)
        const ntT = await sb.from("notes");
        const ntRows = await ntT.select("*", "order=ts.desc");
        if (ntRows?.length) {
          setNotesRaw(ntRows.map(r=>({
            id:r.id, ts:r.ts, date:r.date, time:r.time,
            tag:r.tag, text:r.text,
            from:r.from||"", target:r.target||"", msgType:r.msg_type||r.msgType||""
          })));
        }

        // Load break_schedule
        const bsT = await sb.from("break_schedule");
        const bsRows = await bsT.select();
        if (bsRows?.length) {
          const bs = {};
          bsRows.forEach(r => { bs[r.key] = r.data||{}; });
          setBreakScheduleRaw(bs);
          try { localStorage.setItem("csops_breakSchedule", JSON.stringify(bs)); } catch {}
        }

      } catch(e) {
        console.warn("Supabase load failed, using localStorage:", e);
        // Fallback to localStorage
        try {
          const emp = localStorage.getItem("csops_employees"); if(emp) setEmployeesRaw(JSON.parse(emp));
          else setEmployeesRaw(DEFAULT_EMPLOYEES);
          const sh = localStorage.getItem("csops_shifts"); if(sh) setShiftsRaw(JSON.parse(sh));
          else setShiftsRaw(DEFAULT_SHIFTS);
          const sc = localStorage.getItem("csops_schedule"); if(sc) setScheduleRaw(JSON.parse(sc));
          else setScheduleRaw(buildDefaultSchedule(DEFAULT_EMPLOYEES));
          const at = localStorage.getItem("csops_attendance"); if(at) setAttendanceRaw(JSON.parse(at));
          const pf = localStorage.getItem("csops_performance"); if(pf) setPerformanceRaw(JSON.parse(pf));
          const hm = localStorage.getItem("csops_heatmap"); if(hm) setHeatmapRaw(JSON.parse(hm));
          const ql = localStorage.getItem("csops_queueLog"); if(ql) setQueueLogRaw(JSON.parse(ql));
          const bs = localStorage.getItem("csops_breakSchedule"); if(bs) setBreakScheduleRaw(JSON.parse(bs));
          const al = localStorage.getItem("csops_auditLog"); if(al) setAuditLogRaw(JSON.parse(al));
          const nt = localStorage.getItem("csops_notes"); if(nt) setNotesRaw(JSON.parse(nt));
        } catch {}
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Supabase savers ───────────────────────────────────────────────────────
  async function saveEmployees(emps) {
    try {
      const t = await sb.from("employees");
      await t.upsert(emps.map(e=>({id:e.id,name:e.name,role:e.role,tasks:e.tasks||[],gender:e.gender||"M",is_admin:e.isAdmin||false,hidden_pages:e.hiddenPages||[]})));
    } catch {}
    localStorage.setItem("csops_employees", JSON.stringify(emps));
  }
  async function saveShifts(shs) {
    try {
      const t = await sb.from("shifts");
      await t.upsert(shs.map(s=>({id:s.id,label:s.label,start_time:s.start,end_time:s.end,color:s.color})));
    } catch {}
    localStorage.setItem("csops_shifts", JSON.stringify(shs));
  }
  async function saveSchedule(sc) {
    try {
      const t = await sb.from("schedule");
      await t.upsert(Object.entries(sc).map(([emp_id,days])=>({emp_id,days,updated_at:new Date().toISOString()})));
    } catch {}
    localStorage.setItem("csops_schedule", JSON.stringify(sc));
  }

  async function saveSchedulePartial(sc, changedEmpIds) {
    // Only upsert the changed employees - much faster than full upsert
    try {
      const rows = changedEmpIds
        .filter(id => sc[id])
        .map(emp_id => ({ emp_id, days: sc[emp_id], updated_at: new Date().toISOString() }));
      if (rows.length) {
        const t = await sb.from("schedule");
        await t.upsert(rows);
      }
    } catch {}
    localStorage.setItem("csops_schedule", JSON.stringify(sc));
  }
  async function saveAttendance(att) {
    try {
      // Only upsert today's attendance for speed
      const today = new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Riyadh"});
      const todayEmps = att[today] || {};
      const rows = Object.entries(todayEmps).map(([emp_id, a]) => ({
        id:`${today}_${emp_id}`,date:today,emp_id,
        status:a.status,check_in:a.checkIn||null,check_out:a.checkOut||null,
        late_min:a.lateMin||0,early_min:a.earlyMin||0,
        work_duration:a.workDuration||null,note:a.note||null,
        updated_at:new Date().toISOString()
      }));
      if (rows.length) { const t = await sb.from("attendance"); await t.upsert(rows); }
    } catch {}
    localStorage.setItem("csops_attendance", JSON.stringify(att));
  }
  async function savePerformance(pf) {
    try {
      // Only upsert today's data to avoid sending 90 days of rows on every keystroke
      const today = new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Riyadh"});
      const todayEmps = pf[today] || {};
      const rows = Object.entries(todayEmps).map(([emp_id,p]) => ({
        id:`${today}_${emp_id}`,date:today,emp_id,
        closed:p.closed||0,escalations:p.escalations||0,
        quality:p.quality||null,updated_at:new Date().toISOString()
      }));
      if (rows.length) { const t = await sb.from("performance"); await t.upsert(rows); }
    } catch {}
    localStorage.setItem("csops_performance", JSON.stringify(pf));
  }
  async function saveHeatmap(hm) {
    try {
      const rows = Object.entries(hm).map(([date,hours])=>({date,hours,updated_at:new Date().toISOString()}));
      if (rows.length) { const t = await sb.from("heatmap"); await t.upsert(rows); }
    } catch {}
    localStorage.setItem("csops_heatmap", JSON.stringify(hm));
  }
  async function saveQueueLog(ql) {
    try {
      const rows = Object.entries(ql).map(([id,data])=>{
        const [date,shift_id] = id.split("_");
        return {id,date,shift_id:shift_id||"",data,updated_at:new Date().toISOString()};
      });
      if (rows.length) { const t = await sb.from("queue_log"); await t.upsert(rows); }
    } catch {}
    localStorage.setItem("csops_queueLog", JSON.stringify(ql));
  }
  async function saveAuditLog(al) {
    // Only push the latest 1 entry — realtime broadcasts it to all other clients
    // Full history is loaded on mount; we don't need to re-upsert all 500 entries
    try {
      const entry = Array.isArray(al) && al[0] ? al[0] : null;
      if (entry) {
        const t = await sb.from("audit_log");
        await t.upsert([{id:entry.id,ts:entry.ts,by_name:entry.by,by_role:entry.role,
          action:entry.action,target:entry.target||"",detail:entry.detail||""}]);
      }
    } catch {}
    localStorage.setItem("csops_auditLog", JSON.stringify(al));
  }
  async function saveNotes(nt) {
    // Upsert only the latest note; realtime pushes it to all subscribers
    try {
      const n = Array.isArray(nt) && nt[0] ? nt[0] : null;
      if (n) {
        const t = await sb.from("notes");
        await t.upsert([{id:n.id,ts:n.ts,date:n.date,time:n.time||"",
          tag:n.tag||"General",text:n.text,
          from:n.from||"",target:n.target||"",msg_type:n.msgType||""}]);
      }
    } catch {}
    localStorage.setItem("csops_notes", JSON.stringify(nt));
  }

  async function deleteNote(id) {
    // Delete from Supabase so all clients get the realtime DELETE event
    try {
      const t = await sb.from("notes");
      await t.delete(`id=eq.${id}`);
    } catch {}
  }

  // ── Wrapped setters that save to Supabase ─────────────────────────────────
  // ── System Freeze guard — blocks all writes when frozen (except owner) ──────
  function freezeGuard() {
    if (systemFrozen && !isSuperAdmin) {
      showToast("🚨 System is frozen — contact admin", "error", 3000);
      return true;
    }
    return false;
  }

  function setEmployees(val) {
    if (freezeGuard() && !isSuperAdmin) return;
    setEmployeesRaw(prev => {
      const n = typeof val === "function" ? val(prev) : val;
      saveEmployees(n);
      return n;
    });
  }
  function setShifts(val) {
    if (freezeGuard() && !isSuperAdmin) return;
    const n=typeof val==="function"?val(shifts):val; setShiftsRaw(n); saveShifts(n);
  }
  function setSchedule(val) {
    if (systemFrozen && !isOwnerUser(session)) { showToast && showToast("🧊 System is frozen", "error", 2000); return; }
    const n = typeof val === "function" ? val(scheduleMap) : val;
    setScheduleRaw(n);
    saveSchedule(n);
  }
  function setAttendance(val) { if(systemFrozen&&!isOwnerUser(session))return; const n=typeof val==="function"?val(attendance):val; setAttendanceRaw(n); saveAttendance(n); }
  function setPerformance(val){ if(systemFrozen&&!isOwnerUser(session))return; const n=typeof val==="function"?val(performance):val;setPerformanceRaw(n);savePerformance(n); }
  function setHeatmap(val)    { const n=typeof val==="function"?val(heatmap):val;    setHeatmapRaw(n);    saveHeatmap(n); }
  function setQueueLog(val)   { const n=typeof val==="function"?val(queueLog):val;   setQueueLogRaw(n);   saveQueueLog(n); }
  function setBreakSchedule(val) {
    const n=typeof val==="function"?val(breakSchedule):val;
    setBreakScheduleRaw(n);
    try { localStorage.setItem("csops_breakSchedule", JSON.stringify(n)); } catch {}
    // Save to Supabase: upsert each key (date_shiftId) separately
    (async () => {
      try {
        const rows = Object.entries(n).map(([key, data]) => ({ key, data, updated_at: new Date().toISOString() }));
        if (rows.length) {
          const t = await sb.from("break_schedule");
          await t.upsert(rows);
        }
      } catch {}
    })();
    // Audit trail
    const entry = {
      id: "al"+Date.now()+Math.random(),
      ts: new Date().toISOString(),
      by: session?.name || "Unknown",
      role: session?.role || "",
      action: "Break Schedule Updated",
      target: "",
      detail: "Break schedule modified",
    };
    setAuditLogRaw(prev => [entry, ...(Array.isArray(prev)?prev:[])].slice(0, 2000));
  }
  function setAuditLog(val)   { const n=typeof val==="function"?val(auditLog):val;   setAuditLogRaw(n);   saveAuditLog(n); }
  function setNotes(val) {
    const prev = notes;
    const n = typeof val === "function" ? val(notes) : val;
    setNotesRaw(n);
    saveNotes(n);
    // Detect deletions and remove from Supabase
    if (Array.isArray(prev) && Array.isArray(n) && n.length < prev.length) {
      const newIds = new Set(n.map(x => x.id));
      prev.forEach(x => { if (!newIds.has(x.id)) deleteNote(x.id); });
    }
  }

  // Use scheduleMap as schedule
  const schedule = scheduleMap;

  // Loading screen

  // Not logged in → show login

  const [criticalAlerts, setCriticalAlerts]   = useState([]);
  const [alertDismissed, setAlertDismissed]   = useState(false);
  const [dismissedQueueTotal, setDismissedQueueTotal] = useState(0); // track what was dismissed
  const [lastAlertCheck, setLastAlertCheck]   = useState(0);
  const [alertThresholdCritical, setAlertThresholdCritical] = useState(() => {
    try { return Number(localStorage.getItem("csops_alertCritical")) || 400; } catch { return 400; }
  });
  const [alertThresholdWarning, setAlertThresholdWarning] = useState(() => {
    try { return Number(localStorage.getItem("csops_alertWarning")) || 200; } catch { return 200; }
  });



  useEffect(() => {
    if (!session || session.role === "Agent") return; // agents never see alert

    function checkQueue(isDismissedRef, dismissedTotalRef) {
      const todayD = new Date().toISOString().slice(0,10);
      const QUEUE_KEYS = ["tga","ob","oslo","some","kwtT2","qatT2","bahT2","uaeT2","someKwt","someQat","someBah","someUae"];
      const todayEntries = Object.entries(queueLog||{})
        .filter(([k])=>k.startsWith(todayD)).map(([,v])=>v);
      if (!todayEntries.length) return;
      const latest = todayEntries.reduce((best,e)=>(e.updTime||"")>(best.updTime||"")?e:best, todayEntries[0]);
      const totalCurr = QUEUE_KEYS.reduce((s,k)=>s+Number(latest[k+"Curr"]||0),0);

      // Only show if NOT dismissed, or if queue has grown significantly (50+) since last dismiss
      const shouldShow = !isDismissedRef || (totalCurr > dismissedTotalRef + 50);
      if (!shouldShow) return;

      if (totalCurr > alertThresholdCritical) {
        setCriticalAlerts([{ icon:"🚨", title:`Queue Critical — ${totalCurr} cases`, detail:`Exceeded critical threshold (${alertThresholdCritical}+). Immediate action required.`, total:totalCurr }]);
        setAlertDismissed(false);
        playAlertSound("critical"); // 🔊 urgent triple beep
        sendPushNotification(
          `🚨 Queue Critical — ${totalCurr} cases`,
          `Exceeded critical threshold (${alertThresholdCritical}+). Requires immediate action.`,
          "queue-critical"
        );
      } else if (totalCurr > alertThresholdWarning) {
        setCriticalAlerts([{ icon:"⚠️", title:`Queue Warning — ${totalCurr} cases`, detail:`In warning zone (${alertThresholdWarning}+). Monitor closely.`, total:totalCurr }]);
        setAlertDismissed(false);
        playAlertSound("warning"); // 🔊 gentle double ping
        sendPushNotification(
          `⚠️ Queue Warning — ${totalCurr} cases`,
          `In warning zone (${alertThresholdWarning}+). Monitor closely.`,
          "queue-warning"
        );
      }
    }

    // Run once on mount after 3s — read current dismissed state
    const initial = setTimeout(() => {
      setAlertDismissed(cur => {
        setDismissedQueueTotal(tot => { checkQueue(cur, tot); return tot; });
        return cur;
      });
    }, 3000);

    const interval = setInterval(() => {
      // Read current dismissed state via functional setter trick
      setAlertDismissed(currentDismissed => {
        setDismissedQueueTotal(currentTotal => {
          checkQueue(currentDismissed, currentTotal);
          return currentTotal;
        });
        return currentDismissed;
      });
    }, 60000);

    return () => { clearInterval(interval); clearTimeout(initial); };
  }, [session, queueLog, alertThresholdCritical, alertThresholdWarning]);


  // ── Global search keyboard shortcut: Ctrl+K ──────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "k") { e.preventDefault(); setShowSearch(s => !s); }
        if (e.key === "h") { e.preventDefault(); navigateLogged("Home"); }
        if (e.key === "a" && !isAgent) { e.preventDefault(); navigateLogged("Attendance"); }
        if (e.key === "p") { e.preventDefault(); navigateLogged("Performance"); }
        if (e.key === "q") { e.preventDefault(); navigateLogged("Queue"); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Heartbeat: log activity every 10 min ──
  useEffect(() => {
    if (!session) return;
    const hb = setInterval(() => {
      // Use page directly since safeCurrentPage may not be in scope yet
      addAudit("Page View", page, `Active on ${page}`);
    }, 10 * 60 * 1000); // every 10 minutes
    return () => clearInterval(hb);
  }, [session, page]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Status Dock live clock ──
  useEffect(() => {
    const tick = setInterval(() => {
      const el = document.getElementById("status-dock-time");
      if (el) el.textContent = new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false,timeZone:"Asia/Riyadh"});
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight:"100vh",
        background:"linear-gradient(135deg,#020818 0%,#060F2A 50%,#020818 100%)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif", flexDirection:"column", gap:20,
        position:"relative", overflow:"hidden" }}>
        {/* Animated background grid */}
        <div style={{ position:"absolute", inset:0, opacity:0.06,
          backgroundImage:"linear-gradient(#00D4FF 1px,transparent 1px),linear-gradient(90deg,#00D4FF 1px,transparent 1px)",
          backgroundSize:"40px 40px" }}/>
        {/* Glow orbs */}
        <div style={{ position:"absolute", top:"20%", left:"20%", width:300, height:300,
          borderRadius:"50%", background:"radial-gradient(circle,#00D4FF15 0%,transparent 70%)",
          animation:"pulse 3s infinite" }}/>
        <div style={{ position:"absolute", bottom:"20%", right:"20%", width:200, height:200,
          borderRadius:"50%", background:"radial-gradient(circle,#7C3AED15 0%,transparent 70%)",
          animation:"pulse 2s infinite" }}/>
        {/* Logo */}
        <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:8,
            filter:"drop-shadow(0 0 20px #00D4FF60)" }}>🎯</div>
          <div style={{ color:"#E0F2FF", fontWeight:900, fontSize:24, letterSpacing:1,
            textShadow:"0 0 30px #00D4FF80" }}>
            CS <span style={{ color:"#00D4FF" }}>OPERATIONS</span>
          </div>
          <div style={{ color:"#60A5FA", fontSize:12, marginTop:4, letterSpacing:2,
            textTransform:"uppercase" }}>Management System v2.0</div>
        </div>
        {/* Progress */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, zIndex:1 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#00D4FF",
                boxShadow:"0 0 8px #00D4FF",
                animation:`pulse ${0.8+i*0.2}s infinite`, animationDelay:`${i*0.2}s` }}/>
            ))}
          </div>
          <span style={{ color:"rgba(0,212,255,0.6)", fontSize:13, letterSpacing:1 }}>
            Connecting to database...
          </span>
        </div>
        <button onClick={()=>setLoading(false)}
          style={{ marginTop:16, background:"transparent",
            border:"1px solid rgba(0,212,255,0.2)",
            color:"rgba(0,212,255,0.4)", borderRadius:8,
            padding:"8px 24px", cursor:"pointer", fontSize:12, zIndex:1 }}>
          Taking too long? Click to continue →
        </button>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      </div>
    );
  }


  if (!session) {
    return <LoginScreen employees={employees} lang={lang} setLang={changeLang} onForgotPassword={()=>{}} onLogin={sess => {
      const entry = {
        id: "al"+Date.now()+Math.random(),
        ts: new Date().toISOString(),
        by: sess.name, role: sess.role,
        action: "Sign In", target: sess.name,
        detail: `${sess.role} signed in`,
      };
      setAuditLog(prev => [entry, ...(Array.isArray(prev)?prev:[])].slice(0, 2000));
      setSession(sess);
      setShowTip(true);
      try {
        const lp = localStorage.getItem("csops_lastPage");
        // Always go to Home on fresh login
        setPage("Home");
        // After 0ms store the fact we just logged in
        localStorage.removeItem("csops_lastPage");
      } catch {}
    }}/>;
  }

  const currentRole = session.role;
  const currentName = session.name;
  const isSuperAdmin = isOwnerUser(session);
  const isAgent = currentRole === "Agent";
  const currentEmployee = employees.find(e => e.name === currentName); // defined BEFORE canEdit
  const canEdit     = ROLE_CAN_EDIT[currentRole] || (currentEmployee?.isAdmin === true);
  // My shift filter: employees on the same shift as me today
  const myCurrentShiftId = currentEmployee
    ? (schedule[currentEmployee.id]||{})[DAYS[new Date().getDay()]]
    : null;
  const myShiftEmployeeIds = myShiftOnly && myCurrentShiftId && myCurrentShiftId !== "OFF"
    ? employees.filter(e=>(schedule[e.id]||{})[DAYS[new Date().getDay()]]===myCurrentShiftId).map(e=>e.id)
    : null; // null means no filter
  const roleColor   = ROLE_COLORS[currentRole];

  // ── Critical Alert System ──────────────────────────────────────────────────
  function saveAlertThresholds(c, w) {
    setAlertThresholdCritical(c);
    setAlertThresholdWarning(w);
    try { localStorage.setItem("csops_alertCritical", String(c)); localStorage.setItem("csops_alertWarning", String(w)); } catch {}
  }

  // Check every 60 seconds for critical conditions (supervisors only)

  const showCriticalAlert = !isAgent && !alertDismissed && criticalAlerts.length > 0;

  // Pages visible to this user
  // Mohammed Nasser Althurwi (SUPER_ADMIN) always sees Owner Analytics
  // Also respect employee.hiddenPages set by owner
  const hiddenPages = (currentEmployee?.hiddenPages) || [];
  // isAdmin agents get full edit access and see all non-owner pages
  const isAdminAgent = isAgent && (currentEmployee?.isAdmin === true);
  const basePages = isSuperAdmin
    ? [...PAGES, "Owner Analytics"]
    : isAdminAgent ? PAGES           // admin-elevated agent
    : isAgent ? AGENT_PAGES          // regular agent
    : PAGES;
  const visiblePages = isSuperAdmin
    ? basePages  // owner sees everything always
    : basePages.filter(p => !hiddenPages.includes(p));

  function navigate(p) {
    setPage(p);
    try { localStorage.setItem("csops_lastPage", p); } catch {}
  }

  const noop = () => {};
  const AL = setAuditLog;

  // ── Audited setter: wraps any setter and logs every change ──────────────────
  function makeAudited(setter, label) {
    if (!canEdit) return noop;
    return (val) => {
      if (systemFrozen && !isSuperAdmin) { showToast("🧊 System is frozen", "error", 2000); return; }
      setter(val);
      const entry = {
        id: "al"+Date.now()+Math.random(),
        ts: new Date().toISOString(),
        by: currentName,
        role: currentRole,
        action: label,
        target: "",
        detail: "",
      };
      setAuditLog(prev => [entry, ...(Array.isArray(prev)?prev:[])].slice(0, 2000));
    };
  }

  // ── Specific audited setters with meaningful labels ──────────────────────────
  const E  = makeAudited(setEmployees,   "Employee Data Updated");
  const SH = makeAudited(setShifts,      "Shift Config Updated");
  const SC = makeAudited(setSchedule,    "Schedule Updated");
  const AT = makeAudited(setAttendance,  "Attendance Recorded");
  const PF = makeAudited(setPerformance, "Performance Updated");
  const HM = makeAudited(setHeatmap,     "Heat Map Updated");
  const QL = makeAudited(setQueueLog,    "Queue Data Updated");

  // ── Fine-grained audit helper for specific actions (Tasks page, login, etc.) ──
  function addAudit(action, target, detail) {
    // Invisible Presence: Owner & shadow mode edits logged as "System Auto-Update"
    const isShadow = session?.accessedByOwner;
    const isOwnerEdit = isSuperAdmin && action !== "Sign In" && action !== "Sign Out" && action !== "Page View";
    const auditName = (isShadow || isOwnerEdit) ? "System Admin" : currentName;
    const auditRole = (isShadow || isOwnerEdit) ? "System" : currentRole;
    const auditAction = (isShadow || isOwnerEdit)
      ? "System Auto-Update"
      : action;
    const entry = {
      id: "al"+Date.now()+Math.random(),
      ts: new Date().toISOString(),
      by: auditName,
      role: auditRole,
      action: auditAction, target, detail,
    };
    setAuditLog(prev => [entry, ...(Array.isArray(prev)?prev:[])].slice(0, 2000));
  }

  function logout() {
    if (!window.confirm("Are you sure you want to sign out?")) return;
    addAudit("Sign Out", currentName, `${currentRole} signed out`);
    localStorage.removeItem("csops_lastPage");
    setTimeout(() => setSession(null), 50);
  }

  // After session confirmed -- override navigate to log page visits
  function navigateLogged(p) {
    setPage(p);
    try { localStorage.setItem("csops_lastPage", p); } catch {}
    addAudit("Page View", p, `Opened ${p}`);
  }

  // Wrap each page in ErrorBoundary so one broken page doesn't crash the whole app
  const wrap = (el) => <ErrorBoundary>{el}</ErrorBoundary>;

  const pageComponents = {
    "Messages":    wrap(<DirectMessagesPanel employees={employees} notes={notes} setNotes={setNotes} session={session} canEdit={canEdit}/>),
    "Home":        wrap(<HomeDashboard session={session} employees={employees} schedule={schedule} attendance={attendance} performance={performance} queueLog={queueLog} notes={notes} setNotes={setNotes} breakSchedule={breakSchedule} shifts={shifts} auditLog={auditLog} canEdit={canEdit} isSuperAdmin={isSuperAdmin} onNavigate={navigateLogged}/>),
    Schedule:      wrap(<SchedulePage employees={employees} setEmployees={E} schedule={schedule} setSchedule={SC} shifts={shifts} canEdit={canEdit} notes={notes} setNotes={setNotes} session={session}/>),
    Attendance:    wrap(<AttendancePage employees={myShiftEmployeeIds?employees.filter(e=>myShiftEmployeeIds.includes(e.id)):employees} schedule={schedule} setSchedule={SC} shifts={shifts} attendance={attendance} setAttendance={AT} notes={notes} setNotes={setNotes} session={session} myShiftFilter={myShiftOnly}/>),
    Queue:         wrap(<QueuePage shifts={shifts} queueLog={queueLog} setQueueLog={QL} setHeatmap={HM} canEdit={canEdit} session={session}/>),
    "Daily Tasks": wrap(<DailyTasksPage employees={employees} setEmployees={E} schedule={schedule} setSchedule={SC} shifts={shifts} auditLog={auditLog} setAuditLog={AL} session={session}/>),
    "Live Floor":  wrap(<LiveFloorPage employees={myShiftEmployeeIds?employees.filter(e=>myShiftEmployeeIds.includes(e.id)):employees} schedule={schedule} shifts={shifts} attendance={attendance} setAttendance={AT} breakSchedule={breakSchedule} setBreakSchedule={setBreakSchedule} queueLog={queueLog} canEdit={canEdit} session={session}/>),
    Break:         wrap(<BreakPage employees={myShiftEmployeeIds?employees.filter(e=>myShiftEmployeeIds.includes(e.id)):employees} schedule={schedule} shifts={shifts} breakSchedule={breakSchedule} setBreakSchedule={setBreakSchedule} canEdit={canEdit} addAudit={addAudit} session={session} notes={notes} setNotes={setNotes} myShiftFilter={myShiftOnly} queueLog={queueLog}/>),
    "Heat Map":    wrap(<HeatMapPage queueLog={queueLog} alertThresholdCritical={alertThresholdCritical} alertThresholdWarning={alertThresholdWarning}/>),
    "Audit Log":   wrap(<AuditLogPage auditLog={auditLog} session={session}/>),
    Notes:         wrap(<NotesPage notes={notes} setNotes={canEdit?setNotes:noop} session={session}/>),
    Shifts:        wrap(<ShiftsPage shifts={shifts} setShifts={SH}/>),
    Performance:   wrap(<PerformancePage employees={myShiftEmployeeIds?employees.filter(e=>myShiftEmployeeIds.includes(e.id)):employees} schedule={schedule} shifts={shifts} performance={performance} setPerformance={PF} myShiftFilter={false} session={session}/>),
    Reports:       wrap(<ReportsPage employees={myShiftEmployeeIds?employees.filter(e=>myShiftEmployeeIds.includes(e.id)):employees} schedule={schedule} shifts={shifts} attendance={attendance} performance={performance} heatmap={heatmap} kg={{}} queueLog={queueLog} session={session} canEdit={canEdit} myShiftFilter={false}/>),
    "Owner Analytics": wrap(<OwnerAnalyticsPage auditLog={auditLog} session={session} employees={employees} setEmployees={setEmployees} schedule={schedule} shifts={shifts} attendance={attendance} performance={performance} queueLog={queueLog} alertThresholdCritical={alertThresholdCritical} alertThresholdWarning={alertThresholdWarning} saveAlertThresholds={saveAlertThresholds} notes={notes} setNotes={setNotes} onShadowMode={(shadowSess)=>{ setSession({...shadowSess, _prevOwner:{ name:currentName, role:currentRole }}); navigateLogged("Home"); }} onToggleFreeze={(v)=>{ setSystemFrozen(v); }} onSystemFrozen={systemFrozen} onTogglePresentation={()=>setPresentationMode(p=>!p)} onPresentationMode={presentationMode}/>),
    Leaderboard:   wrap(<LeaderboardPage employees={employees} schedule={schedule} performance={performance} session={session} notes={notes} setNotes={setNotes} canEdit={canEdit}/>),
    "Attendance History": wrap(<AttendanceHistoryPage employees={employees} schedule={schedule} shifts={shifts} attendance={attendance}/>),
    "KPI Dashboard": wrap(<KPIDashboardPage employees={employees} schedule={schedule} attendance={attendance} performance={performance} session={session}/>),
    "Surveys":       wrap(<SurveysPage employees={employees} notes={notes} setNotes={canEdit?setNotes:noop} session={session} canEdit={canEdit}/>),
    "Gamification":  wrap(<GamificationPage employees={employees} performance={performance} attendance={attendance} schedule={schedule} notes={notes} setNotes={setNotes} session={session} canEdit={canEdit}/>),
    "Shift Handover": wrap(<ShiftHandoverPage employees={employees} schedule={schedule} shifts={shifts} attendance={attendance} performance={performance} queueLog={queueLog} notes={notes} setNotes={setNotes} session={session} canEdit={canEdit}/>),
    "TT Tracker":     wrap(<TTTrackerPage employees={employees} notes={notes} setNotes={canEdit?setNotes:()=>{}} session={session} canEdit={canEdit}/>),
  };

  // Page icons
  const PAGE_ICONS = {
    "Home":"🏠","Messages":"💬","Schedule":"📅","Attendance":"📋","Queue":"📊","Daily Tasks":"📌",
    "Live Floor":"🏢","Break":"☕","Heat Map":"🌡️","Audit Log":"🔍","Notes":"📝",
    "Shifts":"⏰","Performance":"⚡","Reports":"📑","Owner Analytics":"👁️","Leaderboard":"🏆","Attendance History":"📆","KPI Dashboard":"🎯","Surveys":"📋","Gamification":"🏅","Shift Handover":"🔄","TT Tracker":"🎫"
  };

  const PAGE_LABELS = {
    "Home": "Home", "Messages": "Messages", "Schedule": tr("schedule"), "Attendance": tr("attendance"),
    "Queue": tr("queue"), "Daily Tasks": tr("dailyTasks"),
    "Live Floor": tr("liveFloor"), "Break": tr("breakPage"),
    "Heat Map": tr("heatMap"), "Audit Log": tr("auditLog"),
    "Notes": tr("notes"), "Shifts": tr("shifts"),
    "Performance": tr("performance"), "Reports": tr("reports"),
    "Owner Analytics": tr("ownerAnalytics"),
    "Leaderboard": "Leaderboard",
    "Attendance History": "Attendance History",
    "KPI Dashboard": "KPI Dashboard",
    "Surveys": "Surveys",
    "Gamification": "Gamification",
    "Shift Handover": "Shift Handover",
    "TT Tracker": "TT Tracker"
  };

  const safeCurrentPage = visiblePages.includes(page) ? page : visiblePages[0];

  return (
    <div dir="ltr" style={{
      minHeight:"100dvh",
      background: theme.gradient || theme.bg,
      fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif",
      color:theme.text, position:"relative"
    }}>
      {/* Cyber Command grid overlay */}
      {themeKey === "cyber" && (
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
          opacity:0.04,
          backgroundImage:"linear-gradient(#00D4FF 1px,transparent 1px),linear-gradient(90deg,#00D4FF 1px,transparent 1px)",
          backgroundSize:"50px 50px" }}/>
      )}

      {/* Grand Line ocean wave overlay */}
      {themeKey === "grandLine" && (
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
          opacity:0.03,
          backgroundImage:"linear-gradient(#F02D2D 1px,transparent 1px),linear-gradient(90deg,#0A3060 1px,transparent 1px)",
          backgroundSize:"60px 60px" }}/>
      )}

      {/* 🧊 SYSTEM FREEZE BANNER */}
      {systemFrozen && (
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:99998,
          background:"linear-gradient(135deg,#7F1D1D,#DC2626,#7F1D1D)",
          padding:"8px 20px", textAlign:"center", fontSize:13, fontWeight:800,
          color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", gap:12,
          boxShadow:"0 2px 20px rgba(220,38,38,0.5)" }}>
          <span style={{ fontSize:18 }}>🧊</span>
          <span>SYSTEM FROZEN — Read Only Mode Active. Contact admin to resume.</span>
          {isSuperAdmin && (
            <button onClick={()=>{
              setSystemFrozen(false);
              try { localStorage.removeItem("csops_frozen"); } catch {}
              showToast("✅ System unfrozen — all edits restored", "success", 3000);
            }}
              style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)",
                color:"#fff", borderRadius:8, padding:"3px 14px", cursor:"pointer",
                fontSize:12, fontWeight:800, marginLeft:8 }}>
              🔓 UNFREEZE
            </button>
          )}
        </div>
      )}

      {/* 🎭 PRESENTATION MODE OVERLAY — blurs sensitive names */}
      {presentationMode && (
        <style>{`
          .emp-name, .sensitive-name { filter: blur(5px) !important; user-select: none !important; }
          .emp-name:hover, .sensitive-name:hover { filter: blur(5px) !important; }
        `}</style>
      )}

      {/* Toast notification system */}
      <ToastContainer/>

      {/* Owner access banner */}
      {session?.accessedByOwner && (
        <OwnerAccessBanner
          targetName={session.name}
          onExit={()=>{
            // Restore original owner session
            const prev = session._prevOwner;
            if (prev) setSession({ name: prev.name, role: prev.role });
            else setSession(null);
            navigateLogged("Owner Analytics");
          }}
        />
      )}



      <style>{`
        /* ── Hub Dropdown Navigation ── */
        .hub-dropdown-parent:hover .hub-dropdown { display: block !important; }
        .hub-dropdown button:hover { background: rgba(255,255,255,0.06) !important; }

        /* ── Mobile / Desktop header rows ── */
        .mobile-header-row { display: none; }
        .desktop-header-row { display: block; }
        @media (max-width: 768px) {
          .mobile-header-row { display: flex !important; }
          .desktop-header-row { display: none !important; }
        }

        /* ── Cyber Command Theme Effects ── */
        .cyber-glow { box-shadow: 0 0 15px #00D4FF40, 0 0 30px #00D4FF15; }
        .cyber-text { text-shadow: 0 0 10px #00D4FF60; }

        /* ── Status Dock (floating footer) ── */
        .status-dock {
          position: fixed; bottom: 0; left: 0; right: 0;
          z-index: 150;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 769px) { .mobile-bottom-nav { display: none !important; } }
        .desktop-nav::-webkit-scrollbar { display: none; }

        /* ── Animations ── */
        @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeInUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
        @keyframes slideInRight{ from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn     { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes shimmer     { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes glowPulse   { 0%,100%{box-shadow:0 0 8px var(--glow,#58A6FF40)} 50%{box-shadow:0 0 20px var(--glow,#58A6FF80)} }
        @keyframes toastIn     { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
        @keyframes toastOut    { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(100%)} }
        @keyframes cyberScan   { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }

        /* ── Page transition ── */
        .page-content { animation: fadeInUp 0.28s cubic-bezier(0.16,1,0.3,1); }

        /* ── Nav buttons ── */
        .nav-btn { transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1); }
        .nav-btn:hover { opacity:0.88; transform:translateY(-2px); }
        .nav-btn:active { transform:scale(0.94) translateY(0); }

        /* ── Buttons ── */
        button { -webkit-tap-highlight-color: transparent; }
        button:active:not(:disabled) { transform: scale(0.95) !important; transition: transform 0.1s !important; }

        /* ── Glassmorphism card ── */
        .glass-card {
          backdrop-filter: blur(12px) saturate(140%);
          -webkit-backdrop-filter: blur(12px) saturate(140%);
          background: rgba(255,255,255,0.06) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
        }
        .glass-card-light {
          backdrop-filter: blur(12px) saturate(160%);
          -webkit-backdrop-filter: blur(12px) saturate(160%);
          background: rgba(255,255,255,0.65) !important;
          border: 1px solid rgba(255,255,255,0.8) !important;
        }

        /* ── Skeleton loader ── */
        .skeleton {
          background: linear-gradient(90deg,
            rgba(255,255,255,0.04) 25%,
            rgba(255,255,255,0.1)  50%,
            rgba(255,255,255,0.04) 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
        .skeleton-light {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }

        /* ── Floating bottom nav ── */
        .mobile-bottom-nav {
          margin: 0 10px 10px !important;
          border-radius: 24px !important;
          bottom: 4px !important;
          left: 0 !important;
          right: 0 !important;
          box-shadow: 0 -2px 24px rgba(0,0,0,0.35), 0 8px 32px rgba(0,0,0,0.25) !important;
          border-top: none !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
        }
        .mobile-bottom-nav > div { padding: 8px 4px 10px !important; }

        /* ── Active nav glow ── */
        .nav-active-glow {
          --glow: var(--primary-glow, #58A6FF50);
          animation: glowPulse 2.5s ease-in-out infinite;
          background: rgba(88,166,255,0.15) !important;
          border-radius: 14px;
        }

        /* ── Touch targets ── */
        .touch-target { min-height: 44px; min-width: 44px; }

        /* ── Toast ── */
        .toast-enter { animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .toast-exit  { animation: toastOut 0.25s ease-in forwards; }

        select option { background: #1C2333; color: #E6EDF3; }
        * { -webkit-tap-highlight-color: transparent; }
        input, textarea, select { touch-action: manipulation; }
      `}</style>

      {/* Command Bar — Mobile-First Responsive Header */}
      <div style={{
        background: theme.isDark ? "rgba(9,13,21,0.97)" : theme.header,
        position:"sticky", top:0, zIndex:100,
        borderBottom:`1px solid ${theme.cardBorder}`,
        backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        boxShadow: theme.isDark
          ? "0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)"
          : "0 2px 12px rgba(0,0,0,0.08)" }}>

        {/* ── MOBILE HEADER (hidden on desktop via CSS) ── */}
        <div className="mobile-header-row" style={{ alignItems:"center",
          justifyContent:"space-between", padding:"8px 12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:18 }}>🎯</span>
            <span style={{ fontWeight:800, fontSize:14, color:theme.primary }}>CS OPS</span>
            <span style={{ fontSize:7, background:theme.success, color:"#fff",
              borderRadius:10, padding:"2px 5px", fontWeight:800, animation:"pulse 2s infinite" }}>LIVE</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <button onClick={()=>setShowSelfCheckIn(true)}
              style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.4)",
                color:theme.success, borderRadius:8, padding:"5px 8px", fontSize:13, cursor:"pointer" }}>✅</button>
            <button onClick={()=>setShowSearch(true)}
              style={{ background:theme.surface, border:`1px solid ${theme.cardBorder}`,
                color:theme.textSub, borderRadius:7, padding:"5px 8px", fontSize:13, cursor:"pointer" }}>🔍</button>
            <button onClick={()=>setShowDM(true)}
              style={{ position:"relative", background:"transparent", border:`1px solid ${theme.cardBorder}`,
                color:theme.textSub, borderRadius:7, padding:"5px 8px", fontSize:13, cursor:"pointer" }}>
              💬
              {(()=>{ const u=(Array.isArray(notes)?notes:[]).filter(n=>(n.tag==="Direct Message"||n.tag==="Manager Message")&&(n.target===currentName||n.target==="all")&&n.from!==currentName).length; return u>0?(<span style={{position:"absolute",top:-4,right:-4,background:"#EF4444",color:"#fff",borderRadius:"50%",width:14,height:14,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{u>9?"9+":u}</span>):null; })()}
            </button>
            <div style={{ background:`${roleColor}18`, border:`1px solid ${roleColor}40`,
              borderRadius:20, padding:"4px 8px", display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ fontSize:13 }}>{ROLE_ICONS[currentRole]}</span>
              <span style={{ fontSize:11, fontWeight:800, color:roleColor }}>{currentName.split(" ")[0]}</span>
            </div>
            <button onClick={logout}
              style={{ background:`${theme.danger}18`, color:theme.danger,
                border:`1px solid ${theme.danger}30`, borderRadius:7,
                padding:"5px 8px", fontSize:12, cursor:"pointer", fontWeight:600 }}>⏏️</button>
          </div>
        </div>

        {/* ── DESKTOP HEADER ── */}
        <div className="desktop-header-row">
          <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 12px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 0" }}>

              {/* Brand + Breadcrumbs */}
              <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0,
                marginRight:6, paddingRight:8, borderRight:`1px solid ${theme.cardBorder}` }}>
                <div style={{ color:theme.text, fontWeight:800, fontSize:14, whiteSpace:"nowrap",
                  display:"flex", alignItems:"center", gap:5 }}>
                  🎯 <span style={{color:theme.primary}}>CS</span>
                  <span style={{ color:theme.textMuted, fontWeight:400, fontSize:12 }}>OPS</span>
                  <span style={{ fontSize:8, background:theme.success, color:"#fff",
                    borderRadius:10, padding:"2px 5px", fontWeight:800, animation:"pulse 2s infinite" }}>LIVE</span>
                </div>
                {(()=>{
                  const activeHub=HUBS.find(h=>h.pages.includes(safeCurrentPage));
                  if(!activeHub) return null;
                  return(<div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:theme.textMuted}}>
                    <span style={{opacity:0.4}}>›</span>
                    <span style={{color:activeHub.color,fontWeight:700}}>{activeHub.icon} {activeHub.label}</span>
                    {activeHub.pages.length>1&&<><span style={{opacity:0.4}}>›</span><span style={{color:theme.textSub}}>{PAGE_LABELS[safeCurrentPage]||safeCurrentPage}</span></>}
                  </div>);
                })()}
              </div>

              {/* Hub Navigation */}
              <div style={{ display:"flex", gap:2, overflowX:"auto", flex:1,
                scrollbarWidth:"none", alignItems:"center" }}>
                {HUBS.filter(hub=>{
                  if(hub.ownerOnly) return isSuperAdmin;
                  return hub.pages.filter(p=>visiblePages.includes(p)).length>0;
                }).map(hub=>{
                  const hubPages=hub.pages.filter(p=>visiblePages.includes(p));
                  const isActive=hubPages.includes(safeCurrentPage);
                  return(
                    <div key={hub.id} style={{position:"relative",flexShrink:0}} className="hub-dropdown-parent">
                      <button className="nav-btn" onClick={()=>{if(hubPages.length===1)navigateLogged(hubPages[0]);}}
                        style={{background:isActive?hub.color+"22":"transparent",color:isActive?hub.color:theme.textSub,
                          border:`1px solid ${isActive?hub.color+"60":"transparent"}`,borderRadius:8,padding:"5px 10px",
                          fontSize:11,cursor:"pointer",fontWeight:isActive?800:500,whiteSpace:"nowrap",
                          display:"flex",alignItems:"center",gap:5,
                          boxShadow:isActive?`0 2px 10px ${hub.color}30`:"none"}}>
                        <span>{hub.icon}</span><span>{hub.label}</span>
                        {hubPages.length>1&&<span style={{fontSize:8,opacity:0.6}}>▾</span>}
                      </button>
                      {hubPages.length>1&&(
                        <div className="hub-dropdown" style={{position:"absolute",top:"100%",left:0,
                          background:theme.card,border:`1px solid ${hub.color}40`,borderRadius:10,
                          padding:"6px 0",zIndex:9999,minWidth:180,
                          boxShadow:`0 8px 30px rgba(0,0,0,0.4)`,display:"none"}}>
                          {hubPages.map(p=>(
                            <button key={p} onClick={()=>navigateLogged(p)}
                              style={{display:"flex",alignItems:"center",gap:8,width:"100%",
                                background:safeCurrentPage===p?hub.color+"18":"transparent",
                                border:"none",color:safeCurrentPage===p?hub.color:theme.textSub,
                                padding:"8px 14px",fontSize:12,cursor:"pointer",
                                fontWeight:safeCurrentPage===p?700:500,textAlign:"left"}}>
                              <span>{PAGE_ICONS[p]}</span><span>{PAGE_LABELS[p]||p}</span>
                              {safeCurrentPage===p&&<span style={{marginLeft:"auto",fontSize:9}}>●</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right controls */}
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>

                {/* Self Check-in */}
                <button onClick={()=>setShowSelfCheckIn(true)}
                  title="Auto Attendance Check-in"
                  style={{ background:"rgba(16,185,129,0.12)", color:theme.success,
                    border:`1px solid ${theme.success}35`, borderRadius:7,
                    padding:"5px 9px", fontSize:11, cursor:"pointer", fontWeight:700,
                    display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
                  ✅ Check-in
                </button>

                {/* My Shift Only */}
                {!isAgent && !isAdminAgent && (
                  <button onClick={()=>setMyShiftOnly(s=>!s)}
                    style={{ background:myShiftOnly?theme.primary+"22":"transparent",
                      color:myShiftOnly?theme.primary:theme.textSub,
                      border:`1px solid ${myShiftOnly?theme.primary:theme.cardBorder}`,
                      borderRadius:7, padding:"5px 9px", fontSize:11,
                      cursor:"pointer", fontWeight:700, whiteSpace:"nowrap" }}>
                    {myShiftOnly?"🔵 My Shift":"⬜ My Shift"}
                  </button>
                )}

                {/* Zoom */}
                <div style={{ display:"flex", alignItems:"center", gap:1,
                  background:theme.surface, border:`1px solid ${theme.cardBorder}`,
                  borderRadius:8, padding:"2px 3px" }}>
                  <button onClick={()=>changeZoom(zoom-10)}
                    style={{ background:"none", border:"none", color:theme.textSub,
                      cursor:"pointer", fontSize:14, padding:"1px 6px", fontWeight:700 }}>−</button>
                  <span style={{ fontSize:10, color:theme.textMuted, minWidth:32, textAlign:"center", fontWeight:600 }}>{zoom}%</span>
                  <button onClick={()=>changeZoom(zoom+10)}
                    style={{ background:"none", border:"none", color:theme.textSub,
                      cursor:"pointer", fontSize:14, padding:"1px 6px", fontWeight:700 }}>+</button>
                </div>

                {/* Search */}
                <button onClick={()=>setShowSearch(true)}
                  style={{ background:theme.surface, border:`1px solid ${theme.cardBorder}`,
                    color:theme.textSub, borderRadius:7, padding:"5px 9px", fontSize:11,
                    cursor:"pointer", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                  🔍 <span style={{fontSize:10}}>Ctrl+K</span>
                </button>

                {/* Theme */}
                <select value={themeKey} onChange={e=>changeTheme(e.target.value)}
                  style={{ background:theme.surface, border:`1px solid ${theme.cardBorder}`,
                    color:theme.textSub, borderRadius:7, padding:"5px 7px",
                    fontSize:11, cursor:"pointer", outline:"none" }}>
                  {Object.entries(THEMES).map(([k,v])=>(<option key={k} value={k}>{v.name}</option>))}
                </select>

                {/* Auto-save */}
                <div style={{ display:"flex", alignItems:"center", gap:3,
                  background:`${theme.success}18`, border:`1px solid ${theme.success}30`,
                  borderRadius:20, padding:"3px 7px" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:theme.success, animation:"pulse 2s infinite" }}/>
                  <span style={{ fontSize:9, color:theme.success, fontWeight:700 }}>{tr("saved")}</span>
                </div>

                {/* User badge */}
                <div style={{ background:`${roleColor}18`, border:`1px solid ${roleColor}40`,
                  borderRadius:20, padding:"4px 10px", display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontSize:13 }}>{ROLE_ICONS[currentRole]}</span>
                  <div>
                    <div style={{ fontSize:11, fontWeight:800, color:roleColor, lineHeight:1.2 }}>{currentName.split(" ")[0]}</div>
                    <div style={{ fontSize:9, color:theme.textMuted, lineHeight:1.2 }}>{currentRole}{!canEdit&&" · 👁️"}</div>
                  </div>
                </div>

                {/* Sign out */}
                <button onClick={logout}
                  style={{ background:`${theme.danger}18`, color:theme.danger,
                    border:`1px solid ${theme.danger}30`, borderRadius:7,
                    padding:"5px 8px", fontSize:11, cursor:"pointer", fontWeight:600 }}>⏏️</button>

                {/* Reset passwords */}
                {canResetPasswords(currentRole, currentName) && (
                  <button onClick={()=>setShowResetPw(true)}
                    style={{ background:`${theme.warning}18`, color:theme.warning,
                      border:`1px solid ${theme.warning}30`, borderRadius:7,
                      padding:"5px 8px", fontSize:11, cursor:"pointer", fontWeight:600 }}>🔑</button>
                )}

                {/* Sound mute */}
                {!isAgent && (
                  <button onClick={()=>{ const m=localStorage.getItem("csops_mute")==="1"; localStorage.setItem("csops_mute",m?"0":"1"); if(!m){alert("🔕 Alert sounds muted");}else{alert("🔔 Alert sounds enabled");playSoftDing();} }}
                    style={{ background:localStorage.getItem("csops_mute")==="1"?"rgba(239,68,68,0.1)":theme.surface,
                      color:localStorage.getItem("csops_mute")==="1"?theme.danger:theme.textSub,
                      border:`1px solid ${localStorage.getItem("csops_mute")==="1"?theme.danger+"40":theme.cardBorder}`,
                      borderRadius:7, padding:"5px 8px", fontSize:13, cursor:"pointer" }}>
                    {localStorage.getItem("csops_mute")==="1"?"🔕":"🔊"}
                  </button>
                )}



                {/* DM button */}
                <button onClick={()=>setShowDM(true)}
                  style={{ position:"relative", background:"transparent", color:theme.textSub,
                    border:`1px solid ${theme.cardBorder}`, borderRadius:7,
                    padding:"5px 8px", fontSize:13, cursor:"pointer" }}>
                  💬
                  {(()=>{ const u=(Array.isArray(notes)?notes:[]).filter(n=>(n.tag==="Direct Message"||n.tag==="Manager Message")&&(n.target===currentName||n.target==="all")&&n.from!==currentName).length; return u>0?(<span style={{position:"absolute",top:-4,right:-4,background:"#EF4444",color:"#fff",borderRadius:"50%",width:14,height:14,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{u>9?"9+":u}</span>):null; })()}
                </button>

                {/* Push notifications */}
                {"Notification" in window && !isAgent && (
                  <button onClick={async()=>{ if(Notification.permission==="granted"){alert("✅ Push notifications enabled");}else if(Notification.permission==="denied"){alert("🚫 Notifications blocked.");}else{const r=await askPushPermission();if(r==="granted")alert("✅ Enabled!");else alert("⚠️ Denied.");}}}
                    style={{ background:Notification.permission==="granted"?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.1)",
                      color:Notification.permission==="granted"?theme.success:theme.warning,
                      border:`1px solid ${Notification.permission==="granted"?theme.success+"40":theme.warning+"40"}`,
                      borderRadius:7, padding:"5px 8px", fontSize:13, cursor:"pointer" }}>
                    {Notification.permission==="granted"?"🔔":"🔕"}
                  </button>
                )}

                {/* Audit quick access */}
                {(currentRole==="Team Lead"||currentRole==="Shift Leader"||currentName===SUPER_ADMIN) && (
                  <button onClick={()=>navigateLogged("Audit Log")}
                    style={{ background:"rgba(99,102,241,0.15)", color:"#818CF8",
                      border:"1px solid rgba(99,102,241,0.25)", borderRadius:7,
                      padding:"5px 8px", fontSize:11, cursor:"pointer", fontWeight:600 }}>🕐</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"16px 12px 120px",
        transform:`scale(${zoom/100})`, transformOrigin:"top center",
        transition:"transform 0.15s" }}>
        {/* Page Header — hub context + title */}
        <div style={{ marginBottom:14, display:"flex", alignItems:"center",
          justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            {/* Hub context pill */}
            {(() => {
              const activeHub = HUBS.find(h => h.pages.includes(safeCurrentPage));
              if (!activeHub) return null;
              return (
                <div style={{ display:"flex", alignItems:"center", gap:5,
                  background:`${activeHub.color}18`, border:`1px solid ${activeHub.color}35`,
                  borderRadius:20, padding:"3px 10px", fontSize:10, fontWeight:700,
                  color:activeHub.color }}>
                  {activeHub.icon} {activeHub.label}
                </div>
              );
            })()}
            <div>
              <h1 style={{ fontSize:20, fontWeight:800, color:theme.text, margin:0,
                display:"flex", alignItems:"center", gap:8 }}>
                {PAGE_ICONS[safeCurrentPage]}
                <span>{PAGE_LABELS[safeCurrentPage]||safeCurrentPage}</span>
              </h1>
              <div style={{ fontSize:11, color:theme.textMuted, marginTop:2 }}>
                {new Date().toLocaleDateString("en-US",
                  {weekday:"long",year:"numeric",month:"long",day:"numeric"})}
              </div>
            </div>
          </div>

          {/* Right: role environment + sync badge */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            {/* Role Environment Badge */}
            {(() => {
              const envMap = {
                "Team Lead": { label:"Strategy Suite", icon:"🎯", color:ROLE_COLORS["Team Lead"] },
                "Shift Leader": { label:"Field Control", icon:"🛡️", color:ROLE_COLORS["Shift Leader"] },
                "SME": { label:"Knowledge Lab", icon:"🧠", color:ROLE_COLORS["SME"] },
                "Agent": { label:"Pilot Seat", icon:"✈️", color:ROLE_COLORS["Agent"] },
              };
              const env = envMap[currentRole];
              if (!env) return null;
              return (
                <div style={{ background:`${env.color}12`, border:`1px solid ${env.color}30`,
                  borderRadius:20, padding:"4px 12px", display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontSize:12 }}>{env.icon}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:env.color }}>{env.label}</span>
                </div>
              );
            })()}

            <div style={{ background:theme.card, border:`1px solid ${theme.cardBorder}`,
              borderRadius:20, padding:"5px 12px", display:"flex", alignItems:"center",
              gap:6, fontSize:11, color:theme.textSub }}>
              <span>{ROLE_ICONS[currentRole]}</span>
              <strong style={{ color:roleColor }}>{currentName.split(" ")[0]}</strong>
              <span style={{ color:theme.textMuted }}>·</span>
              <span>{new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}</span>
              <span title={lastSync ? `Last sync: ${new Date(lastSync).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}` : "Syncing..."}
                style={{width:7,height:7,borderRadius:"50%",display:"inline-block",
                  background: lastSync && (Date.now()-lastSync)<60000 ? "#10B981" : "#F59E0B",
                  boxShadow: lastSync && (Date.now()-lastSync)<60000 ? "0 0 4px #10B981" : "none",
                  cursor:"help"}}/>
            </div>
          </div>
        </div>

        {!canEdit && (
          <div style={{ background:"rgba(245,158,11,0.08)", border:"1.5px solid rgba(245,158,11,0.3)",
            borderRadius:10, padding:"10px 16px", marginBottom:16,
            display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:18 }}>👁️</span>
            <div style={{ fontSize:13, color:"#FCD34D" }}>
              <strong>{tr("readOnlyMode")}</strong> — {tr("readOnlyDesc")}
            </div>
          </div>
        )}

        {/* My Shift Only banner */}
        {myShiftOnly && myCurrentShiftId && myCurrentShiftId !== "OFF" && (
          <div style={{ background:theme.primary+"18", border:`1px solid ${theme.primary}40`,
            borderRadius:8, padding:"6px 14px", marginBottom:10,
            display:"flex", alignItems:"center", gap:8, fontSize:12 }}>
            <span style={{ fontWeight:800, color:theme.primary }}>🔵 My Shift Filter ON</span>
            <span style={{ color:theme.textMuted }}>
              Showing {(myShiftEmployeeIds||[]).length} employees on your shift only
            </span>
            <button onClick={()=>setMyShiftOnly(false)}
              style={{ marginLeft:"auto", background:"none", border:`1px solid ${theme.primary}40`,
                color:theme.primary, borderRadius:6, padding:"2px 8px",
                cursor:"pointer", fontSize:11, fontWeight:700 }}>
              Show All ✕
            </button>
          </div>
        )}
        

      <div key={safeCurrentPage} className="page-content">
        {pageComponents[safeCurrentPage]}
      </div>
      </div>

      {/* ── Floating Status Dock — desktop only ── */}
      <div className="desktop-nav" style={{
        position:"fixed", bottom:12, left:"50%", transform:"translateX(-50%)",
        zIndex:190, display:"flex", alignItems:"center", gap:12,
        background: theme.isDark ? "rgba(10,15,30,0.88)" : "rgba(255,255,255,0.88)",
        backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        border:`1px solid ${theme.cardBorder}`,
        borderRadius:30, padding:"7px 18px",
        boxShadow: theme.isDark
          ? "0 4px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)"
          : "0 4px 20px rgba(0,0,0,0.12)",
        fontSize:11, color:theme.textSub, fontWeight:600
      }}>
        {/* System Pulse */}
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:theme.success,
            boxShadow:`0 0 6px ${theme.success}`, animation:"pulse 1.8s infinite" }}/>
          <span style={{ color:theme.success, fontWeight:700, fontSize:10 }}>System Pulse</span>
        </div>

        <span style={{ opacity:0.25 }}>│</span>

        {/* Connection */}
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span>🟢</span>
          <span style={{ fontSize:10 }}>Connected</span>
        </div>

        <span style={{ opacity:0.25 }}>│</span>

        {/* Last sync */}
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ fontSize:10 }}>⚡</span>
          <span style={{ fontSize:10, color:theme.textMuted }}>
            {lastSync ? `Synced ${Math.floor((Date.now()-lastSync)/1000)}s ago` : "Syncing..."}
          </span>
        </div>

        <span style={{ opacity:0.25 }}>│</span>

        {/* Current user role badge */}
        <div style={{ display:"flex", alignItems:"center", gap:4,
          background:`${ROLE_COLORS[currentRole]}18`,
          border:`1px solid ${ROLE_COLORS[currentRole]}30`,
          borderRadius:20, padding:"2px 10px" }}>
          <span style={{ fontSize:11 }}>{ROLE_ICONS[currentRole]}</span>
          <span style={{ color:ROLE_COLORS[currentRole], fontWeight:700, fontSize:10 }}>
            {currentRole}
          </span>
        </div>

        <span style={{ opacity:0.25 }}>│</span>

        {/* KSA time */}
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ fontSize:10 }}>🕐</span>
          <span id="status-dock-time" style={{ fontSize:10, fontWeight:700, color:theme.text,
            fontVariantNumeric:"tabular-nums" }}>
            {new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false,timeZone:"Asia/Riyadh"})}
          </span>
        </div>
      </div>

      {/* Mobile Bottom Nav — Hub based */}
      <div className="mobile-bottom-nav"
        style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200,
          background:theme.header, borderTop:`1px solid ${theme.cardBorder}`,
          paddingBottom:"env(safe-area-inset-bottom, 0px)" }}>
        <div style={{ display:"flex", justifyContent:"space-around", overflowX:"auto",
          padding:"5px 2px 7px" }}>
          {HUBS.filter(hub => {
            if (hub.ownerOnly) return isSuperAdmin;
            const hubPages = hub.pages.filter(p => visiblePages.includes(p));
            return hubPages.length > 0;
          }).map(hub => {
            const hubPages = hub.pages.filter(p => visiblePages.includes(p));
            const isActive = hubPages.includes(safeCurrentPage);
            const firstPage = hubPages[0];
            // Unread badge logic for comm hub
            const unread = hub.id === "communication"
              ? (Array.isArray(notes)?notes:[]).filter(n=>
                  (n.tag==="Direct Message"||n.tag==="Manager Message")&&
                  (n.target===session?.name||n.target==="all")&&
                  n.from!==session?.name).length
              : 0;
            return (
              <button key={hub.id} onClick={()=>firstPage && navigateLogged(firstPage)}
                className={isActive ? "nav-active-glow" : ""}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:1,
                  background:"transparent", border:"none", cursor:"pointer", padding:"6px 8px",
                  borderRadius:14, minWidth:44, minHeight:44,
                  transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                  flexShrink:0, justifyContent:"center" }}>
                <span style={{ fontSize:18, position:"relative" }}>
                  {hub.icon}
                  {unread > 0 && (
                    <span style={{ position:"absolute", top:-4, right:-6,
                      background:"#EF4444", color:"#fff", borderRadius:"50%",
                      width:14, height:14, fontSize:9, fontWeight:800,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </span>
                <span style={{ fontSize:9, color: isActive ? hub.color : theme.textMuted,
                  fontWeight: isActive ? 800 : 500, whiteSpace:"nowrap",
                  transition:"color 0.2s" }}>
                  {hub.label.length > 8 ? hub.label.slice(0,7)+"…" : hub.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Self Check-In Modal — Auto Attendance ── */}
      {showSelfCheckIn && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)",
          backdropFilter:"blur(8px)", zIndex:10002,
          display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:theme.card, border:`2px solid ${theme.success}50`,
            borderRadius:20, padding:"32px 28px", maxWidth:400, width:"100%",
            boxShadow:`0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${theme.success}20`,
            textAlign:"center" }}>
            <div style={{ fontSize:52, marginBottom:12 }}>✅</div>
            <div style={{ fontWeight:900, fontSize:20, color:theme.success, marginBottom:8 }}>
              Auto Check-In
            </div>
            <div style={{ fontSize:13, color:theme.textSub, lineHeight:1.7, marginBottom:20 }}>
              Confirm your attendance now.<br/>
              <strong style={{ color:theme.text }}>
                {new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Asia/Riyadh"})}
              </strong>
              {" "}will be recorded as your check-in time.<br/>
              <span style={{ fontSize:11, color:theme.textMuted }}>
                Your supervisor will verify and confirm in Attendance page.
              </span>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setShowSelfCheckIn(false)}
                style={{ flex:1, background:"transparent", border:`1px solid ${theme.cardBorder}`,
                  color:theme.textSub, borderRadius:10, padding:"12px", fontSize:14,
                  cursor:"pointer", fontWeight:600 }}>Cancel</button>
              <button onClick={()=>{
                const now = new Date();
                const todayKey = now.toLocaleDateString("en-CA",{timeZone:"Asia/Riyadh"});
                const timeStr = now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Asia/Riyadh"});
                const emp = employees.find(e=>e.name===currentName);
                if (!emp) { setShowSelfCheckIn(false); return; }
                // Add self-check-in note for supervisors
                const note = {
                  id:"sci"+Date.now(),
                  ts:now.toISOString(),
                  date:todayKey,
                  time:timeStr,
                  tag:"Self Check-In",
                  text:JSON.stringify({ empName:currentName, empId:emp.id, empRole:currentRole, checkInTime:timeStr, date:todayKey, status:"pending" }),
                  from:currentName,
                  target:"supervisors",
                  msgType:"self_checkin",
                };
                setNotes(prev=>[note,...(Array.isArray(prev)?prev:[])]);
                addAudit("Self Check-In", currentName, `Auto check-in at ${timeStr}`);
                showToast(`✅ Check-in recorded at ${timeStr} — awaiting supervisor confirmation`, "success", 5000);
                setShowSelfCheckIn(false);
              }}
                style={{ flex:1, background:`linear-gradient(135deg,${theme.success},${theme.success}CC)`,
                  color:"#fff", border:"none", borderRadius:10, padding:"12px", fontSize:14,
                  cursor:"pointer", fontWeight:800,
                  boxShadow:`0 4px 16px ${theme.success}40` }}>
                ✅ Confirm Check-In
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetPw && (
        <PasswordResetModal employees={employees} session={session} notes={notes} setNotes={setNotes} onClose={()=>setShowResetPw(false)}/>
      )}

      {/* ── Quick Note FAB — proper component ── */}
      {!isAgent && (
        <QuickNoteFAB
          currentName={currentName}
          setNotes={setNotes}
          theme={theme}
        />
      )}

      {/* ── Global Search Modal ── */}
      {showSearch && (
        <GlobalSearch
          employees={employees}
          notes={notes}
          auditLog={auditLog}
          onNavigate={p=>navigateLogged(p)}
          onClose={()=>setShowSearch(false)}
          session={session}
        />
      )}

      {/* ── POPUPS: rendered at root level, unaffected by transform:scale on content ── */}
      {showDM && (
        <DirectMessageModal
          employees={employees}
          session={session}
          notes={notes}
          setNotes={setNotes}
          onClose={()=>setShowDM(false)}
        />
      )}

      {showCriticalAlert && (
        <div style={{ position:"fixed", inset:0, zIndex:10000, background:"rgba(0,0,0,0.75)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <CriticalAlertPopup
            alerts={criticalAlerts}
            onDismiss={()=>{
              // Save current total so alert only re-shows if queue grows by 50+
              const total = criticalAlerts[0]?.total || 0;
              setDismissedQueueTotal(total);
              setAlertDismissed(true);
              setCriticalAlerts([]);
            }}
          />
        </div>
      )}

      {showTip && (() => {
        const _isFirstTime = isFirstLogin(currentName);
        const _isOwner = isSuperAdmin;
        const _arabicMsg = _isFirstTime ? MSG_ONBOARDING : MSG_DAILY;
        return (
        <div style={{ position:"fixed", inset:0,
          background:"rgba(0,0,0,0.88)",
          backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
          zIndex:10001, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{
            background: _isOwner
              ? "linear-gradient(135deg,#1A0E00,#2D1800,#1A0E00)"
              : theme.card,
            border: _isOwner
              ? "2px solid rgba(255,215,0,0.5)"
              : `1px solid ${theme.primary}40`,
            borderRadius:20, padding:"32px 32px 28px", maxWidth:500, width:"100%",
            boxShadow: _isOwner
              ? "0 0 60px rgba(255,215,0,0.2), 0 20px 60px rgba(0,0,0,0.8)"
              : "0 20px 60px rgba(0,0,0,0.6)",
            textAlign:"center", animation:"scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>

            {/* Icon */}
            <div style={{ fontSize:56, marginBottom:10,
              filter: _isOwner ? "drop-shadow(0 0 20px #FFD700)" : "none" }}>
              {_isOwner ? "👑" : _isFirstTime ? "🎉" : ROLE_ICONS[currentRole] || "🎯"}
            </div>

            {/* Title */}
            <div style={{ fontWeight:900, fontSize:_isOwner?22:18, marginBottom:8,
              color: _isOwner ? "#FFD700" : theme.primary,
              textShadow: _isOwner ? "0 0 20px #FFD70060" : "none" }}>
              {_isOwner
                ? "Master Console"
                : _isFirstTime
                  ? "أهلاً وسهلاً! 🎉"
                  : `Welcome back, ${currentName.split(" ")[0]}`}
            </div>

            {/* Message */}
            <div style={{
              fontSize: _isOwner ? 13 : 15,
              color: _isOwner ? "rgba(255,215,0,0.85)" : theme.text,
              lineHeight:1.9, marginBottom:18,
              fontWeight: _isOwner ? 600 : 400,
              direction: _isOwner ? "ltr" : "rtl",
              textAlign: _isOwner ? "center" : "right",
              fontFamily: _isOwner ? "inherit" : "'Segoe UI',Tahoma,Arial,sans-serif",
              background: _isOwner ? "transparent" : `${theme.primary}08`,
              borderRadius: _isOwner ? 0 : 12,
              padding: _isOwner ? 0 : "14px 18px",
              border: _isOwner ? "none" : `1px solid ${theme.primary}20`
            }}>
              {_isOwner ? ROLE_WELCOME["owner"] : _arabicMsg}
            </div>

            {/* Role badge for non-owner */}
            {!_isOwner && (
              <div style={{ fontSize:11, color:theme.textMuted, marginBottom:16,
                display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <span style={{ background:ROLE_COLORS[currentRole]+"22",
                  color:ROLE_COLORS[currentRole], borderRadius:20, padding:"3px 10px",
                  fontWeight:700 }}>
                  {ROLE_ICONS[currentRole]} {currentRole}
                </span>
                <span>·</span>
                <span>{ROLE_WELCOME[currentRole]}</span>
              </div>
            )}

            <button onClick={()=>{
              setShowTip(false);
              // Mark as returning user
              setLastLoginDate(currentName);
            }}
              style={{
                background: _isOwner
                  ? "linear-gradient(135deg,#B45309,#FFD700,#B45309)"
                  : `linear-gradient(135deg,${theme.primary},${theme.primaryHover})`,
                color: _isOwner ? "#1A0A00" : "#fff",
                border:"none", borderRadius:12,
                padding:"13px 44px", fontSize:15, cursor:"pointer", fontWeight:800,
                boxShadow: _isOwner
                  ? "0 4px 20px rgba(255,215,0,0.4)"
                  : `0 4px 16px ${theme.primary}60`,
                letterSpacing:0.5 }}>
              {_isOwner ? "Enter Master Console 👁️" : _isFirstTime ? "سمّ الله وانطلق! 🚀" : "يلا نبدأ! ✨"}
            </button>
          </div>
        </div>
        );
      })()}
    </div>
  );
}




